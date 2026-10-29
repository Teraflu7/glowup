"use strict";

// Assignment 5: Keyboard Navigation

function setupKeyboardNavigation() {
  const links = Array.from(
    document.querySelectorAll(".navbar-nav .nav-link")
  );

  links.forEach((link, index) => {
    link.addEventListener("keydown", (event) => {
      let nextIndex;

      switch (event.key) {
        case "ArrowRight":
          nextIndex = (index + 1) % links.length;
          break;

        case "ArrowLeft":
          nextIndex = (index - 1 + links.length) % links.length;
          break;

        default:
          return;
      }

      event.preventDefault();
      links[nextIndex].focus();
    });
  });
}

setupKeyboardNavigation();
// Assignment 5: Habit Tracker and Motivation

function playSuccessSound() {
  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    const audio = new AudioContextClass();
    const oscillator = audio.createOscillator();
    const volume = audio.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 660;

    volume.gain.setValueAtTime(0.08, audio.currentTime);
    volume.gain.exponentialRampToValueAtTime(
      0.001,
      audio.currentTime + 0.15
    );

    oscillator.connect(volume);
    volume.connect(audio.destination);

    oscillator.start();
    oscillator.stop(audio.currentTime + 0.15);
    oscillator.onended = () => audio.close();
  } catch (error) {
    console.warn("Audio unavailable", error);
  }
}

function setupHomeFeatures() {
  const container = document.querySelector(".home-tools-card");

  if (!container) return;

  const habits = [
    { id: "water", name: "Drink water" },
    { id: "exercise", name: "Do exercise" },
    { id: "reading", name: "Read a book" },
    { id: "sleep", name: "Sleep on time" }
  ];

  const today = new Date().toLocaleDateString("en-CA");
  const storageKey = "glowup-habits-" + today;

  let completed = [];

  try {
    completed = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );
    if (!Array.isArray(completed)) completed = [];
  } catch {
    completed = [];
  }

  const tracker = document.createElement("section");
  tracker.className = "assignment-feature";

  tracker.innerHTML = `
    <h3 class="home-tools-label">Daily Habit Tracker</h3>
    <p>Track your progress every day.</p>
    <div id="habit-list"></div>
    <p id="habit-progress" aria-live="polite"></p>
    <div class="progress">
      <div id="habit-progress-bar"
           class="progress-bar"
           role="progressbar"
           aria-label="Habit progress"
           aria-valuemin="0"
           aria-valuemax="100"
           aria-valuenow="0"></div>
    </div>
  `;

  container.appendChild(tracker);

  const habitList = tracker.querySelector("#habit-list");
  const progressText = tracker.querySelector("#habit-progress");
  const progressBar = tracker.querySelector("#habit-progress-bar");

  function updateProgress() {
    const count = completed.length;
    const percent = Math.round(count / habits.length * 100);

    progressText.textContent =
      `${count} of ${habits.length} completed (${percent}%)`;

    progressBar.style.width = percent + "%";
    progressBar.setAttribute("aria-valuenow", percent);

    try {
      localStorage.setItem(storageKey, JSON.stringify(completed));
    } catch {
      // Tracker still works if storage is unavailable.
    }
  }

  habits.forEach((habit) => {
    const label = document.createElement("label");
    label.className = "habit-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed.includes(habit.id);

    const text = document.createElement("span");
    text.textContent = habit.name;

    label.append(checkbox, text);
    habitList.appendChild(label);

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        completed.push(habit.id);
        playSuccessSound();
      } else {
        completed = completed.filter(id => id !== habit.id);
      }

      updateProgress();
    });
  });

  updateProgress();

  // Random Motivation

  const quotes = [
    "Small steps lead to big changes.",
    "Progress is better than perfection.",
    "Believe in yourself and keep going.",
    "Your future starts with today's habits.",
    "Every day is a new opportunity."
  ];

  const motivation = document.createElement("section");
  motivation.className = "assignment-feature";

  motivation.innerHTML = `
    <h3 class="home-tools-label">Daily Motivation</h3>
    <p id="motivation-text" aria-live="polite">
      Click the button to get inspired!
    </p>
    <button class="btn btn-primary"
            type="button"
            id="motivation-button">
      Get Motivation
    </button>
  `;

  container.appendChild(motivation);

  const motivationText =
    motivation.querySelector("#motivation-text");

  motivation
    .querySelector("#motivation-button")
    .addEventListener("click", () => {
      const randomIndex = Math.floor(
        Math.random() * quotes.length
      );

      motivationText.textContent = quotes[randomIndex];

      motivationText.classList.remove("motivation-animate");
      void motivationText.offsetWidth;
      motivationText.classList.add("motivation-animate");

      playSuccessSound();
    });
}

setupHomeFeatures();
// Assignment 5: Blog Filters and Read More

function setupBlogFeatures() {
  const blogGrid = document.querySelector(".blog-grid");

  if (!blogGrid) return;

  const articles = Array.from(
    blogGrid.querySelectorAll(".article-card")
  );

  const categories = [
    { value: "all", label: "All" },
    { value: "routine", label: "Рутина" },
    { value: "mindfulness", label: "Осознанность" },
    { value: "energy", label: "Энергия" }
  ];

  const filters = document.createElement("div");
  filters.className = "blog-filter-controls";
  filters.setAttribute("role", "group");
  filters.setAttribute("aria-label", "Фильтр статей");

  blogGrid.before(filters);

  function filterArticles(category) {
    let selectedTag;

    switch (category) {
      case "routine":
        selectedTag = "Рутина";
        break;
      case "mindfulness":
        selectedTag = "Осознанность";
        break;
      case "energy":
        selectedTag = "Энергия";
        break;
      default:
        selectedTag = null;
    }

    articles.forEach((article) => {
      const tag = article.querySelector(".article-tag");
      const show = !selectedTag ||
        tag.textContent.trim() === selectedTag;

      article.hidden = !show;
    });
  }

  categories.forEach((category) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "btn btn-outline-primary";
    button.textContent = category.label;
    button.setAttribute("aria-pressed",
      String(category.value === "all")
    );

    button.addEventListener("click", () => {
      filterArticles(category.value);

      filters.querySelectorAll("button").forEach((btn) => {
        btn.setAttribute("aria-pressed", "false");
      });

      button.setAttribute("aria-pressed", "true");
    });

    filters.appendChild(button);
  });

  // Read More for existing articles

  const extraTexts = [
    "Начните утро без телефона. Выпейте воду, сделайте небольшую разминку и запишите главную цель на день.",
    "Не пытайтесь изменить всё сразу. Выберите одну привычку и отмечайте даже самый маленький прогресс.",
    "Держите бутылку воды рядом с собой и делайте небольшие перерывы в течение дня."
  ];

  articles.forEach((article, index) => {
    const cardBody = article.querySelector(".article-body");

    const extra = document.createElement("p");
    extra.className = "card-text";
    extra.textContent = extraTexts[index];
    extra.hidden = true;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-outline-primary";
    button.textContent = "Read More";
    button.setAttribute("aria-expanded", "false");

    cardBody.append(extra, button);

    button.addEventListener("click", () => {
      extra.hidden = !extra.hidden;

      button.textContent = extra.hidden
        ? "Read More"
        : "Read Less";

      button.setAttribute(
        "aria-expanded",
        String(!extra.hidden)
      );
    });
  });
}

setupBlogFeatures();
