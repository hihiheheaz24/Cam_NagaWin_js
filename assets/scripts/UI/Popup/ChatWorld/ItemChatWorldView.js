const GameManager = require('GameManager')


cc.Class({

    extends: cc.Component,

    properties: {
        lbNameL: cc.Label,
        lb_contentL: cc.Label,
        lb_timeL: cc.Label,
        bkg_Left: cc.Node,

        lbNameR: cc.Label,
        lb_contentR: cc.Label,
        lb_timeR: cc.Label,
        bkg_Right: cc.Node,
        isRight: true,

        id: -1,
    },

    onLoad() {
        // this.node.setContentSize(cc.size(this.node.getParent().width - 200, this.node.height));
    },
    startEffect() {
        this.node.runAction(cc.fadeTo(0.2, 255).easing(cc.easeSineIn()));


    },
    onEnable() {
        this.node.opacity = 1;
    },
    onDisable(){
        this.lb_contentL.string="...";
    },
    init(data) {
       
        // this.lb_contentL.node.on("size-changed", () => { this.changeSizeL(); });
        // this.lb_contentR.node.on("size-changed", () => { this.changeSizeR(); });
        this.id = data.id_player;
        this.isRight = false;
        if (data.id_player === require("GameManager").getInstance().user.id) {
            this.isRight = true;
            this.setItemRight(data);
        }
        else {
            this.setItemLeft(data);
        }
    },
    setItemLeft(data) {
        this.bkg_Right.active = false;
        this.bkg_Left.active = true;

        let name = data.name_player;
        if (name.length > 12) {
            name = name.substring(0, 10) + "...";
        }
        this.lbNameL.string = name;
        let str = data.content;
        // if(strTemp[1]== ""){
        //     str = Global.decode(strTemp[0]);
        // }

        this.lb_contentL.string = str;
        this.changeSizeL();
        let time_ = new Date(data.time);

        let min = time_.getMinutes();
        let hou = time_.getHours();
        let _time = (hou < 10 ? "0" + hou : hou) + ":" + (min < 10 ? "0" + min : min);

        this.lb_timeL.string = _time;
    },
    setItemRight(data) {
        this.bkg_Left.active = false;
        this.bkg_Right.active = true;

        let name = data.name_player;
        if (name.length > 12) {
            name = name.substring(0, 10) + "...";
        }
        this.lbNameR.string = name;
        let str = data.content;
        this.lb_contentR.string = str;
        this.changeSizeR();

        let time_ = new Date(data.time);

        let min = time_.getMinutes();
        let hou = time_.getHours();
        let _time = (hou < 10 ? "0" + hou : hou) + ":" + (min < 10 ? "0" + min : min);

        this.lb_timeR.string = _time;

    },

    changeSizeR() {
        if (this.lb_contentR.node.getContentSize().width > 500) {
            this.lb_contentR.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            this.lb_contentR.node.setContentSize(cc.size(500, 40))
        }
        this.bkg_Right.setContentSize(cc.size(this.lb_contentR.node.width + 50, this.lb_contentR.node.height + 30));
        this.node.setContentSize(cc.size(this.node.width, this.lb_contentR.node.height + this.lbNameR.node.height + 50));
        this.startEffect();
    },
    changeSizeL() {
        if (this.lb_contentL.node.getContentSize().width > 500) {
            this.lb_contentL.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            this.lb_contentL.node.setContentSize(500, 40);
        }
        this.bkg_Left.setContentSize(cc.size(this.lb_contentL.node.width + 50, this.lb_contentL.node.height + 30));
        this.node.setContentSize(cc.size(this.node.getParent().width, this.lb_contentL.node.height + this.lbNameL.node.height + 50));
        this.startEffect();

    },

    onClick() {
        if (this.id === require("GameManager").getInstance().user.id) return;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickUser_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('NetworkManager').getInstance().sendSearchFriendRequest(this.id);
    },



});

