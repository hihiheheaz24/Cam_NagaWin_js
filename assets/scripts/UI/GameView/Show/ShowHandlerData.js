



var ShowHandlerData = cc.Class({
    statics: {
        _handleParseDataGame(strData) {
            var gameView = require('GameManager').getInstance().gameView;
            if (gameView === null) return;
            var data = JSON.parse(strData);
            var evt = data.evt;
            cc.log("!> handle",evt,"\n",data);
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
                    gameView.handleJTable(data.data);
                    break;
                case 'timeToStart':
                    gameView.handleTimeToStart(data);
                    break;
                case 'show_card':
                    gameView.handleShow_card(data);
                    break;
                case 'lc':
                    gameView.handleLc(data);
                    break;
                case 'bm':
                    gameView.handleBm(data);
                    break;
                case 'cab':
                    gameView.handleCab(data);
                    break;
                case 'buyin':
                    gameView.handleBuyIn(data);
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
                    //  require("GameManager").getInstance().onShowToast(JSON.parse(data));
                    break;
            }
        },
    },

});
module.exports = ShowHandlerData;
