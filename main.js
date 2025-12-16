// Navbar
const profile = document.getElementById("nav-profile");
const dropdown = document.getElementById("profileDropdown");

profile.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", () => {
  dropdown.style.display = "none";
});

/* index.html */
const container = document.getElementById("subscription-list");

function renderTable(list) {
  if (!container) return;

  container.innerHTML = list
    .map(
      (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.startDate ?? "-"}</td>
          <td>${item.endDate ?? "-"}</td>
          <td>${item.price}</td>
          <td>${item.frequency ?? "-"}</td>
          <td>
            <button class="edit-button" onclick="editSubscription(${item.id})">Edit ✎</button>
            <button class="delete-button" onclick="deleteSubscription(${item.id})">Delete ✖</button>
          </td>
        </tr>
      `
    )
    .join("");
}

const list = JSON.parse(localStorage.getItem("subscriptions")) || [];
renderTable(list);

function editSubscription(id) {
  window.location.href = `form.html?id=${id}`;
}

function deleteSubscription(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this subscription?"
  );
  if (!confirmDelete) return;

  let list = JSON.parse(localStorage.getItem("subscriptions")) || [];
  list = list.filter((item) => item.id !== id);

  localStorage.setItem("subscriptions", JSON.stringify(list));

  renderTable(list);
}

let allSubscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];

function applyFilters() {
  let filtered = [...allSubscriptions];

  // search
  const searchInput = document.querySelector(".search-input");
  const keyword = searchInput.value.toLowerCase();

  if (keyword) {
    filtered = filtered.filter((item) =>
      item.name.toLowerCase().includes(keyword)
    );
  }

  // filter
  const dropdown = document.querySelector(".dropdown-filter");
  const value = dropdown.value;

  if (value === "recurring") {
    filtered = filtered.filter((item) => !item.hasEndDate);
  } else if (value === "non-recurring") {
    filtered = filtered.filter((item) => item.hasEndDate);
  }

  renderTable(filtered);
}

/* sign-up.html */

/* form.html */

// link logic
const params = new URLSearchParams(window.location.search);
const editId = params.get("id");
const isEditMode = editId !== null;

function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");
  toast.innerHTML = message;
  toast.classList.add("show");
}

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();

  // Validating
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

  // add to storage
  const subscription = {
    id: isEditMode ? Number(editId) : Date.now(),
    name: document.getElementById("subscription-name").value,
    price: document.getElementById("price").value,
    hasEndDate: selected === "yes",
    endDate: selected === "yes" ? endDate.value : null,
    startDate: selected === "no" ? startDate.value : null,
    frequency: selected === "no" ? frequency.value : null,
    remindBefore: selected === "yes" ? remindMeBefore.value : null,
  };

  let list = JSON.parse(localStorage.getItem("subscriptions")) || [];

  // check if editting or adding
  if (editId) {
    const index = list.findIndex(
      (subscription) => subscription.id === Number(editId)
    );

    list[index] = {
      ...list[index],
      name: subscription.name,
      price: subscription.price,
      hasEndDate: subscription.hasEndDate,
      endDate: subscription.endDate,
      startDate: subscription.startDate,
      frequency: subscription.frequency,
      remindBefore: subscription.remindBefore,
    };
  } else {
    list.push(subscription);
  }

  localStorage.setItem("subscriptions", JSON.stringify(list));

  showToast(
    isEditMode
      ? "Reminder added successfully! <a href='./dashboard.html' style='color: #03045e; text-decoration: underline; font-weight: 200'>Go to Homepage</a>"
      : "Reminder changed successfully! <a href='./dashboard.html' style='color: #03045e; text-decoration: underline; font-weight: 200'>Go to Homepage</a>"
  );

  setTimeout(() => {
    window.location.href = "./dashboard.html";
  }, 3000);
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

    // clear errors for fieldsno section
    document
      .querySelectorAll("#subscription-without-end-fields .error-message")
      .forEach((el) => el.classList.add("hide-error-message"));
  } else {
    withoutEnd.style.display = "flex";
    withEnd.style.display = "none";

    // clear errors for fields in yes section
    document
      .querySelectorAll("#subscription-with-end-fields .error-message")
      .forEach((el) => el.classList.add("hide-error-message"));
  }
}

// edit form logic
if (editId) {
  const list = JSON.parse(localStorage.getItem("subscriptions")) || [];
  const subscription = list.find((s) => s.id === Number(editId));

  if (!subscription) {
    alert("Subscription not found");
    window.location.href = "./dashboard.html";
  }

  document.getElementById("subscription-name").value = subscription.name;
  document.getElementById("price").value = subscription.price;

  if (subscription.hasEndDate) {
    document.querySelector('input[value="yes"]').checked = true;
    toggleFields();

    endDate.value = subscription.endDate;
    remindMeBefore.value = subscription.remindBefore;
  } else {
    document.querySelector('input[value="no"]').checked = true;
    toggleFields();

    startDate.value = subscription.startDate;
    frequency.value = subscription.frequency;
  }

  document.getElementById("form-title").textContent = "Edit Subscription";
  document.getElementById("form-submit-button").textContent = "Save Changes";
}

radios.forEach((radio) => {
  radio.addEventListener("change", toggleFields);
});

toggleFields();

// validation Logic

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
