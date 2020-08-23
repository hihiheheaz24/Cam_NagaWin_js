// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require('PopupEffect'),
    properties: {
        itemPlayer:cc.Prefab,
        scrView:cc.ScrollView
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onClickClose(){
        this.onPopOff(true)
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickClose_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },
    addItem(itemData){
        let item = cc.instantiate(this.itemPlayer).getComponent('itemPlayerView');
        item.init(itemData.id, itemData.displayName, itemData.ag, itemData.vip, itemData.avatar_id, itemData.fid);
        this.scrView.content.addChild(item.node);
    }

    // update (dt) {},
});
