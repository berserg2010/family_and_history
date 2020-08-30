import pytest
from mixer.backend.django import mixer

from ..models import Person


pytestmark = pytest.mark.django_db


# Person
class TestPerson:

    def test_person(self):
        assert mixer.blend(Person)
