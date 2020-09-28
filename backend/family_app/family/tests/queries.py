# FAMILY


# CHILD
ALL_CHILD = '''
query AllChild($idFamily: ID){
    allChild(idFamily: $idFamily){
        id        
    }
}
'''

CHILD = '''
query Child($id: ID!){
    child(id: $id){
        id
    }
}
'''

CREATE_CHILD = '''
mutation CreateChild($data: ChildInput){
    createChild(data: $data){
        child{
            id
        }
    }
}
'''

UPDATE_CHILD = '''
mutation UpdateChild($id: ID!, $data: ChildInput!){
    updateChild(id: $id, data: $data){
        child{
            id
        }
    }
}
'''

DELETE_CHILD = '''
mutation DeleteChild($id: ID!){
    deleteChild(id: $id){
        id
    }
}
'''
