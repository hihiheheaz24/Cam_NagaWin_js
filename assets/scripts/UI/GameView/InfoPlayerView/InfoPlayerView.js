cc.Class({
    extends: require('PopupEffect'),

    properties: {
        avatar: {
            default: null,
            type: cc.Sprite
        },

        lb_name: {
            default: null,
            type: cc.Label
        },

        lb_chip: {
            default: null,
            type: cc.Label
        },

        lb_id: {
            default: null,
            type: cc.Label
        },

        vipLayout: {
            default: null,
            type: cc.Node
        },

        listIconVip: {
            default: [],
            type: [cc.Sprite]
        },

        listSpriteFrameVip: {
            default: [],
            type: [cc.SpriteFrame]
        },

        btn_add: {
            default: null,
            type: cc.Button
        },

        btn_remove: {
            default: null,
            type: cc.Button
        },

        btn_mess: {
            default: null,
            type: cc.Button
        },

        item_mess: {
            default: null,
            type: cc.Prefab
        },

        // bg: cc.Node,
        // mask: cc.Node,
        id_player: "",
        name_player: "",
        pname: ""
    },
    start() { },

    init(data) {
        this.onPopOn();
        this.btn_add.node.active = true;
        this.btn_remove.node.active = true;
        this.btn_mess.node.active = true;
        this.lb_name.node.setPosition(-149, 117);
        cc.NGWlog(("data player = ", data));

        this.name_player = data.displayName;
        this.id_player = data.idFriend;
        this.pname = data.name;
        if (data.displayName.length > 13) data.displayName = data.displayName.substring(0, 13) + "..";
        this.lb_name.string = data.displayName;

        this.lb_chip.string = require('GameManager').getInstance().formatNumber(data.agFriend);
        this.lb_id.string = "ID: " + data.idFriend;
        this.setAvatar(data.idAva, this.name_player, data.fid, data.vip);
        var is_unfollow = true;
        for (var i = 0; i < Global.FriendPopView._listFriends.length; i++) {
            if (this.id_player === Global.FriendPopView._listFriends[i].idFriend) {
                var is_unfollow = false;
                break;
            }
        }
        var chat = this.node.getChildByName('chat');
        if (chat) {
            chat.removeFromParent();
        }
        let vip = data.vip;
        this.updateVip(vip);
        if (this.id_player === require('GameManager').getInstance().user.id) {
            this.lb_name.node.setPosition(-20, 117);
            this.btn_add.node.active = false;
            this.btn_remove.node.active = false;
            this.btn_mess.node.active = false;
            vip = require('GameManager').getInstance().user.vip;
            this.updateVip(vip);
            return;
        }

        this.btn_add.node.active = is_unfollow;
        this.btn_remove.node.active = !is_unfollow;

    },
    updateVip(vip) {
        //let vip = require('GameManager').getInstance().user.vip;
        if (vip >= 10) {
            vip = 10;
        }
        let vip1 = Math.floor(vip / 2);
        let vip2 = vip % 2;

        for (let i = 0; i < this.listIconVip.length; i++) {
            if (i + 1 <= vip1) {
                this.listIconVip[i].spriteFrame = this.listSpriteFrameVip[2];
            } else if (vip2 != 0) {
                vip2 = 0;
                this.listIconVip[i].spriteFrame = this.listSpriteFrameVip[1];
            } else {
                this.listIconVip[i].spriteFrame = this.listSpriteFrameVip[0];
            }
        }
    },
    setAvatar(id, name, fid, vip) {
        this.avatar.node.getComponent("AvatarItem").loadTexture(id, name, fid, vip);
    },
    onClose(event, data) {
        if (data == 1) require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickClose_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.onPopOff();
        // require("GameManager").getInstance().curGameViewId = parseInt(require("GameManager").getInstance().curGameId);
        //   require("GameManager").getInstance().setCurView(require("GameManager").getInstance().curGameViewId);
    },
    onClickMess() {
        require('SoundManager1').instance.playButton();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickMess_%s", require('GameManager').getInstance().getCurrentSceneName()));
        var item = cc.instantiate(this.item_mess).getComponent("MailViewMessage");
        item.node.name = 'chat';
        cc.NGWlog('ITEM NAME', item.node.name);
        item.initData(this.id_player, this.name_player);
        this.node.addChild(item.node);
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.CHAT_FRIEND);
    },
    onClickAdd() {
        require('NetworkManager').getInstance().sendFollow(this.name_player, this.id_player);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickAddFriend_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.btn_add.node.active = false;
        this.btn_remove.node.active = true;
    },
    onClickRemove() {
        require('NetworkManager').getInstance().sendUnfollow(this.id_player);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickUnFriend_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('GameManager').getInstance().onShowToast(require('GameManager').getInstance().getTextConfig('friend_remove_success'));
        Global.FriendPopView.onDeleteItem(this.id_fr);
        Global.TopRichView.onDeleteFriend(this.id_fr);
        this.btn_add.node.active = true;
        this.btn_remove.node.active = false;
    },
    //boom - 0, kiss - 1, rose - 2, beer - 3,water - 4, hand - 5, tomato - 6, slap - 7, egg - 8, rocket - 9
    onClickBoom() {
        cc.NGWlog('Click nem Boom!');
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickIcon_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (this.id_player === require('GameManager').getInstance().user.id) {
            let playerview = require('GameManager').getInstance().gameView.players;
            for (let i = 0; i < playerview.length; i++) {
                let pname = playerview[i].pname;
                if (playerview[i].id != require('GameManager').getInstance().user.id) {
                    require('NetworkManager').getInstance().sendChatEmo(require('GameManager').getInstance().user.uname, pname, 0);
                }
            };
        } else {
            require('NetworkManager').getInstance().sendChatEmo(require('GameManager').getInstance().user.uname, this.pname, 0);
        }
        this.onClose();
    },

    onClickKiss() {
        cc.NGWlog('Click nem Kiss!');
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickIcon_%s", require('GameManager').getInstance().getCurrentSceneName()));
        // require('NetworkManager').getInstance().sendChatEmo(require('GameManager').getInstance().user.uname, this.pname, 1);

        if (this.id_player === require('GameManager').getInstance().user.id) {
            let playerview = require('GameManager').getInstance().gameView.players;
            for (let i = 0; i < playerview.length; i++) {
                let pname = playerview[i].pname;
                if (playerview[i].id != require('GameManager').getInstance().user.id) {
                    require('NetworkManager').getInstance().sendChatEmo(require('GameManager').getInstance().user.uname, pname, 1);
                }
            };
        } else {
            require('NetworkManager').getInstance().sendChatEmo(require('GameManager').getInstance().user.uname, this.pname, 1);
        }

        this.onClose();
    },

    onClickRose() {
        cc.NGWlog('Click nem Rose!');
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickIcon_%s", require('GameManager').getInstance().getCurrentSceneName()));
        //require('NetworkManager').getInstance().sendChatEmo(require('GameManager').getInstance().user.uname, this.pname, 2);

        if (this.id_player === require('GameManager').getInstance().user.id) {
            let playerview = require('GameManager').getInstance().gameView.players;
            for (let i = 0; i < playerview.length; i++) {
                let pname = playerview[i].pname;
                if (playerview[i].id != require('GameManager').getInstance().user.id) {
                    require('NetworkManager').getInstance().sendChatEmo(require('GameManager').getInstance().user.uname, pname, 2);
                }
            };
        } else {
            require('NetworkManager').getInstance().sendChatEmo(require('GameManager').getInstance().user.uname, this.pname, 2);
        }

        this.onClose();
    },

    onClickBeer() {
        cc.NGWlog('Click nem Beer!');
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickIcon_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (this.id_player === require('GameManager').getInstance().user.id) {
            let playerview = require('GameManager').getInstance().gameView.players;
            for (let i = 0; i < playerview.length; i++) {
                let pname = playerview[i].pname;
                if (playerview[i].id != require('GameManager').getInstance().user.id) {
                    require('NetworkManager').getInstance().sendChatEmo(require('GameManager').getInstance().user.uname, pname, 3);
                }
            };
        } else {
            require('NetworkManager').getInstance().sendChatEmo(require('GameManager').getInstance().user.uname, this.pname, 3);
        }
        this.onClose();
    },

    onClickWater() {
        cc.NGWlog('Click nem dep!');
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickIcon_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (this.id_player === require('GameManager').getInstance().user.id) {
            let playerview = require('GameManager').getInstance().gameView.players;
            for (let i = 0; i < playerview.length; i++) {
                let pname = playerview[i].pname;
                if (playerview[i].id != require('GameManager').getInstance().user.id) {
                    require('NetworkManager').getInstance().sendChatEmo(require('GameManager').getInstance().user.uname, pname, 4);
                }
            };
        } else {
            require('NetworkManager').getInstance().sendChatEmo(require('GameManager').getInstance().user.uname, this.pname, 4);
        }
        this.onClose();
    },

    onClickHand() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickIcon_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (this.id_player === require('GameManager').getInstance().user.id) {
            let playerview = require('GameManager').getInstance().gameView.players;
            for (let i = 0; i < playerview.length; i++) {
                let pname = playerview[i].pname;
                if (playerview[i].id != require('GameManager').getInstance().user.id) {
                    require('NetworkManager').getInstance().sendChatEmo(require('GameManager').getInstance().user.uname, pname, 5);
                }
            };
        } else {
            require('NetworkManager').getInstance().sendChatEmo(require('GameManager').getInstance().user.uname, this.pname, 5);
        }
        this.onClose();
    },
});