(function (window) {
  'use strict';
  var App = window.App || {};

  function Operations() {
    this.numberOfOperations = -1;
    this.savedAnswer = null;
    this.signArray = [];
    this.previousValueArray = [];
    }

    Operations.prototype.add = function (number) {
      return this.previousValueArray[this.numberOfOperations] + number;
    };
    Operations.prototype.subtract = function (number) {
      return this.previousValueArray[this.numberOfOperations] - number;
        };
    Operations.prototype.multiply = function (number) {
      return this.previousValueArray[this.numberOfOperations] * number;
    };
    Operations.prototype.divide = function (number) {
      return this.previousValueArray[this.numberOfOperations] / number;
    };

    Operations.prototype.updateAnswer = function (numberAtEnd) {
      var currentSign = this.signArray[this.numberOfOperations];

      if(currentSign === "+"){
        return this.add(numberAtEnd);
      }
      else if (currentSign === "-") {
        return this.subtract(numberAtEnd);
      }
      else if (currentSign === "*") {
        return this.multiply(numberAtEnd);
      }
      else if (currentSign === "/") {
        return this.divide(numberAtEnd);
      }
    };

    Operations.prototype.newOperation = function (newSign, previousValue) {
      this.numberOfOperations++;
      this.signArray.push(newSign);
      this.previousValueArray.push(previousValue);
      };
    Operations.prototype.getNumberOfOperations = function () {
        return this.numberOfOperations;
      };
    Operations.prototype.cancelOperation = function () {
        this.previousValueArray.pop();
        this.signArray.pop();
        this.numberOfOperations--;
      };
    Operations.prototype.getpreviousValue = function () {
       return this.previousValueArray[this.numberOfOperations];
      };
    Operations.prototype.clearNumberOfOperations = function () {
      this.numberOfOperations = -1;
      this.signArray = [];
      this.previousValueArray = [];
    };
    Operations.prototype.isAnOperatorSign = function (signString) {
      if(signString === '+' || signString === '-' || signString === '*'
        || signString === '/'){
          return true;
        }
      else{
        return false;
      }
    };
    Operations.prototype.saveAnswer = function (numberAtEnd) {
        this.savedAnswer = this.updateAnswer(numberAtEnd);
    };
    Operations.prototype.changeCurrentSign = function (newSign) {
      this.signArray[this.numberOfOperations] = newSign;
    };

  App.Operations = Operations;
  window.App = App;

})(window);
