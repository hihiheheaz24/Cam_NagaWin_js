const GameManager = require('GameManager')


cc.Class({

    extends: cc.Component,
    // name: "ItemBetRoomView",

    properties: {
        listSpriteNormal: {
            default: [],
            type: [cc.SpriteFrame]
        },
        listSpriteVip: {
            default: [],
            type: [cc.SpriteFrame]
        },
        btn_select: {
            default: null,
            type: cc.Button
        },
        bg_Select: {
            default: null,
            type: cc.Sprite
        },
        ic_Lock: {
            default: null,
            type: cc.Sprite
        },
        ic_user: {
            default: null,
            type: cc.Sprite
        },
        lb_mark: {
            default: null,
            type: cc.Label
        },

        lb_require: {
            default: null,
            type: cc.Label
        },

        lb_cur_user: {
            default: null,
            type: cc.Label
        },

        sp_best_choise: {
            default: null,
            type: cc.Sprite
        },
        ic_best: {
            default: null,
            type: cc.Label
        },
        ic_Lock_pass: {
            default: null,
            type: cc.Sprite
        },
        cur_mark: 0,
        table_id: 0,
        index: null,
        isSelect: false,
        maxAgCon: 0,
        fontNormal: cc.Font,
        fontVip: cc.Font
    },
    start() {
    },

    setInfo: function (mark, _require, cur_user, is_select, is_best, index, maxAgCon, ag) {
        this.isSelect = is_select;
        this.cur_mark = mark;
        this.index = index;
        this.table_id = 0;
        this.maxAgCon = maxAgCon;
        this.lb_require.fontSize = 35;
        this.lb_require.node.on("size-changed", () => {
            if (this.lb_require.node.getContentSize().width > 160)
                this.lb_require.fontSize = 25;
        });
        this.lb_mark.string = GameManager.getInstance().formatMoney(mark);
        this.lb_mark.font = this.fontNormal;
        if (typeof _require != 'undefined') this.lb_require.string = /*"Require: " +*/ GameManager.getInstance().formatMoney(_require) + '+';
        let gameCur = GameManager.getInstance().curGameId;
        if (this.maxAgCon !== 0 && typeof maxAgCon != 'undefined' && typeof _require != 'undefined') {
            this.lb_require.string = GameManager.getInstance().formatMoney(_require) + " " + '-' + " " + GameManager.getInstance().formatMoney(this.maxAgCon);
        }
        if (gameCur === GAME_ID.BACCARAT || gameCur === GAME_ID.BLACKJACK) {
            this.lb_require.string = GameManager.getInstance().formatMoney(ag) + "+";
        }
        this.lb_cur_user.string = GameManager.getInstance().formatNumber(cur_user);


        this.btn_select.interactable = true;
        this.bg_Select.node.color = new cc.Color(255, 255, 255);
        this.ic_Lock.node.active = false;
        this.sp_best_choise.node.active = false;
        this.ic_best.node.active = false;
        if (is_select === false) {
            // this.btn_select.interactable = false;
            this.bg_Select.node.color = new cc.Color(127.5, 127.5, 127.5);
            this.ic_Lock.node.active = true;
        } else {
            if (is_best === true) {
                this.sp_best_choise.node.active = true;
                this.ic_best.node.active = true;
            }
        }
        this.ic_Lock_pass.node.active = false
    },
    setInfoVip: function (mark, player, is_select, tableId, indexx, isPrivate) {
        this.isSelect = is_select;
        this.cur_mark = mark;
        this.table_id = tableId;
        this.index = indexx;
        this.lb_mark.string = GameManager.getInstance().formatMoney(mark);
        this.lb_mark.font = this.fontVip;
        this.lb_cur_user.string = GameManager.getInstance().formatNumber(player);
        this.btn_select.interactable = true;
        this.bg_Select.node.color = new cc.Color(255, 255, 255);
        this.ic_Lock.node.active = false;
        this.sp_best_choise.node.active = false;
        this.ic_best.node.active = false;
        if (is_select === false) {
            this.bg_Select.node.color = new cc.Color(127.5, 127.5, 127.5);
            this.ic_Lock.node.active = true;
        } else {
        }

        //cc.NGWlog("====================> isPrivate ====> ", isPrivate);
        if (isPrivate) this.ic_Lock_pass.node.active = true;
        else this.ic_Lock_pass.node.active = false;

    },
    isnomal() {
        var num = 0;
        if (this.index % 2 === 0)
            num = this.index / 2;
        else
            num = (this.index - 1) / 2;
        if (num % 3 === 0) {
            this.bg_Select.spriteFrame = this.listSpriteNormal[0];
        }
        if (num % 3 === 1) {
            this.bg_Select.spriteFrame = this.listSpriteNormal[1];
        }
        if (num % 3 === 2) {
            this.bg_Select.spriteFrame = this.listSpriteNormal[2];
        }
        this.lb_require.node.active = true;
        this.lb_cur_user.node.setPosition(-8, -50);
        this.ic_user.node.setPosition(-29, -48);
        this.lb_cur_user.node.color = new cc.Color(255, 255, 255);
        this.ic_user.node.color = new cc.Color(255, 255, 255);
        this.lb_mark.node.setPosition(0, 3);
    },
    isVip(indexSpr) {
        var num = 0;
        // if (this.index % 2 === 0)
        //     num = this.index / 2;
        // else
        //     num = (this.index - 1) / 2;
        // if (num % 3 === 0) {
        //     this.bg_Select.spriteFrame = this.listSpriteVip[0];
        // }
        // if (num % 3 === 1) {
        //     this.bg_Select.spriteFrame = this.listSpriteVip[1];
        // }
        // if (num % 3 === 2) {
        //     this.bg_Select.spriteFrame = this.listSpriteVip[2];
        // }
        this.bg_Select.spriteFrame = this.listSpriteVip[indexSpr];
        this.lb_require.node.active = false;

        this.lb_cur_user.node.setPosition(0, 45);
        this.ic_user.node.setPosition(-20, 47);
        // this.lb_cur_user.node.color = new cc.Color(25, 11, 124);
        // this.ic_user.node.color = new cc.Color(25, 11, 124);
        this.lb_mark.node.setPosition(-2, -10);
        this.sp_best_choise.node.active = false;
        this.ic_best.node.active = false;
    },
    onClickChoose() {
        // require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickJoinTableBySelectChip_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SMLSocketIO').getInstance().emitSIOCCCNew(cc.js.formatStr("ActionPlayJoin_%d", require('GameManager').getInstance().curGameId));
        require('SoundManager1').instance.playButton();
        if (this.isSelect) {
            this.btn_select.interactable = false;
            setTimeout(() => {
                this.btn_select.interactable = true;
            }, 1500);
            require('UIManager').instance.onShowLoad();
            if (this.table_id !== 0) {
                require('NetworkManager').getInstance().sendCheckPass(this.table_id);
            }
            else {
                require('NetworkManager').getInstance().sendChangeTable(this.cur_mark, 0);
            }
        };

        cc.NGWlog('-----------------------------------> TABLE IDDD LAA', this.table_id);
        // for data historyDT[i]
        // if (data history --> check trang thai chua cashout)
        // {
        //if == 1 ----> thông báo có muốn hủy đổi thưởng ko
        //if > 1 -------> chuyển tab history 
        // getconponent tab Historty
        //     ///return
        // }
        if (this.isSelect === false) {
            cc.log("user.nmAg=" + GameManager.getInstance().user.nmAg);
            cc.log("user.countMailAg==" + Global.FreeChipView.countMailAg);
            if (GameManager.getInstance().user.nmAg > 0 || Global.FreeChipView.countMailAg > 0) {
                GameManager.getInstance().onShowWarningDialog(
                    GameManager.getInstance().getTextConfig("txt_not_enough_money_gl"),
                    DIALOG_TYPE.TWO_BTN,
                    GameManager.getInstance().getTextConfig("txt_free_chip"),
                    () => {
                        require('UIManager').instance.onShowFreeChip();
                    },
                    GameManager.getInstance().getTextConfig("shop"), () => {
                        require('SMLSocketIO').getInstance().emitSIOCCCNew(cc.js.formatStr("ClickShop_%s", require('GameManager').getInstance().getCurrentSceneName()));
                        require('UIManager').instance.onShowShop();
                    }
                );
            } else {
                require('GameManager').getInstance().onShowWarningDialog(
                    require('GameManager').getInstance().getTextConfig('txt_not_enough_money_gl'),
                    DIALOG_TYPE.TWO_BTN,
                    require('GameManager').getInstance().getTextConfig('shop'),
                    () => {
                        require('UIManager').instance.onShowShop();
                    },
                    GameManager.getInstance().getTextConfig("label_cancel")
                );
            }
        }
        // cc.NGWlog('-----------------------------------> TABLE IDDD LAA', this.table_id);
    },

});

