from django.shortcuts import redirect, render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login
from django.contrib.auth.decorators import login_required

def LoginPage(request):

    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request,username = username,password = password)

        if user is not None:
            login(request,user)
            return redirect('home')
        else:
            return render(request,"login.html",{"error": "YOUR ENTERED CREDENTIALS ARE INCORRECT!"})

    return render(request,"login.html")

def SignUpPage(request):

    if request.method == "POST":
        username = request.POST.get("name")
        email = request.POST.get("email")
        password = request.POST.get("password")
        cpassword = request.POST.get("cpassword")

        if password != cpassword:
            return render(request,"signup.html",{"error": "YOUR PASSWORDS ARE NOT MATCHING WITH EACH OTHER"})
        else:
            user = User.objects.create_user(username,email,password)
            user.save()
            
    return render(request,"signup.html")

@login_required
def HomePage(request):
    return render(request,"home.html")