python -m venv venv  
source venv/bin/activate  
pip install -r requirements.txt  
pip freeze > requirements.txt

django-admin startproject app_tdm
python3 manage.py startapp tudushnik
python3 manage.py startapp auth

python
`cd app_tdm`
`sudo bash ctrl.sh build`  

### Запуск приложения
`sudo bash ctrl.sh start`  
