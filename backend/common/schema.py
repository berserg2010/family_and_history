from django.core.exceptions import ObjectDoesNotExist
from graphql import GraphQLError
import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required


def is_data(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if key != 'id' and value:
                return True
        return False


class CreateMutation(graphene.Mutation):

    @classmethod
    @login_required
    def mutate(cls, root, info, data):

        if not is_data(data):
            return GraphQLError('Please enter data')

        changer_submitter = info.context.user

        obj = cls.obj()

        for key, value in data.items():
            setattr(obj, key, value)

        obj.submitter = changer_submitter
        obj.changer = changer_submitter
        obj.save()

        return cls(obj)


class UpdateMutation(graphene.Mutation):

    @classmethod
    @login_required
    def mutate(cls, root, info, data):

        if not is_data(data):
            return GraphQLError('Please enter data')
        
        obj_id = data.get('id')
        changer_submitter = info.context.user
        
        try:
            obj = cls.obj.objects.get(pk=obj_id)
        except ObjectDoesNotExist:
            raise GraphQLError('Please enter a valid id')

        for key, value in data.items():
            setattr(obj, key, value)

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
