// ==================== CANLI SAAT KODLARI ====================
function updateClock() {
    const now = new Date();
    const istanbulTime = now.toLocaleTimeString('tr-TR', { 
        timeZone: 'Europe/Istanbul',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('live-clock').textContent = istanbulTime;
}

// Her saniye saati güncelle
setInterval(updateClock, 1000);
// Sayfa yüklendiğinde hemen çalıştır
updateClock();

// ==================== KRONOMETRE KODLARI ====================
let stopwatchInterval;
let elapsedTime = 0;
let isRunning = false;

function formatStopwatchTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
}

function startStopwatch() {
    if (!isRunning) {
        const startTime = Date.now() - elapsedTime;
        stopwatchInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            document.getElementById('stopwatch-display').textContent = formatStopwatchTime(elapsedTime);
        }, 10);
        isRunning = true;
    }
}

function stopStopwatch() {
    clearInterval(stopwatchInterval);
    isRunning = false;
}

function resetStopwatch() {
    stopStopwatch();
    elapsedTime = 0;
    document.getElementById('stopwatch-display').textContent = '00:00:00';
}

// ==================== ZAMANLAYICI KODLARI ====================
let timerInterval;
let totalTimeInSeconds;

function startTimer() {
    // Kullanıcının girdiği saat, dakika ve saniye değerlerini al
    const hours = parseInt(document.getElementById('timer-hours').value) || 0;
    const minutes = parseInt(document.getElementById('timer-minutes').value) || 0;
    const seconds = parseInt(document.getElementById('timer-seconds').value) || 0;

    // Eğer sayaç zaten çalışıyorsa durdur
    if (timerInterval) {
        return;
    }

    // Tüm süreyi saniyeye çevir
    totalTimeInSeconds = (hours * 3600) + (minutes * 60) + seconds;

    if (totalTimeInSeconds > 0) {
        timerInterval = setInterval(() => {
            if (totalTimeInSeconds <= 0) {
                clearInterval(timerInterval);
                document.getElementById('timer-display').textContent = 'Süre Bitti!';
                timerInterval = null; 
                return;
            }

            totalTimeInSeconds--;
            
            // Saniyeleri saat, dakika ve saniyeye çevirip ekrana yaz
            const displayHours = Math.floor(totalTimeInSeconds / 3600);
            const displayMinutes = Math.floor((totalTimeInSeconds % 3600) / 60);
            const displaySeconds = totalTimeInSeconds % 60;

            document.getElementById('timer-display').textContent = 
                `${String(displayHours).padStart(2, '0')}:${String(displayMinutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;

        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    stopTimer();
    document.getElementById('timer-display').textContent = '00:00:00';
    document.getElementById('timer-hours').value = '0';
    document.getElementById('timer-minutes').value = '0';
    document.getElementById('timer-seconds').value = '0';
}
