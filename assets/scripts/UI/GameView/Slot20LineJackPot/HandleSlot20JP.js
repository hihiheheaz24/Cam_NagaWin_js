
var HandleSlotMachine = cc.Class({
    extends: cc.Component,

    properties: {
        isSlot: false,
    },

    statics: {
        _handleParseDataGame(strData) {
            //  var slotMachine = require('SlotMaChineView').getInstance();
            var gameView = require('GameManager').getInstance().gameView;
            if (gameView === null) return;

            var data = JSON.parse(strData);
            var evt = data.evt;

            switch (evt) {
                case 'ctable':
                    gameView.handleCTable(data.data);
                    break;
                case 'slotViews':
                    gameView.handleSpin(data);
                    // if(data != ""){
                    //     slotMachine.onAnimSpinMachine();
                    // }
                    break;
                // case 'updatejackpot':
                //     gameView.handleJackpot(data.M);
                //     break;
            }
        },

        _handleLeave() {
            var gameView = require('GameManager').getInstance().gameView.getComponent('Slot20LineJPView');
            if (gameView.node !== null) {
                gameView.onLeave();
            }
        }
    },



});
module.exports = HandleSlotMachine;
