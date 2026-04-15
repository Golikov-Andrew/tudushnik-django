### Разработка

python -m venv venv  
source venv/bin/activate  
pip install -r requirements.txt  
pip freeze > requirements.txt

Запуск контейнеров для разработки:  
Проверьте переменные `DEBUG_MODE_VAL` и `PRODUCTION_MODE_VAL` в файле `.env`. Далее   
`sudo bash ctrl_22_04.sh dev`

Для включения JS вотчера:  
`sudo docker exec -it tudushnik-django-tdm_server-1 bash`  
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

### crontab  
Предварительно создать папки logs/cron_user_level_n_rank_processing и logs/cron_user_event_processing  
`*/30 * * * * docker exec personal-django-site-gav-tdm_server-1 bash -c "python cron_user_level_n_rank_processing.py >> /var/log/cron.log 2>&1"`  
`0 2 * * * docker exec personal-django-site-gav-tdm_server-1 bash -c "python cron_user_event_processing.py >> /var/log/cron.log 2>&1"`  

### Locale  
Сгенерировать изначальные файлы po в папке locale:  
`python manage.py makemessages -l ru --ignore=venv/*`  
Затем заполнить переводы  
Затем скомпилировать переводы  
`python manage.py compilemessages --ignore="venv/*" --ignore="node_modules/*"`


