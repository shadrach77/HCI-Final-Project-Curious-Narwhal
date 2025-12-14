/* index.html */

/* sign-up.html */

/* form.html */
function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");
  toast.innerHTML = message;
  toast.classList.add("show");
}

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();

  // RUN ALL VALIDATIONS
  const isNameValid = validateSubscriptionName();
  const isPriceValid = validatePrice();

  const selected = document.querySelector(
    'input[name="subscription-type"]:checked'
  ).value;
  let isEndDateValid = true;
  let isStartDateValid = true;
  let isRemindValid = true;
  let isFrequencyValid = true;

  if (selected === "yes") {
    isEndDateValid = validateEndDate();
    isRemindValid = validateRemindMeBefore();
  }

  if (selected === "no") {
    isStartDateValid = validateStartDate();
    isFrequencyValid = validateFrequency();
  }

  if (
    !isNameValid ||
    !isPriceValid ||
    !isEndDateValid ||
    !isStartDateValid ||
    !isRemindValid ||
    !isFrequencyValid
  ) {
    return;
  }

  const form = e.target;

  Array.from(form.elements).forEach((el) => {
    if (el.tagName !== "BUTTON") {
      el.disabled = true;
    }
  });

  const submitBtn = document.getElementById("form-submit-button");
  submitBtn.disabled = true;
  submitBtn.textContent = "Changes Saved";

  // TODO: validation and saving logic

  showToast(
    "Reminder added successfully! <a href='./' style='color: #03045e; text-decoration: underline; font-weight: 200'>Go to Homepage</a>"
  );

  setTimeout(() => {
    window.location.href = "./";
  }, 5000);
});

const radios = document.querySelectorAll('input[name="subscription-type"]');

const withEnd = document.getElementById("subscription-with-end-fields");
const withoutEnd = document.getElementById("subscription-without-end-fields");
const endDate = document.getElementById("end-date");
const remindMeBefore = document.getElementById("remind-me-before");
const startDate = document.getElementById("start-date");
const frequency = document.getElementById("frequency");

function toggleFields() {
  const selected = document.querySelector(
    'input[name="subscription-type"]:checked'
  ).value;

  if (selected === "yes") {
    withEnd.style.display = "flex";
    withoutEnd.style.display = "none";

    // Clear errors for fields inside NO section
    document
      .querySelectorAll("#subscription-without-end-fields .error-message")
      .forEach((el) => el.classList.add("hide-error-message"));
  } else {
    withoutEnd.style.display = "flex";
    withEnd.style.display = "none";

    // Clear errors for fields inside YES section
    document
      .querySelectorAll("#subscription-with-end-fields .error-message")
      .forEach((el) => el.classList.add("hide-error-message"));
  }
}

radios.forEach((radio) => {
  radio.addEventListener("change", toggleFields);
});

toggleFields();

// Validation Logic

function validateSubscriptionName() {
  const nameInput = document.getElementById("subscription-name");
  const nameError = nameInput.parentElement.querySelector(".error-message");
  const value = nameInput.value.trim();

  if (value === "") {
    nameError.innerHTML = `
  <img src="./assets/alert-icon.svg" alt="alert-icon">
  Subscription name cannot be empty.
`;
    nameError.classList.remove("hide-error-message");
    return false;
  }

  nameError.classList.add("hide-error-message");
  return true;
}

function validatePrice() {
  const priceInput = document.getElementById("price");
  const priceError = priceInput.parentElement.querySelector(".error-message");
  const value = priceInput.value.trim();

  if (value === "") {
    priceError.innerHTML = `
  <img src="./assets/alert-icon.svg" alt="alert-icon">
  Price cannot be empty.
`;
    priceError.classList.remove("hide-error-message");
    return false;
  }

  const num = Number(value);
  if (!Number.isInteger(num) || num < 0) {
    priceError.innerHTML = `
  <img src="./assets/alert-icon.svg" alt="alert-icon">
  Price should an integer of at least 0.
`;
    priceError.classList.remove("hide-error-message");
    return false;
  }

  priceError.classList.add("hide-error-message");
  return true;
}

function validateEndDate() {
  const endDateInput = document.getElementById("end-date");
  const endDateError =
    endDateInput.parentElement.querySelector(".error-message");
  const value = endDateInput.value;

  if (!value) {
    endDateError.innerHTML = `
  <img src="./assets/alert-icon.svg" alt="alert-icon">
  Please select a date.
`;
    endDateError.classList.remove("hide-error-message");
    return false;
  }

  const inputDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (inputDate <= today) {
    endDateError.innerHTML = `
  <img src="./assets/alert-icon.svg" alt="alert-icon">
  Date must be later than today.
`;
    endDateError.classList.remove("hide-error-message");
    return false;
  }

  endDateError.classList.add("hide-error-message");
  return true;
}

function validateStartDate() {
  const startDateInput = document.getElementById("start-date");
  const startDateError =
    startDateInput.parentElement.querySelector(".error-message");
  const value = startDateInput.value;

  if (!value) {
    startDateError.innerHTML = `
  <img src="./assets/alert-icon.svg" alt="alert-icon">
  Please select a date.
`;
    startDateError.classList.remove("hide-error-message");
    return false;
  }

  startDateError.classList.add("hide-error-message");
  return true;
}

function validateRemindMeBefore() {
  const remindField = document.getElementById("remind-me-before");
  const remindError = remindField.parentElement.querySelector(".error-message");
  const radioYes = document.querySelector(
    'input[name="subscription-type"][value="yes"]'
  ).checked;

  if (!radioYes) {
    remindError.classList.add("hide-error-message");
    return true;
  }

  if (remindField.value === "") {
    remindError.innerHTML = `
  <img src="./assets/alert-icon.svg" alt="alert-icon">
  Please select a reminder.
`;
    remindError.classList.remove("hide-error-message");
    return false;
  }

  remindError.classList.add("hide-error-message");
  return true;
}

function validateFrequency() {
  const frequencyField = document.getElementById("frequency");
  const frequencyError =
    frequencyField.parentElement.querySelector(".error-message");
  const radioNo = document.querySelector(
    'input[name="subscription-type"][value="no"]'
  ).checked;

  if (!radioNo) {
    frequencyError.classList.add("hide-error-message");
    return true;
  }

  if (frequencyField.value === "") {
    frequencyError.innerHTML = `
  <img src="./assets/alert-icon.svg" alt="alert-icon">
  Please select a valid frequency.
`;
    frequencyError.classList.remove("hide-error-message");
    return false;
  }

  frequencyError.classList.add("hide-error-message");
  return true;
}
