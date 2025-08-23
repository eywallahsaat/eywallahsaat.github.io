document.addEventListener('DOMContentLoaded', () => {
    let alertRepeatCount = 0;
    const MAX_REPEATS = 3;
    const alertSound = document.getElementById('alert-sound');

    function playAlertWithRepeats() {
        alertRepeatCount = 0;
        alertSound.loop = false;
        
        function alertEndHandler() {
            alertRepeatCount++;
            if (alertRepeatCount < MAX_REPEATS) {
                alertSound.play();
            } else {
                alertSound.removeEventListener('ended', alertEndHandler);
                alertRepeatCount = 0;
            }
        }
        
        alertSound.addEventListener('ended', alertEndHandler);
        alertSound.play();
    }

    function stopAlertSound() {
        alertSound.pause();
        alertSound.currentTime = 0;
        alertRepeatCount = 0;
    }

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
            timeZone: 'Europe/Istanbul',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
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

    // Timer functionality
    let timerInterval;
    const timerToggle = document.getElementById('timer-toggle');
    const timerDisplay = document.getElementById('timer-display');

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
                        playAlertWithRepeats();
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
        stopAlertSound();
        timerToggle.textContent = 'Başlat';
        timerDisplay.textContent = '00:00';
        document.getElementById('timer-minutes').value = '';
        document.getElementById('timer-seconds').value = '';
    });

    // Stopwatch functionality with milliseconds
    let stopwatchInterval;
    let stopwatchTime = 0;
    let startTime;
    const stopwatchToggle = document.getElementById('stopwatch-toggle');
    const stopwatchDisplay = document.getElementById('stopwatch-display');

    stopwatchToggle.addEventListener('click', () => {
        if (stopwatchToggle.textContent === 'Başlat') {
            startTime = Date.now() - (stopwatchTime * 1000);
            stopwatchInterval = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const hours = Math.floor(elapsedTime / 3600000);
                const minutes = Math.floor((elapsedTime % 3600000) / 60000);
                const seconds = Math.floor((elapsedTime % 60000) / 1000);
                const milliseconds = elapsedTime % 1000;
                
                stopwatchDisplay.textContent = 
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
            }, 10);
            stopwatchToggle.textContent = 'Durdur';
        } else {
            clearInterval(stopwatchInterval);
            stopwatchTime = (Date.now() - startTime) / 1000;
            stopwatchToggle.textContent = 'Başlat';
        }
    });

    document.getElementById('stopwatch-reset').addEventListener('click', () => {
        clearInterval(stopwatchInterval);
        stopwatchTime = 0;
        stopwatchDisplay.textContent = '00:00:00.000';
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
                    playAlertWithRepeats();
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
            stopAlertSound();
            alarmToggle.textContent = 'Başlat';
        }
    });

    document.getElementById('alarm-reset').addEventListener('click', () => {
        clearTimeout(alarmTimeout);
        stopAlertSound();
        alarmToggle.textContent = 'Başlat';
        alarmDisplay.textContent = '';
        document.getElementById('alarm-time').value = '';
    });

    // Notification permission
    if ('Notification' in window) {
        Notification.requestPermission();
    }
});
