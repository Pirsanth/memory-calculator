(function (window) {
  'use strict';

  var NUMBER_BUTTON_SELECTOR = '[data-button = "number"]';
  var OPERATION_BUTTON_SELECTOR = '[data-button = "operation"]';
  var C_BUTTON_SELECTOR = '[data-button="cancel"]';
  var CLEAR_BUTTON_SELECTOR = '[data-button="clear"]';
  var EQUALS_BUTTON_SELECTOR = '[data-button="equals"]';
  var DECIMAL_BUTTON_SELECOR = '[data-button="decimal"]';
  var ANS_BUTTON_SELECTOR = '[data-button = "answer"]';
  var DISPLAY_EQUATION_SELECTOR = '[data-display = "equation"]';
  var DISPLAY_ANSWER_SELECTOR = '[data-display = "answer"]';
  var MEMORY_OPERATION_SELECTOR = '[data-memory="operation-counter"]';
  var MEMORY_VIEW_BUTTON_SELECTOR = '[data-memory="view-button"]';
  var COVER_CLEAR_BUTTON_SELECTOR = '[data-cover="clear-button"]';
  var COVER_CLOSE_BUTTON_SELECTOR = '[data-cover="close-button"]';
  var COVER_LIST_SELECTOR = '[data-cover="list"]';
  var COVER_PARENT_SELECTOR = '[data-cover="parent"]';

  var App = window.App;
  var ButtonControl = App.ButtonControl;
  var Display = App.Display;
  var Operations = App.Operations;
  var TopHandler = App.TopHandler;
  var CoverHandler = App.CoverHandler;
  var LocalStorage = App.LocalStorage;

  var display = new Display(DISPLAY_EQUATION_SELECTOR, DISPLAY_ANSWER_SELECTOR);
  var operations = new Operations();
  var buttonControl = new ButtonControl(NUMBER_BUTTON_SELECTOR, OPERATION_BUTTON_SELECTOR,
    C_BUTTON_SELECTOR, CLEAR_BUTTON_SELECTOR, EQUALS_BUTTON_SELECTOR, DECIMAL_BUTTON_SELECOR);
  var localStorage = new LocalStorage();
  var topHandler = new TopHandler(MEMORY_VIEW_BUTTON_SELECTOR, MEMORY_OPERATION_SELECTOR);
  var coverHandler = new CoverHandler(COVER_CLEAR_BUTTON_SELECTOR, COVER_CLOSE_BUTTON_SELECTOR, COVER_LIST_SELECTOR, COVER_PARENT_SELECTOR);

  buttonControl.addNumberHandler(function(text) {
    if(operations.getNumberOfOperations() === -1){
      display.appendNumberToEquation(text);
    }
    else{
      display.appendNumberToEquation(text);
      var number = display.getNumberAtEnd();
      var newAnswer = operations.updateAnswer(number);
      display.setAnswerLine(newAnswer);
    }
  });
  buttonControl.addDecimalHandler(function (text, element) {
  if(!display.saved && display.decimalAble){
      buttonControl.animationDepressed(element);
      display.appendDecimalToEquation(text);
  }
  else{
      buttonControl.animationInvalid(element);
  }
  });
  buttonControl.addOperationHandler(function (signString, element) {
    if(!display.saved){
      if(operations.getNumberOfOperations() === -1){
        var number = display.parseEntireEquation();
        //catches case when pressing + when all you have is . or no number present && number of operations === -1
            if(!isNaN(number)){
              buttonControl.animationDepressed(element);
              operations.newOperation(signString, number);
              display.appendOperatorToEquation(signString);
              display.setAnswerLine(number);
            }
            else{
              buttonControl.animationInvalid(element);
            }
      }

      else{
          if(operations.isAnOperatorSign(display.getLastChar())){
              buttonControl.animationDepressed(element);
              operations.changeCurrentSign(signString);
              display.deleteLastChar();
              display.appendOperatorToEquation(signString);
            }
          else{
              buttonControl.animationDepressed(element);
              var number = display.getNumberAtEnd();
              var newAnswer = operations.updateAnswer(number);
              display.setAnswerLine(newAnswer);
              display.appendOperatorToEquation(signString);
              operations.newOperation(signString, newAnswer);
            }
        }
  }
  //if it is in the saved state
  else {
      buttonControl.animationInvalid(element);
  }
  });
  buttonControl.addCHandler(function (element) {
      if(!display.saved){

          buttonControl.animationDepressed(element);
          var lastCharacter = display.getLastChar();
          display.deleteLastChar();
          var remainingLastCharacter = display.getLastChar();

        if(operations.getNumberOfOperations() !== -1){
            if(operations.isAnOperatorSign(lastCharacter)){
                  var newAnswer = operations.getpreviousValue();
                  display.setAnswerLine(newAnswer);
                  operations.cancelOperation();
                }
            else if(lastCharacter === "."){
                display.setDecimaAbleAttribute(true);
                }
                //pressed C into an operator sign so display.getLastChar() would return NaN
                //if it wasn't for the else if below
            else if (operations.isAnOperatorSign(remainingLastCharacter)) {
              var newAnswer = operations.getpreviousValue();
              display.setAnswerLine(newAnswer);
            }
            else{
                    var number = display.getNumberAtEnd();
                    var newAnswer = operations.updateAnswer(number);
                    display.setAnswerLine(newAnswer);
                }
        }
        else {//no operators as of yet and no updating of the answer value if there are no operations
            if(lastCharacter === "."){
              display.setDecimaAbleAttribute(true);
              }
          }

    }
    else {//if the display is in the saved state
          buttonControl.animationInvalid(element);
    }
      });
  buttonControl.addCEHandler(function() {
          display.CEFunction();
          operations.clearNumberOfOperations();
  });

  buttonControl.addEqualsHandler(function(element) {
    if(!display.saved && !display.error && operations.getNumberOfOperations() !== -1 && !isNaN(display.getNumberAtEnd())){
          buttonControl.animationDepressed(element);
          var number = display.getNumberAtEnd();
          operations.saveAnswer(number);
          operations.clearNumberOfOperations();
          display.equalsFunction(function (equation, answer) {
                coverHandler.populateList(equation, answer);
                topHandler.increaseCounterAndViewElement(function (savedEquations) {
                  localStorage.increaseCounterInMemory(savedEquations);
                });
                localStorage.addEquationaAndAnswer(equation, answer);
              });
          }
    else{
      buttonControl.animationInvalid(element);
    }

    });
  topHandler.addViewButtonHandler(function () {
      coverHandler.setVisible();
  });
  coverHandler.addCloseHandler(function () {
      coverHandler.setDisplayNone();
  });
  coverHandler.addClearHandler(function () {
    coverHandler.clearList();
    topHandler.clearCounterAndViewElement();
    display.CEFunction();
    operations.clearNumberOfOperations();
    localStorage.clearMemory();
  });

  buttonControl.addAnswerHandler(ANS_BUTTON_SELECTOR, function (element) {
      if(operations.savedAnswer){
        buttonControl.animationDepressed(element);
        display.appendNumberToEquation(operations.savedAnswer);

        if(operations.getNumberOfOperations() !== -1){
            var number = display.getNumberAtEnd();
            var newAnswer = operations.updateAnswer(number);
            display.setAnswerLine(newAnswer);
          }

      }
      else{
        buttonControl.animationInvalid(element);
      }
  });
//because there is no array the localStorage and display moodules
//store the number of operations starting from 0 and not -1 as in the case of
//the opeartions module
  localStorage.setStateFromMemory(function (numberOfOperations, equationsAndAnswers) {
    if(numberOfOperations !== 0){
      setTimeout(function () {
        topHandler.setFromMemory(numberOfOperations);
        var array = equationsAndAnswers.split("\n");

        for(var i=0; i < array.length -1; i = i+2){
          coverHandler.populateList(array[i], array[i+1]);
        }

      }, 0);
    }
  });

})(window);
