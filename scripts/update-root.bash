echo "SRV: Restarting Sidekiq Service"
if sudo service gabsocial-sidekiq restart; then
	echo "SRV: Sidekiq Service Restarted Successfully"
else
	error=$?
	echo "SRV: Error Restarting Sidekiq Service"
	echo $error
	exit 1
fi

echo "SRV: Restarting Web Service"
if sudo service gabsocial-web restart; then
	echo "SRV: Web Service Restarted Successfully"
else
	error=$?
	echo "SRV: Error Restarting Web Service"
	echo $error
	exit 1
fi

echo "SRV: Restarting Streaming Service"
if sudo service gabsocial-streaming restart; then
	echo "SRV: Streaming Service Restarted Successfully"
else
	error=$?
	echo "SRV: Error Restarting Streaming Service"
	echo $error
	exit 1
fi

exit 0
