cc.Class({
    extends: cc.Component,

    properties: {
        lb_name: {
            default: null,
            type: cc.Label
        },
        lb_id: {
            default: null,
            type: cc.Label
        },

        lb_chip: {
            default: null,
            type: cc.Label
        },
        avatar: {
            default: null,
            type: cc.Sprite
        },
        btn_message: {
            default: null,
            type: cc.Button
        },
        item_mess: {
            default: null,
            type: cc.Prefab
        },
        id_fr: "",
        name_fr: "",
    },


    init: function (name, avaId, chip, id) {
        cc.NGWlog('chay vao day may lan ha e oi');
        this.id_fr = id;
        this.name_fr = name;
        if (name.length > 15)
            name = name.substring(0, 15) + '...';
        this.lb_name.string = name;
        this.lb_id.string = "ID: " + id;

        if (typeof chip === "string") {
            this.lb_chip.string = chip;
        } else if (typeof chip === "number")
            this.lb_chip.string = require('GameManager').getInstance().formatNumber(chip);

        if (avaId > 0 && avaId < 999) {
            var url_ava = require('ConfigManager').getInstance().avatar_build.replace("%avaNO%", avaId);
            require('GameManager').getInstance().loadTextureFromUrl(this.avatar, url_ava);
        }
        
    },

    onClose() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCloseNodeMorePlayer_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        require('UIManager').instance.onHideView(this.node);
        //this.node.destroy();
    },

    
    onClickMess() {
        require('SoundManager1').instance.playButton();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickChat_%s", require('GameManager').getInstance().getCurrentSceneName()));
        var item = cc.instantiate(this.item_mess).getComponent("MailViewMessage");
        item.initData(this.id_fr, this.name_fr);
        this.node.addChild(item.node);
    },

});