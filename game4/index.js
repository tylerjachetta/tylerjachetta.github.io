// thanks to https://gist.github.com/deekayen/4148741 for words
var game, gameWords, gameBackcolor, gameWidth = 0, gameHeight= 0;

// Load JSON datasource, start game after json loads
$.getJSON( 'game.json', function( gameJSON ) {
	gameBackcolor = gameJSON.backcolor;
	gameWords = gameJSON.words;
	
	// create a game that fits the screen
	gameWidth = $(window).width();
	gameHeight = $(window).height();
	game = new Phaser.Game( gameWidth, gameHeight, Phaser.CANVAS );
	
	// start the 'main' state for the game
	game.state.add( 'main', mainState, true );
});

var mainState = {
	preload: function() { 
		// This function will be executed at the beginning
		// load letter tile
		game.load.image( 'tile', 'square.png' );
	},

	create: function() { 
		// This function is called after the preload function

		// Change the background color of the game to blue
		game.stage.backgroundColor = gameBackcolor;
		
		// Create an empty group for current word's letters
		this.currentWordLetters = game.add.group();
		
		// init words
		var randomPosition = randomBetween( 0, gameWords.length - 1 );
		var currentWord = gameWords[ randomPosition ].toUpperCase();
		
		// random letter to switch
		randomPosition = randomBetween( 0, currentWord.length - 1 );
		
		// loop thru each letter in currentWord
		// creating a sprite for the letter at x,y pos
		var x = gameWidth - 100;
		var y = 20;
		for ( var c = currentWord.length - 1; c >= 0; c-- ) {
			var lb = game.add.sprite(x, y, 'tile');
			if ( c == randomPosition ) {
				var letter = String.fromCharCode( randomBetween( 65, 90 ) );
			} else {
				var letter = currentWord.charAt(c);
			}
			this.lt = game.add.text(5, 5, letter, 
				{ font: "30px Arial", 
				  fill: "#ffffff", 
				  align: "center", 
				  boundsAlignH: "center", 
				  boundsAlignV: "middle" 
				}
			);
			this.lt.setTextBounds( 0, 0, 40, 40 );
			lb.addChild(this.lt);
			lb.inputEnabled = true;
			if ( c == randomPosition ) {
				lb.events.onInputDown.add(function() {
					alert('Yes');
				}, this);
			} else {
				lb.events.onInputDown.add(function() {
					alert('Wrong');
				}, this);
			}
			this.currentWordLetters.add( lb );
			x = x - 45;
		}
	},

	update: function() {
		// This function is called 60 times per second
		
	},
	
	render: function() {
		// this.game.debug.pointer(this.game.input.activePointer);
	}
};

// Return random number between min and max
function randomBetween( min,max ) {
	return Math.floor( Math.random() * ( max - min + 1 ) + min );
}