#!/bin/bash
git clone https://github.com/omkaruttirnaservice/question_paper_data_entry.git -b master .
git clone https://github.com/omkaruttirnaservice/qp-gen.git -b master .

# Exit on error
set -e

### ==============================
### CONFIGURABLE VARIABLES
### ==============================
PROJECT_ROOT="/var/www/ydcc-qp-de"
SITES_DIR="/etc/nginx/sites-available/ydcc-qp-de"
ENABLED_DIR="/etc/nginx/sites-enabled"

DOMAIN_MAIN="uttirna.in"
ORG_SHORT="ydcc"
PROJECT_CODE="qp"
DE1="qp"   # first variant folder name
DE2="de"   # second variant folder name

PORT_API_1=5501
PORT_API_2=5502

### ==============================
### GENERATE CONFIG FILES
### ==============================
mkdir -p "$SITES_DIR"

# ---------- API 1 ----------
cat <<EOF > "$SITES_DIR/api.$ORG_SHORT.$PROJECT_CODE.$DOMAIN_MAIN.conf"
server {
    listen 80;
    server_name api.$ORG_SHORT.$PROJECT_CODE.$DOMAIN_MAIN;
    client_max_body_size 10M;

    root $PROJECT_ROOT/$DE1/api/public;

    location / {
        proxy_pass http://127.0.0.1:$PORT_API_1;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Connection "";
        proxy_set_header Upgrade \$http_upgrade;
        proxy_read_timeout 90s;
        proxy_send_timeout 90s;
        proxy_connect_timeout 30s;
    }
}
EOF

# ---------- API 2 ----------
cat <<EOF > "$SITES_DIR/api.$ORG_SHORT.$DE2.$DOMAIN_MAIN.conf"
server {
    listen 80;
    server_name api.$ORG_SHORT.$DE2.$DOMAIN_MAIN;
    client_max_body_size 10M;

    root $PROJECT_ROOT/$DE2/api/public;

    location / {
        proxy_pass http://127.0.0.1:$PORT_API_2;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Connection "";
        proxy_set_header Upgrade \$http_upgrade;
        proxy_read_timeout 90s;
        proxy_send_timeout 90s;
        proxy_connect_timeout 30s;
    }
}
EOF

# ---------- WEB 1 ----------
cat <<EOF > "$SITES_DIR/$ORG_SHORT.$PROJECT_CODE.$DOMAIN_MAIN.conf"
server {
    listen 80;
    server_name $ORG_SHORT.$PROJECT_CODE.$DOMAIN_MAIN www.$ORG_SHORT.$PROJECT_CODE.$DOMAIN_MAIN;

    root $PROJECT_ROOT/$DE1/web/dist;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }

    location ~* \.(?:css|js|woff2?|ttf|eot|svg|jpg|jpeg|png|gif|ico|webp|avif)$ {
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files \$uri =404;
    }

    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;
}
EOF

# ---------- WEB 2 ----------
cat <<EOF > "$SITES_DIR/$ORG_SHORT.$DE2.$DOMAIN_MAIN.conf"
server {
    listen 80;
    server_name $ORG_SHORT.$DE2.$DOMAIN_MAIN www.$ORG_SHORT.$DE2.$DOMAIN_MAIN;

    root $PROJECT_ROOT/$DE2/web/dist;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }

    location ~* \.(?:css|js|woff2?|ttf|eot|svg|jpg|jpeg|png|gif|ico|webp|avif)$ {
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files \$uri =404;
    }

    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;
}
EOF

### ==============================
### LINK, TEST, RELOAD, SSL
### ==============================
ln -sf "$SITES_DIR/api.$ORG_SHORT.$PROJECT_CODE.$DOMAIN_MAIN.conf" "$ENABLED_DIR/"
ln -sf "$SITES_DIR/api.$ORG_SHORT.$DE2.$DOMAIN_MAIN.conf" "$ENABLED_DIR/"
ln -sf "$SITES_DIR/$ORG_SHORT.$PROJECT_CODE.$DOMAIN_MAIN.conf" "$ENABLED_DIR/"
ln -sf "$SITES_DIR/$ORG_SHORT.$DE2.$DOMAIN_MAIN.conf" "$ENABLED_DIR/"

nginx -t && systemctl reload nginx

### Optional: SSL (uncomment when DNS is ready)
# certbot --nginx -d api.$ORG_SHORT.$PROJECT_CODE.$DOMAIN_MAIN
# certbot --nginx -d api.$ORG_SHORT.$DE2.$DOMAIN_MAIN
# certbot --nginx -d $ORG_SHORT.$PROJECT_CODE.$DOMAIN_MAIN -d www.$ORG_SHORT.$PROJECT_CODE.$DOMAIN_MAIN
# certbot --nginx -d $ORG_SHORT.$DE2.$DOMAIN_MAIN -d www.$ORG_SHORT.$DE2.$DOMAIN_MAIN

echo "✅ All Nginx configs generated and reloaded successfully!"


cd $PROJECT_ROOT/$
rm -r dist
npm run build


cd /var/www/ydcc-qp-de/de/web
rm -r dist
npm run build


