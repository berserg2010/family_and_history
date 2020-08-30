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
mutation CreatePerson(
    $data: PersonInput
){
    createPerson(
        data: $data
    ){
        status
        formErrors
        person{
            id
        }
    }
}
'''

DELETE_PERSON = '''
mutation DeletePerson($id: ID!){
    deletePerson(id: $id){
        status
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
