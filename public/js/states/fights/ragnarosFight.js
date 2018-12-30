var RagnarosFight = function(game){};

RagnarosFight.prototype = {
    preload() {

        this.map;
        this.layer;
        this.layer2;
        this.lava;
        this.marker;

        this.deathScreen;
        this.deathScreenText;
        this.deathScreenLink;
        
        this.boss;
        
        this.player;
        this.movementSpeed;

        this.tank;
        this.healer;
        
        this.casting;
        this.castBar;
        this.castProgress;
        this.castTween;
        
        this.frostbolt;
        
        // icons
        this.icon_frostbolt;
        
        // var sprite;
        this.cursors;
        this.currentDataString;

        this.lavaGroup;

        this.bossDebugHP;
    
    },

    create() {

        game.physics.startSystem(Phaser.Physics.ARCADE);
    
        this.map = game.add.tilemap('ragnaros');
    
        this.map.addTilesetImage('rag_tiles');
    
        this.map.setCollisionBetween(1, 12);
    
        this.layer  = this.map.createLayer('Tile Layer 1');
        this.layer2 = this.map.createLayer('Tile Layer 2');

        this.lavaGroup = game.add.group();
        this.map.createFromObjects('Object Layer 1', 2, 'lava', 0, true, false, this.lavaGroup);  
    
        this.movementSpeed = Config.movementSpeed;
    
        //this.layer.resizeWorld();
    
        // units
        this.boss = new Ragnaros(450, 400, game);
        this.player = new Mage(100, 800, game);
        
        this.tank = new Tank(420, 450, 'tank', 400, this.boss);
        this.healer = new Healer(200, 450, 'healer', 100, this.boss, this.tank, this.player);

        this.boss.setPlayer(this.player);
        this.boss.setTank(this.tank);

        game.physics.arcade.overlap(this.player.sprite, this.lavaGroup, null, null, this);
    
        // icons
        this.icon_frostbolt = game.add.sprite(
            300,
            886,
            'icon_frostbolt');

        //this.bossDebugHP = game.add.text(150, 150, this.tank.hp);
    
    },

    update() {

        if (this.player.isDead()) {
            this.showDeath();
        } else {
            this.boss.autoAttack();
            this.tank.autoAttack();
            this.healer.startRotation();

            var inLava = false;
            // If you are walking in lava, slow down and take damage
            this.lavaGroup.forEach(object => {
                var playerBounds = this.player.sprite.getBounds();
                var objectBounds = object.getBounds();

                if (Phaser.Rectangle.intersects(playerBounds, objectBounds)) {
                    inLava = true;
                } 
            });

            if (inLava) {
                this.player.takeDamage(1);
                this.movementSpeed = Config.movementSpeed / 2;
            } else {
                this.movementSpeed = Config.movementSpeed;
            }

            if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                if (this.castTween && this.castTween.isRunning) {
                    this.clearCast();
                }
                this.player.sprite.x -= this.movementSpeed;
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                if (this.castTween && this.castTween.isRunning) {
                    this.clearCast();
                }
                this.player.sprite.x += this.movementSpeed;
            }
        
            if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
                if (this.castTween && this.castTween.isRunning) {
                    this.clearCast();
                }
                this.player.sprite.y -= this.movementSpeed;
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
                if (this.castTween && this.castTween.isRunning) {
                    this.clearCast();
                }
                this.player.sprite.y += this.movementSpeed;
            }
        
            if (game.input.keyboard.isDown(Phaser.Keyboard.ONE)) {
                if (this.castTween && this.castTween.isRunning) {
                    this.clearCast();
                }
                this.shoot();
            }
        }
    },

    shoot() {
        if (this.casting) {
            console.log('Trying while casting');
            return;
        }
        
        this.casting = true;
    
        this.castBar = game.add.sprite(350, 900, 'castBar');
        this.castProgress = game.add.sprite(this.castBar.x + 10, this.castBar.y + 7, 'castProgress');
    
        this.castTween = game.add.tween(this.castProgress.scale).to({x: 11.2}, 000, Phaser.Easing.Quadratic.InOut, true, 0);
        this.castTween.onComplete.add(() => {
            this.clearCast();
            this.frostbolt = game.add.sprite(this.player.sprite.x + 8, this.player.sprite.y + 8, 'frostbolt');
            game.physics.arcade.enable(this.frostbolt);
        
            // activate the cooldown animation
            var endX = this.boss.sprite.x + (this.boss.sprite.width / 2 - 8);
            var endY = this.boss.sprite.y + (this.boss.sprite.height / 2 - 8);
            var tween = game.add.tween(this.frostbolt).to({x: endX, y: endY}, 400, Phaser.Easing.Quadratic.InOut, true, 0);
            tween.onComplete.add(() => {
                this.frostbolt.destroy();
                this.boss.takeDamage(10);
                this.boss.addThreat('player', 10);
                this.casting = false;
            });
        });       
        
    },

    showDeath() {
        this.deathScreen = game.add.sprite(game.world.centerX - 200, game.world.centerY - 150, 'deathScreen');
        this.deathScreenText = game.add.text(game.world.centerX, game.world.centerY - 100, 'You have died.', {
            font: "48px System",
            fill: "#ff0000",
            align: "center"
        });
        this.deathScreenText.anchor.setTo(0.5);

        this.deathScreenLink = game.add.button(game.world.centerX, game.world.centerY + 100, 'mana', function() {
            game.state.start('Main');
        }, this);
    },

    clearCast() {
        this.castTween.stop();
        this.casting = false;
        this.castBar.destroy();
        this.castProgress.destroy();
    },

    render() {
        //this.bossDebugHP.setText('Boss HP: ' + this.tank.hp);   
    }
}
