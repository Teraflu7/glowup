"use strict";

(function ($) {
  $(function () {
    console.info("jQuery is ready!");
    setupBlogSearch();
  });

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

    $(".blog-filter-controls").on("click", "button", updateResults);
  }
})(jQuery);
