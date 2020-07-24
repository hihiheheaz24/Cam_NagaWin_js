var GameManager = require('GameManager')

var PlayerViewCasino = cc.Class({
    extends: cc.Component,

    properties: {
        lbName: {
            default: null,
            type: cc.Label
        },
        lbAg: {
            default: null,
            type: cc.Label
        },
        imgAvatar: {
            default: null,
            type: cc.Sprite
        },

        imgTime: {
            default: null,
            type: cc.Sprite
        },
        time_turn: 20.0,
        time_turn_cur: 0.0,
        imgHost: cc.Node,
        //Field properties
        id_pl: {
            default: "",
            visible: false
        },
        name_pl: {
            default: "",
            visible: false
        },
        avaid_pl: {
            default: 0,
            visible: false
        },
        chip_pl: {
            default: 0,
            visible: false
        },
        vip_pl: {
            default: 0,
            visible: false
        },

        aniLose: {
            default: null,
            type: sp.Skeleton
        },

        aniWin: {
            default: null,
            type: sp.Skeleton
        },
        aniDraw: {
            default: null,
            type: sp.Skeleton
        },
        aniBinhLung: {
            default: null,
            type: cc.Sprite
        },

        fontPlus: {
            default: null,
            type: cc.Font
        },

        fontSub: {
            default: null,
            type: cc.Font
        },
        aniPhao: {
            default: null,
            type: sp.Skeleton
        },

        lbVip: cc.Label,
        bkgThanhBar: cc.Node,
        isDealer: false,
        _isTurn: false,
        isRunEffect: false,
        isPlayer: false,
        listChipBetPl: [], //use for baccarat
        isCurMoney: 0,
        isLastMoney: 0,
        isDeltaMoney: 0,
        isDeltaTime: 0,
        isRunAction: false,
        icBack: cc.Sprite,
        chipJackpot: 0,
    },

    update(dt) {
        if (this._isTurn) {
            this.time_turn_cur += dt;
            //this.time_turn_cur += GameManager.getInstance().time_out_game;
            // GameManager.getInstance().time_out_game = 0;
            if (this.time_turn_cur <= this.time_turn) {
                this.imgTime.fillRange = (this.time_turn - this.time_turn_cur) / this.time_turn;
                // angleNow tinh theo radian, 1rad = 180/π
                var angleNow = -this.time_turn_cur * (360 / this.time_turn / 180 * Math.PI);
                var x = 55 * Math.cos(angleNow);
                var y = 55 * Math.sin(angleNow);
                this.aniPhao.node.position = cc.v2(x, y);
            } else {
                this.imgTime.node.active = false;
                this._isTurn = false;
            }
        };

        if (this.isRunEffect) {
            let temp = this.isDeltaTime += dt;
            if (temp >= 0.01) {
                this.isDeltaTime = 0;
                this.isCurMoney += this.isDeltaMoney;

                if (this.isCurMoney >= this.isLastMoney && this.isDeltaMoney > 0) {
                    this.isCurMoney = this.isLastMoney;
                    this.isRunEffect = false;
                }
                if (this.isCurMoney <= this.isLastMoney && this.isDeltaMoney < 0) {
                    this.isCurMoney = this.isLastMoney;
                    this.isRunEffect = false;
                }

                this.lbAg.string = GameManager.getInstance().formatMoney(this.isCurMoney);
                // if (!this.isRunAction) {
                //     this.effectScaleMoney();
                // }
            }
        }

    },
    unuse() {

    },
    onLoad() {
        this.initPos
    },
    onEnable() {
        this.aniBinhLung.node.active = false;
    },
    effLbName() {
        this.lbName.node.stopAllActions();
        this.lbName.node.position = cc.v2(0, 0);
        cc.log("WIDTH LB NAME==" + this.lbName.node.width);
        if (this.lbName.node.width > 130) {
            let offset = this.lbName.node.width - 120;

            let timer = offset / 120;
            let acMove1 = cc.moveTo(timer, -offset / 2, 0);
            let acMove2 = cc.moveTo(timer, 0, 0);
            let acMove3 = cc.moveTo(timer, offset / 2, 0);
            this.lbName.node.runAction(cc.repeatForever(cc.sequence(acMove1, acMove2, acMove3, cc.delayTime(1.0), acMove2)));
        }
    },
    setPosThanhBarThisPlayer() {
        cc.NGWlog("PlayerViewCasino: Setposthanhbar");
        this.bkgThanhBar.position = cc.v2(120, -12);
    },
    //Set function
    onClickAvatar() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickAvatar_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (GameManager.getInstance().gameView.stateGame === STATE_GAME.VIEWING || require("GameManager").getInstance().curGameId === GAME_ID.ROULETTE) return;
        // if( this.name_pl === GameManager.getInstance().user.uname){
        // }
        Global.InfoPlayerView.node.removeFromParent(false);
        var data = {
            idFriend: this.id_pl,
            name: this.name_pl,
            vip: this.vip_pl,
            agFriend: this.chip_pl,
            idAva: this.avaid_pl,
            fid: this.fid_pl,
            displayName: this.displayName
        };
        require('UIManager').instance.onShowUserInfo(data);
    },

    setData(id, name, vip, chip, idAva, fid, displayName) {
        this.id_pl = id;
        this.name_pl = name;
        this.chip_pl = chip;
        this.vip_pl = vip;
        this.avaid_pl = idAva;
        this.fid_pl = fid;
        this.displayName = displayName;
    },

    setName(strName) {
        if (this.lbName !== null) {
            this.lbName.string = strName;
        }
        cc.log("Chay vao ham set name");
        this.effLbName();
        // if (this.lbName.string.length > 10) {
        //     this.lbName.string = this.lbName.string.substring(0, 10) + '...';
        // }
    },

    setAg(ag) {
        this.chip_pl = ag;
        if (this.lbAg !== null) {
            this.lbAg.string = GameManager.getInstance().formatMoney(ag);
            this.lbAg.node.runAction(cc.sequence(cc.scaleTo(0.1, 1.2), cc.scaleTo(0.1, 1.0)));
        }
    },

    setVip(vip) {
        if (this.lbVip !== null) {
            this.lbVip.string = GameManager.getInstance().getTextConfig('txt_vip') + vip;
        }
    },

    setHost(isHost) {
        if (this.imgHost !== null) {
            this.imgHost.node.active = isHost;
        }
    },
    setReady(isReady) {
        this.imgAvatar.node.color = cc.Color.WHITE;
    },

    setTurn(isTurn, timeTurn, isEffect) {
        this.imgTime.node.active = isTurn;
        this._isTurn = isTurn;
        if (isTurn) {
            if (isEffect) this.node.runAction(cc.sequence(cc.scaleTo(0.15, 1.2), cc.scaleTo(0.15, 1)));
            this.time_turn_cur = 0.0;
            this.time_turn = timeTurn;
            this.imgTime.fillRange = 1.0;
        }
    },
    setAvatar(avaId, name, Faid) {
        this.imgAvatar.node.getComponent("AvatarItem").loadTexture(avaId, name, Faid,this.vip_pl);
    },

    setDark(isDark) {
        this.imgAvatar.node.color = isDark ? cc.Color.GRAY : cc.Color.WHITE;
    },

    updatePlayerView() {
        this.setReady(true);
    },

    showEffectWinLose(isWin) {
        if (isWin === 0) {
            this.aniDraw.node.active = true;
            this.aniDraw.setAnimation(0, "eng", true);
            var funcEnd = () => {
                this.aniDraw.node.active = false;
            }
            var actionNode = this.aniDraw.node;
        }
        else if (isWin === 1) {
            this.aniWin.node.active = true;
            this.aniWin.setAnimation(0, "animation", true);

            var funcEnd = () => {
                this.aniWin.node.active = false;
            }
            var actionNode = this.aniWin.node;
        }
        else {
            this.aniLose.node.active = true;
            this.aniLose.setAnimation(0, "animation", true);

            var funcEnd = () => {
                this.aniLose.node.active = false;
            }
            var actionNode = this.aniLose.node;
        }

        actionNode.stopAllActions();
        actionNode.runAction(cc.sequence(cc.delayTime(2.5), cc.callFunc(() => {
            funcEnd();
        })));
    },

    showEffectBinhLung(isBL) {
        if (isBL) {
            this.aniBinhLung.node.active = true;
            this.aniBinhLung.node.setScale(0);
            var scale = cc.scaleTo(0.3, 1);

            this.aniBinhLung.node.runAction(scale);
        } else {
            this.aniBinhLung.node.active = false;
        }
    },

    getChipbet(typeBet) { //use for baccarat.
        let chipbet;
        for (let i = 0; i < this.listChipBetPl.length; i++) {
            if (this.listChipBetPl[i].typeBet === typeBet) {
                chipbet = this.listChipBetPl[i];
            }
        }
        return chipbet;
    },
    effectFlyMoney(money, fontSize = 50, moveTo = 50, posX = 0, posY = 0) { //Show fly money effect
        cc.NGWlog('money la ', money);
        if (typeof money !== 'number' || money == 0) { return; }
        //Set money more than 0
        var prefix = "";
        var font = null;
        if (money >= 0) {
            prefix = "+";
            font = this.fontPlus;
        } else {
            prefix = "-";
            font = this.fontSub;
        }
        //Create label
        var nodeText = new cc.Node('TextFly');
        var labelText = nodeText.addComponent(cc.Label);
        labelText.string = prefix + require('GameManager').getInstance().formatMoneyAg(Math.abs(money));
        labelText.fontSize = fontSize;
        labelText.font = font;
        nodeText.position = cc.v2(posX, posY);
        this.node.addChild(nodeText);

        //Effect
        var moveUp = cc.moveBy(2, cc.v2(0, moveTo));
        var del = cc.delayTime(moveUp.getDuration() * 0.5);
        var fade = cc.fadeOut(moveUp.getDuration() - del.getDuration());
        var eff = cc.spawn(moveUp, cc.sequence(del, fade));
        var act = cc.sequence(eff, cc.callFunc(() => {
            if (labelText.node !== null) {
                labelText.node.destroy();
            }
        }));
        labelText.node.runAction(act);
    },
    onDisable() {
        this.setTurn(false, 0);
        this.bkgThanhBar.position = cc.v2(0, -70);
        this.icBack.node.active = false;
        this.lbAg.string = 0;
        this.isRunEffect=false;
    },
    setupEffectChangeMoney(start, end) {
        this.isCurMoney = start;
        this.isLastMoney = end;
        let delta = end - start;
        let around = 0;


        if (delta == 0) return;

        if (delta > 0) {
            if (delta < 10) {
                around = delta / 5;
            } else if (delta < 300) {
                around = delta / 30;
            } else {
                around = delta / 70;
            }
            if (around < 1) around = 1;
        } else {
            if (delta > -10) {
                around = delta / 5;
            } else if (delta > -300) {
                around = delta / 50;
            } else {
                around = delta / 100;
            }
        }



        this.isDeltaMoney = Math.floor(around);
        cc.NGWlog('delta cong la=== ' + this.isDeltaMoney);
        this.isRunEffect = true;
    },
    effectScaleMoney() {
        this.isRunAction = true;
        this.lbAg.node.runAction(cc.sequence(cc.scaleTo(0.05, 1.2), cc.scaleTo(0.05, 1)));
        setTimeout(() => {
            if (this.node == null || typeof this.node == 'undefined') return;
            this.isRunAction = false;
        }, 100)

    }


});

module.export = PlayerViewCasino;