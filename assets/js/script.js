// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", nextId);
}
// Todo: create a function to generate a unique task id
function generateTaskId() {
    console.log("Generating task ID...");
    let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;
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

    // Check if taskList is null or undefined
    if (!taskList) {
        console.error("Task list is null or undefined.");
        return;
    }

    // Clear the task cards from each lane
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    // Render each task card based on its progress
    taskList.forEach(function(task) {
        const taskCard = createTaskCard(task);
        console.log(task);
        switch (task.progress) {
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

    // Make the task cards draggable
    $('.task-card').draggable({
        revert: 'invalid',
        stack: '.task-card',
        cursor: 'move',
        opacity: 0.7,
        helper: 'clone',
    });
    // $('.task-card').draggable();
    //draggable
        // opacity: 0.7,
        // zIndex: 100,
        // // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
        // helper: function (e) {
        //   // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
        //   const original = $(e.target).hasClass('ui-draggable')
        //     ? $(e.target)
        //     : $(e.target).closest('.ui-draggable');
        //   // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
        //   return original.clone().css({
        //     width: original.outerWidth(),
        //   });
        // },
    //   });

    // console.log("Task list rendering completed.");
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
    event.preventDefault();

    const taskIdToDelete = $(event.target).closest('.task-card').data('taskId');

    const taskIndex = taskList.findIndex(task => task.id === taskIdToDelete);

    if (taskIndex !== -1) {
        taskList.splice(taskIndex, 1);
        saveTasks();
        renderTaskList();
    }
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
    initializeTaskBoard();
});

// if (typeof(Storage) !== "undefined") {
//     console.log("Local storage is supported.");
// } else {
//     console.log("Local storage is not supported.");
// }

// $(document).ready(function () {
//     // Initialize taskList and nextId if not present in local storage
//     if (!taskList) {
//         taskList = [];
//         saveTasks();
//     }
//     if (!nextId) {
//         nextId = 1;
//         saveTasks();
//     }

//     // Initialize the task board
//     initializeTaskBoard();
// });


