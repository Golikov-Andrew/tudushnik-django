if [ "$1" == "start" ]
then
    sudo docker-compose up --force-recreate
    exit 0
fi

if [ "$1" == "stop" ]
then
    sudo docker-compose down
    exit 0
fi

if [ "$1" == "build" ]
then
    sudo docker-compose build
    exit 0
fi

echo "Не выбрано действий"
exit 1