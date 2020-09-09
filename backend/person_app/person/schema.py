from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from graphql import GraphQLError
import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from common.schema import (
    CreateObjectMutation, 
    UpdateObjectMutation, 
    DeleteMutation,
)
from core.schema import ObjectFieldInput
from .models import Person


class PersonType(DjangoObjectType):

    class Meta:
        model = Person
        # filter_fields = {'note': ['icontains']}


class PersonInput(ObjectFieldInput):

    user = graphene.ID()


class CreatePersonMutation(CreateObjectMutation):

    obj = Person

    person = graphene.Field(PersonType)

    class Arguments:
        data = PersonInput()


class UpdatePersonMutation(UpdateObjectMutation):

    obj = Person

    person = graphene.Field(PersonType)

    class Arguments(UpdateObjectMutation.Arguments):
        data = PersonInput(required=True)


class DeletePersonMutation(DeleteMutation):
    
    obj = Person
    

class Query(graphene.ObjectType):

    all_persons = graphene.List(PersonType)

    person = graphene.Field(
        PersonType,
        id=graphene.ID(required=True),
    )

    # search_person = graphene.List(
    #     PersonType,
    #     searchTerm=graphene.String(),
    # )


    @login_required
    def resolve_all_persons(self, info):
        return Person.objects.all().order_by('-changed')
    

    @login_required
    def resolve_person(self, info, **kwargs):

        person_id = kwargs.get('id')

        try:
            return Person.objects.get(pk=person_id)
        except ObjectDoesNotExist:
            raise GraphQLError('Please enter a valid id')


    # def resolve_search_person(self, info, **kwargs):
    #     return Person.objects.filter(  # Фильтр только по surname_male?
    #         birth___surname___surname_male__icontains=kwargs.get('searchTerm')
    #     ).order_by('-changed')


class Mutation(graphene.ObjectType):
    create_person = CreatePersonMutation.Field()
    update_person = UpdatePersonMutation.Field()
    delete_person = DeletePersonMutation.Field()
