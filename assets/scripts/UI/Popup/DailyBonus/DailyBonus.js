
var DailyBonus = cc.Class({
    extends: cc.Component,

    properties: {

        lbTitle: {
            default: null,
            type: cc.Label
        },

        bg: {
            default: null,
            type: cc.Sprite
        },
        listPos: {
            default: [],
            type: [cc.Vec2]
        },
        animation: {
            default: null,
            type: sp.Skeleton
        },
    },


    onLoad() {
        this.node.setContentSize(cc.winSize);

        this.listPos = [];
        // this.listPos.push(cc.v2(-this.bg.node.getContentSize().width * 0.165, this.bg.node.getContentSize().height * 0.144));
        // this.listPos.push(cc.v2(-this.bg.node.getContentSize().width * 0.12, this.bg.node.getContentSize().height * 0.144));
        // this.listPos.push(cc.v2(this.bg.node.getContentSize().width * 0.12, this.bg.node.getContentSize().height * 0.144));
        // this.listPos.push(cc.v2(this.bg.node.getContentSize().width * 0.365, this.bg.node.getContentSize().height * 0.144));
        // this.listPos.push(cc.v2(-this.bg.node.getContentSize().width * 0.26, -this.bg.node.getContentSize().height * 0.28));
        // this.listPos.push(cc.v2(0, -this.bg.node.getContentSize().height * 0.28));
        // this.listPos.push(cc.v2(this.bg.node.getContentSize().width * 0.26, -this.bg.node.getContentSize().height * 0.28));
        this.listPos.push(cc.v2(-268, 90));
        this.listPos.push(cc.v2(-176, -171));

        this.lbTitle.node.string = require('GameManager').getInstance().getTextConfig("txt_daily_bonus");
        this.onlineDay = require('GameManager').getInstance().user.onlineDay % 7;
        this.listPromotionDay = require('GameManager').getInstance().user.listPromotionDay;
        this.getData();
        this.node.getComponent('PopupEffect').onPopOn();
    },

    start() {
        //
    },

    onOut(e, data) {
        this.node.destroy();
        if (data == 1) require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("clickCloseDailyBonus_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },

    getData() {
        for (let i = 0; i < this.listPromotionDay.length; i++) {
            const proAg = this.listPromotionDay[i];

            //Get ag
            var agData = 0;
            var bonusData = 0;
            if (proAg.indexOf('_') !== -1) {
                agData = parseInt(proAg.substring(0, proAg.indexOf('_')));
                bonusData = parseInt(proAg.substring(proAg.indexOf('_') + 1, proAg.length));
            }
            else {
                agData = parseInt(proAg);
                bonusData = 0;
            }

            //Set day
            var dayData = i + 1;
            //Set avaiable
            var avaiData = false;
            if (dayData >= this.onlineDay)
                avaiData = true;

            //Set active
            var activeData = false;
            if (dayData == this.onlineDay)
                activeData = true;

            let itemDaily;
            if (require('UIManager').instance.dailyPool.size() < 1) {
                let temp = cc.instantiate(Global.ItemDaily.node);
                require('UIManager').instance.dailyPool.put(temp);
            }

            itemDaily = require('UIManager').instance.dailyPool.get().getComponent('DailyBonusItem');
            itemDaily.initItem(dayData, agData);
            itemDaily.dailyCha = this;
            let initPos = i < 4 ? this.listPos[0] : this.listPos[1];
            let deltaX = i < 4 ? i * itemDaily.node.width + (10 * i) : (i - 4) * itemDaily.node.width + 10 * (i - 4);
            let posItem = cc.v2(initPos.x + deltaX, initPos.y);
            itemDaily.node.position = posItem;
            this.bg.node.addChild(itemDaily.node);

        }
    },

    onClickReceive() {
        this.onOut();
        require('NetworkManager').getInstance().sendPromotionDay();

    }
});
module.export = DailyBonus;