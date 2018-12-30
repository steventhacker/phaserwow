'use strict';

class Mage extends Player {
    constructor(x, y, game) {
        super(x, y, 'Mage', 100);

        this.sprite = game.add.sprite(x, y, 'player');
        this.portrait = game.add.sprite(30, 30, 'playerPortrait')
        this.portraitHp = game.add.sprite(this.portrait.x + 32, this.portrait.y, 'hp');
        this.portraitMana = game.add.sprite(this.portrait.x + 32, this.portrait.y + 16, 'mana');
        this.damageTimer = 0;
        
        this.fullHpWith = this.portraitHp.width;

        this.castBar;
        this.castProgress;
        this.castTween;
        this.casting;

        this.boss;
    }

    setBoss(boss) {
        this.boss = boss;
    }

    takeDamage(damage) {
        if ((this.portraitHp.x + this.portraitHp.width) - 10 < this.portraitHp.x) {
            this.portraitHp.width = 0;
        } else {
            this.portraitHp.width = this.portraitHp.width - damage;
        }
        this.hp -= damage;
    }

    heal(amount) {
        var hpDelta = amount / this.hp;
        var portraitDelta = this.portraitHp.width * hpDelta;
        if ((this.portraitHp.x + this.portraitHp.width) + portraitDelta > this.portraitHp.x + this.fullHpWith) {
            this.portraitHp.width = this.fullHpWith;
        } else {
            this.portraitHp.width += portraitDelta;
        }
        if (this.hp + amount > this.fullHp) {
            this.hp = this.fullHp;
        } else {
            this.hp += amount;
        }
    }

    shoot() {
        if (this.casting) {
            console.log('Trying while casting');
            return;
        }
        
        this.casting = true;
    
        this.castBar = game.add.sprite(350, 900, 'castBar');
        this.castProgress = game.add.sprite(this.castBar.x + 10, this.castBar.y + 7, 'castProgress');
    
        this.castTween = game.add.tween(this.castProgress.scale).to({x: 11.2}, 0, Phaser.Easing.Quadratic.InOut, true, 0);
        this.castTween.onComplete.add(() => {
            this.clearCast();
            this.frostbolt = game.add.sprite(this.sprite.x + 8, this.sprite.y + 8, 'frostbolt');
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
        
    }
    
    clearCast() {
        this.castTween.stop();
        this.casting = false;
        this.castBar.destroy();
        this.castProgress.destroy();
    }
}