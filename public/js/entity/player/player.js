'use strict';

class Player {
    constructor(x, y, name, hp) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.hp = hp;

        this.fullHp = hp;
    }

    takeDamage(damage) {}

    isDead() {
        return this.hp < 1;
    }
}