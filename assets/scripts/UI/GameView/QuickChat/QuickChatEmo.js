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
    extends: cc.Component,

    properties: {
        itemEmoAni: {
            default: null,
            type: cc.Prefab
        },

        itemText: {
            default: null,
            type: cc.Prefab
        },
        scrEmo:{
            type:cc.ScrollView,
            default:null
        },
        scrText:cc.ScrollView,
        btnEmo:cc.Node,
        btnText:cc.Node,
        nodeEffect:cc.Node,
        _isGame:false,
        _isTabEmo:false,
        _isGameTienLen:false,
    },

    // LIFE-CYCLE CALLBACKS:
    // (-110,-288)
    //(-185,170)
     onLoad () {
        this.node.setContentSize(cc.winSize);
        let cp = this.getComponent(cc.Sprite);
        if(cp){
            cp.sizeMode = 0;
        }
        
     },
    
     initText(){
         if(this.scrText.content.childrenCount < 1) {
            for (let i = 0; i < 10; i++) {
                let item = cc.instantiate(this.itemText).getComponent('ItemTextChatCasino');
                let textConfig = require('GameManager').getInstance().getTextConfig('chat_text_ingame');
                let textEdit = textConfig.replace('%d',require('GameManager').getInstance().curGameId).replace('%d',i + 1);
                let textAdd = require('GameManager').getInstance().getTextConfig(textEdit);
                item.initItem(textAdd);
                this.scrText.content.addChild(item.node);
            }
         }
       
     },
     initEmo(arrListEmo){
        //  cc.log("chieu cao content la== " + this.scrEmo.content.getContentSize().height);
        //  return;
         if(this.scrEmo.content.childrenCount < 1){
            var i;
            var lengthEmo = arrListEmo.length;
            for( i = 0 ; i < lengthEmo ; i++){
                let item = cc.instantiate(this.itemEmoAni).getComponent('ItemEmoChatCasino');
                this.scrEmo.content.addChild(item.node);
                item.init(arrListEmo[i] , (i +1) + '');
            }  
         }
        
     },
     resetScrText(){
        let length = this.scrText.content.childrenCount;
        for(let i = 0 ; i < length ; i++){
            this.scrText.content.children[i].destroy();
        }
        this.scrText.content.removeAllChildren(true);
     },
     onClick(event,data){
        switch(data){
            case "0":
                this._isTabEmo = true;
            this.btnEmo.children[0].active = true;
            this.btnText.children[0].active = false;
            this.scrEmo.node.active = true;
            this.scrText.node.active = false;
                break;
            case "1":
                this._isTabEmo = false;
            this.btnEmo.children[0].active = false;
            this.btnText.children[0].active = true;
            this.scrEmo.node.active = false;
            this.scrText.node.active = true;
                break;
        }
     },
     onOut(){
        this.nodeEffect.stopAllActions();
        this.nodeEffect.scale = 1;
        this.nodeEffect.opacity = 255;
        let ac1 = cc.scaleTo(0.2,0).easing(cc.easeBackIn());
        let ac2 = cc.fadeOut(0.2);
        this.nodeEffect.runAction(cc.sequence(cc.spawn(ac1,ac2),cc.callFunc(()=>{
            if(!this._isTabEmo)
            this.onClick(null,"0");
            this.node.removeFromParent()
            ;})) );
         
     },
     reset(){
        this.nodeEffect.stopAllActions();
        this.node.removeFromParent();
     },
     onIn(isGame , isTienLen = false){
        this._isgame = isGame ;
        if(!this._isgame){
            this.nodeEffect.setAnchorPoint(cc.v2(1, 0));
            this.nodeEffect.x = -cc.winSize.width/2  + this.nodeEffect.width + 44;
            this.nodeEffect.y = -cc.winSize.height/2  + 72;
            this.nodeEffect.children[0].position = cc.v2(-185,170);
        }else{
            this._isGameTienLen = isTienLen;
            if(this._isGameTienLen){
                this.nodeEffect.setAnchorPoint(cc.v2(1, 1));
                this.nodeEffect.x = cc.winSize.width/2  -  98;
                this.nodeEffect.y = cc.winSize.height/2  - 59;
                this.nodeEffect.children[0].position = cc.v2(-190,-190);
            }else{
                this.nodeEffect.setAnchorPoint(cc.v2(0, 0));
                this.nodeEffect.x = -cc.winSize.width/2 + 57;
                this.nodeEffect.y = -cc.winSize.height/2  + 72;
                this.nodeEffect.children[0].position = cc.v2(202,208);
            }
            
        }
         
        

        this.nodeEffect.scale = 0;
        this.nodeEffect.opacity = 0;
        this.nodeEffect.stopAllActions();
        let ac1 = cc.scaleTo(0.2,1,1).easing(cc.easeBackOut());
        let ac2 = cc.fadeIn(0.2);
        this.nodeEffect.runAction(cc.sequence(cc.spawn(ac1,ac2),cc.callFunc(()=>{
            if(!this._isTabEmo)
            this.onClick(null,"0");
        })) );
     }

    // update (dt) {},
});
