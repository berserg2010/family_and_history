from django.core.exceptions import ObjectDoesNotExist
from graphql import GraphQLError
import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required


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

        return cls(
            id=id,
        )
