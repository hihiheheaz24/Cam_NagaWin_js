cc.Class({
    extends: cc.Component,

    properties: {
        list: {
            default: null,
            type: cc.ScrollView
        },

        item: {
            default: null,
            type: cc.Prefab
        }
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    initItem: function(listItemData) {
        if(typeof listItemData === 'undefined') return null;
        if(listItemData.length == 0) return null;
        var listItem = [];

        for (let i = 0; i < listItemData.length; i++) {
            const d = listItemData[i];
            let itemAdd = cc.instantiate(this.item).getComponent('DailyBonusItem');
            itemAdd.initItem(d.day,d.ag,d.bonus,d.avaiable,d.active);
            itemAdd.node.scale = 1.32;
            this.list.content.addChild(itemAdd.node);
            this.list.enabled = false;
            listItem.push(itemAdd);
        }
        return listItem;
    },
});