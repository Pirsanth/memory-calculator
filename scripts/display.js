(function (window) {
'use strict';
var App = window.App || {};

    function Display(equationLineSelector, answerLineSelector) {
    if(!equationLineSelector || !answerLineSelector){
      throw new Error('All required selectors not provided');
    }

    this.equation = document.querySelector(equationLineSelector);
    this.answer = document.querySelector(answerLineSelector);
    this.saved = false;
    this.decimalAble = true;
    this.error = false;

    if(!this.equation|| !this.answer){
      throw new Error('Some selectors did not return any elenents');
    }
    }

    Display.prototype.appendNumberToEquation = function (valueString) {
      if(this.saved){
        this.CEFunction();
        this.saved = false;
      }
      this.equation.textContent += valueString;
    };
    Display.prototype.CEFunction = function () {
      this.equation.textContent = "";
      this.answer.textContent = "";
      this.decimalAble = true;
      this.saved = false;
      this.error = false;
    };
    Display.prototype.getNumberAtEnd = function () {
      var equation = this.equation.textContent;

      var positionArray = [equation.lastIndexOf('+')];
      positionArray.push(equation.lastIndexOf('-'));
      positionArray.push(equation.lastIndexOf('*'));
      positionArray.push(equation.lastIndexOf('/'));

      var highest = Math.max(positionArray[0], positionArray[1], positionArray[2], positionArray[3]);
      var numberString = equation.substring(highest+1, equation.length);
      var number = parseFloat(numberString);

      return number
  };
  Display.prototype.setAnswerLine = function (number) {
    //incase of Infinity
    if(!isNaN(number) && !isFinite(number)){
        this.showNumberError()
    }
    //in case of NaN
    else if(isNaN(number)){
        this.showSyntaxError()
    }
    else{
      this.error = false;
      this.answer.textContent = number;
    }
  };
    Display.prototype.appendOperatorToEquation = function (newSign) {
      this.equation.textContent += newSign;
      this.decimalAble = true;
    };
    Display.prototype.getLastChar = function () {
      var text = this.equation.textContent;
      var lastCharacter = text.charAt(text.length - 1);
      return lastCharacter;
    };
    Display.prototype.deleteLastChar = function () {
      var text = this.equation.textContent;
      this.equation.textContent = text.substring(0, text.length -1);
    };
    Display.prototype.parseEntireEquation = function () {
      return parseFloat(this.equation.textContent);
    };
    Display.prototype.appendDecimalToEquation = function (text) {
        this.equation.textContent += text;
        this.decimalAble = false;
    };
    Display.prototype.setDecimaAbleAttribute = function (boolean) {
      this.decimalAble = boolean;
    };
    Display.prototype.showNumberError = function () {
      this.answer.textContent = "Number Error"
      this.error = true
    };
    Display.prototype.showSyntaxError = function () {

      this.answer.textContent = "Syntax Error"
      this.error = true;
    };
    Display.prototype.equalsFunction = function (fn) {
        var equation = this.equation.textContent;
        var answer = this.answer.textContent;
        this.equation.textContent = "Saved!";
        this.saved = true;
        fn(equation, answer);
    };


App.Display = Display;
window.App = App;

})(window);
