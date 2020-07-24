cc.Class({
    extends: require("PopupEffect"),

    properties: {
        itemHistory: {
            default: null,
            type: cc.Prefab
        },
        scrListHist: {
            default: null,
            type: cc.ScrollView
        },
        listLb_percent: {
            default: [],
            type: [cc.Label]
        },
        vienvang: {
            default: null,
            type: cc.Node
        }
    },
    init() {
        this.onPopOn();
    },
    onClose() {
        require('SoundManager1').instance.playButton();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("clickClose_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.onPopOff();
    },
    reloadListDice(listDice) {
        let parent = this.scrListHist.content;
        for (let i = listDice.length - 1; i >= 0; i--) {
            let item = parent.children[listDice.length - 1 - i];
            const itemData = listDice[i];
            if (item == null || typeof item == 'undefined') {
                item = cc.instantiate(this.itemHistory);
                item.position = cc.v2(35,-65);
                parent.addChild(item);
            }

            let itemCompoment = item.getComponent('BauCuaHistoryItem');
            itemCompoment.init(itemData[0], itemData[1], itemData[2]);
        }
        for (let i = 0; i < parent.length; i++) {
            parent.children[i].active = false
        }
    },
    reloadListPercent(listCount) {
        var sum = 0;
        for (let i = 0; i < listCount.length; i++) {
            sum += listCount[i];
        }

        if(sum === 0) {
            for (let i = 0; i < listCount.length; i++) {
                this.listLb_percent[i].string = '0%';
            }
        } else {
            for (let i = 0; i < listCount.length; i++) {
                this.listLb_percent[i].string = (listCount[i] / sum * 100).toFixed(2) + '%';
            }
        }
    }
});
