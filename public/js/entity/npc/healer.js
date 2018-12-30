'use strict';

class Healer {
    constructor(x, y, name, hp, boss, tank, player) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.hp = hp;
        this.boss = boss
        this.tank = tank;
        this.player = player;

        this.sprite = game.add.sprite(x, y, 'healer');
        this.portrait = game.add.sprite(30, 150, 'healerPortrait')
        this.portraitHp = game.add.sprite(this.portrait.x + 16, this.portrait.y, 'npcHp');
        this.portraitMana = game.add.sprite(this.portrait.x + 16, this.portrait.y + 8, 'npcMana');
        
        this.healTimer = 0;
        this.healTween;
        this.healSprite;

        this.holyShockTimer = 0;
    }

    startRotation() {
        this.castHeal();
        this.castHolyShock();
    }

    castHeal() {
        if (game.time.now >= this.healTimer) {
            this.healTimer = game.time.now + 2000;     
            
            var target = this.determineHealTarget();

            var endX = target.sprite.x + (target.sprite.width / 2 - 8);
            var endY = target.sprite.y + (target.sprite.height / 2 - 8);
            this.healSprite = game.add.sprite(this.sprite.x + 8, this.sprite.y + 8, 'frostbolt');
            this.healTween = game.add.tween(this.healSprite).to({x: endX, y: endY}, 1000, Phaser.Easing.Quadratic.InOut, true, 0);

            this.healTween.onComplete.add(() => {
                this.healSprite.destroy();
                target.heal(20);
                this.boss.addThreat('healer', 5);
            });
        }
    }
    
    castHolyShock() {
        var playerDelta = this.player.hp / this.player.fullHp;
        var tankDelta = this.tank.hp / this.tank.fullHp;

        if (playerDelta < .5 || tankDelta < .75) {
            var target = this.determineHealTarget();

            if (game.time.now >= this.holyShockTimer) {
                console.log('Holy shocking ' + target.name);
                this.holyShockTimer = game.time.now + 8000;

                target.heal(50);
            }
        }
    }

    determineHealTarget() {
        var playerDelta = this.player.hp / this.player.fullHp;
        var tankDelta = this.tank.hp / this.tank.fullHp;

        return playerDelta < tankDelta ? this.player : this.tank;
    }

    isDead() {
        return this.hp < 1;
    }
}