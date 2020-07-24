
var XocDia17Handle = cc.Class({
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
                case 'cctable':
                    gameView.handleCCTable(data);
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
                    gameView.handleJtable(data.data);
                    break;
                case 'startgame':
                    gameView.handleStartGame(data);
                    break;
                case 'bet':
                    gameView.handleBet(data);
                    break;
                case 'lc':
                    gameView.handleLc(data);
                    break;
                case 'bm':
                    gameView.handleBm(data);
                    break;
                case 'pokpok':
                    gameView.handlePokpok(data.data);
                    break;
                case 'timeout':
                    gameView.handleTimeOut(data);
                    break;
                case 'bc':
                    gameView.handleBc(data);
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
                case 'tip':
                    gameView.HandlerTip(data);
                    break;
                case 'autoExit':
                    gameView.handleAutoExit(data);
                    break;
                case 'result_dealer':
                    gameView.changeDealer(data);
                    break;
                case 'leave_dealer':
                    gameView.cancelDealer(data);
                    break;
            }

           
        },
    },

});


module.export = XocDia17Handle;