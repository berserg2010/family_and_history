def all_obj(query: str) -> str:
    return f'''
        query {query.capitalize()}{{
            {query}{{
                id
            }}
        }}
    '''


def obj(query: str) -> str:

    q: str = 'mutation' if query.startswith('delete') else 'query'

    return f'''
        {q} {query.capitalize()}($id: ID!){{
            {query}(id: $id){{
                id
            }}
        }}
    '''


def create_obj(query: str) -> str:

    obj: str = query[len('create'):]

    return f'''
        mutation {query.capitalize()}($data: {obj}Input){{
            {query}(data: $data){{
                {obj.lower()}{{
                    id
                }}
            }}
        }}
    '''



# PERSON
ALL_PERSONS = '''
query AllPersons{
    allPersons{
        id        
    }
}
'''

PERSON = '''
query Person($id: ID!){
    person(id: $id){
        id
    }
}
'''

CREATE_PERSON = '''
mutation CreatePerson($data: PersonInput){
    createPerson(data: $data){
        person{
            id
        }
    }
}
'''

UPDATE_PERSON = '''
mutation UpdatePerson($id: ID!, $data: PersonInput!){
    updatePerson(id: $id, data: $data){
        person{
            id
        }
    }
}
'''

DELETE_PERSON = '''
mutation DeletePerson($id: ID!){
    deletePerson(id: $id){
        id
    }
}
'''

SEARCH_PERSON = '''
query SearchPerson($searchTerm: String){
    searchPerson(searchTerm: $searchTerm){
        id
        birth{
            surname
        }
    }
}
'''
