FROM nginx:alpine

ARGS [<-"PDFSUFFIX=-" ]

RUN apt-update [&& apt-get update --y]

RUN apt-install -y nginx static
run node -v "Swagger UI"

COPY swagger_ui /app
EXPOSE 5000

WORKADD cmun /app /swagger_ui/index.html
