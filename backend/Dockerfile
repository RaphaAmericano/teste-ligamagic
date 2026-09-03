FROM php:8.3-fpm-alpine
RUN apk add --no-cache nginx \
    && docker-php-ext-install mysqli
COPY nginx.conf /etc/nginx/http.d/default.conf
RUN mkdir -p /run/nginx
CMD ["sh", "-c", "php-fpm --daemonize && nginx -g 'daemon off;'"]