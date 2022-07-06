### Разработка

python -m venv venv  
source venv/bin/activate  
pip install -r requirements.txt  
pip freeze > requirements.txt  


### Разворачивание приложения
Создать `.env` по шаблону `.env-template`.    
`sudo bash ctrl.sh build`   
python3 manage.py migrate  
python3 manage.py collectstatic  
python3 manage.py createsuperuser  
  

### Запуск приложения
`sudo bash ctrl.sh start`  


