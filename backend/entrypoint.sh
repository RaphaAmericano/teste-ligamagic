#!/bin/sh
mkdir -p /var/www/html/uploads
chown -R www-data:www-data /var/www/html/uploads
php-fpm --daemonize
nginx -g 'daemon off;'