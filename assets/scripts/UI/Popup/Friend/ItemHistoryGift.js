

cc.Class({
    extends: cc.Component,

    properties: {
        lb_TimeHour: cc.Label,
        lb_TimeDay: cc.Label,
        lb_Content: cc.Label,
        lb_Chip: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    initData(timeday, timehour, content, chipChange) {
        this.lb_TimeHour.string = timehour;
        this.lb_TimeDay.string = timeday;
        let prefix = "";
        this.lb_Chip.node.color = cc.Color.GREEN;
        if (chipChange < 0)
            this.lb_Chip.node.color = cc.Color.RED;
        else prefix = "+";
        this.lb_Content.string = content = content.length > 25 ? content.substring(0, 25) + "..." : content;
        this.lb_Chip.string = prefix +require("GameManager").instance.formatMoney(chipChange);
    }

    // update (dt) {},
});
