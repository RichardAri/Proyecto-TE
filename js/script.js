document.getElementById('open-add-team-modal-button').addEventListener('click', function() {
    document.getElementById('add-team-modal').style.display = 'block';
});

document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', function() {
        button.closest('.modal').style.display = 'none';
    });
});

window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

document.getElementById('add-team-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const teamName = document.getElementById('add-team-name').value;
    const startDate = document.getElementById('add-team-start-date').value;
    const endDate = document.getElementById('add-team-end-date').value;

    if (teamName.trim() === '' || startDate.trim() === '' || endDate.trim() === '') {
        alert('Todos los campos son obligatorios');
        return;
    }

    addTeamToList(teamName, startDate, endDate);
    addTeamToCalendar(teamName, startDate, endDate);
    
    document.getElementById('add-team-form').reset();
    document.getElementById('add-team-modal').style.display = 'none';
});

document.getElementById('edit-team-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const teamId = document.getElementById('edit-team-id').value;
    const teamName = document.getElementById('edit-team-name').value;
    const startDate = document.getElementById('edit-team-start-date').value;
    const endDate = document.getElementById('edit-team-end-date').value;

    if (teamName.trim() === '' || startDate.trim() === '' || endDate.trim() === '') {
        alert('Todos los campos son obligatorios');
        return;
    }

    updateTeam(teamId, teamName, startDate, endDate);
    document.getElementById('edit-team-form').reset();
    document.getElementById('edit-team-modal').style.display = 'none';
});

document.getElementById('add-member-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const memberName = document.getElementById('member-name').value;

    if (memberName.trim() === '') {
        alert('El nombre del miembro es obligatorio');
        return;
    }
    
    addMemberToTeam(memberName);
    document.getElementById('add-member-form').reset();
});

document.getElementById('assign-task-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const taskTitle = document.getElementById('task-title').value;
    const taskMember = document.getElementById('task-member').value;
    const taskDate = document.getElementById('task-date').value;

    if (taskTitle.trim() === '' || taskMember.trim() === '' || taskDate.trim() === '') {
        alert('Todos los campos son obligatorios');
        return;
    }
    
    assignTaskToMember(taskTitle, taskMember, taskDate);
    document.getElementById('assign-task-form').reset();
});

function addTeamToList(teamName, startDate, endDate) {
    const teamsList = document.querySelector('#teams-list ul');
    const newTeamItem = document.createElement('li');
    const teamId = 'team-' + Date.now();
    newTeamItem.setAttribute('data-id', teamId);
    newTeamItem.innerHTML = `
        ${teamName} (${startDate} - ${endDate})
        <button class="form_button btn_edit" onclick="openEditTeamModal('${teamId}')">
        <svg class="svg" viewBox="0 0 512 512">
                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
            </svg>
        Editar</button>
        <button class="form_button btn_delete" onclick="deleteTeam('${teamId}')"><img class="svg icon_button" src="https://img.icons8.com/ios/50/trash--v1.png" alt="trash--v1"/>Eliminar</button>
        <ul class="members-list"></ul>
    `;
    teamsList.appendChild(newTeamItem);
}

function openEditTeamModal(teamId) {
    const teamItem = document.querySelector(`li[data-id="${teamId}"]`);
    const teamDetails = teamItem.textContent.match(/^(.*) \((.*) - (.*)\)$/);
    const teamName = teamDetails[1];
    const startDate = teamDetails[2];
    const endDate = teamDetails[3];

    document.getElementById('edit-team-id').value = teamId;
    document.getElementById('edit-team-name').value = teamName;
    document.getElementById('edit-team-start-date').value = startDate;
    document.getElementById('edit-team-end-date').value = endDate;
    document.getElementById('edit-team-modal').style.display = 'block';
}

function updateTeam(teamId, teamName, startDate, endDate) {
    const teamItem = document.querySelector(`li[data-id="${teamId}"]`);
    teamItem.innerHTML = `
        ${teamName} (${startDate} - ${endDate})
        <button onclick="openEditTeamModal('${teamId}')">Editar</button>
        <button onclick="deleteTeam('${teamId}')">Eliminar</button>
        <ul class="members-list"></ul>
    `;
}

function deleteTeam(teamId) {
    const teamItem = document.querySelector(`li[data-id="${teamId}"]`);
    teamItem.remove();
}

let currentTeamMembers = [];

function addMemberToTeam(memberName) {
    const teamId = document.getElementById('edit-team-id').value;
    if (!teamId) {
        alert('Primero debe crear o seleccionar un equipo.');
        return;
    }
    
    currentTeamMembers.push(memberName);
    const memberOption = document.createElement('option');
    memberOption.value = memberName;
    memberOption.textContent = memberName;
    document.getElementById('task-member').appendChild(memberOption);

    const teamItem = document.querySelector(`li[data-id="${teamId}"] .members-list`);
    const newMemberItem = document.createElement('li');
    newMemberItem.textContent = memberName;
    teamItem.appendChild(newMemberItem);
}

function assignTaskToMember(taskTitle, taskMember, taskDate) {
    if (!tasks[taskDate]) {
        tasks[taskDate] = [];
    }
    tasks[taskDate].push({ time: '', title: taskTitle, location: '', assignedTo: taskMember });
    generateCalendar(currentMonth, currentYear);
}

function addTeamToCalendar(teamName, startDate, endDate) {
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
        const dateStr = currentDate.toISOString().split('T')[0];
        if (!tasks[dateStr]) {
            tasks[dateStr] = [];
        }
        tasks[dateStr].push({ time: '', title: teamName, location: '' });
        currentDate.setDate(currentDate.getDate() + 1);
    }

    generateCalendar(currentMonth, currentYear);
}

function generateCalendar(month, year) {
    const calendarView = document.getElementById('calendar-view');
    calendarView.innerHTML = ''; // Clear previous calendar

    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    daysOfWeek.forEach(day => {
        const headerElement = document.createElement('div');
        headerElement.textContent = day;
        headerElement.className = 'header';
        calendarView.appendChild(headerElement);
    });

    const date = new Date(year, month, 1);
    let firstDay = date.getDay();
    // Adjust firstDay to start from Monday
    firstDay = (firstDay === 0) ? 6 : firstDay - 1;

    const daysInMonth = new Date(year, parseInt(month) + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyElement = document.createElement('div');
        calendarView.appendChild(emptyElement);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.innerHTML = `<div class="day-number">${i}</div><div class="dots-container"></div>`;
        const dateStr = `${year}-${String(parseInt(month) + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        dayElement.dataset.date = dateStr;

        if (tasks[dateStr] && tasks[dateStr].length > 0) {
            const dotsContainer = dayElement.querySelector('.dots-container');
            tasks[dateStr].forEach(() => {
                const dotElement = document.createElement('span');
                dotElement.className = 'task-dot';
                dotsContainer.appendChild(dotElement);
            });
        }
        dayElement.addEventListener('click', function() {
            selectDate(dayElement.dataset.date);
        });
        calendarView.appendChild(dayElement);
    }
    updateCalendarTitle(month, year);
}

function selectDate(date) {
    const allDays = document.querySelectorAll('#calendar-view .day');
    allDays.forEach(day => day.classList.remove('selected')); //agrega clase selected

    const selectedDay = document.querySelector(`#calendar-view .day[data-date="${date}"]`);
    if (selectedDay) {
        selectedDay.classList.add('selected');
        showTasksForDate(date);
    }
}

function showTasksForDate(date) {
    const tasksList = document.getElementById('tasks-list');
    tasksList.innerHTML = ''; // Clear previous tasks

    if (tasks[date]) {
        tasks[date].forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.innerHTML = `
                <strong>${task.time}</strong><br>
                ${task.title}<br>
                ${task.location}
            `;
            taskItem.className = 'task-item';
            tasksList.appendChild(taskItem);
        });
    }
}

// Se actualiza dinamicamente el mes y año
function updateCalendarTitle(month, year) {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const calendarTitle = document.getElementById('calendar-title');
    calendarTitle.textContent = `${monthNames[month]} de ${year}`;
}

document.getElementById('prev-month').addEventListener('click', function() {
    changeMonth(-1);
});

document.getElementById('next-month').addEventListener('click', function() {
    changeMonth(1);
});


function changeMonth(step) {
    currentMonth += step;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
}

// Obtenemos mes y año actual
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Generar el calendario para mes y año actual
generateCalendar(currentMonth, currentYear);
