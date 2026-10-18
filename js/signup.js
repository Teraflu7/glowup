(() => {
  "use strict";

  const dialog = document.querySelector("#signup-dialog");
  const openButton = document.querySelector("#open-signup-dialog");
  const closeButton = document.querySelector("#close-signup-dialog");
  const form = document.querySelector("#contact-form");
  const successMessage = document.querySelector("#signup-success");

  if (!dialog || !openButton || !closeButton || !form || !successMessage) {
    return;
  }

  const validatedFields = Array.from(form.querySelectorAll("[data-validate]"));
  const passwordField = form.querySelector("#password");
  const passwordConfirmationField = form.querySelector("#password-confirmation");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  let elementToRestoreFocus = openButton;

  const getErrorElement = (field) => document.querySelector(`#${field.id}-error`);

  const getValidationMessage = (field) => {
    const value = field.value.trim();

    switch (field.dataset.validate) {
      case "name":
        return value ? "" : "Введите ваше имя.";
      case "email":
        if (!value) {
          return "Введите электронную почту.";
        }
        return emailPattern.test(value) ? "" : "Введите адрес в формате name@example.com.";
      case "password":
        if (!field.value) {
          return "Введите пароль.";
        }
        return field.value.length >= 8 ? "" : "Пароль должен содержать не менее 8 символов.";
      case "passwordConfirmation":
        if (!field.value) {
          return "Повторите пароль.";
        }
        return field.value === passwordField.value ? "" : "Пароли не совпадают.";
      case "message":
        return value ? "" : "Расскажите о своей цели или пожелании.";
      default:
        return "";
    }
  };

  const setFieldError = (field, message) => {
    const errorElement = getErrorElement(field);

    if (!errorElement) {
      return;
    }

    const hasError = Boolean(message);
    field.setAttribute("aria-invalid", String(hasError));
    errorElement.textContent = message;
    errorElement.hidden = !hasError;
  };

  const validateField = (field) => {
    const message = getValidationMessage(field);
    setFieldError(field, message);
    return !message;
  };

  const hideSuccessMessage = () => {
    successMessage.hidden = true;
    successMessage.textContent = "";
  };

  const restoreFocus = () => {
    if (elementToRestoreFocus instanceof HTMLElement && elementToRestoreFocus.isConnected) {
      elementToRestoreFocus.focus();
    }
  };

  const openDialog = () => {
    elementToRestoreFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : openButton;
    hideSuccessMessage();

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    window.requestAnimationFrame(() => {
      form.querySelector("#name").focus();
    });
  };

  const closeDialog = () => {
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
      restoreFocus();
    }
  };

  openButton.addEventListener("click", openDialog);
  closeButton.addEventListener("click", closeDialog);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog();
    }
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDialog();
    }
  });

  dialog.addEventListener("close", restoreFocus);

  validatedFields.forEach((field) => {
    field.addEventListener("input", () => {
      hideSuccessMessage();

      if (field.getAttribute("aria-invalid") === "true") {
        validateField(field);
      }

      if (
        field === passwordField
        && passwordConfirmationField.value
      ) {
        validateField(passwordConfirmationField);
      }
    });
  });

  form.addEventListener("input", (event) => {
    if (!event.target.matches("[data-validate]")) {
      hideSuccessMessage();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    hideSuccessMessage();

    const fieldValidity = validatedFields.map((field) => validateField(field));
    const firstInvalidField = validatedFields[fieldValidity.indexOf(false)];

    if (firstInvalidField) {
      firstInvalidField.focus();
      return;
    }

    form.reset();
    validatedFields.forEach((field) => setFieldError(field, ""));
    successMessage.textContent = "Готово! Данные прошли проверку, и ваш план создан.";
    successMessage.hidden = false;
    successMessage.focus();
  });
})();
