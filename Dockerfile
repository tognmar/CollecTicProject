FROM continuumio/miniconda3:latest

RUN mkdir -p /backend
RUN mkdir -p /scripts
RUN mkdir -p /static-files
RUN mkdir -p /media-files
RUN mkdir -p /frontend

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install curl -y
# Install node js version 20.x
RUN curl https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs
RUN apt-get install -y poppler-utils

COPY ./backend/requirements.yml /backend/requirements.yml
COPY ./scripts /scripts
RUN chmod +x ./scripts

RUN /opt/conda/bin/conda env create -f /backend/requirements.yml
ENV PATH /opt/conda/envs/ticket/bin:$PATH
RUN echo "source activate ticket" > ~/.bashrc

WORKDIR /frontend
COPY ./frontend/package.json /frontend/package.json
COPY ./frontend/package-lock.json /frontend/package-lock.json

RUN npm install

COPY ./frontend /frontend
RUN npm run build

COPY ./backend /backend

WORKDIR /backend



