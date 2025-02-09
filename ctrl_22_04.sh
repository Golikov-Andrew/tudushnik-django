if [ "$1" == "start" ]
then
    sudo docker compose up --force-recreate $2
    exit 0
fi

if [ "$1" == "stop" ]
then
    sudo docker compose down
    exit 0
fi

if [ "$1" == "build" ]
then
    sudo docker compose build $2
    exit 0
fi

if [ "$1" == "dev" ]
then
    sudo docker compose -f docker-compose-dev.yml up --remove-orphans --force-recreate $2
    exit 0
fi

if [ "$1" == "logs" ]
then
    sudo docker logs --follow --tail 10 cgg_server
    exit 0
fi

echo "Не выбрано действий"
exit 1