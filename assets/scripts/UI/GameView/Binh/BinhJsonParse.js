var BinhJsonParse = cc.Class({
    properties: {
    },

    statics: {
        _handleParseDataGame(strData) {
            if (require('GameManager').getInstance().gameView === null) {
                return;
            }
            
            var gameView = require('GameManager').getInstance().gameView;

            if (gameView === null) {
                return;
            }

            var data = JSON.parse(strData);
            var evt = data.evt;

            cc.NGWlog('==========================>evt BINH GAME DATA ' + evt);

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
                case 'countdowntostart':
                    gameView.countDownStart(data.data);
                    break;
                case 'lc':
                    gameView.startGame(data);
                    break;
                case 'declare':
                    gameView.declareResponse(data.Name);
                    break;
                case 'fsc':
                    gameView.soBaiResponse(data.Name);
                    break;
                case 'ufsc':
                    gameView.xepLaiResponse(data.Name);
                    break;
                case 'finish':
                    gameView.finishGame(data.data);
                    break;
                case 'am':
                    break;
                case 'chattable':
                    gameView.handleChatTable(data);
                    break;
                case 'autoExit': 
                    gameView.handleAutoExit(data);
                    break;
            }
        }
    }
});

module.export = BinhJsonParse;

