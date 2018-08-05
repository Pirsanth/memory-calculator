(function (window) {
    'use strict';
    var App = window.App || {};
    var storage = window.localStorage;

    function LocalStorage() {
      if(!storage.getItem("storedOperationNumber") || !storage.getItem("equationsAndAnswers")){
        initialize();
      }
    }

    function initialize() {
      storage.clear();
      storage.setItem("storedOperationNumber", "0");
      storage.setItem("equationsAndAnswers", "");
    }

    LocalStorage.prototype.addEquationaAndAnswer = function (equation, answer) {
      storage["equationsAndAnswers"] += equation + "\n" + answer + "\n";
    };
    LocalStorage.prototype.setStateFromMemory = function (fn) {
        var numberOfOperations = parseFloat(storage["storedOperationNumber"]);
        var equationsAndAnswers = storage["equationsAndAnswers"];
        fn(numberOfOperations, equationsAndAnswers);
    };
    LocalStorage.prototype.clearMemory = function () {
        initialize();
    };
    LocalStorage.prototype.increaseCounterInMemory = function (savedNumberOfEquations) {
        var number = new Number(savedNumberOfEquations);
        var string = number.toString();
        storage["storedOperationNumber"] = string;
    };

  App.LocalStorage = LocalStorage;
  window.App = App;

})(window);
