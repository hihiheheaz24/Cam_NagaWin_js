

cc.Class({
    extends: cc.Component,

    properties: {
        timeMove: 0,
        sprAtlas: cc.SpriteAtlas,
        sprBlur: cc.SpriteAtlas,
        listItem: [cc.Node],
        itemBlur: [cc.Node],
        itemMain: [cc.Node],
        numCol: null,
        typeItem: null,
        listIdView: [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.startPos = this.node.position;
        this.posReset = cc.v2(this.node.position.x, this.node.position.y + this.node.width * 3);
        this.Slot20IncaGameView = require("GameManager").getInstance().gameView;
        this.isHaveJPItem = false;
        for (let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].setContentSize(cc.size(125, 126));
        }
        for (let i = 0; i < this.itemMain.length; i++) {
            this.itemMain[i].setContentSize(cc.size(150, 145));
        }
    },
    getRanNum(min_value, max_value) {
        let random_number = Math.random() * (max_value - min_value) + min_value;
        return Math.floor(random_number);
    },
    setRandomId(isTurnOnSon) {
        let ranId1 = this.getRanNum(0, 13);
        let ranId2 = this.getRanNum(0, 13);
        let ranId3 = this.getRanNum(0, 13);
        let listdata = [ranId1, ranId2, ranId3];
        this.setSpriteListItem(listdata, isTurnOnSon);
    },
    setSpriteListItem(listData, isTurnOnSon = false) {
        for (let i = 0; i < this.listItem.length; i++) {
            let nameSpr = listData[i];
            this.setSprSonItem(i, nameSpr, isTurnOnSon);
            this.listItem[i].setContentSize(cc.size(180, 140));
        }
        this.listIdView = listData.slice();
    },
    setSprSonItem(index, nameSpr, isTurnOnSon) { //set sprite cho item con.'
        let itemBlur = this.itemBlur[index];
        let itemMain = this.itemMain[index];
        itemBlur.getComponent(cc.Sprite).spriteFrame = this.sprBlur.getSpriteFrame(nameSpr);
        // if (this.Slot20IncaGameView.speedSpin === 0.1) {
        //     itemBlur.active = isTurnOnSon;
        //     itemMain.active = !isTurnOnSon;
        // }
        itemMain.getComponent(cc.Sprite).spriteFrame = this.sprAtlas.getSpriteFrame(nameSpr);
    },
    getWordPosItemList() { // tra ve toa do  Cua Thang item Con trong GameView;
        let listPos = [];
        for (let i = 0; i < this.listItem.length; i++) {
            let pos = this.getWordPosItem(this.listItem[i]);
            listPos.push(pos);
        }
    },
    getWordPosItem(item) {// Lay Toa do cua item con
        let posWorld = this.node.convertToWorldSpaceAR(item);
        let posInGameView = this.Slot20IncaGameView.node.convertToNodeSpaceAR(posWorld);
        return posInGameView;
    },
    getScatterItem() {
        let data = {
            id: null,
            pos: null
        }
        for (let i = 0; i < this.listIdView.length; i++) {
            let id = this.listIdView[i];
            if (id === 12) {
                data.pos = this.getWordPosItem(this.listItem[i]);
                data.id = id;
                this.Slot20IncaGameView.scatterCount++;
                this.Slot20IncaGameView.listScatter.push(data);
            }
        }
    },
    getItemWithId(id) {
        let listItem = [];
        for (let i = 0; i < this.listIdView.length; i++) {
            if (this.listIdView[i] === id)
                listItem.push(this.listItem[i]);
        }
        return listItem;
    },
    setStateSpr(index,state){
        this.itemMain[index].active=state;
    }

});;
