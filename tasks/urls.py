from django.urls import path
from . import views

urlpatterns = [
    path("get/",views.get_tasks,name = "get_tasks"),
    path("add/",views.add_task,name = "add_task"),
    path("update/", views.update_task, name="update_task"),
    path("delete/", views.delete_task, name="delete_task"),
]