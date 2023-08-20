from django import template
from django.utils.safestring import mark_safe

register = template.Library()


def create_class_of_navbar_link_by_title(page_title: str, target_title: str):
    if page_title == target_title:
        return 'navbar-link navbar-link-active'
    return 'navbar-link'


def is_selected(choosen_val, val: str):
    if str(choosen_val) == val:
        return 'selected'
    return ''


def duration_humanize(dur_val):
    result = list()
    dur_val = int(dur_val)
    hours = (dur_val) // (60 * 60)
    minutes = (dur_val - (hours * 60 * 60)) // 60
    seconds = dur_val - ((hours * 60 * 60) + (minutes * 60))
    if hours != 0:
        result.append(f'{hours} часов')
    if minutes != 0:
        result.append(f'{minutes} минут')
    if seconds != 0:
        result.append(f'{seconds} секунд')

    return ', '.join(result)


def create_table_column_search_and_sorting_widget(data_field_name: str,
                                                  search_input_size: int):
    return mark_safe(f"""
    <div class="search_and_sorting_widget" data-field-name="{data_field_name}">
<input type="text" placeholder="Search" class="inp_table_column_search"
 size="{search_input_size}">
 <div>
<button class="table_column_sorting" value="">&uarr;</button>
<button class="table_column_sorting" value="-">&darr;</button>
</div>
</div>
    """)


def create_table_column_multi_filter_widget(data_field_name: str,
                                            val_list: list):
    options = list()
    for val in val_list:
        options.append(f'<option value="{val.id}">{val.title}</option>')
    return mark_safe(f"""
    <div class="multi_filter_widget" data-field-name="{data_field_name}">
    <select class="slct_table_column_multi_filter" size="3"
        multiple="multiple">
    {''.join(options)}
    </select></div>
    """)


@register.simple_tag
def define(val=None):
    return val


register.filter('create_class_of_navbar_link_by_title',
                create_class_of_navbar_link_by_title)
register.filter('is_selected', is_selected)
register.filter('create_table_column_search_and_sorting_widget',
                create_table_column_search_and_sorting_widget)
register.filter('duration_humanize', duration_humanize)
register.filter('create_table_column_multi_filter_widget',
                create_table_column_multi_filter_widget)
