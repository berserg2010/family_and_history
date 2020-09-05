from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from graphql import GraphQLError
import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from common.schema import DeleteMutation
from .models import Person


class PersonType(DjangoObjectType):
    class Meta:
        model = Person
        # filter_fields = {'note': ['icontains']}


class PersonInput(graphene.InputObjectType):

    id = graphene.ID()
    user = graphene.ID()
    note = graphene.String()


class CreatePersonMutation(graphene.Mutation):

    person = graphene.Field(PersonType)

    class Arguments:
        data = PersonInput()

    @login_required
    def mutate(self, info, data=None, **kwargs):

        person_id = data.get('id')
        changer_submitter = info.context.user

        if person_id:
            try:
                person = Person.objects.get(pk=person_id)
            except ObjectDoesNotExist:
                raise GraphQLError('Please enter a valid id')

        else:
            person = Person()
            person.submitter = changer_submitter

        person.user = data.get('user')
        person.note = data.get('note')
        person.changer = changer_submitter
        person.save()

        return CreatePersonMutation(
            person=person,
        )


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
    delete_person = DeletePersonMutation.Field()
