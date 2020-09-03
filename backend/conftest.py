import pytest
from mixer.backend.django import mixer
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from graphql_jwt.testcases import JSONWebTokenClient

from common.utils import root_auth


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
        return create_user(root_auth)
    return _create_superuser


@pytest.fixture
def client():
    return JSONWebTokenClient()


@pytest.fixture
def client_register(client, create_superuser):
    client.authenticate(create_superuser())
    return client
