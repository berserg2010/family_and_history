import pytest
from mixer.backend.django import mixer
from graphql_jwt.testcases import JSONWebTokenClient
from django.contrib.auth import get_user_model

from abc import ABC

from django.contrib.auth.models import AnonymousUser

from person_app.models import Birth
from family_app.family.models import Family, Child
from family_app.events.marriage.models import Marriage
from family_app.family.schema import FamilyType, ChildType
from . import queries


pytestmark = pytest.mark.django_db


def test_family_type():
    instance = FamilyType()
    assert instance


def test_child_type():
    instance = ChildType()
    assert instance


@pytest.mark.skip()
class BaseClass(ABC):

    def test_all_child(self):
        mixer.blend(Child)
        family = mixer.blend(Family)
        child1 = mixer.blend(Child)
        child1.family = family
        child1.save()
        child2 = mixer.blend(Child)
        child2.family = family
        child2.save()
        result = self.client.execute(query=queries.ALL_CHILD)
        assert len(result.data.get('allChild')) == 3, 'Should return all Child'

        result = self.client.execute(query=queries.ALL_CHILD, variables={"idFamily": family.pk})
        assert not result.errors
        assert len(result.data.get('allChild')) == 2, 'Should return 2 Child'


    def test_child(self):
        child = mixer.blend(Child)
        result = self.client.execute(
            query=queries.CHILD,
            variables={'id': child.pk}
        )
        assert not result.errors
        assert result.data.get('child')['id'] == str(child.pk)


    def test_save_child_mutation(self):
        child = mixer.blend(Child)
        family = mixer.blend(Family)
        birth = mixer.blend(Birth)

        data = [
            {
                'id': None,
                'idFamily': family.pk,
                'idBirth': birth.pk,
                'reltofath': 'B',
                'reltomoth': 'B',
                'childnbrfath': 1,
                'childnbrmoth': 1,
            },
            {
                'id': child.pk,
                'idFamily': family.pk,
                'idBirth': birth.pk,
                'reltofath': 'B',
                'reltomoth': 'B',
                'childnbrfath': 1,
                'childnbrmoth': 1,
            },
        ]

        for i in data:
            VARIABLE = {
                "data": i,
            }

            result = self.client.execute(
                query=queries.SAVE_CHILD,
                variables=VARIABLE,
            )
            assert not result.errors

            if not self.user.is_authenticated:
                assert result.data.get('saveChild')['status'] == 403, 'Should return 403 if user is not logged in'
            else:
                assert result.data.get('saveChild')['status'] == 200, 'Should return 200 if mutation is successful'
                id_child = int(result.data.get('saveChild')['child']['id'])
                child = Child.objects.get(pk=id_child)
                assert child.family.pk == VARIABLE.get('data')['idFamily']


    def test_delete_child_mutation(self):
        family = mixer.blend(Family)
        birth = mixer.blend(Birth)
        child = Child.objects.create(
            family=family,
            birth=birth,
        )

        if not self.user.is_authenticated:
            result = self.client.execute(query=queries.DELETE_CHILD, variables={'id': child.pk})
            assert not result.errors
            assert Child.objects.all().count() == 1
            assert result.data.get('deleteChild')['status'] == 403, 'Should return 403 if user is not logged in'
        else:
            result = self.client.execute(query=queries.DELETE_CHILD)
            assert result.errors
            assert Child.objects.all().count() == 1

            result = self.client.execute(query=queries.DELETE_CHILD, variables={'id': child.pk})
            assert not result.errors
            assert Child.objects.all().count() == 0
            assert result.data.get('deleteChild')['status'] == 200, 'Should return 200 if mutation is successful'
            assert Family.objects.all().count() == 1
            assert Birth.objects.all().count() == 1


class TestAnonymousClient(BaseClass):
    
    @classmethod
    def setup(cls):
        cls.client = JSONWebTokenClient()
        cls.user = AnonymousUser()


class TestAuthenticationClient(BaseClass):

    @classmethod
    def setup(cls):
        cls.client = JSONWebTokenClient()
        cls.user = mixer.blend(get_user_model())

        cls.client.authenticate(cls.user)
