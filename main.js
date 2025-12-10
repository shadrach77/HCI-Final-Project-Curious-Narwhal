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
    "Reminder added successfully! <a href='./' style='color: white; text-decoration: underline'>Go to Homepage</a>"
  );

  setTimeout(() => {
    window.location.href = "./";
  }, 5000);
});

const radios = document.querySelectorAll('input[name="subscription-type"]');

const withEnd = document.getElementById("subscription-with-end-fields");
const withoutEnd = document.getElementById("subscription-without-end-fields");

function toggleFields() {
  const selected = document.querySelector(
    'input[name="subscription-type"]:checked'
  ).value;

  if (selected === "yes") {
    withEnd.style.display = "flex";
    withoutEnd.style.display = "none";

    endDate.required = true;
    remindBefore.required = true;
    startDate.required = false;
    frequency.required = false;
  } else {
    withoutEnd.style.display = "flex";
    withEnd.style.display = "none";

    startDate.required = true;
    frequency.required = true;
    endDate.required = false;
    remindBefore.required = false;
  }
}

radios.forEach((radio) => {
  radio.addEventListener("change", toggleFields);
});

toggleFields();
