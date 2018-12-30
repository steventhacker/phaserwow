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

        this.player.setBoss(this.boss);
        
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

            this.lavaCheck();

            if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                if (this.player.castTween && this.player.castTween.isRunning) {
                    this.player.clearCast();
                }
                this.player.sprite.x -= this.movementSpeed;
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                if (this.player.castTween && this.player.castTween.isRunning) {
                    this.player.clearCast();
                }
                this.player.sprite.x += this.movementSpeed;
            }
        
            if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
                if (this.player.castTween && this.player.castTween.isRunning) {
                    this.player.clearCast();
                }
                this.player.sprite.y -= this.movementSpeed;
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
                if (this.player.castTween && this.player.castTween.isRunning) {
                    this.player.clearCast();
                }
                this.player.sprite.y += this.movementSpeed;
            }
        
            if (game.input.keyboard.isDown(Phaser.Keyboard.ONE)) {
                this.player.shoot();
            }
        }
    },

    lavaCheck() {
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
            this.player.takeDamage(this.player.hp / 200);
            this.movementSpeed = Config.movementSpeed / 2;
        } else {
            this.movementSpeed = Config.movementSpeed;
        }
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

    render() {
        //this.bossDebugHP.setText('Boss HP: ' + this.tank.hp);   
    }
}
