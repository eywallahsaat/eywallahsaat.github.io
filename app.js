document.addEventListener('DOMContentLoaded', () => {
    // SPA Navigation
    function navigateTo(viewId) {
        document.querySelector('.view.active').classList.remove('active');
        document.getElementById(viewId).classList.add('active');
        document.querySelector('.bottom-nav button.active').classList.remove('active');
        document.querySelector(`[data-view="${viewId}"]`).classList.add('active');
    }

    document.querySelectorAll('.bottom-nav button').forEach(button => {
        button.addEventListener('click', () => {
            navigateTo(button.dataset.view);
        });
    });

    // Theme Management
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Clock Function
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('tr-TR', { 
            timeZone: 'Europe/Istanbul' 
        });
        const dateString = now.toLocaleDateString('tr-TR', {
            timeZone: 'Europe/Istanbul',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('current-time').textContent = timeString;
        document.getElementById('date').textContent = dateString;
    }

    setInterval(updateClock, 1000);
    updateClock();

    // Timer Functions
    const alertSound = document.getElementById('alert-sound');
    let alertRepeatCount = 0;
    const MAX_REPEATS = 3;
    let timerInterval;

    function playAlert() {
        alertRepeatCount = 0;
        alertSound.addEventListener('ended', alertEndHandler);
        alertSound.play();
    }

    function alertEndHandler() {
        alertRepeatCount++;
        if (alertRepeatCount < MAX_REPEATS) {
            alertSound.play();
        } else {
            alertSound.removeEventListener('ended', alertEndHandler);
            alertRepeatCount = 0;
        }
    }

    function stopAlert() {
        alertSound.removeEventListener('ended', alertEndHandler);
        alertSound.pause();
        alertSound.currentTime = 0;
        alertRepeatCount = 0;
    }

    const timerToggle = document.getElementById('timer-toggle');
    timerToggle.addEventListener('click', () => {
        if (timerToggle.textContent === 'Başlat') {
            const minutes = parseInt(document.getElementById('timer-minutes').value) || 0;
            const seconds = parseInt(document.getElementById('timer-seconds').value) || 0;
            const totalSeconds = minutes * 60 + seconds;
            
            if (totalSeconds > 0) {
                let timeLeft = totalSeconds;
                timerInterval = setInterval(() => {
                    timeLeft--;
                    const displayMinutes = Math.floor(timeLeft / 60);
                    const displaySeconds = timeLeft % 60;
                    document.getElementById('timer-display').textContent = 
                        `${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
                    
                    if (timeLeft <= 0) {
                        clearInterval(timerInterval);
                        playAlert();
                        timerToggle.textContent = 'Başlat';
                    }
                }, 1000);
                timerToggle.textContent = 'Durdur';
            }
        } else {
            clearInterval(timerInterval);
            timerToggle.textContent = 'Başlat';
        }
    });

    document.getElementById('timer-reset').addEventListener('click', () => {
        clearInterval(timerInterval);
        stopAlert();
        timerToggle.textContent = 'Başlat';
        document.getElementById('timer-display').textContent = '00:00';
        document.getElementById('timer-minutes').value = '';
        document.getElementById('timer-seconds').value = '';
    });

    // Stopwatch Functions
    let stopwatchInterval;
    let stopwatchTime = 0;
    const stopwatchDisplay = document.getElementById('stopwatch-display');
    const stopwatchToggle = document.getElementById('stopwatch-toggle');

    stopwatchToggle.addEventListener('click', () => {
        if (stopwatchToggle.textContent === 'Başlat') {
            stopwatchInterval = setInterval(() => {
                stopwatchTime++;
                updateStopwatch();
            }, 10);
            stopwatchToggle.textContent = 'Durdur';
        } else {
            clearInterval(stopwatchInterval);
            stopwatchToggle.textContent = 'Başlat';
        }
    });

    function updateStopwatch() {
        const minutes = Math.floor(stopwatchTime / 6000);
        const seconds = Math.floor((stopwatchTime % 6000) / 100);
        const centiseconds = stopwatchTime % 100;
        stopwatchDisplay.textContent = 
            `00:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }

    document.getElementById('stopwatch-reset').addEventListener('click', () => {
        clearInterval(stopwatchInterval);
        stopwatchTime = 0;
        updateStopwatch();
        stopwatchToggle.textContent = 'Başlat';
    });

    // Alarm Functions
    let alarmTimeout;
    const alarmToggle = document.getElementById('alarm-toggle');
    
    alarmToggle.addEventListener('click', () => {
        if (alarmToggle.textContent === 'Başlat') {
            const alarmTime = document.getElementById('alarm-time').value;
            if (alarmTime) {
                const [hours, minutes] = alarmTime.split(':');
                const now = new Date();
                const alarm = new Date();
                alarm.setHours(hours, minutes, 0);
                
                if (alarm < now) {
                    alarm.setDate(alarm.getDate() + 1);
                }
                
                const timeUntilAlarm = alarm - now;
                alarmTimeout = setTimeout(() => {
                    playAlert();
                    alarmToggle.textContent = 'Başlat';
                }, timeUntilAlarm);
                
                alarmToggle.textContent = 'Durdur';
                document.getElementById('alarm-display').textContent = alarmTime;
            }
        } else {
            clearTimeout(alarmTimeout);
            stopAlert();
            alarmToggle.textContent = 'Başlat';
        }
    });

    document.getElementById('alarm-reset').addEventListener('click', () => {
        clearTimeout(alarmTimeout);
        stopAlert();
        alarmToggle.textContent = 'Başlat';
        document.getElementById('alarm-display').textContent = '';
        document.getElementById('alarm-time').value = '';
    });

    // Notification Permission
    if ('Notification' in window) {
        Notification.requestPermission();
    }
});
