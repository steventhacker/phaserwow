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
}