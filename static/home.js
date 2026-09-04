const taskInput = document.getElementById("task-input");
const addTask = document.getElementById("add-task");
const taskContainer = document.getElementById("task-container");


const allCount = document.getElementById("all-count");
const completedCount = document.getElementById("completed-count");
const pendingCount = document.getElementById("pending-count");


const searchButton = document.getElementById("search-task");
const taskFilter = document.getElementById("task-filter");




// ADD TASK
addTask.addEventListener("click",function(){

    let taskText = taskInput.value.trim();

    if(taskText === "") 
    {
        alert("Please enter a task");
        return;
    }

    const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;


    fetch("/tasks/add/", {

        method: "POST",

        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": csrfToken
        },

        body: new URLSearchParams({
            content: taskText
        })
    })
    
    .then(response => response.json())
    
    .then(data => {
        if(data.success) 
        {
            createTaskElement(data.task);
            taskInput.value = "";
            updateCounters();
        }
        else 
        {
            alert(data.error);
        }
    })
    
    .catch(error => {
        console.error("Error:", error);
    });
});



 

function loadTasks() 
{
    fetch("/tasks/get/", {
        method: "GET"
    })
    
    .then(response => response.json())
    
    .then(data => {

            taskContainer.innerHTML = "";

            for(let i = 0;i < data.tasks.length;i++) 
            {
                createTaskElement(data.tasks[i]);
            }
            updateCounters();
        })

        .catch(error => {
            console.error("Error loading tasks:", error);
        });
}
loadTasks();





function createTaskElement(taskData){

    let task = document.createElement("div");
    task.classList.add("tasks");
    task.dataset.id = taskData.id;

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("check-box");
    checkbox.checked = taskData.completed;

    let heading = document.createElement("h3");
    heading.textContent = taskData.title;

    let buttons = document.createElement("div");





    let editButton = document.createElement("button");

    editButton.innerHTML = `<span class="material-symbols-outlined">edit</span>Edit`;
    editButton.style.border = "2px solid #FFBF00";
    editButton.style.color = "#FFBF00";
    editButton.style.backgroundColor = "white";
    editButton.style.cursor = 'pointer';
    editButton.style.transition = 'all 0.2s ease';


    editButton.addEventListener('mouseenter', () => {
        editButton.style.backgroundColor = '#FFBF00';
        editButton.style.color = 'white';
    });


    editButton.addEventListener('mouseleave', () => {
        editButton.style.backgroundColor = 'white';
        editButton.style.color = '#FFBF00';
    });





    let deleteButton = document.createElement("button");

    deleteButton.innerHTML = `<span class="material-symbols-outlined">delete</span>Delete`;
    deleteButton.style.border = "2px solid red";
    deleteButton.style.color = "red";
    deleteButton.style.backgroundColor = "white";


    deleteButton.addEventListener('mouseenter', () => {
        deleteButton.style.backgroundColor = 'red';
        deleteButton.style.color = 'white';
    });


    deleteButton.addEventListener('mouseleave', () => {
        deleteButton.style.backgroundColor = 'white';
        deleteButton.style.color = 'red';
    });





    buttons.appendChild(editButton);
    buttons.appendChild(deleteButton);

    task.appendChild(checkbox);
    task.appendChild(heading);
    task.appendChild(buttons);

    taskContainer.appendChild(task);





































    checkbox.addEventListener("change", function(){

        const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

        fetch("/tasks/update/", {
            method: "POST",

            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-CSRFToken": csrfToken
            },

            body: new URLSearchParams({
                id: taskData.id,
                completed: checkbox.checked
            })
        })

        .then(response => response.json())

        .then(data => {

            if(data.success) 
            {
                if(checkbox.checked) 
                {
                    heading.style.textDecoration = "line-through";
                    heading.style.opacity = "0.5";
                }
                else 
                {
                    heading.style.textDecoration = "none";
                    heading.style.opacity = "1";
                }
                updateCounters();

            }
            else 
            {
                alert(data.error);
                checkbox.checked = !checkbox.checked;
            }

        })

        .catch(error => {
            console.error("Error:", error);
            checkbox.checked = !checkbox.checked;
        });
    });





    editButton.addEventListener("click", function(){

        let newTask = prompt("Edit task:",heading.textContent);

        if (newTask !== null && newTask.trim() !== "") {

            const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

            fetch("/tasks/update/", {

                method: "POST",

                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-CSRFToken": csrfToken
                },

                body: new URLSearchParams({
                    id: taskData.id,
                    title: newTask.trim()
                })
            })

            .then(response => response.json())

            .then(data => {

                if(data.success) 
                {
                    heading.textContent = newTask.trim();
                }
                else 
                {
                    alert(data.error);
                }

            })

            .catch(error => {
                console.error("Error:", error);
            });
        }
    });





    deleteButton.addEventListener("click",function(){

        if(!confirm("Are you sure you want to delete this task?")) 
        {
            return;
        }

        const csrfToken = document.querySelector(
            "[name=csrfmiddlewaretoken]"
        ).value;

        fetch("/tasks/delete/", {

            method: "POST",

            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-CSRFToken": csrfToken
            },

            body: new URLSearchParams({
                id: taskData.id
            })
        })

        .then(response => response.json())

        .then(data => {

            if(data.success) 
            {
                task.remove();
                updateCounters();
            }
            else 
            {
                alert(data.error);
            }

        })

        .catch(error => {
            console.error("Error:", error);
        });
    });
}




































// UPDATE COUNTERS
function updateCounters() 
{
    // Get all tasks
    let tasks = document.querySelectorAll(".tasks");

    let all = tasks.length;
    let completed = 0;
    let pending = 0;


    // Check each task
    for(let i = 0;i < tasks.length;i++) 
    {
        let task = tasks[i];
        let checkbox = task.querySelector(".check-box");
        if(checkbox.checked) 
        {
            completed++;
        } 
        else 
        {
            pending++;
        }
    }


    // Display counters
    allCount.textContent = all;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;
}


//SEARCH TASK
searchButton.addEventListener("click", function () {

    const searchText = taskInput.value.trim().toLowerCase();
    const filter = taskFilter.value;

    const tasks = document.querySelectorAll(".tasks");

    tasks.forEach(function(task) {

        const taskHeading = task.querySelector("h3");
        const checkbox = task.querySelector(".check-box");

        const taskName = taskHeading.textContent.toLowerCase();

        // Check search text
        const matchesSearch = taskName.includes(searchText);

        // Check filter
        let matchesFilter = true;

        if(filter === "completed") 
        {
            matchesFilter = checkbox.checked;
        }
        if(filter === "pending") 
        {
            matchesFilter = !checkbox.checked;
        }

        // Show or hide task
        if(matchesSearch && matchesFilter) 
        {
            task.style.display = "flex";
        } 
        else 
        {
            task.style.display = "none";
        }
    });
});