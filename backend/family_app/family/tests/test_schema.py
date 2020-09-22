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


@pytest.mark.usefixtures('create_superuser')
class TestFamilyAPI:

    # @pytest.mark.parametrize('client_fixture, errors', [
    #     ('client', 'You do not have permission to perform this action'),
    #     ('client_register', None),
    # ])
    # def test_get_all_families(self, client_fixture, errors, request):

    #     mixer.blend(Family)
    #     mixer.blend(Family)

    #     client = request.getfixturevalue(client_fixture)
    #     result = client.execute(query=queries.ALL_FAMILY)

    #     if client_fixture == 'client':
    #         assert result.errors
    #         assert len(result.errors) == 1
    #         assert result.errors[0].message == errors
    #     else:
    #         assert not result.errors
    #         assert len(result.data.get('allFamily')) == 2
    

    # @pytest.mark.parametrize('schema, query', [('FAMILY', 'family'), ('DELETE_FAMILY', 'deleteFamily')])
    # @pytest.mark.parametrize('client_fixture, data, errors', [
    #     ('client', {'id': None}, 'Variable "$id" of required type "ID!" was not provided.'),
    #     ('client', {'id': 21}, 'You do not have permission to perform this action'),
    #     ('client', {'id': 12}, 'You do not have permission to perform this action'),
        
    #     ('client_register', {'id': None}, 'Variable "$id" of required type "ID!" was not provided.'),
    #     ('client_register', {'id': 21}, 'Please enter a valid id'),
    #     ('client_register', {'id': 12}, None),
    # ])
    # def test_get_family_and_delete_family_mutation(self, schema, query, client_fixture, data, errors, request):

    #     mixer.blend(Family, pk=12)
        
    #     client = request.getfixturevalue(client_fixture)
    #     result = client.execute(query=getattr(queries, schema), variables=data)

    #     if client_fixture == 'client_register' and data.get('id') == 12:
    #         assert not result.errors
    #         assert result.data.get(query)['id'] == data.get('id') or str(data.get('id'))
    #     else:
    #         assert result.errors
    #         assert len(result.errors) == 1
    #         assert result.errors[0].message == errors
    

    # @pytest.mark.parametrize('client_fixture, data, errors', [
    #     ('client', None, 'You do not have permission to perform this action'),
    #     ('client', {'data': {'note': ':)'}}, 'You do not have permission to perform this action'),
        
    #     ('client_register', None, None),
    #     ('client_register', {'data': {'note': ':)'}}, None),
    # ])
    # def test_create_family_mutation(self, client_fixture, data, errors, request):

    #     client = request.getfixturevalue(client_fixture)
    #     result = client.execute(query=queries.CREATE_FAMILY, variables=data)

    #     family_id = result.data is not None and result.data.get('createFamily') and result.data.get('createFamily')['family']['id']

    #     if client_fixture == 'client_register' and family_id:
    #         assert not result.errors
    #         person = Family.objects.get(pk=family_id)
    #         assert person.note == (data.get('data')['note'] if data else '')
    #         assert person.submitter
    #         assert person.changer
    #     else:
    #         assert result.errors
    #         assert len(result.errors) == 1
    #         assert result.errors[0].message == errors


    @pytest.mark.parametrize('client_fixture, data, errors', [
        ('client', None, 'Variable "$id" of required type "ID!" was not provided.'),
        ('client', {'id': None, 'data': {'note': ''}}, 'Variable "$id" of required type "ID!" was not provided.'),
        ('client', {'id': 21, 'data': None}, 'Variable "$data" of required type "FamilyInput!" was not provided.'),
        ('client', {'id': 21, 'data': {'note': ':)'}}, 'You do not have permission to perform this action'),
        ('client', {'id': 12, 'data': {'note': ''}}, 'You do not have permission to perform this action'),
        ('client', {'id': 12, 'data': {'note': ':)'}}, 'You do not have permission to perform this action'),
        
        ('client_register', None, 'Variable "$id" of required type "ID!" was not provided.'),
        ('client_register', {'id': None, 'data': {'note': ''}}, 'Variable "$id" of required type "ID!" was not provided.'),
        ('client_register', {'id': 21, 'data': None}, 'Variable "$data" of required type "FamilyInput!" was not provided.'),
        ('client_register', {'id': 21, 'data': {'note': ':)'}}, 'Please enter a valid id'),
        ('client_register', {'id': 12, 'data': {'note': ''}}, None),
        ('client_register', {'id': 12, 'data': {'note': ':)'}}, None),
    ])
    def test_update_family_mutation(self, client_fixture, data, errors, request):

        mixer.blend(Family, pk=12, note=':(', submitter=mixer.blend(get_user_model()), changer=mixer.blend(get_user_model()))

        client = request.getfixturevalue(client_fixture)
        result = client.execute(query=queries.UPDATE_FAMILY, variables=data)

        if client_fixture == 'client_register' and errors is None:
            assert not result.errors
            family = Family.objects.get(pk=12)
            assert family.note == (data.get('data')['note'] if data else '')
            assert family.submitter
            assert family.changer
        else:
            assert result.errors
            assert len(result.errors) == 1
            assert result.errors[0].message == errors


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
