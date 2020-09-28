# PERSON
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
