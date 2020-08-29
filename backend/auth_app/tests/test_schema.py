import pytest
from django.contrib.auth import get_user_model
from mixer.backend.django import mixer

from .. import schema
from . import queries


pytestmark = pytest.mark.django_db


user = {'email': 'petrov@gmail.ru', 'password': '1234'}

class TestUser:
    
    def test_user_type(self):
        instance = schema.UserType()
        assert instance
    

    @pytest.mark.parametrize('password', ['', '1234'])
    def test_no_valid_data_auth(self, password, client):
        result = client.execute(queries.TOKEN_AUTH, variables={'email': 'petrov@gmail.ru', 'password': password})
        assert result.errors


    def test_signup_user(self, client):
        result = client.execute(
            query=queries.SIGNUP_USER, 
            variables=user
        )

        tkn1 = result.data.get('tokenAuth')['token']
        assert not result.errors
        assert get_user_model().objects.count() == 1, 'Should return ones user'


        result = client.execute(queries.TOKEN_AUTH, variables=user)
        assert not result.errors
        assert result.data.get('tokenAuth')['token'] == tkn1

        result = client.execute(queries.CURRENT_USER)
        assert result.data.get('currentUser') is None

        client.authenticate(get_user_model().objects.get(email=user['email']))
        result = client.execute(queries.CURRENT_USER)
        assert result.data.get('currentUser')['email'] == user['email']


    def test_resolve_all_users(self, client):
        mixer.blend(get_user_model())
        mixer.blend(get_user_model())

        result = client.execute(queries.ALL_USERS)
        assert len(result.data.get('allUsers')) == 2, 'Should return all users'
