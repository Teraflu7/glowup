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

    if (!$input.length || !$cards.length || !$status.length) return;

    function updateResults() {
      const query = $input.val().trim().toLocaleLowerCase("ru-RU");
      const selectedCategory = $(".blog-filter-controls button[aria-pressed='true']")
        .text()
        .trim();
      let visibleCount = 0;

      $cards.each(function () {
        const $card = $(this);
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

    $input.on("input search", updateResults);
    $(".blog-filter-controls").on("click", "button", updateResults);
  }
})(jQuery);
