from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from graphql import GraphQLError
import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from .models import Family, Child
from person_app.models import Birth
from core.schema import ObjectFieldInput
from common.schema import (
    CreateMutation, 
    UpdateMutation, 
    DeleteMutation,
)
from person_app.events.birth.schema import BirthType


# Family
class FamilyType(DjangoObjectType):

    class Meta:
        model = Family


class FamilyInput(ObjectFieldInput):
    pass


class CreateFamilyMutation(CreateMutation):

    obj = Family

    family = graphene.Field(FamilyType)

    class Arguments:
        data = FamilyInput()


class UpdateFamilyMutation(UpdateMutation):

    obj = Family

    family = graphene.Field(FamilyType)

    class Arguments(UpdateMutation.Arguments):
        data = FamilyInput(required=True)


class DeleteFamilyMutation(DeleteMutation):

    obj = Family


# Child
class ChildType(DjangoObjectType):

    family = graphene.Field(FamilyType)
    birth = graphene.Field(BirthType)

    class Meta:
        model = Child
        exclude_fields = (
            '_family',
            '_birth',
        )


class ChildInput(graphene.InputObjectType):

    id = graphene.ID()
    familyId = graphene.ID()
    birthId = graphene.ID()
    reltofath = graphene.String()
    reltomoth = graphene.String()
    childnbrfath = graphene.Int()
    childnbrmoth = graphene.Int()


class CreateChildMutation(CreateMutation):

    obj = Child

    child = graphene.Field(ChildType)

    class Arguments:
        data = ChildInput()


class UpdateChildMutation(UpdateMutation):

    obj = Child

    child = graphene.Field(ChildType)

    class Arguments(UpdateMutation.Arguments):
        data = ChildInput(required=True)


class DeleteChildMutation(DeleteMutation):

    obj = Child


class Query(graphene.ObjectType):

    all_families = graphene.List(FamilyType)

    family = graphene.Field(
        FamilyType,
        id=graphene.ID(),
    )

    all_children = graphene.List(
        ChildType,
        familyId=graphene.ID(),
    )

    child = graphene.Field(
        ChildType,
        id=graphene.ID(),
    )


    @login_required
    def resolve_all_families(self, info):
        return Family.objects.all().order_by('-changed')


    @login_required
    def resolve_family(self, info, id):

        try:
            return Family.objects.get(pk=id)
        except ObjectDoesNotExist:
            raise GraphQLError('Please enter a valid id')


    @login_required
    def resolve_all_children(self, info, family_id=None):
        
        if family_id is None:
            return Child.objects.all()
        else:
            return Child.objects.filter(_family=family_id)
    
    
    @login_required
    def resolve_child(self, info, id):
        return Child.objects.get(pk=id)


class Mutation(graphene.ObjectType):

    create_family = CreateFamilyMutation.Field()
    update_family = UpdateFamilyMutation.Field()
    delete_family = DeleteFamilyMutation.Field()

    create_child = CreateChildMutation.Field()
    update_child = UpdateChildMutation.Field()
    delete_child = DeleteChildMutation.Field()
