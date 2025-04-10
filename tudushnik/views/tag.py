from django.contrib.auth import get_user
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView, UpdateView

from tudushnik.forms.tag import TagUpdateForm, AddTagForm
from tudushnik.middleware import set_client_timezone

from tudushnik.models.tag import Tag


class TagListView(ListView):
    model = Tag
    template_name = 'tudushnik/tags_page.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Тэги'
        per_page = self.request.GET.get('limit')
        if per_page is None:
            per_page = 5
        all_tags = Tag.objects.filter(owner_id=self.request.user.id).all()
        paginator = Paginator(all_tags, int(per_page))
        page_number = self.request.GET.get('page')
        context['page_obj'] = paginator.get_page(page_number)
        context['limit'] = per_page
        context['len_records'] = len(all_tags)
        context['page_title_eng'] = 'tags_page'
        set_client_timezone(self.request, context)
        return context


class TagDetailView(DetailView):
    model = Tag
    template_name = 'tudushnik/tag_detail.html'

    def get_queryset(self):
        return Tag.objects.all()

    def get_object(self, query_set=None):
        obj = super().get_object()
        return obj

    # def get_context_data(self, **kwargs):
    #     context = super().get_context_data(**kwargs)
    #     context['title'] = context["project"]
    #     all_tasks = Task.objects.filter(project=context['project']
    #     ).select_related()
    #     per_page = self.request.GET.get('limit')
    #     if per_page is None:
    #         per_page = 5
    #     paginator = Paginator(all_tasks, int(per_page))
    #     page_number = self.request.GET.get('page')
    #     context['page_obj'] = paginator.get_page(page_number)
    #     context['limit'] = per_page
    #     context['len_records'] = paginator.count
    #     return context


class TagUpdateView(UpdateView):
    model = Tag
    template_name_suffix = '_update_form'
    form_class = TagUpdateForm


def add_tag(request, *args, **kwargs):
    if request.method == 'POST':
        form = AddTagForm(request.POST, request.FILES)
        if form.is_valid():
            form.instance.owner = get_user(request)
            form.save()
            return redirect('tags_page')
    else:
        form = AddTagForm()
    return render(request, 'tudushnik/add_tag.html',
                  {'form': form, 'title': 'Создание тэга'})


def tag_delete(request, pk: int, *args, **kwargs):
    if request.method == 'POST':
        target_object = Tag.objects.filter(owner_id=request.user.id,
                                           pk=pk).first()
        target_object.delete()
        return JsonResponse({"success": True})
