from django import template
from django.utils.html import escape, html_safe
from django.utils.safestring import mark_safe

register = template.Library()


def create_class_of_navbar_link_by_title(page_title: str, target_title: str):
    if page_title == target_title:
        return 'navbar-link navbar-link-active'
    return 'navbar-link'


def is_selected(choosen_val: str, val: str):
    if choosen_val == val:
        return 'selected'
    return ''


def create_table_column_search_and_sorting_widget(data_field_name: str, search_input_size: int):
    return mark_safe(f"""
    <div class="search_and_sorting_widget" data-field-name="{data_field_name}">
                    <input type="text" placeholder="Search" class="inp_table_column_search" size="{search_input_size}">
                    <button class="table_column_sorting" value="ASC">&uarr;</button>
                    <button class="table_column_sorting" value="DESC">&darr;</button>
                </div>
    """)


register.filter('create_class_of_navbar_link_by_title', create_class_of_navbar_link_by_title)
register.filter('is_selected', is_selected)
register.filter('create_table_column_search_and_sorting_widget', create_table_column_search_and_sorting_widget)
