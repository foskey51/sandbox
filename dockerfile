FROM alpine:latest

RUN apk update RUN apk update && apk add --no-cache gcc g++ libc-dev bash 

WORKDIR /app

CMD ["/bin/sh"]
