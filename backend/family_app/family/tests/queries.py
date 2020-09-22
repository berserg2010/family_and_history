# FAMILY
ALL_FAMILY = '''
query AllFamily{
    allFamily{
        id        
    }
}
'''

FAMILY = '''
query Family($id: ID!){
    family(id: $id){
        id
    }
}
'''

CREATE_FAMILY = '''
mutation CreateFamily($data: FamilyInput){
    createFamily(data: $data){
        family{
            id
        }
    }
}
'''

UPDATE_FAMILY = '''
mutation UpdateFamily($id: ID!, $data: FamilyInput!){
    updateFamily(id: $id, data: $data){
        family{
            id
        }
    }
}
'''

DELETE_FAMILY = '''
mutation DeleteFamily($id: ID!){
    deleteFamily(id: $id){
        id
    }
}
'''


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
