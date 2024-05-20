// scripts.js

document.getElementById('create-team-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const teamName = document.getElementById('team-name').value;
    const startDate = document.getElementById('team-start-date').value;
    const endDate = document.getElementById('team-end-date').value;

    if (teamName.trim() === '' || startDate.trim() === '' || endDate.trim() === '') {
        alert('Todos los campos son obligatorios');
        return;
    }
    
    addTeamToList(teamName, startDate, endDate);
    addTeamToCalendar(teamName, startDate, endDate);
    document.getElementById('create-team-form').reset();
});

document.getElementById('prev-month').addEventListener('click', function() {
    changeMonth(-1);
});

document.getElementById('next-month').addEventListener('click', function() {
    changeMonth(1);
});

function addTeamToList(teamName, startDate, endDate) {
    const teamsList = document.querySelector('#teams-list ul');
    const newTeamItem = document.createElement('li');
    newTeamItem.textContent = `${teamName} (${startDate} - ${endDate})`;
    teamsList.appendChild(newTeamItem);
}

const tasks = {
    "2024-05-01": [{ time: "VACAC.", title: "", location: "" }],
    "2024-05-20": [
        { time: '6:30 p.m. - 7:15 p.m.', title: 'Prácticas PreProfesionales', location: 'A 101' },
        { time: '7:15 p.m. - 8:45 p.m.', title: 'Tecnologías Emergentes', location: 'A 101' },
        { time: '8:45 p.m. - 9:30 p.m.', title: 'Tutoría Semestre 9', location: 'A 101' }
    ]
};

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
    allDays.forEach(day => day.classList.remove('selected'));

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

function updateCalendarTitle(month, year) {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const calendarTitle = document.getElementById('calendar-title');
    calendarTitle.textContent = `${monthNames[month]} de ${year}`;
}

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

// Variables globales para el mes y año actuales
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Generar el calendario para el mes y año actuales al cargar la página
generateCalendar(currentMonth, currentYear);
