'use strict';

class Boss {
    constructor(game, x, y, name) {
        this.x = x;
        this.y = y;
        this.name = name;

        this.sprite = game.add.sprite(x, y, 'boss');
        this.portrait = game.add.sprite(196, 30, 'bossPortrait');
    }

    takeDamage(damage) {}

    isDead() {}

    autoAttack() {};
}