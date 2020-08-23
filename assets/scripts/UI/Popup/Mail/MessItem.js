
cc.Class({
    extends: cc.Component,

    properties: {
        background: {
            default: null,
            type: cc.Sprite
        },

        lb_name: {
            default: null,
            type: cc.Label
        },

        lb_time: {
            default: null,
            type: cc.Label
        },

        lb_content: {
            default: null,
            type: cc.Label
        },

        bg_Node: {
            default: null,
            type: cc.Node
        },
        isMessRight: false

    },

    start() {
    },
    onLoad() {
        // this.lb_content.node.on("size-changed", this.ReSize, this)
    },

    ReSize() {
        // if (this.lb_content.node.getContentSize().width > 500) {
        //     this.lb_content.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
        //     //this.lb_content.node.setContentSize(cc.size(500, 25));
        //     this.lb_content.node.width = 500;

        // }
        // this.node.setContentSize(cc.size(960, 25 + this.lb_content.node.getContentSize().height + 40));
        // this.bg_Node.setContentSize(cc.size(100 + this.lb_content.node.getContentSize().width, this.lb_content.node.getContentSize().height + 40));
        // let deltaX = this.isMessRight ? -this.bg_Node.width - 5 : this.bg_Node.width + 5
        // this.lb_time.node.position = cc.v2(deltaX, -this.bg_Node.height + 5);
    },
    initData: function (time_mess, content, nameSend) {

        var time_ = new Date(time_mess);
        let min = time_.getMinutes();
        let hou = time_.getHours();
        let _time1 = (hou < 10 ? "0" + hou : hou) + ":" + (min < 10 ? "0" + min : min);

        var _time = time_.getDate() + "/" + (time_.getMonth() + 1) + "  " + _time1;
        this.lb_time.string = _time;
        this.lb_name.string = nameSend;
        if (this.lb_name.string.length > 15)
            this.lb_name.string = this.lb_name.string.substring(0, 12) + '...';
        this.lb_content.string = content;
        if (this.lb_content.node.getContentSize().width > 500) {
            this.lb_content.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            this.lb_content.node.setContentSize(cc.size(500, 25));

        }
        this.node.setContentSize(cc.size(960, 25 + this.lb_content.node.getContentSize().height + 40));
        this.bg_Node.setContentSize(cc.size(50 + this.lb_content.node.getContentSize().width, this.lb_content.node.getContentSize().height + 40));
        let deltaX = this.isMessRight ? -this.bg_Node.width - 5 : this.bg_Node.width + 5
        this.lb_time.node.position = cc.v2(deltaX, -this.bg_Node.height + 5);
    }
});
