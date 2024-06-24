FROM bigpapoo/r5a05-postgres

ENV POSTGRES_USER docker
ENV POSTGRES_PASSWORD docker
ENV POSTGRES_DB docker

COPY init.sql /docker-entrypoint-initdb.d/

# Build image
# docker image build -f DockerfileBDD.Dockerfile -t dockerbdd .

# docker run -d --name postgres -p 5432:5432 dockerbdd
