(() => {
  "use strict";

  const accordionItems = Array.from(document.querySelectorAll(".faq-item"));

  const closeItem = (item) => {
    const trigger = item.querySelector(".faq-trigger");
    const panel = item.querySelector(".faq-panel");

    trigger.setAttribute("aria-expanded", "false");
    item.classList.remove("is-open");

    const hideCollapsedPanel = (event) => {
      if (event.target !== panel || event.propertyName !== "grid-template-rows") {
        return;
      }

      panel.removeEventListener("transitionend", hideCollapsedPanel);

      if (trigger.getAttribute("aria-expanded") === "false") {
        panel.hidden = true;
      }
    };

    panel.addEventListener("transitionend", hideCollapsedPanel);
  };

  const openItem = (item) => {
    const trigger = item.querySelector(".faq-trigger");
    const panel = item.querySelector(".faq-panel");

    accordionItems.forEach((otherItem) => {
      if (otherItem !== item && otherItem.classList.contains("is-open")) {
        closeItem(otherItem);
      }
    });

    panel.hidden = false;
    trigger.setAttribute("aria-expanded", "true");

    window.requestAnimationFrame(() => {
      item.classList.add("is-open");
    });
  };

  accordionItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });
  });
})();
