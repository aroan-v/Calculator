//  <---------- Declaration of Variables ---------->

let calc = {};

const numButton = document.querySelectorAll(".number-button");
const operatorButton = document.querySelectorAll(".operator-button");
const equalButton = document.querySelector(".equal-button");
const clearButton = document.querySelector(".clear-button");
const mainDisplayContent = document.querySelector(".text-container");
const mainDisplayContainer = document.querySelector(".main-display");
const secDisplayContent = document.querySelector(".secondary-display");
const deleteButton = document.querySelector(".delete-button");
const deleteButtonIcon = document.querySelector(".delete-button-icon");
const decimalButton = document.getElementById("decimal");

const parentNumButton = document.querySelector(".numbers");
const childNumButton = parentNumButton.querySelectorAll("div");

const allButtons = document.querySelectorAll(
  ".number-button, .clear-button, .delete-button, .operator-button, .equal-button"
);

//  <---------- Math Functions ---------->

function add(val1, val2) {
  return val1 + val2;
}

function subtract(val1, val2) {
  return val1 - val2;
}

function multiply(val1, val2) {
  return val1 * val2;
}

function divide(val1, val2) {
  if (val2 === 0) {
    return;
  }

  return val1 / val2;
}

function dividedByZero() {
  calcReset();
  textSizeDisplayToggle(2);
  flashDisplay("Cannot divide by zero!", 1);
  secondDisplay("Error");
  calc.restart = true;

  // Assigned to an object property so clearTimeout() can cancel it if necessary.
  calc.delay = setTimeout(() => {
    calcReset(1);
  }, 5000);
}

function performOperation() {
  switch (calc.operator) {
    case "+":
      calc.finalNumber = add(calc.operand1, calc.operand2);
      break;

    case "-":
      calc.finalNumber = subtract(calc.operand1, calc.operand2);
      break;

    case "*":
      calc.finalNumber = multiply(calc.operand1, calc.operand2);
      break;

    case "/":
    case "÷":
      if (calc.operand2 === 0) {
        dividedByZero();
        return;
      }
      calc.finalNumber = divide(calc.operand1, calc.operand2);
      break;

    default:
      console.log("this shouldn't fire but it did so something's wrong");
      debugger;
      break;
  }

  // Resets the calculator if Infinity was detected.
  if (
    calc.finalNumber.toString().length > 23 ||
    calc.finalNumber === Infinity
  ) {
    handleInfinity();
    return;
  }

  calc.operand2 = 0;

  // Removes the trailing zeroes and also rounds the decimal into nearest hundreds.
  calc.operand1 =
    calc.finalNumber % 1 === 0
      ? parseFloat(calc.finalNumber.toFixed(0))
      : parseFloat(calc.finalNumber.toFixed(3));

  delete calc.operator;
  flashDisplay(calc.operand1, 1);
}

function equals() {
  if (calc.currentValue === "0") {
    // Execute dividedByZero function to display warning message and reset calculator.
    if (calc.operator === "÷") {
      dividedByZero();
      return;
    }

    console.log("Enter a value!");
    // Displays the running total
    if (calc.chain && calc.operator && !calc.equalsChain) {
      secondDisplay(undefined, 1);
      console.log("displayed the total");
      secondDisplay("= " + calc.operand1);
      calc.equals = true;
      calc.equalsChain = true;
      console.log("calc.equalsChain: ", calc.equalsChain);
      delete calc.operator;
      return;
    } else if (calc.equals === false) {
      // If equals was pressed after pressing an operator, deletes the operator
      console.log("operator deleted");
      secondDisplay(undefined, 1);
      delete calc.operator;
      calc.equals = true;
      return;
    }

    flashNumbers();
    return;
  }

  // Flashes the operator buttons if the equal button was pressed before the operators
  if (!calc.operator || calc.equals) {
    console.log("Enter an operator!");
    operatorButton.forEach((button) => button.classList.add("flash"));

    setTimeout(function () {
      operatorButton.forEach((button) => button.classList.remove("flash"));
    }, 500);

    return;
  }

  calc.decimalButton = false;
  changeSecondVal();

  // Checks if second value is infinity.
  if (calc.restart) {
    console.log("Infinity number detected. Calculator will restart.");
    return;
  }

  secondDisplay("=");
  performOperation();

  // Checks if the answer is infinity.
  if (calc.restart) {
    console.log("Infinity number detected. Calculator will restart.");
    return;
  }

  secondDisplay(calc.operand1);
  flashDisplay(calc.operand1, 1);
  calc.equals = true;
  calc.equalsChain = true;
  console.log("calc.equalsChain: ", calc.equalsChain);
}

//  <---------- Visual Feedback Functions ---------->

function addButtonFeedback(value, operator) {
  // Adds the CSS active class effect on the clicked or pressed button.
  switch (value) {
    case "=":
    case "Enter":
    case "equals":
      equalButton.classList.add("active");
      break;
    case "Escape":
    case "clear":
      clearButton.classList.add("active");
      break;
    case "delete":
    case "Backspace":
      deleteButton.classList.add("active");
      break;
    case ".":
    case "decimal":
      decimalButton.classList.add("active");
    case "opr":
      operatorButton.forEach((button) => {
        if (operator === button.getAttribute("data-value")) {
          button.classList.add("active");
        }
      });
      break;

    default:
      childNumButton.forEach((button) => {
        if (value === button.getAttribute("data-value")) {
          button.classList.add("active");
        }
      });
  }
}

function removeButtonFeedback(value, operator) {
  // Removes the CSS active class effect on the clicked or pressed button.
  switch (value) {
    case "=":
    case "equals":
    case "Enter":
      equalButton.classList.remove("active");
      break;
    case "Escape":
    case "clear":
      clearButton.classList.remove("active");
      break;
    case "delete":
    case "Backspace":
      deleteButton.classList.remove("active");
      break;
    case ".":
    case "decimal":
      decimalButton.classList.remove("active");

    case "opr":
      operatorButton.forEach((button) => {
        // if (operator === button.getAttribute("data-value")) {
        //   setTimeout(() => {
        //     button.classList.remove("active");
        //   }, 300);
        // }

        button.classList.remove("active");
      });
      break;

    default:
      childNumButton.forEach((button) => {
        if (value === button.getAttribute("data-value")) {
          button.classList.remove("active");
        }
      });
  }
}

function textSizeDisplayToggle(val) {
  // Changes the font size when called.
  // val
  //   ? mainDisplayContainer.classList.add("small")
  //   : mainDisplayContainer.classList.remove("small");

  switch (val) {
    case 1:
      mainDisplayContainer.classList.add("small");
      break;
    case 2:
      mainDisplayContainer.classList.add("infinity");
      break;
    default:
      mainDisplayContainer.classList.remove("small");
      mainDisplayContainer.classList.remove("infinity");
      break;
  }
}

function secondDisplay(val, val2) {
  // This code is executed when the user want to change the operator mid equation.
  if (val2) {
    calc.secDisplayContent = calc.secDisplayContent.slice(0, -2);
    secDisplayContent.textContent = "";
    // The delay is to imitate the behavior of a calculator's display.
    setTimeout(() => {
      secDisplayContent.textContent = calc.secDisplayContent;
    }, 100);
  }

  // Sometimes undefined is passed as an argument if we want the rest of the function to stop from being executed.
  if (val === undefined) {
    return;
  }

  calc.secDisplayContent = calc.secDisplayContent.toString() + " " + val;
  secDisplayContent.textContent = "";

  // The delay is to imitate the behavior of a calculator's display.
  setTimeout(() => {
    secDisplayContent.textContent = calc.secDisplayContent;
  }, 100);
}

function flashDisplay(val, val2) {
  if (val.toString().length > 8 && val != "Infinity") {
    textSizeDisplayToggle(1);
  } else if (val === "Infinity" || val === "Limit") {
    textSizeDisplayToggle(2);
  } else textSizeDisplayToggle(0);

  if (val2) {
    mainDisplayContent.textContent = "";
    // The delay is to imitate the behavior of a calculator's display.
    setTimeout(() => {
      mainDisplayContent.textContent = val;
    }, 100);
  } else {
    mainDisplayContent.textContent = val;
  }
}

//  <---------- Button Functions ---------->

function deleteInput() {
  //force resets the calculator if the restart flag is true.
  if (calc.restart) {
    calcReset();
    return;
  }

  // Do nothing if the mainDisplayContent is already zero.
  if (mainDisplayContent.textContent === "0") {
    flashDisplay("0", 1);
    return;
  }

  // Enable the decimal block if the last deleted value was a decimal.
  if (calc.currentValue.substring(calc.currentValue.length - 1) === ".") {
    calc.decimalButton = false;
  }

  // Delete the last character from the currentValue.
  calc.currentValue = calc.currentValue.substring(
    0,
    calc.currentValue.length - 1
  );

  // Assign "0" if it became an empty string for consistency.
  calc.currentValue = calc.currentValue || "0";

  // Update the mainDisplayContent with the new content.
  flashDisplay(calc.currentValue);
}

function decimalToggle(event) {
  if (calc.equals || calc.restart) {
    calcReset();
    return;
  }

  if (!calc.decimalButton) {
    inputNumbers(".", event);
    calc.decimalButton = true;
  }
}

function inputNumbers(value, event) {
  //force resets the calculator since the operation is already done or the flag for restart is true.
  if (calc.equals || calc.restart) {
    calcReset();
  }

  // Removes the intro message which appears after the calculator resets.
  if (calc.secDisplayContent === "Hello! Press any number \u263A") {
    calc.secDisplayContent = "";
    secondDisplay(calc.secDisplayContent);
    secDisplayContent.classList.remove("small");
  }

  if (value === "." || calc.currentValue.includes(".")) {
    // This statement preserves the zeroes in place.
    calc.currentValue = calc.currentValue + value;
  } else if (calc.currentValue.toString().length > 14) {
    console.log("Exceeded maximum value");
    return;
  } else {
    // If currentValue has no decimal, this method will remove any leading zeroes.
    calc.currentValue = +(calc.currentValue + value).toString();
  }

  // Converts currentValue back to string.
  calc.currentValue = "" + calc.currentValue;

  // Limits the maximum amount of numbers that can be inputted.
  if (calc.currentValue.toString().length > 34) {
    handleInfinity(1);
    return;
  } else if (calc.currentValue === Infinity) {
    handleInfinity();
    return;
  }

  // This code is for visual feedback which imitates a calculator's behavior.
  if (calc.currentValue.length === 1) {
    flashDisplay(calc.currentValue, 1);
  } else flashDisplay(calc.currentValue);
}

function changeFirstVal() {
  calc.operand1 = +calc.currentValue;

  secondDisplay(calc.operand1);
  flashDisplay(calc.operand1, 1);
  calc.firstValue = true;
  calc.currentValue = "0";
}

function changeSecondVal() {
  if (calc.currentValue === "0") {
    return;
  }
  calc.operand2 = +calc.currentValue;

  secondDisplay(calc.operand2);
  calc.chain = true;

  if (calc.equals) {
    calc.equalsChain = true;
  }

  calc.currentValue = "0";
}

function handleInfinity(value) {
  calcReset();

  if (value) {
    flashDisplay("Limit", 1);
    secondDisplay("Reached maximum length!");
  } else {
    flashDisplay("Infinity", 1);
    secondDisplay("Please use smaller numbers!");
  }
  calc.restart = true;

  // Assigned to an object property so clearTimeout() can cancel it if necessary.
  calc.delay = setTimeout(() => {
    calcReset(1);
  }, 5000);
}

function inputOperator(value, event) {
  // parseFloat is used to remove leading zeroes.
  calc.currentValue = "" + parseFloat(calc.currentValue);

  if (calc.operator === "÷" && calc.currentValue === "0") {
    dividedByZero();
    console.log("dividedByZero() was triggered.");
    return;
  }

  // Gives the number buttons a little flash when the user presses an operator without inputting a number.
  if (!calc.firstValue && calc.currentValue === "0") {
    flashNumbers();
    console.log("Press a number!");
    return;
  }

  // Flag for the equals function.
  if (calc.equalsChain && !calc.equals) {
    calc.equalsChain = false;
    console.log("calc.equalsChain: operator: ", calc.equalsChain);
  }

  calc.decimalButton = false;

  // This function is for changing operators, performOperation() will not fire.
  if (
    (calc.currentValue === "0" || calc.currentValue === "0.") &&
    !calc.equals
  ) {
    deleteInput();
    calc.operator = value;
    secondDisplay(value, 1);
    return;
  }

  // This is executed if the user just pressed equals and wants to do more.
  if (calc.equals) {
    calc.operator = value;
    secondDisplay(value);
    calc.equals = false;
    flashDisplay("0");
    console.log("calc.equals was true. Operator set and display flashed.");
    return;
  }

  // Checks if there's already a first value. If yes, fires the function that assigns the current value to the second operand.
  if (calc.operand1 || calc.firstValue) {
    changeSecondVal();

    if (calc.restart) {
      return;
    }

    performOperation();

    // Reassign the operator if the user wants to continue the equation.
    if (calc.chain) {
      console.log("Reassign the operator.");
      calc.operator = value;
      secondDisplay(value);
    }

    return;
  } else {
    // Assign the currentValue to the first operand.
    changeFirstVal();
    console.log("First val assigned.");

    if (calc.restart) {
      console.log("Infinity value detected, calculator will restart.");
      return;
    }

    calc.operator = value;
    secondDisplay(value);
    return;
  }
}

function calcReset(value) {
  console.clear();
  clearTimeout(calc.delay);

  calc = {
    firstValue: false,
    currentValue: "0",
    secDisplayContent: "",
    decimalButton: false,
  };

  flashDisplay("0", 1);
  secDisplayContent.textContent = calc.secDisplayContent;
  textSizeDisplayToggle(0);

  if (value) {
    calc.secDisplayContent = "Hello! Press any number \u263A";
    secDisplayContent.textContent = calc.secDisplayContent;
    secDisplayContent.classList.add("small");
  }
}

//  <---------- CSS Manipulation ---------->

function flashNumbers() {
  numButton.forEach((button) => button.classList.add("flash"));

  setTimeout(function () {
    numButton.forEach((button) => button.classList.remove("flash"));
  }, 500);
}

function buttonFeedback() {
  operatorButton.forEach((button) => button.classList.add("flash"));
}

calcReset(1);

//  <---------- Mouse Event Listeners ---------->

// Number Buttons

numButton.forEach((button) => {
  button.addEventListener("mousedown", (event) => {
    addButtonFeedback(event.target.getAttribute("data-value"));
    inputNumbers(event.target.getAttribute("data-value"), event);
  });
});

numButton.forEach((button) => {
  button.addEventListener("mouseup", (event) => {
    removeButtonFeedback(event.target.getAttribute("data-value"));
  });
});

numButton.forEach((button) => {
  button.addEventListener("mouseleave", (event) => {
    removeButtonFeedback(event.target.getAttribute("data-value"));
  });
});

// Operator Buttons

operatorButton.forEach((button) =>
  button.addEventListener("mousedown", (event) => {
    addButtonFeedback("opr", event.target.getAttribute("data-value"));
    inputOperator(event.target.getAttribute("data-value"), event);
  })
);

operatorButton.forEach((button) =>
  button.addEventListener("mouseup", (event) => {
    removeButtonFeedback("opr", event.target.getAttribute("data-value"));
  })
);

operatorButton.forEach((button) =>
  button.addEventListener("mouseleave", (event) => {
    removeButtonFeedback("opr", event.target.getAttribute("data-value"));
  })
);

// Equal Button

equalButton.addEventListener("mousedown", (event) => {
  addButtonFeedback(event.target.id);
  equals();
});

equalButton.addEventListener("mouseup", (event) => {
  removeButtonFeedback(event.target.id);
});

equalButton.addEventListener("mouseleave", (event) => {
  removeButtonFeedback(event.target.id);
});

// AC Button

clearButton.addEventListener("mousedown", (event) => {
  addButtonFeedback(event.target.id);
  calcReset(1);
});

clearButton.addEventListener("mouseup", (event) => {
  removeButtonFeedback(event.target.id);
});

clearButton.addEventListener("mouseleave", (event) => {
  removeButtonFeedback(event.target.id);
});

// Delete Button

deleteButton.addEventListener("mousedown", (event) => {
  addButtonFeedback(event.target.id);
  deleteInput();
});

deleteButtonIcon.addEventListener("mousedown", (event) => {
  addButtonFeedback("delete");
});

deleteButton.addEventListener("mouseup", (event) => {
  removeButtonFeedback(event.target.id);
});

deleteButtonIcon.addEventListener("mouseup", (event) => {
  removeButtonFeedback("delete");
});

deleteButton.addEventListener("mouseleave", (event) => {
  removeButtonFeedback(event.target.id);
});

// Period Button

decimalButton.addEventListener("mousedown", (event) => {
  addButtonFeedback(event.target.id);
  decimalToggle();
});

decimalButton.addEventListener("mouseup", (event) => {
  removeButtonFeedback(event.target.id);
});

decimalButton.addEventListener("mouseleave", (event) => {
  removeButtonFeedback(event.target.id);
});

//  <---------- Keyboard Event Listeners ---------->

const validKeys = ["+", "-", "/", "*"];

window.addEventListener("keydown", (event) => {
  if (validKeys.includes(event.key)) {
    if (event.key === "/") {
      addButtonFeedback("opr", "÷");
      inputOperator("÷");
    } else {
      addButtonFeedback("opr", event.key);
      inputOperator(event.key);
    }
  }
});

window.addEventListener("keyup", (event) => {
  if (validKeys.includes(event.key)) {
    if (event.key === "/") {
      removeButtonFeedback("opr", "÷");
    } else {
      removeButtonFeedback("opr", event.key);
    }
  }
});

const validKeys2 = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "=",
  "Enter",
  "Backspace",
  "Escape",
  ".",
];

window.addEventListener("keydown", (event) => {
  if (event.key >= "0" && event.key <= "9") {
    addButtonFeedback(event.key);
    inputNumbers(event.key, event);
  } else if (event.key === ".") {
    addButtonFeedback(event.key);
    decimalToggle();
  } else if (event.key === "=" || event.key === "Enter") {
    addButtonFeedback(event.key);
    equals(1);
  } else if (event.key === "Backspace") {
    addButtonFeedback(event.key);
    deleteInput();
  } else if (event.key === "Escape") {
    addButtonFeedback(event.key);
    calcReset(1);
  }
});

window.addEventListener("keyup", (event) => {
  if (validKeys2.includes(event.key)) {
    removeButtonFeedback(event.key);
  }
});
