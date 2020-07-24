


var listEVT = [];
var HandleBlackJack=cc.Class({
    statics: {
       _handleParseDataGame(strData){
        let item = {};
        var gameView = require('GameManager').getInstance().gameView;
        if(gameView === null) return;
        var data = JSON.parse(strData);
        var evt = data.evt;
cc.NGWlog('======================================== ' + strData);
switch(evt){
    case 'ctable' :
    gameView.handleCTable(data.data);
    break;
    case 'playerInsured' :
    gameView.handleBuyInSurePlayer(data.data);
    break;

    case 'insuranceTime' :
    gameView.BuyInsure(data.data);
    break;
    case 'insuranceResult' :
        gameView.HandleInsuranceResult(data.data);
    break;
        break;
    case 'stable' :
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
    case 'start':
        gameView.TimeAction(JSON.parse(data.data));    
    break;
    case 'cards':
        gameView.handleLc(data.data);
        
        break;
    case 'decisionTurn':
        gameView.handleTurnPlayer(data.data);
        break;
    // case 'prepareToStart':
    //     gameView.prepareToStart(data.data);
    //     break;
    case 'timeout':
        gameView.handleTimeOut(data);    
    break;
    case 'playerStood':
    case 'playerHit':
    case 'playerDoubled':
    case 'playerSplit':
        gameView.handleActionPlayer(evt,data.data);
        break;
    case 'ltable':
        gameView.handleLTable(JSON.parse(data.data));
        break;
    case 'irFinish':
        gameView.handleIrFinish(data.data);
        break;
    case 'finish':
        gameView.handleFinish(data.data);
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
    case 'betAccepted':
        gameView.handleBet(data.data);
            break;
        }  
       },

      
     },

    
});
module.exports = HandleBlackJack;
