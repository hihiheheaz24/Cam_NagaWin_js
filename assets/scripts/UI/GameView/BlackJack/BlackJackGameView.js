// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var Player = require('Player');
var GameManager = require('GameManager');
cc.Class({
    
    extends: require('GameView2'),
    properties: {
        light: cc.Node,
        nodeChatMini:cc.Node,
        boxCardPf: cc.Prefab,
        buttonPLayPf: cc.Prefab,
        togglePlayPf: cc.Prefab,
        nodeBetPf: cc.Prefab,
        nodeBoxInsureBetPf: cc.Prefab,
        buyInsurePf: cc.Prefab,
        item_effect: cc.Prefab,
        nodeBetTimePf: cc.Prefab,
        lbTime: cc.Label,
        nodeChip: cc.Node,
        listSpriteActionPlayCard: [cc.SpriteFrame], //0:double - 1:split - 2:hit -3:stand
        font: [cc.Font], // 0 sub  , 1 plus
        spBackgroundBoxCard: cc.SpriteFrame,
        spChipInsurance: cc.SpriteFrame,
        cardDeckR: cc.Node,
        cardDeckL: cc.Node,
        aniStart: sp.Skeleton,
        aniCheckBaiUp: sp.SkeletonData,
        aniBust : sp.SkeletonData,
        aniWow : sp.SkeletonData,
        aniBlackJack: sp.Skeleton,
        aniDraw:sp.SkeletonData,
        aniWin: sp.SkeletonData,
        textLost:cc.SpriteFrame,
        lbWating:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:
    // Liist pos player (-100,-296) , (-537,-128) , (-577,185) , (577,185) ,  (-537,128)

    onLoad() {
        this.UIManager = require('UIManager').instance;
        this.cardPool = this.UIManager.cardPool;
        this._super();
        this.listPosView[2] = null;
        this.listPosView[3] = null;

        this.vtDealer = cc.v2(0, 130);
        this.listBoxCardPos = [{ x: 0, y: -100 }, { x: -432, y:19 }, { x: -427, y: 183 }, { x: 424, y: 183 }, { x: 432, y: 19 }, { x: 0, y: 150 }];
        this.listBoxInsurePos = [{ x: 140, y: -235 }, { x: -401, y: -126 }, { x: -427, y: 90 }, { x: 308, y: 88 }, { x: 401, y: -126 }];
        this.listCurChip = [];
        this.creatInfoLight();
        this.listCardSystem = [];
        this.listBoxCard = [{}, {}, {}, {}, {}, {}];
        this.listBoxInsure = [{}, {}, {}, {}, {}];
        this.buttonPLay = null;
        this.togglePlay = null;
        this.nodeBet = null;
        this.minBet = 0;
        this.maxBet = 0;
        this.playerCurTurn = null;
        this.passTurnThisPlayer = false;
        this.listScoreDealer = [];
        this.listCardCodeDealer = [];
        this.isCardHan1 = null;
        this.listDefineBezer =[[cc.v2(600, 100), cc.v2(300, -46)],[cc.v2(600, 0), cc.v2(0, 50)],[],[],[cc.v2(500, 300), cc.v2(600, 200)],[cc.v2(300, 130), cc.v2( 100, 160)] ];
        this.listMoneyChange =[0,0,0,0,0];
        this.listInfoPlayerBet = [0, 0, 0, 0, 0];
        this.isPassTurnMe = false;
        this.isStood = false;
        this.isBust = false;
        this.isDouble = false;
        this.isSplit = false;
        this.isBlackjack = false;
        this.nodeTime = null;
        this.isRuningGame = false;
        this.isUpdatePos = false;


      
    },
    creatInfoLight() {
        this.listInfoLight = [];
        let item = {};
        item.pos = cc.v2(2, -10);
        item.rotate = 0;
        this.listInfoLight.push(item);
        let item2 = {};
        item2.pos = cc.v2(-408, 132);
        item2.rotate = -64;
        this.listInfoLight.push(item2);
        let item3 = {};
        item3.pos = cc.v2(-556, 175);
        item3.rotate = -112;
        this.listInfoLight.push(item3);
        let item4 = {};
        item4.pos = cc.v2(408, 132);
        item4.rotate = 64;
        this.listInfoLight.push(item4);
        let item5 = {};
        item5.pos = cc.v2(408, 132);
        item5.rotate = 64;
        this.listInfoLight.push(item5);
    },
    handleSTable(strData) {
        this._super(strData);
        if (this.buttonPLay == null) {
            this.buttonPLay = cc.instantiate(this.buttonPLayPf);
            this.buttonPLay.getComponent('NodeButtonBlackJack').gameView = this;
            this.node.addChild(this.buttonPLay, GAME_ZORDER.Z_BUTTON);
            this.buttonPLay.active = false;
            cc.NGWlog("da tat button play==");
        };
        let stringTemp = this.agTable.toString();

        if(this.agTable == 2){
            this.listCurChip = [2, 10, 50, 100, 500];
        }else{
            if (stringTemp[0] == '1') {
                this.listCurChip = [this.agTable, this.agTable * 5, this.agTable * 10, this.agTable * 50, this.agTable * 100];
            } else {
                this.listCurChip = [this.agTable, this.agTable * 2, this.agTable * 10, this.agTable * 20, this.agTable * 100];
            }
        }
        
        this.InstantiateBoxCard();
        if (this.nodeBet == null) {
            this.nodeBet = cc.instantiate(this.nodeBetPf).getComponent('NodeBetBlackJack');
            this.nodeBet.setInfo(this.agTable, this.agTable * 200, this, this.listCurChip);
            this.node.addChild(this.nodeBet.node, GAME_ZORDER.Z_BUTTON);
            this.nodeBet.node.active = false;
        };

        this.lbWating.node.parent.active = true;
        let text0 = "Waiting for game start ";
        let text1 = "Waiting for game start .";
        let text2 = "Waiting for game start ..";
        let text3 = "Waiting for game start ...";
        var seq = cc.repeatForever(
            cc.sequence(
                cc.callFunc(()=>{
                    this.lbWating.string = text0;
                }),cc.delayTime(0.5),
                cc.callFunc(()=>{
                    this.lbWating.string = text1;
                }),cc.delayTime(0.5),
                cc.callFunc(()=>{
                    this.lbWating.string = text2;
                }),cc.delayTime(0.5),
                cc.callFunc(()=>{
                    this.lbWating.string = text3;
                }),cc.delayTime(0.5),
            ));
        this.lbWating.node.runAction(seq)

    },
    handleChatTable(data) {
        this._super(data);
    },
    readDataPlayer(_player, data) {
        _player.id = data.id;
        _player.fid = data.FId;
        _player.pname = data.N;
        _player.ag = data.AG;
        _player.vip = data.VIP;
        _player.avatar_id = data.Av;
        _player.is_ready = data.isStart;
        _player.ip = data.sIP;
        _player.displayName = data.displayName;
    },
    handleLTable(data) {
        //this._super(data);
        var player = this.getPlayerWithId(data.id);
        if (player == null) return;
        let name = player.pname;
        if (name !== require("GameManager").getInstance().user.uname) {
            this.addChatLeave(player.displayName);
            this.removePlayer(name);
            this.initPlayerBoxCard();
        }

       
    },
    handleJTable(strData) {
        let data = JSON.parse(strData);
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].id == data.id) {
                return;
            }
        }
        this._super(strData);
        this.initPlayerBoxCard();

    },
    handleVTable(strData) {
        this._super(strData);
        if (this.buttonPLay == null) {
            this.buttonPLay = cc.instantiate(this.buttonPLayPf);
            this.buttonPLay.getComponent('NodeButtonBlackJack').gameView = this;
            this.node.addChild(this.buttonPLay, GAME_ZORDER.Z_BUTTON);
            this.buttonPLay.active = false;
        };

        this.thisPlayer.is_ready = false;
        let stringTemp = this.agTable.toString();
        if(this.agTable == 2){
            this.listCurChip = [2, 10, 50, 100, 500];
        }else{
            if (stringTemp[0] == '1') {
                this.listCurChip = [this.agTable, this.agTable * 5, this.agTable * 10, this.agTable * 50, this.agTable * 100];
            } else {
                this.listCurChip = [this.agTable, this.agTable * 2, this.agTable * 10, this.agTable * 20, this.agTable * 100];
            }
        }
        var data = JSON.parse(strData);
        var listPlayer = data.ArrP;
        this.viewIng(listPlayer, data);
        if (this.nodeBet == null) {
            this.nodeBet = cc.instantiate(this.nodeBetPf).getComponent('NodeBetBlackJack');
            this.nodeBet.setInfo(this.agTable, this.agTable * 200, this, this.listCurChip);
            this.node.addChild(this.nodeBet.node, GAME_ZORDER.Z_BUTTON);
            this.nodeBet.node.active = false;
        };
        this.isRuningGame = true;
    },
    
    handleCTable(strData) {
        this._super(strData);
        if (this.buttonPLay == null) {
            this.buttonPLay = cc.instantiate(this.buttonPLayPf);
            this.buttonPLay.getComponent('NodeButtonBlackJack').gameView = this;
            this.node.addChild(this.buttonPLay, GAME_ZORDER.Z_BUTTON);
            this.buttonPLay.active = false;
        };
        this.thisPlayer.is_ready = true;
        let stringTemp = this.agTable.toString();
        if(this.agTable == 2){
            this.listCurChip = [2, 10, 50, 100, 500];
        }else{
            if (stringTemp[0] == '1') {
                this.listCurChip = [this.agTable, this.agTable * 5, this.agTable * 10, this.agTable * 50, this.agTable * 100];
            } else {
                this.listCurChip = [this.agTable, this.agTable * 2, this.agTable * 10, this.agTable * 20, this.agTable * 100];
            }
        }
        this.InstantiateBoxCard();
        if (this.nodeBet == null) {
            this.nodeBet = cc.instantiate(this.nodeBetPf).getComponent('NodeBetBlackJack');
            this.nodeBet.setInfo(this.agTable, this.agTable * 200, this, this.listCurChip);
            this.node.addChild(this.nodeBet.node, GAME_ZORDER.Z_BUTTON);
            this.nodeBet.node.active = false;
        }
    },
    handleRJTable(strData) {
        this._super(strData);
        if (this.buttonPLay == null) {
            this.buttonPLay = cc.instantiate(this.buttonPLayPf);
            this.buttonPLay.getComponent('NodeButtonBlackJack').gameView = this;
            this.node.addChild(this.buttonPLay, GAME_ZORDER.Z_BUTTON);
            this.buttonPLay.active = false;
        };
        let stringTemp = this.agTable.toString();
        if(this.agTable == 2){
            this.listCurChip = [2, 10, 50, 100, 500];
        }else{
            if (stringTemp[0] == '1') {
                this.listCurChip = [this.agTable, this.agTable * 5, this.agTable * 10, this.agTable * 50, this.agTable * 100];
            } else {
                this.listCurChip = [this.agTable, this.agTable * 2, this.agTable * 10, this.agTable * 20, this.agTable * 100];
            }
        }
        var data = JSON.parse(strData);
        var listPlayer = data.ArrP;
        this.viewIng(listPlayer, data);
        if (this.nodeBet == null) {
            this.nodeBet = cc.instantiate(this.nodeBetPf).getComponent('NodeBetBlackJack');
            this.nodeBet.setInfo(this.agTable, this.agTable * 200, this, this.listCurChip);
            this.node.addChild(this.nodeBet.node, GAME_ZORDER.Z_BUTTON);
            this.nodeBet.node.active = false;
        }
        if(data.status == 'DECISION_TIME'){
            let curslot = data.currentSlot;
            let curPlayer = this.getIndexOfPlayer(this.thisPlayer);
            if(curPlayer < curslot ){
                this.isPassTurnMe = true;
            }else if(curPlayer == curslot){
                this.buttonPLay.avtive = true;
                this.buttonPLay.getComponent('NodeButtonBlackJack').setInfo(this.nodeBet._isLastBet, this.thisPlayer.ag);
                this.buttonPLay.getComponent('NodeButtonBlackJack').setStatus(this.thisPlayer.vectorCard[0] ,this.thisPlayer.vectorCard[1]);
            }else{
                this.isPassTurnMe = false;
            }
        }
       
        

    },
    viewIng(listPlayer, data) {
        this.InstantiateBoxCard();
        let cardDealer = data.dealersOpenCard;
        for (let i = 0; i < listPlayer.length; i++) {
            let player = this.getPlayerWithId(listPlayer[i].id);
            let indexP = this.getIndexOfPlayer(player);
            let dynaIndex = player._indexDynamic;
            let hans = listPlayer[i].playerHands;
            this.listMoneyChange[dynaIndex] = player.ag;
            if (hans[1] != null) {
                // this.listBoxCard[dynaIndex].doubleBoxCard(this);
                cc.NGWlog('chay vao hand 1 view ' + hans[1].chip);
                this.DoubleBoxCard(dynaIndex);
                let lengthCard = hans[1].cardsCode.length;
                for (let j = 0; j < lengthCard; j++) {
                    this.ChiaCardPlayer(indexP, hans[1].cardsCode[j], 1, true, true);
                }
                this.listBoxCard[dynaIndex].Box2.bet(hans[1].chip);
                player._playerView.setAg(player.ag-=hans[1].chip);
                this.listBoxCard[dynaIndex].Box2.turnOfBorderBox();

                if (hans[1].blackjack) {
                    this.listBoxCard[dynaIndex].Box2.score = 999;
                } else {
                    this.listBoxCard[dynaIndex].Box2.score = hans[1].score
                }
                this.listBoxCard[dynaIndex].Box2.showScore(lengthCard);
                if (hans[1].score > 21) {
                    this.actionEndGamePlayer(player, -hans[1].chip, 1)
                }

            }
            if (hans[0] != null) {
                cc.NGWlog('chay vao hand 0 view ' + hans[0].chip);
                this.listBoxCard[dynaIndex].bet(hans[0].chip);
                player._playerView.setAg(player.ag-=hans[0].chip);
                if (hans[0].cardsCode != null) {
                    let lengthCard = hans[0].cardsCode.length;

                    for (let j = 0; j < lengthCard; j++) {
                        this.ChiaCardPlayer(indexP, hans[0].cardsCode[j], 0, true, true);
                    }
                    this.listBoxCard[dynaIndex].turnOfBorderBox();
                    if (hans[0].blackjack) {
                        this.listBoxCard[dynaIndex].score = 999;
                    } else {
                        this.listBoxCard[dynaIndex].score = hans[0].score
                    }
                    this.listBoxCard[dynaIndex].showScore(lengthCard);
                    if (hans[0].score > 21) {
                        this.actionEndGamePlayer(player, -hans[0].chip, 0)
                    }
                }
            }
            if(listPlayer[i].insurance == true){
               this.InstantiateBoxInsure(dynaIndex , listPlayer[i].insuranceAG , player);
               player._playerView.setAg(player.ag-= listPlayer[i].insuranceAG);
            }
        }
        if (cardDealer != null) {
            this.ChiaCardDealer(cardDealer, true, true);
            this.ChiaCardDealer(0, true, true);
        }
    },
    DoubleBoxCard(indexDyn) {
        this.listBoxCard[indexDyn].doubleBoxCard(indexDyn, this);
    },
    ResetBoxCard(){
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_fold);
        for(let i = 0 ; i < 3 ; i++){
            // let index = this.players[i]._indexDynamic;
            if(i== 2) i =4;
             let item = this.listBoxCard[i];
            if( item.node != null && typeof item.node != 'undefined'){
                item.unuse2();
                if(item.Box2 != null){
                    item.Box2.unuse2();
                } 
            }
        }
        this.listBoxCard[5].unuse2();
    },
    setGameInfo(m, id) {
        //this._super(m, id);
        this.agTable = m;
        this.maxBet = this.agTable * 200;
        this.lbInfo.string = cc.js.formatStr('%s %d\n%s: %s\n%s: %s', GameManager.getInstance().getTextConfig('txt_id'), id, 'Min', GameManager.getInstance().formatMoney(m), 'Max', GameManager.getInstance().formatMoney(m * 200));

        GameManager.getInstance().table_mark = m;
        GameManager.getInstance().tableId = id;

    },
    startGameAndSendTracking() {
        this._super();
    },
    clearAllCard() {
        this._super();
    },

    // prepareToStart(strdata) {
    //     let data = JSON.parse(strdata);
    //     let time = data.time;
    //     let item = cc.instantiate(this.nodeBetTimePf).getComponent('CountDownTime');
    //     item.setInfo(time / 1000, 1);
    //     item.node.position = cc.v2(0, 30);
    //     this.node.addChild(item.node, GAME_ZORDER.Z_BUTTON);

    //     this.setTimeout(() => {
    //         
    //         this.aniStart.node.active = true;
    //         this.aniStart.setAnimation(0, "animation", false);
    //     }, time);

    //     this.setTimeout(() => {
    //         ;
    //         this.aniStart.node.active = false;
    //         require('HandleGamePacket').NextEvt();
    //     }, time + 2000);

    // },
    handleFinish(strdata) {
        if(this.stateGame != 2)this.stateGame = 1;
        
        if (this.playerCurTurn != null) {
            this.playerCurTurn.setTurn(false);
            let indexTemp = this.playerCurTurn._indexDynamic;
            this.listBoxCard[indexTemp].acceptScore();
            if(this.listBoxCard[indexTemp].Box2 != null)
            this.listBoxCard[indexTemp].Box2.acceptScore();
            if(this.playerCurTurn == this.thisPlayer){
                if(this.listBoxCard[0].Box2 != null){
                    this.listBoxCard[0].Box2.isTurnPlayer(false);
                }else{
                    this.listBoxCard[0].isTurnPlayer(false);
                }
            } 
        }
        if (this.buttonPLay != null) {
            this.buttonPLay.active = false
        }
        if (this.togglePlay != null) {
            this.togglePlay.node.active = false
        }
        this.light.active = false;
        let data = JSON.parse(strdata);
        let listPlayer = data.packets;
        this.listScoreDealer = data.score;
        let timeDelayOpenCard = this.openCardFinishGame(strdata);
        let timeDelayPay = 0;
        this.setTimeout(() => {
            
            let dataLength = listPlayer.length;
            
            for(let l = 4 ; l < 5 ; l++){
                for (let i = 0; i < dataLength; i++) {

                    let player = this.getPlayerWithId(listPlayer[i].pid);
                    let dyn_id = player._indexDynamic;
                    cc.NGWlog('gia tri l la=== ' + l)
                        if(dyn_id == l){
                            let chip = listPlayer[i].hand0;
                        let chip2 = listPlayer[i].hand1;
                        let totalChip = parseInt(listPlayer[i].AG);
                        let moneyChange = totalChip - player.ag;
                        let moneyAdd = parseInt(listPlayer[i].agAdd);

                       // player._playerView.setupEffectChangeMoney(player.ag, player.ag += moneyChange);

                        if (player == this.thisPlayer) {
                            if(require('GameManager').getInstance().user.vip < 1) require('NetworkManager').getInstance().sendUpVip();
                            require('GameManager').getInstance().user.ag = totalChip;
                           require('SMLSocketIO').getInstance().emitUpdateInfo();

                            if (Global.LobbyView !== null)
                                Global.LobbyView.updateChip();
                            if (Global.MainView !== null)
                                Global.MainView.updateChipAndSafe();
                                
                            // var str = "";
                            // if (chip < 0) {
                            //     str = "Monica: " + require('GameManager').getInstance().getTextConfig('shan2_you_lost').replace("%lld", chip + "");
                            // }
                            // else if (chip > 0) {
                            //     str = "Monica: " + require('GameManager').getInstance().getTextConfig('shan2_you_win').replace("%lld", chip + "");
                            // }
                            // this.itemChatHistory.setDataChatCard(str, listPlayer[i].ArrCard);
                            // this.quickChat.addChatWithCard(str, listPlayer[i].ArrCard);
                        };
                        if(dyn_id != 1){
                            if (chip2 != null) {
                                this.setTimeout(()=>{
                                    
                                    this.listBoxCard[dyn_id].Box2.handleFinish(chip2);
                                }, timeDelayPay * 1000)
                                timeDelayPay+=1.5;
                            //  this.InstantiateTextMoney(dyn_id, parseInt(chip2), 1, player);
                            }
                            if (chip != null) {
                            this.setTimeout(()=>{
                                
                                this.listBoxCard[dyn_id].handleFinish(chip);
                            }, timeDelayPay * 1000)
                            timeDelayPay+=1.5;
                            //  this.InstantiateTextMoney(dyn_id, parseInt(chip), 0, player);
                            }
                        }else{
                            if (chip != null) {
                            this.setTimeout(()=>{
                                
                                this.listBoxCard[dyn_id].handleFinish(chip);
                            }, timeDelayPay * 1000)
                            timeDelayPay+=1.5;
                            //  this.InstantiateTextMoney(dyn_id, parseInt(chip), 0, player);
                            }
                            if (chip2 != null) {
                                this.setTimeout(()=>{
                                    
                                    this.listBoxCard[dyn_id].Box2.handleFinish(chip2);
                                }, timeDelayPay * 1000)
                                timeDelayPay+=1.5;
                            //  this.InstantiateTextMoney(dyn_id, parseInt(chip2), 1, player);
                            }
                        }
                       
                        break;
                        }
                        
                        
                }
                if(l==4){
                    cc.NGWlog('set dc gia tri L=======')
                    l = -1;
                } 
                if(l === 1) break;
            }

            
            this.setTimeout(() => {
                
                this.resetGamePlay();
            }, (timeDelayPay) * 1000);

        }, timeDelayOpenCard * 1000)


        cc.NGWlog('time delay la===== ' + timeDelayOpenCard);
        
    },
    finishGame(listPlayer){

    },
    openCardFinishGame(strdata){
        this.light.active = false;
        let data = JSON.parse(strdata);
        let CardsDealer = data.cardsCode;
        this.listCardCodeDealer = data.cardsCode;
        let litScore = data.score;
        this.listScoreDealer = data.score;
        let timeDelayOpenCard = 2.65;
        this.setTimeout(()=>{
            this.listBoxCard[5].isTurnPlayer(true);
             this.listBoxCard[5].boxPoint.position = cc.v2(80,124);
        }, 500)
        this.setTimeout(()=>{
            
            this.OpenCard(this.listCardSystem[1], CardsDealer[1] , 0.5);
            this.setTimeout(()=>{
                
                this.listBoxCard[5].node.active = true;
                if (litScore[1] == 21) litScore[1] = 999;
                this.listBoxCard[5].score = litScore[1];
                this.listBoxCard[5].showScore();
                this.setTimeout(()=>{
                    
                    if (this.listCardCodeDealer.length > 2) {
                        let timeDelay = 0;
                        for (let i = 2; i < this.listCardCodeDealer.length; i++) {
                            this.setTimeout(() => {
                                
                                this.ChiaCardDealer(this.listCardCodeDealer[i]);
                            }, timeDelay * 1000);
                            this.setTimeout(() => {
                                this.listBoxCard[5].score = this.listScoreDealer[i];
                                this.listBoxCard[5].showScore(this.listCardCodeDealer.length);
                                if(this.listScoreDealer[i] > 21){
                                    this.listBoxCard[5].initEffectcard(0);
                                   // this.listBoxCard[5].textBust.active = false;
                                    for(let j = 0 ; j < this.listCardSystem.length ; j++ ){
                                        this.listCardSystem[j].setDark(true);
                                    }
                                };
                                if(this.listScoreDealer[i] == 21){
                                    this.listBoxCard[5].initEffectcard(1);
                                }
                            }, (timeDelay + 0.65) * 1000);
                            if(i == this.listCardCodeDealer.length  - 1 ){
                                this.setTimeout(()=>{
                                    this.listBoxCard[5].isTurnPlayer(false);
                                }, (timeDelay + 2.5) * 1000);
                            }
                            timeDelay +=  1.65;
                        }
                    }else{
                        this.setTimeout(()=>{
                            this.listBoxCard[5].isTurnPlayer(false);
                          //  this.listBoxCard[5].node.runAction(cc.moveBy(0.3, cc.v2(0,70)));
                        }, 1500)
                        
                    }
                },1000)
            },150)
        }, 1000);
        return (timeDelayOpenCard   + (1.65 *  (this.listCardCodeDealer.length - 1)));
    },

    actionEndGamePlayer(player, money, hand = '0') {
        let indexDynamic = player._indexDynamic;
       
        let vectorCar;
        if (hand == '0') {
            vectorCar = player.vectorCard;
            this.listBoxCard[indexDynamic].initEffectcard(0);
        } else {
            vectorCar = player.vectorCardP2;
            this.listBoxCard[indexDynamic].Box2.initEffectcard(0);
        }
        let delayTime = 0;
        for (let i = 0; i < vectorCar.length; i++) {
            vectorCar[i].setDark(true);
            vectorCar[i].hideEffectCard();

        }
        this.setTimeout(() => {
            
            if (hand == 0) {
              //  this.InstantiateTextMoney(indexDynamic, money, 0, player);
              this.listBoxCard[indexDynamic].handleFinish(money);
            } else {
             //   this.InstantiateTextMoney(indexDynamic, money, 1, player);
             this.listBoxCard[indexDynamic].Box2.handleFinish(money);
            }
         //   nodeAni.destroy();
        }, 1200)
    },
    InsAniWinLose(){
        for(let i =0 ; i < this.players.length ; i++){
            let player = this.players[i];
            let dyn_id = player._indexDynamic;
            if(player.is_ready && this.listMoneyChange[dyn_id] != 0){
                let moneyChange = player.ag - this.listMoneyChange[dyn_id] ;
                let nodeAni = null;
                if(moneyChange < 0){
                    nodeAni = new cc.Node();
                    this.node.addChild(nodeAni,GAME_ZORDER.Z_BUTTON);
                    let cpSp = nodeAni.addComponent(cc.Sprite);
                    cpSp.spriteFrame = this.textLost;
                    nodeAni.position = this.listPosView[dyn_id];
                    nodeAni.opacity = 100;
                    nodeAni.scale = 1.6
                    nodeAni.runAction(cc.spawn(cc.fadeTo(0.5, 255).easing(cc.easeIn(2)) , cc.scaleTo(0.7, 1).easing(cc.easeIn(2))));
                    if(dyn_id == 0) require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_lose);
                }else if(moneyChange == 0){
                    nodeAni = this.InstantiatiAni(this.aniDraw , true , 'eng');
                    nodeAni.position = this.listPosView[dyn_id];
                }else{
                    if(dyn_id == 0) require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.winCoin);
                    nodeAni = this.InstantiatiAni(this.aniWin , false);
                    nodeAni.position = this.listPosView[dyn_id];
                }
                this.setTimeout(()=>{
                    nodeAni.destroy();
                },3000) 
                
            }
        }
    },
    InstantiatiAni(aniData , isLoop = false , ani = 'animation' ){
        let nodeAni = new cc.Node();
        this.node.addChild(nodeAni , GAME_ZORDER.Z_BUTTON);
        let cpCheckBai = nodeAni.addComponent(sp.Skeleton);
        cpCheckBai.skeletonData = aniData;
        cpCheckBai.premultipliedAlpha = false;
        cpCheckBai.setAnimation(0, ani, isLoop);
        return nodeAni;
    },
    handleIrFinish(strdata) {
        if(this.stateGame != 2)this.stateGame = 1;
        if (this.buttonPLay != null) this.buttonPLay.active = false;
        if(this.listCardSystem[1] != null){
            this.listBoxCard[5].initEffectcard(2);
            this.listCardSystem[1].node.active = false
        }
        let timeDelayOpenCard = 6.3;
        let data = JSON.parse(strdata);
        let listPlayer = data.results;
        let CardsDealer = data.dealersSecondCard.code;
        let timeDelayPay = 0;
        
        this.setTimeout(()=>{
            
            if(this.listCardSystem[1] != null)  this.listCardSystem[1].node.active = true;
            this.setTimeout(()=>{
                
                this.listBoxCard[5].isTurnPlayer(true);
                 this.listBoxCard[5].boxPoint.position = cc.v2(80,124);
            }, 500);
        },2000)

        this.setTimeout(()=>{
            
            this.OpenCard(this.listCardSystem[1], CardsDealer , 0.5);
            this.setTimeout(()=>{
                
                this.listBoxCard[5].score = 999;
                this.listBoxCard[5].showScore();
                this.setTimeout(()=>{
                    this.listBoxCard[5].isTurnPlayer(false);
                  //  this.listBoxCard[5].node.runAction(cc.moveBy(0.3, cc.v2(0,70)));
                }, 2500)
            }, 150)
        }, 3000)
        

        this.setTimeout(() => {
            
            let dataLength = listPlayer.length;
            for(let l = 4 ; l < 5 ; l++){
                for (let i = 0; i < dataLength; i++) {

                    let player = this.getPlayerWithId(listPlayer[i].pid);
                    let dyn_id = player._indexDynamic;
                    cc.NGWlog('gia tri l la=== ' + l)
                        if(dyn_id == l){
                        
                        let totalChip = parseInt(listPlayer[i].AG);
                        let moneyChange = totalChip - player.ag;
                        let chip = parseInt(listPlayer[i].betAG);
                        player._playerView.setupEffectChangeMoney(player.ag, player.ag += moneyChange);
                        if (player == this.thisPlayer) {
                            require('GameManager').getInstance().user.ag = totalChip;
                            if (Global.LobbyView !== null)
                                Global.LobbyView.updateChip();
                            if (Global.MainView !== null)
                                Global.MainView.updateChipAndSafe();
                            // var str = "";
                            // if (chip < 0) {
                            //     str = "Monica: " + require('GameManager').getInstance().getTextConfig('shan2_you_lost').replace("%lld", chip + "");
                            // }
                            // else if (chip > 0) {
                            //     str = "Monica: " + require('GameManager').getInstance().getTextConfig('shan2_you_win').replace("%lld", chip + "");
                            // }
                            // this.itemChatHistory.setDataChatCard(str, listPlayer[i].ArrCard);
                            // this.quickChat.addChatWithCard(str, listPlayer[i].ArrCard);
                        };

                            if(listPlayer[i].winInsurance){
                                this.setTimeout(()=>{
                                    
                                    this.listBoxCard[dyn_id].TraCuocBaoHiem();
                                    this.setTimeout(()=>{
                                        
                                        if(this.listBoxInsure[dyn_id].node != null && typeof this.listBoxInsure[dyn_id].node != 'undefined')this.listBoxInsure[dyn_id].node.destroy();
                                    },300)
                                }, timeDelayPay * 1000)
                                timeDelayPay+= 0.5;
                            }
                            this.setTimeout(()=>{
                                
                                this.listBoxCard[dyn_id].handleFinish(chip);
                            }, timeDelayPay * 1000)
                            timeDelayPay+=1.5;
                            //  this.InstantiateTextMoney(dyn_id, parseInt(chip), 0, player);
                            
                        break;
                        }
                        
                }
                if(l==4){
                    l = -1;
                } 
                if(l === 1) break;
            }

            
            this.setTimeout(() => {
                this.resetGamePlay();
            }, (timeDelayPay) * 1000);

        }, timeDelayOpenCard * 1000);

    },
    handleBuyInSurePlayer(strdata) {
        let data = JSON.parse(strdata);
        let id = data.pid;
        let player = this.getPlayerWithId(id);
        this.InstantiateBoxInsure(player._indexDynamic, data.chip, player);
    },
    InstantiateBoxInsure(dynamicId, money, player) {
        let item = cc.instantiate(this.nodeBoxInsureBetPf).getComponent('BoxInsure');
        item.node.position = cc.v2(this.listBoxInsurePos[dynamicId].x, this.listBoxInsurePos[dynamicId].y);
        this.node.addChild(item.node, GAME_ZORDER.Z_PLAYERVIEW);
        this.InstantiateTextFly(this.listPosView[dynamicId], -money, player)
        this.listBoxInsure[dynamicId] = item;
        item.setInfo(money);
    },
    InstantiateTextFly(pos, chip, player) {
        //player._playerView.setupEffectChangeMoney(player.ag, player.ag += chip);
        player._playerView.setupEffectChangeMoney(player.ag, player.ag+=chip);

        let nodeText = new cc.Node();
        let cpLbnode = nodeText.addComponent(cc.Label);
        cpLbnode.fontSize = 50;
        if (chip > 0) {
            cpLbnode.font = this.font[1];
            cpLbnode.string = '+' + GameManager.getInstance().formatMoney(parseInt(chip)) ;
        } else {
            cpLbnode.font = this.font[0];
            cc.log("tien thua la " + chip);
            cpLbnode.string = chip;
        }

        this.node.addChild(nodeText, GAME_ZORDER.Z_PLAYERVIEW);
        nodeText.position = pos;
        nodeText.runAction(cc.sequence(cc.moveBy(2, cc.v2(0, 60)).easing(cc.easeExponentialOut()), cc.removeSelf()));
    },

    HandleInsuranceResult(strdata) {
     //   this.listCardSystem[1].node.runAction(cc.sequence(cc.scaleTo(0.3,0.7).easing(cc.easeBackOut()), cc.delayTime(1.5), cc.scaleTo(0.3,0.5).easing(cc.easeBackOut())))
     if(this.listCardSystem[1] != null){
         this.listBoxCard[5].initEffectcard(2);
        this.listCardSystem[1].node.active = false
     }
      
     this.setTimeout(()=>{
            let data = JSON.parse(strdata);
            let listPLayer = data.results;
            for(let i  = 0 ;  i< listPLayer.length ; i++){
                let player = this.getPlayerWithId(listPLayer[i].pid);
                let indexDyna = player._indexDynamic;

                let item = new cc.Node();
                item.position = cc.v2(this.listBoxInsurePos[indexDyna].x - 20, this.listBoxInsurePos[indexDyna].y);
                let cpSp = item.addComponent(cc.Sprite);
                cpSp.spriteFrame = this.spChipInsurance;
                this.node.addChild(item, GAME_ZORDER.Z_BET);
                item.runAction(cc.sequence(cc.moveTo(0.4, cc.v2(0, 310)).easing(cc.easeBackIn()), cc.callFunc(()=>{
                    item.destroy();
                })));

                if(this.listBoxInsure[indexDyna].node != null && typeof this.listBoxInsure[indexDyna].node != 'undefined')this.listBoxInsure[indexDyna].node.destroy();
            }
           if(this.listCardSystem[1] != null)  this.listCardSystem[1].node.active = true;
            
        },2000)
        this.setTimeout(()=>{
            
            require("HandleGamePacket").NextEvt();
        },2900)
        
    },
    TimeAction(data) {
        this.lbWating.node.parent.active = false;
        let time = data.time;
        time -= (require('GameManager').getInstance().time_out_game * 1000);
        require('GameManager').getInstance().time_out_game = 0;
        this.nodeTime = cc.instantiate(this.nodeBetTimePf).getComponent('CountDownTime');
        this.nodeTime.setInfo(((time / 1000) - 1), 2);
        this.nodeTime.node.position = cc.v2(0, cc.winSize.height/2 + 100);
        this.node.addChild(this.nodeTime.node, GAME_ZORDER.Z_BUTTON);
        this.nodeTime.node.runAction(cc.sequence(cc.moveTo(0.6,cc.v2(0,100)).easing(cc.easeBackOut(1)),cc.delayTime((time / 1000) - 2), cc.moveTo(0.6,cc.v2(0,cc.winSize.height/2 + 100)).easing(cc.easeBackIn())  ))
        this.isRuningGame = true;
        if (!this.thisPlayer.is_ready) return;
        this.nodeBet.node.active = true;
        this.nodeChatMini.active = false;
        this.nodeBet._curMonney = this.thisPlayer.ag;
        this.nodeBet.resetLabel();
        this.nodeBet.checkListChip();
        let length = this.players.length;
        let dyid = 0;
        cc.NGWlog('length player 1', length);
        for (let i = 0; i < length; i++) {
            dyid = this.players[i]._indexDynamic;
            if (dyid !== 0) {
                this.listBoxCard[dyid].showWating(true);
            };
            this.listMoneyChange[dyid] = this.players[i].ag;
        }
        this.setTimeout(() => {
            this.nodeBet.onClean();
            this.nodeBet.node.active = false;
            this.nodeChatMini.active = true;
            cc.NGWlog('length player 2', this.players.length);
            for (let i = 0; i < this.players.length; i++) {
                let dyna = this.players[i]._indexDynamic
                this.listBoxCard[dyna].turnOfBorderBox();
                this.listBoxCard[dyna].showWating(false);
            }
        }, time)
    },

    BuyInsure(strdata) {
        if (this.thisPlayer.is_ready) {
            let data = JSON.parse(strdata);
            let time = parseInt(data.time) / 1000;
            let item = cc.instantiate(this.buyInsurePf);
            this.node.addChild(item, GAME_ZORDER.Z_CHAT);
            item.getComponent('PanelBaoHiem').setInfo(time, this.nodeBet._isLastBet, this.thisPlayer.ag);
        }
    },
    handleLc(strdata) {
        if(  this.nodeTime != null && this.nodeTime.node != null && typeof this.nodeTime.node != 'undefined'){
            this.nodeTime.node.destroy();
        }

        for (let i = 0; i < this.players.length; i++) {
                this.players[i].is_ready = false;
        }
        if(this.stateGame != 2) this.stateGame = 2;
        this.nodeBet.node.active = false;

        let data = JSON.parse(strdata);
        let cardDealer = data.dealersOpenCardCode;
        let listPlayer = data.playerCard;
        let length = listPlayer.length;
        let delayTime1 = 0;
        for (let m = 0; m < 2; m++) {
            for (let i = 0; i < length; i++) {
               // listPlayer[i].score = '11/21';
                let player = this.getPlayerWithId(listPlayer[i].pid);
                if (player == this.thisPlayer){
                    this.stateGame = 1;
                    this.isPassTurnMe = false;
                    if(listPlayer[i].score > 20  || listPlayer[i].score == '11/21') this.isBlackjack = true;
                }
                if (m == 0){
                    if(listPlayer[i].score > 20 || listPlayer[i].score == '11/21') listPlayer[i].score = 999;
                    this.listBoxCard[player._indexDynamic].score = listPlayer[i].score;
                    player.is_ready = true;
                } 
                let listCard = listPlayer[i].cardsCode;
                this.setTimeout(() => {
                    
                    cc.NGWlog('Chay may lan vao day');
                    this.ChiaCardPlayer(this.getIndexOfPlayer(player), listCard[m], '0');
                }, delayTime1 * 1000);
                delayTime1 += 0.4;
            }
            if (m == 1) {
                this.setTimeout(() => {
                    
                    this.ChiaCardDealer(0, false);
                }, delayTime1 * 1000);
            } else {
                this.setTimeout(() => {
                    
                    this.ChiaCardDealer(cardDealer, false);
                }, delayTime1 * 1000);
            }
            delayTime1 += 0.2;
        }

        this.setTimeout(()=>{
            
            if(this.isBlackjack){
                this.aniBlackJack.node.active = true;
              this.aniBlackJack.setAnimation(0, 'animation', false);
              this.aniBlackJack.node.zIndex = 999999999999;
              this.setTimeout(()=>{
                
                this.aniBlackJack.node.active = false;
                },2000)
            }
            for(let i = 0 ; i < this.players.length ; i++){
                let player = this.players[i]
                if(player.is_ready){
                    let dyn = player._indexDynamic;
                    if(this.listBoxCard[dyn].node != null || typeof this.listBoxCard[dyn].node != 'undefined'){
                        this.listBoxCard[dyn].showScore(2);
                    }
                }
            }
            require("HandleGamePacket").NextEvt();
        }, (delayTime1+ 0.5) * 1000 )
        
    },
    IndexFirtDealCard() {
        let lengthplayers = this.players.length
        if (lengthplayers < 3) {
            return this.getIndexOfPlayer(this.thisPlayer)
        } else if (lengthplayers < 5) {
            for (let i = 0; i < lengthplayers; i++) {
                let dyid = this.players[i]._indexDynamic;
                if (dyid == 4) return i;
            }
        } else {
            for (let i = 0; i < lengthplayers; i++) {
                let dyid = this.players[i]._indexDynamic;
                if (dyid == 3) return i;
            }
        }
    },
    handleTurnPlayer(strData) {
        let data = JSON.parse(strData);
        let hand = data.hand;
        let player = this.getPlayerWithId(data.pid);
        if (this.playerCurTurn != null) {
            this.playerCurTurn.setTurn(false);
            let indexTemp = this.playerCurTurn._indexDynamic;
            this.listBoxCard[indexTemp].acceptScore();
            if(this.listBoxCard[indexTemp].Box2 != null)
            this.listBoxCard[indexTemp].Box2.acceptScore();

            if(player != this.playerCurTurn)
            if(this.listBoxCard[indexTemp].Box2 != null)  this.listBoxCard[indexTemp].Box2.isTurnPlayer(false);
            this.listBoxCard[indexTemp].isTurnPlayer(false);
        }

        let indexP = this.getIndexOfPlayer(player);
        var indexDynamic = player._indexDynamic;
        if(data.blackjack == true ){
            let agChange = data.AG - player.ag;
            let agAdd = data.agAdd;
            this.setTimeout(()=>{
                this.InstantiateTextMoney(indexDynamic , agAdd ,null );
                player._playerView.setupEffectChangeMoney(player.ag, player.ag += agChange);
            },1000)
            this.listBoxCard[indexDynamic].handleFinish(agAdd);
            
            if (player === this.thisPlayer) this.isBlackjack = true;
        }
        this.playerCurTurn = player;
        var time = parseInt(data.time) / 1000;
        player.setTurn(true, time, true);
        if (hand == 1) {
            if (this.buttonPLay != null)
                this.buttonPLay.active = false;
                cc.NGWlog('active play false');
                if(player.vectorCardP2.length < 2)
                this.ChiaCardPlayer(indexP, this.isCardHan1, 1);
            this.setTimeout(() => {
                ;
                this.listBoxCard[indexDynamic].Box2.showScore();
           }, 650);
            let str = this.listBoxCard[indexDynamic].Box2.score.toString();
            if(str.split('/').length > 1){
                str = str.split('/')[1];
            }else{
                str = null;
            }
            if(this.listBoxCard[indexDynamic].Box2.score == 21 || (str != null && str =='21')){
                this.setTimeout(()=>{
                    
                    this.listBoxCard[indexDynamic].Box2.initEffectcard(1);
                }, 650)  
            }
        }

        if (!this.light.active) this.light.active = true;
        let infomation = this.listInfoLight[indexDynamic];
        this.light.position = infomation.pos;
        this.light.rotation = -infomation.rotate;

        if (player === this.thisPlayer) {
            this.isPassTurnMe = true;
            this.isBust = false;
            this.isStood = false;
            this.isDouble = false;

            if (this.buttonPLay == null) {
                this.buttonPLay = cc.instantiate(this.buttonPLayPf);
                this.buttonPLay.getComponent('NodeButtonBlackJack').gameView = this;
                this.node.addChild(this.buttonPLay, GAME_ZORDER.Z_BUTTON);
                this.buttonPLay.active = false;
            }
            if (hand == 0 && !this.isBlackjack){
                cc.NGWlog('Chay vao active ben Turn;')
                this.listBoxCard[0].isTurnPlayer(true);
                this.setTimeout(()=>{
                    
                    this.buttonPLay.active = true;
                },650)
                this.buttonPLay.getComponent('NodeButtonBlackJack').setInfo(this.nodeBet._isLastBet, this.thisPlayer.ag);
                this.buttonPLay.getComponent('NodeButtonBlackJack').setStatus(this.thisPlayer.vectorCard[0] ,this.thisPlayer.vectorCard[1]);
            } 

            if (this.togglePlay != null && hand == 0) {
                this.togglePlay.CheckToggleButton();
            }

            if(hand != 0){
                this.listBoxCard[0].Box2.isTurnPlayer(true);
                this.setTimeout(()=>{
                    
                    this.buttonPLay.active = true;
                    this.listBoxCard[0].Box2.boxPoint.position = cc.v2(80,194);
                },650)
                this.buttonPLay.getComponent('NodeButtonBlackJack').btnDouble.interactable = true;
            }
            this.setTimeout(()=>{
                
                require("HandleGamePacket").NextEvt();
            },650)
            
        } else {
            require("HandleGamePacket").NextEvt();
            if (this.buttonPLay != null){cc.NGWlog('active play false'); this.buttonPLay.active = false;}
            if (this.thisPlayer.is_ready && !this.isPassTurnMe && !this.isBlackjack) {
                
                if (this.togglePlay == null) {
                    this.togglePlay = cc.instantiate(this.togglePlayPf).getComponent('ToggleBlackjack');
                    this.node.addChild(this.togglePlay.node, GAME_ZORDER.Z_BUTTON);
                    this.togglePlay.node.active = false;
                    this.togglePlay.nodeBet = this ;
                }
                this.togglePlay.node.active = true;
                this.togglePlay.setInfo(this.thisPlayer.vectorCard[0] , this.thisPlayer.vectorCard[1],this.thisPlayer.ag ,this.nodeBet._isLastBet );

            }

        }
    },
    CheckToggleButton() {
      
    },
    handleBet(strdata) {
        let data = JSON.parse(strdata);
        let player = this.getPlayerWithId(data.pid);
        var indexDynamic = player._indexDynamic;
        this.listBoxCard[indexDynamic].showWating(false);
        let indexP = this.getIndexOfPlayer(player);
        var money = data.agBet - this.listInfoPlayerBet[indexP];
        this.InstantiateTextFly(this.listPosView[indexDynamic], -money, player);
        this.listInfoPlayerBet[indexP] = data.agBet;
        this.listBoxCard[indexDynamic].bet(data.agBet);
    },
   

    InstantiateBoxCard() {

        if(this.listBoxCard[5].node == null || typeof this.listBoxCard[5].node =='undefined'){
            let  item2 = cc.instantiate(this.boxCardPf).getComponent('BoxCard');
            this.node.addChild(item2.node, GAME_ZORDER.Z_BET);
            item2.node.position = this.listBoxCardPos[5];
            item2.background.active  = false;
            this.listBoxCard[5] = item2;
            item2.setInfo(5);
            item2.gameView = this;
          }

      for(let i = 0 ; i < 3 ; i++){
        let item ;
            if (i == 2) i=4;
            item = this.listBoxCard[i];
          if(item.node == null || typeof item.node == 'undefined')
          {
            item = cc.instantiate(this.boxCardPf).getComponent('BoxCard');
            this.node.addChild(item.node, GAME_ZORDER.Z_BET);
            item.node.position = this.listBoxCardPos[i];
            this.listBoxCard[i] = item;
            item.gameView = this;
            item.setInfo(i);
          }
          item.initPosPlayerView();
          
      } 
     
        
        
    },
    clickTest(){
      require('GameManager').getInstance().onReconnect();
    },
    resetGamePlay() {
        this.isRuningGame = false;
        this.setTimeout(()=>{
            this.ResetBoxCard();
            this.setTimeout(()=>{
                this.InsAniWinLose();
            }, 300)
            this.setTimeout(() => {
                
                this.isPassTurnMe = false;
                this.isDouble = false;
                this.isBust = false;
                this.isStood = false;
                this.isBlackjack = false;
                this.isSplit = false;
                var z = 0;
                this.playerCurTurn = null;
                this.listInfoPlayerBet = [0, 0, 0, 0, 0];
                this.listMoneyChange = [0,0,0,0,0];
                if(this.isUpdatePos){
                    this.updatePositionPlayerView();
                    this.initPlayerBoxCard();
                    this.isUpdatePos = false;
                }
                let length = this.listBoxInsure.length;
                for(z = 0 ; z < length ; z++){
                    let item = this.listBoxInsure[z];
                    if(item.node != null && typeof item.node != 'undefined') item.node.destroy();
                }
                this.listBoxInsure = [{}, {}, {}, {}, {}];
                this.clearAllCard();
                length = this.listCardSystem.length;
                for (let i = 0; i < length; i++) {
                    cc.NGWlog('chay vao xoa card dealer');
                    this.cardPool.put(this.listCardSystem[i].node)
                }
                this.listCardSystem.length = 0;
                this.stateGame = 0;
                require("HandleGamePacket").NextEvt();
                if(cc.sys.localStorage.getItem("isBack") == 'true') require('NetworkManager').getInstance().sendExitGame();
            }, 1000);
        },2000)
        
        for(let hi = 0 ; hi < 3 ; hi++){
            if(hi == 2) hi = 4;
            let item = this.listBoxCard[hi];
            cc.NGWlog('hi la-==== ' + hi);
            if( item.node != null && typeof item.node != 'undefined'){
                item.clearBet();
                if(item.Box2 != null) item.Box2.clearBet();
            }
        }
       // this.listBoxCard[5].unuse2();
    },
    InstantiateTextMoney(indexDyn, chip, hand = null , timeDestroy = 1) {
        // if(chip == 0)  return;
        let item = new cc.Node();
        let cpLb = item.addComponent(cc.Label);
        cpLb.horizontalAlign = 1;
        cpLb.verticalAlign = 1;
        cpLb.fontSize =  48;
        if (chip > 0) {
            cpLb.font = this.font[1];
            cpLb.string = '+' + GameManager.getInstance().formatMoney(chip);
        } else if (chip == 0) {
            cpLb.font = this.font[0];
            cpLb.fontSize = 45;
            cpLb.string = "PUSH"
        } else {
            cpLb.font = this.font[0];
            cpLb.string = chip;
        }

        this.node.addChild(item, GAME_ZORDER.Z_EMO);
        if (hand == null) {
            item.position = this.listPosView[indexDyn];
        } else {
            if (hand == 0) {
                item.position = this.listBoxCard[indexDyn].node.position;
            } else {
                item.position = this.listBoxCard[indexDyn].Box2.node.position;
            }
            item.y += 40;
        }
        item.runAction(cc.sequence(cc.moveBy(2, cc.v2(0, 60)).easing(cc.easeExponentialOut()),cc.delayTime(timeDestroy), cc.removeSelf()));

    },
    InstantiateActionPLayCard(indexDyn, hand, actionName) {
        cc.NGWlog('chay vao ham sinh ra action ' + actionName);
        let nodeImg = new cc.Node();
        let comonentSprite = nodeImg.addComponent(cc.Sprite);
        comonentSprite.spriteFrame = this.listSpriteActionPlayCard[actionName];
        this.node.addChild(nodeImg, GAME_ZORDER.Z_BET);
        nodeImg.rotation = -10;

        let v2
        if(actionName == 1){
            v2 = this.listPosView[indexDyn];
        }else{
            if (hand == 0) {
                v2= this.listBoxCard[indexDyn].node.position;
             } else {
                 v2= this.listBoxCard[indexDyn].Box2.node.position;
             }
        }
        
        nodeImg.position = v2;
        nodeImg.runAction(cc.sequence(cc.spawn(cc.moveBy(1 , cc.v2(0, 100)) , cc.repeat(cc.sequence(cc.rotateBy(0.25, 20) ,cc.rotateBy(0.25, -20)),2)),cc.removeSelf()));
    },

    handleActionPlayer(evt, strdata) {
        let data = JSON.parse(strdata);
        let hand = data.hand;
        let player = this.getPlayerWithId(data.pid)
        let index = this.getIndexOfPlayer(player);
        let indexDyn = player._indexDynamic;
        let isBusted = data.busted;
        let ag = data.agBet;
       // data.score = '11/21';
       if(player == this.thisPlayer) this.buttonPLay.active = false;
       let str = null;
        if(data.score){
             str = data.score.toString();
            if(str.split('/').length > 1){
                str = str.split('/')[1];
            }else{
                str = null;
            }
        }

        switch (evt) {
            case 'playerStood':
                if (player == this.thisPlayer){
                    this.isStood = true;
                    this.listBoxCard[0].isTurnPlayer(false);
                } 
                player.setTurn(false,0);
                this.InstantiateActionPLayCard(indexDyn, hand, 3);
                if(hand == 0){
                    this.listBoxCard[indexDyn].acceptScore();
                     str = this.listBoxCard[indexDyn].score.toString();
                    if(str.split('/').length > 1){
                        str = str.split('/')[1];
                        if(str == 21){
                            this.setEffectCard(player.vectorCard);
                        }
                    }

                }else{
                    this.listBoxCard[indexDyn].Box2.acceptScore();
                     str = this.listBoxCard[indexDyn].Box2.score.toString();
                    if(str.split('/').length > 1){
                        str = str.split('/')[1];
                        if(str == 21){
                            this.setEffectCard(player.vectorCardP2);
                        }
                    }
                }
                break;
            case 'playerHit':
                let dataCard = data.cardsCode;
                if (hand == 0) {
                    this.listBoxCard[indexDyn].score = data.score;
                    if(data.score == 21 || (str != null && str =='21') ){
                        this.setTimeout(()=>{
                            
                            this.setEffectCard(player.vectorCard);
                            this.listBoxCard[indexDyn].initEffectcard(1);
                        }, 650)  
                    }else{
                        this.setEffectCard(player.vectorCard , false);
                    }
                } else {
                    this.listBoxCard[indexDyn].Box2.score = data.score;
                    if(data.score == 21|| (str != null && str =='21')){
                        this.setTimeout(()=>{
                            
                            this.setEffectCard(player.vectorCardP2);
                            this.listBoxCard[indexDyn].Box2.initEffectcard(1);
                        }, 650) 
                    }else{
                        this.setEffectCard(player.vectorCardP2 , false);
                    }
                }
                this.InstantiateActionPLayCard(indexDyn, hand, 2);
                if (isBusted) {
                    if (player == this.thisPlayer) this.isBust = true;
                    this.setTimeout(() => {
                        
                        this.actionEndGamePlayer(player, -ag, hand);
                        this.setTimeout(()=>{
                            
                            require('HandleGamePacket').NextEvt();
                        },400)
                    }, 1100);
                }else{
                    if (player == this.thisPlayer){
                        cc.NGWlog('chay vao delay=========== hit');
                        this.setTimeout(()=>{
                            
                            require('HandleGamePacket').NextEvt();
                        },1000)
                    }else{
                        require('HandleGamePacket').NextEvt();
                    }
                   
                }
                this.ChiaCardPlayer(this.getIndexOfPlayer(player), dataCard, hand);
                if(this.thisPlayer == player) this.buttonPLay.getComponent('NodeButtonBlackJack').btnDouble.interactable = false;
                break;
            case 'playerDoubled':
                let dataCard2 = data.cardsCode;
                this.InstantiateTextFly(this.listPosView[indexDyn], -ag / 2, player);
                this.InstantiateActionPLayCard(indexDyn, hand, 0);
                if (hand == 0) {
                    this.listBoxCard[indexDyn].score = data.score;
                    if(data.score == 21|| (str != null && str =='21')){
                        this.setTimeout(()=>{
                            
                            this.setEffectCard(player.vectorCard);
                            this.listBoxCard[indexDyn].initEffectcard(1);
                        }, 650)  
                    }
                } else {
                    this.listBoxCard[indexDyn].Box2.score = data.score;
                    if(data.score == 21|| (str != null && str =='21')){
                        this.setTimeout(()=>{
                            
                            this.setEffectCard(player.vectorCardP2);
                            this.listBoxCard[indexDyn].Box2.initEffectcard(1);
                        }, 650) 
                    }
                }

                if (player == this.thisPlayer){
                    this.isDouble = true;
                    if (isBusted)this.isBust = true;
                }
                if (hand == 0) {
                    this.listBoxCard[indexDyn].score = data.score;
                    this.listBoxCard[indexDyn].doubleMonney();
                } else {
                    this.listBoxCard[indexDyn].Box2.score = data.score;
                    this.listBoxCard[indexDyn].Box2.doubleMonney();
                }
                this.ChiaCardPlayer(this.getIndexOfPlayer(player), dataCard2, hand)

                this.setTimeout(() => {
                    
                    if (isBusted) {
                        this.actionEndGamePlayer(player, -ag, hand);
                        this.setTimeout(()=>{
                            
                            require('HandleGamePacket').NextEvt();
                        },400)
                    }else{
                        require('HandleGamePacket').NextEvt();
                    }
                   
                }, 1100);

                
                break;
            case 'playerSplit':

                this.DoubleBoxCard(indexDyn);
                if (this.playerCurTurn != null) {
                    this.playerCurTurn.setTurn(false);
                }
                this.listBoxCard[indexDyn].node.opacity = 0;
                this.listBoxCard[indexDyn].Box2.node.opacity = 0;
                this.playerCurTurn = player;
                var time = parseInt(data.time) / 1000;
                player.setTurn(true, time);
                if(player == this.thisPlayer) this.isSplit = true;

                let str2 = data.firstHand.score.toString();
                    if(str2.split('/').length > 1){
                        str2 = str2.split('/')[1];
                    }else{
                        str2 = null;
                    }
                this.InstantiateTextFly(this.listPosView[indexDyn], -data.secondHand.chip, player);
                player.vectorCardP2.push(player.vectorCard.pop());
                this.InstantiateActionPLayCard(indexDyn, 0, 1);
                player.vectorCard[0].node.runAction(cc.moveTo(0.6,cc.v2(0,0)).easing(cc.easeCubicActionOut()))  // .position =
                this.changeParent(player.vectorCardP2[0].node, this.listBoxCard[indexDyn].Box2.parentCard);
                player.vectorCardP2[0].node.runAction(
                    cc.spawn(
                        cc.moveTo(0.6, cc.v2(0,0)).easing(cc.easeCubicActionOut()),
                        cc.rotateTo(0.6,0),
                    ),
                )
                this.listBoxCard[indexDyn].score = data.firstHand.score;
                this.listBoxCard[indexDyn].Box2.score = data.secondHand.score;
                this.isCardHan1 = data.secondHand.cardsCode[1];
                this.setTimeout(()=>{
                    
                    this.listBoxCard[indexDyn].node.runAction(cc.fadeIn(0.4));
                    this.listBoxCard[indexDyn].Box2.node.runAction(cc.fadeIn(0.4));
                    this.ChiaCardPlayer(index, data.firstHand.cardsCode[1], 0);
                    this.setTimeout(()=>{
                        
                        this.listBoxCard[indexDyn].showScore();
                    },650)
                    if(data.firstHand.score == 21  || (str2 != null && str2 == '21') ){
                        this.setTimeout(()=>{
                            
                            this.listBoxCard[indexDyn].initEffectcard(1);
                        }, 650)
                    }
                },600)
                
                break;
        }
    },
    setEffectCard(listCard , yesOrNo = true){
        if(yesOrNo){
            for(let i = 0 ; i< listCard.length ; i++){
                listCard[i].setEffectCard(999);
            }
        }else{
            for(let i = 0 ; i< listCard.length ; i++){
                listCard[i].hideEffectCard()
            }
        }
        
    },
    removePlayer(nameP) {
        let player = this.getPlayer(nameP);
        if (player !== null) {
            let index = this.players.indexOf(player);
            // let item = this.listBoxCard[player._indexDynamic];
            // item.node.destroy();
            // item.background.destroy()
            // if( item.Box2 != null){
            //     item.Box2.node.destroy();
            //     item.Box2.background.destroy();
            // }
            // this.listBoxCard[player._indexDynamic] = {};
            this.players.splice(index, 1);
            player.clearAllCard();
            this.playerViewPool.put(player._playerView.node);
            player = null;
            if (!this.isRuningGame) {
                this.updatePositionPlayerView();
            }else{
                this.isUpdatePos = true;
            }
        }

    },
    ChiaCardPlayer(indexP, cardCode = 0, hand = '0', isAction = true, isBlink = false) {
        let Vplayer;
        var cardTemp = this.getCard();
        
        this.node.addChild(cardTemp.node, GAME_ZORDER.Z_CARD);
        cardTemp.setTextureWithCode(0);
        cardTemp.node.rotation = -90;
        // cardTemp.node.rotation = 0;
        
        cardTemp.node.position = cc.v2(225, 409);
        let listVCardP = null;
        var player = this.players[indexP];
        var dynamicIndex = player._indexDynamic;
        let scale = 0.5
        let offsetY = 24;
        // if(dynamicIndex == 0){
        //     scale = 0.7;
        //     offsetY = 50;
        // }
        let boxCard = null;
        cardTemp.node.scale = 0.5;
        if (hand == '0') {
            listVCardP = player.vectorCard;
            boxCard = this.listBoxCard[dynamicIndex];
        } else {
            boxCard = this.listBoxCard[dynamicIndex].Box2;
            listVCardP = player.vectorCardP2;
        }

        if (boxCard.boxPoint !== null);
        boxCard.boxPoint.active = false
        let offset = 26 * scale * listVCardP.length - 1;
        Vplayer = cc.v2( offset,0 );
        this.changeParent(cardTemp.node,boxCard.parentCard);

        if (listVCardP.length > 0) cardTemp.node.zIndex = listVCardP[listVCardP.length - 1].node.zIndex + 1;
        
        var acSpawn = cc.spawn(
            cc.moveTo(0.8, Vplayer).easing(cc.easeCubicActionOut()),  
            cc.rotateTo(0.8,0).easing(cc.easeCubicActionOut()), 
            // cc.skewTo(0.3,0,0),
            // cc.sequence(cc.delayTime(0.1), 
            // cc.scaleTo(0.4,0.5)),
        ); 
        let dlTime = 0;
            if (listVCardP.length > 0) {
                for (let i = 0; i < listVCardP.length; i++) {
                    // this.setTimeout(()=>{
                        listVCardP[i].node.runAction(cc.moveBy(0.2 ,cc.v2(-26 * scale , 0)).easing(cc.easeCubicActionOut()))
                    // },dlTime * 650 + 300 )
                    // dlTime += 0.1;
                }
            }
        listVCardP.push(cardTemp);
        if (!isBlink) {
            require('SoundManager1').instance.dynamicallyPlayMusic('sounds/click');
            if (cardCode != 0) {
                if (isAction) {
                    cardTemp.node.runAction(
                        cc.spawn(
                            acSpawn, 
                            // cc.sequence( 
                            //     cc.delayTime(0.2), 
                                cc.callFunc(() => { 
                                    this.OpenCard(cardTemp, cardCode ,scale ) 
                                })
                            // )
                        )
                    );
                    cc.NGWlog('trang thai acti button la ' + this.isBust , + ' '+ this.isStood +  ' ' + this.isDouble +' ' + this.isBlackjack);
                    if (player == this.thisPlayer && !this.isBust && !this.isStood && !this.isDouble && !this.isBlackjack ) {
                        this.setTimeout(()=>{
                            if(listVCardP.length < 3 && !this.isSplit ) return;
                            this.buttonPLay.active = true;
                        this.buttonPLay.getComponent('NodeButtonBlackJack').btnSplit.interactable = false;
                        }, 650 );
                    }
                } else {
                    cardTemp.node.runAction(cc.sequence(acSpawn, cc.callFunc(() => {
                        cardTemp.setTextureWithCode(cardCode);
                        cardTemp.node.scale = scale;
                    })));
                }
                this.setTimeout(() => {
                    
                    if (listVCardP.length > 2) {
                        boxCard.showScore(listVCardP.length);
                    }
                }, 650)
            } else {
                cardTemp.node.runAction(acSpawn);
            }
        } else {
            cardTemp.setTextureWithCode(cardCode);
            cardTemp.node.position = Vplayer;
            cardTemp.node.scale = scale;
            cardTemp.node.rotation = 0;
            cardTemp.node.skewX = 0;
        }

    },
    ChiaCardDealer(cardCode = 0, isAction = true, isBlink = false) {
        let cardTemp;
        cardTemp = this.getCard();
        this.node.addChild(cardTemp.node, GAME_ZORDER.Z_CARD);
        cardTemp.setTextureWithCode(0);
        cardTemp.node.scale = 0.5;
        cardTemp.node.position = cc.v2(225, 409);
        cardTemp.node.rotation = -90;
        let boxCard = this.listBoxCard[5];
        this.changeParent(cardTemp.node,boxCard.parentCard );
        if (this.listCardSystem.length > 0) cardTemp.node.zIndex = this.listCardSystem[this.listCardSystem.length - 1].node.zIndex + 1;
        if (this.listCardSystem.length > 0) {
            let dlTime = 0;
                for (let i = 0; i < this.listCardSystem.length; i++) {
                    // this.setTimeout(()=>{
                        
                        this.listCardSystem[i].node.runAction(cc.moveBy(0.2, cc.v2( - 0.5 * 26 , 0 )).easing(cc.easeCubicActionOut()))
                    // },(dlTime*650 + 300))
                    // dlTime += 0.1;
                }
        }
        boxCard.boxPoint.active = false;
        let offset = 0.5 * 26 * this.listCardSystem.length - 1;
        let Vplayer = cc.v2(offset, 0);
        // let bezier = this.listDefineBezer[5].slice();
        // bezier.push(Vplayer);
        // var acSpawn = cc.spawn(cc.bezierTo(0.5, bezier).easing(cc.easeInOut(2)), cc.skewTo(0.3,0,0));
        var acSpawn =cc.spawn(
            cc.moveTo(0.8, Vplayer).easing(cc.easeCubicActionOut()),  
            cc.rotateTo(0.4,0), 
            // cc.skewTo(0.3,0,0),
            // cc.sequence(
            //     cc.delayTime(0.1),
            //     cc.scaleTo(0.4,0.5)
            // )
        );
        this.listCardSystem.push(cardTemp);
        if (!isBlink) {
            require('SoundManager1').instance.dynamicallyPlayMusic('sounds/click');
            if (cardCode != 0) {
                if (isAction) {
                    cardTemp.node.runAction(
                        cc.spawn(
                            acSpawn, 
                            // cc.sequence(
                            //     cc.delayTime(0.1),
                                cc.callFunc(() => { 
                                    this.OpenCard(cardTemp, cardCode , 0.5) 
                                })
                            // )
                        )
                    );
                } else {
                    cardTemp.node.runAction(
                        cc.spawn(
                            acSpawn, 
                            cc.callFunc(() => { 
                                this.OpenCard(cardTemp, cardCode , 0.5);
                                cardTemp.node.scale = 0.5;
                            })
                            // cc.callFunc(() => {
                            //     cardTemp.setTextureWithCode(cardCode);
                            //     cardTemp.node.scale = 0.5;
                            // })
                        )
                    )
                    
                }
            } else {
                cardTemp.node.runAction(cc.sequence(acSpawn,cc.callFunc(()=>{
                    cardTemp.node.scale = 0.5; 
                }))  );
            }
        } else {
            cardTemp.node.scale = 0.5;
            cardTemp.setTextureWithCode(cardCode);
            cardTemp.node.position = Vplayer;
            cardTemp.node.skewX = 0;
            cardTemp.node.rotation = 0;
        }
    },
    OpenCard(card,cardCode,scale) {
        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/cardPlipBlackJack');
        card.node.runAction(
            cc.sequence(
                cc.scaleTo(0.2, (scale + 0.1)).easing(cc.easeCubicActionOut()), 
                cc.spawn(
                    cc.skewTo(0.15, 0, -15), 
                    cc.scaleTo(0.15, 0.01,scale),
                ), 
                cc.callFunc(() => {
                    card.setTextureWithCode(cardCode);
                    card.node.skewY = 15;
                }),
                cc.spawn(
                    cc.skewTo(0.15,0,0), 
                    cc.scaleTo(0.15,scale),
                ), 
                cc.scaleTo(0.2, scale).easing(cc.easeCubicActionIn()),
            )
        );
    },

    getDynamicIndex(index) {
        if (index == 0) return 0;
        var _index = index;
        if (this.players.length <= 2) {
            _index += 3;
        } else if (this.players.length <= 3) {
            if (index >= 2)
                _index += 2
        } else if (this.players.length <= 4) {
            if (index >= 2)
                _index += 1;
        }
        return _index;
    },
    cleanGame() {
        this._super();
    },
    getPostionInOtherNode(spaceNode, targetNode) {
        if (targetNode.parent == null) {
            return null;
        }
        let pos = targetNode.parent.convertToWorldSpaceAR(targetNode.getPosition());
        return spaceNode.convertToNodeSpaceAR(pos);
    },
    changeParent(node, newParent) {
        if(node.parent == newParent) return;
        var getWorldRotation = function (node) {
          var currNode = node;
          var resultRot = currNode.rotation;
          do {
            currNode = currNode.parent;
            resultRot += currNode.rotation;
          } while(currNode.parent != null);
          resultRot = resultRot % 360;
          return resultRot;
        };
    
        var oldWorRot = getWorldRotation(node);
        var newParentWorRot = getWorldRotation(newParent);
        var newLocRot = oldWorRot - newParentWorRot;
    
            var oldWorPos = node.convertToWorldSpaceAR(cc.p(0,0));
        var newLocPos = newParent.convertToNodeSpaceAR(oldWorPos);
    
            node.parent = newParent;
            node.position = newLocPos;
        node.rotation = newLocRot;
        },
        initPlayerBoxCard(){
            for (let i = 0; i < this.players.length; i++) {
                let item = this.listBoxCard[this.players[i]._indexDynamic];
                if(item.node != null){
                    item.initPosPlayerView();
                }
              //this.listBoxCard[this.players[i]._indexDynamic].();
            }
        }

    // update (dt) {},
});