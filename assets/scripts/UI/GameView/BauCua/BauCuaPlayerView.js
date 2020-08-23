var PlayerView = require('PlayerView')

var BauCuaPlayerView = cc.Class({
    extends: PlayerView,

    properties: {

    },

    updatePlayerView() {
        // cc.NGWlog('Log vao update player view');
        this.node.scale = 0.85;
        this.node.zIndex = GAME_ZORDER.Z_PLAYERVIEW;
    }
});

module.export = BauCuaPlayerView;