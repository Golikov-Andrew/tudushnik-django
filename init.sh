#!/bin/bash

# User credentials
user=admin
email=admin@example.com
password=DfkthmtdbxUtyyflmtdbx_22

python3 manage.py migrate
python3 manage.py collectstatic
echo "from django.contrib.auth.models import User; User.objects.create_superuser('$user', '$email', '$password')" | python3 manage.py shell