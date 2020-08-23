var GameManager = require('GameManager')
var GameView = require('GameView2')
var BorkGameView = cc.Class({
    extends: GameView,

    properties: {
        anim_start: {
            default: null,
            type: sp.Skeleton
        },
        lbStartGame: {
            default: null,
            type: cc.Node
        },
        lbTimeer: {
            default: null,
            type: cc.Label
        },
        ParentCard: {
            default: null,
            type: cc.Node
        },
        lbTextTime: {
            default: null,
            type: cc.Label
        },
        ParentChip: {
            default: null,
            type: cc.Node
        },
        chipEffect: {
            default: null,
            type: cc.Node
        },
        NodeChat: cc.Node,
        DealerInGame: {
            default: null,
            type: require('DealerInGameView')
        },
        chip_Tip: {
            default: null,
            type: cc.Node
        },
        list_Boxbet: {
            default: [],
            type: [require('BoxbetView')]
        },
        ResultEffect: {
            default: null,
            type: cc.Node
        },
        bg_Score_Result: {
            default: null,
            type: cc.Prefab
        },
        list_ani_win_lose: {
            default: [],
            type: [cc.Prefab]
        },
        item_effect: {
            default: null,
            type: cc.Prefab
        },
        Node_BetPf: cc.Prefab,
        listToggle: {
            default: [],
            type: [cc.Toggle]
        },
        Node_Toggle: {
            default: null,
            type: cc.Node
        },
        Node_Btn_Ac_Card: {
            default: null,
            type: cc.Node
        },
        btn_become_b: {
            default: null,
            type: cc.Button
        },
        btn_cancel_b: {
            default: null,
            type: cc.Button
        },
        textAutoExit: {
            default: null,
            type: cc.Node
        },
        listBtnInvite: {
            default: [],
            type: [cc.Button]
        },
        indexTest: 0,
        is_my_turn: false,
        _scoreP: 0,
        _rateP: 0,
        listCardSystem: [],
        _isLastGameWin: false,
        isTurnOnToggle: true,
        spriteChipEffect:cc.SpriteFrame,

        black_cover: {
            default: null,
            type: cc.Prefab,
        },
        _isRjTableHaveLc :false,
    },

    onLoad() {
        this.listPosView[7] = null;
        this._super();
        this.List_Bg_Result = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
        this.listEffWinLose = [{}, {}, {}, {}, {}, {}, {}, {}, {}];
        this.name_cur_turn = '';
        this.nodeGroupMenu = null;
        this.List_Out_Player = [];
        this.resultBorkScorePool = new cc.NodePool('BorkResultScore');
        this.efWinLosePool = new cc.NodePool('EffectWinLose');
        this.chipEffectPool = new cc.NodePool();
        this.AgLastCuoc = 0;
        this.Node_Bet = null
        this.DealerInGame.node.zIndex = GAME_ZORDER.Z_MENU_VIEW - 1;
        this.playerCards = [[],[],[],[],[],[],[]];
        this.cardAction = [[],[],[],[],[],[],[]];
    },
    onClickTest(){
        GameManager.getInstance().onReconnect();
    },
    handleChatTable(data) {
        this._super(data);
    },
    handleCCTable(data) {
        this.stateGame = STATE_GAME.WAITING;

        var name = data.Name;
        var player = this.getPlayer(name);
        if (player === null)
            return;
        for (var i = 0; i < this.players.length; i++) {
            var pl = this.players[i];
            if (pl == player)
                pl.setHost(true);
            else
                pl.setHost(false);
        }
    },
    removePlayer(nameP, isInGame = false) {
        this._super(nameP, isInGame = false);
    },

    handleLTable(data) {
        this._super(data);
    },
    handleJTable(strData) {
        this._super(strData)
    },
    handleVTable(strData) {
        this._super(strData);
        let data = JSON.parse(strData)
        var _listPlayer = data.ArrP;
        this.ViewIng(_listPlayer);

        if (data.Dealer == "SystemDealer") {
            for (let i = 0; i < data.ArrDealer.length; i++) {
                this.ChiaCardDealer();
            }

            if (data.scoreDealer != 0) {
                this.OpenCardViewing(1, "SystemDealer", data.scoreDealer, data.rateDealer, data.ArrDealer);
            }
        }
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].pname === data.Dealer) {
                this.players[i]._playerView.isDealer = true;
            }
        }

        if (this.Node_Bet == null) {
            this.Node_Bet  = cc.instantiate(this.Node_BetPf).getComponent('BorkNodeBet');
            this.node.addChild(this.Node_Bet.node , GAME_ZORDER.Z_MENU_VIEW);
            this.Node_Bet.onHide();
            this.Node_Bet.gameView = this;
            this.Node_Bet.chip_table_t = parseInt(this.agTable);
        }
    },

    addChatJoin(namePLayer) {
        this._super(namePLayer);
    },
    handleCTable(strData) {
        this._super(strData);
        if (this.Node_Bet == null) {
            this.Node_Bet  = cc.instantiate(this.Node_BetPf).getComponent('BorkNodeBet');
            this.node.addChild(this.Node_Bet.node , GAME_ZORDER.Z_MENU_VIEW);
            this.Node_Bet.onHide();
            this.Node_Bet.gameView = this;
            this.Node_Bet.chip_table_t = parseInt(this.agTable);
        }
    },

    handleRJTable(strData) {
        this._super(strData);
        this._isRjTableHaveLc = true;
        let data = JSON.parse(strData)
        var _listPlayer = data.ArrP;
        if(data.ArrDealer.length > 0){
            this.ViewIng(_listPlayer);
        }else{
            cc.NGWlog("!> roi vao case arr null");
        }
        this.isTurnOnToggle = false;
        cc.NGWlog('ten thang dealer la=== ' + data.Dealer);
        if (data.Dealer == "SystemDealer") {
            for (let i = 0; i < data.ArrDealer.length; i++) {
                this.ChiaCardDealer();
            }
            if (data.scoreDealer != 0) {
                this.OpenCardViewing(1, "SystemDealer", data.scoreDealer, data.rateDealer, data.ArrDealer);
            }
        }
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].pname === data.Dealer) {
                this.players[i]._playerView.isDealer = true;
            }
        }

        this.updatePositionPlayerView();
        if (this.Node_Bet == null) {
            this.Node_Bet  = cc.instantiate(this.Node_BetPf).getComponent('BorkNodeBet');
            this.node.addChild(this.Node_Bet.node , GAME_ZORDER.Z_MENU_VIEW);
            this.Node_Bet.onHide();
            this.Node_Bet.gameView = this;
            this.Node_Bet.chip_table_t = parseInt(this.agTable);
        }
    },

    setupNewGame(nameDealer, _time) { // startdealer
        // GameTransportPacket: {"evt":"startdealer","Dealer":"SystemDealer","T":7000,"S":0,"rate":0,"score":0}
        this.state = 0;
        cc.NGWlog('chay vao ham resetView');
        this.resetGameDisPlay();
        this.anim_start.node.active = true;
        this.anim_start.setAnimation(0, "animation", false);
        setTimeout(() => {
            if (this.node == null || typeof this.node == 'undefined') return;
            this.anim_start.node.active = false;

            this.nameDealer = nameDealer;
            var time_turn = _time / 1000;
            for (var i = 0; i < this.players.length; i++) {
                if (this.players[i].pname !== this.nameDealer) {
                    this.players[i]._playerView.setTurn(true, time_turn , true);
                }
            };
            this.isTurnOnToggle = true;
            this.is_my_turn = false;
            
            this.NodeChat.active = false;
            this.Node_Bet.node.active = true;
            if (this.stateGame == STATE_GAME.VIEWING) {
                this.Node_Bet.onHide();
                this.thisPlayer._playerView.setTurn(false, 0);
            }

            for (var i = 0; i < this.players.length; i++) {

                if (this.players[i].pname == this.nameDealer) {
                    this.players[i]._playerView.isDealer = true;
                } else {
                    this.players[i]._playerView.isDealer = false;
                }
            }

            require('HandleGamePacket').NextEvt();
        }, 2000)
    },

    resetGameDisPlay() {
        this.clearAllCard();
        this.resetToggleList();
        for (var i = 0; i < this.list_Boxbet.length; i++) {
            this.list_Boxbet[i].setValueBoogyi(0);
            this.list_Boxbet[i].onHide();
        }
        for (var i = 0; i < this.List_Bg_Result.length; i++) {
            let item = this.List_Bg_Result[i];
            if (item.node != null && typeof item.node != 'undefined') {
                this.resultBorkScorePool.put(item.node);
            }

        };
        this.List_Bg_Result.length = 0;
        this.List_Bg_Result = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
        let leght = this.listEffWinLose.length;
        for (var i = 0; i < leght; i++) {
            let item = this.listEffWinLose[i];
            if (item.node != null && typeof item.node != 'undefined')
                this.efWinLosePool.put(item.node);
        };

        this.listEffWinLose.length = 0;
        this.listEffWinLose = [{}, {}, {}, {}, {}, {}, {}, {}, {}];

        for (var i = 0; i < this.listCardSystem.length; i++) {
            this.cardPool.put(this.listCardSystem[i].node);
        }
        this.listCardSystem = [];
    },

    reCallAllCards (){
        let delayLeft = 0;
        for(let i = 3; i >= 0; i--){
            if(this.playerCards[i].length > 0){
                for(let j = 0; j < this.playerCards[i].length; j++){
                    let card = this.playerCards[i][j];
                    this.foldCard(card,delayLeft);
                    delayLeft = delayLeft + 0.2;
                }
            }
        }
        let delayRight = 0;
        for(let i = 6; i >= 4; i--){
            if(this.playerCards[i].length > 0){
                for(let j = 0; j < this.playerCards[i].length; j++){
                    let card = this.playerCards[i][j];
                    this.foldCard(card,delayRight);
                    delayRight = delayRight + 0.2;
                }
            }
        }
        let delayDl = 0;
        for(let i = 0 ; i < this.listCardSystem.length; i++){
            let card = this.listCardSystem[i];
            this.foldCard(card,delayDl);
            delayDl = delayDl + 0.2;
        }

        this.setTimeout(()=>{
            this.clearAllCard();
        },2000)
    },

    foldCard (card,delay){
        card.runAction(
            cc.sequence(
                cc.delayTime(delay),
                cc.spawn(
                    cc.sequence(
                        cc.scaleTo(0.2,0.01,0.4),
                        cc.scaleTo(0.2,0.4).easing(cc.easeCubicActionOut()),
                    ),
    
                    cc.sequence(
                        cc.skewTo(0.2,0,-15),
                        cc.skewTo(0.2,0,0).easing(cc.easeCubicActionOut()),
                    ),
                    
                    cc.callFunc(()=>{
                        card.getComponent('Card').moveCardNoBug(0.4,cc.v2(0,220))
                    })
                )
            )
        )
        this.setTimeout(()=>{
            card.getComponent('Card').setTextureWithCode(0);
            card.skewY = 15;
        },200)
    },

    cleanGame() {
        this._super();
        this.resultBorkScorePool.clear();
        this.efWinLosePool.clear();
        this.chipEffectPool.clear();
    },

    resetStateGame() {
        if (this.nodeGroupMenu != null)
            this.nodeGroupMenu.updateState(this.stateGame);
    },

    handleSTable(strData) {
        this.resetGameDisPlay();
        this._super(strData);
        if (this.Node_Bet == null) {
            this.Node_Bet  = cc.instantiate(this.Node_BetPf).getComponent('BorkNodeBet');
            this.node.addChild(this.Node_Bet.node , GAME_ZORDER.Z_MENU_VIEW);
            this.Node_Bet.onHide();
            this.Node_Bet.gameView = this;
            this.Node_Bet.chip_table_t = parseInt(this.agTable);
        }
    },

    updatePositionPlayerView() {
        this._super();
    },

    getDynamicIndex(index) {
        if (index == 0) return 0;
        let _index = index;
        if (this.players.length < 5) {
            _index += 2;
        } else {
            if (this.players.length == 5)
                _index += 1;
            else
                return _index;
            // if (_index == 5){
            //     _index -= 3;
            // }else
            // if(_index == 6){
            //     index += 1
            // }else
            // if(_index == 7){
            //     index -= 5
            // }else{
            //     _index += 2;
            // }
        }
        return _index;
    },

    handleBc(data) {
        if (data.N == this.thisPlayer.pname) {
            this.is_my_turn = true;
            this.thisPlayer._playerView.setTurn(false, 0);
            this.Node_Toggle.active = false;
            this.Node_Btn_Ac_Card.active = false;
        }
        if (data.C === 0) {
            return;
        }

        var player = this.getPlayer(data.N);
        if (player !== null) {
            player._playerView.setTurn(false, 0);
            var IndexP = this.getIndexPlayerWithName(data.N);
            if (data.N == this.thisPlayer.pname) {
                this._scoreP = this.HamTinhDiem(parseInt(data.score));
                this._rateP = data.rate;
                this.ChiaCardPlayer(IndexP, data.C);
               // this.showBlackCover();
                this.setTimeout(()=>{
                    this.SetEfftResult(0, this._scoreP, this._rateP, 3);
                    this.hideBlackCover();
                },700)
            } else {
                this.ChiaCardPlayer(IndexP, 0);
            }
            require('SoundManager1').instance.dynamicallyPlayMusic('sounds/cardPlipBlackJack');
        } else if (data.N === "SystemDealer") {
            this.ChiaCardDealer();
            require('SoundManager1').instance.dynamicallyPlayMusic('sounds/cardPlipBlackJack');
        }
    },

    draw3rdCard (cardCode,index){
        // cardTemp = this.getCard();
        // let delay = 0;
        // this.node.addChild(cardTemp.node, GAME_ZORDER.Z_CARD);
        // cardTemp.setTextureWithCode(0);
        // cardTemp.node.position = this.DealerInGame.node.position;
        // cardTemp.node.setScale(0.4,0.4);
        // this.playerCards[index].push(cardTemp.node);
        // if(index == 0){
        //     cardTemp.node.runAction(
        //         cc.spawn(
        //             cc.moveTo(0.4,cc.v2(0,0)).easing(cc.easeCubicActionInOut()),
        //             cc.sequence(
        //                 cc.scaleTo(0.2,0.01,0.5),
        //                 cc.callFunc(()=>{
        //                     cardTemp.setTextureWithCode(cardCode);
        //                 }),
        //                 cc.scaleTo(0.2,0.55).easing(cc.easeCubicActionInOut()),
        //             ),

        //             cc.sequence(
        //                 cc.skewTo(0.2,0,-15),
        //                 cc.callFunc(()=>{
        //                     cardTemp.node.skewY = 15;
        //                 }),
        //                 cc.skewTo(0.2,0).easing(cc.easeCubicActionInOut()),
        //             )
        //         )
        //     )
        //     delay = 400;
        // }
        // let dataPR = this.handleCardBehavior(index);
        // this.setTimeout(()=>{
        //     for(let i = 0; i < this.playerCards[index].length; i++){
        //         let card = this.playerCards[index][i];
        //         moveCardToPosition(index,i,card,dataPR.arrPos[i],dataPR.arrRotate[i])
        //     }
        // },delay)
    },

    handleTimeOut(data) {
        var playerNext = this.getPlayer(this.name_cur_turn);
        if (playerNext) playerNext._playerView.setTurn(false, 0);
        var player = this.getPlayer(data.NN);
        if (player === null) return;
        player._playerView.setTurn(true, data.T / 1000 , true);
        this.name_cur_turn = data.NN;

        if (this.stateGame !== 1) {
            return;
        }
        if (data.NN == this.thisPlayer.pname) {
            this.isTurnOnToggle = false;
            if (!this.readListToggle()) {
                this.Node_Toggle.active = false;
                this.Node_Btn_Ac_Card.active = true;
            }
        } else {
            if (this.isTurnOnToggle) {
                this.Node_Toggle.active = true;
            }
            this.Node_Btn_Ac_Card.active = false;
        }
    },

    ViewIng(lisP) {
        for (let i = 0; i < lisP.length; i++) {
            let indexP = this.getIndexPlayerWithName(lisP[i].N)
            let player = this.players[indexP];

            if (player == this.thisPlayer) {
                this._scoreP = this.HamTinhDiem(parseInt(lisP[i].score));
                this._rateP = lisP[i].rate;
                for (let j = 0; j < lisP[i].Arr.length; j++) {
                    this.ChiaCardPlayer(indexP, lisP[i].Arr[j]);
                }
                this.SetEfftResult(0, this._scoreP, this._rateP, this.playerCards[0].length);
            } else {
                for (let j = 0; j < lisP[i].Arr.length; j++) {
                    this.ChiaCardPlayer(indexP, 0);
                }
            }

            this.playerBet(lisP[i].N, lisP[i].AGC);
            if (lisP[i].Arr[0] != 0) {
                cc.NGWlog('chay vao ham mo bai this player');
                this.OpenCardViewing(1, lisP[i].N, lisP[i].score, lisP[i].rate, lisP[i].Arr)
            }
        }
    },

    OpenCardViewing(timeDelay, nameP, score, rate, arrC) {
        this.node.runAction(cc.sequence(cc.delayTime(timeDelay), cc.callFunc(() => {
            this.openCardPlayer(nameP, arrC, score, rate);
        })))

    },

    OnClickAcPCard() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickDrawCard_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('NetworkManager').getInstance().sendReiveCard(1);
    },

    OnClickUnAcPCard() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickNotDrawCard_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('NetworkManager').getInstance().sendReiveCard(0);
    },
    
    handleLc(data) {
        this.sendTrackingGame();
        this.setTimeout(() => {
            require('HandleGamePacket').NextEvt();
        }, 2000);
        this.STATE_GAME = STATE_GAME.PLAYING;
        // if(this._isRjTableHaveLc == true){
        //     this._isRjTableHaveLc = false;
        //     return;
        // } 

        let arrCodes = data.arr;
        this._scoreP = this.HamTinhDiem(parseInt(data.score));
        if (this._scoreP >= 8) {
            this.isTurnOnToggle = false
            this.Node_Toggle.active = false;
        }
        this._rateP = data.rate;
        
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_chiabai);
        for(let i = 0; i < this.players.length; i ++){
            let indexP = this.getIndexPlayerWithName(this.players[i].pname);
            let indexD = this.players[indexP]._indexDynamic;
            
            if(indexD == 0){
                this.ChiaCardPlayer(indexP,arrCodes[0]);
                this.setTimeout(()=>{
                    this.ChiaCardPlayer(indexP,arrCodes[1]);
                },600)
            }else{
                this.ChiaCardPlayer(indexP,0);
                this.setTimeout(()=>{
                    this.ChiaCardPlayer(indexP,0);
                },600)
            }
        }
       // this.showBlackCover();
        this.setTimeout(()=>{
            // this.hideBlackCover();
            this.SetEfftResult(0, this._scoreP, this._rateP, 2);
        },1300)
        this.ChiaCardDealer();
        this.ChiaCardDealer();

        
    },

    showBlackCover (){
        return;
        this.hideBlackCover();
        let black = cc.instantiate(this.black_cover);
        this.node.addChild(black,999,'cover');
    },

    hideBlackCover (){
        return;
        let oldCV = this.node.getChildByName('cover');
        if(oldCV != null){
            oldCV.runAction(
                cc.sequence(
                    cc.fadeOut(0.4),
                    cc.callFunc(()=>{
                        for(let i = 0; i < this.playerCards[0].length; i ++){
                            let card = this.playerCards[0][i];
                            card.zIndex = GAME_ZORDER.Z_CARD;
                        }
                        oldCV.destroy();
                    })
                )
            )
        }
    },

    playerBet(name, chip) {
        //{"N":"thet_phain_oo","AG":30000,"evt":"bm"} (NetworkManager.js, line 34)
        
        var pl = this.getPlayer(name);
        if (pl === null || chip <= 0) {
            return;
        }
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.chipsAudio);
        var index_bet = pl._indexDynamic;
        this.list_Boxbet[index_bet].onShow(index_bet);
        this.list_Boxbet[index_bet].setValueBoogyi(chip);

        if (this.stateGame === 1) {
            this.EffectMoneyChange(-chip, pl.ag, pl._playerView.lbAg);
            pl.ag = pl.ag - chip;
        }
        pl._playerView.setTurn(false, 0);
        
    },

    handleBm(data) {
        let nameP = data.N;
        let amount = data.AG;

        let index = this.getIndexPlayerWithName(nameP);
        let player = this.players[index];
        this.playerBet(nameP, amount);
        // fly Chip Effect
        if (nameP === this.thisPlayer.pname) {
            this.Node_Bet._last_chip_bet = amount;
            this.NodeChat.active = true;
            this.Node_Bet.onHide();
        }
    },

    handleFinish(doc) {
        //this.stateGame = STATE_GAME.PLAYING;
        this._isRjTableHaveLc = false;
        var playerNext = this.getPlayer(this.name_cur_turn);
        if (playerNext) {
            playerNext._playerView.setTurn(false, 0);

        }
        this.Node_Toggle.active = false;
        this.Node_Btn_Ac_Card.active = false;
        var _this = this;
        var data = JSON.parse(doc);
        for (var i = 0; i < data.length; i++) {
            let pl = this.getPlayer(data[i].N);
            let chip = parseInt(data[i].M);
            let totalChip = parseInt(data[i].AG);
            let score = this.HamTinhDiem(data[i].S);
            var rate = data[i].rate;
            if (data[i].N === this.thisPlayer.pname) {
                GameManager.getInstance().user.ag = totalChip;
                if (Global.LobbyView !== null)
                    Global.LobbyView.updateChip();
                if (Global.MainView !== null)
                    Global.MainView.updateChipAndSafe();
                var str = "";
                if (chip < 0) {
                    require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.loseAudio);
                    str = "Monica: " + require('GameManager').getInstance().getTextConfig('shan2_you_lost').replace("%lld", chip + "");
                } else if (chip > 0) {
                    require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.winAudio);
                    str = "Monica: " + require('GameManager').getInstance().getTextConfig('shan2_you_win').replace("%lld", chip + "");
                }
                this.itemChatNgoaiGame.setDataChatCard(str, data[i].ArrCard);
                this.quickChat.addChatWithCard(str, data[i].ArrCard);

                if (chip >= 0) {
                    this._isLastGameWin = true;
                } else {
                    this._isLastGameWin = false;
                }

               require('SMLSocketIO').getInstance().emitUpdateInfo();
            }

            if (pl !== null) {
                let dyn_id = pl._indexDynamic;
                this.openCardPlayer(data[i].N, data[i].ArrCard, score, rate);
                this.instantiateEffWinLose(dyn_id, chip);
                let TimeOut = 1000;
                if (chip > 0) {
                    TimeOut = 5000;
                     if(i==0)  require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_nemxu);
                    let delayT = 0;
                    this.setTimeout(()=>{
                        this.list_Boxbet[dyn_id].node.active =false;
                        
                        for(let id = 0; id < 4; id++)
                        {
                            let nodeChip = new cc.Node();
                            nodeChip.addComponent(cc.Sprite).spriteFrame = this.spriteChipEffect;
                            this.node.addChild(nodeChip, GAME_ZORDER.Z_EMO);
    
                            nodeChip.position = cc.v2(0,230);
                            
                            let pos = cc.v2(0, 0);
                            let num1 =  Math.floor(Math.random() * 80) - 40;
                            let num2 =  Math.floor(Math.random() * 80) - 40;
        
                            pos = pos.add(cc.v2(num1, num2));
        
                            let move = cc.moveTo(0.25, pos).easing(cc.easeCubicActionInOut());
                            let delay = cc.delayTime(delayT);
                            let moveTarget = cc.moveTo(0.25 , this.listPosView[dyn_id]).easing(cc.easeCubicActionInOut());
    
                            nodeChip.runAction(cc.sequence(delay, move ,cc.delayTime(2),moveTarget , cc.callFunc(()=>{
                                nodeChip.destroy();
                            })  ));
                            delayT += 0.075;
                        }
                    },3000)
                 
                } else if (chip < 0){
                    let delayT = 0;
                    this.list_Boxbet[dyn_id].node.active =false;
                    if(i==0)  require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_nemxu);
                    for(let id = 0; id < 4; id++)
                    {
                        let nodeChip = new cc.Node();
                        nodeChip.addComponent(cc.Sprite).spriteFrame = this.spriteChipEffect;
                        this.node.addChild(nodeChip, GAME_ZORDER.Z_EMO);
                        nodeChip.position = this.listPosView[dyn_id];
                        let pos = this.list_Boxbet[dyn_id].node.position;
                        let num1 =  Math.floor(Math.random() * 50) - 40;
                        let num2 =  Math.floor(Math.random() * 50) - 40;
                        pos = pos.add(cc.v2(num1, num2));
                        let move = cc.moveTo(0.1, pos).easing(cc.easeCubicActionInOut());
                        let delay = cc.delayTime(delayT);
                        let moveTarget = cc.moveTo(0.25 , cc.v2(0,230) ).easing(cc.easeCubicActionInOut());
                        nodeChip.runAction(cc.sequence(delay, move ,cc.delayTime(2),moveTarget , cc.callFunc(()=>{
                            nodeChip.destroy();
                        })  ));
                        delayT += 0.075;
                    }
                }
                
                setTimeout(() => {
                    if (this.node == null || typeof this.node == 'undefined') return;
                    let moneyChange = totalChip - pl.ag
                    pl._playerView.setupEffectChangeMoney(pl.ag, pl.ag+= moneyChange);
                    this.listEffWinLose[dyn_id].textFly(true);
                }, TimeOut)
            } else if (data[i].N.localeCompare("SystemDealer") === 0) {
                this.openCardPlayer("SystemDealer", data[i].ArrCard, score, rate);
                this.itemChatNgoaiGame.setDataChatCard("Monica: " + require('GameManager').getInstance().getTextConfig('txt_cardofsys'), data[i].ArrCard);
                this.quickChat.addChatWithCard("Monica: " + require('GameManager').getInstance().getTextConfig('txt_cardofsys'), data[i].ArrCard);
            }
        }
        setTimeout(() => {
            if (this.node == null || typeof this.node == 'undefined') return;
            this.stateGame = 0;
            this.resetGameDisPlay();
            this.resetStateGame();
            this.playerCards = [[],[],[],[],[],[],[]];
            require('HandleGamePacket').NextEvt();
            if(cc.sys.localStorage.getItem("isBack") == 'true') require('NetworkManager').getInstance().sendExitGame();
        }, 6000);


    },

    instantiateEffWinLose(indexDyn, chip) {
        let item = this.listEffWinLose[indexDyn];
        if (item.node == null || typeof item.node == 'undefined') {
            if (this.efWinLosePool.size() < 1) {
                item = cc.instantiate(this.item_effect).getComponent('EffectWinLose');
            } else {
                item = this.efWinLosePool.get().getComponent('EffectWinLose');
            };
            this.node.addChild(item.node, GAME_ZORDER.Z_EMO);
            if (indexDyn == 0) {
                if (this.thisPlayer.vectorCard.leght == 3) {
                    item.node.position = cc.v2(48, -208);
                } else {
                    item.node.position = cc.v2(30, -208);
                }
            } else {
                item.node.position = this.listPosView[indexDyn];
            }
            this.listEffWinLose[indexDyn] = item;
        }
        item.effectWinLose(chip);
    },
    getIndexPlayerWithName(name) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].pname == name) {
                return i;
            }
        }
    },
    handlePokpok(doc) {
        var dataPok = JSON.parse(doc);
        //   this.node.runAction(cc.sequence(cc.delayTime(0.4 * (this.players.length) + 0.5), cc.callFunc(() => {
        for (var i = 0; i < dataPok.length; i++) {
            this.openCardPlayer(dataPok[i].N, dataPok[i].arr, dataPok[i].score, dataPok[i].rate)
        }
        //  })))
    },

    // openCardPlayer(nameP, arrC, score, rate) {

    //     if (nameP !== 'SystemDealer') {
    //         var player = this.getPlayer(nameP);
    //         var indexPDyn = player._indexDynamic;
    //         if (indexPDyn !== 0) {
    //             let vectorCard = player.vectorCard
    //             let length = vectorCard.length;
    //             let offset = 30;
    //             let Pos = -15;
    //             let offsetRotation = 20;
    //             let rotate = -10;

    //             if (length == 3) {
    //                 Pos = -25;
    //                 rotate = -10;
    //                 offsetRotation = 10;
    //             }
    //             let posFirtCard = cc.v2(this.listPosView[indexPDyn].x + Pos, this.listPosView[indexPDyn].y + 30);
    //             for (let i = 0; i < length; i++) {
    //                 vectorCard[i].setTextureWithCode(arrC[i]);
    //                 vectorCard[i].node.stopAllActions();
    //                 vectorCard[i].node.rotation = rotate;
    //                 vectorCard[i].node.setScale(0.45, 0.45);
    //                 vectorCard[i].node.position = posFirtCard;
    //                 rotate += offsetRotation;
    //                 posFirtCard = cc.v2(posFirtCard.x + offset, posFirtCard.y);
    //             }
    //             this.SetEfftResult(indexPDyn, this.HamTinhDiem(score), rate, arrC.length);
    //         } else {
    //             this.is_my_turn = true;
    //         }

    //     } else {
    //         let offset = 30;
    //         let Pos = -15;
    //         let offsetRotation = 20;
    //         let rotate = -10;
    //         let vectorCard = this.listCardSystem
    //         let length = vectorCard.length;
    //         if (length == 3) {
    //             Pos = -25;
    //             rotate = -10;
    //             offsetRotation = 10;
    //         }
    //         let posFirtCard = cc.v2(3 + Pos, 233);
    //         for (var i = 0; i < arrC.length, i < length; i++) {
    //             vectorCard[i].setTextureWithCode(arrC[i]);
    //             vectorCard[i].node.stopAllActions();
    //             vectorCard[i].node.rotation = rotate;
    //             vectorCard[i].node.setScale(0.45, 0.45);
    //             vectorCard[i].node.position = posFirtCard;
    //             rotate += offsetRotation;
    //             posFirtCard = cc.v2(posFirtCard.x + offset, posFirtCard.y);
    //         }
    //         this.SetEfftResult(9, this.HamTinhDiem(score), rate, arrC.length);
    //     }
    // },

    openCardPlayer(nameP, arrC, score, rate) {
        if (nameP !== 'SystemDealer') {
            var player = this.getPlayer(nameP);
            var indexPDyn = player._indexDynamic;
            if (indexPDyn !== 0) {
                let vectorCard = player.vectorCard
                let length = vectorCard.length;
                let offset = 30;
                let Pos = -15;
                let offsetRotation = 20;
                let rotate = -10;

                if (length == 3) {
                    Pos = -25;
                    rotate = -10;
                    offsetRotation = 10;
                }
                let posFirtCard = cc.v2(this.listPosView[indexPDyn].x + Pos, this.listPosView[indexPDyn].y + 30);
                for (let i = 0; i < length; i++) {
                    vectorCard[i].node.runAction(cc.rotateTo(0.2,rotate));
                    vectorCard[i].node.runAction(
                        cc.spawn(
                            cc.sequence(
                                cc.scaleTo(0.2,0.01,0.45),
                                cc.scaleTo(0.2,0.45),
                            ),
                            cc.sequence(
                                cc.skewTo(0.2,0,-15),
                                cc.skewTo(0.2,0,0),
                            )
                        )
                    );
                    this.setTimeout(()=>{
                        vectorCard[i].setTextureWithCode(arrC[i]);
                        vectorCard[i].node.skewY = 15;
                    },200)
                    vectorCard[i].moveCardNoBug(0.4,posFirtCard);
                    // vectorCard[i].node.runAction(cc.moveTo(0.4,posFirtCard));
                    rotate += offsetRotation;
                    posFirtCard = cc.v2(posFirtCard.x + offset, posFirtCard.y);
                }
                this.SetEfftResult(indexPDyn, this.HamTinhDiem(score), rate, arrC.length);
            } else {
                this.is_my_turn = true;
            }

        } else {
            let offset = 30;
            let Pos = -15;
            let offsetRotation = 20;
            let rotate = -10;
            let vectorCard = this.listCardSystem
            let length = vectorCard.length;
            if (length == 3) {
                Pos = -25;
                rotate = -10;
                offsetRotation = 10;
            }
            let posFirtCard = cc.v2(3 + Pos, 233);
            for (var i = 0; i < arrC.length, i < length; i++) {
                let card = vectorCard[i];
                let code = arrC[i];
                vectorCard[i].node.runAction(cc.rotateTo(0.2,rotate));
                vectorCard[i].node.runAction(
                    cc.spawn(
                        cc.sequence(
                            cc.scaleTo(0.2,0.01,0.45),
                            cc.scaleTo(0.2,0.45),
                        ),
                        cc.sequence(
                            cc.skewTo(0.2,0,-15),
                            cc.skewTo(0.2,0,0),
                        )
                    )
                );
                this.setTimeout(()=>{
                    card.setTextureWithCode(code);
                    card.node.skewY = 15;
                },200)
                vectorCard[i].moveCardNoBug(0.4,posFirtCard);
                // vectorCard[i].node.runAction(cc.moveTo(0.4,posFirtCard));
                rotate += offsetRotation;
                posFirtCard = cc.v2(posFirtCard.x + offset, posFirtCard.y);
            }
            this.SetEfftResult(9, this.HamTinhDiem(score), rate, arrC.length);
        }
    },

    HamTinhDiem(diem) {
        if (diem >= 1000 && diem < 2000) diem = 11;
        else if (diem >= 2000 && diem < 3000) diem = 12;
        else if (diem >= 3000 && diem < 4000) diem = 13;
        else if (diem >= 4000 && diem < 5000) diem = 14;
        else if (diem >= 5000) {
            diem = diem % 5000;
            diem = diem % 10;
        }
        return diem;
    },

    EffectMoneyChange(amountChange, _valueSet, label) {
        cc.NGWlog('chay vao ham thay doi tien');
        label.node.runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.callFunc(() => {
            _valueSet += amountChange;
            label.string = GameManager.getInstance().formatMoney(_valueSet);
        }), cc.scaleTo(0.2, 1)))

    },

    // ChiaCardPlayer(indexP, delayTime, cardCode = 0, round = 1) {
    //     let Vplayer;
    //     let ScaleCard = 0;
    //     var cardTemp;
    //     let isRound2 = 0;
    //     cardTemp = this.getCard();
    //     this.node.addChild(cardTemp.node, GAME_ZORDER.Z_CARD);
    //     cardTemp.setTextureWithCode(0);
    //     cardTemp.node.setScale(0.4, 0.4);
    //     cardTemp.node.position = this.DealerInGame.node.position;
    //     var dynamicIndex = this.players[indexP]._indexDynamic;
       
    //     let listVCardP = this.players[indexP].vectorCard;
    //     if (round == 1) {
    //         isRound2 = 0;
    //         cardTemp.node.rotation = (-10) + (23 * (listVCardP.length));
    //     } else {
    //         isRound2 = 8;
    //         listVCardP[0].node.rotation -= 13;
    //         listVCardP[1].node.rotation -= 10;
    //         cardTemp.node.rotation = 25;
    //     }
    //     if (dynamicIndex != 0) {
    //         let offset = 20 * listVCardP.length;
    //         let num = 55;
    //         ScaleCard = 0.3;
    //             // Set z-Index for card of thisPlayer
    //         if (dynamicIndex > 4) {
    //             Vplayer = cc.v2(this.listPosView[dynamicIndex].x - num + offset, this.listPosView[dynamicIndex].y - isRound2);
    //         } else {
    //             Vplayer = cc.v2(this.listPosView[dynamicIndex].x + num + offset, this.listPosView[dynamicIndex].y - isRound2);
    //         }
    //         if (listVCardP.length > 0) cardTemp.node.zIndex = listVCardP[listVCardP.length - 1].node.zIndex + 1;
    //     } else {
    //         // Set z-index for another players
    //         let offset = 20 * listVCardP.length;
    //         if (listVCardP.length > 0) cardTemp.node.zIndex = listVCardP[listVCardP.length - 1].node.zIndex + 1;
    //         if (round == 2)
    //             Vplayer = cc.v2(this.listPosView[dynamicIndex].x + 130 + offset, this.listPosView[dynamicIndex].y - 10);
    //         else
    //             Vplayer = cc.v2(this.listPosView[dynamicIndex].x + 130 + offset, this.listPosView[dynamicIndex].y);
    //     }
    //     listVCardP.push(cardTemp);
    //     let length = listVCardP.length;
    //     let acOpenCard = cc.callFunc(() => {
    //         // if (length == 3) {
    //         //     for (let i = 0; i < length; i++) {
    //         //         listVCardP[i].node.rotation = -10 + (10 * i);
    //         //     }
    //         // }
    //         cardTemp.setTextureWithCode(cardCode)
    //     });
    //     let actionMove = cc.spawn(cc.rotateBy(0.3, 360), cc.moveTo(0.3, Vplayer).easing(cc.easeCubicActionInOut()));
    //     if (dynamicIndex == 0) {
    //         let actionScale = cc.callFunc(() => {
    //             cardTemp.node.scale = 0.55;
    //             if (length > 1) {
    //                 this.SetEfftResult(0, this._scoreP, this._rateP, length);
    //                 if (length == 3) this.List_Bg_Result[0].node.position = cc.v2(43, -208);
    //             }
    //         });
    //         cardTemp.node.runAction(cc.sequence(cc.delayTime(delayTime), actionMove, acOpenCard, actionScale));
    //     } else {
    //         cardTemp.node.runAction(cc.sequence(cc.delayTime(delayTime), actionMove, acOpenCard));
    //     }
    // },

    ChiaCardPlayer (indexP, cardCode = 0) {
        let cardTemp = this.spawncard();
        let dynamicIndex = this.players[indexP]._indexDynamic;
        this.players[indexP].vectorCard.push(cardTemp);
        this.playerCards[dynamicIndex].push(cardTemp.node);
        let currentCard = this.playerCards[dynamicIndex].length -1;
        let length = currentCard + 1;
        if(dynamicIndex == 0){
            cardTemp.node.zIndex = 1000;
            cardTemp.node.runAction(cc.sequence(cc.scaleTo(0.2,0.05,0.7),cc.scaleTo(0.2,0.7)));
            cardTemp.node.runAction(cc.sequence(cc.skewTo(0.2,0,15),cc.callFunc(()=>{cardTemp.skewY = -15}),cc.skewTo(0.2,0,0)));
            // cardTemp.node.runAction(cc.moveTo(0.6,cc.v2(0,50)).easing(cc.easeCubicActionOut()));
            cardTemp.moveCardNoBug(0.6,cc.v2(0,50))
            cardTemp.node.runAction(cc.rotateTo(0.5,0).easing(cc.easeCubicActionOut()));
            this.setTimeout(()=>{
                cardTemp.setTextureWithCode(cardCode);
            },200)
            
            this.setTimeout(()=>{
                cardTemp.node.runAction(cc.scaleTo(0.4,0.45));
                this.handleCardPosition(dynamicIndex,length,0.55);
                this.SetEfftResult(0, this._scoreP, this._rateP, length,1700);
                if (length == 3) this.List_Bg_Result[0].node.position = cc.v2(43, -208);
            },600)
        }else{
            this.handleCardPosition(dynamicIndex,this.playerCards[dynamicIndex].length,0.45);
        }
        
    },

    handleCardPosition (indexD,indexC,scale = 0.45){
        for(let i = 0; i < indexC; i++){
            let card = this.playerCards[indexD][i];
            let act = this.cardAction[indexD][i];
            let data = this.getCardPositionNAngle(indexD,i);
            
            card.stopAllActions();
            card.getComponent('Card').moveCardNoBug(0.6,data.pos);
            card.runAction(
                cc.spawn(
                    // cc.moveTo(0.6,data.pos).easing(cc.easeCubicActionOut()),
                    cc.rotateTo(0.6,data.angle).easing(cc.easeCubicActionOut()),
                    cc.skewTo(0.6,0,0),
                    cc.scaleTo(0.6,scale),
                ),
            )
            this.setTimeout(()=>{
                card.zIndex =GAME_ZORDER.Z_CARD;
            },600)
            // this.moveCardToPosition(indexD,i,card,data.arrPos[i],data.arrRotate[i]);
        }
    },

    ChiaCardDealer (card = 0) {
        let cardTemp = this.spawncard();
        if (this.listCardSystem.length > 0) cardTemp.node.zIndex = this.listCardSystem[this.listCardSystem.length - 1].node.zIndex + 1;
        this.listCardSystem.push(cardTemp);

        for(let i = 0; i < this.listCardSystem.length; i++){
            let data = this.getCardPositionNAngleDealer(i);
            let card = this.listCardSystem[i].node;
            card.stopAllActions();
            card.getComponent('Card').moveCardNoBug(0.4,data.pos);
            card.runAction(
                cc.spawn(
                    // cc.moveTo(0.4,data.pos).easing(cc.easeCubicActionOut()),
                    cc.rotateTo(0.4,data.angle).easing(cc.easeCubicActionOut()),
                    cc.skewTo(0.4,0,0),
                    cc.scaleTo(0.4,0.45),
                ),
            )
        }

        // cardTemp.node.rotation = -20 + (35 * (this.listCardSystem.length));
        // let offset = cardTemp.node.getContentSize().width * 0.3 / 4 * this.listCardSystem.length - 1;
        // let Vplayer = cc.v2(3 - 30 + offset, 233 - 20);
        // var acSpawn = cc.moveTo(0.3, Vplayer).easing(cc.easeOut(3));
        // cardTemp.node.runAction(cc.sequence(cc.delayTime(delayTime), acSpawn, cc.callFunc(() => {
        //     let length = this.listCardSystem.length
        //     if (length == 3) {
        //         for (let i = 0; i < length; i++) {
        //             this.listCardSystem[i].node.rotation = -10 + (23 * (i));
        //             this.listCardSystem[i].node.x += (10 + i * 5);
        //         }
        //     }
        //     cardTemp.setTextureWithCode(card)
        // })))
    },

    getCardPositionNAngleDealer (indexC){
        let Cstack = this.listCardSystem;
        let angle = 20 * indexC - 10 * (Cstack.length - 1);
        let offset = 30 * indexC - 15 * (Cstack.length - 1);
        let hand = cc.v2(0,200);
        let offY = 0;
        if(Cstack.length > 2){
            offY = 6;
        }

        let pos;
        if(indexC == 1){
            pos = cc.v2(hand.x + offset, hand.y);
        }else{
            pos = cc.v2(hand.x + offset, hand.y - offY);
        }
        let result = {
            angle: angle,
            pos: pos,
        }
        return result;
    },

    getCardPositionNAngle (indexD,indexC){
        let Cstack = this.playerCards[indexD];
        let angle = 20 * indexC - 10 * (Cstack.length - 1);
        let offset = 30 * indexC - 15 * (Cstack.length - 1);
        let hand = this.getHandPosition(indexD);
        let offY = 0;
        if(Cstack.length > 2){
            offY = 6;
        }
        let pos;
        if(indexC == 1){
            pos = cc.v2(hand.x + offset, hand.y);
        }else{
            pos = cc.v2(hand.x + offset, hand.y - offY);
        }
        
        let result = {
            angle: angle,
            pos: pos,
        }
        return result;
    },

    getCardPosition (index){
        let hand = this.getHandPosition(index);
        let numbOfCards = this.playerCards[index].length;
        if(numbOfCards == 1){
            return [hand];
        }else if(numbOfCards == 2){
            return [cc.v2(hand.x - 10,hand.y - 5), cc.v2(hand.x + 10,hand.y - 5)];
        }else{
            return [cc.v2(hand.x - 20,hand.y - 5), hand, cc.v2(hand.x + 20,hand.y - 5)];
        }
    },

    getCardRotation (index){
        let numbOfCards = this.playerCards[index].length;
        if(numbOfCards == 1){
            return [0];
        }else if(numbOfCards == 2){
            return [-10, 10];
        }else{
            return [-20, 0, 20];
        }
    },

    getHandPosition (index){
        let offset = 0;
        if(index > 3){
            offset = -65;
        }else{
            offset = 65;
        }
        switch(index){
            case 0:
                return cc.v2(-115 + 2 * offset + 15,-173);
            case 1:
                return cc.v2(-420 + offset,-173);
            case 2:
                return cc.v2(-513 + offset,39);
            case 3:
                return cc.v2(-314 + offset,255);
            case 4:
                return cc.v2(315 + offset,255);
            case 5:
                return cc.v2(546 + offset,39);
            case 6:
                return cc.v2(428 + offset,-173);
            case 7:
                return cc.v2(-3 + offset,223);
        }
    },

    spawncard (){
        let cardTemp = this.getCard();
        this.node.addChild(cardTemp.node, GAME_ZORDER.Z_CARD);
        cardTemp.setTextureWithCode(0);
        cardTemp.node.setScale(0.4, 0.4);
        cardTemp.node.position = cc.v2(0,220);
        cardTemp.node.rotation = -90;
        return cardTemp
    },

    moveCardToPosition (indexD,indexC,card,pos,angle){
        card.getComponent('Card').moveCardNoBug(0.4,pos);
        let move = cc.spawn(
            // cc.moveTo(0.4,pos).easing(cc.easeCubicActionInOut()),
            cc.rotateTo(0.4,angle).easing(cc.easeCubicActionInOut()),
            cc.scaleTo(0.4,0.4),
        )
        this.cardAction[indexD][indexC] = move;
        card.runAction(move);
    },

    foldCardUp (card,cardCode,scale){
        card.runAction(
            cc.spawn(
                cc.sequence(
                    cc.scaleTo(0.2,0.01,scale+0.1),
                    cc.callFunc(()=>{
                        card.getComponent('Card').setTextureWithCode(cardCode);
                    }),
                    cc.scaleTo(0.2,scale),
                ),

                cc.sequence(
                    cc.skewTo(0.2,0,-15),
                    cc.callFunc(()=>{
                        card.skewY = 15;
                    }),
                    cc.skewTo(0.2,0,0),
                ),
            )
        )
    },

    foldCardDown (card){
        card.runAction(
            cc.spawn(
                cc.sequence(
                    cc.scaleTo(0.15,0.01,0.5),
                    cc.callFunc(()=>{
                        card.getComponent('Card').setTextureWithCode(0);
                    }),
                    cc.scaleTo(0.15,0.4),
                ),

                cc.sequence(
                    cc.skewTo(0.15,0,-15),
                    cc.callFunc(()=>{
                        card.skewY = 15;
                    }),
                    cc.skewTo(0.15,0,0),
                ),
            )
        )
    },

    onClickBack() {
        this._super();
    },
    SetEfftResult(arr_index, score, rate, num_card,timeDel=0) {
        ///  let _this =this;

        let item = this.List_Bg_Result[arr_index];
        if (item.node == null || typeof item.node == 'undefined') {
            if (this.resultBorkScorePool.size() < 1) {
                item = cc.instantiate(this.bg_Score_Result).getComponent('BorkResultScore');
            } else {
                item = this.resultBorkScorePool.get().getComponent('BorkResultScore');;
            }
            this.node.addChild(item.node, GAME_ZORDER.Z_BET);
            this.List_Bg_Result[arr_index] = item;
            if (arr_index == 0) {
                item.node.position = cc.v2(30, -208);
            } else if (arr_index == 9) {
                item.node.position = cc.v2(0, 186);
            } else {
                item.node.position = this.listPosView[arr_index];
            }

        }
        cc.NGWlog('chay vao ham khoi tao item bork result ' + arr_index + score);
        if(timeDel===0)
        item.setResult(score, rate, num_card);
        else {
            this.setTimeout(()=>{
                item.setResult(score, rate, num_card);
            },timeDel)
        }

    },
    IndexFirtDealCard() {
        if (this.players.length < 3) {
            return this.getIndexOfPlayer(this.thisPlayer)
        } else {
            for (let i = 0; i < this.players.length; i++) {
                let indexDynamic = this.players[i]._indexDynamic;
                if (indexDynamic == 4) {
                    return this.getIndexOfPlayer(this.players[i]);
                }
            }
        }
    },
    HandlerTip(data) {
        data.displayName = GameManager.getInstance().user.displayName;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].pname == data.N) {
                require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.tipAudio);
                this.EffectMoneyChange(-data.AGTip, this.players[i].ag, this.players[i]._playerView.lbAg);
                this.players[i].ag -= data.AGTip;
                if (this.players[i].pname == this.thisPlayer.pname) {
                    GameManager.getInstance().user.ag -= data.AGTip;
                }
                for (let j = 0; j < 2; j++) // sinh ra 4 chip                     //  lay tien nguoi` thua
                {
                    if (this.chipEffectPool.size() < 1) this.chipEffectPool.put(cc.instantiate(this.chipEffect));
                    let temp = this.chipEffectPool.get();
                    temp.setPosition(this.players[i]._playerView.node.position);
                    this.ParentChip.addChild(temp);
                    let tempAc1 = cc.moveTo(0.2, temp.position.add(cc.v2(0, 80))).easing(cc.easeElasticOut(1));
                    let tempAc2 = cc.moveTo(1, this.DealerInGame.node.position).easing(cc.easeInOut(3));
                    temp.runAction(cc.sequence(cc.delayTime(j * 0.2), tempAc1, cc.delayTime(0.3), tempAc2, cc.callFunc(() => { this.chipEffectPool.put(temp) })));
                }
                this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(() => { this.DealerInGame.show(this.players[i].displayName, data.AGTip); })))
            }
        }
    },
    onClickchat() {
        this._super();
    },
    resetToggleList() {
        for (let i = 0; i < this.listToggle.length; i++) {
            this.listToggle[i].isChecked = false;
        }
    },
    readListToggle() {
        for (let i = 0; i < this.listToggle.length; i++) {
            if (this.listToggle[i].isChecked) {
                if (i == 0) {
                    this.OnClickAcPCard();
                } else {
                    this.OnClickUnAcPCard();
                }
                this.listToggle[i].isChecked = false;
                return true;
            }
        }
        this.Node_Toggle.active = false;
        return false;
    },
    cancelDealer(data) {
        var datac = data.data;
        var _nameShow = "";

        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].pname === this.nameDealer)
                _nameShow = this.players[i].pname;
        }
        if (_nameShow.length > 15) {
            _nameShow = _nameShow.substring(0, 15) + '...';
        }

        if (datac === "under_ag" && this.nameDealer === require('GameManager').getInstance().user.uname) {
            var strShow = require('GameManager').getInstance().getTextConfig('txt_notmoney_dealer');
            require('GameManager').getInstance().onShowToast(strShow);
        } else if (datac === "true") {
            if (this.state === STATE_GAME.PLAYING || this.state == STATE_GAME.VIEWING) {
                var strShow = require('GameManager').getInstance().getTextConfig('txt_pok_x_huylamcai_vansau').replace("%s", _nameShow);
                require('GameManager').getInstance().onShowToast(strShow);
            } else {
                var strShow = require('GameManager').getInstance().getTextConfig('txt_pok_x_huylamcai').replace("%s", _nameShow);
                require('GameManager').getInstance().onShowToast(strShow);
            }
        }
    },
    changeDealer(data) {
        var newName = data.new_dealer;
        var oldName = data.old_dealer;
        var _nameShowNew = "";
        var _nameShowOld = "";
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].pname === newName)
                _nameShowNew = this.players[i].pname;
            if (this.players[i].pname === oldName)
                _nameShowOld = this.players[i].pname;
        }

        if (_nameShowNew.length > 15) {
            _nameShowNew = _nameShowNew.substring(0, 15) + '...';
        }
        if (_nameShowOld.length > 15) {
            _nameShowOld = _nameShowOld.substring(0, 15) + '...';
        }

        if (newName === "false") {
            require('GameManager').getInstance().onShowToast(require('GameManager').getInstance().getTextConfig("txt_pok_thieutien_lamcai")); // ko du tien lam cai
            return;
        }

        if (oldName.length > 0) {
            if (this.state == STATE_GAME.PLAYING || this.state == STATE_GAME.VIEWING) {
                var strShow = require('GameManager').getInstance().getTextConfig('txt_pok_a_thay_b_vansau').replace("%s", _nameShowNew);
                strShow = strShow.replace("%s", _nameShowOld);
                require('GameManager').getInstance().onShowToast(strShow);
            } else {
                var strShow = require('GameManager').getInstance().getTextConfig('txt_chuyen_dealer').replace("%s", _nameShowNew);
                strShow = strShow.replace("%s", _nameShowOld);
                require('GameManager').getInstance().onShowToast(strShow);
            }
        } else {
            if (newName === require('GameManager').getInstance().user.uname) this.setStateBtnDealer(0);
            if (this.state == STATE_GAME.PLAYING || this.state == STATE_GAME.VIEWING) {
                var strShow = require('GameManager').getInstance().getTextConfig('txt_pok_lamcai_vansau').replace("%s", _nameShowNew);
                require('GameManager').getInstance().onShowToast(strShow);
            } else {
                var strShow = require('GameManager').getInstance().getTextConfig('txt_pok_x_lamcai').replace("%s", _nameShowNew);
                require('GameManager').getInstance().onShowToast(strShow);
            }
        }
    },
    generateRandomNumber(min_value, max_value) {
        this._super(min_value, max_value);
    },
    onClickToggleDraw() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickToggleDraw_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },
    onClickToggleNotDraw() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickToggleNotDraw_%s", require('GameManager').getInstance().getCurrentSceneName()));
    }
});
module.export = BorkGameView;