# Memory Calculator
This is a completely front-end project made with **vanilla ES5 Javascript, HTML and CSS**. It uses **Local Storage** to store the equations saved for the next browsing session (as long as the source URL and protocol is the same).


UI wise I have included a **blinker animation** for the calculator display and **invalid animations** for when a button click is not allowed (in addition to the usual tactile transitions or animations). An example of an invalid button click would be when trying to add two decimal places to the same number. The invalid animation will be trigger for this action.
Also, when an operation button is clicked when there is already an operator at the end of the display, the operator sign will simply change. This comes from the principle of design to reduce errors upfront. Rather than letting the user press two operator buttons in a row and get a syntax error, it is designed in a way that only one operator is allowed between every number in the equation. This is for example why ATMs often give cards out first then cash, to reduce the chances of people leaving their cards at the ATM.
The design of the app is also such that there is an implied clear line from the bottom of the app—in between the operation keys and number keys—and the top of the app—between the div for Equations Saved and View Saved Equations. This is because human beings are good at adding implied lines to any design and makes for a cleaner look.

**Note:** This calculator does not follow BODMAS which is the rule for division and multiplication before addition and subtraction. This is within the design of the app and is not a bug. I originally intended for the operations.js to behave the way it does so that a user could press C to return from a syntax error without losing what has already been input into the equation. This was implemented due to the frustration I have faced on some websites where upon submitting the form it would return empty and signal an error in input.

## Reflecting on my growth since my first GitHub project
My first project on GitHub was a to-do list. I had a limited knowledge of how Javascript worked then and I often got jQuery and Javascript mixed up. I had followed a lengthy tutorial (Coffeerun) from a book called WebNerdRanch and I reversed engineered it a couple of times. I then modified it heavily by adding a slider, tables for uncompleted tasks, a timer for each task, a completed tasks list and much more to turn it into a to-do list.
Since then I have studied Javascript and CSS heavily and decided to build this project without using any frameworks such as Bootstrap or jQuery. I now understand the tools much better and to prove it I have included a What’s Going On section in this Readme. I have also read a couple of blog posts and articles on UI design and have thus included the features described in the Memory Calculator description above.
For my future project I envisage that it will involve a backend using Node.js, I will make use of ES6 Javascript features such as Promises and that it will involve a larger amount of asynchronous operation.

## What’s going on
I intend this to be an explanation of Javascript and how it specifically relates to the code in my project. It is in no way meant to be an exhaustive explanation of the Javascript concepts presented. It is just so I can prove that I understand what is going on in my project.
### a) How the DOM is built
The DOM is the browser’s internal interpretation of the HTML document. The browser builds the DOM by going from one HTML tag to the next. When the browser sees a script tag, it executes the Javascript in the entirety of the script. Only when it gets to the end of the script does it move onto the next HTML tag. Consider the below code taken from index.html:

```javascript
    <script src="scripts/operations.js" charset="utf-8"></script>
    <script src="scripts/display.js" charset="utf-8"></script>
    <script src="scripts/buttons.js" charset="utf-8"></script>
```
What is vital for my project is that when the global window object is modified by the execution of operations.js and the browser moves on to the next HTML script tag—which in this case starts the execution of the code in display.js from start to finish, before moving on to the next HTML tag— the modification to the global object is cumulative.

### b)IFFE modules
Since this project was intended to use only ES5 Javascript, to modularise my code I have implemented the IFFE pattern. ES5 does not have block scopes, only function scopes and the global scope. The IFFE is useful for not polluting the global namespace and only exposing the constructor functions and the methods attached to their prototypes to the global window object while keeping its implementation details hidden. As in this code below taken from the  display.js file shows:

```javascript
(function(window){
var App = window.App || {};

///(…modified for brevity….)

App.Display = Display;
window.App = App;
})(window);
```
In the snippet above I attach the Display constructor function as a property of the App object defined in the global namespace. The App object is the returned module object that gets extended when passed into the other IFFEs in the other Javascript files. I have attached the constructor functions to the App object so as to not clutter the global namespace with identifiers.

One of the main problem with the IFFE module pattern is that we as developers have to manage the dependencies as each module may be dependent on another module for its execution. To handle this I have the main.js file. It handles the main logic which ties all the modules together and it the last script tag. So, it will be run only after all the submodules that extend the App module object are loaded. Within each submodule as well the first line of the IFFE (for example `var App = window.App || {};` in the above) at the start of the IFFE is just so I do not have to have to be pedantic about the order of each submodule's script tag in the HTML document. I would only have to ensure that the main.js script tag is the last. 

**Note:** Declaring variables in the global namespace is the same as attaching a property to the global window object.

### c)The use of “use strict”
Puns aside the *use strict* keyword in my project is beneficial to ensure that there are no leaked global variable declarations. The code below is modified from main.js and has a variable declaration removed on purpose. For illustration purposes I have also named the anonymous function in the IFFE:

```javascript
( function MainAnonymous(window) {

//var has been removed!
  NUMBER_BUTTON_SELECTOR = '[data-button = "number"]';
  var OPERATION_BUTTON_SELECTOR = '[data-button = "operation"]';
  var C_BUTTON_SELECTOR = '[data-button="cancel"]';

///(…modified for brevity…)

})(window);
```

When the JS engine encounters the IFFE it immediately runs the function MainAnonymous and puts a new function context on the call stack. A new function scope is also created for the MainAnonymous function. The MainAnonymous function also gets a hidden [[Environment]] property that references the scope in which it was created which in this case is the global scope.

 Before any of the code in the function MainAnonymous is run, an identifier is first made and linked to the window parameter of the MainAnonymous function. Then the code is scanned for any function declarations. If any function declarations are found the functions are created with their own [[Environment]] property pointing to the scope of the IFFE and their identifiers are assigned to the function value. Then the code is scanned for any variable declarations not contained within functions. If an identifier to the variable declaration has not been registered in the *scanning for functions step*, the identifier is created and initialized to undefined. Only then is the code run line by line. This is often visualised as hoisting.

When the engine gets to the line `NUMBER_BUTTON_SELECTOR = '[data-button = "number"]';` it first searches the scope of the IFFE for an identifier to `NUMBER_BUTTON_SELECTOR` but since the variable was not declared and thus initialized to undefined as per the previous discussion, the engine looks into the parent scope of the IFFE –the global scope—via the hidden [[Environment]] property of the function MainAnonymous for the identifier. When it gets to the global scope and cannot find a identifier to NUMBER_BUTTON_SELECTOR, a variable in the global scope is declared. This only occurs in the case of the modified code above since the *use strict* keyword was not included. If the *use strict* keyword was included however, it would throw a Reference Error as it would not allow leaked global variable declarations.

### d)My use of the prototype object and this and the new keyword
Every function gets a prototype object that is a property attached to said function. If object1 is a prototype of object2 and we search for a property on object2 that object2 does not have on itself. It will delegate the search for that property to its prototype, object1. In turn object1 can have a its own prototype forming a prototype chain. To explain *this* and the *new* keyword I would like to refer to some of my code written below.

From operator.js:
```javascript
(function (window) {
'use strict';
var App = window.App || {};

//(...yet again liberally modified for brevity...)

function Display(equationLineSelector, answerLineSelector) {
      this.equation = document.querySelector(equationLineSelector);
      this.answer = document.querySelector(answerLineSelector);
      this.saved = false;
      this.decimalAble = true;
      this.error = false;
    }

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

    App.Display = Display;
    window.App = App;

})(window);
```
And the related snippets in main.js:

```javascript
  var display = new Display(DISPLAY_EQUATION_SELECTOR, DISPLAY_ANSWER_SELECTOR);

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
```
The this parameter is what’s called often referred to as the function context. To find out what the this parameter is we have to ask: How is the function invoked? Consider the code above taken from both main.js and operator.js.

 When `var display = new Display(DISPLAY_EQUATION_SELECTOR, DISPLAY_ANSWER_SELECTOR);` in main.js is run--display is run as a constructor function via the new keyword-- a new empty object is created. This empty object will be passed to the Display function as the value of this. It will thus go through Display and get the properties equation, answer, saved, decimalAble and error. It will also get its prototype set as the prototype object of the Display constructor function (Display.prototype). This object will be returned by the constructor function (Indeed it will be returned even if there was a return statement returning a non-object in the constructor function) and gets set as the variable display.

 Now to use the prototype link! When we consider the line `display.setAnswerLine(newAnswer);` the display object (newly instantiated) itself does not have a setAnswerLine property however its prototype (Display.prototype) hanging off the constructor function does. when we get inside the prototype object's setAnswerLine method the value of *this* will be display because invoking a function as a method sets the value of *this* to the object. This is known as implicit binding.

 The benefit of attaching methods to the prototype object of the constructor function instead of simply attaching the function methods to *this* inside the constructor function is that if we make multiple instance objects, they would each have to have a method function property hanging off them rather than a simple reference to the one method on the prototype which saved memory. On a similar note, if we created multiple instances of display (e.g `display2 = new Display()`) they would each get their own saved, decimalAble, error, equation and answer properties. Only the properties on the prototype object are shared.

 There are two other forms of binding that I will not cover and did not use in my project: window or default binding and implicit binding with the bind or apply methods. I find that using implicit binding to set the value of *this* in the callback to be a much more elegant solution than using the bind method.

Before I finish this section I would like to defend my choice of attaching the showNumberError method to the prototype object, as shown below.

```javascript
Display.prototype.showNumberError = function () {
  this.answer.textContent = "Number Error"
  this.error = true
};
```
Although I understand that the prototype method of setAnswerLine (the function) is created in the IFFE and thus has access to the scope of the IFFE via its [[Environment]] property and therefore I could have simply defined showNumberError as a function in the scope of the IFFE, I decided to go with the current approach instead for the same reasons as above. I thought that `add.bind(this)` would have been unsightly and opted to make the setAnswerLine method of the prototype look for the showNumberError method of the instantiated object thereby going to the prototype again via `this.showNumberError()`.

I have also not made use of inheritance as I found no need for that level of abstraction in this project. Perhaps I will in a future project.

### e)The setInterval hack
As we are all aware Javascript is single threaded. Javascript also needs a hosting environment. The idea of concurrency in Javascript is that the hosting enviroment gives Javascript either the WebAPIs in the case of the browser or C++ libraries in the case of Node.js. These help by listening for multiple events simultaneously. However when the events do occur they are placed in an event loop queue to be run by the Javascript thread, one after the another.

This has benefits when combined with Javascript's run-to-completion feature whereby a funtion is run in its entirety. It reduces the level of non-determinism to the function level—we are simply concerned with whether functionA completed asynchronously before functionB or vice versa. However the processing for each event still gets done one after another, not in parallel.

So we have the Javascript thread and we have covered the eventloop queue there is also another thread that is inportant—no Job queue in this since ES5—the UI thread. You see after the Javascript thread fnishes executing, the event loop checks the event loop queue for pending tasks. But before the event loop checks the queue the UI theread is allowed to refresh the screen.

In main.js I have used setInterval as follows:
```javascript
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
```
I used it because I know that split is very slow and I have saved both equations and answers as a single giant string value -- the Local Storage API only alows the storing of strings. This will place the anonymous function in the event loop queue and give the UI thread a chance to refresh.

It would also be trivial to extend this in the future to operate in chucks of 100 index values for an especially large `numberOfOperations` value.
