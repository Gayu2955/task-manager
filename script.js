const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.querySelector(".task-count");
const filterButtons = document.querySelectorAll(".filter-btns");
const clearCompletedBtn = document.getElementById("clear-completed-btn");

let currentFilter = "all";

// 1. Load saved tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];

// 2. Save tasks in localStorage
function saveTasks(){
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}

// 3. Display all tasks
function displayTasks() {
    taskList.innerHTML = ""

    const filterTasks = tasks.filter(function(task){
        if(currentFilter === "active"){
            return task.completed === false;
        }

        if(currentFilter === "completed"){
            return task.completed === true;
        }

        return true;
    });

    if(filterTasks.length === 0){
        const emptyMessage = document.createElement("p")
        emptyMessage.classList.add("empty-message");

        if(currentFilter === "active"){
            emptyMessage.textContent = "You're all caught up! 🎉";
        }
        else if (currentFilter === "completed") {
            emptyMessage.textContent = "No completed tasks yet.";
        }
        else{
            emptyMessage.textContent = "No tasks yet. Add your first task! 📝"
        }

        taskList.appendChild(emptyMessage);
    }

    filterTasks.forEach(function(task){
        const listItem = document.createElement("li");
        listItem.classList.add("task-item");

        const taskDetails = document.createElement("div");
        taskDetails.classList.add("task-details");

        // Checkbox completion
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.classList.add("task-checkbox");
        checkBox.checked = task.completed;
        checkBox.id = "task-" + task.id;

        const taskName = document.createElement("label");
        taskName.textContent = task.text;
        taskName.htmlFor = checkBox.id;
        taskName.classList.add("task-name");

        if(task.completed){
            taskName.style.textDecoration = "line-through";
        }

        checkBox.addEventListener("change", function(){
            task.completed = checkBox.checked
            saveTasks();
            displayTasks();
        });

        // Edit and Delete buttons
        const taskActionBtns = document.createElement("div")

        const editButton = document.createElement("button");
        editButton.type = "button"
        editButton.classList.add("edit-btn");
        editButton.setAttribute("aria-label", "Edit task");
        editButton.innerHTML = '<i class="fa-solid fa-pencil"></i>';

        const deleteButton = document.createElement("button");
        deleteButton.type = "button"
        deleteButton.classList.add("delete-btn");
        deleteButton.setAttribute("aria-label", "Delete task");
        deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';

        // Edit task
        editButton.addEventListener("click", function(){
            const updatedText = prompt("Edit your task:", task.text);

            if(updatedText !== null && updatedText.trim() !== ""){
                task.text = updatedText.trim();
                saveTasks();
                displayTasks();
            }
            else if(updatedText !== null){
                alert("Task cannot be empty!");
            }
        });

        // Delete task
        deleteButton.addEventListener("click", function(){
            const confirmDelete = confirm("Do you want to delete this task?");

            if(confirmDelete){
                tasks = tasks.filter(function(item){
                    return item.id !== task.id;
                });

                saveTasks();
                displayTasks();
            }
        });

        taskDetails.appendChild(checkBox);
        taskDetails.appendChild(taskName);

        taskActionBtns.appendChild(editButton);
        taskActionBtns.appendChild(deleteButton);

        listItem.appendChild(taskDetails);
        listItem.appendChild(taskActionBtns);

        taskList.appendChild(listItem);
    });
    
    const completedCount = tasks.filter(function(task){
        return task.completed;
    }).length;

    const activeCount = tasks.length - completedCount;

    taskCount.textContent = tasks.length + (tasks.length === 1 ? "Task" : "Tasks") +
    " . " + completedCount + " Completeed" + " . " + activeCount + " Active";
}

// 4. Filter the task
filterButtons.forEach(function(button){
    button.addEventListener("click", function(){
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(btn){
            btn.classList.remove("active")
        });
        button.classList.add("active");

        displayTasks();
    });
});

// 5. Clear completed task
clearCompletedBtn.addEventListener("click", function(){
    const completedTasks = tasks.filter(function(tasks){
        return tasks.completed;
    });

    if(completedTasks.length === 0){
        alert("No completed tasks to clear!");
        return;
    }

    const confirmClear = confirm("Clear all completed tasks?");

    if(confirmClear){
        tasks = tasks.filter(function(task){
        return !task.completed;
    });

    saveTasks();
    displayTasks();
    }
});

// 6. Add a new task
taskForm.addEventListener("submit", function(event){
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if(taskText === ""){
        alert("Please enter a task");
        return;
    }

    const newTask = {
        id: Date.now().toString(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    
    saveTasks();
    displayTasks();

    taskInput.value = "";
});

// 7. Display saved tasks when page opens
displayTasks();