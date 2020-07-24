cc.Class({
    extends: cc.Component,

    properties: {
        lb_TimeHour: cc.Label,
        lb_Content: cc.Label,
        lb_Chip: cc.Label,
        bkg_item:{
            default : null,
            type : cc.SpriteFrame
        },
        node_bkg:{
            default : null,
            type : cc.Sprite
        },
        count: 0
    },

    // onLoad () {},

    start () {

    },
    setInfo(timedate, username, reward, count){
        this.lb_TimeHour.string = timedate + '';
        this.lb_Content.string = username;
        this.lb_Chip.string = require('GameManager').getInstance().formatNumber(reward);
        this.count = count;
        if(count % 2 == 0){
            this.node_bkg.spriteFrame = this.bkg_item;
        }
        // let prefix = "";
        // this.lb_Chip.node.color = cc.Color.GREEN;
        // if (chipChange < 0)
        //     this.lb_Chip.node.color = cc.Color.RED;
        // else prefix = "+";
        // this.lb_Content.string = content = content.length > 25 ? content.substring(0, 25) + "..." : content;
        // this.lb_Chip.string = prefix +require("GameManager").instance.formatMoney(chipChange);
    },
    // update (dt) {},
});
