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
