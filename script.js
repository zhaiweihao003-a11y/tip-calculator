"use strict";

const form = document.getElementById("tip-form");
const billInput = document.getElementById("bill");
const tipInput = document.getElementById("tip");
const peopleInput = document.getElementById("people");
const error = document.getElementById("error");
const outputs = ["tip-amount", "total-amount", "per-person"].map(id => document.getElementById(id));
const inputs = [billInput, tipInput, peopleInput];
const decimalPattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
const moneyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false
});

function clearResults() {
  outputs.forEach(output => { output.textContent = "—"; });
}

function clearError() {
  error.hidden = true;
  error.textContent = "";
  inputs.forEach(input => input.removeAttribute("aria-invalid"));
}

function showError(message, input) {
  clearResults();
  error.textContent = message;
  error.hidden = false;
  input.setAttribute("aria-invalid", "true");
  input.focus();
}

function calculateTip(event) {
  event.preventDefault();
  clearError();
  clearResults();
  const billText = billInput.value.trim();
  const peopleText = peopleInput.value.trim();
  const bill = Number(billText);
  const people = Number(peopleText);
  const percentage = Number(tipInput.value);

  if (billText === "") {
    showError("请输入账单金额。", billInput);
    return;
  }
  if (!decimalPattern.test(billText) || !Number.isFinite(bill) || bill < 0) {
    showError("请输入有效的非负金额。", billInput);
    return;
  }
  if (!decimalPattern.test(peopleText) || !Number.isSafeInteger(people) || people <= 0) {
    showError("请输入大于零的整数人数。", peopleInput);
    return;
  }
  if (![10, 15, 20].includes(percentage)) {
    showError("请选择有效的小费比例。", tipInput);
    return;
  }

  // Keep the original precision through calculation; round only for display.
  const tipAmount = bill * (percentage / 100);
  const totalAmount = bill + tipAmount;
  const perPerson = totalAmount / people;
  const amounts = [tipAmount, totalAmount, perPerson];
  if (!amounts.every(Number.isFinite)) {
    showError("金额过大，请输入较小的有效金额。", billInput);
    return;
  }
  amounts.forEach((amount, index) => {
    outputs[index].textContent = moneyFormatter.format(amount === 0 ? 0 : amount);
  });
}

form.addEventListener("submit", calculateTip);
// Old totals no longer apply after the inputs change.
inputs.forEach(input => input.addEventListener("input", () => {
  clearResults();
  clearError();
}));
