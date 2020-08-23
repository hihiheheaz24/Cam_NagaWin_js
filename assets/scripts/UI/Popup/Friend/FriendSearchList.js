
const FriendView = require('FriendView')
const GameManager = require('GameManager')
var FriendSearchList = cc.Class({
    extends: require('PopupEffect'),

    properties: {
        list_friend: {
            default: null,
            type: cc.ScrollView
        },
        item_friend: {
            default: null,
            type: cc.Prefab
        },
        curView:""
    },
    statics: {
        instance: null
    },

    start() {
        FriendSearchList.instance = this;
        this.init();
    },

    init: function () {
        this.onPopOn();
        for (var i = 0; i < this.list_friend.content.children.length; i++) {
            this.list_friend.content.children[i].destroy();
        }
        for (var i = 0; i < Global.FriendPopView._listFriends.length; i++) {
            this.addToList(Global.FriendPopView._listFriends[i]);
        }
    },

    addToList(data) {
        var item = cc.instantiate(this.item_friend).getComponent('ItemFriendSearchList');
        var _name = data.nameLQ.length > 0 ? data.nameLQ : data.name;
        if (_name.length > 12) {
            _name = _name.substring(0, 12) + '...';
        }
        var chip = GameManager.getInstance().formatNumber(data.agFriend);
        item.init( data.idAva, _name,data.vip, chip, data.idFriend,this.curView,data.fbid);
        this.list_friend.content.addChild(item.node);
    },
    onClose() {
        this.onPopOff(true); 
    }
    // update (dt) {},
});
module.exports = FriendSearchList;
