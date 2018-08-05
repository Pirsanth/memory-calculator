(function(window) {
  'use strict';

  var App = window.App || {};

  function ButtonControl(selectorNumber, selectorOperation, selectorC, selectorCE, selectorEquals, selectorDecimal) {
        if(!selectorNumber || !selectorOperation || !selectorC || !selectorCE || !selectorEquals || !selectorDecimal){
          throw new Error ('All specified selectors not given')
        }
        var numberNodeList = document.querySelectorAll(selectorNumber);
        var operationNodeList = document.querySelectorAll(selectorOperation);

        if(!numberNodeList.length || !operationNodeList.length ){
          throw new Error('Check the number and operator selectors');
        }
        this.numberButtonArray = [].slice.call(numberNodeList);
        this.operationButtonArray = [].slice.call(operationNodeList);
        this.cButton = document.querySelector(selectorC);
        this.CEButton = document.querySelector(selectorCE);
        this.equalsButton = document.querySelector(selectorEquals);
        this.decimalButon = document.querySelector(selectorDecimal);

        if(!this.cButton || !this.CEButton || !this.equalsButton || !this.decimalButon){
          throw new Error("The non-operator and non-number selectors do not match all the required elements");
        }
  }

ButtonControl.prototype.addNumberHandler = function (fn) {

          function addHandler(button) {
            button.addEventListener('click', function (event) {
                  event.preventDefault();
                  ButtonControl.prototype.animationDepressed(event.target);
                  fn(event.target.textContent);
            });
          }
          this.numberButtonArray.forEach(addHandler);
};
ButtonControl.prototype.addDecimalHandler = function (fn) {
      this.decimalButon.addEventListener('click', function (event) {
              event.preventDefault();
              fn(event.target.textContent, event.target);
      });
};
ButtonControl.prototype.addOperationHandler = function (fn) {
          function addHandler(button) {
            button.addEventListener('click', function (event) {
                  event.preventDefault();
                  fn(event.target.textContent, event.target);
            });
          }
          this.operationButtonArray.forEach(addHandler);
};
ButtonControl.prototype.addCHandler = function (fn) {
      this.cButton.addEventListener('click', function (event) {
            event.preventDefault();
            fn(event.target);
      });
};

ButtonControl.prototype.addCEHandler = function (fn) {
    this.CEButton.addEventListener('click', function(event){
          ButtonControl.prototype.animationDepressed(event.target);
          event.preventDefault();
          fn();
    });
};
ButtonControl.prototype.addEqualsHandler = function (fn) {
    this.equalsButton.addEventListener('click', function (event) {
                event.preventDefault();
                fn(event.target);
    });
};
ButtonControl.prototype.animationDepressed = function (element) {
      var x = element.classList;
      x.toggle("depressed");

      setTimeout(function () {
        x.toggle("depressed");
      }, 200);

};
ButtonControl.prototype.animationInvalid = function (element) {
      var x = element.classList;
      x.toggle("denied");

      setTimeout(function () {
        x.toggle("denied");
      }, 1000);
};
ButtonControl.prototype.addAnswerHandler = function (selector, fn) {
      var ans = document.querySelector(selector);
      ans.addEventListener("click", function (e) {
        fn(e.target);
      });
};

  App.ButtonControl = ButtonControl;
  window.App = App;

})(window);
