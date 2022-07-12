cd ~/live

echo "APP: Updating Dependencies (if any)"
if bundle install && yarn install; then
	echo "APP: Finished Updating Dependencies"
else
	error=$?
	echo "DB: Error During Dependency Update"
	echo $error
	exit 1
fi

echo "DB: Starting Migration (if any)"
if RAILS_ENV=production bundle exec rails db:migrate; then
	echo "DB: Finished Migration"
else
	error=$?
	echo "DB: Error During Migrating"
	echo $error
	exit 1
fi

echo "WEB: Starting Asset Compilation"
if RAILS_ENV=production bundle exec rails assets:precompile; then
	echo "WEB: Finished Asset Precompilation"
else
	error=$?
	echo "WEB: Error During Asset Precompilation"
	echo $error
	exit 1
fi

exit 0
