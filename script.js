// Load saved data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateInput').value = today;
});

// Save data whenever inputs change
document.addEventListener('input', function(e) {
    saveData();
});

function loadData() {
    const data = JSON.parse(localStorage.getItem('timeBoxData') || '{}');

    document.getElementById('dateInput').value = data.date || '';
    document.getElementById('priority1').value = data.priorities?.[0] || '';
    document.getElementById('priority2').value = data.priorities?.[1] || '';
    document.getElementById('priority3').value = data.priorities?.[2] || '';
    document.getElementById('priority4').value = data.priorities?.[3] || '';
    document.getElementById('brainDump').value = data.brainDump || '';

    if (data.timeBlocks) {
        for (let key in data.timeBlocks) {
            const element = document.getElementById('time' + key.replace(':', '-'));
            if (element) element.value = data.timeBlocks[key];
        }
    }
}

function saveData() {
    const data = {
        date: document.getElementById('dateInput').value,
        priorities: [
            document.getElementById('priority1').value,
            document.getElementById('priority2').value,
            document.getElementById('priority3').value,
            document.getElementById('priority4').value
        ],
        brainDump: document.getElementById('brainDump').value,
        timeBlocks: {}
    };

    // Collect time block data
    for (let hour = 5; hour <= 23; hour++) {
        for (let minute of ['00', '30']) {
            const value = document.getElementById('time' + hour + '-' + minute).value;
            if (value.trim()) {
                data.timeBlocks[hour + ':' + minute] = value;
            }
        }
    }

    localStorage.setItem('timeBoxData', JSON.stringify(data));
}

function toggleSettings() {
    const menu = document.getElementById('settingsMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function changeLogoStyle(rx) {
    const rect = document.querySelector('.logo rect');
    rect.setAttribute('rx', rx);
}

function changeTimeFormat(format) {
    // Update hour column cells
    const hourCells = document.querySelectorAll('.time-row .hour-cell');
    hourCells.forEach((cell, index) => {
        const hour = 5 + index; // Hours start from 5
        if (format === 12) {
            let displayHour = hour;
            if (hour > 12) {
                displayHour = hour - 12;
            }
            cell.textContent = displayHour;
        } else if (format === 24) {
            cell.textContent = hour.toString().padStart(2, '0');
        }
    });

    // Update input placeholders
    for (let hour = 5; hour <= 23; hour++) {
        for (let minute of ['00', '30']) {
            const element = document.getElementById('time' + hour + '-' + minute);
            if (element) {
                if (format === 12) {
                    let displayHour = hour;
                    let ampm = 'AM';
                    if (hour === 0) {
                        displayHour = 12;
                    } else if (hour === 12) {
                        ampm = 'PM';
                    } else if (hour > 12) {
                        displayHour = hour - 12;
                        ampm = 'PM';
                    }
                    element.placeholder = displayHour + ':' + minute + ' ' + ampm;
                } else if (format === 24) {
                    const displayHour = hour.toString().padStart(2, '0');
                    element.placeholder = displayHour + ':' + minute;
                }
            }
        }
    }
}

// Hide settings menu when clicking outside
document.addEventListener('click', function(e) {
    const menu = document.getElementById('settingsMenu');
    const btn = document.querySelector('.settings-btn');
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.style.display = 'none';
    }
});
