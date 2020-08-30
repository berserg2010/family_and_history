from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required
import json

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

    status = graphene.Int()
    formErrors = graphene.String()
    person = graphene.Field(PersonType)

    class Arguments:
        data = PersonInput()

    def mutate(self, info, data=None, **kwargs):
        if not info.context.user.is_authenticated:
            return CreatePersonMutation(status=401)

        if info.context.user:
            user = info.context.user
        else:
            user = None
        
        person_id = data.get('id', None)

        if person_id is not None:

            try:
                person = Person.objects.get(pk=person_id)
            except ObjectDoesNotExist:
                return CreatePersonMutation(status=400)

            person.user = data.get('user')  # Написать setter для id
            person.note = data.get('note')
            person.changer = user
            person.save()

        else:
            person = Person.objects.create(
                note=data.get('note'),
                submitter=user,
            )

        return CreatePersonMutation(
            status=201,
            person=person,
        )


class DeletePersonMutation(graphene.Mutation):

    status = graphene.Int()
    formErrors = graphene.String()
    id = graphene.ID()

    class Arguments:
        id = graphene.ID(required=True)

    def mutate(self, info, **kwargs):
        if not info.context.user.is_authenticated:
            return DeletePersonMutation(status=403)

        id = kwargs.get('id')

        if id is None:
            return DeletePersonMutation(
                status=400,
                formErrors=json.dumps(
                    {'id': ['Please enter an id']}
                )
            )

        if Person.objects.filter(pk=id).exists():
            Person.objects.get(pk=id).delete()

        return DeletePersonMutation(
            status=200,
            id=id,
        )


class Query(graphene.ObjectType):
    all_persons = graphene.List(PersonType)

    person = graphene.Field(
        PersonType,
        id=graphene.ID(),
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
        id = kwargs.get('id')
        return Person.objects.get(pk=id)


    # def resolve_search_person(self, info, **kwargs):
    #     return Person.objects.filter(  # Фильтр только по surname_male?
    #         birth___surname___surname_male__icontains=kwargs.get('searchTerm')
    #     ).order_by('-changed')


class Mutation(graphene.ObjectType):
    create_person = CreatePersonMutation.Field()
    delete_person = DeletePersonMutation.Field()
