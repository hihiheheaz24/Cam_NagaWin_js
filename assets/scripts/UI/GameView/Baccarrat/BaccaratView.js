var CARD_WIDTH = 147
var CARD_HEIGHT = 198
var CARD_SCALE = 1.0
var CARD_ZINDEX = 50;
var BaccaratView = cc.Class({
    extends: require('GameView2'),

    properties: {
        lb_MinBet: cc.Label,
        lb_MaxBet: cc.Label,
        cardDeckR: cc.Node,
        cardDeckL: cc.Node,
        sprListChip: cc.SpriteAtlas,
        minBet: 0,
        lbScore_P: cc.Label,
        lbScore_B: cc.Label,
        BoxbetPr: cc.Prefab,
        clockPr: cc.Prefab,
        ButtonBetGamePr: cc.Prefab,
        ChipBetPr: cc.Prefab,
        TableBet: cc.Node,
        spr_CardDark: cc.SpriteFrame,
        historyPr: cc.Prefab,
        spr_Shadow: cc.SpriteFrame,
        animPrefab: cc.Prefab,
        layoutChipWin: cc.Node,
        lb_noti: cc.Label,
    },
    onLoad() {
        this._super();
        this.posCardBanker = cc.v2(90, 150);
        this.posCardPlayer = cc.v2(-60, 150);
        this.matchCount = 0;
        this.ButtonBet = null;
        this.BoxbetParent = null;
        this.ChipBet = null;
        this.listChipBet = [];
        this.timeDouble = null;
        //de test
        this.agTable = 0;
        this.listcard = [];
        this.listValue = [];
        this.count = 0;
        this.minBet = 0;
        this.setInfoGameStart();
        this.chipDealLastMatch = 0;
        this.scoreB = 0;
        this.scoreP = 0;
        this.arrCardP = [];
        this.arrCardB = [];
        this.isHavePair = false;
        this.isHaveBala = false;
        this.sideWinPair = "";
        this.dataPlayerBet = [];
        this.listChipWin = [];
        this.chipBetPool = new cc.NodePool();
        this.icChipPool = new cc.NodePool();
        this.isRebet = false;
        this.totalBetLastMatch = 0;
        this.countPP = 0;
        this.countBP = 0;
        this.notiViewTable = null;
        this.initLayoutSize = this.layoutChipWin.getContentSize();
        this.layoutChipWin.on("child-added", () => {
            if (this.layoutChipWin.children.length % 10 === 0) {
                this.layoutChipWin.setContentSize(cc.size(this.initLayoutSize.width + 90, this.layoutChipWin.height));
            }
        });
        this.layoutChipWin.on("child-removed", () => {
            if (this.layoutChipWin.children.length === 0) {
                this.layoutChipWin.setContentSize(cc.size(this.initLayoutSize.width, this.layoutChipWin.height));
            }
        });
        //de test
    },
    addChatJoin() {

    },
    start() { },
    setInfoGameStart() {
        this.chipDeal = 0;
        this.curChipBet = 0;
        this.lbScore_B.string = "0";
        this.lbScore_P.string = "0";
        this.historyResult = cc.instantiate(this.historyPr).getComponent("ResultHistoryBaccarat");
        this.node.addChild(this.historyResult.node);
        this.historyResult.node.zIndex = 60;
    },
    handleCTable(data) {
        this._super(data);
        data = JSON.parse(data);
        this.stateGame = STATE_GAME.WAITING;
        this.thisPlayer._playerView.setPosThanhBarThisPlayer();
        this.playerView = this.thisPlayer._playerView;
        let value = this.agTable;
        this.listValue.push(value, value * 5, value * 10, value * 50, value * 100);
        this.minBet = this.agTable;
        this.chipDeal = this.minBet;
    },
    handleSTable(data) {
        this._super(data);
        this.itemChatNgoaiGame.node.active = true;
        let text1 = require("GameManager").getInstance().getTextConfig("txt_view_table").replace("!", "") + ".";//"Game is playing ! Please wait a moment .";
        let text2 = text1 + ".";
        let text3 = text2 + ".";
        var seq = cc.repeatForever(
            cc.sequence(
                cc.callFunc(() => {
                    this.lb_noti.string = text1
                }), cc.delayTime(0.5),
                cc.callFunc(() => {
                    this.lb_noti.string = text2
                }), cc.delayTime(0.5),
                cc.callFunc(() => {
                    this.lb_noti.string = text3
                }), cc.delayTime(0.5),
            ));
        if (this.notiViewTable === null) {
            if (this.tableBet !== null) this.TableBet.getComponent("TableBetBaccarat").hideButton(false);
            if (this.notiViewTable) this.notiViewTable.destroy();
            this.notiViewTable = this.createNotification(text1);
            this.notiViewTable.setPosition(0, 140);
            this.notiViewTable.runAction(cc.fadeTo(0.5, 255));
            this.lb_noti.node.runAction(seq);
        } else {
            this.notiViewTable.runAction(cc.fadeTo(0.5, 255));
            this.lb_noti.node.runAction(seq);
        }
        this.playerView = this.thisPlayer._playerView;
        this.playerView.setPosThanhBarThisPlayer();
        data = JSON.parse(data);
        this.stateGame = STATE_GAME.WAITING;
        let value = this.agTable;
        this.listValue.push(this.agTable, value * 5, value * 10, value * 50, value * 100);
        this.minBet = this.agTable;
        if (data.gameStatus === "BET_TIME") {
            this.countDownTime(data.timeLeft);
            if (this.notiViewTable !== null) {
                this.TableBet.getComponent("TableBetBaccarat").hideButton(true);
                this.notiViewTable.runAction(cc.sequence(cc.fadeTo(0.5, 0),
                    cc.callFunc(() => {
                        // this.notiViewTable.destroy();
                        this.lb_noti.node.stopAllActions();
                    })));
            }
            this.itemChatNgoaiGame.node.active = false;
        }
        let playerBetInfo = data.playerBet;
        if (data.gameStatus !== "ACT_TIME") {
            for (let i = 0; i < playerBetInfo.length; i++) {
                let data = playerBetInfo[i];
                if (data.player > 0) {
                    this.createChipBetted(data.pid, SIDE_BET.PLAYER, data.player);
                }
                if (data.playerPair > 0) {
                    this.createChipBetted(data.pid, SIDE_BET.PLAYER_PAIR, data.playerPair);
                }
                if (data.banker > 0) {
                    this.createChipBetted(data.pid, SIDE_BET.BANKER, data.banker);
                }
                if (data.bankerPair > 0) {
                    this.createChipBetted(data.pid, SIDE_BET.BANKER_PAIR, data.bankerPair);
                }
                if (data.tie > 0) {
                    this.createChipBetted(data.pid, SIDE_BET.TIE, data.tie);
                }
            }
        }
        this.historyResult.updateHistory(data.bankerWinCount, data.playerWinCount, data.tieWinCount, data.bankerPairCount, data.playerPairCount);
        for (let i = 0; i < data.history.length; i++) {
            this.historyResult.updateHistoryBigRoad(data.history[i]);
        }
    },

    handleJTable(strData) {
        this._super(strData);
    },
    handleLTable(data) {
        let name = this.getPlayerWithId(data.pid).pname;
        if (name !== require("GameManager").getInstance().user.uname) {
            this.removePlayer(name);
        }
    },
    createChipBetted(idPlayer, typeBet, value) {
        let player = this.getPlayerWithId(idPlayer);
        let tableCom = this.TableBet.getComponent("TableBetBaccarat");
        let posSide = tableCom.getChipPosOnSide(typeBet, player._indexDynamic, value);

        //===>>Create Chip<=====//
        let ChipBet = this.createChipBet(typeBet, value, posSide);
        ChipBet.pid = player.id;
        this.listChipBet.push(ChipBet);
        player._playerView.listChipBetPl.push(ChipBet);
        //===>>Create Chip<=====//
    },
    chiabai(arrB, arrP) {
        for (let i = 0; i < 2; i++) {
            let card = this.getCard();
            card.node.position = this.cardDeckR.position;
            card.node.rotation = 90;
            card.setTextureWithCode(0);
            this.listcard.push(card);
            card.node.scale = CARD_SCALE * 0.4;
            this.node.addChild(card.node);
            card.node.opacity = 0;
            let timedel = 0.3;
            if (i > 0) timedel = 0.9;
            this.effChiaBai(card, arrB[i], i, true, timedel);
            this.arrCardB.push(card);
        }
        for (let i = 0; i < 2; i++) {
            let card = this.getCard();
            card.node.position = this.cardDeckR.position;
            card.node.rotation = 90;
            card.setTextureWithCode(0);
            this.listcard.push(card);
            card.node.scale = CARD_SCALE * 0.5;
            this.node.addChild(card.node);
            card.node.opacity = 0;
            let timedel = 0;
            if (i > 0) timedel = 0.6;
            this.effChiaBai(card, arrP[i], i, false, timedel);
            this.arrCardP.push(card);
        }
        setTimeout(() => {
            if (this.node === null) return;
            this.showScore();
        }, 1500);
        setTimeout(() => {
            if (this.node === null) return;
            if (this.isHaveBala) {
                this.resolveBala();
            } else this.setCardDark(this.sideWin);
        }, 2500);
    },
    handleFinish(data) {
        this.itemChatNgoaiGame.node.active = true;
        this.TableBet.getComponent("TableBetBaccarat").hideButton(false);
        // this.stateGame = STATE_GAME.PLAYING;
        let arrP = [];
        let arrB = [];
        data = JSON.parse(data);
        this.finishData = data;
        for (let i = 0; i < this.finishData.results.length; i++) {
            if (this.finishData.results[i].pid === this.thisPlayer.id) {
                this.matchCount++;
            }
        }
        let dataCardP = data.playerCards;
        let dataCardB = data.bankerCards;
        this.dataPlayerBet = data.bets;
        if (data.tie) this.sideWin = SIDE_BET.TIE;
        else if (data.player) this.sideWin = SIDE_BET.PLAYER;
        else this.sideWin = SIDE_BET.BANKER;
        if (data.playerPair && data.bankerPair) this.sideWinPair = SIDE_WINPAIR.BOTHPB;
        else if (data.playerPair) this.sideWinPair = SIDE_WINPAIR.PLAYER;
        else if (data.bankerPair) this.sideWinPair = SIDE_WINPAIR.BANKER;
        else this.sideWinPair = SIDE_WINPAIR.NONE;

        if (data.playerCards[2] || data.bankerCards[2])
            this.isHaveBala = true;
        else this.isHaveBala = false;
        if (data.playerPair || data.bankerPair)
            this.isHavePair = true;
        let i = 0;
        let size = dataCardP.length;
        for (i = 0; i < size; i++) {
            if (dataCardP[i] !== null)
                arrP.push(dataCardP[i].code);
        }
        i = 0;
        size = dataCardB.length;
        for (i = 0; i < size; i++) {
            if (dataCardB[i] !== null)
                arrB.push(dataCardB[i].code);
        }
        if (this.BoxbetParent !== null) {
            this.BoxbetParent.createDataBet();
            this.chiabai(arrB, arrP);
            //=======>Clear LB side khi thua<=========//
            if (!data.tie) this.BoxbetParent.TieValue = 0;
            if (!data.player) this.BoxbetParent.PValue = 0;
            if (!data.banker) this.BoxbetParent.BValue = 0;
            if (!data.playerPair) this.BoxbetParent.PPValue = 0;
            if (!data.bankerPair) this.BoxbetParent.BPValue = 0;

            let tableBet = this.TableBet.getComponent("TableBetBaccarat");
            if (!data.tie) tableBet.TieValue = 0;
            if (!data.player) tableBet.PValue = 0;
            if (!data.banker) tableBet.BValue = 0;
            if (!data.playerPair) tableBet.PPValue = 0;
            if (!data.bankerPair) tableBet.BPValue = 0;
        }
        //=======>delay chia bai<=========//
        let delTime = this.isHaveBala ? 2.5 : 1.5;
        setTimeout(() => {
            if (this.node === null) return;
            this.resolveChipLose();
        }, delTime * 2000);
    },
    effChiaBai(card, code, indexRun, isCardB, timedel) {
        //let timedel = 0.2 * indexRun;
        let pos = isCardB ? this.posCardBanker : this.posCardPlayer;
        let posBank = cc.v2(pos.x + (indexRun * CARD_WIDTH * CARD_SCALE * 0.4) + indexRun * 20, this.posCardBanker.y);
        let posPlayer = cc.v2(pos.x - (indexRun * CARD_WIDTH * CARD_SCALE * 0.4) - indexRun * 20, this.posCardBanker.y);
        let posCard = isCardB ? posBank : posPlayer;
        let acRot = cc.rotateTo(0.3, 0);
        let acMove = cc.moveTo(0.3, posCard);
        let acMoBai = cc.callFunc(() => {
            card.setTextureWithCode(code);
            if (card.N === 14) card.N = 1;
            if (card.N > 9) card.N = 0;
            if (isCardB) this.scoreB += card.N;
            else this.scoreP += card.N;
        });
        card.node.runAction(cc.sequence(cc.delayTime(timedel),
            cc.callFunc(() => {
                card.node.opacity = 255;
                require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.cardAudio);
            }),
            cc.spawn(acRot, acMove),
            cc.spawn(cc.skewBy(0.1, 0, 15),
                cc.scaleTo(0.1, 0.5).easing(cc.easeOut(1)),
                cc.scaleTo(0.1, 0, 0.5).easing(cc.easeOut(1))),
            acMoBai,
            cc.spawn(cc.skewTo(0.1, 0, 0),
                cc.scaleTo(0.1, 0.5).easing(cc.easeIn(1)),
                cc.scaleTo(0.1, 0.4).easing(cc.easeIn(1)))));
        this.ButtonBet.node.active = false;
    },
    effBocBai(code, isCardB, deltime = 0) {
        let cardB = this.getCard();
        cardB.node.position = this.cardDeckR.position;
        cardB.node.opacity = 0;
        cardB.node.scale = CARD_SCALE * 0.4;
        cardB.setTextureWithCode(0);
        this.node.addChild(cardB.node);
        this.listcard.push(cardB);
        let pos = isCardB ? this.posCardBanker : this.posCardPlayer;
        let posCard = isCardB ? cc.v2(pos.x + (2 * CARD_WIDTH * CARD_SCALE * 0.4) + 50, this.posCardBanker.y) : cc.v2(pos.x - (2 * CARD_WIDTH * CARD_SCALE * 0.4) - 50, this.posCardBanker.y);
        let acRot = cc.rotateTo(0.3, 90);
        let acMove = cc.moveTo(0.3, posCard);
        let acMoBai = cc.callFunc(() => {
            cardB.setTextureWithCode(code);
            if (isCardB) {
                this.arrCardB.push(cardB);
                if (cardB.N === 14) cardB.N = 1;
                if (cardB.N < 10)
                    this.scoreB += cardB.N;
            } else {
                if (cardB.N === 14) cardB.N = 1;
                if (cardB.N < 10)
                    this.scoreP += cardB.N;
                this.arrCardP.push(cardB);
            }
        });
        cardB.node.runAction(cc.sequence(cc.delayTime(deltime), cc.callFunc(() => {
            cardB.node.opacity = 255;
            require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.cardAudio);
        }), cc.spawn(acRot, acMove),
            cc.spawn(cc.skewBy(0.1, 0, 15),
                cc.scaleTo(0.1, 0.5).easing(cc.easeOut(1)),
                cc.scaleTo(0.1, 0, 0.5).easing(cc.easeOut(1))),
            acMoBai,
            cc.spawn(cc.skewTo(0.1, 0, 0),
                cc.scaleTo(0.1, 0.5).easing(cc.easeIn(1)),
                cc.scaleTo(0.1, 0.4).easing(cc.easeIn(1)))));
        setTimeout(() => {
            if (this.node === null) return;
            this.showScore(false);
        }, 800);
        setTimeout(() => {
            if (this.node === null) return;
            this.setCardDark(this.sideWin);
        }, 1300);
    },
    showScore() {
        this.lbScore_B.node.getParent().active = true;
        this.lbScore_B.string = this.scoreB % 10;
        this.lbScore_B.node.getParent().position = cc.v2(this.arrCardB[this.arrCardB.length - 1].node.x + 100, this.arrCardB[this.arrCardB.length - 1].node.y);
        this.lbScore_P.node.getParent().active = true;
        this.lbScore_P.string = this.scoreP % 10;
        this.lbScore_P.node.getParent().position = cc.v2(this.arrCardP[this.arrCardP.length - 1].node.x - 100, this.arrCardP[this.arrCardP.length - 1].node.y);
    },
    resolveBala() {
        let deltime = 0;
        if (this.finishData.playerCards[2] !== null) {
            this.effBocBai(this.finishData.playerCards[2].code, false);
            this.lbScore_P.node.getParent().active = false;
            deltime = 0.3;
        }
        if (this.finishData.bankerCards[2] !== null) {
            this.lbScore_B.node.getParent().active = false;
            this.effBocBai(this.finishData.bankerCards[2].code, true, deltime);
        }
    },
    resolveChipLose() {
        //resolve chip lose
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_allin);

        this.historyResult.updateHistory(this.finishData.bankerWinCount, this.finishData.playerWinCount, this.finishData.tieWinCount, this.finishData.bankerPairCount, this.finishData.playerPairCount);
        let typeWin = this.finishData.history.slice().pop();
        this.historyResult.updateHistoryBigRoad(typeWin);
        let tableCom = this.TableBet.getComponent("TableBetBaccarat");
        if (this.isHavePair) // Van nay co pair.
            if (this.sideWinPair === SIDE_WINPAIR.BOTHPB) {
                tableCom.effWinSide(SIDE_WINPAIR.PLAYER);
                tableCom.effWinSide(SIDE_WINPAIR.BANKER);
            } else if (this.sideWinPair !== SIDE_WINPAIR.NONE) tableCom.effWinSide(this.sideWinPair);
        tableCom.effWinSide(this.sideWin);
        for (let i = 0; i < this.players.length; i++) {
            this.players[i]._playerView.agLose = 0;
        }
        setTimeout(() => {
            if (this.node === null) return;
            let count = 0;
            let i = 0;
            let size = this.listChipBet.length;
            for (i = 0; i < size; i++) {
                let chipbet = this.listChipBet[i];
                let player = this.getPlayerWithId(chipbet.pid);
                let conditionPair1 = chipbet.typeBet !== this.sideWinPair;
                let conditionPair2 = chipbet.typeBet !== SIDE_WINPAIR.PLAYER && chipbet.typeBet !== SIDE_WINPAIR.BANKER;
                let conditionPair = this.sideWinPair !== SIDE_WINPAIR.BOTHPB ? conditionPair1 : conditionPair2;
                if (chipbet.typeBet !== this.sideWin && conditionPair) {
                    count++;
                    chipbet.onSideLose();
                    player._playerView.agLose -= chipbet.chipDeal;
                }
            }
            this.showEffLoseSide();
            if (count !== 0) { //co thang thua.delay 1.5s de xu ly chip thua truoc.Roi moi den chip win.
                setTimeout(() => {
                    require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_nemxu);
                    require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_lose);
                }, 1000);
                setTimeout(() => {
                    if (this.node === null) return;
                    this.BoxbetParent.setValueBoxbet();
                    this.TableBet.getComponent("TableBetBaccarat").setLbValue();
                    this.resolveChipWin();
                }, 2000);
            } else {
                this.resolveChipWin();
                this.TableBet.getComponent("TableBetBaccarat").setLbValue();
                this.BoxbetParent.setValueBoxbet();
            } // k co thang nao thua thi resolve chip win luon;
        }, 1500);
    },
    setCardDark(sideWin) {
        if (sideWin === SIDE_BET.TIE) return;
        let isPlayerWin = sideWin === SIDE_BET.PLAYER ? true : false;
        let arrCardLose = isPlayerWin ? this.arrCardB : this.arrCardP;
        let arrCardWin = isPlayerWin ? this.arrCardP : this.arrCardB;
        for (let i = 0; i < arrCardLose.length; i++) {
            arrCardLose[i].setDark(true, this.spr_CardDark);
        }
        for (let i = 0; i < arrCardWin.length; i++) {
            arrCardWin[i].setEffectCard(40);
        }
    },
    resolveChipWin() {
        let size2 = this.dataPlayerBet.length;
        for (let i = 0; i < size2; i++) {
            let data = this.dataPlayerBet[i];
            this.createChipWin(data);
        }
        let size = this.listChipWin.length;
        let timeXlChipWin = size > 0 ? 5 : 2;
        setTimeout(() => {
            if (this.node === null) return;
            let i = 0;
            let player;
            for (i = 0; i < size; i++) {
                let chipbet = this.listChipWin[i];
                for (let j = 0; j < this.players.length; j++) {
                    player = this.players[j];
                    if (chipbet.pid === player.id) {
                        let tableCom = this.TableBet.getComponent("TableBetBaccarat");
                        let chipbetwin = player._playerView.getChipbet(chipbet.typeBet);
                        let sidePos = tableCom.getChipPosOnSide(chipbetwin.typeBet, player._indexDynamic);
                        if (j === 0)
                            require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_chipwin_shan2);
                        chipbet.onSideWin(cc.v2(sidePos.x + 5, sidePos.y));
                    }
                    setTimeout(() => {
                        if (this.node === null) return;
                        let listChipWin = this.getChipWinPlayer(player);
                        for (let i = 0; i < listChipWin.length; i++) {
                            let player = this.getPlayerWithId(listChipWin[i].pid);
                            listChipWin[i].chipMoveTo(player._playerView.node.position, false);
                        }
                    }, 2500);
                }
            }
        }, 1000);
        setTimeout(() => {
            if (this.node !== null && size > 0) {
                require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.resultWin);
            }
        }, 3500);
        let deltime = size > 0 ? 3.5 : 1;
        setTimeout(() => {
            if (this.node === null) return;
            this.showEffWinSide();
        }, deltime * 1000);
        setTimeout(() => {
            if (this.node === null) return;
            this.resetGameView();
        }, timeXlChipWin * 1500);
    },
    getChipWinPlayer(player) {
        let listChipWin = [];
        for (let i = 0; i < this.listChipBet.length; i++) {
            let chipBet = this.listChipBet[i];
            if (chipBet.typeBet === this.sideWin)
                listChipWin.push(chipBet);
            if (this.sideWinPair !== SIDE_WINPAIR.NONE) {
                if (this.sideWinPair === SIDE_WINPAIR.BOTHPB) {
                    if (chipBet.typeBet === SIDE_WINPAIR.PLAYER || chipBet.typeBet === SIDE_WINPAIR.BANKER) {
                        listChipWin.push(chipBet);
                    }
                } else if (chipBet.typeBet === this.sideWinPair) {
                    listChipWin.push(chipBet);
                }
            }
        }
        return listChipWin;
    },
    resetGameView() {
        // resolve Card
        for (let i = 0; i < this.finishData.results.length; i++) {
            if (this.finishData.results[i].pid === this.thisPlayer.id) {
                if (require('GameManager').getInstance().user.vip < 1)
                    require('NetworkManager').getInstance().sendUpVip();
            }
        }
        for (let i = 0; i < this.listcard.length; i++) {
            let card = this.listcard[i];
            card.effCard.node.active = false;
            card.node.stopAllActions();
            card.node.runAction(cc.sequence(cc.delayTime(0.1 * i),
                cc.spawn(cc.moveTo(0.5, this.cardDeckL.position), cc.rotateTo(0.5, 270),
                    cc.callFunc(() => {
                        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_cardPlip);
                        card.setDark(false, this.spr_CardDark);
                        card.setTextureWithCode(0);
                    })),
                cc.callFunc(() => {
                    card.node.active = false;
                })));
        }
        setTimeout(() => {
            if (this.node === null) return;
            let text = require("GameManager").getInstance().getTextConfig("binh_wait_for_next_game");
            if (this.notiViewTable) this.notiViewTable.destroy();
            this.notiViewTable = this.createNotification(text, true);
            this.notiViewTable.setPosition(0, 140);
            this.notiViewTable.runAction(cc.fadeTo(0.5, 255));
            this.clearAllCard();
            this.stateGame = 0;
            require("HandleGamePacket").NextEvt();
        }, 1000);
        //resolve Boxbet
        this.BoxbetParent.resetBoxbet();
        this.scoreB = 0;
        this.scoreP = 0;
        this.chipDeal = 0;
        this.BoxbetParent.node.active = false;
        this.ButtonBet.node.active = false;
        this.lbScore_P.node.getParent().active = false;
        this.lbScore_B.node.getParent().active = false;
        this.isRebet = false;
        for (let i = 0; i < this.players.length; i++) {
            this.players[i]._playerView.listChipBetPl = [];
        }
        this.listChipWin = [];
        for (let i = 0; i < this.listChipBet.length; i++) {
            this.listChipBet[i].node.destroy();
        }
        this.TableBet.getComponent("TableBetBaccarat").reset();
        this.listChipBet = [];
        this.curChipBet = 0;
        this.stateGame = STATE_GAME.WAITING;
        if (cc.sys.localStorage.getItem("isBack") == 'true') require('NetworkManager').getInstance().sendExitGame();
    },
    clearAllCard() {


        for (let i = 0; i < this.listcard.length; i++) {
            this.cardPool.put(this.listcard[i].node);
        }
        this.listcard = [];
        this.arrCardB = [];
        this.arrCardP = [];
    },
    createChipWin(data) {
        //let player = this.getPlayerWithId(data.pid);
        // player._playerView.agWin = 0;
        if (data.playerSide.chip > 0 && this.sideWin === SIDE_BET.PLAYER) {
            this.initChipWin(data.pid, data.playerSide.chip, SIDE_BET.PLAYER);
        }
        if (data.bankerSide.chip > 0 && this.sideWin === SIDE_BET.BANKER) {
            this.initChipWin(data.pid, data.bankerSide.chip, SIDE_BET.BANKER);
        }
        if (this.sideWinPair === SIDE_WINPAIR.BOTHPB) {
            if (data.bankerPairSide.chip > 0) {
                this.initChipWin(data.pid, data.bankerPairSide.chip, SIDE_BET.BANKER_PAIR);
            }
            if (data.playerPairSide.chip > 0) {
                this.initChipWin(data.pid, data.playerPairSide.chip, SIDE_WINPAIR.PLAYER);
            }
        }
        if (data.bankerPairSide.chip > 0 && this.sideWinPair === SIDE_BET.BANKER_PAIR) {
            this.initChipWin(data.pid, data.bankerPairSide.chip, SIDE_BET.BANKER_PAIR);
        }
        if (data.playerPairSide.chip > 0 && this.sideWinPair === SIDE_WINPAIR.PLAYER) {
            this.initChipWin(data.pid, data.playerPairSide.chip, SIDE_WINPAIR.PLAYER);
        }
        if (data.tieSide.chip > 0 && this.sideWin === SIDE_BET.TIE) {
            this.initChipWin(data.pid, data.tieSide.chip, SIDE_BET.TIE);
        }
    },
    initChipWin(pid, value, typeBet, index) {
        let agWin = value;
        switch (typeBet) {
            case SIDE_BET.TIE:
                agWin = value * 8;
                break;
            case SIDE_BET.PLAYER_PAIR:
            case SIDE_BET.BANKER_PAIR:
                agWin = value * 11;
                break;
        }
        let randX = this.generateRandomNumber(-50, 50);
        let randY = this.generateRandomNumber(this.node.getChildByName("chip_Table").y - 20, this.node.getChildByName("chip_Table").y + 20);
        let posChip = cc.v2(randX, randY);
        let ChipBet = this.createChipBet(typeBet, agWin, posChip);
        ChipBet.node.active = false;
        ChipBet.pid = pid;
        this.listChipWin.push(ChipBet);
        this.listChipBet.push(ChipBet);
        ChipBet.effectAppear();
    },
    onDatCuoc(event, data) {
        require("NetworkManager").instance.sendBetBaccarat(this.curChipBet, data); // online
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("onBet_%s", require('GameManager').getInstance().getCurrentSceneName()));
        //require("DataForGameBaccarat").getInstance().bet(this.curChipBet, data); // offline Loc
    },
    onClickRebet(isDouble = false) {
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_click);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickRebet_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.isRebet = true;
        let dataBet = this.BoxbetParent.dataBet;
        if (dataBet.length === 0) return;
        if (this.totalBetLastMatch > this.thisPlayer.ag) {
            let text = "You do not have enough chips!";
            let notiBkg = this.createNotification(text);
            notiBkg.stopAllActions();
            notiBkg.runAction(cc.sequence(cc.fadeTo(0.5, 255), cc.delayTime(1.0), cc.fadeTo(0.5, 0)), cc.callFunc(() => {
                notiBkg.node.destroy();
            }));
            return;
        }
        for (let i = 0; i < dataBet.length; i++) {
            let data = dataBet[i];
            let value = isDouble ? data.value * 2 : data.value;
            require("NetworkManager").instance.sendBetBaccarat(value, data.typeBet); // online
            //require("DataForGameBaccarat").getInstance().bet(value, data.typeBet); // offline Loc
        }
        this.ButtonBet.btn_Rebet.interactable = false;
    },
    createChipBet(typeBet, value, posInit) {
        let ChipBet = cc.instantiate(this.ChipBetPr).getComponent("ChipbetBaccarat");
        this.node.addChild(ChipBet.node);
        ChipBet.node.zIndex = 50;
        ChipBet.posChip = cc.v2(posInit.x, posInit.y);
        ChipBet.setChip(value, this.agTable, typeBet);
        return ChipBet;
    },
    onClickDouble() {
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_click);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickDouble_%s", require('GameManager').getInstance().getCurrentSceneName()));
        for (let i = 0; i < this.playerView.listChipBetPl.length; i++) {
            let chip = this.playerView.listChipBetPl[i];
            let value = chip.chipDeal;
            let sideBet = chip.typeBet;
            require("NetworkManager").instance.sendBetBaccarat(value, sideBet); // online
            //require("DataForGameBaccarat").getInstance().bet(value, sideBet); // offline Loc

        }
        //this.ButtonBet.btn_Rebet.interactable = false;
        this.ButtonBet.btn_Double.interactable = false;
        clearTimeout(this.timeDouble);
    },
    autoExit() {
        require('NetworkManager').getInstance().sendExitGame();
    },
    setValueBtnBet(data) {
        data = parseInt(data);
        let size = this.listValue.length;
        for (let i = 0; i < size; i++) {
            if (this.thisPlayer.agPlayer < this.listValue[data - 1])
                data = data - 2;
        }
        if (data < 1) data = 1;
        this.chipDealLastMatch = data;
        switch (data) {
            case 1:
                this.curChipBet = this.minBet;
                break;
            case 2:
                this.curChipBet = this.minBet * 5;
                break;
            case 3:
                this.curChipBet = this.minBet * 10;
                break;
            case 4:
                this.curChipBet = this.minBet * 50;
                break;
            case 5:
                this.curChipBet = this.minBet * 100;
                break;
        }
    },
    onClickClear() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickClear_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.BoxbetParent.onPlayerClear();
        for (let i = 0; i < this.listChipBet.length; i++) {
            this.listChipBet[i].node.destroy();
        }
        this.thisPlayer._playerView.listChipBetPl = [];
        this.listChipBet = [];
    },
    onClickDeal() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickDeal_%s", require('GameManager').getInstance().getCurrentSceneName()));
        let listChipBet = this.playerView.listChipBetPl;
        for (let i = 0; i < listChipBet.length; i++) {
            let chipbet = listChipBet[i];
            chipbet.isBeted = true;
            require("NetworkManager").instance.sendBetBaccarat(chipbet.chipDeal, chipbet.typeBet);
        }
    },
    handleDatCuoc(data) {
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_bet);
        data = JSON.parse(data);

        if (data.chipBet === 0 && data.pid === this.thisPlayer.id) {
            let text;
            text = "Min Chip To  Bet Is: " + require("GameManager").getInstance().formatMoney(this.agTable) + ". Max Chip To Bet Is: " + require("GameManager").getInstance().formatMoney(this.agTable * 100);
            let notiBkg = this.createNotification(text);
            notiBkg.stopAllActions();
            notiBkg.runAction(cc.sequence(cc.fadeTo(0.5, 255), cc.delayTime(0.5), cc.fadeTo(0.5, 0)), cc.callFunc(() => {
                notiBkg.node.destroy();
            }));
            return;
        }
        let player = this.getPlayerWithId(data.pid);
        let index = player._indexDynamic;
        let isThisPlayer = data.pid === this.thisPlayer.id ? true : false;
        player._playerView.totalAgBet = data.betTotal;
        if (isThisPlayer) {
            this.stateGame = STATE_GAME.PLAYING;
            this.BoxbetParent.onBet(data.side, data.chipBet);
            this.timeDouble = setTimeout(() => {
                this.ButtonBet.btn_Double.interactable = true;
            }, 1000)
            let Pvalue = this.BoxbetParent.PValue;
            let PPvalue = this.BoxbetParent.PPValue;
            let Bvalue = this.BoxbetParent.BValue;
            let BPvalue = this.BoxbetParent.BPValue;
            let Tievalue = this.BoxbetParent.TieValue;
            if (this.playerView.totalAgBet * 2 > this.thisPlayer.ag ||
                Pvalue == this.agTable * 100 && PPvalue == this.agTable * 100 && Bvalue == this.agTable * 100 &&
                BPvalue == this.agTable * 100 && Tievalue == this.agTable * 100) {
                setTimeout(() => {
                    this.ButtonBet.btn_Double.interactable = false;
                    this.ButtonBet.btn_Rebet.interactable = false;
                }, 1000)
            }
            this.totalBetLastMatch = data.betTotal;

        }
        let nameChipDeal = require("GameManager").getInstance().formatMoneyChip(data.chipBet);
        if (this.sprListChip.getSpriteFrame(nameChipDeal) !== null) { // neu get dc chip thi tao 1 icon chip bay ra tu player.
            this.effDatCuocChip(player, data.chipBet, data.side, false);
        } else { // neu ko get dc thi tao effect chipbet (nhieu chip) bay ra tu player(case nay thuong la player rebet hoac double ne se k get dc icon chip tu atlas)
            let tableCom = this.TableBet.getComponent("TableBetBaccarat");
            let posSide = tableCom.getChipPosOnSide(data.side, index);
            let ChipBet = this.createChipBet(data.side, data.chipBet, this.listPosView[index]);
            ChipBet.chipMoveTo(posSide);
            setTimeout(() => {
                if (this.node === null) return;
                this.effDatCuocChip(player, data.chipBet, data.side, true);
            }, 400);
            setTimeout(() => {
                if (this.node === null) return;
                ChipBet.node.destroy();
            }, 1000);
        }
        player.ag -= data.chipBet;
        player.updateMoney();
        if (isThisPlayer && player.ag < this.curChipBet) {
            // for (let i = this.listValue.length - 1; i >= 0; i--) {
            //     if (player.ag >= this.listValue[i]) {
            //         this.ButtonBet.onClickChip(null, i + 1);
            //         break;
            //     }
            // }
            // if (player.ag < this.listValue[0])
            //     this.curChipBet = player.ag;
            this.curChipBet = player.ag;
        }
        this.ButtonBet.setStateButtonChip(this.thisPlayer.ag);
    },

    showEffWinSide() {
        let results = this.finishData.results;
        for (let i = 0; i < results.length; i++) {
            let player = this.getPlayerWithId(results[i].pid);
            player.ag = results[i].AG;
            player.updateMoney();
            if (player === this.thisPlayer) {
                require('GameManager').getInstance().user.ag = results[i].AG;
                require("UIManager").instance.updateChipUser();

                require('SMLSocketIO').getInstance().emitUpdateInfo();
            }
            if (results[i].agWin < 0) continue;
            let index = this.getDynamicIndex(this.getIndexOf(player));
            if (results[i].agWin > 999) {
                let delta = 0;
                if (index === 2) delta = -100;
                if (index === 3) delta = 100;
                player._playerView.effectFlyMoney(results[i].agWin, 45, 100, delta, 0);
            }
            else player._playerView.effectFlyMoney(results[i].agWin, 45, 100);

        }
    },
    showEffLoseSide() {
        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];
            if (player._playerView.agLose > 0) continue;
            let index = this.getDynamicIndex(this.getIndexOf(player));
            if (index === 2 && player._playerView.agLose > 999) player._playerView.effectFlyMoney(player._playerView.agLose, 45, 100, -100, 0);
            else player._playerView.effectFlyMoney(player._playerView.agLose, 45, 100);
        }
    },
    setGameInfo(m, id) {
        this.agTable = m;
        this.lbInfo.string = "ID: " + id;
        this.lb_MinBet.string = "MIN BET: " + require("GameManager").getInstance().formatMoney(m);
        this.lb_MaxBet.string = "MAX BET: " + require("GameManager").getInstance().formatMoney(m * 100);
        require("GameManager").getInstance().table_mark = m;
    },
    handleBetError(data) {
        data = JSON.parse(data);
        setTimeout(() => {
            this.ButtonBet.btn_Double.interactable = false;
        }, 1000)
        let text;
        if (data.actionResult === "MAX_BET") {
            this.TableBet.getComponent("TableBetBaccarat").hideButton(false);
            text = "You can not bet more than 20 times per round";
        } else {
            if (data.actionResult === "NOT_ENOUGH_AG")
                text = "You Do Not Have Enough Chips To Bet!"
            else return;
        }
        let notiBkg = this.createNotification(text);
        notiBkg.stopAllActions();
        notiBkg.runAction(cc.sequence(cc.fadeTo(0.5, 255), cc.delayTime(1.0), cc.fadeTo(0.5, 0)), cc.callFunc(() => {
            notiBkg.node.destroy();
        }));
    },
    createNotification(text, isCountDown = false) {
        // let notiBkg = this.node.getChildByName("NotificationNode");
        // if (!notiBkg) {
        let notiBkg = new cc.Node();
        notiBkg.name = "NotificationNode";
        let spr = notiBkg.addComponent(cc.Sprite);
        spr.spriteFrame = this.spr_Shadow;
        let content = new cc.Node();
        content.name = "content";
        content.addComponent(cc.Label);
        notiBkg.addChild(content);
        content.on("size-changed", () => {
            notiBkg.setContentSize(cc.size(content.width + 50, content.height + 20));

        });
        content.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        this.node.addChild(notiBkg, 55);
        // }
        this.lb_noti = notiBkg.getChildByName("content").getComponent(cc.Label);
        this.lb_noti.node.setAnchorPoint(cc.v2(0, 0.5));
        // this.lb_noti.horizontalAlign=0;
        this.lb_noti.string = text;
        if (isCountDown) this.lb_noti.string = text + "...";
        content.off("size-changed");
        this.lb_noti.node.position = cc.v2(-this.lb_noti.node.width / 2, 0);
        if (isCountDown) {
            let text1 = text + ".";
            let text2 = text + "..";
            let text3 = text + "...";
            this.lb_noti.node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(() => {
                this.lb_noti.string = text1;
            }), cc.delayTime(1.0),
                cc.callFunc(() => {
                    this.lb_noti.string = text2;
                }),
                cc.delayTime(1.0),
                cc.callFunc(() => {
                    this.lb_noti.string = text3;
                }), cc.delayTime(1.0))));
        }
        notiBkg.active = true;
        notiBkg.opacity = 0;
        return notiBkg;
    },
    effDatCuocChip(player, value, typeBet, isRebet = false) {

        let tableCom = this.TableBet.getComponent("TableBetBaccarat");
        let posSide = tableCom.getChipPosOnSide(typeBet, player._indexDynamic, value);
        let pos = player._playerView.node.position;
        if (!isRebet) {
            let ic_Chip = this.initIcChip(value, typeBet, player);
            ic_Chip.position = pos;
            this.node.addChild(ic_Chip);
            ic_Chip.stopAllActions();
            ic_Chip.runAction(cc.sequence(cc.moveTo(0.1, posSide), cc.callFunc(() => {
                this.icChipPool.put(ic_Chip);
            })));
        }
        setTimeout(() => {
            if (this.node === null) return;
            let ChipBet = player._playerView.getChipbet(typeBet);
            if (ChipBet) {
                ChipBet.getComponent("ChipbetBaccarat").setChip(value, this.agTable, typeBet);
            } else {
                ChipBet = this.createChipBet(typeBet, value, posSide);
                ChipBet.node.name = typeBet;
                ChipBet.pid = player.id;
                this.listChipBet.push(ChipBet);
                player._playerView.listChipBetPl.push(ChipBet);
            }
        }, 150);
    },
    initIcChip(value) {
        let nameChipDeal = require("GameManager").getInstance().formatMoneyChip(value);
        let icChip;
        if (this.icChipPool.size() < 1) {
            icChip = new cc.Node();
            icChip.addComponent(cc.Sprite);
            icChip.setScale(0.5);
        } else icChip = this.icChipPool.get();
        let spr_ic_Chip = icChip.getComponent(cc.Sprite);
        spr_ic_Chip.spriteFrame = this.sprListChip.getSpriteFrame(nameChipDeal);
        return icChip;
    },
    updatePositionPlayerView() {
        for (let i = 0; i < this.players.length; i++) {
            let index = this.getDynamicIndex(this.getIndexOf(this.players[i]));
            this.players[i]._playerView.node.position = this.listPosView[index];
            this.players[i]._indexDynamic = index;
        }
    },
    getDynamicIndex(index) {
        if (index === 0) return 0;
        var _index = index;
        if (this.players.length < 3) {
            _index++;
        }
        return _index;
    },
    handleBetTime(data) {
        this.itemChatNgoaiGame.node.active = false;
        if (this.historyResult.Tb_His_Detail.active)
            this.historyResult.tableHisDetailPopOff();
        data = JSON.parse(data);
        this.stateGame = STATE_GAME.WAITING;
        let betTime = data.finishAfter;
        this.countDownTime(betTime);
        this.TableBet.getComponent("TableBetBaccarat").hideButton(true);
        if (this.notiViewTable !== null) {
            this.notiViewTable.runAction(cc.sequence(cc.fadeTo(0.5, 0),
                cc.callFunc(() => {
                    //this.notiViewTable.destroy();
                    this.lb_noti.node.stopAllActions();
                })));
        }
    },
    countDownTime(time) {
        let i = parseInt(time / 1000);
        this.node.runAction(cc.repeat(cc.sequence(cc.callFunc(() => {
            if (i > 0) {
                require('SoundManager1').instance.playClockTick();
                i--;
            }
        }), cc.delayTime(1.0)), i));
        for (let i = 0; i < this.players.length; i++) {
            // this.players[i]._playerView.setTurn(true, parseInt(time / 1000) - 1);
        }
        let clock = cc.instantiate(this.clockPr).getComponent("CountDownTime");
        if (parseInt(time / 1000) > 1) this.node.addChild(clock.node);
        let pos = this.node.getChildByName("chip_Table").position;
        clock.node.position = cc.v2(pos.x, pos.y - 200);
        clock.node.runAction(cc.moveTo(0.5, cc.v2(0, 170)).easing(cc.easeBackOut()));
        if (this.BoxbetParent === null) {
            this.BoxbetParent = cc.instantiate(this.BoxbetPr).getComponent("BoxbetBaccarat");
            this.node.addChild(this.BoxbetParent.node);
        } else this.BoxbetParent.node.active = true;
        if (this.ButtonBet === null || typeof this.ButtonBet === "undefined") {
            this.ButtonBet = cc.instantiate(this.ButtonBetGamePr).getComponent("ButtonBetBaccarat");
            this.node.addChild(this.ButtonBet.node);
        }
        this.ButtonBet.node.active = true;
        // this.ButtonBet.setStateButtonChip(this.thisPlayer.ag);
        if (this.BoxbetParent.dataBet.length === 0)
            this.ButtonBet.btn_Rebet.interactable = false;
        clock.setInfo(parseInt(time / 1000) - 1, 2);
    },
    generateRandomNumber(min_value, max_value) {
        let random_number = Math.random() * (max_value - min_value) + min_value;
        return Math.floor(random_number);
    },
    // update (dt) {},
});
module.export = BaccaratView;