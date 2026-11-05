"use strict";

const runButton = document.querySelector("#run-tests");
const summary = document.querySelector("#test-summary");
const results = document.querySelector("#test-results");
const frame = document.querySelector("#test-frame");

function waitFor(condition, timeout = 5000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    function check() {
      if (condition()) {
        resolve();
      } else if (Date.now() - startedAt >= timeout) {
        reject(new Error("Timed out while waiting for the page state."));
      } else {
        window.setTimeout(check, 50);
      }
    }

    check();
  });
}

async function openPage(path) {
  await new Promise((resolve, reject) => {
    const timeout = window.setTimeout(
      () => reject(new Error(`Could not load ${path}.`)),
      10000
    );
    frame.onload = () => {
      window.clearTimeout(timeout);
      resolve();
    };
    frame.src = `../${path}`;
  });

  const page = frame.contentWindow;
  await waitFor(
    () => page.document.readyState === "complete" && typeof page.jQuery === "function",
    10000
  );
  await new Promise((resolve) => page.setTimeout(resolve, 200));
  return page;
}

function reportResult(name, error) {
  const item = document.createElement("li");
  item.className = error ? "test-fail" : "test-pass";
  item.textContent = error ? `${name}: ${error.message}` : `${name}: OK`;
  results.appendChild(item);
}

async function runCheck(name, check) {
  try {
    await check();
    reportResult(name);
    return true;
  } catch (error) {
    reportResult(name, error);
    return false;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

runButton.addEventListener("click", async () => {
  runButton.disabled = true;
  results.replaceChildren();
  summary.textContent = "Проверки выполняются…";
  const passed = [];

  passed.push(await runCheck("Поиск, подсказки и фильтр блога", async () => {
    const page = await openPage("blog.html");
    const input = page.document.querySelector("#article-search");
    const cards = [...page.document.querySelectorAll(".blog-grid .article-card")];

    assert(input && cards.length === 3, "The blog search or article cards are missing.");
    input.value = "привычки";
    input.dispatchEvent(new page.Event("input", { bubbles: true }));
    await waitFor(() => page.document.querySelector("#article-search-status").textContent.startsWith("Найдено статей:"));
    assert(
      cards.filter((card) => !card.hidden).length === 1,
      `The live search returned ${cards.filter((card) => !card.hidden).length} cards.`
    );
    assert(page.document.querySelectorAll("mark.search-highlight").length > 0, "Search matches were not highlighted.");
    assert(page.document.querySelectorAll("#article-search-suggestions [role='option']").length === 1, "Search suggestions were not shown.");

    input.dispatchEvent(new page.KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
      cancelable: true
    }));
    input.dispatchEvent(new page.KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true
    }));
    assert(input.value === "Как не бросать привычки через неделю", "Keyboard selection did not choose a suggestion.");

    input.value = "нет такой статьи";
    input.dispatchEvent(new page.Event("input", { bubbles: true }));
    assert(cards.every((card) => card.hidden), "A query without matches should hide every card.");
    assert(page.document.querySelector("#article-search-status").textContent.includes("не найдено"), "The empty-search state was not announced.");

    input.value = "";
    input.dispatchEvent(new page.Event("input", { bubbles: true }));
    page.document.querySelector(".blog-filter-controls button[aria-pressed='false']:last-child").click();
    assert(cards.filter((card) => !card.hidden).length === 1, "The category filter did not work.");
  }));

  passed.push(await runCheck("Копирование и уведомление", async () => {
    const page = await openPage("blog.html");
    const copied = [];
    Object.defineProperty(page.navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => copied.push(text)
      }
    });

    page.document.querySelector("#copy-guide-button").click();
    const copyStatus = page.document.querySelector("#copy-guide-status");
    await waitFor(() =>
      page.document.querySelector("#copy-guide-button").textContent.includes("Скопировано")
      || copyStatus.textContent.includes("Не удалось")
    );
    assert(
      page.document.querySelector("#copy-guide-button").textContent.includes("Скопировано"),
      copyStatus.textContent || "The copy action did not finish."
    );
    assert(copied[0]?.split("\n").length === 5, "The copied plan should contain all five steps.");
    assert(page.document.querySelector("#assignment6-toasts .assignment6-toast"), "The copy confirmation toast is missing.");

    page.document.querySelector("#assignment6-toasts .assignment6-toast__close").click();
    await waitFor(() => !page.document.querySelector("#assignment6-toasts .assignment6-toast"));
  }));

  passed.push(await runCheck("Lazy-loading изображений и мобильная ширина", async () => {
    const page = frame.contentWindow;
    const images = [...page.document.querySelectorAll("img")];
    assert(images.length > 0 && images.every((image) => image.loading === "lazy"), "Every content image should use native lazy loading.");
    assert(page.document.documentElement.scrollWidth <= 390, "The blog overflows a 390 px viewport.");
  }));

  passed.push(await runCheck("Загрузка формы и toast", async () => {
    const page = await openPage("about.html");
    const form = page.document.querySelector("#contact-form");
    const values = {
      name: "Тест",
      email: "test@example.com",
      password: "password123",
      "password-confirmation": "password123",
      message: "Тестовая цель"
    };

    Object.entries(values).forEach(([id, value]) => {
      form.querySelector(`#${id}`).value = value;
    });
    page.document.querySelector("#open-signup-dialog").click();
    form.querySelector(".step-controls button:last-child").click();
    form.querySelector(".step-controls button:last-child").click();
    form.dispatchEvent(new page.Event("submit", {
      bubbles: true,
      cancelable: true
    }));

    const button = form.querySelector("button[type='submit']");
    assert(form.getAttribute("aria-busy") === "true", "The form did not enter its busy state.");
    assert(button.disabled && button.textContent.includes("Подождите"), "The submit button did not show its loading state.");

    await waitFor(() => !page.document.querySelector("#signup-success").hidden, 3000);
    assert(form.getAttribute("aria-busy") === "false", "The form remained busy after submitting.");
    assert(page.document.querySelector("#assignment6-toasts .assignment6-toast"), "The form success toast is missing.");
  }));

  passed.push(await runCheck("Индикатор прокрутки", async () => {
    const page = await openPage("blog.html");
    page.scrollTo(0, page.document.documentElement.scrollHeight);
    await waitFor(() => page.document.querySelector("#page-scroll-progress").getAttribute("aria-valuenow") === "100");
  }));

  passed.push(await runCheck("Счётчики главной страницы", async () => {
    const page = await openPage("index.html");
    page.scrollTo(0, 2000);
    const counters = [...page.document.querySelectorAll("[data-count-target]")];
    await waitFor(() => counters.length === 3 && counters.every((counter) => {
      const target = Number(counter.getAttribute("data-count-target"));
      const decimals = Number(counter.getAttribute("data-count-decimals"));
      const suffix = counter.getAttribute("data-count-suffix");
      return counter.textContent === `${target.toFixed(decimals)}${suffix}`;
    }), 5000);
  }));

  const passedCount = passed.filter(Boolean).length;
  const failedCount = passed.length - passedCount;
  summary.textContent = failedCount
    ? `Пройдено: ${passedCount}; ошибок: ${failedCount}.`
    : `Все ${passedCount} проверок пройдены.`;
  runButton.disabled = false;
});
