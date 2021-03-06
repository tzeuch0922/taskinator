// Setup element queries
var pageContentEl = document.querySelector("#page-content");
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var taskIdCounter = 0;
var tasks = [];

loadTasks();

function taskFormHandler(event)
{
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    if(!taskNameInput || !taskTypeInput)
    {
        alert("You need to fill out the task form!");
        return false;
    }
    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");

    if(isEdit)
    {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }

    else
    {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        createTaskEl(taskDataObj);
    }
}
function createTaskEl(taskDataObj)
{
    // Create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // Add task id as custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    listItemEl.setAttribute("draggable", "true");

    // Create div to hold task info
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    tasksToDoEl.appendChild(listItemEl);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    taskIdCounter++;

    saveTasks();
}
function createTaskActions(taskId)
{
    // Create div to hold buttons
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // Create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // Create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    // Create select element
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    // Add options to select element
    var statusChoices = ["To Do", "In Progress", "Completed"];
    
    for(var i = 0; i < statusChoices.length; i++)
    {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        statusSelectEl.appendChild(statusOptionEl);
    }

    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;
}
function taskButtonHandler(event)
{
    var targetEl = event.target;
    if(targetEl.matches(".edit-btn"))
    {
        var taskId = event.target.getAttribute("data-task-id");
        editTask(taskId);    
    }
    else if(targetEl.matches(".delete-btn"))
    {
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }
}
function editTask(taskId)
{
    console.log("editing task #" + taskId);

    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // Get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log(taskType);

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
}
function completeEditTask(taskName, taskType, taskId)
{
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    for(var i = 0; i<tasks.length; i++)
    {
        if(tasks[i].id === parseInt(taskId))
        {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";

    saveTasks();
}
function deleteTask(taskId)
{
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    var updatedTaskArr = [];

    for(var i = 0; i<tasks.length; i++)
    {
        if(tasks[i].id !== parseInt(taskId))
        {
            updatedTaskArr.push(tasks[i]);
        }
    }

    tasks = updatedTaskArr;

    saveTasks();
}
function taskStatusChangeHandler(event)
{
    var taskId = event.target.getAttribute("data-task-id");

    var statusValue = event.target.value.toLowerCase();

    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if(statusValue === "to do")
    {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if(statusValue === "in progress")
    {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if(statusValue === "completed")
    {
        tasksCompletedEl.appendChild(taskSelected);
    }

    for(var i = 0; i<tasks.length; i++)
    {
        if(tasks[i].id == parseInt(taskId))
        {
            tasks[i].status = statusValue;
        }
    }

    saveTasks();
}
function dragTaskHandler(event)
{
    var taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);
}
function dropZoneDragHandler(event)
{
    var taskListEl = event.target.closest(".task-list");
    if(taskListEl)
    {
        event.preventDefault();
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
}
function dropTaskHandler(event)
{
    var id = event.dataTransfer.getData("text/plain");

    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;
    
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    
    if(statusType === "tasks-to-do")
    {
        statusSelectEl.selectedIndex = 0;
    }
    else if(statusType === "tasks-in-progress")
    {
        statusSelectEl.selectedIndex = 1;
    }
    else if(statusType === "tasks-completed")
    {
        statusSelectEl.selectedIndex = 2;
    }

    dropZoneEl.appendChild(draggableElement);

    dropZoneEl.removeAttribute("style");

    for(var i = 0; i<tasks.length; i++)
    {
        if(tasks[i].id === parseInt(id))
        {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }

    saveTasks();
}
function dragLeaveHandler(event)
{
    var taskListEl = event.target.closest(".task-list");
    if(taskListEl)
    {
        taskListEl.removeAttribute("style");
    }
}
function saveTasks()
{
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks()
{
    // Gets task items from localStorage
    tasks = localStorage.getItem("tasks");
    // console.log(tasks);

    if(tasks === null)
    {
        tasks = [];
        return false;
    }

    // Converts tasks from the stringified format back into an array of objects
    tasks = JSON.parse(tasks);

    // Iterates through tasks array and creates task elements on the page from it
    for(var i = 0; i<tasks.length; i++)
    {
        tasks[i].id = taskIdCounter;
        
        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
        listItemEl.setAttribute("data-task-id", tasks[i].id);
        listItemEl.setAttribute("draggable", true);
        
        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
        listItemEl.appendChild(taskInfoEl);

        var taskActionsEl = createTaskActions(tasks[i].id);
        listItemEl.appendChild(taskActionsEl);

        if(tasks[i].status === "to do")
        {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.appendChild(listItemEl);
        }
        else if(tasks[i].status === "in progress")
        {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);
        }
        else if(tasks[i].status === "completed")
        {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.appendChild(listItemEl);
        }

        taskIdCounter++;
    }
}

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);