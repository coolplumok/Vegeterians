domain=$1

if [ $domain != "" ]; then
	echo "DBG: Using Domain"$domain
else
	echo "DBG: Error Domain Not Set"
	exit 1
fi

if sudo certbot certonly --non-interactive --agree-tos --domain $domain --nginx; then
	echo "CRT: SSL Certificate Created"
else
	error=$?
	echo "CRT: Error Creating SSL Certificate"
	echo $error
	exit 1
fi

if sudo sed -i 's/staging.Vegeterians.live/'$domain'/g' /etc/nginx/sites-available/staging.Vegeterians.live.conf; then
	echo "NGX: Nginx Update Complete"
else
	error=$?
	echo "NGX: Error Updating Nginx"
	echo $error
	exit 1
fi

if sudo service nginx restart; then
	echo "NGX: Nginx Restart Complete"
else
	error=$?
	echo "NGX: Error Restarting Nginx"
	echo $error
	exit 1
fi

exit 0
