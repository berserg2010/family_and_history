

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


def update_obj(query: str) -> str:
    obj: str = query[len('update'):]

    return f'''
        mutation {query.capitalize()}($id: ID!, $data: {obj}Input!){{
            {query}(id: $id, data: $data){{
                {obj.lower()}{{
                    id
                }}
            }}
        }}
    '''
