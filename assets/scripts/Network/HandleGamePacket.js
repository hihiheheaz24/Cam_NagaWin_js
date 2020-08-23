const GameManager = require('GameManager').getInstance();
var timeOut;
var HandleGamePacket = cc.Class({
    name: 'HandleGamePacket',
    ctor: function () { },

    statics: {
        listEvt: [],
        handleGameTransportPacket: function (data) {
            var dataJson = JSON.parse(data);

            let objData = {};
            if (dataJson.hasOwnProperty('evt')) {
                objData.evt = dataJson.evt;
            }
            objData.data = JSON.stringify(dataJson);
            require('SMLSocketIO').getInstance().emitSIOWithValue(objData, "GameTransportPacket", false);
            var evt = dataJson.evt;
            if (evt == "ltable") {
                cc.log("ltable evt");
                let data = dataJson
                if(GameManager.curGameId == GAME_ID.BLACKJACK ){
                    data = JSON.parse(dataJson.data);
                }
                let tableId = GameManager.tableId;
                if (data.Name == GameManager.user.uname || data.name == GameManager.user.uname || data.name == tableId || data.Name == tableId) {
                    let dataLeave = {};
                    dataLeave.tableid = tableId;
                    dataLeave.curGameID = GameManager.curGameId;
                    dataLeave.stake = GameManager.table_mark;
                    dataLeave.reason = data.errorCode || 0;
                    GameManager.gameView.dataLeave = Object.assign(dataLeave) ;
                    cc.log("dataleave==")
                };
            }
            if (evt == 'autoExit') {
                this.handleGame(data);
                return;
            }
            if (evt == 'chattable') {
                let name = dataJson.Name;
                if (require('GameManager').getInstance().gameView.getPlayer(name) != null) { // thang nay co mat trong ban roi.
                    this.handleGame(data);
                    return;
                }
            }
            let item = {};
            item.stop = null;
            if (GAME_INFO[GameManager.curGameViewId].delayEvt.includes(evt)) item.stop = true;
            item.data = data;
            this.listEvt.push(item);
            if (this.listEvt.length < 2) this.NextEvt(false);
        },
        NextEvt(isStop = true) {
            clearTimeout(timeOut);
            if (isStop) this.listEvt.shift();
            if (this.listEvt.length > 0) {
                let item = this.listEvt[0]
                if (item.stop == null) {
                    timeOut = setTimeout(() => {
                        this.listEvt.shift()
                        this.NextEvt(false);
                    }, 1000)
                }
                this.handleGame(item.data);
                if (item.stop == null) {
                    this.listEvt.shift()
                    this.NextEvt(false);
                }
            }
        },
        handleGame(data) {
            var dataJson = JSON.parse(data);
            var evt = dataJson.evt;
            let list = [GAME_ID.ROULETTE, GAME_ID.BLACKJACK, GAME_ID.BACCARAT];
            if (evt === 'finish' && !list.includes(GameManager.curGameId)) {
                if (GameManager.curGameId === GAME_ID.BAUCUA || GameManager.curGameId === GAME_ID.SESKU) {
                    var winData = JSON.parse(dataJson.data);
                    for (let i = 0; i < winData.length; i++) {
                        const plData = winData[i];
                        let name = plData.N;
                        if (name == GameManager.user.uname) {
                            let goldThisPlayerWin = plData.M;
                            if (goldThisPlayerWin != 0)
                                GameManager.gameView.indexFinish++;
                        }
                    }
                } else {
                    GameManager.gameView.indexFinish++;
                }
                if (GameManager.gameView.indexFinish >= 2 && GameManager.user.vip <= 0) { // offline Loc
                    cc.NGWlog("send upvip=======================");
                    require('NetworkManager').getInstance().sendUpVip();
                }
            }
            require(GAME_INFO[GameManager.curGameViewId].handleScritps)._handleParseDataGame(data);
        },

        handleLeave() {
            GameManager.gameView.onLeave();
        }
    },
});


module.exports = HandleGamePacket;