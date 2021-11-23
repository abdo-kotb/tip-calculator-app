const billInput = document.getElementById('bill');
const peopleNumInput = document.getElementById('people');
const tipOptions = document.querySelector('.options');
const tipAmount = document.querySelector('.tip-amount');
const customInput = document.querySelector('.custom');
const totalAmount = document.querySelector('.total-amount');
const resetBtn = document.querySelector('.reset');

// initial values
let billValue = 0;
let tipValue = 0;
let peopleNum = 0;

// prevent forms from submitting and reloading the page
[...document.forms].forEach(form =>
  form.addEventListener('submit', e => e.preventDefault())
);
// prevent input fields from showing default error messages
document
  .querySelectorAll('input')
  .forEach(inp => inp.addEventListener('invalid', e => e.preventDefault()));

/**
 * a function that adds and removes class [error]
 * @param {Object} element to specify the element which to add to or remove the class from
 * @param {String} type that determines to add or remove
 */
const toggleErrorClass = function (element, type) {
  if (type === 'add') {
    element.classList.add('error');
    element.previousElementSibling.classList.add('error');
  }

  if (type === 'remove') {
    element.classList.remove('error');
    element.previousElementSibling.classList.remove('error');
  }
};

// a function that removes class [active] from all tip buttons
const removeActiveFromBtns = function () {
  document
    .querySelectorAll('.tip-btn')
    .forEach(btn => btn.classList.remove('active'));
};

/*
  a function that calculates the tips and the total amount paid by person
  1) returning the function immediately if it does not meet the specified conditions
  2) adding the amount to the page
  3) adding the class [active] to the reset button
  - the function will be called with all 3 main functions
*/
const calcTips = function () {
  if (billValue < 1 || !tipValue || peopleNum < 1) return;

  const tip = (billValue * tipValue) / peopleNum;
  const total = (billValue * (tipValue + 1)) / peopleNum;

  tipAmount.textContent = `$${tip.toFixed(2)}`;
  totalAmount.textContent = `$${total.toFixed(2)}`;

  resetBtn.classList.add('active');
};

// a function that gets the value of the input field and toggles class [error] to that input with an option to discard decimals
const setValue = function () {
  if (
    +this.value < 1 ||
    (this === peopleNumInput ? !Number.isInteger(+this.value) : '')
  ) {
    toggleErrorClass(this, 'add');
  } else {
    toggleErrorClass(this, 'remove');

    if (this === billInput) billValue = +this.value;
    if (this === customInput) tipValue = +this.value / 100;
    if (this === peopleNumInput) peopleNum = +this.value;

    calcTips();
  }
};

// a function that determins wether to get the tip value from the buttons or from the custom input field
const setTipValue = function (e) {
  const btn = e.target.closest('.tip-btn');
  const custom = e.target.closest('.custom');
  /*
    if btn
      - remove class [active] from all buttons and adding it back to the clicked one
      - remove class [error] from the custom input field
      - get the value
  */
  if (btn) {
    removeActiveFromBtns();
    toggleErrorClass(customInput, 'remove');
    customInput.value = '';

    btn.classList.add('active');

    tipValue = +btn.dataset.value / 100;

    calcTips();
  }
  /*
    if custom
      - remove class [active] from all buttons and adding it back to the clicked one - DRY ✔
      - call setValue function
  */
  if (custom) {
    removeActiveFromBtns();

    custom.addEventListener('input', setValue);
  }
};

// a function that resets the app and removes all values and special classes
const resetApp = function () {
  const btns = document.querySelectorAll('.tip-btn');

  billInput.value = peopleNumInput.value = customInput.value = '';
  document
    .querySelectorAll('input')
    .forEach(el => toggleErrorClass(el, 'remove'));

  btns.forEach(btn => btn.classList.remove('active'));

  billValue = tipValue = peopleNum = 0;
  tipAmount.textContent = totalAmount.textContent = '$0.00';

  resetBtn.classList.remove('active');
};

// event handlers
billInput.addEventListener('input', setValue);

tipOptions.addEventListener('click', setTipValue);

peopleNumInput.addEventListener('input', setValue);

resetBtn.addEventListener('click', resetApp);
