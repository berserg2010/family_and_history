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


check_data = [
    ('client', {'id': None}, 'Variable "$id" of required type "ID!" was not provided.'),
    ('client', {'id': 21}, 'You do not have permission to perform this action'),
    ('client', {'id': 12}, 'You do not have permission to perform this action'),
    ('client_register', {'id': None}, 'Variable "$id" of required type "ID!" was not provided.'),
    ('client_register', {'id': 21}, 'Please enter a valid id'),
    ('client_register', {'id': 12}, None),
]


def test_person_type():
    instance = schema.PersonType()
    assert instance


@pytest.mark.usefixtures('create_superuser')
class TestPersonAPI:

    @pytest.mark.parametrize('client_fixture, errors', [
        ('client', 'You do not have permission to perform this action'),
        ('client_register', None),
    ])
    def test_get_all_persons(self, client_fixture, errors, request):

        mixer.blend(Person)
        mixer.blend(Person)

        client = request.getfixturevalue(client_fixture)
        result = client.execute(query=queries.ALL_PERSONS)

        if client_fixture == 'client':
            assert result.errors
            assert len(result.errors) == 1
            assert result.errors[0].message == errors
        else:
            assert not result.errors
            assert len(result.data.get('allPersons')) == 2, 'Should return all persons'


    @pytest.mark.parametrize('schema, query', [('PERSON', 'person'), ('DELETE_PERSON', 'deletePerson')])
    @pytest.mark.parametrize('client_fixture, data, errors', check_data)
    def test_get_person_and_delete_person_mutation(self, schema, query, client_fixture, data, errors, request):

        mixer.blend(Person, pk=12)
        
        client = request.getfixturevalue(client_fixture)
        result = client.execute(query=getattr(queries, schema), variables=data)

        if client_fixture == 'client_register' and data.get('id') == 12:
            assert not result.errors
            assert result.data.get(query)['id'] == data.get('id') or str(data.get('id'))
        else:
            assert result.errors
            assert len(result.errors) == 1
            assert result.errors[0].message == errors
    
    
    @pytest.mark.parametrize('client_fixture, data, errors', [
        ('client', {'data': {'id': None, 'note': ':('}}, 'You do not have permission to perform this action'),
        ('client', {'data': {'id': 21, 'note': ':('}}, 'You do not have permission to perform this action'),
        ('client', {'data': {'id': 12, 'note': ':('}}, 'You do not have permission to perform this action'),
        ('client_register', {'data': {'id': None, 'note': ':('}}, None),
        ('client_register', {'data': {'id': 21, 'note': ':('}}, 'Please enter a valid id'),
        ('client_register', {'data': {'id': 12, 'note': ':('}}, None),
    ])
    def test_create_and_update_person_mutation(self, client_fixture, data, errors, request):

        data_id = data.get('data')['id']
        client = request.getfixturevalue(client_fixture)

        result = client.execute(query=queries.CREATE_PERSON, variables=data)

        if client_fixture == 'client_register' and data_id is None:
            assert not result.errors
            person_id = result.data.get('createPerson')['person']['id']
            person = Person.objects.get(pk=person_id)
            assert person.note == data.get('data')['note']
        else:
            assert result.errors
            assert len(result.errors) == 1
            if client_fixture == 'client_register' and data_id == 12:
                assert result.errors[0].message == 'Please enter a valid id'
            else:
                assert result.errors[0].message == errors

        mixer.blend(Person, pk=12)

        result = client.execute(query=queries.CREATE_PERSON, variables=data)

        if client_fixture == 'client_register' and (data_id == 12 or data_id is None):
            assert not result.errors
            person_id = result.data.get('createPerson')['person']['id']
            person = Person.objects.get(pk=person_id)
            assert person.note == data.get('data')['note']
        else:
            assert result.errors
            assert len(result.errors) == 1
            assert result.errors[0].message == errors
