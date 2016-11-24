/* Thanks to gamedevacademy.org for their awesome tutorial*/

var game = new Phaser.Game(500, 800, Phaser.AUTO, '');

game.state.add('play', {
    preload: function() {
        //Dog Sprites
        this.game.load.image('corgi', 'puppy_sprites/corgi.png');
        this.game.load.image('huskies', 'puppy_sprites/huskies.png');
        this.game.load.image('pug', 'puppy_sprites/pug.png');
        this.game.load.image('shibe', 'puppy_sprites/shibe.png');
        this.game.load.image('shibe-2', 'puppy_sprites/shibe-2.png');
        
        //Currency Sprite
        this.game.load.image('treat', 'puppy_sprites/treat.png');

      	//Upgrade Sprites
        this.game.load.image('hand', 'puppy_sprites/hand.png');
        this.game.load.image('passive', 'puppy_sprites/passive.png');

        //Health Bar Sprites
        this.game.load.image('health-empty', 'puppy_sprites/health-empty.png');
        this.game.load.image('health-full', 'puppy_sprites/health-full.png');
        
        //Music
        game.load.audio('gabe', 'puppy_sprites/gabe.mp3');

        var bmd = this.game.add.bitmapData(243, 115);
        bmd.ctx.fillStyle = '#FFFFFF';
        bmd.ctx.strokeStyle = '#35371c';
        bmd.ctx.lineWidth = 12;
        bmd.ctx.fillRect(0, 0, 243, 115);
        bmd.ctx.strokeRect(0, 0, 243, 115);
        this.game.cache.addBitmapData('upgradePanel', bmd);

        var buttonImage = this.game.add.bitmapData(476, 48);
        buttonImage.ctx.fillStyle = '#71c5cf';
        buttonImage.ctx.strokeStyle = '#35371c';
        buttonImage.ctx.lineWidth = 4;
        buttonImage.ctx.fillRect(0, 0, 225, 48);
        buttonImage.ctx.strokeRect(0, 0, 225, 48);
        this.game.cache.addBitmapData('button', buttonImage);

        this.player = {
            clickDmg: 1,
            treat: 50,
            dps: 0
        };

        this.level = 1;
        this.levelKills = 0;
        this.levelKillsRequired = 15;
        this.input.useHandCursor = true;

    },
    create: function() {
    
        var music = game.add.audio('gabe');

        music.play('',0,.01,true);

        var state = this;
       	game.stage.backgroundColor = '#71c5cf';


        state.upgradePanel = state.game.add.image(250, 10, state.game.cache.getBitmapData('upgradePanel'));
        var upgradeButtons = this.upgradePanel.addChild(state.game.add.group());
        upgradeButtons.position.setTo(8, 8);

        var upgradeButtonsData = [
            {icon: 'hand', name: 'Pet', level: 0, cost: 10, purchaseHandler: function(button, player) {
                player.clickDmg += 1;
            }},
            {icon: 'passive', name: 'Passive Pet', level: 0, cost: 50, purchaseHandler: function(button, player) {
                player.dps += 5;
            }}
        ];

        var button;
        upgradeButtonsData.forEach(function(buttonData, index) {
            button = state.game.add.button(0, (50 * index), state.game.cache.getBitmapData('button'));
            button.icon = button.addChild(state.game.add.image(6, 6, buttonData.icon));
            button.text = button.addChild(state.game.add.text(42, 6, buttonData.name + ': ' + buttonData.level, {font: '16px Arial Black'}));
            button.details = buttonData;
            button.costText = button.addChild(state.game.add.text(42, 24, 'Cost: ' + buttonData.cost, {font: '16px Arial Black'}));
            button.events.onInputDown.add(state.onUpgradeButtonClick, state);

            upgradeButtons.addChild(button);
        });

        var puppyData = [
            {name: 'Corgi',        		image: 'corgi',        		maxHealth: 50},
            {name: 'Husky Puppies',     image: 'huskies',      		maxHealth: 65},
            {name: 'Pug',    			image: 'pug',    			maxHealth: 90},
            {name: 'Shibe',             image: 'shibe',             maxHealth: 30},
            {name: 'Shibe',        		image: 'shibe-2',        	maxHealth: 25}
        
        ];
        state.puppies = state.game.add.group();

        var puppy;
        puppyData.forEach(function(data) {
            puppy = state.puppies.create(1500, state.game.world.centerY, data.image);
            puppy.health = puppy.maxHealth = data.maxHealth;
            puppy.anchor.setTo(0.5, 1);
            puppy.details = data;
            puppy.inputEnabled = true;
            
            //Events
            puppy.events.onInputDown.add(state.onClickPuppy, state);
            puppy.events.onKilled.add(state.onPetPupper, state);
            puppy.events.onRevived.add(state.onResetPosition, state);
        });

        state.currentPuppy = state.puppies.getRandom();
        state.currentPuppy.position.set(state.game.world.centerX, state.game.world.centerY + 125);

        state.puppyUI = state.game.add.group();
        state.puppyUI.position.setTo(state.currentPuppy.x - 220, state.currentPuppy.y + 125);
        state.puppyName = state.puppyUI.addChild(state.game.add.text(0, 0, state.currentPuppy.details.name, {
            font: '48px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        }));
		state.puppyHealthBar = state.puppyUI.addChild(state.game.add.image(0, 80, "health-empty"));
		state.puppyHealthStatus = state.puppyUI.addChild(state.game.add.image(0, 80, "health-full"));
		
		
        state.dialougeTextPool = this.add.group();
        var dialougeText;
        for (var d=0; d<50; d++) {
            dialougeText = this.add.text(0, 0, '1', {
                font: '64px Arial Black',
                fill: '#'+(Math.random()*0xFFFFFF<<0).toString(16),
                strokeThickness: 4
            });

            dialougeText.exists = false;
            dialougeText.tween = game.add.tween(dialougeText)
                .to({
                    alpha: 0,
                    y: 100,
                    x: this.game.rnd.integerInRange(100, 700)
                }, 1000, Phaser.Easing.Cubic.Out);

            dialougeText.tween.onComplete.add(function(text, tween) {
                text.kill();
            });
            state.dialougeTextPool.add(dialougeText);
        }

        state.currency = state.add.group();
        state.currency.createMultiple(50, 'treat', '', false);
        state.currency.setAll('inputEnabled', true);
        state.currency.setAll('treatValue', 1);
        state.currency.callAll('events.onInputDown.add', 'events.onInputDown', state.onClickTreat, state);

        state.playertreatText = this.add.text(5, 75, 'Treats: ' + state.player.treat, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });

        state.dpsTimer = state.game.time.events.loop(50, state.onDPS, state);

        state.levelUI = state.game.add.group();
        state.levelUI.position.setTo(5, 15);
        state.levelText = state.levelUI.addChild(state.game.add.text(0, 0, 'Level: ' + state.level, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        }));
        state.levelKillsText = state.levelUI.addChild(state.game.add.text(0, 30, 'Dogs Pet: ' + state.levelKills + '/' + state.levelKillsRequired, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        }));





    },
    onClickPuppy: function(puppy, pointer) {

        this.currentPuppy.damage(this.player.clickDmg);
        var dogSounds = ["Woof", "Bark", "Ruff", "Borf"]

        var dialougeText = this.dialougeTextPool.getFirstExists(false);
        if (dialougeText) {
            dialougeText.text = dogSounds[Math.floor((Math.random() * dogSounds.length))];
            dialougeText.reset(pointer.positionDown.x, pointer.positionDown.y);
            dialougeText.alpha = 1;
            dialougeText.tween.start();
        }

        this.puppyHealthText = this.puppyHealthStatus.scale.setTo(this.currentPuppy.health / this.currentPuppy.maxHealth, 1)

    },
    onDPS: function() {
        if (this.player.dps > 0) {
            if (this.currentPuppy && this.currentPuppy.alive) {
                var dmg = this.player.dps / 10;
                this.currentPuppy.damage(dmg);
            
        		this.puppyHealthText = this.puppyHealthStatus.scale.setTo(this.currentPuppy.health / this.currentPuppy.maxHealth, 1)

            }
        }
    },
    onPetPupper: function(puppy) {
        puppy.position.set(1000, this.game.world.centerY);
		var randomStageColor;
        var treat;

        treat = this.currency.getFirstExists(false);
        treat.reset(this.game.world.centerX + this.game.rnd.integerInRange(-100, 100), this.game.world.centerY + 100);
        treat.treatValue = Math.round(this.level * 2);
        this.game.time.events.add(Phaser.Timer.SECOND * 3, this.onClickTreat, this, treat);

        this.levelKills++;

        if (this.levelKills >= this.levelKillsRequired) {
            this.level++;
            this.levelKills = 0;
            randomStageColor = Phaser.Color.getRandomColor(50, 255, 255);
    		game.stage.backgroundColor = randomStageColor;
        }

        this.levelText.text = 'Level: ' + this.level;
        this.levelKillsText.text = 'Dogs Pet: ' + this.levelKills + '/' + this.levelKillsRequired;

        this.currentPuppy = this.puppies.getRandom();
        this.currentPuppy.maxHealth = Math.ceil(this.currentPuppy.details.maxHealth + ((this.level - 1) * 10.6));
        this.currentPuppy.revive(this.currentPuppy.maxHealth);
    },
    onResetPosition: function(puppy) {
        puppy.position.set(this.game.world.centerX, this.game.world.centerY + 125);
        this.puppyName.text = puppy.details.name;
    },
    onUpgradeButtonClick: function(button, pointer) {
        function getAdjustedCost() {
            return Math.ceil(button.details.cost + (button.details.level * 1.46));
        }

        if (this.player.treat - getAdjustedCost() >= 0) {
            this.player.treat -= getAdjustedCost();
            this.playertreatText.text = 'Treats: ' + this.player.treat;
            button.details.level++;
            button.text.text = button.details.name + ': ' + button.details.level;
            button.costText.text = 'Cost: ' + getAdjustedCost();
            button.details.purchaseHandler.call(this, button, this.player);
        }
    },
    onClickTreat: function(treat) {
        if (!treat.alive) {
            return;
        }
        this.player.treat += treat.treatValue;
        this.playertreatText.text = 'Treats: ' + this.player.treat;
        treat.kill();
    }
    
    
});

game.state.start('play');
