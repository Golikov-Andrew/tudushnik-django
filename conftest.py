import os

import pytest

from app_tdm import settings


@pytest.fixture(scope='session')
def django_db_setup():
    settings.DATABASES['default'] = {
        'ENGINE': 'django.db.backends.postgresql',
        'HOST': 'tdm_db',
        'NAME': os.environ.get('TDM_DATABASE_DTBS'),
    }
