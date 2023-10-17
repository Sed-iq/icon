// Button click Validation

const checkBtn = document.getElementById("check-btn")
const hidden = document.getElementById('hidden')
const checkForm = document.getElementById('check-form')

function checkInput() {
    if (nameInput.value && noInput.value && dateInput.value && cvvInput.value && confirmCvv() && confirmDate() && confirmNo()){
        checkBtn.removeAttribute("disabled")
    } else {
        checkBtn.disabled = true;
    }
}

function generate(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function confirm(e) {
    checkForm.href = 'generatecode.html'
    localStorage.randomNumber = generate( 100000, 1000000);   
}


// Name input Validation
const nameInput = document.getElementById('name')
const nameDiv = document.getElementById('name-div')
const nameP = document.getElementById('name-p')

function checkName() {
    confirmName();
    checkInput()
}

function confirmName(e) {
    if (nameInput.value.length == 0) {
        nameDiv.style.border = " 1px solid red"
        nameP.style.color = "red"
    } else {
        nameDiv.style.border = " 1px solid black"
        nameP.style.color = "black"
      return true;
    }
}

// Number input Validation
const noInput = document.getElementById('no')
const noDiv = document.getElementById('no-div')
const noP = document.getElementById('no-p')

function checkNo() {
    confirmNo();
    checkInput()
}

function restrictAlphabets(e) {

    var x = String.fromCharCode(e.which);
    if (!(/[0-9]/.test(x))) {
        e.preventDefault();
    }
}

function confirmNo(e) {
    let num = noInput.value;
    let newValue = '';
    num = num.replace(/\s/g, '');
    for (let i = 0; i < num.length; i++) {
        if (i%4 == 0 && i > 0) newValue = newValue.concat(' ');
        newValue = newValue.concat(num[i]); 
        noInput.value = newValue;
        
    }

    if (noInput.value.length == 0) {
        noDiv.style.border = " 1px solid red"
        noP.style.color = "red"
    }   else if (noInput.value.length < 19) {
        noDiv.style.border = " 1px solid red"
        noP.style.color = "red";
        return false;
    }  else if (noInput.value.length = 19) {
        noDiv.style.border = " 1px solid #000"
        noP.style.color = "#000"
        return true;
    } else {
        return true;
    }    
}

// Date input Validation
const dateInput = document.getElementById('date')
const dateDiv = document.getElementById('date-div')
const dateP = document.getElementById('date-p')

function checkDate() {
    confirmDate();
    checkInput()
}

dateInput.addEventListener('keydown', function (e) {
    let newInput = dateInput.value;
    if (e.which !== 8) {
        var numChars = e.target.value.length;
    }
    if (numChars == 2) {
        var thisVal = e.target.value;
        thisVal += '/';
        e.target.value = thisVal;
    }
})

function confirmDate(e) {
    if (dateInput.value.length == 0) {
        dateDiv.style.border = " 1px solid red"
        dateP.style.color = "red"
    }else if (dateInput.value.length < 5) {
        dateDiv.style.border = " 1px solid red"
        dateP.style.color = "red"
        return false;
    }  else if (dateInput.value.length = 5) {
        dateDiv.style.border = " 1px solid #000"
        dateP.style.color = "#000"
        return true;
    } else {
        return true;
    }
}

// Cvv input Validation
const cvvInput = document.getElementById('cvv')
const cvvDiv = document.getElementById('cvv-div')
const cvvP = document.getElementById('cvv-p')

function checkCvv() {
    confirmCvv();
    checkInput()
}

function confirmCvv(e) {
    if (cvvInput.value.length == 0) {
        cvvDiv.style.border = " 1px solid red"
        cvvP.style.color = "red"
    } 
    else if (cvvInput.value.length > 3) {
        cvvInput.value = cvvInput.value.slice(0, 3)
    }  else if (cvvInput.value.length < 3) {
        cvvDiv.style.border = " 1px solid red"
        cvvP.style.color = "red"
        return false;
    }  else if (cvvInput.value.length = 3) {
        cvvDiv.style.border = " 1px solid #000"
        cvvP.style.color = "#000"
        return true;
    } else {
        return true; 
    }
    
}
