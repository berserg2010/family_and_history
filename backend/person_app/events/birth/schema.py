from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from graphql import GraphQLError
import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required
import json

from common.schema import DeleteMutation
from .models import Birth
from core.schema import (
    EventFieldType,
    EventFieldInput,
    exclude_fields_event_field,
)
from person_app.person.schema import PersonType


class BirthType(
    EventFieldType,
    # DjangoObjectType,
):
    person = graphene.Field(PersonType)
    givname = graphene.String()
    surname = graphene.String()

    class Meta:
        model = Birth
        filter_fields = {'_surname': ['icontains']}
        exclude_fields = exclude_fields_event_field + (
            '_person',
            '_givname',
            '_surname',
        )


class BirthInput(EventFieldInput, graphene.InputObjectType):

    person_id = graphene.ID()
    gender = graphene.String()
    givname = graphene.String()
    surname = graphene.String()


def is_data(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if key != 'id' and value:
                return True


class CreateBirthMutation(graphene.Mutation):

    birth = graphene.Field(BirthType)

    class Arguments:
        data = BirthInput()

    @login_required
    def mutate(self, info, data=None):

        if not is_data(data):
            return GraphQLError('Please enter data')

        changer_submitter = info.context.user

        birth = Birth()
        birth.person = data.get('person_id')
        birth.gender = data.get('gender', 'U')
        birth.givname = data.get('givname')
        birth.surname = data.get('surname')
        birth.datetime = {
            'day': data.get('day'),
            'month': data.get('month'),
            'year': data.get('year'),
            'hour': data.get('hour'),
            'minute': data.get('minute'),
        }
        birth.note = data.get('note')
        birth.submitter = changer_submitter
        birth.changer = changer_submitter
        birth.save()

        return CreateBirthMutation(
            birth=birth,
        )


class UpdateBirthMutation(graphene.Mutation):

    birth = graphene.Field(BirthType)

    class Arguments:
        data = BirthInput()

    @login_required
    def mutate(self, info, data=None):

        if not is_data(data):
            return GraphQLError('Please enter data')

        birth_id = data.get('id')
        changer_submitter = info.context.user

        try:
            birth = Birth.objects.get(pk=birth_id)
        except ObjectDoesNotExist:
            raise GraphQLError('Please enter a valid id')

        birth.person = data.get('person_id')
        birth.gender = data.get('gender', 'U')
        birth.givname = data.get('givname')
        birth.surname = data.get('surname')
        birth.datetime = {
            'day': data.get('day'),
            'month': data.get('month'),
            'year': data.get('year'),
            'hour': data.get('hour'),
            'minute': data.get('minute'),
        }
        birth.note = data.get('note')
        birth.changer = changer_submitter
        birth.save()

        return UpdateBirthMutation(
            birth=birth,
        )


class DeleteBirthMutation(DeleteMutation):

    obj = Birth


class LikeBirthMutation(graphene.Mutation):

    birth = graphene.Field(BirthType)

    class Arguments:
        id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, id):

        obj_id = id
        user_email = info.context.user

        user = get_user_model().objects.get(email=user_email)
        birth = Birth.objects.get(pk=id)

        if Birth.objects.filter(_person=birth.person, _likes=user).exists():
            birth._likes.remove(user)
        else:
            birth._likes.add(user)

        return LikeBirthMutation(
            birth=birth,
        )


class Query(graphene.ObjectType):

    all_births = graphene.List(
        BirthType,
        personId=graphene.ID()
    )

    birth = graphene.Field(
        BirthType,
        id=graphene.ID(required=True),
    )

    search_birth = graphene.List(
        BirthType,
        searchTerm=graphene.String(),
    )


    @login_required
    def resolve_all_births(self, info, **kwargs):
        
        person_id = kwargs.get('personId')

        if person_id:
            births = Birth.objects.filter(_person=person_id)

            if not births:
                raise GraphQLError('Please enter a valid id')

        else:
            births = Birth.objects.all()
        
        return births.order_by('-changed')


    @login_required
    def resolve_birth(self, info, **kwargs):

        birth_id = kwargs.get('id')

        try:
            return Birth.objects.get(pk=birth_id)
        except ObjectDoesNotExist:
            raise GraphQLError('Please enter a valid id')


    @login_required
    def resolve_search_birth(self, info, **kwargs):
        return Birth.objects.filter(  # Фильтр только по surname_male?
            _surname___surname_male__icontains=kwargs.get('searchTerm')
        ).order_by('-changed')


class Mutation(graphene.ObjectType):
    create_birth = CreateBirthMutation.Field()
    update_birth = UpdateBirthMutation.Field()
    delete_birth = DeleteBirthMutation.Field()
    like_birth = LikeBirthMutation.Field()
