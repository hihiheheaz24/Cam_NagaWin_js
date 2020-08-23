var GameManager = require('GameManager');

cc.Class({
    extends: cc.Component,

    properties: {
        lb_chip: {
            default: null,
            type: cc.Label
        },
        lb_times: {
            default: null,
            type: cc.Label 
        },
        btn_recevie: {
            default: null,
            type: cc.Button
        },
        sp_timeCd: {
            default: null,
            type: cc.Sprite
        },
        list_bgItem: {
            default: [],
            type: [cc.SpriteFrame]
        },
        time_countDown: {
            default: null,
            type: cc.Label
        },
        aniActive: {
            default: null,
            type: sp.Skeleton
        },
        activeData: null

    },
     onLoad () {
         this.countDownTime();
     },

    start () {

    },
    initItem(agBonus, lb_times, received, activeData) {
        this.lb_chip.string = GameManager.getInstance().formatMoney(agBonus);
        this.activeData = activeData;
        if (received === true) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.list_bgItem[1];
        }

        if (activeData === true) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.list_bgItem[2];
            this.lb_times.node.color = new cc.Color(236,0,0);
            
            if (GameManager.getInstance().promotionInfo.time > 0) {
                this.sp_timeCd.node.active = true;
                this.btn_recevie.node.active = false;
                this.lb_chip.node.active = false;
             
                this.node.runAction(
                    cc.repeatForever(
                        cc.sequence(
                            cc.delayTime(1),
                            cc.callFunc(() => {
                                this.countDownTime();
                            })
                        )
                    )
                );
            }
        }

        switch(lb_times) {
            case 0:
                this.lb_times.string = 'First time';
                break;
            case 1:
                this.lb_times.string = 'Second time';
                break;
            case 2:
                this.lb_times.string = 'Third time';
                break;
            case 3:
                this.lb_times.string = 'Forth time';
                break;
            case 4:
                this.lb_times.string = 'Fifth time';
                break;
            case 5:
                this.lb_times.string = 'Sixth time';
                break;
            default:
                this.lb_times.string = '';
        }
            
    },

    countDownTime() {
        if (require("GameManager").getInstance().promotionInfo.time <= 0) {
            if (this.activeData === true) {
                this.btn_recevie.node.active = true;
                this.lb_chip.node.active = true;
                this.lb_chip.node.setPosition(cc.v2(0, -60));
                this.sp_timeCd.node.active = false;
              //  this.aniActive.node.active = true;
            }
            this.node.stopAllActions();
            return;
        }
        
        var ho =
            Math.floor(
                (require("GameManager").getInstance().promotionInfo.time / 3600) % 24
            ) + "";
        var mi =
            Math.floor(
                (require("GameManager").getInstance().promotionInfo.time / 60) % 60
            ) + "";
        var se =
            Math.floor(require("GameManager").getInstance().promotionInfo.time % 60) +
            "";

        if (ho.length < 2) ho = "0" + ho;
        if (mi.length < 2) mi = "0" + mi;
        if (se.length < 2) se = "0" + se;

        var _time = ho + ":" + mi + ":" + se;
        this.time_countDown.string = _time;
    },
    onClickReceive() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickReceive_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        if (
            require("GameManager").getInstance().promotionInfo.time > 0 &&
            require("GameManager").getInstance().promotionInfo.online <= 0
        )
            return;
        
        require("NetworkManager")
        .getInstance()
        .sendPromotinGold(
            3,
            require("GameManager").getInstance().promotionInfo.online
        );

        Global.ChipOnline.onClose();
    }
});
