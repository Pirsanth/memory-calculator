(function (window) {
  'use strict';

  var App = window.App || {};


  function CoverHandler(clearButtonSelector, closeButtonSelector, listSelector, parentSelector) {
    if(!clearButtonSelector || !closeButtonSelector || !listSelector || !parentSelector){
      throw new Error("Some selectors not specified");
    }

    this.closeButton = document.querySelector(closeButtonSelector);
    this.clearButton = document.querySelector(clearButtonSelector);
    this.list = document.querySelector(listSelector);
    this.parent = document.querySelector(parentSelector);

    if(!this.clearButton || !this.clearButton || !this.list || !this.parent){
      throw new Error("One or more selectors did not match any elements");
    }
  }
function makeListElements(equation, answer) {
  var equationLine = document.createElement("li");
  equationLine.appendChild(document.createTextNode(equation));
  this.equationLine = equationLine;

  var answerLine = document.createElement("li");
  answerLine.appendChild(document.createTextNode("Answer: " + answer));
  answerLine.setAttribute("class", "answer");
  this.answerLine = answerLine;
}

  CoverHandler.prototype.addClearHandler = function (fn) {
    this.clearButton.addEventListener("click", function (event) {
      event.preventDefault();
      fn();
    });
  };
  CoverHandler.prototype.addCloseHandler = function (fn) {
    this.closeButton.addEventListener("click", function (event) {
      event.preventDefault();
      fn();
    });
  };
  CoverHandler.prototype.setVisible = function () {
    this.parent.style.display = "block";
  };
  CoverHandler.prototype.setDisplayNone = function () {
    this.parent.style.display = "none";
  };
  CoverHandler.prototype.populateList = function (equation, answer) {
    var newElements = new makeListElements(equation, answer);
    this.list.appendChild(newElements.equationLine);
    this.list.appendChild(newElements.answerLine);
  };
  CoverHandler.prototype.clearList = function () {
    var childElement;

    while(childElement = this.list.firstElementChild){
      this.list.removeChild(childElement);
    }
  };

  App.CoverHandler = CoverHandler;
  window.App = App;

})(window);
