// Setup element queries
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

function createTaskHandler(event)
{
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // Create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // Create div to hold task info
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskNameInput + "</h3><span class='task-type'>" + taskTypeInput + "</span>";
    
    listItemEl.appendChild(taskInfoEl);

    tasksToDoEl.appendChild(listItemEl);
}

formEl.addEventListener("submit", createTaskHandler);