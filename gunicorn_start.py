import os

# os.system(
#     "gunicorn --worker-class eventlet --timeout 300 -b :8000 -w 1 /usr/src/app_tdm/app_tdm.wsgi:application")

# os.system(
#     "gunicorn --workers 5 --bind unix:/run/gunicorn.sock /usr/src/app_tdm/app_tdm.wsgi:application")

os.system(
    "gunicorn --workers 2 -b :8000 app_tdm.wsgi:application")
