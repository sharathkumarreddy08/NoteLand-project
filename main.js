var right = document.querySelector('.right');
var noteButton = document.querySelector('.noteButton');
var noteList = document.querySelector('.noteslist');
var createNoteDiv = document.querySelector('.createNote');
var noteTitle = document.querySelector('.noteTitle');
var noteContent = document.querySelector('.noteContent');
var addNoteBtn = document.querySelector('.addButton');

noteButton.addEventListener('click',()=>{
    if(right.querySelector('.openNotes')){
        right.querySelector('.openNotes').remove();
    }
    document.querySelector('.nofiles').style.zIndex = '-1'
    createNoteDiv.style.display = 'block';

    if (createNoteDiv.style.display == 'none') {
        createNote.disabled = true;
    }
});

addNoteBtn.addEventListener('click', function () {
    document.querySelector('.nofiles').style.zIndex = '-1'
    var UniqueID = 'note' + Math.floor(Math.random() * 1000);
    if(noteTitle.value === ''){
        alert('Title cannot be empty')
        return
    }
    if(noteContent.value === ''){
        alert('Content cannot be empty')
        return
    }
    var note = {
        title: noteTitle.value,
        content: noteContent.value,
        UniqueID: UniqueID,
        noteTask: []
    };

    renderNoteInList(note);
    noteTitle.value = '';
    noteContent.value = '';
    noteButton.disabled = false;

    addNoteToLocalStorage(note);
});

function renderNoteInList(note) {
    var noteDiv = document.createElement('div');
    noteDiv.classList.add('note', note.UniqueID);

    var title = document.createElement('h2');
    title.className = 'title';
    title.textContent = note.title;

    var content = document.createElement('p');
    content.className = 'content';
    content.textContent = String(note.content).split(' ')[0] + "  ...";

    noteDiv.append(title, content);
    noteList.appendChild(noteDiv);
    createNoteDiv.style.display = 'none';

    noteDiv.addEventListener('click', () => {
        openNote(note);
    });
}

function openNote(note) {
    if (right.querySelector('.openNotes')) {
        right.querySelector('.openNotes').remove();
    }

    var openedNoteDiv = document.createElement('div');
    openedNoteDiv.className = 'openNotes';

    var taskdetailDiv = document.createElement('div');
    taskdetailDiv.className = 'taskdetail';

    var h1 = document.createElement('h1');
    h1.textContent = note.title;
    taskdetailDiv.appendChild(h1);

    var buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'buttons';

    var addTaskButton = document.createElement('button');
    addTaskButton.className = 'addTaskBtn';
    addTaskButton.textContent = 'Add Task';
    buttonsDiv.appendChild(addTaskButton);

    var deleteNoteButton = document.createElement('button');
    deleteNoteButton.className = 'deleteTaskBtn';
    deleteNoteButton.textContent = 'Delete Note';
    buttonsDiv.appendChild(deleteNoteButton);

    taskdetailDiv.appendChild(buttonsDiv);
    openedNoteDiv.appendChild(taskdetailDiv);

    var hr = document.createElement('hr');
    openedNoteDiv.appendChild(hr);

    var p = document.createElement('p');
    p.textContent = note.content;
    openedNoteDiv.appendChild(p);

    right.appendChild(openedNoteDiv);

    if (note.noteTask.length > 0) {
        renderTasks(note);
    }

    deleteNoteButton.addEventListener('click', () => {
        right.querySelector('.openNotes').remove();
        document.querySelector('.' + note.UniqueID).remove();
        deleteNoteInStorage(note);
        renderNoFile();
    });

    addTaskButton.addEventListener('click', () => {
        document.querySelector('.addingTask').style.zIndex = '2';

        document.querySelector('.addingTaskButton').addEventListener('click', ()=>
            {
                addTask(note)
            })
    });

    
}

function renderTasks(note) {
    var tasksContainer = document.createElement('div');
    tasksContainer.className = 'taskList';

    let h2 = document.createElement('h2');
    h2.textContent = 'Task List';
    tasksContainer.appendChild(h2);

    note.noteTask.forEach(task => {
        var taskContainer = document.createElement('div');
        taskContainer.className = 'task';

        var radio = document.createElement('input');
        radio.className = 'radio';
        radio.type = 'radio';
        radio.checked = task.taskStatus;   
        radio.value = task.taskName;

        var label = document.createElement('label');
        label.textContent = task.taskName 
        label.className = 'label';

        var tick = document.createElement('img')
        tick.src = './Asserts/tick.new.png'

        if(task.taskStatus === true)
            {
                taskContainer.append(label)
                taskContainer.appendChild(tick)
                radio.remove()
            }

            else{
                taskContainer.append(radio)
                taskContainer.append(label)
            }


        tasksContainer.append(taskContainer);

        radio.addEventListener('click', () => {
            task.taskStatus = true;
            label.textContent = task.taskName ;
            radio.remove();
            var tick = document.createElement('img')
            tick.src = './Asserts/tick.new.png'
            taskContainer.appendChild(tick)
        updateNoteInLocalStorage(note);
        });
    });

    document.querySelector('.openNotes').appendChild(tasksContainer);
}

function addTask(note) {
    var taskName = document.querySelector('.addTaskTitle').value 

    if(taskName === ''){
        console.log("Task name cannot be empty")
        return
    }
    var task = {
        taskName: taskName,
        taskStatus: false
    }
    
    note.noteTask.push(task)
    updateNoteInLocalStorage(note);

    var tasksContainer = document.querySelector('.taskList');
    if (!tasksContainer) {
        tasksContainer = document.createElement('div');
        tasksContainer.className = 'taskList';

        var h2 = document.createElement('h2');
        h2.textContent = "Tasks List";
        tasksContainer.appendChild(h2);

        document.querySelector('.openNotes').appendChild(tasksContainer);
    }

    var taskContainer = document.createElement('div');
    taskContainer.className = 'task';

    var radio = document.createElement('input');
    radio.className = 'radio';
    radio.type = 'radio';

    var label = document.createElement('label');
    label.textContent = task.taskName;
    label.className = 'label';

    taskContainer.append(radio, label);
    tasksContainer.append(taskContainer);

    document.querySelector('.addTaskTitle').value = '';
    document.querySelector('.addingTask').style.zIndex = '-2'

    radio.addEventListener('click', () => {
        task.taskStatus = true;
        label.textContent = task.taskName ;
        radio.remove();
        var tick = document.createElement('img')
        tick.src = '../Asserts/tick.new.png'
        taskContainer.appendChild(tick)
        updateNoteInLocalStorage(note);
    });
}

function addNoteToLocalStorage(note) {
    var localNotes = localStorage.getItem('localNotes');
    var notesArray = localNotes ? JSON.parse(localNotes) : [];
    notesArray.push(note);
    localStorage.setItem('localNotes', JSON.stringify(notesArray));
}

function deleteNoteInStorage(note) {
    var localNotes = JSON.parse(localStorage.getItem('localNotes'));
    var updatedNotes = localNotes.filter(n => n.UniqueID !== note.UniqueID);
    localStorage.setItem('localNotes', JSON.stringify(updatedNotes));
}

function updateNoteInLocalStorage(note) {
    var localNotes = JSON.parse(localStorage.getItem('localNotes'));
    var noteIndex = localNotes.findIndex(n => n.UniqueID === note.UniqueID);
    if (noteIndex !== -1) {
        localNotes[noteIndex] = note;
        localStorage.setItem('localNotes', JSON.stringify(localNotes));
    }
}

function showAllNotes() {
    if (localStorage.getItem('localNotes')) {
        JSON.parse(localStorage.getItem('localNotes')).forEach(note => {
            renderNoteInList(note);
        });
    } else {
        console.log('localStorage does not exist');
    }
}

showAllNotes();

function renderNoFile(){
    var no_files = document.createElement('i')
    if(JSON.parse(localStorage.getItem('localNotes')).length <= 0){
        document.querySelector('.nofiles').style.zIndex = '1'
    }
    else{
        document.querySelector('.nofiles').style.zIndex = '-1'
    }
}

renderNoFile();
