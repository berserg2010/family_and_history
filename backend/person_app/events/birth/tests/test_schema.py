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


id_none = {'id': None}
id_invalid = {'id': 21}
id_valid = {'id': 12}

person_id_none = {'personId': None}
person_id_invalid = {'personId': 21}
person_id_valid = {'personId': 12}

birth_empty = {
    'gender': '',
    'givname': '',
    'surname': '',
    'note': '',
}
birth_full = {
    'gender': 'M',
    'givname': 'Ivan',
    'surname': 'Ivanov',
    'note': ':))',
}

datetime_none = {'datetime': {}}
datetime_empty = {
    'datetime': {
        'year': None,
        'month': None,
        'day': None,
        'hour': None,
        'minute': None,
    }}
datetime_full = {
    'datetime': {
        'day': 15,
        'hour': 12,
        'minute': 30,
        'month': 6,
        'year': 2000,
    }}

data_empty = {
    **birth_empty,
    **datetime_none,
}
data_full = {
    **birth_full,
    **datetime_full,
}


check_data = [
    ('client', id_none, 'Variable "$id" of required type "ID!" was not provided.'),
    ('client', id_invalid, 'You do not have permission to perform this action'),
    ('client', id_valid, 'You do not have permission to perform this action'),
    ('client_register', id_none, 'Variable "$id" of required type "ID!" was not provided.'),
    ('client_register', id_invalid, 'Please enter a valid id'),
    ('client_register', id_valid, None),
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
        ('client', person_id_invalid, 'You do not have permission to perform this action'),
        ('client', person_id_valid, 'You do not have permission to perform this action'),
        ('client_register', None, None),
        ('client_register', person_id_invalid, 'Please enter a valid id'),
        ('client_register', person_id_valid, None),
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
            assert errors in result.errors[0].message
    

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


    @pytest.mark.parametrize('client_fixture, data, errors', [
        ('client', {'data': None}, 'Variable "$data" of required type "BirthInput!" was not provided.'),
        ('client', {'data': {**person_id_none, **data_full}}, 'In field "personId": Expected "ID!", found null.'),
        ('client', {'data': {**person_id_invalid, **data_full}}, 'You do not have permission to perform this action'),
        ('client_register', {'data': None}, 'Variable "$data" of required type "BirthInput!" was not provided.'),
        ('client_register', {'data': {**person_id_none, **data_full}}, 'In field "personId": Expected "ID!", found null.'),
        ('client_register', {'data': {**person_id_invalid, **data_full}}, 'Please enter a valid person_id'),
        ('client_register', {'data': {**person_id_valid, **data_empty}}, None),
    ])
    def test_create_birth_mutation(self, client_fixture, data, errors, request):

        client = request.getfixturevalue(client_fixture)
        result = client.execute(query=queries.CREATE_BIRTH, variables=data)

        birth_id = result.data is not None and result.data.get('createBirth') and result.data.get('createBirth')['birth']['id']

        if errors:
            assert result.errors
            assert len(result.errors) == 1
            assert errors in result.errors[0].message
        
        mixer.blend(Person, pk=12)

        result = client.execute(query=queries.CREATE_BIRTH, variables=data)

        birth_id = result.data is not None and result.data.get('createBirth') and result.data.get('createBirth')['birth']['id']

        if client_fixture == 'client_register' and birth_id:
            assert not result.errors
            birth = Birth.objects.get(pk=birth_id)
            data_ = data.get('data')
            assert birth.gender == data_['gender'] if data_ else 'U'
            assert birth.givname == data_['givname'] if data_ else ''
            assert birth.surname == data.get('data')['surname']
            assert birth.datetime == data.get('data')['datetime']
            assert birth.note == data.get('data')['note']
            assert birth.submitter
            assert birth.changer


    @pytest.mark.parametrize('client_fixture, data, errors', [
        ('client', {**id_none, 'data': {**person_id_valid, **data_full}}, 'Variable "$id" of required type "ID!" was not provided.'),
        ('client', {**id_valid, 'data': {**person_id_none, **data_full}}, 'In field "personId": Expected "ID!", found null.'),
        ('client', {**id_invalid, 'data': {**person_id_valid, **data_full}}, 'You do not have permission to perform this action'),
        ('client', {**id_valid, 'data': {**person_id_invalid, **data_full}}, 'You do not have permission to perform this action'),
        ('client', {**id_valid, 'data': {**person_id_valid, **data_empty}}, 'You do not have permission to perform this action'),
        ('client', {**id_valid, 'data': {**person_id_valid, **data_full}}, 'You do not have permission to perform this action'),

        ('client_register', {**id_none, 'data': {**person_id_valid, **data_full}}, 'Variable "$id" of required type "ID!" was not provided.'),
        ('client_register', {**id_valid, 'data': {**person_id_none, **data_full}}, 'In field "personId": Expected "ID!", found null.'),
        ('client_register', {**id_invalid, 'data': {**person_id_valid, **data_full}}, 'Please enter a valid id'),
        ('client_register', {**id_valid, 'data': {**person_id_invalid, **data_full}}, 'Please enter a valid person_id'),
        ('client_register', {**id_valid, 'data': {**person_id_valid, **data_empty}}, None),
        ('client_register', {**id_valid, 'data': {**person_id_valid, **data_full}}, None),
    ])
    def test_update_birth_mutation(self, client_fixture, data, errors, request):

        mixer.blend(Person, pk=12)
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
            assert errors in result.errors[0].message


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
