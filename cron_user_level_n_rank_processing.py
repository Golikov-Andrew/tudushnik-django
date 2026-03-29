import os
import sys
import traceback
import django

sys.path.append('/usr/src/app_tdm')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app_tdm.settings')
django.setup()

from datetime import datetime

from tudushnik.models.user_profile_settings import UserProfileSettings
from tudushnik.models.user_level import UserLevel
from tudushnik.models.user_rank import UserRank
from django.db.models import Q


def write_log(text):
    with open(
            f'logs/cron_user_level_n_rank_processing/{datetime.now().strftime("%Y-%m-%d")}.log',
            'a') as f:
        f.write(f'{datetime.now()}\t{text}\n')


try:

    all_user_levels = UserLevel.objects.all()
    for level in all_user_levels:
        print(level, level.min_points, level.max_points)
        user_profile_settings = UserProfileSettings.objects.filter(
            ~Q(level_id=level.pk),
            points_now__gte=level.min_points,
            points_now__lt=level.max_points
        ).all()

        for s in user_profile_settings:
            s.level_id = level.pk
            s.save()

    all_user_ranks = UserRank.objects.all()
    for rank in all_user_ranks:
        print(rank, rank.min_points, rank.max_points)
        user_profile_settings = UserProfileSettings.objects.filter(
            ~Q(rank_id=rank.pk),
            points_now__gte=rank.min_points,
            points_now__lt=rank.max_points
        ).all()

        for s in user_profile_settings:
            s.level_id = level.pk
            s.save()

except:
    write_log(traceback.format_exc())
