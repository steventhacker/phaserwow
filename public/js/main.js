
var game = new Phaser.Game(1024, 950, Phaser.AUTO, 'wowtari');
var Main = function () {};
var gameOptions = {};

Main.prototype = {  
    preload: function () {
        game.load.script('mixins', '/js/lib/mixins.js');
        game.load.script('menu',  '/js/states/menu.js');

        game.load.tilemap('ragnaros', '/assets/json/rag_lair.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('rag_tiles', '/assets/tiles.png');
    
        // Sprites
        game.load.image('boss', '/assets/icons/boss.png');
        game.load.image('player', '/assets/icons/mage.png');
        game.load.image('frostbolt', '/assets/icons/frostbolt.png');

        // Portraits
        game.load.image('playerPortrait', '/assets/portrait/mage.png');
        game.load.image('playerHP', '/assets/portrait/hp.png');
        game.load.image('playerMana', '/assets/portrait/mana.png');
    
        // Cast
        game.load.image('castBar', '/assets/icons/casting/castBar.png');
        game.load.image('castProgress', '/assets/icons/casting/castProgress.png');
    
        // Abilities
        game.load.image('icon_frostbolt', '/assets/icons/casting/icon_frostbolt.png');
    },

    create: function () {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVeritcally = true;
        game.scale.refresh();
        game.state.add('menu', GameMenu);
        game.state.start('menu');
    }  
};

game.state.add('Main', Main);
game.state.add('Ragnaros', Ragnaros);
game.state.start('Main');