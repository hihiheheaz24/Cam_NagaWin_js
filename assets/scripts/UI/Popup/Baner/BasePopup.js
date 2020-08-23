var BasePopup = cc.Class({
    extends: cc.Component,
    properties: {
        strTitle: {
            default: "",
            displayName: "Title",
            visible: false
        },

        popSize: {
            default: cc.size(1050, 565),
            displayName: "Popup size"
        },

        bg: {
            default: null,
            type: cc.Button,
            visible: true,
            displayName: 'Background'
        },

        bgTitle: {
            default: null,
            type: cc.Sprite,
            visible: true,
            displayName: 'Background title'
        },

        title: {
            default: null,
            type: cc.Label,
            visible: true,
            displayName: 'Title label'
        },

        content: {
            default: null,
            type: cc.Layout,
            visible: true
        },

        btnClose: {
            default: null,
            type: cc.Button
        }
    },
    
    start() {
        //*Background
        this.bg.node.setContentSize(cc.size(this.popSize.width, this.popSize.height));
        BasePopup.instance = this;
        //*Title
        //-BG Title
        this.bgTitle.node.setContentSize(cc.size(this.popSize.width - 4, this.bgTitle.node.height));

        //-Title
        this.title.string = this.strTitle;
        if (this.title.string === '')
            this.bgTitle.node.active = false;

        //*Content size
        this.content.node.setContentSize(cc.size(this.popSize));
        if (this.bgTitle.node.active)
            this.content.node.setContentSize(cc.size(this.popSize.width, this.popSize.height - this.bgTitle.node.height - this.content.getComponent(cc.Widget).bottom));

        // Initialize the keyboard input listening
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

  onDestroy() {
        cc.NGWlog('---> Name Scene:   ', cc.director.getScene().name);
        if (require('GameManager').getInstance().gameView !== null) {
            // require('GameManager').getInstance().setCurView(CURRENT_VIEW.GAME_VIEW);
            require("GameManager").getInstance().setCurView(require("GameManager").getInstance().curGameViewId);
        } else if (cc.director.getScene().name === 'main')
            require('GameManager').getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
    },

    onKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.escape:
                this.onOut();
                break;
        }
    },

    initEventClick(nameComponent) {
        if (this.btnClose !== null) {
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; //This node is the node to which your event handler code component belongs
            clickEventHandler.component = nameComponent;//This is the code file name
            clickEventHandler.handler = "onOut";
            this.btnClose.clickEvents.push(clickEventHandler);
        }
    },

    resize: function (size) {
        //*Background
        this.bg.node.setContentSize(size);

        //*Content size
        this.content.node.setContentSize(cc.size(size));
        if (this.bgTitle.node.active)
            this.content.node.setContentSize(cc.size(size.width, size.height - this.bgTitle.node.height - this.content.getComponent(cc.Widget).bottom));
    },

    onOut: function (event, customEventData) {
        //*Effect
        var effectUI = this.bg.getComponent('Effect_UI');
        if (effectUI === null) return;
        effectUI.out(() => {
            this.outFunction();
            this.node.destroy();
        });
    },

    outFunction: function () {
    }
});
module.exports = BasePopup;