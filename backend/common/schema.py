from django.core.exceptions import ObjectDoesNotExist
from graphql import GraphQLError
import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required


def is_valid_id(cls, key, value) -> None:
    
    if key.endswith('_id'):
        
        foreign_model = cls.obj._meta.get_field(f'_{key[:-3]}').remote_field.model
        
        try:
            foreign_model.objects.get(pk=value)
        except ObjectDoesNotExist:
            raise GraphQLError(f'Please enter a valid {key}')


def set_attr_when_creating(cls, obj, data, kwargs):

    for key, value in dict(data, **kwargs).items():

        is_valid_id(cls, key, value)
        
        setattr(obj, key, value)


def set_attr_when_update(cls, obj, data, kwargs):

    data_is_not_changed = True

    for key, value in dict(data, **kwargs).items():

        is_valid_id(cls, key, value)
        
        split_key = key.split('_')
        
        if getattr(obj, split_key[0]) != value:
            data_is_not_changed = False
            setattr(obj, split_key[0], value)
    
    if data_is_not_changed:
        raise GraphQLError('No changed data')


class CreateMutation(graphene.Mutation):

    @classmethod
    @login_required
    def mutate(cls, root, info, data={}, **kwargs):

        changer_submitter = info.context.user

        obj = cls.obj()

        set_attr_when_creating(cls, obj, data, kwargs)

        obj.submitter = changer_submitter
        obj.changer = changer_submitter
        obj.save()

        return cls(obj)


class UpdateMutation(graphene.Mutation):

    id = graphene.ID()

    class Arguments:
        id = graphene.ID(required=True)

    @classmethod
    @login_required
    def mutate(cls, root, info, id, data, **kwargs):

        changer_submitter = info.context.user
        
        try:
            obj = cls.obj.objects.get(pk=id)
        except ObjectDoesNotExist:
            raise GraphQLError('Please enter a valid id')

        set_attr_when_update(cls, obj, data, kwargs)

        obj.changer = changer_submitter
        obj.save()

        return cls(obj)


class DeleteMutation(graphene.Mutation):

    id = graphene.ID()

    class Arguments:
        id = graphene.ID(required=True)

    @classmethod
    @login_required
    def mutate(cls, root, info, id):

        try:
            cls.obj.objects.get(pk=id).delete()
        except ObjectDoesNotExist:
            raise GraphQLError('Please enter a valid id')

        return cls(id=id)
