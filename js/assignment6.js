"use strict";

(function ($) {
  $(function () {
    console.info("jQuery is ready!");
    setupToastNotifications();
    setupBlogSearch();
    setupScrollProgress();
    setupAnimatedCounters();
    setupCopyButton();
  });

  function setupCopyButton() {
    const $button = $("#copy-guide-button");
    const status = document.querySelector("#copy-guide-status");
    const guide = document.querySelector(".step-list");

    if (!$button.length || !status || !guide) return;

    const originalLabel = $button.text();
    let resetTimer;

    async function copyText(text) {
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          return;
        } catch (error) {
          console.warn("Clipboard API unavailable; using a fallback.", error);
        }
      }

      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);

      try {
        if (!document.execCommand("copy")) {
          throw new Error("The browser did not copy the guide text.");
        }
      } finally {
        textarea.remove();
      }
    }

    $button.on("click", async function () {
      const text = Array.from(guide.querySelectorAll("li"))
        .map((step, index) => `${index + 1}. ${step.textContent.trim()}`)
        .join("\n");

      if (!text) {
        throw new Error("The habit guide has no steps to copy.");
      }

      $button.prop("disabled", true);

      try {
        await copyText(text);
        $button.text("Скопировано ✓").attr("title", "Скопировано в буфер обмена");
        status.textContent = "План привычки скопирован в буфер обмена.";

        if (typeof window.showAssignment6Toast === "function") {
          window.showAssignment6Toast("План скопирован в буфер обмена.");
        }

        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(() => {
          $button.text(originalLabel).removeAttr("title");
          status.textContent = "";
        }, 2000);
      } catch (error) {
        console.error("Could not copy the habit guide.", error);
        status.textContent = "Не удалось скопировать план. Попробуйте ещё раз.";

        if (typeof window.showAssignment6Toast === "function") {
          window.showAssignment6Toast(
            "Не удалось скопировать план. Проверьте разрешение браузера.",
            { tone: "error" }
          );
        }
      } finally {
        $button.prop("disabled", false).trigger("focus");
      }
    });
  }

  function setupToastNotifications() {
    let $container = $("#assignment6-toasts");

    if (!$container.length) {
      $container = $("<div>", {
        id: "assignment6-toasts",
        class: "assignment6-toasts",
        role: "region",
        "aria-label": "Уведомления",
        "aria-live": "polite",
        "aria-relevant": "additions"
      }).appendTo(document.body);
    }

    window.showAssignment6Toast = function (message, options = {}) {
      if (typeof message !== "string" || !message.trim()) {
        throw new TypeError("Toast message must be a non-empty string.");
      }

      const tone = options.tone === "error" ? "error" : "success";
      const duration = Number.isFinite(options.duration)
        ? Math.max(1000, options.duration)
        : 4500;
      const $toast = $("<div>", {
        class: `assignment6-toast assignment6-toast--${tone}`,
        role: tone === "error" ? "alert" : "status"
      });
      const $message = $("<p>", {
        class: "assignment6-toast__message"
      }).text(message);
      const $close = $("<button>", {
        class: "assignment6-toast__close",
        type: "button",
        "aria-label": "Закрыть уведомление"
      }).text("×");
      let removalTimer;

      function removeToast() {
        window.clearTimeout(removalTimer);
        $toast.addClass("is-closing");
        window.setTimeout(() => $toast.remove(), 180);
      }

      $close.on("click", removeToast);
      $toast.append($message, $close).appendTo($container);
      removalTimer = window.setTimeout(removeToast, duration);

      return removeToast;
    };
  }

  function setupAnimatedCounters() {
    const counters = document.querySelectorAll("[data-count-target]");
    if (!counters.length) return;

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function renderCounter(element, value) {
      const decimals = Number(element.getAttribute("data-count-decimals"));
      const suffix = element.getAttribute("data-count-suffix") || "";
      element.textContent = `${value.toFixed(decimals)}${suffix}`;
    }

    function startCounter(element) {
      const target = Number(element.getAttribute("data-count-target"));

      if (!Number.isFinite(target)) {
        console.error("Invalid counter target:", element);
        return;
      }

      if (prefersReducedMotion) {
        renderCounter(element, target);
        return;
      }

      const animatedValue = { value: 0 };
      renderCounter(element, 0);

      $(animatedValue).animate(
        { value: target },
        {
          duration: 1600,
          easing: "swing",
          step(value) {
            renderCounter(element, value);
          },
          complete() {
            renderCounter(element, target);
          }
        }
      );
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(startCounter);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        observer.unobserve(entry.target);
        startCounter(entry.target);
      });
    }, { threshold: 0.35 });

    counters.forEach((counter) => observer.observe(counter));
  }

  function setupScrollProgress() {
    const $progress = $("#page-scroll-progress");
    const $bar = $progress.find(".scroll-progress-bar");

    if (!$progress.length || !$bar.length) return;

    let updateScheduled = false;

    function updateProgress() {
      const documentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      const maxScroll = documentHeight - window.innerHeight;
      const progress = maxScroll > 0
        ? Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100))
        : 0;
      const roundedProgress = Math.round(progress);

      $bar.css("width", `${progress}%`);
      $progress
        .attr("aria-valuenow", roundedProgress)
        .attr("aria-valuetext", `${roundedProgress}%`);
    }

    function scheduleUpdate() {
      if (updateScheduled) return;

      updateScheduled = true;
      window.requestAnimationFrame(() => {
        updateScheduled = false;
        updateProgress();
      });
    }

    $(window).on(
      "scroll.assignment6 resize.assignment6",
      scheduleUpdate
    );
    scheduleUpdate();
  }

  function setupBlogSearch() {
    const $input = $("#article-search");
    const $cards = $(".blog-grid .article-card");
    const $status = $("#article-search-status");
    const $suggestions = $("#article-search-suggestions");

    if (
      !$input.length ||
      !$cards.length ||
      !$status.length ||
      !$suggestions.length
    ) return;

    let activeSuggestion = -1;

    function updateResults() {
      const query = $input.val().trim().toLocaleLowerCase("ru-RU");
      const selectedCategory = $(".blog-filter-controls button[aria-pressed='true']")
        .text()
        .trim();
      const hasCategoryFilter =
        selectedCategory && selectedCategory !== "All";
      let visibleCount = 0;

      $cards.each(function () {
        const $card = $(this);
        restoreHighlights($card);
        const searchableText = $card
          .find(".article-tag, .card-title, .card-text")
          .text()
          .toLocaleLowerCase("ru-RU");
        const category = $card.find(".article-tag").text().trim();
        const matchesCategory =
          !selectedCategory ||
          selectedCategory === "All" ||
          selectedCategory === category;
        const matches = matchesCategory &&
          (!query || searchableText.includes(query));

        this.hidden = !matches;
        if (query) highlightMatches($card, query);
        if (matches) visibleCount += 1;
      });

      $status.text(
        query
          ? visibleCount
            ? `Найдено статей: ${visibleCount}.`
            : "По вашему запросу статей не найдено."
          : hasCategoryFilter
            ? `Статей в категории «${selectedCategory}»: ${visibleCount}.`
            : `Показаны все статьи (${visibleCount}).`
      );
    }

    function restoreHighlights($card) {
      $card.find("mark.search-highlight").each(function () {
        this.replaceWith(document.createTextNode(this.textContent));
      });
      $card.get(0).normalize();
    }

    function highlightMatches($card, query) {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(escapedQuery, "giu");

      $card.find(".article-tag, .card-title, .card-text").each(function () {
        const walker = document.createTreeWalker(this, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        let textNode = walker.nextNode();

        while (textNode) {
          textNodes.push(textNode);
          textNode = walker.nextNode();
        }

        textNodes.forEach((node) => {
          const text = node.nodeValue;
          if (!text || !pattern.test(text)) {
            pattern.lastIndex = 0;
            return;
          }

          pattern.lastIndex = 0;
          const fragment = document.createDocumentFragment();
          let cursor = 0;

          for (const match of text.matchAll(pattern)) {
            const start = match.index;
            fragment.appendChild(
              document.createTextNode(text.slice(cursor, start))
            );

            const mark = document.createElement("mark");
            mark.className = "search-highlight";
            mark.textContent = match[0];
            fragment.appendChild(mark);
            cursor = start + match[0].length;
          }

          fragment.appendChild(document.createTextNode(text.slice(cursor)));
          node.replaceWith(fragment);
          pattern.lastIndex = 0;
        });
      });
    }

    function hideSuggestions() {
      activeSuggestion = -1;
      $suggestions.prop("hidden", true).empty();
      $input.attr("aria-expanded", "false").removeAttr("aria-activedescendant");
    }

    function updateActiveSuggestion() {
      const $options = $suggestions.find("[role='option']");

      $options.attr("aria-selected", "false");
      if (activeSuggestion < 0 || activeSuggestion >= $options.length) {
        $input.removeAttr("aria-activedescendant");
        return;
      }

      const $activeOption = $options.eq(activeSuggestion);
      $activeOption.attr("aria-selected", "true");
      $input.attr("aria-activedescendant", $activeOption.attr("id"));
    }

    function renderSuggestions() {
      const query = $input.val().trim().toLocaleLowerCase("ru-RU");
      const selectedCategory = $(".blog-filter-controls button[aria-pressed='true']")
        .text()
        .trim();
      $suggestions.empty();
      activeSuggestion = -1;

      if (!query) {
        hideSuggestions();
        return;
      }

      const titles = $cards
        .map(function () {
          return {
            title: $(this).find(".card-title").text().trim(),
            category: $(this).find(".article-tag").text().trim()
          };
        })
        .get()
        .filter(({ title, category }) => {
          const matchesCategory =
            !selectedCategory ||
            selectedCategory === "All" ||
            selectedCategory === category;
          return matchesCategory &&
            title.toLocaleLowerCase("ru-RU").includes(query);
        })
        .map(({ title }) => title)
        .slice(0, 5);

      if (!titles.length) {
        hideSuggestions();
        return;
      }

      titles.forEach((title, index) => {
        $("<li>", {
          id: `article-suggestion-${index}`,
          role: "option",
          "aria-selected": "false"
        })
          .addClass("search-suggestion")
          .text(title)
          .appendTo($suggestions);
      });

      $suggestions.prop("hidden", false);
      $input.attr("aria-expanded", "true");
    }

    function chooseSuggestion(title) {
      $input.val(title);
      hideSuggestions();
      updateResults();
      $input.trigger("focus");
    }

    $input.on("input search", function () {
      updateResults();
      renderSuggestions();
    });
    $input.on("focus", renderSuggestions);

    $input.on("keydown", function (event) {
      const optionCount = $suggestions.find("[role='option']").length;
      if (!optionCount) {
        if (event.key === "Escape") hideSuggestions();
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        activeSuggestion = activeSuggestion < 0
          ? direction > 0
            ? 0
            : optionCount - 1
          : (activeSuggestion + direction + optionCount) % optionCount;
        updateActiveSuggestion();
      } else if (event.key === "Enter" && activeSuggestion >= 0) {
        event.preventDefault();
        chooseSuggestion(
          $suggestions.find("[role='option']").eq(activeSuggestion).text()
        );
      } else if (event.key === "Escape") {
        hideSuggestions();
      }
    });

    $suggestions
      .on("mousedown", "[role='option']", (event) => event.preventDefault())
      .on("click", "[role='option']", function () {
        chooseSuggestion($(this).text());
      });

    $(".blog-filter-controls").on("click", "button", function () {
      updateResults();
      renderSuggestions();
    });

    $(document).on("click.assignment6Search", function (event) {
      if (!$(event.target).closest(".search-autocomplete").length) {
        hideSuggestions();
      }
    });
  }
})(jQuery);
