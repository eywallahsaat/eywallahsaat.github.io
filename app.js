document.addEventListener('DOMContentLoaded', () => {
    // Tema değiştirme
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('change', () => {
        document.body.setAttribute('data-theme', 
            themeToggle.checked ? 'dark' : 'light');
    });

    // Canlı saat
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

    // Bildirim izni
    if ('Notification' in window) {
        Notification.requestPermission();
    }
});
