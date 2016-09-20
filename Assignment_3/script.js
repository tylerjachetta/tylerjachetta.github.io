// current level
var level = 1; 
// current turn
var turn = 0; 
// current score
var score = 0; 
// boolean: is a turn is active or not?
var active = false; 
// boolean: are click handlers active?
var handler = false; 
// array (list) of generated pads
var genSequence = []; 
// array (list) of users pads selected
var plaSequence = []; 

var historyCSS=0;
// initialises the game
function init() {
	// check to see if click event handlers are already active				
	if (handler === false) {
		// if not activate them
		initClickHandler();		
	}
	// starts new game
	newGame();				
}

function initClickHandler() {
	$('.pad').click( function(){
		if (active===true) {
			// get numeric value stored in data-pad attribute for each element
			var pad = parseInt( $(this).data('pad'), 10 );
			flash( $(this),1,300, pad );
			logPlayerSequence(pad);
		}
	});
	handler = true;
}

// resets game and generates a starts a new level
function newGame() {			
	level = 1;
	score = 0;
	newLevel();
	displayLevel();
	displayScore();
}

// start a new level in game
function newLevel() {
	genSequence.length = 0;
	plaSequence.length = 0;
	turn = 0;
	active = true;
	// randomize pad with correct count for this level
	randomizePad(level); 
	// show user the sequence
	displaySequence(); 
}

// function to make pads appear to flash
function flash(element, times, speed, pad) { 
	// make sure we are supposed to flash
	if (times > 0) {
		// animate the element to appear to flash
		// animate takes two parameters:
		// 1. css property list
		// 2. animate settings property list
		element.stop().animate( 
			{opacity: '1', width: '302',height: '302'}, 
			{
				duration: 50,
				complete: function(){
					element.stop().animate({opacity: '0.6', width: '300', height: '300'}, 200);
				}
			} 
		
		);
		// end of animate() statement										
	}
	// call the flash function again until done correct amount of times 
	if (times > 0) {									
		setTimeout(function () {
			flash(element, times, speed, pad);
		}, speed);
		// subtract one from times for each time code is called
		times -= 1;						
	}
	
	$.playSound("beep-03");

}

// generate random numbers (1-3) and push onto generated array 
// how many is determined by current level
function randomizePad(passes) {			
	for ( i=0; i < passes; i++ ) {
		genSequence.push( Math.floor( Math.random() * 4 ) + 1 );
		// show generated sequence in browser console
		console.log(genSequence);
	}
}

// log the player-clicked pad to array then call checkSequence()
function logPlayerSequence(pad) {		
	plaSequence.push(pad);
	checkSequence(pad);
}

// check to see if the pad the user pressed was next correct in sequence
function checkSequence(pad) {
	if ( pad !== genSequence[turn] ) {	
		// if not correct 
		incorrectSequence();
	} else {
		// if correct
		// update the score							
		keepScore();
		// incrememnt the turn					
		turn++;						
	}

	// if completed the whole sequence
	if ( turn === genSequence.length ) {
		// increment level
		level++;
		// display level							
		displayLevel();
		// disable the pads
		active=false;
		// reset the game after 1 second
		setTimeout(function(){
			newLevel();
		},1000);
	}
}

// display the generated sequence to the user
function displaySequence() {
	// loop through each value in the generated array (list)			
	$.each(genSequence, function(index, val) {
		// multiply timeout by how many items in the array so that they play in order
		setTimeout(function(){
			flash( $('.shape' + val), 1, 300, val );
		}, 500 * index);				
	});
}

// display the current level on screen
function displayLevel() {							
	$('.level h2').text('Level: ' + level);
}

// display current score on screen
function displayScore() {							
	$('.score h2').text('Score: ' + score);
}

// keep the score
function keepScore() {	
	// calculate the score
	score += 1;
	// display score on screen			
	displayScore();							
}

// if user makes a mistake
function incorrectSequence() {
	// save (cache) the pad number that should have been pressed					
	var corPad = genSequence[turn];
	active=false;
	displayLevel();
	displayScore();
	// flash the pad 4 times that should have been pressed
	/*
	setTimeout(function(){							
		flash( $('.shape' + corPad), 4, 300, corPad );
	}, 500);
	*/
	

	if(corPad == 1)
	{
		corPad = "green";
	}
	else if (corPad == 2)
	{
		corPad = "red";
	}
	else if (corPad == 3)
	{
		corPad = "yellow";
	}
	else if (corPad == 4)
	{
		corPad = "blue";
	}

	$('.history').append('<p>The player got to level ' + level + ' and failed to press the ' + corPad + ' button.')
	historyCSS += 40;
	$('.history').css('height', historyCSS + 'px')

	setTimeout(function(){
		$.each([1,2,4,3], function(index, val) {
			// multiply timeout by how many items in the array so that they play in order
			setTimeout(function(){
				flash( $('.shape' + val), 1, 300, val );
			}, 500 * index);
		});			
	}, 500);
	
	setTimeout(function(){
		for(i = 1; i <= 4; i++)
			flash( $('.shape' + i), 1, 300, i );
	}, 2400);
	

	// enable the start button again
	setTimeout(function(){
		$('.start').show();
	}, 2600);
}

(function($){

  $.extend({
    playSound: function(){
      return $(
        '<audio autoplay="autoplay" style="display:none;">'
          + '<source src="' + arguments[0] + '.mp3" />'
          + '<source src="' + arguments[0] + '.ogg" />'
          + '<embed src="' + arguments[0] + '.mp3" hidden="true" autostart="true" loop="false" class="playSound" />'
        + '</audio>'
      ).appendTo('body');
    }
  });

})(jQuery);

// document ready
$(document).ready(function(){
	// start a game when the start button is clicked
	$('.start').click( function(){
		$(this).hide();
		init();
	});
});

