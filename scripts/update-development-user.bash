domain=$1

if [ $domain != "" ]; then
	echo "DBG: Using Domain"$domain
else
	echo "DBG: Error Domain Not Set"
	exit 1
fi

if sed -i 's/staging.Vegeterians.live/'$domain'/g' ~/live/.env.production; then
	echo "NGX: Environment Update Complete"
else
	error=$?
	echo "NGX: Error Updating Environment"
	echo $error
	exit 1
fi

exit 0
