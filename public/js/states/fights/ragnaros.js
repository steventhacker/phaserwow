
var Ragnaros = function(game){};

Ragnaros.prototype = {
    preload() {

        this.map;
        this.layer;
        this.layer2;
        this.lava;
        this.marker;
        
        this.boss;
        this.bossHealth;
        this.bossPortrait;
        
        this.bossDebugHP;
        
        this.player;
        this.playerHealth;
        this.movementSpeed;
        
        this.playerPortrait;
        this.playerHP;
        
        this.casting;
        this.castBar;
        this.castProgress;
        this.castTween;
        
        this.timer;
        this.endTimer;
        this.frostboltTimer;
        
        this.frostbolt;
        
        // icons
        this.icon_frostbolt;
        
        // var sprite;
        this.cursors;
        this.currentDataString;
    
    },

    create() {

        game.physics.startSystem(Phaser.Physics.ARCADE);
    
        this.map = game.add.tilemap('ragnaros');
    
        this.map.addTilesetImage('rag_tiles');
    
        this.map.setCollisionBetween(1, 12);
    
        this.layer  = this.map.createLayer('Tile Layer 1');
        this.layer2 = this.map.createLayer('Tile Layer 2');
    
        this.movementSpeed = 3;
    
        this.timer = game.time.create();
        this.frostboltTimer = this.timer.add(Phaser.Timer.SECOND * 5, this.endTimer, this);
    
        this.layer.resizeWorld();
    
        // units
        this.boss = game.add.sprite(450, 400, 'boss');
        this.bossHealth = 100;
        this.player = game.add.sprite(100, 800, 'player');
        this.playerHealth = 30;

        // portraits
        this.playerPortrait = game.add.sprite(30, 30, 'playerPortrait');
        this.playerHP = game.add.sprite(62, 30, 'playerHP');
        this.playerHP = game.add.sprite(62, 46, 'playerMana');
    
        this.bossDebugHP = game.add.text(game.world.centerX, game.world.centerY, "- Boss health:" + this.bossHealth, {
            font: "28px Arial",
            fill: "#ffffff",
            align: "center"
        });
    
        // icons
        this.icon_frostbolt = game.add.sprite(
            300,
            886,
            'icon_frostbolt');
    
    },

    update() {

        if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            if (this.castTween && this.castTween.isRunning) {
                this.clearCast();
            }
            this.player.x -= this.movementSpeed;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            if (this.castTween && this.castTween.isRunning) {
                this.clearCast();
            }
            this.player.x += this.movementSpeed;
        }
    
        if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            if (this.castTween && this.castTween.isRunning) {
                this.clearCast();
            }
            this.player.y -= this.movementSpeed;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            if (this.castTween && this.castTween.isRunning) {
                this.clearCast();
            }
            this.player.y += this.movementSpeed;
        }
    
        if (game.input.keyboard.isDown(Phaser.Keyboard.ONE)) {
            console.log('Inside');
            if (this.castTween && this.castTween.isRunning) {
                this.clearCast();
            }
            this.shoot();
        }
    
    },

    shoot() {
        console.log('shooting');
        if (this.casting) {
            console.log('Trying while casting');
            return;
        }
    
        if (this.timer.running) {
            console.log('On cooldown');
            return;
        }
    
        this.timer.stop();
        
        this.casting = true;
    
        this.castBar = game.add.sprite(350, 900, 'castBar');
        this.castProgress = game.add.sprite(this.castBar.x + 10, this.castBar.y + 7, 'castProgress');
    
        this.castTween = game.add.tween(this.castProgress.scale).to({x: 11.2}, 4000, Phaser.Easing.Quadratic.InOut, true, 0);
        this.castTween.onComplete.add(() => {
            this.clearCast();
            this.frostbolt = game.add.sprite(this.player.x + 8, this.player.y + 8, 'frostbolt');
            game.physics.arcade.enable(this.frostbolt);
    
            this.timer.start();
        
            // activate the cooldown animation
            var endX = this.boss.x + (this.boss.width / 2 - 8);
            var endY = this.boss.y + (this.boss.height / 2 - 8);
            var tween = game.add.tween(this.frostbolt).to({x: endX, y: endY}, 2000, Phaser.Easing.Quadratic.InOut, true, 0);
            tween.onComplete.add(() => {
                this.frostbolt.destroy();
                this.bossHealth -= 10;
                this.casting = false;
            });
        });       
        
    },

    clearCast() {
        this.castTween.stop();
        this.casting = false;
        this.castBar.destroy();
        this.castProgress.destroy();
    },

    render() {
        this.bossDebugHP.setText('Boss HP: ' + this.bossHealth);        
    }
}
