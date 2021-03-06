import graphene
from graphene_django import DjangoObjectType

from .models import *


# DateTime
class DateTimeType(DjangoObjectType):
    class Meta:
        model = DateTime
        exclude_fields = (
            'qualifiers',
            'calendar',
            'link',
        )


class DateTimeInput(graphene.InputObjectType):
    day = graphene.Int()
    month = graphene.Int()
    year = graphene.Int()
    hour = graphene.Int()
    minute = graphene.Int()


# GivName
class GivNameType(DjangoObjectType):
    class Meta:
        model = GivName


class GivNameInput(graphene.InputObjectType):
    givname = graphene.String()


# SurName
class SurNameType(DjangoObjectType):
    class Meta:
        model = SurName


class SurNameInput(graphene.InputObjectType):
    surname = graphene.String()


# ObjectField
class ObjectFieldInput(graphene.InputObjectType):
    
    id = graphene.ID()
    note = graphene.String()

    class Meta:
        abstract = True


# EventField
class EventFieldType(DjangoObjectType):

    datetime = graphene.JSONString()
    likes = graphene.Int()

    class Meta:
        abstract = True


class EventFieldInput(ObjectFieldInput):

    day = graphene.Int()
    month = graphene.Int()
    year = graphene.Int()
    hour = graphene.Int()
    minute = graphene.Int()

    class Meta:
        abstract = True


exclude_fields_event_field = (
    '_datetime',
    '_likes',
    'place',
    'evidence'
)


# EventFieldTest
class EventFieldTypeTest(DjangoObjectType):

    datetime = graphene.Field(DateTimeType)
    likes = graphene.Int()

    class Meta:
        abstract = True


class EventFieldInputTest(ObjectFieldInput):

    datetime = DateTimeInput()

    class Meta:
        abstract = True
