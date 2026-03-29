from tudushnik.models.user_event import UserEvent
from tudushnik.models.user_event_snapshot import UserEventSnapshot


def dispatch_event(event_type: str, user_settings):
    event = UserEvent.objects.get(event_type=event_type)
    points_delta = event.points_delta
    user_points_after_event = user_settings.points_now + points_delta
    if user_points_after_event < 0:
        user_points_after_event = 0
    user_settings.points_now = user_points_after_event
    if points_delta > 0:
        user_settings.points_total += points_delta
    user_settings.save()

    UserEventSnapshot.objects.create(
        user_settings=user_settings,
        event_title=event.title,
        event_description=event.description,
        event_points_delta=event.points_delta,
        user_points_after_event=user_points_after_event,
    )