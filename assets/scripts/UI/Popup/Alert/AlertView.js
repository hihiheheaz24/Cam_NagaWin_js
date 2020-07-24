var AlertView = cc.Class({
    extends: cc.Component,

    properties: {
        bg: {
            default: null,
            type: cc.Sprite
        },

        lb_tit: {
            default: null,
            type: cc.Label
        },
        _strSAON: [],
        is_show: false,
        _curIndexSaon: 0,
    },
    onLoad() {
        this.bg.node.active = false;
    },
    onHide() {
        this.bg.node.active = false;
        require('GameManager').getInstance().is_show_alert = false;
    },
    onShow(str) {
        this.node.active = require("ConfigManager").getInstance().is_bl_salert;
        if (require("GameManager").getInstance().currentView == CURRENT_VIEW.LOGIN_VIEW) return;
        require('GameManager').getInstance().is_show_alert = true;
        this.bg.node.active = true;
        this.lb_tit.string = str;
        this.lb_tit.node.stopAllActions();
        this.lb_tit.node.position = cc.v2(this.lb_tit.node.getContentSize().width / 2 + 200, 0);
        this.setPosAlert();

        var time_ = Math.round(this.lb_tit.node.getContentSize().width / 2 + 300) / 140 + 10;
        var len = Math.min(-900, -600 - this.lb_tit.node.getContentSize().width); // 250
        this.lb_tit.node.runAction(cc.sequence(cc.moveTo(time_, cc.v2(len, 0)), cc.callFunc(() => {
            this.showAlert();
        }, this)));

    },

    showAlert() {
        let arrAlert = require('GameManager').getInstance().list_alert;
        if (arrAlert.length < 1 && this._strSAON.length > 0) {
            require('GameManager').getInstance().list_alert.push(this._strSAON[this._curIndexSaon]);
            this._curIndexSaon++;
            if (this._curIndexSaon >= this._strSAON.length - 1) this._curIndexSaon = 0;
        }
        if (arrAlert.length < 1) {
            this.onHide();
            return;
        }
        this.onShow(arrAlert.shift())

    },
    hideAlert() {
        require('GameManager').getInstance().list_alert.length = 0;
        this.lb_tit.node.stopAllActions();
        this.onHide();
    },
    setPosAlert() {
        if (require("UIManager").instance.instantiate_parent.children.length === 0) {
            this.bg.node.position = cc.v2(cc.winSize.width / 2 - this.node.getContentSize().width / 2, cc.winSize.height / 2 * 0.65);
        } else {
            let pos = cc.v2(cc.winSize.width / 10, cc.winSize.height / 2.23);
            this.bg.node.position = pos;
        }
        if (require("GameManager").getInstance().gameView !== null) {
            if (require("GameManager").getInstance().curGameId === GAME_ID.SLOT_20_LINE_JP || require("GameManager").getInstance().curGameId === GAME_ID.SLOT50LINE) {
                let pos = cc.v2(cc.winSize.width / 2.5, cc.winSize.height / 2.23);
                this.bg.node.position = pos;
            } else {
                let pos = cc.v2(cc.winSize.width / 10, cc.winSize.height / 2.23);
                this.bg.node.position = pos;
            }
        }
    },
});
export default AlertView;