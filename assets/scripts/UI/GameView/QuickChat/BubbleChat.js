var BubbleChat = cc.Class({
    extends: cc.Component,

    properties: {
        lbChat: cc.Label,
        timeIn: 0.3,
        timeAllive: 3.0,
        bkg: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //   this.lbChat.node.on("size-changed", this.ReSize, this)
        this.initPos = this.node.position;
    },

    start() {

    },

    // update (dt) {},

    initChat(text) {
        this.lbChat.string = text;

        var x = cc.winSize.width * 0.5;
        var y = cc.winSize.height * 0.5;

        // if (this.node.position.x > x) {
        //     this.node.flipX = true;
        //     this.lbChat.node.flipX = true;
        // }

        // if (this.node.position.y > y) {
        //     this.node.flipY = true;
        //     this.lbChat.node.flipY = true;
        // }

        //Effect
        var del = cc.delayTime(3.0);
        var out = cc.callFunc(() => { this.onOut(); });
        var act = cc.sequence(del, out);
        this.node.runAction(act);
        this.ReSize();
        let GameManager = require("GameManager").getInstance()
        if (GameManager.gameView) {
            //if (GameManager.curGameId === GAME_ID.TIENLEN) {
            let pos;
            let deltaX = this.initPos.x > 0 ? -1 : 1;
            pos = cc.v2(this.initPos.x + (this.node.width / 4) * deltaX, this.initPos.y);
            if (this.initPos.y > 0) {
                if (Math.abs(this.initPos.x) < cc.winSize.width / 4) {
                    pos = this.initPos;
                    if (this.initPos.y > cc.winSize.height / 4)
                        pos = cc.v2(this.initPos.x, this.initPos.y - this.node.width/10);
                }

            } else if (this.initPos.y < 0) {
                if (Math.abs(this.initPos.x) < cc.winSize.width / 4) {
                    pos = this.initPos;
                }

            }
            this.node.position = pos;
            this.bkg.node.scale = cc.v2(this.bkg.node.scaleX * deltaX, this.bkg.node.scaleY);

            // }
        }
    },
    ReSize() {
        if (this.lbChat.node.getContentSize().width > 300) {

            this.lbChat.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            this.lbChat.node.setContentSize(cc.size(300, 50))
        }
        this.node.setContentSize(cc.size(this.lbChat.node.getContentSize().width + 20, this.lbChat.node.height + 50));
        this.bkg.node.setContentSize(cc.size(this.lbChat.node.getContentSize().width + 20, this.lbChat.node.height + 50));
    },


    onOut() {
        var bouce = cc.scaleTo(0.3, 0).easing(cc.easeBackIn());
        var rmv = cc.callFunc(() => { this.node.destroy(); });
        var act = cc.sequence(bouce, rmv);
        this.node.runAction(act);
    }
});
module.export = BubbleChat;
