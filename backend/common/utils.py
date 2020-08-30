root_auth = {
    'email': 'root@asdfasdf.com',
    'first_name': 'first_name',
    'last_name': 'last_name',
    'password': 'lkasdjlkasdflaksdjf',
}



def join_test_data(check_data, correct_value):
    for i in range(len(check_data)):
        yield (*check_data[i], *correct_value[i])
