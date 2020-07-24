var GameView = require('GameView2');
var LogicManager = require('LogicManager');

var SCALE_CARD = 0.55

var BinhGamView = cc.Class({
    extends: GameView,

    properties: {
        listPosCard: {
            default: [],
            type: [cc.Vec2]
        },

        sortCardPos: {
            default: [],
            visible: false,
            type: [cc.Vec2]
        },

        bgTime: {
            default: null,
            type: cc.Sprite
        },

        lbTime: {
            default: null,
            type: cc.Label
        },

        bgStartTime: {
            default: null,
            type: cc.Sprite
        },

        lbStartTime: {
            default: null,
            type: cc.Label
        },

        lbTextSortChi1: {
            default: null,
            type: cc.Label
        },

        lbTextSortChi2: {
            default: null,
            type: cc.Label
        },

        lbTextSortChi3: {
            default: null,
            type: cc.Label
        },

        textBinhSpecial: {
            default: null,
            type: cc.Sprite
        },

        vectorTextPlayer: {
            default: [],
            type: [cc.Sprite]
        },

        vectorBinhSpecial: {
            default: [],
            type: [cc.Sprite]
        },

        atlasText: {
            default: null,
            type: cc.SpriteAtlas
        },

        vectorTotalPoint: {
            default: [],
            type: [cc.Label]
        },

        bgMyScore: {
            default: null,
            type: cc.Sprite
        },

        lbTextChi1: {
            default: null,
            type: cc.Label
        },

        lbTextChi2: {
            default: null,
            type: cc.Label
        },

        lbTextChi3: {
            default: null,
            type: cc.Label
        },

        lbScoreChi1: {
            default: null,
            type: cc.Label
        },

        lbScoreChi2: {
            default: null,
            type: cc.Label
        },

        lbScoreChi3: {
            default: null,
            type: cc.Label
        },

        btnXepBai: {
            default: null,
            type: cc.Button
        },

        btnDoiChi: {
            default: null,
            type: cc.Button
        },

        btnSoBai: {
            default: null,
            type: cc.Button
        },

        btnXepLai: {
            default: null,
            type: cc.Button
        },

        btnDeclare: {
            default: null,
            type: cc.Button
        },

        btnSortCard: {
            default: null,
            type: cc.Button
        },

        btnJackPot: {
            default: null,
            type: cc.Button
        },

        vtJackPot: {
            default: [],
            type: [cc.Label]
        },

        layerSortCard: {
            default: null,
            type: cc.Node
        },

        spMarkChi1: {
            default: null,
            type: cc.Sprite
        },

        spMarkChi2: {
            default: null,
            type: cc.Sprite
        },

        spMarkChi3: {
            default: null,
            type: cc.Sprite
        },

        vtChipFinish: {
            default: [],
            visible: false,
            type: [cc.Node]
        },

        vectorShadowCard: {
            default: [],
            visible: false,
            type: [require('Card')]
        },

        aniStart: {
            default: null,
            type: sp.Skeleton
        },
        animFinish: {
            default: null,
            type: sp.Skeleton
        },

        animSpecial: {
            default: null,
            type: sp.Skeleton
        },

        lbNameWin: {
            default: null,
            type: cc.Label
        },

        avtSpecial: {
            default: null,
            type: cc.Sprite
        },

        textSpecialWin: {
            default: null,
            type: cc.Sprite
        },

        animJackPot: {
            default: null,
            type: sp.Skeleton
        },

        lbJackPot: {
            default: null,
            type: cc.Label
        },

        itemAnim: {
            default: null,
            type: cc.Prefab
        },
        showJackPot: {
            default: null,
            type: cc.Prefab
        },
        animSapCaLang: {
            default: null,
            type: sp.SkeletonData,
        },

        animXeTank: {
            default: null,
            type: sp.SkeletonData,
        },
        spr_Shadow: cc.SpriteFrame,
        animBoom: {
            default: null,
            type: sp.SkeletonData,
        },
        _isExit:true,
        isFinish : false,
        isJackPot: false,
    },

    onLoad() {
        this._super();
        this.cardDefine = this.getCard();
        this.timeToStart = 0;
        this.remainingTime = 0;
        this.startChi = [-1, 0, 3, 8];
        this.movePos = [];
        this.destPos = [];
        this.oldCardPos = [];
        this.currentHoldingCard = 0;
        this.isCanSortCard = false;
        this.isTouchMoved = false;
        this.isTapAgain = false;
        this.isMoved = false;
        this.isJumpMove = true;
        this.touchVector = cc.v2(0, 0);
        this.vecScoreBonus = [];
        this.vecInstantWin = [];
        this.clockVibrated = false;
        this.dangPhatBai = false;

        this.listDataPlayerResult = [];

        this.layerSortCard.on(cc.Node.EventType.TOUCH_START, (touch) => {

            if (this.stateGame !== STATE_GAME.PLAYING || this.isMoved || this.isTouchMoved) {
                this.isJumpMove = false
                return;
            }
            this._isExit = false;
            cc.NGWlog("ON TOUCH BEGAN");

            this.isTouchMoved = false;
            this.isTapAgain = false;
            this.isMoved = false;
            this.isJumpMove = true;
            var location = cc.v2(touch.getLocation());
            cc.NGWlog("--==-=-=-=-=-=--=-=-=-=-=>>>>> Binh Position: " + location);

            if (!this.isCanSortCard || this.dangPhatBai) {
                this.isJumpMove = false
                return;
            }

            for (let i = this.thisPlayer.vectorCard.length - 1; i >= 0; i--) {
                let cardTaget = this.thisPlayer.vectorCard[i];
                let shadowCard = this.vectorShadowCard[i];

                if (shadowCard.node.getBoundingBoxToWorld().contains(location)) {
                    this.currentHoldingCard = i;
                    this.touchVector = location.sub(cardTaget.node.position);

                    let index = this.movePos.indexOf(i);

                    if (index === -1) {
                        if (this.movePos.length === 5) {
                            for (let id = 0; id < this.movePos.length; id++) {
                                let pos = this.movePos[id];
                                this.thisPlayer.vectorCard[pos].setDark(false);
                                cardTaget.node.zIndex = GAME_ZORDER.Z_MENU_VIEW + pos + 70;
                                this.vectorShadowCard[pos].setBorder(false);
                            }

                            this.movePos = [];
                        }

                        var size = this.movePos.length;
                        var curChi = this.getChi(i);
                        var curColumn = i - this.startChi[curChi];

                        var insertPos = 0;

                        while (insertPos < size) {
                            let cardPos = this.movePos[insertPos];
                            let chi = this.getChi(cardPos);
                            let column = cardPos - this.startChi[chi];

                            if (column > curColumn || (column === curColumn && chi > curChi))
                                break;

                            insertPos++;
                        }

                        this.oldCardPos.splice(insertPos, 0, cardTaget.node.position);
                        this.movePos.splice(insertPos, 0, i);
                        cardTaget.node.zIndex = GAME_ZORDER.Z_MENU_VIEW + 100;
                        cardTaget.setDark(true);
                        shadowCard.setBorder(true);
                        shadowCard.setTextureWithCode(cardTaget.encodeCard());
                        shadowCard.setCardOpacity(100);
                        cc.NGWlog("began so la bai da chon la: " + this.movePos.length);
                    }
                    else
                        this.isTapAgain = true;

                    return;
                }
            }

            this.isJumpMove = false;

        }, this);

        this.layerSortCard.on(cc.Node.EventType.TOUCH_MOVE, (touch) => {
            if (!this.isCanSortCard || !this.isJumpMove)
                return;

            cc.NGWlog("ON TOUCH MOVED");

            var size = this.movePos.length;

            if (size > 0) {
                var location = cc.v2(touch.getLocation());

                let card = this.thisPlayer.vectorCard[this.currentHoldingCard];
                var vec = location.sub(card.node.position);
                vec = vec.sub(this.touchVector);

                if (!this.isMoved && vec.mag() < 5)
                    return;

                this.isTouchMoved = true;
                this.isMoved = true;

                for (let i = 0; i < this.movePos.length; i++) {
                    card = this.thisPlayer.vectorCard[this.movePos[i]];
                    card.node.setPosition(card.node.position.add(vec));
                }

                this.destPos = [];

                for (let i = 0; i < this.thisPlayer.vectorCard.length; i++) {
                    this.thisPlayer.vectorCard[i].setDark(false);
                    this.vectorShadowCard[i].setBorder(false);
                }

                var maxSize;
                for (let i = this.vectorShadowCard.length - 1; i >= 0; i--) {
                    var index = i;
                    if (this.movePos.length > 2) {
                        if (i === 2 || i === 7 || i === 12)
                            index = i;
                        else
                            index = i + 1;
                    }

                    let shadowCard = this.vectorShadowCard[i];
                    if (shadowCard.node.getBoundingBox().contains(this.getCenterMovingCard())) {
                        if (this.getChi(i) === 1)
                            maxSize = 3;
                        else
                            maxSize = 5;

                        if (maxSize < size)
                            return;

                        this.destPos = this.getListPickCard(this.movePos, this.currentHoldingCard, index);

                        for (let j = 0; j < this.destPos.length; j++) {
                            var pos = this.destPos[j];

                            if (this.movePos.indexOf(pos) === -1)
                                this.thisPlayer.vectorCard[pos].setDark(true);
                        }

                        break;
                    }
                }
            }
        }, this);

        this.layerSortCard.on(cc.Node.EventType.TOUCH_END, (touch) => {

            if (!this.isCanSortCard || this.dangPhatBai)
                return;

            cc.NGWlog("ON TOUCH END");

            if (!this.isTouchMoved) {
                if (this.isTapAgain) {
                    for (let k = 0; k < this.movePos.length; k++) {
                        if (this.movePos[k] === this.currentHoldingCard) {
                            let card = this.thisPlayer.vectorCard[this.currentHoldingCard];
                            card.setDark(false);
                            card.node.zIndex = GAME_ZORDER.Z_MENU_VIEW + this.currentHoldingCard + 70;
                            this.vectorShadowCard[this.currentHoldingCard].setCardOpacity(1);
                            this.vectorShadowCard[this.currentHoldingCard].setBorder(false);
                            this.movePos.splice(k, 1);
                            this.oldCardPos.splice(k, 1);
                            cc.NGWlog("ended so la bai da chon la: " + this.movePos.length);
                            break;
                        }
                    }
                }

                this.updateTextBinh();
                return;
            }

            if (!this.isMoved)
                return;

            var isChi1 = false;
            var isChi2 = false;
            var isChi3 = false;

            if (this.destPos.length > 0) {
                cc.NGWlog("\n\n *** Chi1: %s, %s, %s **** \n", this.thisPlayer.vectorChi1[0].nameCard,
                    this.thisPlayer.vectorChi1[1].nameCard,
                    this.thisPlayer.vectorChi1[2].nameCard);
                cc.NGWlog("\n\n *** Chi2: %s, %s, %s, %s, %s **** \n", this.thisPlayer.vectorChi2[0].nameCard,
                    this.thisPlayer.vectorChi2[1].nameCard,
                    this.thisPlayer.vectorChi2[2].nameCard,
                    this.thisPlayer.vectorChi2[3].nameCard,
                    this.thisPlayer.vectorChi2[4].nameCard);
                cc.NGWlog("\n\n *** Chi3: %s, %s, %s, %s, %s **** \n", this.thisPlayer.vectorChi3[0].nameCard,
                    this.thisPlayer.vectorChi3[1].nameCard,
                    this.thisPlayer.vectorChi3[2].nameCard,
                    this.thisPlayer.vectorChi3[3].nameCard,
                    this.thisPlayer.vectorChi3[4].nameCard);

                this.sortMovingCard();

                var duration = 0.15;
                for (let i = 0; i < this.movePos.length; i++) {
                    let pos = this.movePos[i];
                    let card = this.thisPlayer.vectorCard[pos];
                    let shadowCard = this.vectorShadowCard[pos];
                    shadowCard.setBorder(false)
                    shadowCard.setCardOpacity(1);
                    let des = this.sortCardPos[this.destPos[i]];
                    card.setDark(false);
                    card.node.zIndex = GAME_ZORDER.Z_MENU_VIEW + this.destPos[i] + 70;
                    let move = cc.moveTo(duration, des).easing(cc.easeCubicActionInOut());
                    card.node.runAction(move);
                }

                var startPos = [];
                for (let i = 0; i < this.destPos.length; i++) {
                    let pos = this.destPos[i];

                    var chi = this.getChi(pos);
                    if (chi === 1)
                        isChi1 = true;
                    else if (chi === 2)
                        isChi2 = true;
                    else
                        isChi3 = true;

                    if (this.movePos.indexOf(pos) === - 1)
                        startPos.push(pos);
                }

                var endPos = [];
                for (let i = 0; i < this.movePos.length; i++) {
                    let pos = this.movePos[i];

                    var chi = this.getChi(pos);
                    if (chi === 1)
                        isChi1 = true;
                    else if (chi === 2)
                        isChi2 = true;
                    else
                        isChi3 = true;

                    if (this.destPos.indexOf(pos) === - 1)
                        endPos.push(pos);
                }

                cc.NGWlog("=-=-=-=-=-=-=-=-=->>> Binh SIZE STARTPOS = " + startPos);
                cc.NGWlog("=-=-=-=-=-=-=-=-=->>> Binh SIZE ENDPOS = " + endPos);

                for (let i = 0; i < startPos.length; i++) {
                    let card = this.thisPlayer.vectorCard[startPos[i]];
                    let des = this.sortCardPos[endPos[i]];
                    card.node.zIndex = GAME_ZORDER.Z_MENU_VIEW + endPos[i] + 70;
                    let move = cc.moveTo(duration, des).easing(cc.easeCubicActionInOut());
                    card.node.runAction(move);
                }

                for (let i = 0; i < this.thisPlayer.vectorCard.length - 1; i++) {
                    let zOrder = this.thisPlayer.vectorCard[i].node.zIndex; // 100
                    let realZOrder = GAME_ZORDER.Z_MENU_VIEW + 70 + i; // 010 0101 01232334
                    if (zOrder === realZOrder)
                        continue;

                    cc.NGWlog("-=-=-=--=-=-= >>> Binh Zorder = " + zOrder + "==-=- realzOrder = " + realZOrder);
                    for (let j = i + 1; j < this.thisPlayer.vectorCard.length; j++)
                        if (realZOrder === this.thisPlayer.vectorCard[j].node.zIndex) {
                            cc.NGWlog("-=-==--=-=-=-=-=->>>> Binh doi data chua");
                            let temp = this.thisPlayer.vectorCard[i];
                            this.thisPlayer.vectorCard[i] = this.thisPlayer.vectorCard[j];
                            this.thisPlayer.vectorCard[j] = temp;
                            break;
                        }
                }

                this.setZoderSortCard();
                this.splitChi(this.thisPlayer);
            }
            else
                this.moveBack();

            this.cleanMarkCard();
            this.updateTextBinh();
            this.showEffectCard(isChi1, isChi2, isChi3);

            this.isTouchMoved = false;
            this.isMoved = false;

        }, this);

        this.layerSortCard.on(cc.Node.EventType.TOUCH_CANCEL, (touch) => {
            if (!this.isCanSortCard || this.dangPhatBai)
                return;

            cc.NGWlog("ON TOUCH CANCEL");

            if (!this.isTouchMoved) {
                if (this.isTapAgain) {
                    for (let k = 0; k < this.movePos.length; k++) {
                        if (this.movePos[k] === this.currentHoldingCard) {
                            let card = this.thisPlayer.vectorCard[this.currentHoldingCard];
                            card.setDark(false);
                            card.node.zIndex = GAME_ZORDER.Z_MENU_VIEW + this.currentHoldingCard + 70;
                            this.vectorShadowCard[this.currentHoldingCard].setCardOpacity(1);
                            this.vectorShadowCard[this.currentHoldingCard].setBorder(false);
                            this.movePos.splice(k, 1);
                            this.oldCardPos.splice(k, 1);
                            cc.NGWlog("ended so la bai da chon la: " + this.movePos.length);
                            break;
                        }
                    }
                }

                return;
            }

            if (!this.isMoved)
                return;

            var isChi1 = false;
            var isChi2 = false;
            var isChi3 = false;

            if (this.destPos.length > 0) {
                cc.NGWlog("\n\n *** Chi1: %s, %s, %s **** \n", this.thisPlayer.vectorChi1[0].nameCard,
                    this.thisPlayer.vectorChi1[1].nameCard,
                    this.thisPlayer.vectorChi1[2].nameCard);
                cc.NGWlog("\n\n *** Chi2: %s, %s, %s, %s, %s **** \n", this.thisPlayer.vectorChi2[0].nameCard,
                    this.thisPlayer.vectorChi2[1].nameCard,
                    this.thisPlayer.vectorChi2[2].nameCard,
                    this.thisPlayer.vectorChi2[3].nameCard,
                    this.thisPlayer.vectorChi2[4].nameCard);
                cc.NGWlog("\n\n *** Chi3: %s, %s, %s, %s, %s **** \n", this.thisPlayer.vectorChi3[0].nameCard,
                    this.thisPlayer.vectorChi3[1].nameCard,
                    this.thisPlayer.vectorChi3[2].nameCard,
                    this.thisPlayer.vectorChi3[3].nameCard,
                    this.thisPlayer.vectorChi3[4].nameCard);

                this.sortMovingCard();

                var duration = 0.15;
                for (let i = 0; i < this.movePos.length; i++) {
                    let pos = this.movePos[i];
                    let card = this.thisPlayer.vectorCard[pos];
                    let shadowCard = this.vectorShadowCard[pos];
                    shadowCard.setBorder(false)
                    shadowCard.setCardOpacity(1);
                    let des = this.sortCardPos[this.destPos[i]];
                    card.setDark(false);
                    card.node.zIndex = GAME_ZORDER.Z_MENU_VIEW + this.destPos[i] + 70;
                    let move = cc.moveTo(duration, des).easing(cc.easeCubicActionInOut());
                    card.node.runAction(move);
                }

                var startPos = [];
                for (let i = 0; i < this.destPos.length; i++) {
                    let pos = this.destPos[i];

                    var chi = this.getChi(pos);
                    if (chi === 1)
                        isChi1 = true;
                    else if (chi === 2)
                        isChi2 = true;
                    else
                        isChi3 = true;

                    if (this.movePos.indexOf(pos) === - 1)
                        startPos.push(pos);
                }

                var endPos = [];
                for (let i = 0; i < this.movePos.length; i++) {
                    let pos = this.movePos[i];

                    var chi = this.getChi(pos);
                    if (chi === 1)
                        isChi1 = true;
                    else if (chi === 2)
                        isChi2 = true;
                    else
                        isChi3 = true;

                    if (this.destPos.indexOf(pos) === - 1)
                        endPos.push(pos);
                }

                cc.NGWlog("=-=-=-=-=-=-=-=-=->>> Binh SIZE STARTPOS = " + startPos);
                cc.NGWlog("=-=-=-=-=-=-=-=-=->>> Binh SIZE ENDPOS = " + endPos);

                for (let i = 0; i < startPos.length; i++) {
                    let card = this.thisPlayer.vectorCard[startPos[i]];
                    let des = this.sortCardPos[endPos[i]];
                    card.node.zIndex = GAME_ZORDER.Z_MENU_VIEW + endPos[i] + 70;
                    let move = cc.moveTo(duration, des).easing(cc.easeCubicActionInOut());
                    card.node.runAction(move);
                }

                for (let i = 0; i < this.thisPlayer.vectorCard.length - 1; i++) {
                    let zOrder = this.thisPlayer.vectorCard[i].node.zIndex; // 100
                    let realZOrder = GAME_ZORDER.Z_MENU_VIEW + 70 + i; // 010 0101 01232334
                    if (zOrder === realZOrder)
                        continue;

                    cc.NGWlog("-=-=-=--=-=-= >>> Binh Zorder = " + zOrder + "==-=- realzOrder = " + realZOrder);
                    for (let j = i + 1; j < this.thisPlayer.vectorCard.length; j++)
                        if (realZOrder === this.thisPlayer.vectorCard[j].node.zIndex) {
                            cc.NGWlog("-=-==--=-=-=-=-=->>>> Binh doi data chua");
                            let temp = this.thisPlayer.vectorCard[i];
                            this.thisPlayer.vectorCard[i] = this.thisPlayer.vectorCard[j];
                            this.thisPlayer.vectorCard[j] = temp;
                            break;
                        }
                }

                this.setZoderSortCard();
                this.splitChi(this.thisPlayer);
            }
            else
                this.moveBack();

            this.cleanMarkCard();
            this.updateTextBinh();
            this.showEffectCard(isChi1, isChi2, isChi3);

            this.isTouchMoved = false;
            this.isMoved = false;
        }, this);

        this.fullscreen();

        require("NetworkManager").getInstance().sendUpdateJackPot(GAME_ID.BINH);
    },

    start() {

    },

    fullscreen() {   // full
        this.node.setContentSize(cc.winSize);

        this.btnSortCard.node.active = false;
        this.layerSortCard.active = false;
        this.btnXepLai.node.active = false;
        this.bgMyScore.node.active = false;
        this.bgTime.node.active = false;
        this.bgStartTime.node.active = false;
        this.aniStart.node.active = false;
        this.animFinish.node.active = false;
        this.animJackPot.node.getParent().active = false;
        this.animSpecial.node.getParent().active = false;

        this.lbScoreChi1.node.active = false;
        this.lbScoreChi2.node.active = false;
        this.lbScoreChi3.node.active = false;
        this.lbTextChi1.node.active = false;
        this.lbTextChi2.node.active = false;
        this.lbTextChi3.node.active = false;

        // zindex
        this.bgTime.node.zIndex = GAME_ZORDER.Z_MENU_VIEW + 10;
        this.btnSortCard.node.zIndex = GAME_ZORDER.Z_MENU_VIEW - 1;
        this.layerSortCard.zIndex = GAME_ZORDER.Z_MENU_VIEW;
        this.bgMyScore.node.zIndex = GAME_ZORDER.Z_MENU_VIEW;
        this.animJackPot.node.getParent().zIndex = GAME_ZORDER.Z_MENU_VIEW;
        this.animSpecial.node.getParent().zIndex = GAME_ZORDER.Z_MENU_VIEW;


        for (let i = 0; i < 4; i++) {
            this.vectorTextPlayer[i].node.active = false;
            this.vectorTextPlayer[i].node.zIndex = GAME_ZORDER.Z_EMO;
            this.vectorBinhSpecial[i].node.active = false;
            this.vectorBinhSpecial[i].node.zIndex = GAME_ZORDER.Z_EMO;
            this.vectorTotalPoint[i].node.getParent().active = false;
            this.vectorTotalPoint[i].node.active = false;
            this.vectorTotalPoint[i].node.getParent().zIndex = GAME_ZORDER.Z_EMO;
        }

        for (let i = 0; i < 13; i++) {
            let cardShadow = this.getCard();
            cardShadow.node.setScale(0.95);
            cardShadow.node.anchorX = 0.5;
            cardShadow.node.anchorY = 0.5;
            this.layerSortCard.addChild(cardShadow.node);
            cardShadow.node.setPosition(this.getPositionSortCard(i));

            cardShadow.setCardOpacity(1);

            this.vectorShadowCard.push(cardShadow);
            this.sortCardPos.push(cardShadow.node.position);
        }
    },

    setJackPot(value) {
        for (let i = 0; i < this.vtJackPot.length; i++)
            this.vtJackPot[i].node.active = false;

        var strValue = value.toString();
        var str = strValue;

        for (let i = 0; i < 11 - strValue.length; i++)
            str = "0" + str;

        cc.NGWlog("-=-=-=--==--=-=-=--=--==->> Binh jackpot = " + str);

        for (let i = 0; i < str.length; i++) {
            let temp = str[i];
            this.vtJackPot[i].node.active = true;
            this.vtJackPot[i].string = temp;
            this.vtJackPot[i].node.runAction(cc.sequence(cc.scaleTo(0.15, 1.2).easing(cc.easeSineInOut()), cc.scaleTo(0.15, 1).easing(cc.easeSineInOut())));
        }
        Global.NodeGameListView.setJackPot(GAME_ID.BINH, false);
    },

    showJackpotWin(name, chip) {
        let player = this.getPlayer(name);
        if (!player){
            return;
        }
        var str = cc.js.formatStr(require('GameManager').getInstance().getTextConfig("binh_jackpot_win"), player.displayName, require('GameManager').getInstance().formatNumber(chip));
        this.lbJackPot.string = str;
        this.animJackPot.node.getParent().active = true;
        this.animJackPot.setAnimation(0, "animation", true);
        this.animJackPot.node.getParent().setScale(0);
        this.animJackPot.node.getParent().runAction(cc.scaleTo(0.2, 1));
        this.isJackPot = true;
        player._playerView.chipJackpot = chip;

        player.ag += chip;
        player._playerView.effectFlyMoney(chip);

        this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(() => {
            this.animJackPot.node.getParent().active = false;
        })));
    },



    handleCTable(strData) {
        this._super(strData);

        let data = JSON.parse(strData);
        this.vecScoreBonus = [];
        if (data.bonusScore) {
            for (let i = 0; i < data.bonusScore.length; i++)
                this.vecScoreBonus.push(data.bonusScore[i]);
        }

        this.vecInstantWin = [];
        if (data.instantWin) {
            for (let i = 0; i < data.instantWin.length; i++)
                this.vecInstantWin.push(data.instantWin[i]);
        }
    },

    handleSTable(strData) {
        this.resetGameDisplay();
        this._super(strData);
        let data = JSON.parse(strData);
        this.vecScoreBonus = [];
        if (data.bonusScore) {
            for (let i = 0; i < data.bonusScore.length; i++)
                this.vecScoreBonus.push(data.bonusScore[i]);
        }

        this.vecInstantWin = [];
        if (data.instantWin) {
            for (let i = 0; i < data.instantWin.length; i++)
                this.vecInstantWin.push(data.instantWin[i]);
        }
        if (this.bkgNoti) this.bkgNoti.destroy();
    },

    handleVTable(strData) {
        this._super(strData);
        this.connectGame(strData);

        let data = JSON.parse(strData);

        this.vecScoreBonus = [];
        if (data.bonusScore) {
            for (let i = 0; i < data.bonusScore.length; i++)
                this.vecScoreBonus.push(data.bonusScore[i]);
        }

        this.vecInstantWin = [];
        if (data.instantWin) {
            for (let i = 0; i < data.instantWin.length; i++)
                this.vecInstantWin.push(data.instantWin[i]);
        }

        if (data.result) {
            var text = require('GameManager').getInstance().getTextConfig("txt_dang_so_bai");
            text = text.replace('...','');
            //require('GameManager').getInstance().onShowToast(text);
            this.bkgNoti = this.createNotification(text, true);
            this.bkgNoti.runAction(cc.fadeTo(0.5, 255));
        }
        else {
            var text = require('GameManager').getInstance().getTextConfig("txt_view_table");
            //  require('GameManager').getInstance().onShowToast(text);
            this.bkgNoti = this.createNotification(text);
            this.bkgNoti.runAction(cc.fadeTo(0.5, 255));
            this.setTimeout(() => {
                if (this.bkgNoti) this.bkgNoti.destroy();
            }, 3000);
            this.countDown(data.T);
            this.initPlayerCard();
        }
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
        this.node.addChild(notiBkg, GAME_ZORDER.Z_CARD + 20);
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
    handleRJTable(strData) {
        this._super(strData);
        this.connectGame(strData);

        let data = JSON.parse(strData);

        this.vecScoreBonus = [];
        if (data.bonusScore) {
            for (let i = 0; i < data.bonusScore.length; i++)
                this.vecScoreBonus.push(data.bonusScore[i]);
        }

        this.vecInstantWin = [];
        if (data.instantWin) {
            for (let i = 0; i < data.instantWin.length; i++)
                this.vecInstantWin.push(data.instantWin[i]);
        }

        if (data.result) {
            this.stateGame = STATE_GAME.WAITING;
            // var text = require('GameManager').getInstance().getTextConfig("txt_dang_so_bai");
            // require('GameManager').getInstance().onShowToast(text);
            var text = require('GameManager').getInstance().getTextConfig("txt_dang_so_bai");
            text = text.replace('...','');
            this.bkgNoti = this.createNotification(text, true);
            this.bkgNoti.runAction(cc.fadeTo(0.5, 255));
        }
        else {
            this.countDown(data.T - 5);
            this.initPlayerCard();
        }
    },

    connectGame(strData) {
        var data = JSON.parse(strData);
        var listPlayer = data.ArrP;

        for (let i = 0; i < listPlayer.length; i++) {
            let player = this.getPlayer(listPlayer[i].N);

            player.mauBinhSoBai = !listPlayer[i].A;

            for (let j = 0; j < listPlayer[i].Arr.length; j++) {
                let card = this.getCard();
                card.decodeCard(listPlayer[i].Arr[j]);
                player.vectorCard.push(card);
            }
        }
    },

    initPlayerCard() {
        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];

            if (player === this.thisPlayer && this.stateGame === STATE_GAME.VIEWING)
                continue;

            let idexPos = this.getDynamicIndex(this.getIndexOf(player));
            let posCard = this.listPosCard[idexPos];

            for (let j = 0; j < player.vectorCard.length; j++) {
                let card = player.vectorCard[j];
                this.node.addChild(card.node, GAME_ZORDER.Z_CARD + j);
                card.setTextureWithCode(card.code);
                card.node.setScale(SCALE_CARD);
                card.node.setAnchorPoint(cc.v2(0.5, -0.5));
                card.node.setPosition(this.getPositionPlayerCard(j, posCard));
                card.node.setRotation(this.setGocQuay(j));

                if (player != this.thisPlayer) {
                    this.vectorTextPlayer[idexPos].node.active = true;
                    this.vectorTextPlayer[idexPos].node.position = this.listPosCard[idexPos].add(cc.v2(0, 120));

                    if (player.mauBinhSoBai)
                        this.vectorTextPlayer[idexPos].spriteFrame = this.atlasText.getSpriteFrame("ready");
                    else
                        this.vectorTextPlayer[idexPos].spriteFrame = this.atlasText.getSpriteFrame("arranging");
                }
            }

            this.splitChi(player);
        }

        if (this.stateGame === STATE_GAME.PLAYING)
            this.onClickXepLai();
    },

    countDownStart(time) {
        if (this.bkgNoti) this.bkgNoti.destroy();
        this.bgStartTime.node.active = true;

        this.timeToStart = parseInt(time);
        this.lbStartTime.string = time;

        this.resetGameDisplay();

        this.schedule(() => {
            this.updateTimeBinhStart(1);
        }, 1);
    },

    stopCountDownStart() {
        this.unscheduleAllCallbacks();
        this.bgStartTime.node.active = false;
    },

    updateTimeBinhStart(dt) {
        this.timeToStart -= dt;

        if (this.timeToStart > 0)
            this.lbStartTime.string = this.timeToStart.toString();
        else
            this.stopCountDownStart();
    },

    countDown(time) {
        this.bgTime.node.active = true;
        this.remainingTime = time;
        this.lbTime.string = time.toString();

        this.schedule(() => {

            if (this.remainingTime === 0)
                this.stopCountDown();

            this.updateBinhTime();
        }, 1);
    },

    stopCountDown() {
        this.unscheduleAllCallbacks();
        this.lbTime.node.stopAllActions();
        this.lbTime.node.color = cc.Color.GREEN;
        this.lbTime.node.position = cc.v2(0, -7);
        this.clockVibrated = false;
        this.bgTime.node.active = false;
    },

    updateBinhTime() {
        this.remainingTime--;

        if (this.remainingTime > 1) {
            cc.NGWlog("=--=-=-==--=-=-=-=->> Binh vào đây ko em ơi time = " + this.remainingTime);

            if (this.remainingTime <= 10) {
                require('SoundManager1').instance.dynamicallyPlayMusic('sounds/clock_hurry');
                var changeColorRed = cc.tintTo(1, cc.Color.RED);
                this.lbTime.node.runAction(changeColorRed);
            }
            else if (this.remainingTime > 10 && this.remainingTime <= 45) {
                require('SoundManager1').instance.dynamicallyPlayMusic('sounds/clock_tick');
                var changeColorYellow = cc.tintTo(1, cc.Color.YELLOW);
                this.lbTime.node.runAction(changeColorYellow);
            }
            else {
                require('SoundManager1').instance.dynamicallyPlayMusic('sounds/clock_tick');
                this.lbTime.node.color = cc.Color.GREEN;
            }

            this.lbTime.string = this.remainingTime.toString();

            if (!this.clockVibrated) {
                if (this.remainingTime === 10) {
                    this.clockVibrated = true;

                    let move = cc.moveBy(0.01, cc.v2(0, 7));
                    let act = cc.repeatForever(cc.sequence(move, move.reverse()));
                    this.lbTime.node.runAction(act);
                }
            }

            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i] !== this.thisPlayer && !this.players[i].mauBinhSoBai)
                    this.swapCard(this.players[i], this.remainingTime);
            }
        }
        else {
            cc.NGWlog("=--=-=-==--=-=-=-=->> Binh vào đây ko em ơi time1 = " + this.remainingTime);

            if (this.layerSortCard.active) {
                cc.NGWlog("=--=-=-==--=-=-=-=->> Binh vào đây ko em ơi time2 = " + this.remainingTime);
                var vtCard = [];
                for (let i = 0; i < this.thisPlayer.vectorCard.length; i++) {
                    vtCard.push(this.thisPlayer.vectorCard[i].code);
                }
        
                require('NetworkManager').getInstance().sendBinhDeclare(vtCard , this._isExit);   
            }

            this.stopCountDown();
        }
    },

    beforeStartGame() {
        this.sendTrackingGame();
        this.stateGame = STATE_GAME.PLAYING;

        for (let i = 0; i < this.players.length; i++)
            this.players[i].clearState();

        this.updatePositionPlayerView();
    },

    startGame(data) {
        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/start_game');
        this.beforeStartGame();
        this.stopCountDownStart();

        this.aniStart.node.active = true;
        this.aniStart.setAnimation(0, "animation", false);

        this.stateGame = STATE_GAME.PLAYING;
        if(this.bkgNoti) this.bkgNoti.destroy();
        var arr = JSON.parse(data.data);

        for (let i = 0; i < this.players.length; i++) {
            var player = this.players[i];

            player.vectorCard = [];
            var posCard = this.listPosCard[this.getDynamicIndex(this.getIndexOf(player))];

            for (let j = 0; j < arr.length; j++) {
                let card = this.getCard();

                card.node.anchorX = 0.5;
                card.node.anchorY = -0.5;

                card.node.setScale(SCALE_CARD);
                card.setTextureWithCode(0);
                card.node.active = false;
                this.node.addChild(card.node, GAME_ZORDER.Z_CARD + j);
                card.node.setPosition(this.getPositionPlayerCard(j, posCard));

                if (j < 3)
                    card.node.setRotation(-15);
                else
                    card.node.setRotation(-30);

                if (player === this.thisPlayer) {
                    card.decodeCard(arr[j]);
                    cc.NGWlog("-=-=-=-=-=-=-=>>> Binh la bai thu %d la %s", j, card.nameCard);
                    card.setTextureWithCode(arr[j]);
                }

                player.vectorCard.push(card);
            }
        }

        var finishAction = cc.sequence(cc.delayTime(1.5), cc.callFunc(() => {
            this.chiaBai();
            this.countDown(data.T - 4);
        }), cc.delayTime(1), cc.callFunc(() => {
            this.initSortLayer();
        }));

        this.node.runAction(finishAction);
    },

    chiaBai() {
        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/card_flip_1');
        this.aniStart.node.active = false;
        this.isJackPot = false;
        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];

            let delay = 0;
            for (let j = player.vectorCard.length - 1; j >= 0; j--) {
                let card = player.vectorCard[j];

                if (j === 7 || j === 2)
                    delay += 0.05;

                card.node.active = true;
                card.node.opacity = 1;

                let fadein = cc.fadeIn(0.25).easing(cc.easeSineInOut());
                let rotate = cc.rotateTo(0.3, this.setGocQuay(j)).easing(cc.easeCubicActionInOut());
                let scale1 = cc.scaleTo(0.2, SCALE_CARD * 1.1).easing(cc.easeSineInOut());
                let scale2 = cc.scaleTo(0.1, SCALE_CARD).easing(cc.easeSineInOut());

                card.node.runAction(cc.sequence(cc.delayTime(delay), cc.spawn(rotate, fadein, cc.sequence(scale1, scale2))));
            }
        }

        this.splitChi(this.thisPlayer);
    },

    initSortLayer() {
        // _touchListener->setEnabled(true);

        this.isCanSortCard = true;
        this.dangPhatBai = true;
        this.layerSortCard.active = true;
        this.btnSortCard.node.active = true;
        this.btnXepLai.node.active = false;

        this.cleanMarkCard();
        this.updateTextBinh();

        for (let i = 0; i < this.players.length; i++) {
            var player = this.players[i];

            if (player !== this.thisPlayer) {
                let index = this.getDynamicIndex(this.getIndexOf(player));
                let pos = this.listPosCard[index];

                this.vectorTextPlayer[index].node.active = true;
                this.vectorTextPlayer[index].node.position = pos.add(cc.v2(0, 120));

                if (player.mauBinhSoBai)
                    this.vectorTextPlayer[index].spriteFrame = this.atlasText.getSpriteFrame("ready");
                else
                    this.vectorTextPlayer[index].spriteFrame = this.atlasText.getSpriteFrame("arranging");
            }
        }

        for (let i = 0; i < this.thisPlayer.vectorCard.length; i++) {

            let pos = this.getPositionSortCard(i);
            let card = this.thisPlayer.vectorCard[i];
            card.node.anchorX = 0.5;
            card.node.anchorY = 0.5;

            card.node.stopAllActions();

            let move = cc.moveTo(0.2, pos).easing(cc.easeCubicActionInOut());
            let rotate = cc.rotateTo(0.2, 0).easing(cc.easeCubicActionInOut());
            let scale = cc.scaleTo(0.2, 0.95).easing(cc.easeSineInOut());

            let action = cc.spawn(move, rotate, scale);
            card.node.runAction(action);
            card.node.zIndex = GAME_ZORDER.Z_MENU_VIEW + 70 + i;
        }

        this.node.runAction(cc.sequence(cc.delayTime(0.2), cc.callFunc(() => {
            this.dangPhatBai = false;
        })));
    },

    hideSortLayer() {
        this.isCanSortCard = false;

        this.btnSortCard.node.active = false;
        this.layerSortCard.active = false;
        this.btnXepLai.node.active = true;

        for (let i = 0; i < this.thisPlayer.vectorCard.length; i++) {
            let pos = this.getPositionPlayerCard(i, this.listPosCard[0]);
            let card = this.thisPlayer.vectorCard[i];
            card.hideEffectCard();
            card.node.anchorX = 0.5;
            card.node.anchorY = -0.5;
            card.node.stopAllActions();

            let move = cc.moveTo(0.25, pos).easing(cc.easeCubicActionInOut());
            let rotate = cc.rotateTo(0.25, this.setGocQuay(i)).easing(cc.easeCubicActionInOut());
            let scale = cc.scaleTo(0.25, SCALE_CARD * 0.95).easing(cc.easeSineInOut());
            let scale1 = cc.scaleTo(0.15, SCALE_CARD * 1.1).easing(cc.easeSineInOut());
            let scale2 = cc.scaleTo(0.1, SCALE_CARD).easing(cc.easeSineInOut());

            let action = cc.sequence(cc.spawn(move, rotate, scale), cc.sequence(scale1, scale2));
            card.node.runAction(action);
            card.node.zIndex = GAME_ZORDER.Z_CARD + i;
        }

        this.resetColorCardChi();
    },

    onClickJackPot() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowJackpot_%s", require('GameManager').getInstance().getCurrentSceneName()));
        var item = cc.instantiate(this.showJackPot).getComponent("JackpotView");
        this.node.addChild(item.node, GAME_ZORDER.Z_MENU_VIEW + 1000);
        require('NetworkManager').getInstance().sendJackPotHistory();
    },
    onClickXepBai() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSortCard_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/deal_onecard');
        this.dangPhatBai = true;

        this.node.runAction(cc.sequence(cc.callFunc(() => {
            this.btnXepBai.interactable = false;
        }), cc.delayTime(0.3), cc.callFunc(() => {
            this.btnXepBai.interactable = true;
        })));

        this.cleanMarkCard();

        for (let i = 0; i < this.thisPlayer.vectorCard.length; i++)
            this.thisPlayer.vectorCard[i].hideEffectCard();

        var newChi1 = [];
        var newChi2 = [];
        var newChi3 = [];
        var pos = [];
        var typeCard = [0, 1, 2, 3, 4, 5, 6];

        var thisCards = this.thisPlayer.vectorCard.slice();

        for (let i = 0; i < this.thisPlayer.vectorCard.length; i++)
            pos.push(this.getPositionSortCard(i));

        typeCard.sort(function (a, b) {
            return 0.5 - Math.random()
        });

        for (let i = 0; i <= 7; i++) {
            if (newChi3.length !== 0)
                newChi3 = [];

            var x = typeCard[i];

            switch (x) {
                case 0:
                    newChi3 = this.getDoi(thisCards);
                    break;
                case 1:
                    newChi3 = this.getThu(thisCards);
                    break;
                case 2:
                    newChi3 = this.getSamCo(thisCards);
                    break;
                case 3:
                    newChi3 = this.getSanh(thisCards);
                    break;
                case 4:
                    newChi3 = this.getThung(thisCards);
                    break;
                case 5:
                    newChi3 = this.getCuLu(thisCards);
                    break;
                case 6:
                    newChi3 = this.getTuQuy(thisCards);
                    break;
                default:
                    break;
            }

            if (newChi3.length !== 0) {
                newChi1 = [];
                newChi1 = this.getMauThau(thisCards);
                newChi2 = [];
                newChi2 = thisCards;

                if (newChi1.length === 3 && newChi2.length === 5 && newChi3.length === 5)
                    if (this.compareRank(newChi2, newChi1) >= 0 && this.compareRank(newChi3, newChi2) >= 0)
                        break;

                thisCards = [];
                thisCards = this.thisPlayer.vectorCard.slice();
            }

            if (i === 7) {
                newChi1 = [];
                newChi2 = [];
                if (newChi3.length !== 0)
                    newChi3 = [];

                break;
            }
        }

        if (newChi1.length === 3 && newChi2.length === 5 && newChi3.length === 5) {
            this.thisPlayer.vectorCard = [];
            for (let i = 0; i < newChi1.length; i++)
                this.thisPlayer.vectorCard.push(newChi1[i]);
            for (let i = 0; i < newChi2.length; i++)
                this.thisPlayer.vectorCard.push(newChi2[i]);
            for (let i = 0; i < newChi3.length; i++)
                this.thisPlayer.vectorCard.push(newChi3[i]);

            for (let i = 0; i < this.thisPlayer.vectorCard.length; i++) {
                let card = this.thisPlayer.vectorCard[i];
                card.node.stopAllActions();

                let move = cc.moveTo(0.2, pos[i]).easing(cc.easeCubicActionInOut());
                card.node.runAction(move);
            }

            this.setZoderSortCard();
            this.splitChi(this.thisPlayer);
            this.updateTextBinh();
            this.showEffectCard(true, true, true);
        }

        this.node.runAction(cc.sequence(cc.delayTime(0.2), cc.callFunc(() => {
            this.dangPhatBai = false;
        })));
    },

    onClickDoiChi() {
        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/deal_onecard');
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickChangeHand_%s", require('GameManager').getInstance().getCurrentSceneName()));
        for (let i = 0; i < this.thisPlayer.vectorCard.length; i++) {
            this.thisPlayer.vectorCard[i].hideEffectCard();
        }

        this.cleanMarkCard();
        this.dangPhatBai = true;
        this.node.runAction(cc.sequence(cc.callFunc(() => {
            this.btnDoiChi.interactable = false;
        }), cc.delayTime(0.3), cc.callFunc(() => {
            this.btnDoiChi.interactable = true;
        })));

        for (var i = 0; i < 5; i++) {
            var move1 = cc.moveTo(0.2, this.getPositionSortCard(3 + i)).easing(cc.easeCubicActionInOut());
            var move2 = cc.moveTo(0.2, this.getPositionSortCard(8 + i)).easing(cc.easeCubicActionInOut());

            this.thisPlayer.vectorCard[3 + i].node.runAction(move2);
            this.thisPlayer.vectorCard[8 + i].node.runAction(move1);

            var temp = this.thisPlayer.vectorCard[3 + i];
            this.thisPlayer.vectorCard[3 + i] = this.thisPlayer.vectorCard[8 + i];
            this.thisPlayer.vectorCard[8 + i] = temp;
        }

        this.setZoderSortCard();
        this.splitChi(this.thisPlayer);
        this.updateTextBinh();
        this.showEffectCard(false, true, true);

        this.node.runAction(cc.sequence(cc.delayTime(0.2), cc.callFunc(() => {
            this.dangPhatBai = false;
        })));
    },

    onClickSoBai() {
        this._isExit = false;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCompare_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/click');
        var vtCard = [];
        for (let i = 0; i < this.thisPlayer.vectorCard.length; i++) {
            vtCard.push(this.thisPlayer.vectorCard[i].code);
        }

        require('NetworkManager').getInstance().sendBinhSoBai(vtCard , this._isExit);
    },

    onClickXepLai() {
        this._isExit = false;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSortAgain_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/click');
        require('NetworkManager').getInstance().sendBinhXepLai();
    },

    onClickDeclare() {
        this._isExit = false;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickDeclare_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/click');
        var vtCard = [];
        for (let i = 0; i < this.thisPlayer.vectorCard.length; i++) {
            vtCard.push(this.thisPlayer.vectorCard[i].code);
        }
        require('NetworkManager').getInstance().sendBinhDeclare(vtCard , this._isExit);
    },

    soBaiResponse(name) {
        var player = this.getPlayer(name);

        if (player !== this.thisPlayer) {
            for (let i = 0; i < player.vectorCard.length; i++) {
                let card = player.vectorCard[i];
                card.hideEffectCard();
                let scale1 = cc.scaleTo(0.3, SCALE_CARD + 0.05).easing(cc.easeSineInOut());
                let scale2 = cc.scaleTo(0.3, SCALE_CARD).easing(cc.easeSineInOut());
                card.node.runAction(cc.sequence(cc.delayTime(0.2), scale1, scale2));
            }

            player.mauBinhSoBai = true;

            var index = this.getDynamicIndex(this.getIndexOf(player));
            this.vectorTextPlayer[index].spriteFrame = this.atlasText.getSpriteFrame("ready");
        }
        else {
            this.moveBack();
            this.cleanMarkCard();
            this.hideSortLayer();
        }
    },

    xepLaiResponse(name) {
        var player = this.getPlayer(name);

        if (player !== this.thisPlayer) {
            player.mauBinhSoBai = false;
            var index = this.getDynamicIndex(this.getIndexOf(player));
            this.vectorTextPlayer[index].node.active = true;
            this.vectorTextPlayer[index].spriteFrame = this.atlasText.getSpriteFrame("arranging");
        }
        else
            this.initSortLayer();
    },

    declareResponse(name) {
        var player = this.getPlayer(name);

        if (player === this.thisPlayer) {
            for (let i = 0; i < this.thisPlayer.vectorCard.length; i++)
                this.thisPlayer.vectorCard[i].hideEffectCard();
            this.moveBack();
            this.cleanMarkCard();
            this.hideSortLayer();
        }
    },

    handleFinishGame() {
        this._super();

        for (let i = 0; i < this.vtChipFinish.length; i++)
            this.vtChipFinish[i].destroy();
        this.vtChipFinish = [];
        require('HandleGamePacket').NextEvt();
        let item = cc.sys.localStorage.getItem("isBack");
        if(item != null && item !=""){
            if (item == 'true') require('NetworkManager').getInstance().sendExitGame();
        }
        
        
    },

    finishGame(strData) {
        this._isExit = true;
        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/alert');
        // if (this.bkgNoti) this.bkgNoti.destroy();
        if (this.layerSortCard.active)
            this.hideSortLayer();

        this.stopCountDown();

        this.btnXepLai.node.active = false;

        this.animFinish.node.active = true;
        this.animFinish.setAnimation(0, "compare", false);

        for (let i = 1; i < 4; i++)
            this.vectorTextPlayer[i].node.active = false;

        var data = JSON.parse(strData);
        this.finishData = data;
        this.listDataPlayerResult = [];

        for (let i = 0; i < data.length; i++) {
            let playerData = {};

            var jpl = data[i];
            var name = jpl.N;
            var player = this.getPlayer(name);

            player.mauBinh_M = jpl.M;
            //  player.ag = jpl.AG;
            player.mauBinh_BL = jpl.BL;
            player.mauBinh_MB = jpl.MB;
            player.scoreChi1 = jpl.hesochi1;
            player.scoreChi2 = jpl.hesochi2;
            player.scoreChi3 = jpl.hesochi3;
            player.bonusChi1 = jpl.bonuschi1;
            player.bonusChi2 = jpl.bonuschi2;
            player.bonusChi3 = jpl.bonuschi3;

            var jcards = jpl.ArrCard;
            for (let j = 0; j < jcards.length; j++)
                player.vectorCard[j].decodeCard(jcards[j]);

            playerData.name = name;
            playerData.ArrWin = jpl.ArrWin;
            this.listDataPlayerResult.push(playerData);

        }

        var num = 0;
        for (let i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            if (player === this.thisPlayer && this.stateGame === STATE_GAME.VIEWING)
                continue;

            if (!player.mauBinh_BL && player.mauBinh_MB === 0)
                num++;
        }

        let actions = [];
        actions.push(cc.delayTime(1.5));
        actions.push(cc.callFunc(() => {
            this.prepareFinishGame();
        }));
        actions.push(cc.delayTime(2));

        if (num < this.players.length) {
            actions.push(cc.callFunc(() => {
                this.showBinhSpecial();
            }));
            actions.push(cc.delayTime(2.0));
        }

        if (num === 1) {
            actions.push(cc.callFunc(() => {
                for (let i = 0; i < this.players.length; i++) {
                    var player = this.players[i];

                    if (player === this.thisPlayer && this.stateGame === STATE_GAME.VIEWING)
                        continue;

                    if (player.mauBinh_BL || player.mauBinh_MB > 0)
                        continue;

                    for (let j = 0; j < player.vectorCard.length; j++) {
                        let card = player.vectorCard[j];

                        let scale1 = cc.scaleTo(0.05, 0, SCALE_CARD).easing(cc.easeSineInOut());
                        let scale2 = cc.scaleTo(0.15, SCALE_CARD, SCALE_CARD).easing(cc.easeSineInOut());
                        card.setTextureWithCode(card.encodeCard());
                        card.node.runAction(cc.sequence(scale1, scale2));
                    }
                }
            }));
            actions.push(cc.delayTime(2.0));
        }

        if (num > 1) {
            actions.push(cc.callFunc(() => {
                this.showChi3();
            }));
            actions.push(cc.delayTime(2.5));
            actions.push(cc.callFunc(() => {
                this.reZOrder();
            }));
            actions.push(cc.delayTime(2.5));
            actions.push(cc.callFunc(() => {
                this.showChi2();
            }));
            actions.push(cc.delayTime(2.5));
            actions.push(cc.callFunc(() => {
                this.reZOrder();
            }));
            actions.push(cc.delayTime(2.5));
            actions.push(cc.callFunc(() => {
                this.showChi1();
            }));
            actions.push(cc.delayTime(2.5));
            actions.push(cc.callFunc(() => {
                this.reZOrder();
            }));
            actions.push(cc.delayTime(1.0));
        }

        actions.push(cc.callFunc(() => {
            this.doEndGameFlow();
        }));

        let finishAction = cc.sequence(actions);
        this.node.runAction(finishAction);
    },

    prepareFinishGame() {
        this.animFinish.node.active = false;

        if (this.stateGame === STATE_GAME.PLAYING) {
            for (let i = 0; i < this.thisPlayer.vectorCard.length; i++) {
                let card = this.thisPlayer.vectorCard[i];

                let scale1 = cc.scaleTo(0.1, 0, SCALE_CARD).easing(cc.easeSineInOut());
                let scale2 = cc.scaleTo(0.2, SCALE_CARD, SCALE_CARD).easing(cc.easeSineInOut());
                let seq = cc.sequence(scale1, cc.callFunc(() => {
                    card.setTextureWithCode(0);
                }), scale2);

                card.node.runAction(seq);
            }
        }

        for (let i = 0; i < this.players.length; i++) {
            var player = this.players[i];

            if (player === this.thisPlayer && this.stateGame === STATE_GAME.VIEWING)
                continue;

            player.totalPoint = 0;
            player.mauBinhSoBai = false;
            player.is_ready = false;
            this.splitChi(player);
        }
    },

    showBinhSpecial() {
        for (let i = 0; i < this.players.length; i++) {
            var player = this.players[i];

            if (player === this.thisPlayer && this.stateGame === STATE_GAME.VIEWING)
                continue;

            if (player.mauBinh_BL || player.mauBinh_MB > 0)
                this.showCardSpecial(player);
        }

        if (this.thisPlayer.mauBinh_MB > 0)
            this.showAnimationSpecialFull();
    },

    showCardSpecial(player) {
        for (let i = 0; i < player.vectorCard.length; i++) {
            let card = player.vectorCard[i];

            let scale1 = cc.scaleTo(0.05, 0, SCALE_CARD).easing(cc.easeSineInOut());
            let scale2 = cc.scaleTo(0.15, SCALE_CARD, SCALE_CARD).easing(cc.easeSineInOut());
            card.setTextureWithCode(card.encodeCard());
            card.node.runAction(cc.sequence(scale1, scale2));
        }

        if (player.mauBinh_BL) {
            require('SoundManager1').instance.dynamicallyPlayMusic('sounds/clock_tick');
            player._playerView.showEffectBinhLung(player.mauBinh_BL);
        }
        else {
            var mb = player.mauBinh_MB;
            var path = "";

            if (mb === 15)
                path = "Grand_Dragon";
            else if (mb === 14)
                path = "Dragon";
            else if (mb === 13)
                path = "Same_Colors";
            else if (mb === 12)
                path = "Six_Pairs";
            else if (mb === 11)
                path = "Three_Straights";
            else if (mb === 10)
                path = "Three_Flushes";

            let pos1 = this.getDynamicIndex(this.getIndexOf(player));
            var point = 0;

            for (let i = 0; i < this.listDataPlayerResult.length; i++) {
                let data = this.listDataPlayerResult[i];

                if (data.name === player.pname) {
                    if (data.ArrWin.length === 0)
                        return;

                    point = data.ArrWin[0].Score;
                    break;
                }
                else
                    continue;
            }

            for (let i = 0; i < this.players.length; i++) {
                let curPlayer = this.players[i];

                if (curPlayer == this.thisPlayer && this.stateGame == STATE_GAME.VIEWING)
                    continue;

                var pos2 = this.getDynamicIndex(this.getIndexOf(curPlayer));

                if (curPlayer != player) {
                    if (curPlayer.mauBinh_MB > 0) {
                        var value = this.compareMauBinh(player.mauBinh_MB, curPlayer.mauBinh_MB);

                        if (value > 0) {
                            player.totalPoint += point;
                            curPlayer.totalPoint -= point;
                        }
                    }
                    else {
                        player.totalPoint += point;
                        curPlayer.totalPoint -= point;
                    }

                    this.setPointTotal(player, pos1);
                    this.setPointTotal(curPlayer, pos2);
                }
            }

            let scale = cc.scaleTo(0.3, 1).easing(cc.easeSineInOut());

            this.vectorBinhSpecial[pos1].node.active = true;
            this.vectorBinhSpecial[pos1].node.setScale(0);
            this.vectorBinhSpecial[pos1].spriteFrame = this.atlasText.getSpriteFrame(path);
            this.vectorBinhSpecial[pos1].node.runAction(scale);
        }
    },

    showAnimationSpecialFull() {
        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/binh/win_banker');
        this.avtSpecial.node.getComponent("AvatarItem").loadTexture(this.thisPlayer.avatar_id, this.thisPlayer.displayName, this.thisPlayer.fid,this.thisPlayer.vip);

        var mb = this.thisPlayer.mauBinh_MB;
        var path = "";

        if (mb === 15)
            path = "Grand_Dragon";
        else if (mb === 14)
            path = "Dragon";
        else if (mb === 13)
            path = "Same_Colors";
        else if (mb === 12)
            path = "Six_Pairs";
        else if (mb === 11)
            path = "Three_Straights";
        else if (mb === 10)
            path = "Three_Flushes";

        this.animSpecial.node.getParent().active = true;
        this.animSpecial.setAnimation(0, "win", true);
        this.animSpecial.node.getParent().setScale(0);
        this.animSpecial.node.getParent().runAction(cc.scaleTo(0.2, 1)).easing(cc.easeSineInOut());
        this.lbNameWin.string = this.thisPlayer.displayName;
        this.textSpecialWin.spriteFrame = this.atlasText.getSpriteFrame(path);
    },

    showChi1() {
        cc.NGWlog("Show chi 1 ho em cai");
        var isBest = false;
        // MauBinhRank rankSound = NONE;

        if (this.thisPlayer.scoreChi1 + this.thisPlayer.bonusChi1 > 0)
            require('SoundManager1').instance.dynamicallyPlayMusic('sounds/binh/compare_win');
        else
            require('SoundManager1').instance.dynamicallyPlayMusic('sounds/binh/compare_lose');

        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];

            if (player === this.thisPlayer && this.stateGame === STATE_GAME.VIEWING)
                continue;

            if (player.mauBinh_BL || player.mauBinh_MB > 0)
                continue;

            player.totalPoint += player.scoreChi1 + player.bonusChi1;

            if (player.scoreChi1 + player.bonusChi1 > 0)
                isBest = true;
            else
                isBest = false;

            let rank = this.getMauBinhRank(player.vectorChi1);

            // if(rank > rankSound)
            //     rankSound = rank;

            let fileName = this.getFileName(rank, isBest);

            let index = this.getDynamicIndex(this.getIndexOf(player));

            let posCard = this.listPosCard[index];

            for (let j = 0; j < player.vectorChi2.length; j++)
                player.vectorChi2[j].setDark(true);


            for (let j = 0; j < player.vectorChi1.length; j++) {
                let card = player.vectorChi1[j];
                card.setTextureWithCode(card.encodeCard());
                card.setDark(false);
                let delayTime = cc.delayTime(2);
                let rotate1 = cc.rotateTo(0.1, 0);
                let move1 = cc.moveTo(0.1, this.getPositionPlayerCard(j, posCard)).easing(cc.easeCubicActionInOut());

                let moveShow = cc.moveTo(0.2, this.getPositionShowCard(j, posCard)).easing(cc.easeCubicActionInOut());

                let rotate2 = cc.rotateTo(0.2, this.setGocQuay(j));
                let move2 = cc.moveTo(0.2, this.getPositionPlayerCard(j, posCard)).easing(cc.easeCubicActionInOut());

                let spawn1 = cc.spawn(rotate1, move1);
                let spawn2 = cc.spawn(rotate2, move2);
                let seq = cc.sequence(spawn1, moveShow, delayTime, spawn2);
                card.node.zIndex = GAME_ZORDER.Z_CARD + 20 + j;
                card.node.runAction(seq);
            }

            let scale = cc.scaleTo(0.2, 1);
            let delay = cc.delayTime(2.5);
            let sequ = cc.sequence(scale, delay, cc.callFunc(() => {
                this.vectorTextPlayer[index].node.active = false;
            }));

            this.vectorTextPlayer[index].node.active = true;
            this.vectorTextPlayer[index].node.position = posCard.add(cc.v2(0, 80));
            this.vectorTextPlayer[index].node.setScale(0);
            this.vectorTextPlayer[index].spriteFrame = this.atlasText.getSpriteFrame(fileName);
            this.vectorTextPlayer[index].node.runAction(sequ);

            if (player === this.thisPlayer) {
                let spaw = cc.spawn(cc.callFunc(() => {
                    this.setPointAtChi(this.lbTextChi1, this.lbScoreChi1, rank, this.thisPlayer.scoreChi1, this.thisPlayer.bonusChi1);
                }),
                    cc.callFunc(() => {
                        this.setPointTotal(player, index);
                    }));

                this.node.runAction(cc.sequence(cc.delayTime(2.5), spaw));
            }
            else
                this.node.runAction(cc.sequence(cc.delayTime(2.5),
                    cc.callFunc(() => {
                        this.setPointTotal(player, index);
                    })));
        }

        // string path = getFileSoundName(rankSound);
        // SoundManager::playSFX(path.c_str());
    },

    showChi2() {
        cc.NGWlog("Show chi 2 ho em cai");

        var isBest = false;
        // MauBinhRank rankSound = NONE;

        if (this.thisPlayer.scoreChi2 + this.thisPlayer.bonusChi2 > 0)
            require('SoundManager1').instance.dynamicallyPlayMusic('sounds/binh/compare_win');
        else
            require('SoundManager1').instance.dynamicallyPlayMusic('sounds/binh/compare_lose');

        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];

            if (player === this.thisPlayer && this.stateGame === STATE_GAME.VIEWING)
                continue;

            if (player.mauBinh_BL || player.mauBinh_MB > 0)
                continue;

            player.totalPoint += player.scoreChi2 + player.bonusChi2;

            if (player.scoreChi2 + player.bonusChi2 > 0)
                isBest = true;
            else
                isBest = false;

            let rank = this.getMauBinhRank(player.vectorChi2);

            // if(rank > rankSound)
            //     rankSound = rank;

            let fileName = this.getFileName(rank, isBest);
            let index = this.getDynamicIndex(this.getIndexOf(player));
            let posCard = this.listPosCard[index];

            for (let j = 0; j < player.vectorChi3.length; j++)
                player.vectorChi3[j].setDark(true);

            for (let j = 0; j < player.vectorChi2.length; j++) {
                let card = player.vectorChi2[j];
                card.setTextureWithCode(card.encodeCard());
                card.setDark(false);
                let delayTime = cc.delayTime(2);
                let rotate1 = cc.rotateTo(0.1, 0);
                let move1 = cc.moveTo(0.1, this.getPositionPlayerCard(j + 3, posCard)).easing(cc.easeCubicActionInOut());

                let moveShow = cc.moveTo(0.2, this.getPositionShowCard(j + 3, posCard)).easing(cc.easeCubicActionInOut());

                let rotate2 = cc.rotateTo(0.2, this.setGocQuay(j + 3));
                let move2 = cc.moveTo(0.2, this.getPositionPlayerCard(j + 3, posCard)).easing(cc.easeCubicActionInOut());

                let spawn1 = cc.spawn(rotate1, move1);
                let spawn2 = cc.spawn(rotate2, move2);
                let seq = cc.sequence(spawn1, moveShow, delayTime, spawn2);
                card.node.zIndex = GAME_ZORDER.Z_CARD + 20 + j;
                card.node.runAction(seq);
            }

            let scale = cc.scaleTo(0.2, 1);
            let delay = cc.delayTime(2.5);
            let sequ = cc.sequence(scale, delay, cc.callFunc(() => {
                this.vectorTextPlayer[index].node.active = false;
            }));

            this.vectorTextPlayer[index].node.active = true;
            this.vectorTextPlayer[index].node.position = posCard.add(cc.v2(0, 200));
            this.vectorTextPlayer[index].node.setScale(0);
            this.vectorTextPlayer[index].spriteFrame = this.atlasText.getSpriteFrame(fileName);
            this.vectorTextPlayer[index].node.runAction(sequ);

            if (player === this.thisPlayer) {
                let spaw = cc.spawn(cc.callFunc(() => {
                    this.setPointAtChi(this.lbTextChi2, this.lbScoreChi2, rank, this.thisPlayer.scoreChi2, this.thisPlayer.bonusChi2);
                }),
                    cc.callFunc(() => {
                        this.setPointTotal(player, index);
                    }));

                this.node.runAction(cc.sequence(cc.delayTime(2.5), spaw));
            }
            else
                this.node.runAction(cc.sequence(cc.delayTime(2.5),
                    cc.callFunc(() => {
                        this.setPointTotal(player, index);
                    })));
        }

        // string path = getFileSoundName(rankSound);
        // SoundManager::playSFX(path.c_str());
    },

    showChi3() {
        this.animSpecial.node.getParent().active = false;

        cc.NGWlog("Show chi 3 ho em cai");

        var isBest = false;

        if (this.thisPlayer.scoreChi3 + this.thisPlayer.bonusChi3 > 0)
            require('SoundManager1').instance.dynamicallyPlayMusic('sounds/binh/compare_win');
        else
            require('SoundManager1').instance.dynamicallyPlayMusic('sounds/binh/compare_lose');

        if (this.stateGame === STATE_GAME.VIEWING || this.thisPlayer.mauBinh_MB >= 10 || this.thisPlayer.mauBinh_BL)
            this.bgMyScore.node.active = false;
        else
            this.bgMyScore.node.active = true;

        // if(bgEffect != nullptr)
        //     bgEffect->removeFromParent();

        // bgEffect = nullptr;

        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];
            if (player === this.thisPlayer && this.stateGame === STATE_GAME.VIEWING)
                continue;

            if (player.mauBinh_BL || player.mauBinh_MB > 0)
                continue;

            player.totalPoint += player.scoreChi3 + player.bonusChi3;

            if (player.scoreChi3 + player.bonusChi3 > 0)
                isBest = true;
            else
                isBest = false;

            let rank = this.getMauBinhRank(player.vectorChi3);

            // if(rank > rankSound)
            //     rankSound = rank;

            let fileName = this.getFileName(rank, isBest);

            let index = this.getDynamicIndex(this.getIndexOf(player));

            let posCard = this.listPosCard[index];

            for (let j = 0; j < player.vectorChi3.length; j++) {
                let card = player.vectorChi3[j];
                card.setTextureWithCode(card.encodeCard());
                card.setDark(false);
                let delayTime = cc.delayTime(2);
                let rotate1 = cc.rotateTo(0.1, 0);
                let move1 = cc.moveTo(0.1, this.getPositionPlayerCard(j + 8, posCard)).easing(cc.easeCubicActionInOut());

                let moveShow = cc.moveTo(0.2, this.getPositionShowCard(j + 8, posCard)).easing(cc.easeCubicActionInOut());

                let rotate2 = cc.rotateTo(0.2, this.setGocQuay(j + 8));
                let move2 = cc.moveTo(0.2, this.getPositionPlayerCard(j + 8, posCard)).easing(cc.easeCubicActionInOut());

                let spawn1 = cc.spawn(rotate1, move1);
                let spawn2 = cc.spawn(rotate2, move2);
                let seq = cc.sequence(spawn1, moveShow, delayTime, spawn2);
                card.node.zIndex = GAME_ZORDER.Z_CARD + 20 + j;
                card.node.runAction(seq);
            }

            let scale = cc.scaleTo(0.2, 1);
            let delay = cc.delayTime(2.5);
            let sequ = cc.sequence(scale, delay, cc.callFunc(() => {
                this.vectorTextPlayer[index].node.active = false;
            }));

            this.vectorTextPlayer[index].node.active = true;
            this.vectorTextPlayer[index].node.position = posCard.add(cc.v2(0, 150));
            this.vectorTextPlayer[index].node.setScale(0);
            this.vectorTextPlayer[index].spriteFrame = this.atlasText.getSpriteFrame(fileName);
            this.vectorTextPlayer[index].node.runAction(sequ);

            if (player === this.thisPlayer) {
                let spaw = cc.spawn(cc.callFunc(() => {
                    this.setPointAtChi(this.lbTextChi3, this.lbScoreChi3, rank, this.thisPlayer.scoreChi3, this.thisPlayer.bonusChi3);
                }),
                    cc.callFunc(() => {
                        this.setPointTotal(player, index);
                    }));

                this.node.runAction(cc.sequence(cc.delayTime(2.5), spaw));
            }
            else
                this.node.runAction(cc.sequence(cc.delayTime(2.5),
                    cc.callFunc(() => {
                        this.setPointTotal(player, index);
                    })));
        }

        // string path = getFileSoundName(rankSound);
        // SoundManager::playSFX(path.c_str());
    },

    doEndGameFlow() {
        for (let i = 0; i < 4; i++)
            this.vectorTextPlayer[i].node.active = false;

        this.animSpecial.node.getParent().active = false;

        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];

            for (let j = 0; j < player.vectorChi1.length; j++)
                player.vectorChi1[j].setDark(false);

            for (let j = 0; j < player.vectorChi2.length; j++)
                player.vectorChi2[j].setDark(false);

            for (let j = 0; j < player.vectorChi3.length; j++)
                player.vectorChi3[j].setDark(false);
        }

        var delayTime = this.checkWinAll();
        var action = cc.sequence(cc.delayTime(delayTime),
            cc.delayTime(this.checkSapHam(delayTime)),
            cc.delayTime(2),
            cc.callFunc(() => {
                this.showExchangeMoney()
            }),
            cc.delayTime(4),
            cc.callFunc(() => {
                this.handleFinishGame();
            }), cc.callFunc(() => {
                var text = require('GameManager').getInstance().getTextConfig("binh_wait_for_next_game");
                this.bkgNoti = this.createNotification(text, true);
                this.bkgNoti.runAction(cc.fadeTo(0.5, 255));
            }));

        this.node.runAction(action);
    },

    showExchangeMoney() {
        this.bgMyScore.node.active = false;
        this.lbScoreChi1.node.active = false;
        this.lbScoreChi2.node.active = false;
        this.lbScoreChi3.node.active = false;
        this.lbTextChi1.node.active = false;
        this.lbTextChi2.node.active = false;
        this.lbTextChi3.node.active = false;
        let moneyStandar = 0;
        cc.NGWlog("Gia tri stateGame la: ", this.stateGame);
        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];
            if (player === null) continue;
            if (player === this.thisPlayer && this.stateGame === STATE_GAME.VIEWING)
                continue;

            player._playerView.showEffectBinhLung(false);

            if (!this.isFinish) {
                for (let j = 0; j < 4; j++) {
                    this.vectorBinhSpecial[j].node.active = false;
                    this.vectorTotalPoint[j].node.active = false;
                    this.vectorTotalPoint[j].node.getParent().active = false;
                }
                player.clearAllCard();
            } else {
                this.setTimeout(() => {
                    for (let j = 0; j < 4; j++) {
                        this.vectorBinhSpecial[j].node.active = false;
                        this.vectorTotalPoint[j].node.active = false;
                        this.vectorTotalPoint[j].node.getParent().active = false;
                    }
                    player.clearAllCard();
                }, 3000);
            }


            if (player.mauBinh_M < 0) {
                if (player === this.thisPlayer)
                    require('SoundManager1').instance.dynamicallyPlayMusic('sounds/lose');

                player._playerView.showEffectWinLose(-1);
                player._playerView.effectFlyMoney(player.mauBinh_M);
                for (let j = 0; j < this.finishData.length; j++) {
                    if (player.pname === this.finishData[j].N) {
                        player.ag = this.finishData[j].AG + player._playerView.chipJackpot;
                        player._playerView.chipJackpot = 0;
                      
                    }
                        
                    
                }

                // player.updateMoney();

                let delayT = 0;

                require('SoundManager1').instance.dynamicallyPlayMusic('sounds/nemxu');
                for (let id = 0; id < 10; id++) {
                    let nodeChip = new cc.Node();
                    nodeChip.addComponent(cc.Sprite);
                    require('GameManager').getInstance().loadTexture(nodeChip, "game/icon_chips");
                    this.node.addChild(nodeChip, GAME_ZORDER.Z_EMO);
                    this.vtChipFinish.push(nodeChip);
                    nodeChip.position = player._playerView.node.position;

                    let pos = cc.v2(0, 0);
                    let num1 = Math.floor(Math.random() * 80) - 40;
                    let num2 = Math.floor(Math.random() * 80) - 40;

                    pos = pos.add(cc.v2(num1, num2));

                    let move = cc.moveTo(0.25, pos).easing(cc.easeCubicActionInOut());
                    let delay = cc.delayTime(delayT);

                    nodeChip.runAction(cc.sequence(delay, move));

                    delayT += 0.075;
                }
            }
            else if (player.mauBinh_M === 0) {
                player._playerView.showEffectWinLose(0);
                player._playerView.effectFlyMoney(player.mauBinh_M);
                for (let j = 0; j < this.finishData.length; j++) {
                    if (player.pname === this.finishData[j].N) {
                        player.ag = this.finishData[j].AG + player._playerView.chipJackpot;
                        player._playerView.chipJackpot = 0;
                    } 
                }
                //     player.updateMoney();
            }

            if (player === this.thisPlayer) {
                require('GameManager').getInstance().user.ag = player.ag; //+ player.mauBinh_M;
                require('SMLSocketIO').getInstance().emitUpdateInfo();
            }
        }

        this.node.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(() => {

            for (let i = 0; i < this.vtChipFinish.length; i++)
                this.vtChipFinish[i].active = false;

            for (let i = 0; i < this.players.length; i++) {
                let player = this.players[i];

                if (player === this.thisPlayer && this.stateGame === STATE_GAME.VIEWING)
                    continue;

                var delayT = 0;

                if (player.mauBinh_M > 0) {
                    if (player === this.thisPlayer)
                        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/win');

                    require('SoundManager1').instance.dynamicallyPlayMusic('sounds/nemxu');
                    player._playerView.showEffectWinLose(1);
                    player._playerView.effectFlyMoney(player.mauBinh_M);
                    for (let j = 0; j < this.finishData.length; j++) {
                        if (player.pname === this.finishData[j].N) {
                            player.ag = this.finishData[j].AG + player._playerView.chipJackpot;
                            player._playerView.chipJackpot = 0;
                        }
                    }
                    //   player.updateMoney();

                    

                    for (let id = 0; id < 10; id++) {
                        let pos = cc.v2(0, 0);
                        let num1 = Math.floor(Math.random() * 80) - 40;
                        let num2 = Math.floor(Math.random() * 80) - 40;

                        let nodeChip = new cc.Node();
                        nodeChip.addComponent(cc.Sprite);
                        require('GameManager').getInstance().loadTexture(nodeChip, "game/icon_chips");
                        this.node.addChild(nodeChip, GAME_ZORDER.Z_EMO);
                        this.vtChipFinish.push(nodeChip);
                        nodeChip.position = pos.add(cc.v2(num1, num2));

                        let move = cc.moveTo(0.25, player._playerView.node.position).easing(cc.easeCubicActionInOut());
                        let fadeOut = cc.fadeTo(0.05, 0);
                        let delay = cc.delayTime(delayT);

                        nodeChip.runAction(cc.sequence(delay, move, fadeOut, cc.callFunc(() => {
                            nodeChip.active = false;
                        })));

                        delayT += 0.075;
                    }
                }
            }
        })));

        require("NetworkManager").getInstance().sendUpdateJackPot(GAME_ID.BINH);
    },

    resetGameDisplay() {
        for (let i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            player.clearAllCard();
        }

        for (let i = 0; i < 4; i++) {
            this.vectorBinhSpecial[i].node.active = false;
            this.vectorTotalPoint[i].node.active = false;
            this.vectorTotalPoint[i].node.getParent().active = false;
        }

        this.isJackPot = false;
        this.handleFinishGame();
    },

    hideSpriteRank() {
        for (let i = 0; i < 4; i++)
            this.vectorTextPlayer[i].node.active = false;
    },

    setPointAtChi(lbText, lbScore, rank, point, bonus) {
        let score = point + bonus;

        cc.NGWlog("-==--=--=-=-=-==-=-=-=--=-=>>> Binh score chi = " + score);

        let text = "";

        if (rank === TYPE_CARD_MAU_BINH.HIGH_CARD)
            text = require('GameManager').getInstance().getTextConfig("binh_mauthau");
        else if (rank === TYPE_CARD_MAU_BINH.PAIR)
            text = require('GameManager').getInstance().getTextConfig("binh_doi");
        else if (rank === TYPE_CARD_MAU_BINH.TWO_PAIR)
            text = require('GameManager').getInstance().getTextConfig("binh_thu");
        else if (rank === TYPE_CARD_MAU_BINH.THREE_OF_A_KIND)
            text = require('GameManager').getInstance().getTextConfig("binh_xam");
        else if (rank === TYPE_CARD_MAU_BINH.STRAIGHT)
            text = require('GameManager').getInstance().getTextConfig("binh_sanh");
        else if (rank === TYPE_CARD_MAU_BINH.FLUSH)
            text = require('GameManager').getInstance().getTextConfig("binh_thung");
        else if (rank === TYPE_CARD_MAU_BINH.FULL_HOUSE)
            text = require('GameManager').getInstance().getTextConfig("binh_culu");
        else if (rank === TYPE_CARD_MAU_BINH.FOUR_OF_A_KIND)
            text = require('GameManager').getInstance().getTextConfig("binh_tuquy");
        else if (rank === TYPE_CARD_MAU_BINH.STRAIGHT_FLUSH)
            text = require('GameManager').getInstance().getTextConfig("binh_tps");

        cc.NGWlog("-=-=-=-=-=--=-=-=>>> Binh rank at chi = " + rank + "--=-=--" + text);

        lbText.node.active = true;
        lbScore.node.active = true;

        lbText.string = text;

        var s = cc.js.formatStr("%d", Math.abs(point));

        if (point > 0)
            s = "+" + s;
        else if (point < 0)
            s = "-" + s;

        if (bonus != 0) {
            var mark = "";

            if (bonus > 0)
                mark = "+";
            else
                mark = "-";

            s += "(" + mark + Math.abs(bonus) + ")";
        }

        cc.NGWlog("-=--=-=-===-=-=->>> Binh total score = " + s);

        lbScore.string = s;

        if (score > 0)
            lbScore.node.color = cc.Color.YELLOW;
        else
            lbScore.node.color = cc.Color.WHITE;
    },

    setPointTotal(player, index) {
        let isColor = false;
        let point = player.totalPoint;

        this.vectorTotalPoint[index].node.getParent().active = true;

        if (point >= 0)
            isColor = true;
        else
            isColor = false;

        if (point > 0)
            this.vectorTotalPoint[index].string = "+" + point.toString();
        else
            this.vectorTotalPoint[index].string = point.toString();


        if (isColor)
            this.vectorTotalPoint[index].node.color = cc.Color.YELLOW;
        else
            this.vectorTotalPoint[index].node.color = cc.Color.WHITE;

        this.vectorTotalPoint[index].node.active = true;

        let scale1 = cc.scaleTo(0.2, 1.5).easing(cc.easeSineInOut());
        let scale2 = cc.scaleTo(0.15, 1).easing(cc.easeSineInOut());

        this.vectorTotalPoint[index].node.runAction(cc.sequence(scale1, scale2));
    },

    reZOrder() {
        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];
            for (let j = 0; j < player.vectorCard.length; j++)
                player.vectorCard[j].node.zIndex = GAME_ZORDER.Z_CARD + j;
        }
    },

    checkWinAll() {
        if (this.players.length <= 3 && this.stateGame === STATE_GAME.VIEWING)
            return 0;

        let szSapLang = this.players.length - 1;

        if (this.stateGame === STATE_GAME.VIEWING)
            szSapLang = this.players.length - 2;

        if (szSapLang === 1)
            return 0;

        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];

            if (player.mauBinh_MB > 0)
                continue;

            let data = null;

            for (let j = 0; j < this.listDataPlayerResult.length; j++) {
                if (player.pname === this.listDataPlayerResult[j].name) {
                    data = this.listDataPlayerResult[j].ArrWin;
                    break;
                }
            }

            if (data === null)
                continue;

            if (data.length === szSapLang) {
                this.node.runAction(cc.sequence(cc.delayTime(0.4), cc.callFunc(() => {
                    require('SoundManager1').instance.dynamicallyPlayMusic('sounds/action/bom');
                })));

                player.isSapLang = true;

                for (let id = 0; id < this.players.length; id++) {
                    let player1 = this.players[id];

                    if (player === player1)
                        continue;

                    let point = 0;
                    for (let j = 0; j < data.length; j++) {
                        let player2 = this.getPlayer(data[j].Name);
                        if (player1 === player2) {
                            point = data[j].Score;
                            break;
                        }
                    }

                    player.totalPoint += point;
                    player1.totalPoint -= point;

                    let fromPos = this.getDynamicIndex(this.getIndexOf(player));
                    let toPos = this.getDynamicIndex(this.getIndexOf(player1));

                    this.setPointTotal(player, fromPos);
                    this.setPointTotal(player1, toPos);

                    let animation = cc.instantiate(this.itemAnim).getComponent("ItemAnimation");
                    animation.initAnimation(this.animSapCaLang);
                    animation.setMultiAlpha(false);
                    animation.node.position = this.listPosCard[toPos].sub(cc.v2(0, 60));
                    this.node.addChild(animation.node, GAME_ZORDER.Z_EMO);
                    animation.playAnimBinh();

                    animation.node.runAction(cc.sequence(cc.delayTime(3.5), cc.removeSelf()));
                }

                return 3.5;
            }
        }

        return 0;
    },


    checkSapHam(delayTime) {
        cc.NGWlog("chet cha may nay");

        var time = 0;

        var actions = [];
        actions.push(cc.delayTime(delayTime));

        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];

            if (player === this.thisPlayer && this.stateGame === STATE_GAME.VIEWING)
                continue;

            if (player.mauBinh_BL || player.mauBinh_MB > 0 || player.isSapLang)
                continue;

            let playersToShoot = [];
            var data = null;

            for (let j = 0; j < this.listDataPlayerResult.length; j++) {
                if (player.pname === this.listDataPlayerResult[j].name) {
                    data = this.listDataPlayerResult[j].ArrWin;
                    break;
                }
            }

            if (data === null)
                continue;

            cc.NGWlog("-=-=-=--=-=-=> BINH data BinhWin " + data);

            for (let j = 0; j < data.length; j++) {
                var player1 = this.getPlayer(data[j].Name);
                playersToShoot.push(player1);
            }

            if (playersToShoot.length === 1 || playersToShoot.length === 2) {
                actions.push(cc.callFunc(() => {
                    this.createShootingEffect(player, playersToShoot);
                }));

                var effectTime;
                if (playersToShoot.length === 1)
                    effectTime = 2.0;
                else
                    effectTime = 3.8;

                time += effectTime;

                actions.push(cc.delayTime(effectTime));
            }
        }

        if (actions.length > 1)
            this.node.runAction(cc.sequence(actions));

        return time;
    },

    createShootingEffect(shotPlayer, listPlayersToShoot) {
        let fromPos = this.getDynamicIndex(this.getIndexOf(shotPlayer));
        let posTank = this.listPosCard[fromPos].add(cc.v2(0, 100));

        let delayTime = 0;

        for (let i = 0; i < listPlayersToShoot.length; i++) {
            let player = listPlayersToShoot[i];
            let toPos = this.getDynamicIndex(this.getIndexOf(player));
            let anim = "";

            if (fromPos === 0) {
                switch (toPos) {
                    case 3:
                        anim = "A1";
                        break;
                    case 2:
                        anim = "A2";
                        break;
                    case 1:
                        anim = "A3";
                        break;
                }
            }
            else if (fromPos === 1) {
                switch (toPos) {
                    case 0:
                        anim = "D4";
                        break;
                    case 3:
                        anim = "D5";
                        break;
                    case 2:
                        anim = "D6";
                        break;
                }
            }
            else if (fromPos === 2) {
                switch (toPos) {
                    case 0:
                        anim = "A2";
                        break;
                    case 1:
                        anim = "A1";
                        break;
                    case 3:
                        anim = "A3";
                        break;
                }
            }
            else if (fromPos === 3) {
                switch (toPos) {
                    case 0:
                        anim = "D6";
                        break;
                    case 1:
                        anim = "D5";
                        break;
                    case 2:
                        anim = "D4";
                        break;
                }
            }

            cc.NGWlog("===> Binh from: %d, to: %d aimation: %s", fromPos, toPos, anim);

            let effXeTank = cc.instantiate(this.itemAnim).getComponent("ItemAnimation");
            effXeTank.initAnimation(this.animXeTank);
            this.node.addChild(effXeTank.node, GAME_ZORDER.Z_EMO);
            effXeTank.setMultiAlpha(false);
            effXeTank.node.position = posTank;
            effXeTank.node.opacity = 1;

            if (fromPos === 1 || fromPos === 2)
                effXeTank.node.rotation = 180;

            effXeTank.node.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(() => {
                effXeTank.playAnimBinh(anim);
            }), cc.delayTime(2 + delayTime), cc.removeSelf()));

            this.node.runAction(cc.sequence(cc.delayTime(1 + delayTime), cc.callFunc(() => {
                this.createBomEffect(shotPlayer, player);
            })));

            delayTime += 2;
        }
    },

    createBomEffect(shotPlayer, player) {
        let fromPos = this.getDynamicIndex(this.getIndexOf(shotPlayer));
        let toPos = this.getDynamicIndex(this.getIndexOf(player));

        let posTank = this.listPosCard[fromPos].add(cc.v2(0, 100));
        let posBom = this.listPosCard[toPos].add(cc.v2(0, 100));

        let spBom = new cc.Node();
        spBom.addComponent(cc.Sprite);
        require('GameManager').getInstance().loadTexture(spBom, "game/binh/icon_bom");
        this.node.addChild(spBom, GAME_ZORDER.Z_EMO - 1);
        spBom.position = posTank
        spBom.runAction(cc.sequence(cc.moveTo(0.5, posBom).easing(cc.easeCubicActionInOut()), cc.removeSelf()));

        let animation = cc.instantiate(this.itemAnim).getComponent("ItemAnimation");
        animation.initAnimation(this.animBoom);
        this.node.addChild(animation.node, GAME_ZORDER.Z_EMO);
        animation.node.setPosition(posBom);
        animation.node.opacity = 1;
        animation.setMultiAlpha(false);
        animation.node.runAction(cc.sequence(cc.delayTime(0.6), cc.callFunc(() => {
            animation.playAnimBinh();
        }), cc.delayTime(1.5), cc.removeSelf()));

        this.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(() => {
            require('SoundManager1').instance.dynamicallyPlayMusic('sounds/action/bom');
        }), cc.callFunc(() => {
            let point = 0;
            for (let i = 0; i < this.listDataPlayerResult.length; i++) {
                let data = this.listDataPlayerResult[i];

                if (data.name === shotPlayer.pname) {
                    if (data.ArrWin.length === 0)
                        return;

                    point = data.ArrWin[0].Score;
                    break;
                }
                else
                    continue;
            }

            shotPlayer.totalPoint += point;
            player.totalPoint -= point;

            this.setPointTotal(shotPlayer, fromPos);
            this.setPointTotal(player, toPos);
        })));
    },

    getFileName(rankchi, isBest) {
        var text = "";

        if (rankchi === TYPE_CARD_MAU_BINH.HIGH_CARD)
            text = "highcard_";
        else if (rankchi == TYPE_CARD_MAU_BINH.PAIR)
            text = "pair_";
        else if (rankchi == TYPE_CARD_MAU_BINH.TWO_PAIR)
            text = "two_pair_";
        else if (rankchi == TYPE_CARD_MAU_BINH.THREE_OF_A_KIND)
            text = "three_of_a_kind_";
        else if (rankchi == TYPE_CARD_MAU_BINH.STRAIGHT)
            text = "straight_";
        else if (rankchi == TYPE_CARD_MAU_BINH.FLUSH)
            text = "flush_";
        else if (rankchi == TYPE_CARD_MAU_BINH.FULL_HOUSE)
            text = "fullhouse_";
        else if (rankchi == TYPE_CARD_MAU_BINH.FOUR_OF_A_KIND)
            text = "four_of_a_kind_";
        else if (rankchi == TYPE_CARD_MAU_BINH.STRAIGHT_FLUSH)
            text = "straight_flush_";


        var suffix = isBest ? "3" : "4";

        return text + suffix;
    },

    swapCard(player, time) {
        if (player.timeSwapCard == 0 || player.vectorCard[0].node.getNumberOfRunningActions() > 0) {
            player.timeSwapCard = time - Math.floor(Math.random() * 4) + 1;
            return;
        }

        if (time <= player.timeSwapCard) {
            player.timeSwapCard = time - Math.floor(Math.random() * 4) + 1;

            var swapPos = [];
            for (let i = 0; i < 13; i++)
                swapPos.push(i);

            var n = Math.floor(Math.random() * 4) + 1;

            swapPos.sort(function (a, b) {
                return 0.5 - Math.random()
            });

            for (let i = 0; i < n * 2; i++)
                swapPos.pop();

            var actionTime = 0.2;
            for (let i = 0; i < parseInt(swapPos.length / 2); i++) {
                let card1 = player.vectorCard[swapPos[i * 2]];
                let card2 = player.vectorCard[swapPos[i * 2 + 1]];

                var action1 = cc.sequence(cc.spawn(cc.moveTo(actionTime, card2.node.position).easing(cc.easeCubicActionInOut()),
                    cc.rotateTo(actionTime, card2.node.rotation).easing(cc.easeCubicActionInOut())),
                    cc.spawn(cc.moveTo(0, card1.node.position).easing(cc.easeCubicActionInOut()),
                        cc.rotateTo(0, card1.node.rotation).easing(cc.easeCubicActionInOut())));

                var action2 = cc.sequence(cc.spawn(cc.moveTo(actionTime, card1.node.position).easing(cc.easeCubicActionInOut()),
                    cc.rotateTo(actionTime, card1.node.rotation).easing(cc.easeCubicActionInOut())),
                    cc.spawn(cc.moveTo(0, card2.node.position).easing(cc.easeCubicActionInOut()),
                        cc.rotateTo(0, card2.node.rotation).easing(cc.easeCubicActionInOut())));

                card1.node.runAction(action1);
                card2.node.runAction(action2);
            }
        }
    },

    showEffectCard(isChi1 = false, isChi2 = false, isChi3 = false) {
        var rankChi1 = this.getMauBinhRank(this.thisPlayer.vectorChi1);
        var rankChi2 = this.getMauBinhRank(this.thisPlayer.vectorChi2);
        var rankChi3 = this.getMauBinhRank(this.thisPlayer.vectorChi3);

        var verifyChi1 = this.compareRank(this.thisPlayer.vectorChi2, this.thisPlayer.vectorChi1);
        var verifyChi2 = this.compareRank(this.thisPlayer.vectorChi3, this.thisPlayer.vectorChi2);

        if (verifyChi1 >= 0 && verifyChi2 >= 0) {
            if (isChi1)
                this.showEffectAtChi(1, rankChi1);
            if (isChi2)
                this.showEffectAtChi(2, rankChi2);
            if (isChi3)
                this.showEffectAtChi(3, rankChi3);
        }
    },

    showEffectAtChi(chi, rank) {
        if (chi == 1 && rank >= TYPE_CARD_MAU_BINH.PAIR) {
            for (let i = 0; i < this.thisPlayer.vectorChi1.length; i++)
                this.thisPlayer.vectorChi1[i].setEffectCard(0.5);
        }
        else if (chi == 2 && rank >= TYPE_CARD_MAU_BINH.STRAIGHT) {
            for (let i = 0; i < this.thisPlayer.vectorChi2.length; i++)
                this.thisPlayer.vectorChi2[i].setEffectCard(0.5);
        }
        else if (chi == 3 && rank >= TYPE_CARD_MAU_BINH.FLUSH) {
            for (let i = 0; i < this.thisPlayer.vectorChi3.length; i++)
                this.thisPlayer.vectorChi3[i].setEffectCard(0.5);
        }
    },

    splitChi(player) {
        if (!player)
            return;

        player.vectorChi1 = [];
        player.vectorChi2 = [];
        player.vectorChi3 = [];

        var chi = 1;

        for (let i = 0; i < player.vectorCard.length; i++) {
            let card = player.vectorCard[i];
            if (chi === 1)
                player.vectorChi1.push(card);
            else if (chi === 2)
                player.vectorChi2.push(card);
            else if (chi === 3)
                player.vectorChi3.push(card);

            if (i === 2 || i === 7)
                chi++;
        }
    },

    getChi(i) {
        if (i < 3)
            return 1;
        else if (i > 7)
            return 3;
        else
            return 2;
    },

    getCenterMovingCard() {
        var sum = cc.v2(0, 0);

        for (let i = 0; i < this.movePos.length; i++)
            sum = sum.add(this.thisPlayer.vectorCard[this.movePos[i]].node.position);

        return sum.div(this.movePos.length);
    },

    getListPickCard(holdingPos, currentPos, destPos) {
        var picked = [];

        var size = holdingPos.length;
        var destChi = this.getChi(destPos);

        var stChi, fsChi;

        if (destChi === 1) {
            stChi = 0;
            fsChi = 2;
        }
        else if (destChi === 2) {
            stChi = 3;
            fsChi = 7;
        }
        else {
            stChi = 8;
            fsChi = 12;
        }

        var stPick;

        for (let i = 0; i < size; i++) {
            if (holdingPos[i] === currentPos) {
                if (destPos - i >= stChi)
                    stPick = destPos - i;
                else
                    stPick = stChi;

                if (stPick + size - 1 > fsChi)
                    stPick = fsChi - size + 1;

                for (let k = 0; k < size; k++) {
                    picked.push(k + stPick);
                    this.vectorShadowCard[k + stPick].setBorder(true);
                }

                break;
            }
        }

        return picked;
    },

    sortMovingCard() {
        for (let i = 0; i < this.movePos.length; i++) {
            let card1 = this.thisPlayer.vectorCard[this.movePos[i]];

            for (let j = i + 1; j < this.movePos.length; j++) {
                let card2 = this.thisPlayer.vectorCard[this.movePos[j]];

                if (card1.N > card2.N) {
                    var temp = this.movePos[j];
                    this.movePos[j] = this.movePos[i];
                    this.movePos[i] = temp;
                }
            }
        }
    },

    moveBack() {
        for (var i = 0; i < this.movePos.length; i++) {
            let pos = this.movePos[i];
            let card = this.thisPlayer.vectorCard[pos];
            card.node.position = this.oldCardPos[i];
            card.node.zIndex = GAME_ZORDER.Z_MENU_VIEW + 70 + pos;
        }
    },

    cleanMarkCard() {
        for (let i = 0; i < this.vectorShadowCard.length; i++) {
            this.thisPlayer.vectorCard[i].setDark(false);
            this.vectorShadowCard[i].setCardOpacity(1);
            this.vectorShadowCard[i].setBorder(false);
        }

        this.movePos = [];
        this.destPos = [];
        this.oldCardPos = [];
    },

    setZoderSortCard() {
        for (let i = 0; i < this.thisPlayer.vectorCard.length; i++)
            this.thisPlayer.vectorCard[i].node.zIndex = GAME_ZORDER.Z_MENU_VIEW + 70 + i;
    },

    updateTextBinh() {
        var mb = this.checkMauBinh();

        cc.NGWlog("=======================>>> mb  = " + mb);

        var verifyChi1 = this.compareRank(this.thisPlayer.vectorChi1, this.thisPlayer.vectorChi2);
        var verifyChi2 = this.compareRank(this.thisPlayer.vectorChi2, this.thisPlayer.vectorChi3);

        var rankChi1 = this.getMauBinhRank(this.thisPlayer.vectorChi1);
        var rankChi2 = this.getMauBinhRank(this.thisPlayer.vectorChi2);
        var rankChi3 = this.getMauBinhRank(this.thisPlayer.vectorChi3);

        this.setColorCardChi(1, rankChi1, this.thisPlayer.vectorChi1);
        this.setColorCardChi(2, rankChi2, this.thisPlayer.vectorChi2);
        this.setColorCardChi(3, rankChi3, this.thisPlayer.vectorChi3);

        if (verifyChi1 > 0) {
            require('GameManager').getInstance().loadTexture(this.spMarkChi1, "game/binh/x");
            for (let i = 0; i < this.thisPlayer.vectorChi1.length; i++) {
                this.thisPlayer.vectorChi1[i].setDark(true);
                this.thisPlayer.vectorChi1[i].setColorCard(cc.Color.WHITE);
            }
        }

        if (verifyChi2 > 0) {
            require('GameManager').getInstance().loadTexture(this.spMarkChi2, "game/binh/x");
            for (let i = 0; i < this.thisPlayer.vectorChi2.length; i++) {
                this.thisPlayer.vectorChi2[i].setDark(true);
                this.thisPlayer.vectorChi2[i].setColorCard(cc.Color.WHITE);
            }
        }

        if (verifyChi1 <= 0 && verifyChi2 <= 0) {
            require('GameManager').getInstance().loadTexture(this.spMarkChi1, "game/binh/v");
            require('GameManager').getInstance().loadTexture(this.spMarkChi2, "game/binh/v");
            require('GameManager').getInstance().loadTexture(this.spMarkChi3, "game/binh/v");
        }

        if (mb === TYPE_CARD_MAU_BINH.NONE) {
            this.textBinhSpecial.node.active = false;
            this.btnDeclare.node.active = false;

            if (verifyChi1 <= 0 && verifyChi2 <= 0) {
                this.setTextMauBinh(this.lbTextSortChi1, rankChi1, 1);
                this.setTextMauBinh(this.lbTextSortChi2, rankChi2, 2);
                this.setTextMauBinh(this.lbTextSortChi3, rankChi3, 3);
            }
            else {
                this.lbTextSortChi1.string = "";
                this.lbTextSortChi2.string = require('GameManager').getInstance().getTextConfig('binh_lung');
                this.lbTextSortChi2.node.color = cc.Color.RED;
                this.lbTextSortChi3.string = "";
            }

        }
        else {
            var color = new cc.Color(255, 253, 205);

            for (let i = 0; i < this.thisPlayer.vectorChi1.length; i++)
                this.thisPlayer.vectorChi1[i].setColorCard(color);

            for (let i = 0; i < this.thisPlayer.vectorChi2.length; i++)
                this.thisPlayer.vectorChi2[i].setColorCard(color);

            for (let i = 0; i < this.thisPlayer.vectorChi3.length; i++)
                this.thisPlayer.vectorChi3[i].setColorCard(color);

            this.lbTextSortChi1.string = "";
            this.lbTextSortChi2.string = "";
            this.lbTextSortChi3.string = "";

            this.textBinhSpecial.node.active = true;
            this.btnDeclare.node.active = true;

            var path = "";

            if (mb === TYPE_CARD_MAU_BINH.GRAND_DRAGON)
                path = "Grand_Dragon";
            else if (mb === TYPE_CARD_MAU_BINH.DRAGON)
                path = "Dragon";
            else if (mb === TYPE_CARD_MAU_BINH.SAME_COLOR)
                path = "Same_Colors";
            else if (mb === TYPE_CARD_MAU_BINH.SIX_PAIRS)
                path = "Six_Pairs";
            else if (mb === TYPE_CARD_MAU_BINH.THREE_STRAIGHT)
                path = "Three_Straights";
            else if (mb === TYPE_CARD_MAU_BINH.THREE_FLUSHES)
                path = "Three_Flushes";

            this.textBinhSpecial.spriteFrame = this.atlasText.getSpriteFrame(path);
        }
    },

    resetColorCardChi() {
        for (let i = 0; i < this.thisPlayer.vectorChi1.length; i++)
            this.thisPlayer.vectorChi1[i].setColorCard(cc.Color.WHITE);

        for (let i = 0; i < this.thisPlayer.vectorChi2.length; i++)
            this.thisPlayer.vectorChi2[i].setColorCard(cc.Color.WHITE);

        for (let i = 0; i < this.thisPlayer.vectorChi3.length; i++)
            this.thisPlayer.vectorChi3[i].setColorCard(cc.Color.WHITE);
    },

    setColorCardChi(chi, rankchi, vtCard) {
        for (let i = 0; i < vtCard.length; i++)
            vtCard[i].setColorCard(cc.Color.WHITE);

        var color = new cc.Color(255, 253, 205);
        // var color = new cc.Color(255, 255, 255);


        if (chi === 1) {
            if (rankchi === TYPE_CARD_MAU_BINH.HIGH_CARD) {
                var id = 0;
                var temp = 0;
                for (let i = 0; i < vtCard.length; i++) {
                    if (vtCard[i].N > temp) {
                        temp = vtCard[i].N;
                        id = i;
                    }
                }

                vtCard[id].setColorCard(color);
            }
            else if (rankchi >= TYPE_CARD_MAU_BINH.PAIR) {
                var list = this.getListCardValue(vtCard);
                var temp = 0;
                for (let i = 0; i < list.length - 1; i++) {
                    if (list[i] === list[i + 1]) {
                        temp = list[i];
                        break;
                    }
                }

                for (let i = 0; i < vtCard.length; i++) {
                    if (vtCard[i].N === temp)
                        vtCard[i].setColorCard(color);
                }
            }
        }
        else if (chi === 2 || chi === 3) {
            if (rankchi === TYPE_CARD_MAU_BINH.HIGH_CARD) {
                var id = 0;
                var temp = 0;
                for (let i = 0; i < vtCard.length; i++) {
                    if (vtCard[i].N > temp) {
                        temp = vtCard[i].N;
                        id = i;
                    }
                }

                vtCard[id].setColorCard(color);
            }
            else if (rankchi === TYPE_CARD_MAU_BINH.PAIR || rankchi === TYPE_CARD_MAU_BINH.THREE_OF_A_KIND) {
                var list = this.getListCardValue(vtCard);
                var temp = 0;
                for (let i = 0; i < list.length - 1; i++) {
                    if (list[i] === list[i + 1]) {
                        temp = list[i];
                        break;
                    }
                }

                for (let i = 0; i < vtCard.length; i++) {
                    if (vtCard[i].N === temp)
                        vtCard[i].setColorCard(color);
                }
            }
            else if (rankchi === TYPE_CARD_MAU_BINH.TWO_PAIR || rankchi === TYPE_CARD_MAU_BINH.FOUR_OF_A_KIND) {
                var list = this.getListCardValue(vtCard);
                var temp = [];

                for (let i = 0; i < list.length - 1; i++) {
                    if (list[i] === list[i + 1]) {
                        temp.push(list[i]);
                        i = i + 1;
                    }
                }

                for (let i = 0; i < vtCard.length; i++) {
                    for (let j = 0; j < temp.length; j++)
                        if (vtCard[i].N === temp[j])
                            vtCard[i].setColorCard(color);
                }
            }
            else if (rankchi >= TYPE_CARD_MAU_BINH.STRAIGHT && rankchi !== TYPE_CARD_MAU_BINH.FOUR_OF_A_KIND) {
                for (let i = 0; i < vtCard.length; i++)
                    vtCard[i].setColorCard(color);
            }
        }
    },

    setTextMauBinh(lbTextBinh, rankchi, chi, isGreen = true) {
        var text = "";
        var color = false;

        if (chi === 1) {
            if (rankchi === TYPE_CARD_MAU_BINH.HIGH_CARD)
                text = require('GameManager').getInstance().getTextConfig('binh_mauthau');
            else if (rankchi === TYPE_CARD_MAU_BINH.PAIR)
                text = require('GameManager').getInstance().getTextConfig('binh_doi');
            else if (rankchi === TYPE_CARD_MAU_BINH.THREE_OF_A_KIND) {
                if (this.vecScoreBonus.length > 0)
                    text += cc.js.formatStr(require('GameManager').getInstance().getTextConfig('binh_xam_bonus'), this.vecScoreBonus[0]);
                else
                    text += require('GameManager').getInstance().getTextConfig('binh_xam');

                color = true;
            }

            lbTextBinh.string = text;

            lbTextBinh.node.color = cc.Color.WHITE;
            // if (color)
            //     lbTextBinh.node.color = cc.Color.YELLOW;
            // else {
            //     if (isGreen)
            //         lbTextBinh.node.color = cc.Color.GREEN;
            //     else
            //         lbTextBinh.node.color = cc.Color.WHITE;
            // }
        }
        else if (chi === 2) {
            if (rankchi === TYPE_CARD_MAU_BINH.HIGH_CARD)
                text = require('GameManager').getInstance().getTextConfig('binh_mauthau');
            else if (rankchi === TYPE_CARD_MAU_BINH.PAIR)
                text = require('GameManager').getInstance().getTextConfig('binh_doi');
            else if (rankchi === TYPE_CARD_MAU_BINH.TWO_PAIR)
                text = require('GameManager').getInstance().getTextConfig('binh_thu');
            else if (rankchi === TYPE_CARD_MAU_BINH.THREE_OF_A_KIND)
                text = require('GameManager').getInstance().getTextConfig('binh_xam');
            else if (rankchi === TYPE_CARD_MAU_BINH.STRAIGHT)
                text = require('GameManager').getInstance().getTextConfig('binh_sanh');
            else if (rankchi === TYPE_CARD_MAU_BINH.FLUSH)
                text = require('GameManager').getInstance().getTextConfig('binh_thung');
            else if (rankchi === TYPE_CARD_MAU_BINH.FULL_HOUSE) {
                if (this.vecScoreBonus.length > 0)
                    text += cc.js.formatStr(require('GameManager').getInstance().getTextConfig('binh_culu_bonus'), this.vecScoreBonus[2]);
                else
                    text += require('GameManager').getInstance().getTextConfig('binh_culu');

                color = true;
            }
            else if (rankchi === TYPE_CARD_MAU_BINH.FOUR_OF_A_KIND) {
                if (this.vecScoreBonus.length > 0)
                    text += cc.js.formatStr(require('GameManager').getInstance().getTextConfig('binh_tuquy_bonus'), this.vecScoreBonus[3]);
                else
                    text += require('GameManager').getInstance().getTextConfig('binh_tuquy');

                color = true;
            }
            else if (rankchi === TYPE_CARD_MAU_BINH.STRAIGHT_FLUSH) {

                if (this.vecScoreBonus.length > 0)
                    text += cc.js.formatStr(require('GameManager').getInstance().getTextConfig('binh_tps_bonus'), this.vecScoreBonus[5]);
                else
                    text += require('GameManager').getInstance().getTextConfig('binh_tps');

                color = true;
            }

            lbTextBinh.string = text;

            lbTextBinh.node.color = cc.Color.WHITE;
            // if (color)
            //     lbTextBinh.node.color = cc.Color.YELLOW;
            // else {
            //     if (isGreen)
            //         lbTextBinh.node.color = cc.Color.GREEN;
            //     else
            //         lbTextBinh.node.color = cc.Color.WHITE;
            // }
        }
        else if (chi === 3) {
            if (rankchi === TYPE_CARD_MAU_BINH.HIGH_CARD)
                text = require('GameManager').getInstance().getTextConfig('binh_mauthau');
            else if (rankchi === TYPE_CARD_MAU_BINH.PAIR)
                text = require('GameManager').getInstance().getTextConfig('binh_doi');
            else if (rankchi === TYPE_CARD_MAU_BINH.TWO_PAIR)
                text = require('GameManager').getInstance().getTextConfig('binh_thu');
            else if (rankchi === TYPE_CARD_MAU_BINH.THREE_OF_A_KIND)
                text = require('GameManager').getInstance().getTextConfig('binh_xam');
            else if (rankchi === TYPE_CARD_MAU_BINH.STRAIGHT)
                text = require('GameManager').getInstance().getTextConfig('binh_sanh');
            else if (rankchi === TYPE_CARD_MAU_BINH.FLUSH)
                text = require('GameManager').getInstance().getTextConfig('binh_thung');
            else if (rankchi === TYPE_CARD_MAU_BINH.FULL_HOUSE)
                text = require('GameManager').getInstance().getTextConfig('binh_culu');
            else if (rankchi === TYPE_CARD_MAU_BINH.FOUR_OF_A_KIND) {
                if (this.vecScoreBonus.length > 0)
                    text += cc.js.formatStr(require('GameManager').getInstance().getTextConfig('binh_tuquy_bonus'), this.vecScoreBonus[8]);
                else
                    text += require('GameManager').getInstance().getTextConfig('binh_tuquy');

                color = true;
            }
            else if (rankchi === TYPE_CARD_MAU_BINH.STRAIGHT_FLUSH) {
                if (this.vecScoreBonus.length > 0)
                    text += cc.js.formatStr(require('GameManager').getInstance().getTextConfig('binh_tps_bonus'), this.vecScoreBonus[10]);
                else
                    text += require('GameManager').getInstance().getTextConfig('binh_tps');

                color = true;
            }

            lbTextBinh.string = text;

            lbTextBinh.node.color = cc.Color.WHITE;
            // if (color)
            //     lbTextBinh.node.color = cc.Color.YELLOW;
            // else {
            //     if (isGreen)
            //         lbTextBinh.node.color = cc.Color.GREEN;
            //     else
            //         lbTextBinh.node.color = cc.Color.WHITE;
            // }
        }
    },

    getMauThau(listCard) {
        var mauThau = [];

        mauThau.push(listCard[0]); // add card 1

        for (let i = 1; i < listCard.length; i++) // add card 2
        {
            if (listCard[i].N !== mauThau[0].N) {
                mauThau.push(listCard[i]);
                break;
            }
        }

        for (let i = 2; i < listCard.length; i++) // add card 3
        {
            if (listCard[i].N !== mauThau[1].N) {
                mauThau.push(listCard[i]);
                break;
            }
        }

        for (let i = 0; i < mauThau.length; i++) // delete card
        {
            for (let j = 0; j < listCard.length; j++) {
                if (mauThau[i].code === listCard[j].code) {
                    listCard.splice(j, 1);
                    break;
                }
            }
        }

        mauThau.sort((x, y) => {
            return x.N - y.N;
        });

        return mauThau;
    },

    getDoi(listCard) {
        var doi = [];
        if (!LogicManager.checkDoi(listCard))
            return doi;

        listCard.sort((x, y) => {
            return x.N - y.N;
        });

        for (let i = listCard.length - 1; i > 0; i--) // add doi
        {
            if (listCard[i].N === listCard[i - 1].N) {
                doi.push(listCard[i]);
                doi.push(listCard[i - 1]);
                break;
            }
        }

        for (let i = 0; i < doi.length; i++) // delete doi
        {
            for (let j = 0; j < listCard.length; j++) {
                if (doi[i].code === listCard[j].code) {
                    listCard.splice(j, 1);
                    break;
                }
            }
        }

        doi.push(listCard[0]); // add 3 card le
        doi.push(listCard[1]);
        doi.push(listCard[2]);

        for (let i = 0; i < doi.length; i++) {
            for (let j = 0; j < listCard.length; j++) {
                if (doi[i].code === listCard[j].code) {
                    listCard.splice(j, 1);
                    break;
                }
            }
        }

        return doi;
    },

    getThu(listCard) {
        var thu = [];
        if (!LogicManager.checkThu(listCard))
            return thu;

        listCard.sort((x, y) => {
            return x.N - y.N;
        });

        for (let i = listCard.length - 1; i > 0; i--) // add doi 1
        {
            if (listCard[i].N === listCard[i - 1].N) {
                thu.push(listCard[i]);
                thu.push(listCard[i - 1]);
                break;
            }
        }

        for (let i = 0; i < thu.length; i++) // delete doi 1
        {
            for (let j = 0; j < listCard.length; j++) {
                if (thu[i].code === listCard[j].code) {
                    listCard.splice(j, 1);
                    break;
                }
            }
        }

        for (let i = listCard.length - 1; i > 0; i--) // add doi 2
        {
            if (listCard[i].N === listCard[i - 1].N) {
                thu.push(listCard[i]);
                thu.push(listCard[i - 1]);
                break;
            }
        }

        for (let i = 0; i < thu.length; i++) // delete doi 2
        {
            for (let j = 0; j < listCard.length; j++) {
                if (thu[i].code === listCard[j].code) {
                    listCard.splice(j, 1);
                    break;
                }
            }
        }

        thu.push(listCard[0]); // add card le

        for (let i = 0; i < thu.length; i++) // delete card le
        {
            for (let j = 0; j < listCard.length; j++) {
                if (thu[i].code === listCard[j].code) {
                    listCard.splice(j, 1);
                    break;
                }
            }
        }

        return thu;
    },

    getSamCo(listCard) {
        var samCo = [];
        if (!LogicManager.checkXam(listCard))
            return samCo;

        listCard.sort((x, y) => {
            return x.N - y.N;
        });

        for (let i = listCard.length - 1; i > 1; i--) // add xam
        {
            if (listCard[i].N === listCard[i].N) {
                samCo.push(listCard[i]);
                samCo.push(listCard[i - 1]);
                samCo.push(listCard[i - 2]);
                break;
            }
        }

        for (let i = 0; i < samCo.length; i++) // delete xam
        {
            for (let j = 0; j < listCard.length; j++) {
                if (samCo[i].code === listCard[j].code) {
                    listCard.splice(j, 1);
                    break;
                }
            }
        }

        samCo.push(listCard[0]); // add 2 card le
        samCo.push(listCard[1]);

        for (let i = 0; i < samCo.length; i++) // delete 2 card le
        {
            for (let j = 0; j < listCard.length; j++) {
                if (samCo[i].code === listCard[j].code) {
                    listCard.splice(j, 1);
                    break;
                }
            }
        }

        return samCo;
    },

    getSanh(listCard) {
        var sanh = [];
        if (!LogicManager.checkSanh(listCard, 5))
            return sanh;

        listCard.sort((x, y) => {
            return x.N - y.N;
        });

        var index;

        for (let i = listCard.length - 1; i > 3; i--) // sanh start = 2 ->10
        {
            index = 1;
            sanh = [];

            let card1 = listCard[i];
            sanh.push(card1);

            for (var j = i - 1; j >= 0; j--) // add sanh
            {
                let card2 = listCard[j];
                if (card2.N === card1.N - 1) {
                    sanh.push(card2);
                    index++;
                    card1 = card2;
                    if (index === 5) {
                        for (let i = 0; i < sanh.length; i++) // delete sanh khoi listcard
                        {
                            for (let j = 0; j < listCard.length; j++) {
                                if (sanh[i].code === listCard[j].code) {
                                    listCard.splice(j, 1);
                                    break;
                                }
                            }
                        }

                        sanh.sort((x, y) => {
                            return x.N - y.N;
                        });

                        return sanh;
                    }
                }
            }
        }

        sanh = [];
        index = 2;
        let card1 = listCard[listCard.length - 1];   // sanh start = 1
        let card2 = listCard[0];
        if (card1.N === 14 && card2.N === 2) {
            sanh.push(card1);
            sanh.push(card2);
            card1 = card2;

            for (let i = 1; i < listCard.length; i++) // add sanh
            {
                let card2 = listCard[i];
                if (card2.N === card1.N + 1) {
                    sanh.push(card2);
                    index++;
                    card1 = card2;
                    if (index === 5)
                        break;
                }
            }
        }

        for (let i = 0; i < sanh.length; i++) // delete sanh khoi listcard
        {
            for (let j = 0; j < listCard.length; j++) {
                if (sanh[i].code === listCard[j].code) {
                    listCard.splice(j, 1);
                    break;
                }
            }
        }

        return sanh;
    },

    getThung(listCard) {
        var thung = [];
        if (!LogicManager.checkThung(listCard, 5))
            return thung;

        listCard.sort((x, y) => {
            return x.N - y.N;
        });

        var index;
        for (let suit = 1; suit <= 4; suit++) // get theo suit
        {
            index = 0;
            thung = [];

            for (let i = listCard.length - 1; i >= 0; i--) // add thung
            {
                let card = listCard[i];
                if (card.S === suit) {
                    thung.push(card);
                    index++;
                    if (index === 5) {
                        for (let i = 0; i < thung.length; i++) // delete thung khoi listcard
                        {
                            for (let j = 0; j < listCard.length; j++) {
                                if (thung[i].code === listCard[j].code) {
                                    listCard.splice(j, 1);
                                    break;
                                }
                            }
                        }

                        thung.sort((x, y) => {
                            return x.N - y.N;
                        });

                        return thung;
                    }
                }
            }
        }
    },

    getCuLu(listCard) // 1 xam + 1 doi
    {
        var culu = [];
        if (!LogicManager.checkCulu(listCard))
            return culu;

        listCard.sort((x, y) => {
            return x.N - y.N;
        });

        for (let i = listCard.length - 1; i > 1; i--) // add xam
        {
            if (listCard[i].N === listCard[i].N) {
                culu.push(listCard[i]);
                culu.push(listCard[i - 1]);
                culu.push(listCard[i - 2]);
                break;
            }
        }

        for (let i = 0; i < culu.length; i++) // delete xam
        {
            for (let j = 0; j < listCard.length; j++) {
                if (culu[i].code === listCard[j].code) {
                    listCard.splice(j, 1);
                    break;
                }
            }
        }

        for (let i = listCard.length - 1; i > 0; i--) // add doi
        {
            if (listCard[i].N === listCard[i - 1].N) {
                culu.push(listCard[i]);
                culu.push(listCard[i - 1]);
                break;
            }
        }

        for (let i = 0; i < culu.length; i++) // delete doi
        {
            for (let j = 0; j < listCard.length; j++) {
                if (culu[i].code === listCard[j].code) {
                    listCard.splice(j, 1);
                    break;
                }
            }
        }

        culu.sort((x, y) => {
            return x.N - y.N;
        });

        return culu;
    },

    getTuQuy(listCard) {
        var tuquy = [];
        if (!LogicManager.checkTuQuy(listCard))
            return tuquy;

        listCard.sort((x, y) => {
            return x.N - y.N;
        });

        for (let i = listCard.length - 1; i > 0; i--) // add tuquy
            if (listCard[i].N === listCard[i - 3].N) {
                tuquy.push(listCard[i]);
                tuquy.push(listCard[i - 1]);
                tuquy.push(listCard[i - 2]);
                tuquy.push(listCard[i - 3]);
                break;
            }

        if (tuquy[0].N == listCard[0].N) // add 1 la
            tuquy.push(listCard[12]);
        else
            tuquy.push(listCard[0]);

        for (let i = 0; i < tuquy.length; i++) // delete listcard
        {
            for (let j = 0; j < listCard.length; j++) {
                if (tuquy[i].code === listCard[j].code) {
                    listCard.splice(j, 1);
                    break;
                }
            }
        }

        return tuquy;
    },

    compareRank(listCard1, listCard2) {
        var listValue1 = this.getListCardValue(listCard1);
        var listValue2 = this.getListCardValue(listCard2);
        var rank1 = this.getMauBinhRank(listCard1);
        var rank2 = this.getMauBinhRank(listCard2);

        if (rank1 === rank2) {
            if (rank1 === TYPE_CARD_MAU_BINH.HIGH_CARD)
                return this.compareMauThau(listValue1, listValue2);
            else if (rank1 === TYPE_CARD_MAU_BINH.PAIR)
                return this.compareDoi(listValue1, listValue2);
            else if (rank1 === TYPE_CARD_MAU_BINH.TWO_PAIR)
                return this.compareThu(listValue1, listValue2);
            else if (rank1 === TYPE_CARD_MAU_BINH.THREE_OF_A_KIND)
                return this.compareSamCo(listValue1, listValue2);
            else if (rank1 === TYPE_CARD_MAU_BINH.STRAIGHT)
                return this.compareSanh(listValue1, listValue2);
            else if (rank1 === TYPE_CARD_MAU_BINH.FLUSH)
                return this.compareThung(listValue1, listValue2);
            else if (rank1 === TYPE_CARD_MAU_BINH.FULL_HOUSE)
                return this.compareCuLu(listValue1, listValue2);
            else if (rank1 === TYPE_CARD_MAU_BINH.FOUR_OF_A_KIND)
                return this.compareTuQuy(listValue1, listValue2);
            else if (rank1 === TYPE_CARD_MAU_BINH.STRAIGHT_FLUSH)
                return this.compareTPS(listValue1, listValue2);
        }
        else if (rank1 > rank2)
            return 1;

        return -1;
    },

    getListCardValue(listCard) {
        var value = [];

        if (listCard.length == 3) {
            value.push(-2);
            value.push(-1);
        }

        for (let i = 0; i < listCard.length; i++)
            value.push(listCard[i].N);

        value.sort((x, y) => {
            return x - y;
        });

        return value;
    },

    getMauBinhRank(listCard) {
        if (LogicManager.checkThungPhaSanh(listCard, 5))
            return TYPE_CARD_MAU_BINH.STRAIGHT_FLUSH;
        else if (LogicManager.checkTuQuy(listCard))
            return TYPE_CARD_MAU_BINH.FOUR_OF_A_KIND;
        else if (LogicManager.checkCulu(listCard))
            return TYPE_CARD_MAU_BINH.FULL_HOUSE;
        else if (LogicManager.checkThung(listCard, 5))
            return TYPE_CARD_MAU_BINH.FLUSH;
        else if (LogicManager.checkSanh(listCard, 5))
            return TYPE_CARD_MAU_BINH.STRAIGHT;
        else if (LogicManager.checkXam(listCard))
            return TYPE_CARD_MAU_BINH.THREE_OF_A_KIND;
        else if (LogicManager.checkThu(listCard))
            return TYPE_CARD_MAU_BINH.TWO_PAIR;
        else if (LogicManager.checkDoi(listCard))
            return TYPE_CARD_MAU_BINH.PAIR;

        return TYPE_CARD_MAU_BINH.HIGH_CARD;
    },

    checkMauBinh() {
        var rank = TYPE_CARD_MAU_BINH.NONE;

        if (LogicManager.checkBinhGrandDragon(this.thisPlayer.vectorCard))
            rank = TYPE_CARD_MAU_BINH.GRAND_DRAGON;
        else if (LogicManager.checkBinhDragon(this.thisPlayer.vectorCard))
            rank = TYPE_CARD_MAU_BINH.DRAGON;
        else if (LogicManager.checkBinhSameColor(this.thisPlayer.vectorCard))
            rank = TYPE_CARD_MAU_BINH.SAME_COLOR;
        else if (LogicManager.checkBinhSixPairs(this.thisPlayer.vectorCard))
            rank = TYPE_CARD_MAU_BINH.SIX_PAIRS;
        else if (LogicManager.checkBinhThreeStraights(this.thisPlayer.vectorChi1, this.thisPlayer.vectorChi2, this.thisPlayer.vectorChi3))
            rank = TYPE_CARD_MAU_BINH.THREE_STRAIGHT;
        else if (LogicManager.checkBinhThreeFlushes(this.thisPlayer.vectorChi1, this.thisPlayer.vectorChi2, this.thisPlayer.vectorChi3))
            rank = TYPE_CARD_MAU_BINH.THREE_FLUSHES;

        return rank;
    },


    compareMauThau(list1, list2) {
        for (let i = list1.length - 1; i >= 0; i--) {
            if (list1[i] > list2[i])
                return 1;
            else if (list1[i] < list2[i])
                return -1;
        }

        return 0;
    },

    compareDoi(list1, list2) {
        var value1, value2;

        for (let i = 0; i < list1.length; i++) {
            if (list1[i] == list1[i + 1]) {
                value1 = list1[i];
                break;
            }
        }

        for (let i = 0; i < list2.length; i++) {
            if (list2[i] == list2[i + 1]) {
                value2 = list2[i];
                break;
            }
        }

        if (value1 > value2)
            return 1;
        else if (value1 < value2)
            return -1;
        else
            return this.compareMauThau(list1, list2);
    },

    compareThu(list1, list2) {
        if (list1[1] !== list1[2] && list1[2] !== list1[3]) {
            var temp = list1[2];
            list1.splice(2, 1);
            list1.unshift(temp);
        }
        else if (list1[3] !== list1[4]) {
            var temp = list1[4];
            list1.pop();
            list1.unshift(temp);
        }

        if (list2[1] !== list2[2] && list2[2] !== list2[3]) {
            var temp = list2[2];
            list2.splice(2, 1);
            list2.unshift(temp);
        }
        else if (list2[3] !== list2[4]) {
            var temp = list2[4];
            list2.pop();
            list2.unshift(temp);
        }

        return this.compareMauThau(list1, list2);
    },

    compareSamCo(list1, list2) {
        var value1, value2;

        for (let i = 0; i < list1.length; i++) {
            if (list1[i] === list1[i + 1] && list1[i] === list1[i + 2]) {
                value1 = list1[i];
                break;
            }
        }

        for (let i = 0; i < list2.length; i++) {
            if (list2[i] === list2[i + 1] && list2[i] === list2[i + 2]) {
                value2 = list2[i];
                break;
            }
        }

        if (value1 > value2)
            return 1;

        return -1;
    },

    compareSanh(list1, list2) {
        if (list1[0] === 2 && list1[4] === 14) {
            list1.pop();
            list1.unshift(1);
        }

        if (list2[0] === 2 && list2[4] === 14) {
            list2.pop();
            list2.unshift(1);
        }

        return this.compareMauThau(list1, list2);
    },

    compareThung(list1, list2) {
        return this.compareMauThau(list1, list2);
    },

    compareCuLu(list1, list2) {
        return this.compareSamCo(list1, list2);
    },

    compareTuQuy(list1, list2) {
        return this.compareDoi(list1, list2);
    },

    compareTPS(list1, list2) {
        return this.compareThung(list1, list2);
    },

    compareMauBinh(x, y) {
        if (x === y)
            return 0;

        return x > y ? 1 : -1;
    },

    getPositionSortCard(index) {
        var y = this.cardDefine.getContentSize().height * 0.95 + 13;
        var x = this.cardDefine.getContentSize().width * 0.95 + 13;
        var pos = cc.v2(100, 25);

        switch (index) {
            case 0:
                pos = pos.add(cc.v2(0, y));
                pos = pos.sub(cc.v2(2 * x, 0));
                break;
            case 1:
                pos = pos.add(cc.v2(0, y));
                pos = pos.sub(cc.v2(x, 0));
                break;
            case 2:
                pos = pos.add(cc.v2(0, y));
                break;
            case 3:
                pos = pos.sub(cc.v2(2 * x, 0));
                break;
            case 4:
                pos = pos.sub(cc.v2(x, 0));
                break;
            case 5:
                pos = pos;
                break;
            case 6:
                pos = pos.add(cc.v2(x, 0));
                break;
            case 7:
                pos = pos.add(cc.v2(2 * x, 0));
                break;
            case 8:
                pos = pos.sub(cc.v2(0, y));
                pos = pos.sub(cc.v2(2 * x, 0));
                break;
            case 9:
                pos = pos.sub(cc.v2(0, y));
                pos = pos.sub(cc.v2(x, 0));
                break;
            case 10:
                pos = pos.sub(cc.v2(0, y));
                break;
            case 11:
                pos = pos.add(cc.v2(x, 0));
                pos = pos.sub(cc.v2(0, y));
                break;
            case 12:
                pos = pos.add(cc.v2(2 * x, 0));
                pos = pos.sub(cc.v2(0, y));
                break;
            default:
                break;
        }

        return pos;
    },

    getPositionPlayerCard(index, posCard) {
        var pos = cc.v2(0, 0);
        var y = this.cardDefine.getContentSize().height * 0.32;

        switch (index) {
            case 0:
            case 1:
            case 2:
                pos = posCard.add(cc.v2(0, y));
                break;
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                pos = posCard;
                break;
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
                pos = posCard.sub(cc.v2(0, y));
                break;
            default:
                break;
        }

        return pos;
    },

    getPositionShowCard(index, posCard) {
        var pos = posCard;
        var x = this.cardDefine.getContentSize().width * 0.3;
        var y = this.cardDefine.getContentSize().height * 0.3;

        switch (index) {
            case 0:
                pos = pos.add(cc.v2(0, y));
                pos = pos.sub(cc.v2(x, 0));
                break;
            case 1:
                pos = pos.add(cc.v2(0, y));
                break;
            case 2:
                pos = pos.add(cc.v2(0, y));
                pos = pos.add(cc.v2(x, 0));
                break;
            case 3:
                pos = pos.sub(cc.v2(2 * x, 0));
                break;
            case 4:
                pos = pos.sub(cc.v2(x, 0));
                break;
            case 5:
                pos = pos;
                break;
            case 6:
                pos = pos.add(cc.v2(x, 0));
                break;
            case 7:
                pos = pos.add(cc.v2(2 * x, 0));
                break;
            case 8:
                pos = pos.sub(cc.v2(0, y));
                pos = pos.sub(cc.v2(2 * x, 0));
                break;
            case 9:
                pos = pos.sub(cc.v2(0, y));
                pos = pos.sub(cc.v2(x, 0));
                break;
            case 10:
                pos = pos.sub(cc.v2(0, y));
                break;
            case 11:
                pos = pos.sub(cc.v2(0, y));
                pos = pos.add(cc.v2(x, 0));
                break;
            case 12:
                pos = pos.sub(cc.v2(0, y));
                pos = pos.add(cc.v2(2 * x, 0));
                break;
            default:
                break;
        }

        return pos;
    },

    setGocQuay(index) {
        var x = 0;

        switch (index) {
            case 3:
            case 8:
                x = -30;
                break;
            case 0:
            case 4:
            case 9:
                x = -15;
                break;
            case 1:
            case 5:
            case 10:
                x = 0;
                break;
            case 2:
            case 6:
            case 11:
                x = 15;
                break;
            case 7:
            case 12:
                x = 30;
                break;
            default:
                break;
        }

        return x;
    }
});

module.export = BinhGamView;