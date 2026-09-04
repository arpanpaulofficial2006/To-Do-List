from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Task


@login_required
def get_tasks(request):
    tasks = Task.objects.filter(user = request.user).order_by("created_at")

    data = []

    for task in tasks:
        data.append({"id": task.id,"title": task.title,"completed": task.completed})

    return JsonResponse({"tasks": data})


@login_required
def add_task(request):

    if request.method == "POST":
        content = request.POST.get("content").strip()

        if not content:
            return JsonResponse({"success": False,"error": "Task cannot be empty"},status = 400)

        task = Task.objects.create(user = request.user,title = content)
        return JsonResponse({"success": True,"task": {"id": task.id,"title": task.title,"completed": task.completed}})

    return JsonResponse({"success": False,"error": "Invalid request"},status = 400)




@login_required
def update_task(request):

    if request.method == "POST":

        task_id = request.POST.get("id")
        task = Task.objects.get(id = task_id,user = request.user)

        if "title" in request.POST:
            task.title = request.POST.get("title")

        if "completed" in request.POST:
            task.completed = request.POST.get("completed") == "true"

        task.save()

        return JsonResponse({"success": True})

    return JsonResponse({"success": False,"error": "Invalid request"})





@login_required
def delete_task(request):

    if request.method == "POST":

        task_id = request.POST.get("id")
        task = Task.objects.get(id = task_id,user = request.user)
        task.delete()

        return JsonResponse({"success": True})

    return JsonResponse({"success": False,"error": "Invalid request"})