## FAMILY AND HISTORY

### Установка Docker

https://docs.docker.com/engine/install/

### Предварительная настройка

1. Необходимо инициализировать переменные окружения.
В папек `env/` необходимо скопировать шаблоны, удалив при этом расширение `.template`.

2. Примеры переменных:
    
    `db.env.template`
    
    - POSTGRES_HOST=db
    - POSTGRES_DB=postgres
    - POSTGRES_USER=postgres
    - POSTGRES_PASSWORD=postgres
    
    `back.env.template`
    
    - DJANGO_SECRET_KEY=!6@%ch8p6o#7u!zx&=@s3kejg483y+8%c#fped_d*fb-v&#*45


3. В файле `backend/backend/settings.py` в списках `ALLOWED_HOSTS` и `CORS_ORIGIN_WHITELIST` указать необходимый хост.

4. В файлах в папке `proxy/` указать `server_name`.

### Создание миграции, регистрация суперпользователя

    docker-compose run backend python manage.py makemigrations
    docker-compose run backend python manage.py migrate
>
    docker-compose run backend python manage.py createsuperuser

Потребуется ввести `Username` и `Password`.


### Сбор статики
    docker-compose run backend python manage.py collectstatic --no-input


### Запуск контейнеров

Frontend запускается на 8000 порту, backend - на 8080.

#### dev

    docker-compose up --build

#### prod

    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build


### Запуск unit тестов
    docker-compose run backend pytest
