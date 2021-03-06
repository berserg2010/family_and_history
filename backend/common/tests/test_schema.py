import pytest
from mixer.backend.django import mixer
from graphql_jwt.testcases import JSONWebTokenClient
from django.contrib.auth import get_user_model

from person_app.person.models import Person
from family_app.family.models import Family
from . import queries


pytestmark = pytest.mark.django_db


class TestObjApi:

    @pytest.mark.parametrize('obj, query', [(Person, 'allPersons'), (Family, 'allFamilies')])
    @pytest.mark.parametrize('client_fixture, errors', [
        ('client', 'You do not have permission to perform this action'),
        ('client_register', None),
    ])
    def test_get_all_obj(self, obj, query, client_fixture, errors, request):

        mixer.cycle(2).blend(obj)

        client = request.getfixturevalue(client_fixture)
        result = client.execute(query=queries.all_obj(query))

        if client_fixture == 'client':
            assert result.errors
            assert len(result.errors) == 1
            assert result.errors[0].message == errors
        else:
            assert not result.errors
            assert len(result.data.get(query)) == 2
    

    @pytest.mark.parametrize('obj, query', [
        (Person, 'person'), (Person, 'deletePerson'),
        (Family, 'family'), (Family, 'deleteFamily'),
    ])
    @pytest.mark.parametrize('client_fixture, data, errors', [
        ('client', {'id': None}, 'Variable "$id" of required type "ID!" was not provided.'),
        ('client', {'id': 21}, 'You do not have permission to perform this action'),
        ('client', {'id': 12}, 'You do not have permission to perform this action'),
        
        ('client_register', {'id': None}, 'Variable "$id" of required type "ID!" was not provided.'),
        ('client_register', {'id': 21}, 'Please enter a valid id'),
        ('client_register', {'id': 12}, None),
    ])
    def test_get_obj_and_delete_obj_mutation(self, obj, query, client_fixture, data, errors, request):

        mixer.blend(obj, pk=12)
        
        client = request.getfixturevalue(client_fixture)
        result = client.execute(query=queries.obj(query), variables=data)

        if client_fixture == 'client_register' and data.get('id') == 12:
            assert not result.errors
            assert result.data.get(query)['id'] == data.get('id') or str(data.get('id'))
        else:
            assert result.errors
            assert len(result.errors) == 1
            assert result.errors[0].message == errors


    @pytest.mark.parametrize('obj, query', [(Person, 'createPerson'), (Family, 'createFamily')])
    @pytest.mark.parametrize('client_fixture, data, errors', [
        ('client', None, 'You do not have permission to perform this action'),
        ('client', {'data': {'note': ':)'}}, 'You do not have permission to perform this action'),
        
        ('client_register', None, None),
        ('client_register', {'data': {'note': ':)'}}, None),
    ])
    def test_create_obj_mutation(self, obj, query, client_fixture, data, errors, request):

        client = request.getfixturevalue(client_fixture)
        result = client.execute(query=queries.create_obj(query), variables=data)

        obj_id = result.data is not None and result.data.get(query) and result.data.get(query)[query[len('create'):].lower()]['id']

        if client_fixture == 'client_register' and obj_id:
            assert not result.errors
            instance = obj.objects.get(pk=obj_id)
            assert instance.note == (data.get('data')['note'] if data else '')
            assert instance.submitter
            assert instance.changer
        else:
            assert result.errors
            assert len(result.errors) == 1
            assert result.errors[0].message == errors


    @pytest.mark.parametrize('obj, query', [(Person, 'updatePerson'), (Family, 'updateFamily')])
    @pytest.mark.parametrize('client_fixture, data, errors', [
        ('client', None, 'Variable "$id" of required type "ID!" was not provided.'),
        ('client', {'id': None, 'data': {'note': ''}}, 'Variable "$id" of required type "ID!" was not provided.'),
        ('client', {'id': 21, 'data': None}, 'Variable "$data" of required type'),
        ('client', {'id': 21, 'data': {'note': ':)'}}, 'You do not have permission to perform this action'),
        ('client', {'id': 12, 'data': {'note': ''}}, 'You do not have permission to perform this action'),
        ('client', {'id': 12, 'data': {'note': ':)'}}, 'You do not have permission to perform this action'),
        
        ('client_register', None, 'Variable "$id" of required type "ID!" was not provided.'),
        ('client_register', {'id': None, 'data': {'note': ''}}, 'Variable "$id" of required type "ID!" was not provided.'),
        ('client_register', {'id': 21, 'data': None}, 'Variable "$data" of required type'),
        ('client_register', {'id': 21, 'data': {'note': ':)'}}, 'Please enter a valid id'),
        ('client_register', {'id': 12, 'data': {'note': ''}}, None),
        ('client_register', {'id': 12, 'data': {'note': ':)'}}, None),
    ])
    def test_update_obj_mutation(self, obj, query, client_fixture, data, errors, request):

        mixer.blend(obj, pk=12, note=':(', submitter=mixer.blend(get_user_model()), changer=mixer.blend(get_user_model()))

        client = request.getfixturevalue(client_fixture)
        result = client.execute(query=queries.update_obj(query), variables=data)

        if client_fixture == 'client_register' and errors is None:
            assert not result.errors
            instance = obj.objects.get(pk=12)
            assert instance.note == (data.get('data')['note'] if data else '')
            assert instance.submitter
            assert instance.changer
        else:
            assert result.errors
            assert len(result.errors) == 1
            assert errors in result.errors[0].message
