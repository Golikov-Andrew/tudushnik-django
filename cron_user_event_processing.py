import os
import sys
import traceback
import django

sys.path.append('/usr/src/app_tdm')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app_tdm.settings')
django.setup()

from datetime import datetime, timedelta
from django.utils import timezone
from tudushnik.models.user_event_snapshot import UserEventSnapshot
from tudushnik.common import dispatch_event
from tudushnik.models.user_profile_settings import UserProfileSettings
from django.db.models import Exists, OuterRef
from django.db.models import Q


def write_log(text):
    with open(
            f'logs/cron_user_event_processing/{datetime.now().strftime("%Y-%m-%d")}.log',
            'a') as f:
        f.write(f'{datetime.now()}\t{text}\n')


try:
    cutoff_time = timezone.now() - timedelta(days=1)

    has_recent_events = UserEventSnapshot.objects.filter(
        ~Q(event_title='Сегодня были активны'),
        ~Q(event_title='Сегодня бездействовали'),
        user_settings=OuterRef('pk'),
        happened_at__gte=cutoff_time,

    )
    # Аннотируем всех пользователей флагом активности
    all_users_with_activity = UserProfileSettings.objects.annotate(
        is_active=Exists(has_recent_events)
    )

    # Фильтруем только активных и отправляем события
    for user_settings in all_users_with_activity.filter(is_active=True):
        dispatch_event('activity_today', user_settings)
    # Фильтруем только неактивных и отправляем события
    for user_settings in all_users_with_activity.filter(is_active=False):
        dispatch_event('not_activity_today', user_settings)
except:
    write_log(traceback.format_exc())
