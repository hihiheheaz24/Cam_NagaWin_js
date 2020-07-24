const GameManager = require('GameManager')

var DealerInGameView = cc.Class({
    extends: cc.Component,
    // name: 'DealerInGameView',

    properties: {
        background: {
            default: null,
            type: cc.Node
        },

        btn_tip: {
            default: null,
            type: cc.Button
        },

        lb_thank: {
            default: null,
            type: cc.Label
        },

        lb_chip: {
            default: null,
            type: cc.Label
        },

        fontPlus: {
            default: null,
            type: cc.Font
        },

        fontSubtract: {
            default: null,
            type: cc.Font
        }
    },

    init: function () {
        this.background.active = false;
    },

    show(content, chip) {
        this.background.stopAllActions();
        cc.NGWlog("active = " + this.background.active);
        var numRand = this.getRandomIntInclusive(1, 7);
        var key = "tip_thanks_" + numRand;
        var str = content + ", " + GameManager.getInstance().getTextConfig(key);
        this.background.active = true;
        this.lb_chip.string = GameManager.getInstance().formatNumber(chip);
        this.lb_thank.string = str;
        this.background.runAction(cc.sequence(cc.delayTime(3.5), cc.callFunc(() => {
            this.background.active = false;
        })));
    },

    onClickTip() {
        cc.NGWlog("on click send tip");
        require('NetworkManager').getInstance().sendTip();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickTip_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },

    getRandomIntInclusive(numMin, numMax) {
        numMin = Math.ceil(numMin);
        numMax = Math.floor(numMax);
        return Math.floor(Math.random() * (numMax - numMin + 1)) + numMin; //The maximum is inclusive and the minimum is inclusive 
    },

    effectFlyMoney(money, fontSize = 50) {       //Show fly money effect
        if(typeof money !== 'number') {return;}

        //Set money more than 0
        var prefix = "";
        var font = null;
        if(money >= 0) {
            prefix = "+";
            font = this.fontPlus;
        }else {
            prefix = "-";
            font = this.fontSubtract;
        }

        //Create label
        var nodeText = new cc.Node('TextFly');
        var labelText = nodeText.addComponent(cc.Label);
        labelText.string = prefix + require('GameManager').getInstance().formatMoney(Math.abs(money));
        labelText.fontSize = fontSize;
        labelText.font = font;
        // nodeText.position = cc.v2(this.lb_chip.getPosition().x, this.lb_chip.getPosition().y);
        nodeText.position = this.lb_chip.node.position;
        this.node.addChild(nodeText, 9696);

        //Effect
        var moveUp = cc.moveBy(this.timeResultEffect,cc.v2(0,100));
        var del = cc.delayTime(moveUp.getDuration()*0.5);
        var fade = cc.fadeOut(moveUp.getDuration() - del.getDuration());
        var eff = cc.spawn(moveUp,cc.sequence(del,fade));
        var act = cc.sequence(eff,cc.callFunc(()=>{if(labelText.node !== null) {labelText.node.destroy();}}))
        labelText.node.runAction(act);
    },

    start() {
    },
});
module.exports = DealerInGameView;