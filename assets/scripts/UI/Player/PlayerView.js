var GameManager = require('GameManager')

var PlayerView = cc.Class({
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
        lbVip: {
            default: null,
            type: cc.Label
        },
        imgAvatar: {
            default: null,
            type: cc.Sprite
        },
        imgHost: {
            default: null,
            type: cc.Sprite
        },
        imgTime: {
            default: null,
            type: cc.Sprite
        },
        time_turn: 20.0,
        time_turn_cur: 0.0,

        fontPlus: {
            default: null,
            type: cc.Font
        },

        fontSubtract: {
            default: null,
            type: cc.Font
        },

        aniLose: {
            default: null,
            type: sp.Skeleton
        },

        aniWinRound: {
            default: null,
            type: sp.Skeleton
        },

        aniWinText: {
            default: null,
            type: sp.Skeleton
        },

        //Field properties
        timeResultEffect: {
            default: 3.0,
            visible: false
        },
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
        fid_pl: {
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
        display_name: {
            default: '',
            visible: false
        },
        isDealer: false

    },

    start() {
        if (require('GameManager').getInstance().curGameId === GAME_ID.SHOW) {
            return;
        }
        this.setReady(true);
        // if (this.name_pl === GameManager.getInstance().user.uname){    // tat button avatar
        // this.node.getChildByName("button").active = false;
        // }
    },

    update(dt) {
        if (this.imgTime.node.activeInHierarchy) {
            this.time_turn_cur += dt;
            if (this.time_turn_cur <= this.time_turn) {
                // cc.NGWlog('------> time:   ' + this.time_turn_cur / this.time_turn);
                this.imgTime.fillRange = this.time_turn_cur / this.time_turn;


            } else {
                this.imgTime.node.active = false;
            }
        }
    },

    //Set function
    onClickAvatar() {
        if (this.name_pl === GameManager.getInstance().user.uname || GameManager.getInstance().gameView.stateGame === STATE_GAME.VIEWING) return;
        Global.InfoPlayerView.node.removeFromParent(false);

        var data = {
            idFriend: this.id_pl,
            name: this.name_pl,
            vip: this.vip_pl,
            agFriend: this.chip_pl,
            idAva: this.avaid_pl,
            fid: this.fid_pl,
            displayName: this.display_name
        };
        require('UIManager').instance.onShowUserInfo(data);
    },

    setData(id, name, vip, chip, idAva, fid, displayName) {
        this.id_pl = id;
        this.name_pl = name;
        this.chip_pl = chip;
        this.vip_pl = vip;
        this.avaid_pl = idAva;
        this.fid_pl = fid
        this.display_name = displayName;
    },

    setName(strName) {
        if (this.lbName !== null) {
            if (strName.length > 12) {
                strName = strName.substring(0, 12) + '...'
            }
            this.lbName.string = strName;
        }
    },

    setAg(ag) {
        if (this.lbAg !== null) {
            this.lbAg.string = GameManager.getInstance().formatNumber(ag);
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

        // if (isReady) {
        this.imgAvatar.node.color = cc.Color.WHITE;
        // } else {
        //     this.imgAvatar.node.color = cc.Color.GRAY;
        // }
    },

    setTurn(isTurn, timeTurn) {
        this.imgTime.node.active = isTurn;
        if (isTurn) {
            this.time_turn_cur = 0.0;
            this.time_turn = timeTurn;
            this.imgTime.fillRange = 0.0;
        }
    },

    setDealer(isD, isRight) {
        // this.is_dealer = isD;
    },

    setAvatar(avaId, name) {
        this.imgAvatar.node.getComponent("AvatarItem").loadTexture(avaId, name,null,this.vip_pl)
    },

    setDark(isDark) {

        this.imgAvatar.node.color = isDark ? cc.Color.GRAY : cc.Color.WHITE;
    },

    //Support function
    updatePlayerView() {
        this.setReady(true); //Auto update playerview in game
    },

    effectResult(money) { //Show fly money and win lose effect
        if (this.node === null) {
            return;
        }
        //Show fly money
        this.effectFlyMoney(money);
        cc.NGWlog('so tien bay len la======= ' + money);

        //Show animation
        this.effectWinLose(money > 0);
    },
    effectResultXocDia(money) {
        if (this.node === null) {
            return;
        }
        //Show fly money
        this.effectFlyMoney(money, 40, 60);

        //Show animation
        this.effectWinLose(money > 0);
    },

    effectFlyMoney(money, fontSize = 50, moveTo = 100) { //Show fly money effect
        if (typeof money !== 'number') {
            return;
        }
        //Set money more than 0
        var prefix = "";
        var font = null;
        if (money >= 0) {
            prefix = "+";
            font = this.fontPlus;
        } else {
            prefix = "-";
            font = this.fontSubtract;
        }

        //Create label
        var nodeText = new cc.Node('TextFly');
        var labelText = nodeText.addComponent(cc.Label);
        labelText.string = prefix + require('GameManager').getInstance().formatMoney(Math.abs(money));
        labelText.fontSize = fontSize;
        labelText.font = font;
        this.node.addChild(nodeText);

        //Effect
        var moveUp = cc.moveBy(this.timeResultEffect, cc.v2(0, moveTo));
        var del = cc.delayTime(moveUp.getDuration() * 0.5);
        var fade = cc.fadeOut(moveUp.getDuration() - del.getDuration());
        var eff = cc.spawn(moveUp, cc.sequence(del, fade));
        var act = cc.sequence(eff, cc.callFunc(() => {
            if (labelText.node !== null) {
                labelText.node.destroy();
            }
        }))
        labelText.node.runAction(act);
    },
    effectWinLose(isWin) { //Show animation win or lose

        if (isWin) {
            this.aniWinRound.node.active = true;
            this.aniWinRound.setAnimation(0, "animation", false);

            this.aniWinText.node.active = true;
            this.aniWinText.setAnimation(0, "animation", false);


            var funcEnd = () => {
                this.aniWinRound.paused = true;

                this.aniWinRound.node.active = false;

                // this.aniWinText.paused = true;
                this.aniWinText.node.active = false;
            }
            var actionNode = this.aniWinRound.node;
        } else {
            this.aniLose.node.active = true;
            this.aniLose.setAnimation(0, "animation", false);

            var funcEnd = () => {
                this.aniLose.paused = true;
                this.aniLose.node.active = false;
            }
            var actionNode = this.aniLose.node;
        }
        actionNode.stopAllActions();
        actionNode.runAction(cc.sequence(cc.delayTime(this.timeResultEffect), cc.callFunc(() => {
            funcEnd();
        })));

    },


    effectChangeMoney(moneyChange) {
        var nnoLa = new cc.Node('Label');
        var lb = nnoLa.addComponent(cc.Label);
        lb.fontSize = 40;
        lb.lineHeight = 40;
        if (moneyChange > 0) {
            lb.font = require('UIManager').instance.fontAdd;
            lb.string = '+' + require('GameManager').getInstance().formatNumber(moneyChange);
        } else {
            lb.font = require('UIManager').instance.fontSub;
            lb.string = require('GameManager').getInstance().formatNumber(moneyChange);
        }
        // lb.isSystemFontUsed = true;
        this.node.addChild(nnoLa);
        nnoLa.runAction(cc.sequence(cc.moveBy(1.0, cc.v2(0, 100)), cc.removeSelf()));
    },
    //------------------Bohn-------------------//

    EffectMoneyRun(numStr) {
        if (typeof numStr === 'undefined') return;
        var del = cc.delayTime(0.01);
        var func = cc.callFunc(() => {
            let num = parseInt(numStr);
            num = (num <= 8) ? num + 1 : 0;
            numStr = num;

        });
        var eff = cc.sequence(del, func);
        var act = cc.repeatForever(eff);
        numStr.node.runAction(act);

        //console.count("Effect done");
    },

    EffectMoneyByHuy(lbMoney) {
        if (typeof lbMoney === 'undefined') return;
        lbMoney.node.stopAllActions();
        for (let i = 0; i < lbMoney.string.length; i++) {
            if (lbMoney.string[i] !== ',') {
                var del = cc.delayTime(0.01);
                var func = cc.callFunc(() => {
                    let num = parseInt(lbMoney.string[i]);
                    num = (num < 9) ? num + 1 : 0;
                    lbMoney.string[i] = num;

                });
                var eff = cc.sequence(del, func);
                var act = cc.repeatForever(eff);
                lbMoney.node.runAction(act);
            }
        }

    },

    TinhNumberEffect(Ag, numberChange) { //tinh xem co bao nhieu chu so thay doi.
        let numberCurrent = Ag.toString();
        let numberAfter = (Ag + numberChange).toString();
        var i = numberChange.toString().length;
        if (numberCurrent.length === numberAfter.length) {
            if (numberCurrent[numberCurrent.length - i - 1] === numberAfter[numberAfter.length - i - 1]) {
                return i;
            } else {
                return i + 1;
            }
        }
    },
    destroyPlayer() {
        this.node.runAction(cc.sequence(cc.scaleTo(0.1, 0), cc.removeSelf()));
    },
    numberEffect(Ag, numberChange) {
        let numberCurrent = Ag.toString();
        let numberAfter = (Ag + numberChange).toString();
        let numChange = this.TinhNumberEffect(Ag, numberChange); //so chu so bi thay doi
        cc.NGWlog('number= ' + numChange);
        for (let i = 0; i < this.lbAg.length; i++) {
            if (this.lbAg[i] !== ',') {
                this.EffectMoneyRun(this.lbAg[i]);
            }
        }
    }

});

module.export = PlayerView;