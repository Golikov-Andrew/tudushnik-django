import django_filters

from tudushnik.models.tag import Tag


class TagFilter(django_filters.FilterSet):
    class Meta:
        model = Tag
        fields = {
            'title': ['icontains', 'exact'],
            'color': ['icontains'],
            'created_at': ['gte', 'lte'],
            'updated_at': ['gte', 'lte'],
        }
