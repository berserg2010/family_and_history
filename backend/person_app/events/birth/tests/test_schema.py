import pytest
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from mixer.backend.django import mixer
from graphql_jwt.testcases import JSONWebTokenClient
from abc import ABC

from .. import schema
from person_app.models import Person, Birth
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

@pytest.fixture
def create_obj_for_search():
    for value in ['a', 'ab', 'abc']:
        Birth.objects.create(
            person=mixer.blend(Person),
            surname=value,
        )


def test_birth_type():
    instance = schema.BirthType()
    assert instance


@pytest.mark.usefixtures('create_superuser')
class TestBirthAPI:
    
    @pytest.mark.parametrize('client_fixture, data, errors', [
        ('client', None, 'You do not have permission to perform this action'),
        ('client', {'personId': 21}, 'You do not have permission to perform this action'),
        ('client', {'personId': 12}, 'You do not have permission to perform this action'),
        ('client_register', None, None),
        ('client_register', {'personId': 21}, 'Please enter a valid id'),
        ('client_register', {'personId': 12}, None),
    ])
    def test_get_all_births(self, client_fixture, data, errors, request):

        person = mixer.blend(Person, pk=12)
        mixer.blend(Birth)
        mixer.blend(Birth, person=person)
        mixer.blend(Birth, person=person)

        client = request.getfixturevalue(client_fixture)
        result = client.execute(query=queries.ALL_BIRTH, variables=data)

        if client_fixture == 'client_register' and (data is None or data.get('personId') == 12):
            assert not result.errors
            assert len(result.data.get('allBirths')) == 2 if data else 3

        else:
            assert result.errors
            assert len(result.errors) == 1
            assert result.errors[0].message == errors
    

    @pytest.mark.parametrize('schema, query', [('BIRTH', 'birth'), ('DELETE_BIRTH', 'deleteBirth')])
    @pytest.mark.parametrize('client_fixture, data, errors', check_data)
    def test_get_birth_and_delete_birth_mutation(self, schema, query, client_fixture, data, errors, request):

        mixer.blend(Birth, pk=12)
        
        client = request.getfixturevalue(client_fixture)
        result = client.execute(query=getattr(queries, schema), variables=data)

        if client_fixture == 'client_register' and data.get('id') == 12:
            assert not result.errors
            assert result.data.get(query)['id'] == data.get('id') or str(data.get('id'))
        else:
            assert result.errors
            assert len(result.errors) == 1
            assert result.errors[0].message == errors


    data_create_birth_empty = {
        'data': {
            'gender': '',
            'givname': '',
            'surname': '',
            'note': '',

            'datetime': {}
        }
    }
    data_create_birth_full = {
        'data': {
            'gender': 'M',
            'givname': 'Иван',
            'surname': 'Иванов',
            'note': ':))',

            'datetime': {
                'year': 2000,
                'month': 6,
                'day': 15,
                'hour': 12,
                'minute': 30,
            }
        }
    }

    @pytest.mark.parametrize('client_fixture, data, errors', [
        ('client', None, 'Variable "$data" of required type "BirthInput!" was not provided.'),
        ('client', data_create_birth_empty, 'You do not have permission to perform this action'),
        ('client', data_create_birth_full, 'You do not have permission to perform this action'),
        ('client_register', None, 'Variable "$data" of required type "BirthInput!" was not provided.'),
        ('client_register', data_create_birth_empty, 'Please enter data'),
        ('client_register', data_create_birth_full, None),
    ])
    def test_create_birth_mutation(self, client_fixture, data, errors, request):
        
        client = request.getfixturevalue(client_fixture)
        result = client.execute(query=queries.CREATE_BIRTH, variables=data)

        birth_id = result.data is not None and result.data.get('createBirth') and result.data.get('createBirth')['birth']['id']

        if client_fixture == 'client_register' and birth_id:
            assert not result.errors
            birth = Birth.objects.get(pk=birth_id)
            assert birth.gender == data.get('data')['gender']
            assert birth.givname == data.get('data')['givname']
            assert birth.surname == data.get('data')['surname']
            assert birth.datetime == data.get('data')['datetime']
            assert birth.note == data.get('data')['note']
            assert birth.submitter
            assert birth.changer
        else:
            assert result.errors
            assert len(result.errors) == 1
            assert result.errors[0].message == errors


    data_update_birth_empty = {
        'data': {
            'id': 12,
            'gender': '',
            'givname': '',
            'surname': '',
            'note': '',

            'datetime': {}
        }
    }
    data_update_birth_invalid_id = {
        'data': {
            'id': 21,
            'gender': 'M',
            'givname': 'Иван',
            'surname': 'Иванов',
            'note': ':))',

            'datetime': {
                'year': 2000,
                'month': 6,
                'day': 15,
                'hour': 12,
                'minute': 30,
            }
        }
    }
    data_update_birth_full = {
        'data': {
            'id': 12,
            'gender': 'M',
            'givname': 'Иван',
            'surname': 'Иванов',
            'note': ':))',

            'datetime': {
                'year': 2000,
                'month': 6,
                'day': 15,
                'hour': 12,
                'minute': 30,
            }
        }
    }

    @pytest.mark.parametrize('client_fixture, data, errors', [
        ('client', None, 'Variable "$data" of required type "BirthInput!" was not provided.'),
        ('client', data_update_birth_empty, 'You do not have permission to perform this action'),
        ('client', data_update_birth_invalid_id, 'You do not have permission to perform this action'),
        ('client', data_update_birth_full, 'You do not have permission to perform this action'),
        ('client_register', None, 'Variable "$data" of required type "BirthInput!" was not provided.'),
        ('client_register', data_update_birth_empty, 'Please enter data'),
        ('client_register', data_update_birth_invalid_id, 'Please enter a valid id'),
        ('client_register', data_update_birth_full, None),
    ])
    def test_update_birth_mutation(self, client_fixture, data, errors, request):
        
        mixer.blend(Birth, pk=12, submitter=mixer.blend(get_user_model()))

        client = request.getfixturevalue(client_fixture)
        result = client.execute(query=queries.UPDATE_BIRTH, variables=data)

        if client_fixture == 'client_register' and errors is None:
            assert not result.errors
            birth = Birth.objects.get(pk=12)
            assert birth.gender == data.get('data')['gender']
            assert birth.givname == data.get('data')['givname']
            assert birth.surname == data.get('data')['surname']
            assert birth.datetime == data.get('data')['datetime']
            assert birth.note == data.get('data')['note']
            assert birth.submitter
            assert birth.changer
        else:
            assert result.errors
            assert len(result.errors) == 1
            assert result.errors[0].message == errors


    @pytest.mark.usefixtures('create_obj_for_search')
    @pytest.mark.parametrize('client_fixture, data, correct_value, errors', [
        ('client', {'searchTerm': 'a'}, 3, 'You do not have permission to perform this action'),
        ('client_register', {'searchTerm': 'a'}, 3, None),
        ('client_register', {'searchTerm': 'ab'}, 2, None),
        ('client_register', {'searchTerm': 'abc'}, 1, None),
        ('client_register', {'searchTerm': 'abcd'}, 0, None),
    ])
    def test_search_birth(self, client_fixture, data, correct_value, errors, request):

        client = request.getfixturevalue(client_fixture)
        result = client.execute(queries.SEARCH_BIRTH, variables=data)

        if client_fixture == 'client_register' and errors is None:
            assert not result.errors
            assert len(result.data.get('searchBirth')) == correct_value
        else:
            assert result.errors[0].message == errors


    @pytest.mark.parametrize('client_fixture, data, correct_value, errors', [
        ('client', {'id': 12}, 3, 'You do not have permission to perform this action'),
        ('client_register', {'id': 12}, 1, None),
    ])
    def test_like_birth(self, client_fixture, data, correct_value, errors, request):
        birth = mixer.blend(Birth, pk=12)

        client = request.getfixturevalue(client_fixture)
        result = client.execute(queries.LIKE_BIRTH, variables=data)

        if client_fixture == 'client_register' and errors is None:
            assert not result.errors
            assert birth.likes == correct_value

        else:
            assert result.errors[0].message == errors
