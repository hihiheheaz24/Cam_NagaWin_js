

var HandleBaccarat = cc.Class({
    extends: cc.Component,

    properties: {

    },
    start() {
    },
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
                case 'stable'://{"evt":"stable","data":"{\"N\":\"Poker[6960]\",\"M\":100,\"ArrP\":[{\"id\":813643,\"N\":\"fb.366499820572357\",\"Url\":\"fb.366499820572357\",\"AG\":13060,\"LQ\":0,\"LQ0\":0.0,\"VIP\":1,\"isStart\":true,\"IK\":0,\"sIP\":\"117.20.117.175\",\"G\":3,\"Av\":0,\"FId\":366499820572357,\"GId\":0,\"UserType\":0,\"TotalAG\":0,\"timeToStart\":0},{\"id\":818586,\"N\":\"te.1550743448_en1jlyrjjz8_adsid\",\"Url\":\"te.1550743448_en1jlyrjjz8_adsid\",\"AG\":2408,\"LQ\":0,\"LQ0\":0.0,\"VIP\":1,\"isStart\":true,\"IK\":0,\"sIP\":\"117.20.112.39\",\"G\":3,\"Av\":28,\"FId\":0,\"GId\":0,\"UserType\":1,\"TotalAG\":0,\"timeToStart\":0},{\"id\":815722,\"N\":\"lvd19951\",\"Url\":\"lvd19951\",\"AG\":9804250,\"LQ\":0,\"LQ0\":0.0,\"VIP\":1,\"isStart\":true,\"IK\":0,\"sIP\":\"171.224.113.203\",\"G\":3,\"Av\":12,\"FId\":0,\"GId\":0,\"UserType\":1,\"TotalAG\":0,\"timeToStart\":0}],\"Id\":6960,\"V\":0,\"S\":4,\"issd\":true}","type":0}
                    gameView.handleSTable(data.data);
                    break;
                case 'vtable':
                    gameView.handleVTable(data.data);
                    break;
                case 'jtable':
                    gameView.handleJTable(data.data); //{"evt":"jtable","data":"{\"id\":1544655,\"N\":\"te.1551777784_404517445840a6c3\",\"Url\":\"\",\"AG\":1869,\"LQ\":0,\"VIP\":2,\"isStart\":true,\"IK\":0,\"G\":3,\"Av\":4,\"FId\":0,\"GId\":0,\"UserType\":12,\"TotalAG\":0,\"timeToStart\":0,\"level\":4,\"displayName\":\"NGW.1544655\"}","T":0,"C":0,"rate":0,"score":0,"time":5}
                    break;
                case 'ltable':
                    gameView.handleLTable(data);
                    break;
                case 'rtable':
                    gameView.handleRTable(data);
                    break;
                case 'finish'://{"evt":"finish","data":"{\"tie\":false,\"player\":false,\"banker\":true,\"playerPair\":true,\"bankerPair\":false,\"playerCards\":[{\"value\":\"9\",\"type\":\"SPADE\",\"code\":8},{\"value\":\"A\",\"type\":\"CLUB\",\"code\":26},{\"value\":\"A\",\"type\":\"DIAMOND\",\"code\":39}],\"bankerCards\":[{\"value\":\"5\",\"type\":\"HEART\",\"code\":43},{\"value\":\"9\",\"type\":\"SPADE\",\"code\":8},null],\"startAfter\":10000,\"results\":[{\"pid\":100001081,\"agAdd\":95,\"AG\":162894}],\"bets\":[{\"bankerSide\":{\"chip\":100,\"side\":\"Banker\"},\"playerSide\":{\"chip\":0,\"side\":\"Player\"},\"tieSide\":{\"chip\":0,\"side\":\"Tie\"},\"playerPairSide\":{\"chip\":0,\"side\":\"PlayerPair\"},\"bankerPairSide\":{\"chip\":0,\"side\":\"BankerPair\"},\"pid\":100001081}]}","timeAction":0,"diem":0,"pid":0,"agAdd":0}
                   gameView.handleFinish(data.data);
                    break;
                case 'betError':
                    gameView.handleBetError(data.data);
                    break;
                case 'chattable':
                    gameView.handleChatTable(data);
                    break;
                case 'start'://{"evt":"start","data":"{\"finishAfter\":20000}","timeAction":0,"diem":0,"pid":0,"agAdd":0}
                    gameView.handleBetTime(data.data);
                    break;
                case 'lc':
                    gameView.chiaCard(data);
                    break;
                case 'betAccepted'://{"evt":"betAccepted","data":"{\"chipBet\":100,\"side\":\"Banker\",\"pid\":100006973,\"slot\":0}","timeAction":0,"diem":0,"pid":0,"agAdd":0}
                    gameView.handleDatCuoc(data.data);
                    break;
                case 'autoExit':
                    gameView.handleAutoExit(data);
                    break;
            }
        },
    }
    // update (dt) {},
});
module.exports = HandleBaccarat
