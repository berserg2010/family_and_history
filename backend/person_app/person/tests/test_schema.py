import pytest
from mixer.backend.django import mixer
from graphql_jwt.testcases import JSONWebTokenClient
from django.contrib.auth import get_user_model

from person_app.person.models import Person
from person_app.person.schema import PersonType
from . import queries


pytestmark = pytest.mark.django_db


def test_person_type():
    instance = PersonType()
    assert instance


@pytest.mark.usefixtures('create_superuser')
class TestPersonAPI:

    # @pytest.mark.parametrize('client_fixture, errors', [
    #     ('client', 'You do not have permission to perform this action'),
    #     ('client_register', None),
    # ])
    # def test_get_all_persons(self, client_fixture, errors, request):

    #     mixer.blend(Person)
    #     mixer.blend(Person)

    #     client = request.getfixturevalue(client_fixture)
    #     result = client.execute(query=queries.ALL_PERSONS)

    #     if client_fixture == 'client':
    #         assert result.errors
    #         assert len(result.errors) == 1
    #         assert result.errors[0].message == errors
    #     else:
    #         assert not result.errors
    #         assert len(result.data.get('allPersons')) == 2


    # @pytest.mark.parametrize('schema, query', [('PERSON', 'person'), ('DELETE_PERSON', 'deletePerson')])
    # @pytest.mark.parametrize('client_fixture, data, errors', [
    #     ('client', {'id': None}, 'Variable "$id" of required type "ID!" was not provided.'),
    #     ('client', {'id': 21}, 'You do not have permission to perform this action'),
    #     ('client', {'id': 12}, 'You do not have permission to perform this action'),
        
    #     ('client_register', {'id': None}, 'Variable "$id" of required type "ID!" was not provided.'),
    #     ('client_register', {'id': 21}, 'Please enter a valid id'),
    #     ('client_register', {'id': 12}, None),
    # ])
    # def test_get_person_and_delete_person_mutation(self, schema, query, client_fixture, data, errors, request):

    #     mixer.blend(Person, pk=12)
        
    #     client = request.getfixturevalue(client_fixture)
    #     result = client.execute(query=getattr(queries, schema), variables=data)

    #     if client_fixture == 'client_register' and data.get('id') == 12:
    #         assert not result.errors
    #         assert result.data.get(query)['id'] == data.get('id') or str(data.get('id'))
    #     else:
    #         assert result.errors
    #         assert len(result.errors) == 1
    #         assert result.errors[0].message == errors
    
    
    # @pytest.mark.parametrize('client_fixture, data, errors', [
    #     ('client', None, 'You do not have permission to perform this action'),
    #     ('client', {'data': {'note': ':)'}}, 'You do not have permission to perform this action'),
        
    #     ('client_register', None, None),
    #     ('client_register', {'data': {'note': ':)'}}, None),
    # ])
    # def test_create_person_mutation(self, client_fixture, data, errors, request):

    #     client = request.getfixturevalue(client_fixture)
    #     result = client.execute(query=queries.CREATE_PERSON, variables=data)

    #     person_id = result.data is not None and result.data.get('createPerson') and result.data.get('createPerson')['person']['id']

    #     if client_fixture == 'client_register' and person_id:
    #         assert not result.errors
    #         person = Person.objects.get(pk=person_id)
    #         assert person.note == (data.get('data')['note'] if data else '')
    #         assert person.submitter
    #         assert person.changer
    #     else:
    #         assert result.errors
    #         assert len(result.errors) == 1
    #         assert result.errors[0].message == errors


    @pytest.mark.parametrize('client_fixture, data, errors', [
        ('client', None, 'Variable "$id" of required type "ID!" was not provided.'),
        ('client', {'id': None, 'data': {'note': ''}}, 'Variable "$id" of required type "ID!" was not provided.'),
        ('client', {'id': 21, 'data': None}, 'Variable "$data" of required type "PersonInput!" was not provided.'),
        ('client', {'id': 21, 'data': {'note': ':)'}}, 'You do not have permission to perform this action'),
        ('client', {'id': 12, 'data': {'note': ''}}, 'You do not have permission to perform this action'),
        ('client', {'id': 12, 'data': {'note': ':)'}}, 'You do not have permission to perform this action'),
        
        ('client_register', None, 'Variable "$id" of required type "ID!" was not provided.'),
        ('client_register', {'id': None, 'data': {'note': ''}}, 'Variable "$id" of required type "ID!" was not provided.'),
        ('client_register', {'id': 21, 'data': None}, 'Variable "$data" of required type "PersonInput!" was not provided.'),
        ('client_register', {'id': 21, 'data': {'note': ':)'}}, 'Please enter a valid id'),
        ('client_register', {'id': 12, 'data': {'note': ''}}, None),
        ('client_register', {'id': 12, 'data': {'note': ':)'}}, None),
    ])
    def test_update_person_mutation(self, client_fixture, data, errors, request):

        mixer.blend(Person, pk=12, note=':(', submitter=mixer.blend(get_user_model()), changer=mixer.blend(get_user_model()))

        client = request.getfixturevalue(client_fixture)
        result = client.execute(query=queries.UPDATE_PERSON, variables=data)

        if client_fixture == 'client_register' and errors is None:
            assert not result.errors
            person = Person.objects.get(pk=12)
            assert person.note == (data.get('data')['note'] if data else '')
            assert person.submitter
            assert person.changer
        else:
            assert result.errors
            assert len(result.errors) == 1
            assert result.errors[0].message == errors
