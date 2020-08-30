import pytest
from mixer.backend.django import mixer
from graphql_jwt.testcases import JSONWebTokenClient
from abc import ABC
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser

from person_app.person import schema
from person_app.person.models import Person
from . import queries


pytestmark = pytest.mark.django_db


def test_person_type():
    instance = schema.PersonType()
    assert instance


@pytest.mark.usefixtures('create_superuser')
class TestPersonAPI:

    def test_get_all_persons(self, client, client_register):
        mixer.blend(Person)
        mixer.blend(Person)
        result = client.execute(query=queries.ALL_PERSONS)
        assert result.errors

        result = client_register().execute(query=queries.ALL_PERSONS)
        assert not result.errors
        assert len(result.data.get('allPersons')) == 2, 'Should return all persons'
    

    def test_get_person(self, client, client_register):
        person = mixer.blend(Person)
        result = client.execute(query=queries.PERSON, variables={'id': person.pk})
        assert result.errors
        
        result = client_register().execute(query=queries.PERSON, variables={'id': person.pk})
        assert not result.errors
        assert result.data.get('person')['id'] == str(person.pk)
    

    @pytest.mark.parametrize('data, correct_value', [
        ({'data': {'id': 12, 'note': ':('}}, 400),
        ({'data': {'id': None, 'note': ':)'}}, 201),
    ])
    def test_create_person_mutation(self, data, correct_value, client, client_register):
        result = client.execute(query=queries.CREATE_PERSON, variables=data)
        assert not result.errors
        assert result.data.get('createPerson')['status'] == 401

        result = client_register().execute(query=queries.CREATE_PERSON, variables=data)
        assert not result.errors
        assert result.data.get('createPerson')['status'] == correct_value

        if result.data.get('createPerson')['status'] == 201:
            person_id = result.data.get('createPerson')['person']['id']
            person = Person.objects.get(pk=person_id)
            assert person.note == data.get('data')['note']


class BaseClass(ABC):

    def test_delete_person_mutation(self):
        person = mixer.blend(Person)

        if not self.user.is_authenticated:
            result = self.client.execute(
                query=queries.DELETE_PERSON,
                variables={'id': person.pk}
            )
            assert not result.errors
            assert result.data.get('deletePerson')['status'] == 403, 'Should return 403 if user is not logged in'
        else:
            result = self.client.execute(query=queries.DELETE_PERSON)
            assert result.errors

            result = self.client.execute(query=queries.DELETE_PERSON, variables={'id': person.pk})
            assert not result.errors
            assert result.data.get('deletePerson')['status'] == 200, 'Should return 200 if mutation is successful'


class TestAnonymousClient(BaseClass):
    @classmethod
    def setup(cls):
        cls.client = JSONWebTokenClient()
        cls.user = AnonymousUser()


class TestAuthenticationClient(BaseClass):
    @classmethod
    def setup(cls):
        cls.client = JSONWebTokenClient()
        cls.user = mixer.blend(get_user_model())

        cls.client.authenticate(cls.user)
