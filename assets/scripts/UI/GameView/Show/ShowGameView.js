var GameManager = require('GameManager')
var Player = require('Player')
var ShowGameView = cc.Class({
    extends: require('GameView2'),

    properties: {
        anim_start: {
            default: null,
            type: sp.Skeleton
        },
        spriteFrameMask: {
            default: null,
            type: cc.SpriteFrame
        },
        NodeBetPf: cc.Prefab,
        chipEffect: {
            default: null,
            type: cc.Node
        },
        Pot: {
            default: null,
            type: require('PotShow')
        },
        textChipReturn: {
            default: null,
            type: cc.Node
        },
        font: {
            default: [],
            type: [cc.Font] //thua 2 /thang
        },
        DealerInGame: {
            default: null,
            type: require('DealerInGameView')
        },
        lbChangeCard: {
            default: null,
            type: cc.Node
        },
        textToggleFold: {
            default: null,
            type: cc.Label
        },
        textToggleCall: {
            default: null,
            type: cc.Label
        },
        textToggleCallAny: {
            default: null,
            type: cc.Label
        },
        buttonCheckTogglePf: cc.Prefab,
        chip_Tip: {
            default: null,
            type: cc.Node
        },
        NodeCountDownPf: cc.Prefab,
        BoxBetPf: cc.Prefab,
        listImgWinlose: [cc.SpriteFrame],
        potValue: 0,
        preNextStack: 0,
        indexTest: 0,
        indexHostPlayer: 0,
        is_show_join: false,
        preChipForCall: 0,
        isTurn: 2,
        countTurn: 0,
        isCheckAddWinListCard: false,
        pnameBm: '',
        isAllIn: false,
        chipReturnPf: cc.Prefab,
        aniWin: sp.SkeletonData,
        bg_arrow_swap: cc.Sprite,

        myChipCur: 0,
        myChipStack: 0

    },

    // LIFE-CYCLE CALLBACKS:
    //[{-147,-161} , {-511,-49}, {-494,162}, {494,162}, {511 ,-49}]
    onLoad() {
        this._super();
        this.node.setContentSize(cc.winSize);
        this.NodeBet = null;
        this.NodeChangeTime = null;
        this.listPosCard = [{ x: -32, y: -167 }, { x: -404, y: -49 }, { x: -387, y: 168 }, { x: 390, y: 168 }, { x: 423, y: -60 }];
        this.listPosBoxBet = [{ x: 10, y: -85 }, { x: -355, y: -123 }, { x: -355, y: 90 }, { x: 372, y: 90 }, { x: 372, y: -123 }];
        this.listBoxBet = [{}, {}, {}, {}, {}];
        this.buttonCheckToggle = null;
        this.BoxBetPool = new cc.NodePool('BoxBetShow');
        this.chipTipPool = new cc.NodePool();
        this.chipEffectPool = new cc.NodePool();
        this.nodeTimeToStart = null;
        this.playercards = [[], [], [], [], []];
        this.buttonCheckToggle = cc.instantiate(this.buttonCheckTogglePf).getComponent('ToggleCheckShow');
        this.node.addChild(this.buttonCheckToggle.node, GAME_ZORDER.Z_BUTTON);
        this.buttonCheckToggle.node.active = false;
    },

    start() {

    },

    handleSTable(strData) {
        this._super(strData);
        this.thisPlayer.is_ready = true;

        var data = JSON.parse(strData);
        var listPlayer = data.ArrP;
        for (var i = 0; i < listPlayer.length; i++) {
            if (data.N == require('GameManager').getInstance().user.uname) {
                this.myChipCur = data.AG;
                this.myChipStack = data.chipStack;
            }
        }
    },
    handleLTable(data) {
        this._super(data);
    },
    handleJTable(strData) {
        this._super(strData);
    },
    setGameInfo(m, id) {
        this._super(m, id)
    },
    handleTimeToStart(strData) {

        this.stateGame = STATE_GAME.WAITING;
        this.isTurn = 2;
        this.isAllIn = false
        this.countTurn = 0;
        let temp = strData.timeAction / 1000 - 1
        this.nodeTimeToStart = cc.instantiate(this.NodeCountDownPf).getComponent('CountDownTime');
        this.nodeTimeToStart.setInfo(parseInt(temp), 1);
        this.node.addChild(this.nodeTimeToStart.node, GAME_ZORDER.Z_CARD);
        this.checkCardAndPut();
        // setTimeout(() => {
        //     if (this.node == null || typeof this.node == 'undefined') return;
        //     this.anim_start.node.active = true;
        //     this.anim_start.setAnimation(0, "animation", false);
        // }, 5000);

        // setTimeout(() => {
        //     if (this.node == null || typeof this.node == 'undefined') return;
        //     this.anim_start.node.active = false;
        //     require('HandleGamePacket').NextEvt();
        // }, 7000)
    },

    checkCardAndPut() {
        for (let i = 0; i < 5; i++) {
            let len = this.playercards[i].length;
            for (let j = 0; j < len; j++) {
                let card = this.playercards[i].pop();
                this.cardPool.put(card)
            }
        }
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].vectorCardP1 = [];
        }
    },

    removePlayer(nameP, isInGame = false) {
        this._super(nameP, isInGame);
    },
    handleCTable(strData) {
        this._super(strData);
    },
    dealCard() {
        this.stateGame = STATE_GAME.PLAYING;
    },
    handleShow_card(data) {
        let indexP = this.getIndexOfPlayer(this.getPlayer(data.userName));
        this.dealCardPlayer(indexP, 0, true, 0);
        this.dealCardPlayer(indexP, 0.31, true, parseInt(data.idCard));
    },

    calculateDealingDelay() {

    },

    dealCardPlayer(index, delay, isAction = true, cardCode = 0) {
        let player = this.players[index]
        let indexDYnamic = player._indexDynamic;
        let vTemp = this.listPosCard[indexDYnamic];
        let isLeftTable = vTemp.x > 0 ? false : true
        let vTarget;
        var cardTemp = this.getCard();
        cardTemp.setTextureWithCode(0);
        cardTemp.node.setPosition(-3, 175);
        cardTemp.node.scale = 0.45;
        cardTemp.node.rotation = 0;
        this.playercards[indexDYnamic].push(cardTemp.node);
        if (!isLeftTable) {

            this.node.addChild(cardTemp.node, 30);
        } else {

            this.node.addChild(cardTemp.node);
        }


        if (isLeftTable) {
            vTarget = cc.v2(vTemp.x + ((cardTemp.node.getContentSize().width / 2 * 0.4) * player.vectorCardP1.length), vTemp.y);
            if (player.vectorCardP1.length > 0) {
                cardTemp.node.zIndex = player.vectorCardP1[player.vectorCardP1.length - 1].node.zIndex + 1;
            }
        } else {
            vTarget = cc.v2(vTemp.x - ((cardTemp.node.getContentSize().width / 2 * 0.4) * player.vectorCardP1.length), vTemp.y);
            if (player.vectorCardP1.length > 0) {
                cardTemp.node.zIndex = player.vectorCardP1[player.vectorCardP1.length - 1].node.zIndex - 1;
            }
        }
        if (isAction) {
            if (cardCode != 0) {
                require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_cardFlipBJ);
                cardTemp.setTextureWithCode(cardCode);
            }
            cardTemp.node.rotation = -90;
            cardTemp.node.skewY = 15;
            cardTemp.node.scaleX = 0;
            // cardTemp.node.runAction(cc.sequence(cc.delayTime(delay),cc.moveTo(2,vTarget).easing(cc.easeCubicActionOut())));
            // cardTemp.node.runAction(cc.sequence(cc.delayTime(delay),cc.rotateTo(2,0).easing(cc.easeCubicActionOut())));
            // cardTemp.node.runAction(cc.sequence(
            //     cc.delayTime(delay),
            //     cc.scaleTo(1,0.01,0.45),
            //     cc.scaleTo(1,0.45)
            // ));
            // cardTemp.node.runAction(cc.sequence(
            //     cc.delayTime(delay),
            //     cc.skewTo(1,0,-10),
            //     cc.skewTo(1,0,0),
            // ));
            let effect = cc.spawn(
                cc.moveTo(0.7, vTarget).easing(cc.easeCubicActionOut()),
                cc.rotateTo(0.6, 0).easing(cc.easeCubicActionOut()),
                cc.skewTo(0.6, 0, 0).easing(cc.easeCubicActionOut()),
                cc.scaleTo(0.6, 0.45).easing(cc.easeCubicActionOut()),
            );
            cardTemp.node.runAction(cc.sequence(cc.delayTime(indexDYnamic * 0.1 + delay), effect));
        } else {
            cardTemp.setTextureWithCode(cardCode);
            cardTemp.node.position = vTarget;
        }
        player.vectorCardP1.push(cardTemp);

    },



    handleLc(data) {
        this.sendTrackingGame();
        let indexP = this.getIndexOfPlayer(this.thisPlayer);
        let arrCard = [];
        arrCard = data.arr;
        this.dealCardPlayer(indexP, 0, true, arrCard[0]);
        this.dealCardPlayer(indexP, 0.5, true, arrCard[1]);
        this.thisPlayer.vectorCardP1[0].setDark(true, this.spriteFrameMask);
        // this.scheduleOnce(() => { this.thisPlayer.vectorCardP1[0].setDark(true, this.spriteFrameMask); }, 0.3);
        if (this.nodeTimeToStart != null && this.nodeTimeToStart.node != null) {
            this.nodeTimeToStart.node.destroy();
            this.nodeTimeToStart = null;
        }
    },

    handleVTable(strData) {
        this._super(strData);
        this.thisPlayer.is_ready = false;
        var data = JSON.parse(strData);
        var listPlayer = data.ArrP;
        this.viewIng(listPlayer, data);

    },
    handleRJTable(strData) {
        this._super(strData);
        var data = JSON.parse(strData);
        var listPlayer = data.ArrP;
        this.viewIng(listPlayer, data);

        for (var i = 0; i < listPlayer.length; i++) {
            if (data.N == require('GameManager').getInstance().user.uname) {
                this.myChipCur = data.AG;
                this.myChipStack = data.chipStack;
            }
        }
    },
    handleBm(data) {
        this.pnameBm = data.userName;
    },
    viewIng(listPlayer, data) {
        this.Pot.setValue(data.pot);
        for (let i = 0; i < listPlayer.length; i++) {
            let player = this.getPlayer(listPlayer[i].N);
            let indexP = this.getIndexOfPlayer(player);
            let dynaIndex = player._indexDynamic;
            if (player.is_ready) {
                if (listPlayer[i].playerStatus === 'Fold') {
                    for (let t = 0; t < listPlayer[i].Arr.length; t++) {
                        this.dealCardPlayer(indexP, 0, false, 0);
                    }
                    this.FoldPlayer(player);
                    player._playerView.setDark(true);
                    this.InstantiateBoxBet(dynaIndex, 0, 'Fold');
                } else {

                    for (let t = 0; t < listPlayer[i].Arr.length; t++) {
                        this.dealCardPlayer(indexP, 0, false, listPlayer[i].Arr[t]);
                    }
                    this.isTurn = this.isTurn < listPlayer[i].Arr.length ? listPlayer[i].Arr.length : this.isTurn;
                }
            }
        }
    },
    handleCab(data) {
        /*
        {"evt":"cab","pid":1632648,"userName":"tuyen12345","chipBet":10,"totalChipBet":10,
        "chipStack":706,"pot":15,"status":"Call","timeAction":10000,
        "nextId":1634645,"nextName":"ductm95","nextStack":1995,"chipForCall":10}
        */

        // if (typeof data.nextName == 'undefined') {
        //     setTimeout(() => {
        //         if (this.node == null || typeof this.node == 'undefined') return;
        //         require('HandleGamePacket').NextEvt();
        //     }, 500);
        // } else {
        //     require('HandleGamePacket').NextEvt();
        // }

        if (data.userName === require('GameManager').getInstance().user.uname) {
            require('GameManager').getInstance().user.ag = this.myChipCur - this.myChipStack + data.chipStack;
        }

        if (this.NodeChangeTime != null && this.NodeChangeTime.node != null) {
            this.NodeChangeTime.node.destroy();
            this.NodeChangeTime = null;
        }

        this.setCurentTurn(data);
        if (!this.thisPlayer.is_ready || this.thisPlayer.isFold || this.isAllIn) {
            cc.NGWlog('chay vao ham tat toogle Check')
            this.buttonCheckToggle.node.active = false;
        } else {
            let valueToggleCheck = this.listBoxBet[0].chip;
            valueToggleCheck = valueToggleCheck || 0;
            this.buttonCheckToggle.setInfo(data.chipForCall, valueToggleCheck, this.thisPlayer.ag);
            this.buttonCheckToggle.node.active = true;
            this.lbChangeCard.active = false;
            this.bg_arrow_swap.node.active = false;
        }
        this.setNextTurn(data);
        this.preNextStack = data.nextStack;
        this.countTurn++;
        this.preChipForCall = data.chipForCall;
    },

    InstantiateBoxBet(indexDynamic, chip, status) {
        let item = this.listBoxBet[indexDynamic];
        if (item.node == null || typeof item.node == 'undefined') {
            if (this.BoxBetPool.size() < 1) {
                item = cc.instantiate(this.BoxBetPf).getComponent('BoxBetShow');
            } else {
                item = this.BoxBetPool.get().getComponent('BoxBetShow');
            }
            this.node.addChild(item.node, GAME_ZORDER.Z_CARD);
            this.listBoxBet[indexDynamic] = item;
            item.node.position = cc.v2(this.listPosBoxBet[indexDynamic].x, this.listPosBoxBet[indexDynamic].y);
        }
        if (indexDynamic == 0 && status == 'Allin') this.isAllIn = true;
        item.setInfo(chip, status);
    },
    setNextTurn(data) {
        let namePlayer = data.nextName
        if (typeof (namePlayer) == 'undefined') {
            this.potValue = data.pot;
            this.resetNewTurn();
            return;
        }
        let player = this.getPlayer(namePlayer)
        let indexDynamic = player._indexDynamic;

        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i]._playerView != null) {
                this.players[i]._playerView.setTurn(false, 0)
            }
        }

        player._playerView.setTurn(true, data.timeAction / 1000)
        if (player === this.thisPlayer) {
            if (!this.buttonCheckToggle.readInfoToggle()) {
                if (this.NodeBet == null) {
                    this.NodeBet = cc.instantiate(this.NodeBetPf).getComponent('ShowNodeBet');
                    this.node.addChild(this.NodeBet.node, GAME_ZORDER.Z_BUTTON);
                }
                this.NodeBet.node.active = true;
                this.lbChangeCard.active = false;
                this.bg_arrow_swap.node.active = false;
                this.NodeBet.AutoBetIfClickRaise(data.timeAction / 1000);
                if (this.buttonCheckToggle != null) this.buttonCheckToggle.node.active = false;
                let valueBoxBex = this.listBoxBet[0].chip;
                if (valueBoxBex == null || typeof valueBoxBex == 'undefined') valueBoxBex = 0;
                if (this.countTurn == 1) {
                    if (data.chipForCall != 0) {
                        this.NodeBet.setInfoBtn('Fold', 'Call', 'Bet', data.chipForCall - valueBoxBex);
                        this.NodeBet.setValueInfo(data.nextStack - data.chipForCall, this.agTable, data.pot)
                    } else {
                        this.NodeBet.setInfoBtn('Fold', 'Check', 'Bet', data.chipForCall - valueBoxBex);
                        this.NodeBet.setValueInfo(data.nextStack - data.chipForCall, this.agTable, data.pot)
                    }
                } else {
                    if (data.chipForCall != 0) {
                        this.NodeBet.setInfoBtn('Fold', 'Call', 'Raise', data.chipForCall - valueBoxBex);
                        this.NodeBet.setValueInfo(data.nextStack - data.chipForCall, this.agTable, data.pot)
                    } else {
                        this.NodeBet.setInfoBtn('Fold', 'Check', 'Raise', data.chipForCall - valueBoxBex);
                        this.NodeBet.setValueInfo(data.nextStack - data.chipForCall, this.agTable, data.pot)
                    }
                }
            }
        } else {
            if (this.NodeBet == null) return;
            this.NodeBet.SetFalseIsCountDown();
            this.NodeBet.node.active = false;
        }
    },
    setCurentTurn(data) {
        if (data.status == '') {
            return;
        }
        if (this.pnameBm !== '') {
            let player = this.getPlayer(this.pnameBm);
            this.InstantiateBoxBet(player._indexDynamic, this.agTable / 2, '');
            player._playerView.effectFlyMoney(-this.agTable / 2);
            this.EffectMoneyChange(-this.agTable / 2, player.ag, player._playerView.lbAg);
            player.ag -= this.agTable / 2;
            if (player == this.thisPlayer) {
                GameManager.getInstance().user.ag -= this.agTable / 2;
            }
            this.pnameBm = ''

            if (this.NodeBet == null) {
                this.NodeBet = cc.instantiate(this.NodeBetPf).getComponent('ShowNodeBet');
                this.node.addChild(this.NodeBet.node, GAME_ZORDER.Z_BUTTON);
                this.NodeBet.update_slider(player.ag);
            }
        }

        let namePlayer = data.userName
        let player = this.getPlayer(namePlayer);
        let indexDynamic = player._indexDynamic;
        player._playerView.setTurn(false, 0);
        this.InstantiateBoxBet(indexDynamic, data.chipBet, data.status);
        if (data.status == 'Fold') this.FoldPlayer(player, indexDynamic);
        let valueBoxBex = this.listBoxBet[indexDynamic].chip;
        if (data.chipStack - this.preNextStack != 0) player._playerView.effectFlyMoney(-valueBoxBex);
        let numberChip = 0;
        if (valueBoxBex <= 0) { } else if (valueBoxBex <= this.agTable) {
            numberChip = 1;
        } else if (valueBoxBex <= 2 * this.agTable) {
            numberChip = 2;
        } else if (valueBoxBex <= 3 * this.agTable) {
            numberChip = 3;
        } else {
            numberChip = 4;
        }
        let target = this.listPosBoxBet[indexDynamic] // this.listPosView[indexDynamic].getChildByName("box_bet_bg").position;
        let vPos = this.listPosView[indexDynamic];
        for (let i = 0; i < numberChip; i++) {
            let vTemp = cc.v2(target.x, target.y);
            if (this.chipEffectPool.size() < 1) this.chipEffectPool.put(cc.instantiate(this.chipEffect));
            let temp = this.chipEffectPool.get();
            temp.setPosition(vPos);
            this.node.addChild(temp, GAME_ZORDER.Z_BUTTON);
            let tempAc1 = cc.fadeOut(0.8).easing(cc.easeIn(6))
            let tempAc2 = cc.moveTo(0.5, vTemp).easing(cc.easeOut(3));
            let temoAc3 = cc.spawn(tempAc1, tempAc2);
            temp.runAction(cc.sequence(cc.delayTime(i * 0.1), temoAc3, cc.callFunc(() => { this.chipEffectPool.put(temp) })));
        }
        if (player == this.thisPlayer) {
            GameManager.getInstance().user.ag += (data.chipStack - this.preNextStack);
        }
        this.EffectMoneyChange(data.chipStack - this.preNextStack, this.preNextStack, player._playerView.lbAg);
        player.ag = data.chipStack;
    },
    getDynamicIndexPlayerWithName(name) {
        return this.getPlayer(name)._indexDynamic;
    },
    cleanGame() {
        this._super();
    },
    FoldPlayer(player, index) {
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_fold);
        player.isFold = true;
        player._playerView.setDark(true);
        for (let i = 0; i < player.vectorCardP1.length; i++) {
            // player.vectorCardP1[i].setTextureWithCode(0);
            // player.vectorCardP1[i].setDark(true, this.spriteFrameMask);
            this.FoldDown(index, player.vectorCardP1[i].node, i * 0.1);
        }
    },

    FoldDown(index, card, delay) {
        let sk1 = 0;
        let sk2 = 0;
        if (index <= 2) {
            sk1 = -15;
            sk2 = 15;
        } else {
            sk1 = 15;
            sk2 = -15;
        }

        card.runAction(cc.sequence(
            cc.delayTime(delay),
            cc.scaleTo(0.15, 0, 0.55).easing(cc.easeCubicActionOut()),
            cc.callFunc(() => {
                card.getComponent('Card').setTextureWithCode(0)
                card.getComponent('Card').setDark(true, this.spriteFrameMask);
            }),
            cc.scaleTo(0.15, 0.45).easing(cc.easeCubicActionOut()),
        ));

        card.runAction(cc.sequence(
            cc.delayTime(delay),
            cc.skewTo(0.15, 0, sk1).easing(cc.easeCubicActionOut()),
            cc.callFunc(() => { card.skewY = sk2 }),
            cc.skewTo(0.15, 0, 0).easing(cc.easeCubicActionOut()),
        ));
    },

    foldUp(index, card, code) {
        let sk1 = 0;
        let sk2 = 0;
        if (index <= 2) {
            sk1 = -15;
            sk2 = 15;
        } else {
            sk1 = 15;
            sk2 = -15;
        }

        card.runAction(cc.sequence(
            // cc.delayTime(delay),
            cc.scaleTo(0.2, 0, 0.65),
            cc.callFunc(() => {
                card.getComponent('Card').setTextureWithCode(code)
            }),
            cc.scaleTo(0.2, 0.45).easing(cc.easeCubicActionOut()),
        ));

        card.runAction(cc.sequence(
            // cc.delayTime(delay),
            cc.skewTo(0.2, 0, sk1),
            cc.callFunc(() => { card.skewY = sk2 }),
            cc.skewTo(0.2, 0, 0).easing(cc.easeCubicActionOut()),
        ));
    },

    handleBc(data) {
        let player = this.getPlayer(data.N);
        let index = this.getIndexOfPlayer(player);
        let localPlayer = this.players[index]
        let indexDYnamic = localPlayer._indexDynamic;
        // if (this.isTurn == 4) {         // xet off;
        //     this.isCheckOffChangeTime++;
        //     if (this.isCheckOffChangeTime >= this.checkNextTurnFail()) {
        //         if (this.thisPlayer.is_ready && !this.thisPlayer.isFold) this.thisPlayer.vectorCardP1[3].setDark(false, this.spriteFrameMask);
        //     }
        // }
        if (player.vectorCardP1[player.vectorCardP1.length - 1].code === 0 || player.vectorCardP1[player.vectorCardP1.length - 1].code === data.C) {
            // player.vectorCardP1[player.vectorCardP1.length - 1].setTextureWithCode(data.C);
            // 4card
            let card4th = player.vectorCardP1[player.vectorCardP1.length - 1];
            this.foldUp(indexDYnamic, card4th.node, data.C);
        } else {
            this.dealCardPlayer(index, 0, true, data.C);
        }
        if (player == this.thisPlayer && this.thisPlayer.vectorCardP1.length == 4) {
            if (this.thisPlayer.is_ready) {
                this.buttonCheckToggle.node.active = false;
                this.NodeBet.node.active = false;
                setTimeout(() => {
                    if (this.node == null || typeof this.node == 'undefined') return;
                    this.lbChangeCard.active = true;
                    this.bg_arrow_swap.node.active = true;
                    this.schedule(function () {
                        this.bg_arrow_swap.node.runAction(
                            cc.sequence(
                                cc.moveTo(0.4, cc.v2(0, 0)).easing(cc.easeCubicActionOut()),
                                cc.delayTime(0.05),
                                cc.moveTo(0.15, cc.v2(0, -25)).easing(cc.easeCubicActionOut()),
                            )
                        )
                    }, 0.6, 10)
                }, 500);

                this.thisPlayer.vectorCardP1[3].setDark(true, this.spriteFrameMask);
                this.NodeChangeTime = cc.instantiate(this.NodeCountDownPf).getComponent('CountDownTime');
                this.NodeChangeTime.node.position = cc.v2(0, 10);
                this.NodeChangeTime.setInfo(8, 3);
                this.node.addChild(this.NodeChangeTime.node, GAME_ZORDER.Z_CARD);
                this.scheduleOnce(() => { this.onclickCancel() }, 7.5);
            }
        }
    },
    chiaBaiKhiHetTurn() {
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_chiabai);
        for (let j = 0; j < this.players.length; j++) {
            if (!this.players[j].isFold && this.players[j].is_ready && this.players[j].vectorCardP1.length < 5) {
                this.dealCardPlayer(j, 0, true, 0);
            }
        }
    },
    handleBuyIn(data) {
        for (let i = 0; i < this.players.length; i++) {
            if (data.userName == this.players[i].pname) {
                if (data.userName === this.thisPlayer.pname) {
                    GameManager.getInstance().user.ag = data.ag;
                    this.myChipCur = data.ag;
                    this.myChipStack = data.chip;
                }
                this.players[i]._playerView.lbAg.string = GameManager.getInstance().formatNumber(data.chip + this.players[i].ag);
                this.players[i].ag = data.chip + this.players[i].ag;
            }
        }


    },
    InstantiateResultText(indexP, typeCard) {
        let node = new cc.Node();
        let componentSprite = node.addComponent(cc.Sprite);
        componentSprite.spriteFrame = this.listImgWinlose[typeCard];
        let player = this.players[indexP];
        let length = player.vectorCardP1.length;
        let dynamixIndex = player._indexDynamic;
        let cardScale = 0.5;
        //   if(indexP == 0) cardScale = 0.7;
        let widthCardNode = 149 * cardScale / 2;
        let cardBegin = this.listPosCard[dynamixIndex];
        this.node.addChild(node, GAME_ZORDER.Z_BUTTON);
        if (dynamixIndex > 2) {
            node.position = cc.v2((cardBegin.x - (((length - 2) / 2) * widthCardNode)), cardBegin.y - ((200 * cardScale) / 4));
        } else {
            node.position = cc.v2((cardBegin.x + (((length - 2) / 2) * widthCardNode)), cardBegin.y - ((200 * cardScale) / 4));
        }
        node.runAction(cc.sequence(cc.delayTime(4), cc.removeSelf()));
    },
    InstantiateEffWinLose(indexDynamic) {
        let nodeAni = new cc.Node();
        let cpSkeAni = nodeAni.addComponent(sp.Skeleton);
        cpSkeAni.skeletonData = this.aniWin;
        this.node.addChild(nodeAni, GAME_ZORDER.Z_BUTTON);
        cpSkeAni.setAnimation(0, 'animation', true);
        nodeAni.position = this.listPosView[indexDynamic];
        this.scheduleOnce(() => { nodeAni.destroy() }, 6);

    },
    getCardType(type) {

    },
    handleFinish(data) {
        let countReturnChip = 0;
        if (this.NodeBet != null && this.NodeBet.node.active) this.NodeBet.node.active = false;
        let dataListPlayer = data.declarePacketsTrans;
        for (let d = 0; d < dataListPlayer.length; d++) {
            // if(dataListPlayer.length > 1){
            //     playerWinObject[dataListPlayer[d].userName] = dataListPlayer[d].cardType;
            // }
            let arrC = dataListPlayer[d].arr
            let totalChipPlayer = dataListPlayer[d].chipStack
            let chipReturn = dataListPlayer[d].listChipReturn
            if (typeof (chipReturn) != 'undefined' && chipReturn != null) {
                countReturnChip += chipReturn.length
            }
            let textCard = dataListPlayer[d].cardType
            let typeWin = 7;
            let indexP = this.getIndexOfPlayer(this.getPlayer(dataListPlayer[d].userName));
            let player = this.getPlayer(dataListPlayer[d].userName);
            //  player.ag = totalChipPlayer;

            if (player == this.thisPlayer) {
                require('GameManager').getInstance().user.ag = this.myChipCur - this.myChipStack + dataListPlayer[d].chipStack;
            }
            let indexDynamic = player._indexDynamic;
            if (typeof (arrC) != 'undefined') {
                let delay = 0;
                for (let v = 0; v < arrC.length; v++) {
                    if (typeof (player.vectorCardP1[v]) == 'undefined') {
                        setTimeout(() => {
                            this.dealCardPlayer(indexP, 0, true, arrC[v]);
                        }, delay)
                        delay = delay + 200;
                    } else {
                        player.vectorCardP1[v].setTextureWithCode(arrC[v])
                        player.vectorCardP1[v].node.runAction(cc.sequence(cc.scaleTo(0.3, 0.5), cc.scaleTo(0.3, 0.45)))
                    }
                }
                if (textCard == 'Pair') typeWin = 0;
                if (textCard == 'TwoPair') typeWin = 1;
                if (textCard == 'HighCard') typeWin = 2;
                if (textCard == 'FullHouse') typeWin = 3;
                if (textCard == 'ThreeOfKind') typeWin = 4;
                if (textCard == 'Straight') typeWin = 5;
                if (textCard == 'FourOfKind') typeWin = 6;
                this.InstantiateResultText(indexP, typeWin);
            }
        }

        require('SMLSocketIO').getInstance().emitUpdateInfo();
        if (!this.thisPlayer.isFold && this.thisPlayer.is_ready && this.thisPlayer.vectorCardP1.length == 5) {
            this.thisPlayer.vectorCardP1[0].setDark(false, this.spriteFrameMask);
        }

        let vtemp;
        let vCount;
        if (countReturnChip < 2) {
            vtemp = cc.v2(0, 115);
            vCount = cc.v2(0, 0)
        } else if (countReturnChip < 3) {
            vtemp = cc.v2(-60, 115);
            vCount = cc.v2(123, 0);
        } else if (countReturnChip < 4) {
            vtemp = cc.v2(-82, 115);
            vCount = cc.v2(82, 0);
        } else if (countReturnChip < 5) {
            vtemp = cc.v2(-183, 115);
            vCount = cc.v2(123.5, 0);
        } else {
            vtemp = cc.v2(-183, 115);
            vCount = cc.v2(92.5, 0);
        }
        let timeDelay = 4;
        for (let t = 0; t < dataListPlayer.length; t++) {
            let arrC = dataListPlayer[t].arr
            let player = this.getPlayer(dataListPlayer[t].userName);
            let indexDynamic = player._indexDynamic;
            let chipReturn = dataListPlayer[t].listChipReturn;
            if (typeof (chipReturn) != 'undefined') {
                this.InstantiateEffWinLose(indexDynamic);

                for (let z = 0; z < chipReturn.length; z++) {
                    cc.NGWlog('chay vao ham khoi tao chip return');
                    let item = cc.instantiate(this.chipReturnPf).getComponent('ChipReturnShow');
                    // item.node.position = cc.v2(0, 220);
                    this.node.addChild(item.node, GAME_ZORDER.Z_BUTTON);
                    let durationTime = item.setInfo(vtemp, this.listPosView[indexDynamic], timeDelay, parseInt(chipReturn[z]), this.generateRandomNumber(0, 5));
                    setTimeout(() => {
                        if (this.node == null || typeof this.node == 'undefined') return;
                        player._playerView.effectFlyMoney(chipReturn[z]);
                        this.EffectMoneyChange(chipReturn[z], player.ag, player._playerView.lbAg);
                        player.ag += chipReturn[z];
                        if (player === this.thisPlayer) {
                            this.isAllIn = false;
                            GameManager.getInstance().user.ag += chipReturn[z];
                            if (dataListPlayer[t].chipWin > 0 && !this.isCheckAddWinListCard) {
                                let str = '';
                                str = "Monica: " + GameManager.getInstance().getTextConfig('shan2_you_win').replace("%lld", dataListPlayer[t].chipWin + "");

                                if (typeof (arrC) != 'undefined') {
                                    this.quickChat.addChatWithCard(str, arrC);
                                } else {
                                    this.quickChat.addChatWithText(str);
                                }
                                this.isCheckAddWinListCard = true;
                            }
                        }
                    }, durationTime * 1000)
                    vtemp = cc.v2(vtemp.x + vCount.x, vtemp.y + vCount.y);
                    timeDelay++;
                }
            }
        }

        this.Pot.setValue(this.potValue, 0);
        this.setTimeout(() => {
            this.handleWinerCard(data);
        }, 2000)

        setTimeout(() => {
            if (this.node == null || typeof this.node == 'undefined') return;
            this.Pot.setValue(0, 0.2);
        }, 500)

        setTimeout(() => {
            if (this.node == null || typeof this.node == 'undefined') return;
            this.isCheckAddWinListCard = false;
            this.stateGame = STATE_GAME.WAITING;
            this.isTurn = 2;
            this.countTurn = 0;
            this.resetViewGame(data);
        }, (5 + timeDelay) * 1000)

    },
    resetViewGame(data) {
        cc.NGWlog('chay vao ham resetGameVIew');

        this.handleCardsFinish(data)

        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].isFold) {
                this.players[i].isFold = false;
                this.players[i]._playerView.setDark(false);
            }
        };
        for (let i = 0; i < this.listBoxBet.length; i++) {
            let item = this.listBoxBet[i]
            if (item != null && typeof item != 'undefined')
                this.BoxBetPool.put(item.node);
        }
        this.listBoxBet = [{}, {}, {}, {}, {}];

    },

    handleCardsFinish(data) {
        let array = data.declarePacketsTrans;
        for (let i = 0; i < array.length; i++) {
            let player = this.getPlayer(array[i].userName);
            let indexDynamic = player._indexDynamic;
            let startCard = 1;
            if (array[i].arr != null) {
                startCard = 0;
            }
            this.showCardResultAnimattion(indexDynamic, startCard, 1);
        }
        // this.recallCards();
    },

    handleWinerCard(data) {
        let array = data.declarePacketsTrans;
        for (let i = 0; i < array.length; i++) {
            let player = this.getPlayer(array[i].userName);
            let indexDynamic = player._indexDynamic;
            let startCard = 1;
            if (array[i].arr != null) {
                startCard = 0;
            }
            if (array[i].chipWin > 0) {
                this.showCardResultAnimattion(indexDynamic, startCard, 0)
            }
        }
    },

    showCardResultAnimattion(index, startCard, isEnd) {
        // cc.v2(vTemp.x + ((cardTemp.node.getContentSize().width / 2 * 0.4)
        let delay = 0;
        if (isEnd == 0) {
            for (let i = startCard; i < this.playercards[index].length; i++) {
                let card = this.playercards[index][i];
                this.scaleUpCard(card, delay, i * 20, index);
                delay = delay + 0.1;
            }
        } else {
            for (let i = 0; i < 5; i++) {
                if (this.playercards[i].length > 0) {
                    let pos = this.listPosCard[i];
                    let delay = 0;
                    for (let j = 0; j < this.playercards[i].length; j++) {
                        let card = this.playercards[i][j];
                        let sk1 = 0;
                        let sk2 = 0;
                        if (index <= 2) {
                            sk1 = -15;
                            sk2 = 15;
                        } else {
                            sk1 = 15;
                            sk2 = -15;
                        }

                        card.runAction(cc.sequence(
                            cc.delayTime(delay),
                            cc.scaleTo(0.15, 0, 0.55).easing(cc.easeCubicActionOut()),
                            cc.callFunc(() => {
                                card.getComponent('Card').setTextureWithCode(0)
                                card.getComponent('Card').setDark(false, this.spriteFrameMask);
                            }),
                            cc.scaleTo(0.15, 0.45).easing(cc.easeCubicActionOut()),
                        ));

                        card.runAction(cc.sequence(
                            cc.delayTime(delay),
                            cc.skewTo(0.15, 0, sk1).easing(cc.easeCubicActionOut()),
                            cc.callFunc(() => { card.skewY = sk2 }),
                            cc.skewTo(0.15, 0, 0).easing(cc.easeCubicActionOut()),
                        ));

                        // card.runAction(cc.sequence(
                        //     cc.delayTime(delay),
                        //     cc.moveTo(0.15,cc.v2(0,0)).easing(cc.easeCubicActionOut()),
                        // ));
                        delay = delay + 0.1;
                    }
                }
            }
        }
        if (isEnd != 0) {
            this.setTimeout(() => {
                this.recallCards();
            }, delay * 1000 + 2000)
        }
    },

    scaleUpCard(card, delay, offset, index) {
        // let saveZIndex = card.zIndex;
        // let savePos = card.position;
        // let vectorX = 0;
        // if(index > 2){
        //     vectorX = savePos.x - offset;
        // }else{
        //     vectorX = savePos.x + offset;
        // }
        // card.runAction(cc.sequence(
        //     cc.delayTime(delay),
        //     cc.callFunc(()=>{card.zIndex = GAME_ZORDER.Z_CARD + delay * 10}),
        //     cc.scaleTo(0.4,0.7).easing(cc.easeCubicActionOut()),
        //     cc.callFunc(()=>{card.zIndex = saveZIndex}),
        //     cc.scaleTo(0.6,0.45).easing(cc.easeCubicActionOut()),

        //     // cc.moveTo(0.2,cc.v2(savePos.x,savePos.y + 40)),
        //     // cc.moveTo(0.6,savePos).easing(cc.easeCubicActionOut()),
        //     // cc.delayTime(0.1),

        // ));
        // // card.runAction(cc.sequence(
        // //     cc.delayTime(delay),
        // //     cc.moveTo(0.4,cc.v2(vectorX,savePos.y)).easing(cc.easeCubicActionOut()),
        // //     cc.moveTo(0.6 + delay,savePos).easing(cc.easeCubicActionOut()),
        // // ));
        // // card.runAction(cc.sequence(
        // //     cc.delayTime(delay+0.4),
        // //     // cc.moveTo(0.4,cc.v2(vectorX,savePos.y)).easing(cc.easeCubicActionOut()),
        // //     cc.moveTo(0.4+delay,savePos).easing(cc.easeCubicActionOut()),
        // // ));
        let code = card.getComponent('Card').code;
        let sk1 = 0;
        let sk2 = 0;
        if (index <= 2) {
            sk1 = -15;
            sk2 = 15;
        } else {
            sk1 = 15;
            sk2 = -15;
        }

        card.runAction(cc.sequence(
            cc.delayTime(delay),
            cc.scaleTo(0.15, 0, 0.55).easing(cc.easeCubicActionOut()),
            cc.callFunc(() => { card.getComponent('Card').setTextureWithCode(0) }),
            cc.scaleTo(0.15, 0.55).easing(cc.easeCubicActionOut()),
            cc.scaleTo(0.15, 0, 0.55).easing(cc.easeCubicActionOut()),
            cc.callFunc(() => { card.getComponent('Card').setTextureWithCode(code) }),
            cc.scaleTo(0.15, 0.45).easing(cc.easeCubicActionOut()),
        ));

        card.runAction(cc.sequence(
            cc.delayTime(delay),
            cc.skewTo(0.15, 0, sk1).easing(cc.easeCubicActionOut()),
            cc.callFunc(() => { card.skewY = sk2 }),
            cc.skewTo(0.15, 0, 0).easing(cc.easeCubicActionOut()),
            cc.skewTo(0.15, 0, sk1).easing(cc.easeCubicActionOut()),
            cc.callFunc(() => { card.skewY = sk2 }),
            cc.skewTo(0.15, 0, 0).easing(cc.easeCubicActionOut()),
        ));

        let orgPos = card.position;
        card.runAction(cc.sequence(
            cc.delayTime(delay),
            cc.moveTo(0.3, cc.v2(orgPos.x, orgPos.y + 30)).easing(cc.easeCubicActionOut()),
            cc.moveTo(0.3, orgPos).easing(cc.easeCubicActionOut()),
        ));

    },

    recallCards() {
        let delay = 0;
        let zView = 0;
        for (let i = 0; i < 5; i++) {
            let len = this.playercards[i].length;
            for (let j = 0; j < len; j++) {
                let card = this.playercards[i].pop();
                this.moveCardsFinish(card, delay, zView);
                zView++;
                delay += 100;
            }
        }
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].vectorCardP1 = [];
        }
        this.setTimeout(() => {
            require('HandleGamePacket').NextEvt();
            if (cc.sys.localStorage.getItem("isBack") == 'true') require('NetworkManager').getInstance().sendExitGame();
        }, delay + 700)
    },

    moveCardsFinish(card, delay, zView) {
        this.setTimeout(() => {
            card.runAction(cc.moveTo(0.4, this.DealerInGame.node.position).easing(cc.easeCubicActionOut()));
            card.zIndex = GAME_ZORDER.Z_CARD + zView;
            card.runAction(cc.sequence(
                cc.scaleTo(0.15, 0.04, 0.4),
                cc.scaleTo(0.15, 0.4),
            ))
            card.runAction(cc.sequence(
                cc.skewTo(0.15, 0, -15),
                cc.callFunc(() => {
                    card.skewY = 15;
                }),
                cc.skewTo(0.15, 0, 0),
            ))
            this.setTimeout(() => {
                card.getComponent('Card').setTextureWithCode(0)
            }, 150)
            this.setTimeout(() => {
                this.cardPool.put(card)
            }, 600)
        }, delay)
    },

    updatePositionPlayerView() {
        this._super()
    },
    getDynamicIndex(index) {
        if (index == 0) return 0;

        var _index = index;

        if (this.players.length <= 3) {
            _index += 1;
        }
        return _index;
    },
    resetNewTurn() {
        // lay chip cho vao pot
        this.isTurn++;
        this.countTurn = 0;
        this.buttonCheckToggle.node.active = false;

        if (this.isTurn < 6 && this.checkNextTurnFail() > 1) {
            this.chiaBaiKhiHetTurn();
        }

        for (let j = 0; j < this.players.length; j++) { // effect thu tien vao pot
            let indexDynamic = this.players[j]._indexDynamic;
            if (this.listBoxBet[indexDynamic].node != null && typeof this.listBoxBet[indexDynamic].node != 'undefined') {
                if (this.listBoxBet[indexDynamic].chip > 0) {
                    cc.NGWlog('indexDynamic la ', j);
                    cc.NGWlog('chip boxBet la ', this.listBoxBet[indexDynamic].chip);
                    for (let i = 0; i < 4; i++) {
                        if (this.chipEffectPool.size() < 1) this.chipEffectPool.put(cc.instantiate(this.chipEffect));
                        let temp = this.chipEffectPool.get();
                        temp.position = cc.v2(this.listPosBoxBet[indexDynamic].x, this.listPosBoxBet[indexDynamic].y);
                        this.node.addChild(temp, GAME_ZORDER.Z_BUTTON);
                        let ac1 = cc.moveTo(0.8, this.Pot.node.position.add(cc.v2(0 + this.generateRandomNumber(-7, 7), -40 + this.generateRandomNumber(-7, 7)))).easing(cc.easeBackIn(2.5));
                        let ac2 = cc.moveTo(0.5, this.Pot.node.position).easing(cc.easeElasticIn(1));
                        let ac3 = cc.sequence(cc.delayTime(i * 0.02), ac1, cc.delayTime(0.6), ac2);
                        temp.runAction(cc.sequence(ac3, cc.callFunc(() => { this.chipEffectPool.put(temp) })));
                    }
                }
            }

        }
        this.setTimeout(() => {
            require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_nemxu);
        }, 2000);
        cc.NGWlog('Gia tri cua potValue1 la ', this.potValue);

        this.Pot.setValue(this.potValue, 2.0);
        for (let i = 0; i < this.listBoxBet.length; i++) {
            if (this.listBoxBet[i].node != null && typeof this.listBoxBet[i].node != 'undefined') {
                if (this.listBoxBet[i].status == 'Allin') {
                    this.listBoxBet[i].offSpriteAll();
                }

                if (this.listBoxBet[i].status != 'Allin' && this.listBoxBet[i].status != 'Fold') {
                    this.BoxBetPool.put(this.listBoxBet[i].node);
                    this.listBoxBet[i] = {};
                } else {
                    this.listBoxBet[i].chip = 0;
                }
            }

        }
    },


    doiCho2PhanTuTrongMang(num1, num2, array) {
        let temp = array[num1];
        array[num1] = array[num2];
        array[num2] = temp;
    },
    checkNextTurnFail() {
        let temp = 0
        for (let i = 0; i < this.players.length; i++) {
            if (!this.players[i].isFold && this.players[i].is_ready) {
                temp++;
            }
        }
        return temp;
    },
    EffectMoneyChange(amountChange, _valueSet, label, format = false, speed = 1, duration = 1) {
        label.node.runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.callFunc(() => {
            let number = _valueSet;
            number += amountChange;
            label.string = GameManager.getInstance().formatNumber(number);
        }), cc.scaleTo(0.2, 1)))
    },
    readDataPlayer(_player, data) {
        _player.id = data.id;
        _player.fid = data.FId;
        _player.pname = data.N;
        _player.ag = data.chipStack;
        _player.vip = data.VIP;
        _player.avatar_id = data.Av;
        _player.is_ready = data.isStart;
        _player.ip = data.sIP;
        _player.displayName = data.displayName;
    },
    setIndexHost() {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].is_host) {
                cc.NGWlog('host moi la' + this.players[i].pname);
                this.indexHostPlayer = i;
                this.hostPlayer = this.players[i];
            }
        }
    },
    addChatJoin(nameP) {
        this._super(nameP);

    },
    handleChatTable(data) {
        this._super(data);
    },
    HandlerTip(data) {
        data.displayName = GameManager.getInstance().user.displayName;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].pname == data.N) {

                var nameTip = data.N;

                this.EffectMoneyChange(-data.AGTip, this.players[i].ag, this.players[i]._playerView.lbAg);
                this.players[i].ag -= data.AGTip;
                if (this.players[i].pname == this.thisPlayer.pname) {
                    GameManager.getInstance().user.ag -= data.AGTip;
                }
                for (let j = 0; j < 2; j++) // sinh ra 4 chip                     //  lay tien nguoi` thua
                {
                    let temp;
                    if (this.chipTipPool.size() < 1) this.chipTipPool.put(cc.instantiate(this.chip_Tip));
                    temp = this.chipTipPool.get();
                    temp.setPosition(this.players[i]._playerView.node.position);
                    this.node.addChild(temp, GAME_ZORDER.Z_BUTTON);
                    let tempAc1 = cc.moveTo(0.2, temp.position.add(cc.v2(0, 80))).easing(cc.easeElasticOut(1));
                    let tempAc2 = cc.moveTo(1, this.DealerInGame.node.position).easing(cc.easeInOut(3));
                    temp.runAction(cc.sequence(cc.delayTime(j * 0.2), tempAc1, cc.delayTime(0.3), tempAc2, cc.callFunc(() => { this.chipTipPool.put(temp) })));
                }
                this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(() => { this.DealerInGame.show(this.players[i].displayName, data.AGTip); })))
            }
        }
        if (data.hasOwnProperty("data")) {
            require("UIManager").instance.showToast(data.data);
        }
    },
    onclickSwapCard() {
        require('NetworkManager').getInstance().sendChangeCard(true);
        this.doiCho2PhanTuTrongMang(0, 3, this.thisPlayer.vectorCardP1);
        this.lbChangeCard.active = false;
        this.bg_arrow_swap.node.active = false;
        this.thisPlayer.vectorCardP1[3].setDark(false, this.spriteFrameMask);
        let vTemp = this.thisPlayer.vectorCardP1[3].node.position;
        let zindexTemp = this.thisPlayer.vectorCardP1[3].node.zIndex;
        this.thisPlayer.vectorCardP1[3].node.position = this.thisPlayer.vectorCardP1[0].node.position;
        this.thisPlayer.vectorCardP1[3].node.zIndex = this.thisPlayer.vectorCardP1[0].node.zIndex
        this.thisPlayer.vectorCardP1[0].node.position = vTemp;
        this.thisPlayer.vectorCardP1[0].node.zIndex = zindexTemp;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSwapCard_%s", require('GameManager').getInstance().getCurrentSceneName()));
        let midle = this.playercards[0][0];
        this.playercards[0][0] = this.playercards[0][3];
        this.playercards[0][3] = midle;

    },
    onclickCancel() {
        this.thisPlayer.vectorCardP1[3].setDark(false, this.spriteFrameMask);
        require('NetworkManager').getInstance().sendChangeCard(false);
        this.lbChangeCard.active = false;
        this.bg_arrow_swap.node.active = false;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickNotSwapCard_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },
    handleAutoExit(data) {
        this._super(data);
        // var nodeNote = new cc.Node('Sprite');
        // var spNote = nodeNote.addComponent(cc.Sprite);
        // require("GameManager").getInstance().loadTexture(spNote, ResDefine.khungden);
        // let nodeLabel = new cc.Node('Label');
        // let componentLabel = nodeLabel.addComponent(cc.Label);
        // componentLabel.fontSize = 30;
        // componentLabel.lineHeight = 30;
        // componentLabel.string = str;
        // nodeNote.addChild(nodeLabel);
        // nodeNote.position = cc.v2(0, 0);
        // this.node.addChild(nodeNote);
        // setTimeout(() => { nodeNote.destroy() }, 2000);
    }

});
module.exports = ShowGameView;