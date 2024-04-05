// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", nextId);
}
// Todo: create a function to generate a unique task id
function generateTaskId() {
    console.log("Generating task ID...");
    let nextId = JSON.parse(localStorage.getItem("nextId"));
    nextId++;
    localStorage.setItem("nextId", nextId);
    return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    console.log("Creating task card for task:", task);
    const card = document.createElement('div');
    card.classList.add('task-card');
    card.dataset.taskId = task.id;

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = task.name;

    const progress = document.createElement('p');
    progress.classList.add('card-text');
    progress.textContent = "Progress: " + task.progress;

    cardBody.appendChild(title);
    cardBody.appendChild(progress);
    card.appendChild(cardBody);

    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    console.log("Rendering task list...");
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    taskList.forEach(function(task){
        const taskCard = createTaskCard(task);

        switch(task.progress) {
            case 'todo':
                $('#todo-cards').append(taskCard);
                break;
            case 'in-progress':
                $('#in-progress-cards').append(taskCard);
                break;
            case 'done':
                $('#done-cards').append(taskCard);
                break;
            default:
                break;
        }
    });

    $('.task-card').draggable({
        revert: 'invalid',
        stack: '.task-card',
        cursor: 'move',
        opacity: 0.7,
        helper: 'clone',
    })
    console.log("Task list rendering completed.");

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    console.log("Handling task addition...");

    const taskName = $("#taskName").val();

    const newTask = {
        id: generateTaskId(),
        name: taskName,
        progress: "todo"
    };

    taskList.push(newTask);

    saveTasks();

    renderTaskList();

    $("#formModal").modal("hide");

    $("#taskName").val("");

    console.log("Task addition handled successfully.");

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

function initializeTaskBoard() {

    renderTaskList();

    $("#addTaskForm").submit(handleAddTask);

    $(".lane").droppable({
        accept: ".task-card",
        drop: handleDrop
    });
}
// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});
