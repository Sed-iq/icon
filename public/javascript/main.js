const country = document.getElementById("location");
const reserveBtn = document.getElementById("reservebtn");
const avalable = document.getElementById("avalable");
const slotBtn = document.getElementById("slotBtn");

const newText = document.createElement("h4");

// reserveBtn.addEventListener('click', check);

function validate(e) {
  if (country.value == "USA") {
    avalable.innerText = "Whitelisting Slot is Unavailable In Your Country";
    reserveBtn.href = "#";
    slotBtn.style.backgroundColor = "#9b9b9b";
    slotBtn.style.color = "#fff";
    setTimeout(function () {
      window.location.href = "/slot";
    }, 1000);
  } else {
    return false;
  }
}

function check(e) {
  if (country.value == "select") {
    avalable.innerText = "Please select Country";
    reserveBtn.href = "#";
    slotBtn.style.backgroundColor = "#9b9b9b";
    slotBtn.style.color = "#fff";
    setTimeout(function () {
      window.location.href = "/slot";
    }, 1000);
  } else {
    return false;
  }
}

const blank = document.getElementById("blank");
const success = document.getElementById("success");
const copy = document.getElementById("copy");
const code = document.getElementById("code");
const codeCopied = document.getElementById("codeCopied");

success.style.display = "flex";
setTimeout(function () {
  copy.style.display = "flex";
  success.style.display = "none";
  code.innerText = localStorage.randomNumber;
}, 2000);

function copyCode() {
  try {
    navigator.clipboard
      .writeText(localStorage.randomNumber)
      .then(() => {
        console.log("copied");
      })
      .catch((err) => {
        "Unable";
      });
  } catch (err) {
    console.error("failed to copy:", err);
    return false;
  }
  codeCopied.href = "generateconfirm.html";
}
