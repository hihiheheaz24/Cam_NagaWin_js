// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require('PopupEffect'),

    properties: {
        listSpriteFrame:[cc.SpriteFrame],
        content:cc.Node,
        ItemPool:null,
        font:cc.Font,
        nodeAni:cc.Node,
        lbRed:cc.Label,
        lbBlack:cc.Label,
        _listRed:0,
        _listBlack:0,
        _listGreen:0,
        _total:0
    },

    // LIFE-CYCLE CALLBACKS:

    

    addHistory(number,color){
        if(color == 0){
            this._listRed ++;
        }else if (color == 1){
            this._listBlack ++;
        }else{
            this._listGreen ++;
        }
        this._total++;
        cc.NGWlog('total la======== ' + this._total);
        let numRed = Math.floor((this._listRed * 100) / this._total);
        this.lbRed.string = numRed +'%';

        let numBlack = Math.floor((this._listBlack * 100) / this._total);
        this.lbBlack.string = numBlack +'%';

        var nodeSp ;
            nodeSp = new cc.Node();
            nodeSp.addComponent(cc.Sprite).spriteFrame = this.listSpriteFrame[color];
            let nodeLb = new cc.Node('labelTest');
            let lb =  nodeLb.addComponent(cc.Label);
            lb.string = number
            lb.font = this.font;
            nodeSp.addChild(nodeLb);
            nodeLb.position = cc.v2(0,4);
       
        this.content.insertChild(nodeSp,0);
        this.nodeAni.parent = nodeSp;
        if(this.content.children.length > 30){
            let item = this.content.children[30];
            item.removeFromParent(true);
            item.destroy();
        }
    },
    setPool(pool){
        this.ItemPool = pool;
    },
    onClickClose(){
        this.node.active = false;
    },
    onEnable(){
        this.onPopOn();
    }


    // update (dt) {},
});
