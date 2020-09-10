# BIRTH
ALL_BIRTH = '''
query AllBirths($personId: ID){
    allBirths(personId: $personId){
        id
    }
}
'''

BIRTH = '''
query Birth($id: ID!){
    birth(id: $id){
        id
    }
}
'''

CREATE_BIRTH = '''
mutation CreateBirth($personId: ID!, $data: BirthInput!){
    createBirth(personId: $personId, data: $data){
        birth{
            id
        }
    }
}
'''

UPDATE_BIRTH = '''
mutation UpdateBirth($data: BirthInput!){
    updateBirth(data: $data){
        birth{
            id
        }
    }
}
'''

DELETE_BIRTH = '''
mutation DeleteBirth($id: ID!){
    deleteBirth(id: $id){
        id
    }
}
'''

SEARCH_BIRTH = '''
query SearchBirth($searchTerm: String){
    searchBirth(searchTerm: $searchTerm){
        id
        surname
    }
}
'''

LIKE_BIRTH = '''
mutation LikeBirth($id: ID!){
    likeBirth(id: $id){
        birth{
            likes
        }
    }
}
'''
