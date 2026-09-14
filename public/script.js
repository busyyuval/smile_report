const form = document.querySelector("#report-form");
const options = document.querySelectorAll(".status-option");
const noteInput = document.querySelector("#note");
const message = document.querySelector("#form-message");
const submitButton = document.querySelector("#submit-button");
const successMessage = document.querySelector("#success-message");
const sendAnotherButton = document.querySelector("#send-another");

let selectedStatus = "";

function showMessage(text) { message.textContent = text; message.hidden = false; }
function clearMessage() { message.textContent = ""; message.hidden = true; }

options.forEach((option) => {
  option.addEventListener("click", () => {
    selectedStatus = option.dataset.status;
    options.forEach((item) => {
      const isSelected = item === option;
      item.classList.toggle("selected", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });
    clearMessage();
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();
  if (!selectedStatus) {
    showMessage("צריך לבחור אם את מחייכת או לא מחייכת לפני השליחה.");
    return;
  }
  submitButton.disabled = true;
  submitButton.innerHTML = "<span>שולחת...</span>";
  try {
    const response = await fetch("/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: selectedStatus, note: noteInput.value.trim() })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "לא הצלחנו לשלוח את הדיווח.");
    form.hidden = true;
    successMessage.hidden = false;
  } catch (error) {
    showMessage(error.message || "משהו השתבש. נסי שוב בעוד רגע.");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = "<span>שלחי דיווח</span><span aria-hidden=\"true\">←</span>";
  }
});

sendAnotherButton.addEventListener("click", () => {
  selectedStatus = "";
  form.reset();
  clearMessage();
  options.forEach((option) => { option.classList.remove("selected"); option.setAttribute("aria-pressed", "false"); });
  successMessage.hidden = true;
  form.hidden = false;
});
