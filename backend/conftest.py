import pytest
from mixer.backend.django import mixer
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from graphql_jwt.testcases import JSONWebTokenClient


pytestmark = pytest.mark.django_db


@pytest.fixture
def create_user():
    def _create_user(user_data):
        return mixer.blend(
            get_user_model(),
            email=user_data.get('email'),
            first_name=user_data.get('first_name'),
            last_name=user_data.get('last_name'),
            password=make_password(user_data.get('password')),
        )
    return _create_user


@pytest.fixture(autouse=True)
def create_superuser(create_user):
    def _create_superuser():
        return create_user(ParameterStorage.root_auth)
    return _create_superuser


@pytest.fixture
def client():
    return JSONWebTokenClient()


@pytest.fixture
def client_register(client, create_superuser):
    client.authenticate(create_superuser())
    return client


@pytest.fixture
def create_obj_for_search():
    def _create_obj_for_search(obj):
        for value in ['a', 'ab', 'abc']:
            obj.objects.create(
                surname=value,
            )
    return _create_obj_for_search


class ParameterStorage:

    root_auth = {
        'email': 'root@asdfasdf.com',
        'first_name': 'first_name',
        'last_name': 'last_name',
        'password': 'lkasdjlkasdflaksdjf',
    }

    id_none = {'id': None}
    id_invalid = {'id': 21}
    id_valid = {'id': 12}

    person_id_none = {'personId': None}
    person_id_invalid = {'personId': 21}
    person_id_valid = {'personId': 12}

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
