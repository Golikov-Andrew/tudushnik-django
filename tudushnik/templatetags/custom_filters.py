from django import template

register = template.Library()


def create_class_of_navbar_link_by_title(page_title: str, target_title: str):
    if page_title == target_title:
        return 'navbar-link navbar-link-active'
    return 'navbar-link'


def is_selected(choosen_val: str, val: str):
    if choosen_val == val:
        return 'selected'
    return ''


register.filter('create_class_of_navbar_link_by_title', create_class_of_navbar_link_by_title)
register.filter('is_selected', is_selected)
