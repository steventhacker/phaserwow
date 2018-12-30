'use strict';

class Tank {
    constructor(x, y, name, hp, boss) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.hp = hp;
        this.boss = boss

        this.sprite = game.add.sprite(x, y, 'tank');
        this.portrait = game.add.sprite(30, 90, 'tankPortrait')
        this.portraitHp = game.add.sprite(this.portrait.x + 16, this.portrait.y, 'npcHp');
        this.portraitMana = game.add.sprite(this.portrait.x + 16, this.portrait.y + 8, 'npcMana');

        this.fullHp = hp;
        this.fullHpWith = this.portraitHp.width;
        
        this.autoAttackTimer = 0;
        this.autoAttackTween;
        this.autoAttackHit = false;
    }

    takeDamage(damage) {
        var hpDelta = damage / this.hp;
        var portraitDelta = this.portraitHp.width * hpDelta;
        if ((this.portraitHp.x + this.portraitHp.width) - portraitDelta < this.portraitHp.x) {
            this.portraitHp.width = 0;
        } else {
            this.portraitHp.width = this.portraitHp.width - portraitDelta;
        }
        this.hp -= damage;
    }

    heal(amount) {
        var hpDelta = amount / this.fullHp;
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

    isDead() {
        return this.hp < 1;
    }

    autoAttack() {
        // If currently swinging, check if strikes target
        if (this.autoAttackTween != undefined && this.autoAttackTween.isRunning && !this.autoAttackHit) {
            var swordBounds = this.autoAttackSprite.getBounds();
            var bossbounds = this.boss.sprite.getBounds();
            if (Phaser.Rectangle.intersects(swordBounds, bossbounds)) {
                this.autoAttackHit = true;
            } 
        } 
        if (game.time.now >= this.autoAttackTimer) {
            this.autoAttackTimer = game.time.now + 5000;
            this.autoAttackSprite = game.add.sprite(this.sprite.x + 26, this.sprite.y + 8, 'tankSword');

            this.autoAttackTween = game.add.tween(this.autoAttackSprite).to (
                {angle: this.autoAttackSprite.angle - 150}, 500, Phaser.Easing.Quadratic.InOut, true);

            this.autoAttackTween.onComplete.add(() => {
                this.autoAttackSprite.destroy();
                if (this.autoAttackHit) {
                    this.boss.takeDamage(10);
                    this.boss.addThreat('tank', 10);
                    this.autoAttackHit = false;
                }
            });
        }
    }
}