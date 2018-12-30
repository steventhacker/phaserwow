'use strict';

class Ragnaros extends Boss {
    constructor(x, y, game, player) {
        super(game, x, y, 'Ragnaros');
        
        this.hp = 1000;
        this.portraitHp = game.add.sprite(this.portrait.x + 32, this.portrait.y, 'hp');
        
        this.player;
        this.tank;

        this.autoAttackSprite;
        this.autoAttackTimer = 0;
        this.autoAttackTween;

        this.threat = {
            tank: 0,
            player: 0,
            healer: 0
        };
        this.target;
    }

    setPlayer(player) {
        this.player = player;
    }

    setTank(tank) {
        this.tank = tank;
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

    addThreat(entity, threat) {
        this.threat[entity] += threat;
    }

    isDead() {
        return hp < 1;
    }

    autoAttack() {
        if (this.autoAttackTween != undefined && this.autoAttackTween.isRunning) {
            this.autoAttackTween.timeline[0].vEnd= {
                x: this.target.sprite.x + (this.target.sprite.width / 2 - 8),
                y: this.target.sprite.y + (this.target.sprite.height / 2 - 8)
            };
        } else {
            this.target = this.determineTarget();
            if (game.time.now >= this.autoAttackTimer) {
                this.autoAttackTimer = game.time.now + 1000;
                this.autoAttackSprite = game.add.sprite(this.sprite.x + 8, this.sprite.y + 8, 'frostbolt');
                var endX = this.target.sprite.x + (this.target.sprite.width / 2 - 8);
                var endY = this.target.sprite.y + (this.target.sprite.height / 2 - 8);
                this.autoAttackTween = game.add.tween(this.autoAttackSprite).to({x: endX, y: endY}, 2000, Phaser.Easing.Quadratic.InOut, true, 0);
                this.autoAttackTween.onComplete.add(() => {
                    this.autoAttackSprite.destroy();
                    this.target.takeDamage(20);
                });
            }
        }   
    }

    determineTarget() {
        if (this.tank.isDead()) {
            return this.player;
        }
        var target = this.tank;
        if (this.threat.player > this.threat.tank) {
            target = this.player;
        }
        return target;
    }
}