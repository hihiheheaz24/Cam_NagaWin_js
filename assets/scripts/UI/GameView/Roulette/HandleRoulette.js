
var HandleRoulette = cc.Class({
    statics: {
        _handleParseDataGame(strData) {
            
            var gameView = require('GameManager').getInstance().gameView;
            if (gameView === null) {
                return;
            }
            var data = JSON.parse(strData);
            var evt = data.evt;
            switch (evt) {
                case 'ctable':
                    gameView.handleCTable(data.data);
                    break;
                case 'stable':
                    gameView.handleSTable(data.data);
                    break;
                case 'vtable':
                    gameView.handleVTable(data.data);
                    break;
                case 'rjtable':
                    gameView.handleRJTable(data.data);
                    break;
                case 'jtable':
                    gameView.handleJTable(data.data);
                    break;
                case 'ltable':
                    gameView.handleLTable(data);
                    break;
                case 'finish':
                    gameView.handleFinish(data);
                    break;
                case 'chattable':
                    gameView.handleChatTable(data);
                    break;
                case 'autoExit':
                    gameView.handleAutoExit(data);
                    break;
                case 'timeToStart':
                    gameView.handleStartGame(data.data);
                    break;
                case 'make_bet':
                    gameView.handleMakeBet(data.playerId,data.data , data.totalBet);
                    break;
                case 'error':
                    gameView.onClearbet();
                    require('UIManager').instance.showToast(data.data);
                    break;     
            }
        },
        _handleLeave() {
            var gameView = require('GameManager').getInstance().gameView;
            if (gameView.node !== null) {
                cc.NGWlog('chay vao hamonleave -------------------------');
                gameView.onLeave();
            }
            
        },

     
    },

});


module.export = HandleRoulette;