import os

from dotenv import load_dotenv

load_dotenv()
BASIC_AUTH_USER = os.getenv('BASIC_AUTH_USER')
BASIC_AUTH_PSWD = os.getenv('BASIC_AUTH_PSWD')
# INTERNAL_API_KEY = os.getenv('INTERNAL_API_KEY')
# API_USER = os.getenv('API_USER')
# API_PSWD = os.getenv('API_PSWD')
