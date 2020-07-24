var BauCuaJsonParse = cc.Class({
    properties: {
    },

    statics: {
        _handleParseDataGame(strData) {
            var gameView = require('GameManager').getInstance().gameView;
            if (gameView === null) {
                console.error('Game view null in BauCua');
                return;
            }
            var data = JSON.parse(strData);
            var evt = data.evt;
            cc.NGWlog('==========================>BauCua ' + evt);
            cc.NGWlog(strData);
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
                case 'jtable':
                    gameView.handleJTable(data.data);
                    break;
                case 'rjtable':
                    gameView.handleRJTable(data.data);
                    break;
                case 'cctable':
                    gameView.handleCCTable(data);
                    break;
                case 'ltable':
                    gameView.handleLTable(data);
                    break;
                case 'rtable':
                    gameView.handleRTable(data);
                    break;
                case 'chattable':
                    gameView.handleChatTable(data);
                    break;
                ////////// GAME PLAY /////////////
                case 'startgame':
                    gameView.handleStartGame(data);
                    break;
                case 'bet':
                    var plName = data.N;
                    var betGate = data.Num;
                    var ag = data.M;

                    if (plName == null) return;

                    let listBets = [];
                    let listMoney = [];

                    listBets = betGate.split(';').map(Number);
                    listMoney = ag.split(';').map(Number);
                    
                    gameView.handleBet(plName, listBets, listMoney);

                    break;
                case 'unbet':   //Khong dung
                    gameView.handleUnBet(data);
                    break;
                case 'finish':
                    gameView.handleFinish(data);
                    break;
                case 'history':
                    gameView.handleHistory(data.data);
                    break;
                case 'am':
                    gameView.handleAM(data);
                    break;
                case 'tip':   //Khong dung
                    gameView.handleTip(data);
                    break;
            }
        },

        _handleLeave() {
            var gameView = require('GameManager').getInstance().gameView;

            if (gameView !== null) {
                cc.NGWlog('Bau cua vao thoat chua')
                gameView.onLeave();
            }
        }
    }
});

module.export = BauCuaJsonParse;