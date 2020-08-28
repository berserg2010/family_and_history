import pytest
from django.contrib.auth import get_user_model
from graphql_jwt.testcases import JSONWebTokenClient


pytestmark = pytest.mark.django_db



@pytest.fixture
def client():
    return JSONWebTokenClient()
