const GameManager = require('GameManager');

cc.Class({
    extends: require("PopupEffect"),
    properties: {
        itemPlayer: {
            default: null,
            type: cc.Prefab
        },
        ScrPlayer: {
            default: null,
            type: cc.ScrollView,
        }
    },

    
    onClose() {
        let _this = this;
        require('SoundManager1').instance.playButton();
        this.onPopOff();
    },
    init(data) {
        this.onPopOn();
        let parent = this.ScrPlayer.content;
        for (let i = 0; i < data.length; i++) {
            let item = parent.children[i];
            const itemData = data[i];
            if (item == null || typeof item == 'undefined') {
                item = cc.instantiate(this.itemPlayer);
                parent.addChild(item);
            }
            if (itemData.id === GameManager.getInstance().user.id)
                item.active = false;
            else
                item.active = true;

            let itemCompoment = item.getComponent('itemPlayerView');
            itemCompoment.init(itemData.id, itemData.displayName, itemData.ag, itemData.vip, itemData.avatar_id, itemData.fid);
        }

        for (let i = data.length - 1; i < parent.length; i++) {
            parent.children[i].active = false
        }
        this.ScrPlayer.scrollToTop();
    }
});
