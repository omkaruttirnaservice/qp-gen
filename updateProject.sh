echo "updating..."

ssh dev-server-2 << EOF
    . ~/.nvm/nvm.sh
    
    cd /var/www/ydcc-qp-de/qp
    git pull

    cd /var/www/ydcc-qp-de/qp/web
    rm -r dist

    cd /var/www/ydcc-qp-de/qp/web
    npm run build

    cd /var/www/ydcc-qp-de/de
    git pull

    cd /var/www/ydcc-qp-de/de/web
    rm -r dist

    cd /var/www/ydcc-qp-de/de/web
    npm run build

    pm2 restart api.ydcc.de.uttirna.in
    pm2 restart api.ydcc.qp.uttirna.in

EOF

echo "Done updating..."

