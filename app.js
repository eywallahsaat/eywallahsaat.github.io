// Eywallah Saat - Basit dijital saat uygulaması
(function () {
  const $ = (sel) => document.querySelector(sel);

  const el = {
    h: $("#hours"),
    m: $("#minutes"),
    s: $("#seconds"),
    ampm: $("#ampm"),
    date: $("#date"),
    tz: $("#tz"),
    is24h: $("#is24h"),
    showSeconds: $("#showSeconds"),
    secondsWrap: $("#secondsWrap"),
    themeToggle: $("#themeToggle"),
  };

  // Ayarlar (localStorage)
  const settingsKey = "clock.settings";
  const defaults = { is24h: true, showSeconds: true, theme: "dark" };

  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(settingsKey));
      return Object.assign({}, defaults, saved || {});
    } catch (e) {
      return { ...defaults };
    }
  }
  function saveSettings(s) {
    localStorage.setItem(settingsKey, JSON.stringify(s));
  }

  let settings = loadSettings();

  // UI başlangıç durumu
  el.is24h.checked = !!settings.is24h;
  el.showSeconds.checked = !!settings.showSeconds;
  document.documentElement.classList.toggle("light", settings.theme === "light");
  el.secondsWrap.style.display = settings.showSeconds ? "inline" : "none";

  // Etkileşimler
  el.is24h.addEventListener("change", () => {
    settings.is24h = el.is24h.checked;
    saveSettings(settings);
    render();
  });

  el.showSeconds.addEventListener("change", () => {
    settings.showSeconds = el.showSeconds.checked;
    saveSettings(settings);
    el.secondsWrap.style.display = settings.showSeconds ? "inline" : "none";
  });

  el.themeToggle.addEventListener("click", () => {
    settings.theme = settings.theme === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("light", settings.theme === "light");
    saveSettings(settings);
  });

  // Yardımcılar
  const pad = (n) => String(n).padStart(2, "0");

  function render() {
    const now = new Date();
    let hours = now.getHours();
    let ampm = "";

    if (!settings.is24h) {
      ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      if (hours === 0) hours = 12;
    }

    el.h.textContent = pad(hours);
    el.m.textContent = pad(now.getMinutes());
    el.s.textContent = pad(now.getSeconds());
    el.ampm.textContent = settings.is24h ? "" : ampm;

    const dateStr = now.toLocaleDateString("tr-TR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    // İlk harfi büyük yap
    el.date.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

    el.tz.textContent =
      Intl.DateTimeFormat().resolvedOptions().timeZone || "Yerel";
  }

  // Çalıştır
  render();
  setInterval(render, 1000);
})();
