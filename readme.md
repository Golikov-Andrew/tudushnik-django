### Разработка

python -m venv venv  
source venv/bin/activate  
pip install -r requirements.txt  
pip freeze > requirements.txt

Запуск контейнеров для разработки:  
Проверьте переменные `DEBUG_MODE_VAL` и `PRODUCTION_MODE_VAL` в файле `.env`. Далее   
`sudo bash ctrl_22_04.sh dev`

Для включения JS вотчера:  
`sudo docker exec -it personal-django-site-gav_tdm_server_1 bash`  
`cd tudushnik/static/tudushnik/js && npm run dev`


### Вёрстка
Работаем в less файлах, компилим в css папку.
Коммитим изменения и там, и там.


### Разворачивание приложения
Создать `.env` по шаблону `.env-template`.    
`sudo bash ctrl.sh build`   
`python3 manage.py migrate `   
`python3 manage.py collectstatic `   
`python3 manage.py createsuperuser`    
  

### Запуск приложения на продакшене
`sudo bash ctrl.sh start`  


