// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", nextId);
}
// function to generate a unique task id
function generateTaskId() {
    console.log("Generating task ID...");
    let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;
    nextId++;
    localStorage.setItem("nextId", nextId);
    return nextId;
}

// function to create a task card
function createTaskCard(task) {
    console.log("Creating task card for task:", task);
    const card = $('<div>').addClass('task-card').attr('data-task-id', task.id);

    const cardBody = $('<div>').addClass('card-body');

    const title = $('<h5>').addClass('card-title').text(task.name);

    const progress = $('<p>').addClass('card-text').text("Progress: " + task.progress);

    cardBody.append(title, progress);

    // Create delete button
    const deleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-task-id', task.id)
        .on('click', function() {
            handleDeleteTask(task.id);
        });

    cardBody.append(deleteBtn);

    card.append(cardBody);

    // Check if due date is present and set color based on due date
    if (task.dueDate) {
        const dueDate = dayjs(task.dueDate);
        const today = dayjs();
        const daysUntilDue = dueDate.diff(today, 'day');

        if (daysUntilDue < 0) {
            // Task is overdue (red)
            card.addClass('bg-danger');
        } else if (daysUntilDue <= 3) {
            // Task is nearing the deadline (yellow)
            card.addClass('bg-warning');
        }
    }

    return card;
}



//  function to render the task list and make cards draggable
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
        start: function(event, ui) {
            console.log("Dragging started...");
        }
    });
    
}


// function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    console.log("Handling task addition...");

    const taskName = $("#taskName").val();
    const dueDate = $("#dueDate").val();
    const description = $("#description").val();

    const newTask = {
        id: generateTaskId(),
        name: taskName,
        dueDate: dueDate,
        description: description,
        progress: "todo"
    };

    taskList.push(newTask);

    saveTasks();

    renderTaskList();

    $("#formModal").modal("hide");

    // Clear input fields after submission
    $("#taskName").val("");
    $("#dueDate").val("");
    $("#description").val("");

    console.log("Task addition handled successfully.");
}


// function to handle deleting a task
function handleDeleteTask(event) {
   event.preventDefault(); // Stop the event from bubbling up

    console.log("Handling task deletion...");

    // Get the task card element that contains the delete button
    const taskCard = $(event.target).closest('.task-card');
    const taskId = taskCard.data('taskId');

    // Find the index of the task with the corresponding ID in the taskList array
    const taskIndex = taskList.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        // Remove the task from the taskList array
        taskList.splice(taskIndex, 1);

        // Save the updated taskList to localStorage
        saveTasks();

        // Remove the task card element from the task board
        taskCard.remove();

        console.log("Task deletion handled successfully.");
    }
}



// function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    
    event.preventDefault();

    // Identify the task being dropped
    const taskId = ui.draggable.data('taskId');

    // Identify the drop target (lane ID)
    const dropTargetId = $(event.target).attr('id');

    // Determine the new progress status based on the drop target
    let newProgress;
    switch (dropTargetId) {
        case 'to-do':
            newProgress = 'todo';
            break;
        case 'in-progress':
            newProgress = 'in-progress';
            break;
        case 'done':
            newProgress = 'done';
            break;
        default:
            console.error('Invalid drop target.');
            return;
    }

    // Find the dropped task in the taskList array
    const droppedTaskIndex = taskList.findIndex(task => task.id === taskId);

    // If the dropped task is found
    if (droppedTaskIndex !== -1) {
        // Update the progress status of the dropped task
        taskList[droppedTaskIndex].progress = newProgress;

        // Save the updated taskList to localStorage
        saveTasks();

        // Re-render the task list to reflect the changes
        renderTaskList();
    } else {
        console.error('Dropped task not found.');
    }
}


function initializeTaskBoard() {

    renderTaskList();

    $("#addTaskForm").submit(handleAddTask);

    $(".lane").droppable({
        accept: ".task-card",
        drop: handleDrop
    });
}
// when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    initializeTaskBoard();
});




