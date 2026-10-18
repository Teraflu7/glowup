(() => {
  "use strict";

  const themes = [
    { name: "нежно-розовый", color: "#fff9fc" },
    { name: "тёплый персиковый", color: "#fff4ec" },
    { name: "воздушный лавандовый", color: "#f5f1ff" },
    { name: "свежий мятный", color: "#eefaf6" },
  ];

  const cycleButton = document.querySelector("#theme-cycle");
  const resetButton = document.querySelector("#theme-reset");
  const themeStatus = document.querySelector("#theme-status");
  const clock = document.querySelector("#current-date-time");
  let activeTheme = 0;

  const applyTheme = (themeIndex) => {
    activeTheme = themeIndex;
    const theme = themes[activeTheme];

    document.documentElement.style.setProperty("--bg", theme.color);
    themeStatus.textContent = `Текущий фон: ${theme.name}`;
    resetButton.disabled = activeTheme === 0;
  };

  cycleButton.addEventListener("click", () => {
    applyTheme((activeTheme + 1) % themes.length);
  });

  resetButton.addEventListener("click", () => {
    applyTheme(0);
    cycleButton.focus();
  });

  const locale = document.documentElement.lang || navigator.language;
  const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
    timeStyle: "medium",
  });

  const updateClock = () => {
    const now = new Date();
    clock.dateTime = now.toISOString();
    clock.textContent = dateTimeFormatter.format(now);
  };

  updateClock();
  window.setInterval(updateClock, 1000);
})();
