document.addEventListener('DOMContentLoaded', () => {
    // Theme switching
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
    });

    // Section navigation
    const navButtons = document.querySelectorAll('.bottom-nav button');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.section.active').classList.remove('active');
            document.querySelector(`#${button.dataset.section}`).classList.add('active');
            document.querySelector('.bottom-nav button.active').classList.remove('active');
            button.classList.add('active');
        });
    });

    // Fullscreen functionality
    document.querySelectorAll('.fullscreen-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.closest('.section');
            if (!document.fullscreenElement) {
                section.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        });
    });

    // Clock functionality
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('tr-TR', { 
            timeZone: 'Europe/Istanbul' 
        });
        const dateString = now.toLocaleDateString('tr-TR', {
            timeZone: 'Europe/Istanbul'
        });
        
        document.getElementById('current-time').textContent = timeString;
        document.getElementById('date').textContent = dateString;
    }

    setInterval(updateClock, 1000);
    updateClock();

    // Timer functionality
    let timerInterval;
    const timerToggle = document.getElementById('timer-toggle');
    const timerDisplay = document.getElementById('timer-display');
    const alertSound = document.getElementById('alert-sound');

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
                    timerDisplay.textContent = 
                        `${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
                    
                    if (timeLeft <= 0) {
                        clearInterval(timerInterval);
                        alertSound.play();
                        timerToggle.textContent = 'Başlat';
                        if (Notification.permission === 'granted') {
                            new Notification('Zamanlayıcı bitti!');
                        }
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
        timerToggle.textContent = 'Başlat';
        timerDisplay.textContent = '00:00';
        document.getElementById('timer-minutes').value = '';
        document.getElementById('timer-seconds').value = '';
    });

    // Stopwatch functionality
    let stopwatchInterval;
    let stopwatchTime = 0;
    const stopwatchToggle = document.getElementById('stopwatch-toggle');
    const stopwatchDisplay = document.getElementById('stopwatch-display');

    stopwatchToggle.addEventListener('click', () => {
        if (stopwatchToggle.textContent === 'Başlat') {
            stopwatchInterval = setInterval(() => {
                stopwatchTime++;
                const hours = Math.floor(stopwatchTime / 3600);
                const minutes = Math.floor((stopwatchTime % 3600) / 60);
                const seconds = stopwatchTime % 60;
                stopwatchDisplay.textContent = 
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }, 1000);
            stopwatchToggle.textContent = 'Durdur';
        } else {
            clearInterval(stopwatchInterval);
            stopwatchToggle.textContent = 'Başlat';
        }
    });

    document.getElementById('stopwatch-reset').addEventListener('click', () => {
        clearInterval(stopwatchInterval);
        stopwatchTime = 0;
        stopwatchDisplay.textContent = '00:00:00';
        stopwatchToggle.textContent = 'Başlat';
    });

    // Alarm functionality
    let alarmTimeout;
    const alarmToggle = document.getElementById('alarm-toggle');
    const alarmDisplay = document.getElementById('alarm-display');

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
                    alertSound.play();
                    if (Notification.permission === 'granted') {
                        new Notification('Alarm!');
                    }
                    alarmToggle.textContent = 'Başlat';
                }, timeUntilAlarm);
                
                alarmToggle.textContent = 'Durdur';
                alarmDisplay.textContent = alarmTime;
            }
        } else {
            clearTimeout(alarmTimeout);
            alarmToggle.textContent = 'Başlat';
            alarmDisplay.textContent = '';
        }
    });

    document.getElementById('alarm-reset').addEventListener('click', () => {
        clearTimeout(alarmTimeout);
        alarmToggle.textContent = 'Başlat';
        alarmDisplay.textContent = '';
        document.getElementById('alarm-time').value = '';
    });

    // Notification permission
    if ('Notification' in window) {
        Notification.requestPermission();
    }
});
