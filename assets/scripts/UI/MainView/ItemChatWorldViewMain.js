const GameManager = require('GameManager')


 cc.Class({

    extends: cc.Component,

    properties: {

        lb_vip: {
            default: null,
            type: cc.Label
        },
        lb_name: {
            default: null,
            type: cc.Label
        },

        lb_content: {
            default: null,
            type: cc.Label
        },

        id: "",
    },

    init: function (name, vip, id, content, type) {
        this.id = id;
        if (name.length > 10) {
            name = name.substring(0, 9) + "...";
        }
        if (id === GameManager.getInstance().user.id) {
            this.lb_vip.string = "[V." + vip + "]";
            this.lb_vip.node.color = cc.Color.GREEN;
            this.lb_name.string = name + ":";
            this.lb_name.node.color = cc.Color.GREEN;
        }
        else {
            if (vip > 4) {
                this.lb_vip.string = "[V." + vip + "]";
                this.lb_vip.node.color = cc.Color.RED;
                this.lb_name.string = name + ":";
            }
            else {
                this.lb_vip.string = "[V." + vip + "]";
                
            }
            this.lb_name.string = name + ":";
        }
        let lbContet = content;
        if(lbContet.length > 48){
            lbContet =  lbContet.substring(0,48) + '...';
        }
        this.lb_content.string = lbContet ;
    },

    

});

