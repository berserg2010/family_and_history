FROM python:3.7

MAINTAINER <berserg2010@gmail.com>

ENV PYTHONUNBUFFERED 1

RUN useradd --no-create-home --system --uid 1000 --user-group node

WORKDIR /usr/src/todo/backend

COPY --chown=1000:1000 requirements.txt ./requirements.txt

RUN pip install -r requirements.txt

RUN mkdir media static && chown 1000:1000 media static

USER node

COPY --chown=1000:1000 . ./
