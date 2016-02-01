(function(){
  'use strict';

  angular.module('app')
         .service('AppService', ['$q', AppService]);

  /**
   * Lists DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function AppService($q){
    var modules = [
      {
        name: 'Variables',
        avatar: 'svg-1',
        instructions: [
          "Hello, and welcome to DuDE Learning! Hit the next tip button to see what to do next.",
          "The first thing that we are going to learn is variable assignment! Variables in programming allow us to save information for later",
          "Lets learn what this means! Click on the '+ variable' button at the bottom of the screen",
          "See how a block appeared on the screen?  This is the first thing that happens when you make a program",
          "Before we can run the program, we need to fill out some information in the variable. ",
          "In the text box labelled name, type the name 'numberone'. This is the name we will use when we want to use it again.",
          "Next, in the text box labelled value, we need to give numberone a value. type '1' in the box to give numberone a value of one.",
          "Click the '+ variable' button at the bottom of the screen again ",
          "This time, give the variable the name 'numbertwo' and the value 2. ",
          "Now, we can run the program! Hit the 'Start' button to start running the program!",
          "See the glow? This is where the program is currently running. To advance the program, hit the 'Next' button on the bottom right to see what happens next",
          "Look where the arrow is now! It is pointing at the numberone block. Also, look in the top right corner! You can see that numberone = 1!",
          "This means that the value one is stored in the variable numberone.  Hit the 'Next' button to see what happens next.",
          "Now look back at the top right corner! You can see numberone and numbertwo! These are the variables in the program. ",
          "Now lets try some more complicated variables. Add a new variable with the name numberthree.",
          "Lets use our previous variables to make this new variable! In the value box, type 'numberone + numbertwo'",
          "Lets see the result of what this does!  Run the program until the glow is at the numberthree variable block",
          "If we look at the variables for the program, we see that  numberthree has a value of three!",
          "This makes sense because if numberone is the same as 1, and numbertwo is the same as 2, then 1 + 2 = 3 ",
          "Since we are running out of time in this module, I will just say that all of the other math that you know works in these variables! For example, 3 x 4 is allowed to be a value, and would mean that the variable then has a value of 12. 4 - 3 works as well.",
          "If you want, you can continue to add variables and see their values, but for now, you have completed Module 1! Congratulations! Click the 'Next Module' button when you are done to access the next module."
          ]
      },
      {
        name: 'Conditionals',
        avatar: 'svg-2',
        instructions: [
          "Welcome to Module 2! Now we are going to learn about conditionals, or as they are more commonly known, if blocks!",
          "Lets start by add some variable assignments as you learned in the last module. Add a variable to the program called firstnumber and give it a value of 4.",
          "Now we are going to try something new! Click the '+ If' button to add a if block.",
          "The if block is different from a variable block, it only has a single box for you to edit. This box is called the conditional.",
          "Conditionals are different compared to the values and names that you were using before, in that they only are a true or false statement, not a number.",
          "In the conditional box, type 'firstnumber == 3', then add a new variable block with the name firstnumber and value 5.",
          "After the variable block, we need to tell the program when to stop the if, so add a 'End If' block.",
          "Now the program is ready to run! Click the 'Run Program' button and then click the 'Next' button.",
          "We can see that we have the same firstnumber variable in the variables like we did previously, however what happens next is very cool! Click the 'Next' button.",
          "Now the arrow is pointing to the if block, and we can see the conditional for the if block is 'firstnumber = 3'. However, we set the value of firstnumber to 4. Since 4 does not equal 3, I wonder what will happen? Click the 'Next Statement' button.",
          "Oh! Looking at the variables, we can see that firstnumber is still equal to 3... So it looks like what happened was that since first number was not equal to 4, we did not run the variable block inside the if.",
          "What happens if firstnumber is equal to 4? Stop running the program and change the value of the firstnumber variable to be equal to 4.",
          "Now if we run the program again, what happens after we click the 'Next' button when we are on the if block?",
          "Oh! The arrow is pointing at the variable block inside the if block! So it looks like if the conditional inside an if block is true, then what is inside the if runs! And if it is false, it does not run!",
          "Congratulations on completing Module 2! Feel free to play around more with the current program to see what happens, but Module 3 is waiting for you!"
        ]
      },
      {
        name: 'Loops',
        avatar: 'svg-3',
        instructions: [
          "Now lets learn about loops! To start, add a variable called 'loopvariable' and set its value to 2",
          "Then, click the '+ While' button to add a new block to your program! The block looks very similar to the if blocks that you were using earlier, however they function quite differently!",
          "To see how this block functions, write 'loopvariable < 4' in the condition in the loop block. The '<' symbol means less than. Also, add a new variable block after the while, with loopvariable as the name and the value 'loopvariable + 1'. Don't worry about anything that confuses you here, we will explain what happens shortly!",
          "Finally, add an end loop statement to close the loop! Now, lets see what happens when we run the program!",
          "So the first thing that happens is we see the loopvariable being equal to two, as we have seen before. However, go to the next block and see what happens!",
          "Now we see the arrow is currently pointing to the loop block. Initially, the block is similar to the if block, as the arrow will move to the inside block only if the loop condition is true. However, after moving past the 'loopvariable + 1' block, what will happen next?",
          "The arrow moves back to the top! This is what makes loops different from if blocks. The way that loops function is that the blocks inside the loop will be run until the condition for the loop is false!",
          "So for our current program, the loop will exit when loopvariable is equal to four, as four is not less than four. Try running the program until this happens, looking at the value of loopvariable as the program runs.",
          "Congratulations! You now understand how loops work! You have completed Module 3! Go to Module 4 to be able to create any program that you would like to!"
        ]
      },
      {
        name: 'Sandbox',
        avatar: 'svg-4',
        instructions: [
          "Have fun! Try whatever you like with your programs! Congratulations on learning how to program!"
        ]
      }
    ];

    var standardItems = [
      {
        row: 0,
        col: 0,
        text: 'begin',
        editable: false,
        removeable: false
      }
    ];

    var moduleButtons = [
      { text: 'if', moduleNum: 1},
      { text: 'while', moduleNum: 1},
      { text: 'variable', moduleNum: 1},
      { text: 'end if', moduleNum: 1},
      { text: 'end loop', moduleNum: 1}
    ];

    // Promise-based API
    return {
      loadAllModules : function() {
        // Simulate async nature of real remote calls
        return $q.when(modules);
      },
      standardItems: standardItems,
      moduleButtons: moduleButtons
    };
  }

})();
