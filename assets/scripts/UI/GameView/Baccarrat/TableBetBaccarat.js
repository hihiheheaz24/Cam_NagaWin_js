

cc.Class({
    extends: cc.Component,

    properties: {
        side_Player: cc.Node,
        side_PlayerPair: cc.Node,
        side_Banker: cc.Node,
        side_BankerPair: cc.Node,
        side_Tie: cc.Node,
        btn_Player: cc.Button,
        btn_PlayerPair: cc.Button,
        btn_Banker: cc.Button,
        btn_BankerPair: cc.Button,
        btn_Tie: cc.Button,
        lb_ChipBetSide_Player: cc.Label,
        lb_ChipBetSide_PlayerPair: cc.Label,
        lb_ChipBetSide_Banker: cc.Label,
        lb_ChipBetSide_BankerPair: cc.Label,
        lb_ChipBetSide_Tie: cc.Label,
        itemAnimPr:cc.Prefab,
        skeData:sp.SkeletonData,
        listButton:[cc.Node]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.listSideBet=[];
        this.listSideBet.push(this.side_Player,this.side_PlayerPair,this.side_Banker,this.side_BankerPair,this.side_Tie);
        this.posChip_Side_Player = [cc.v2(-80, -134), cc.v2(-130, -92), cc.v2(-330, -92), cc.v2(-270, -127), cc.v2(-364, -140)];
        this.posChip_Side_PlayerPair = [cc.v2(-280, -15), cc.v2(-352, -17), cc.v2(-443, -16), cc.v2(-390, 14), cc.v2(-290, -17)];
        this.posChip_Side_Banker = [cc.v2(104, -139), cc.v2(375, -136), cc.v2(162, -111), cc.v2(41, -108), cc.v2(324, -137)];
        this.posChip_Side_BankerPair = [cc.v2(250, -15), cc.v2(440, -15), cc.v2(269, 38), cc.v2(210, 20), cc.v2(315, -17)];
        this.posChip_Side_Tie = [cc.v2(-55, -15), cc.v2(83, -15), cc.v2(100,20), cc.v2(-130, 5), cc.v2(-80,20)];
        this.PValue = 0; this.PPValue = 0; this.BValue = 0; this.BPValue = 0; this.TieValue = 0;
        // for(let i=0;i<this.listButton.length;i++){
        //     this.listButton[i].node.on("touchstart")
        // }
    },
    onEnable() {
        this.reset();
    },
    hideButton(isInteractable){
        this.btn_Player.interactable=isInteractable;
        this.btn_PlayerPair.interactable=isInteractable;
        this.btn_Banker.interactable=isInteractable;
        this.btn_BankerPair.interactable=isInteractable;
        this.btn_Tie.interactable=isInteractable;
    },
    effWinSide(type) {
        let btnNode = this.node.getChildByName("btn_" + type);
        let sideNode = btnNode.getChildByName("side_" + type);
        let spr= btnNode.getComponent(cc.Button).pressedSprite;
        sideNode.getComponent(cc.Sprite).spriteFrame=spr;
        sideNode.runAction(cc.sequence(cc.callFunc(()=>{
            let typeAnim= type.toLowerCase();
           switch(typeAnim){
               case "player":
               case "banker":
               typeAnim=typeAnim+"win";
               this.initAnim(typeAnim);
               break;
               case "tie":
               this.initAnim(typeAnim);
               break;
           }
            
        }),cc.blink(1, 5),
            cc.callFunc(() => {
                sideNode.active = true;
            })
        ));
    },
    initAnim(animType){
        let anim=cc.instantiate(this.itemAnimPr).getComponent("ItemAnimation");
        anim.initAnimation(this.skeData);
        this.node.getParent().addChild(anim.node,30);
        anim.playAnimation(animType);
        setTimeout(()=>{
            if(anim.node)
            anim.node.destroy();
        },2500);
        
    }, 
    getChipPosOnSide(typeBet, index, value) {
        let posChip;
        let Node_LbChip;
        switch (typeBet) {
            case SIDE_BET.PLAYER:
                posChip = this.posChip_Side_Player;
                Node_LbChip = this.lb_ChipBetSide_Player;
                if (value)
                    this.PValue += value;
                break;
            case SIDE_BET.PLAYER_PAIR:
                posChip = this.posChip_Side_PlayerPair;
                Node_LbChip = this.lb_ChipBetSide_PlayerPair;
                if (value)
                    this.PPValue += value;
                break;
            case SIDE_BET.BANKER:
                posChip = this.posChip_Side_Banker;
                Node_LbChip = this.lb_ChipBetSide_Banker;
                if (value)
                    this.BValue += value;
                break;
            case SIDE_BET.BANKER_PAIR:
                posChip = this.posChip_Side_BankerPair;
                Node_LbChip = this.lb_ChipBetSide_BankerPair;
                if (value)
                    this.BPValue += value;
                break;
            case SIDE_BET.TIE:
                posChip = this.posChip_Side_Tie;
                Node_LbChip = this.lb_ChipBetSide_Tie
                if (value)
                    this.TieValue += value;
                break;
        }
        if (value) {
            this.setLbValue();
            Node_LbChip.node.runAction(cc.sequence(cc.scaleTo(0.1, 1.2), cc.scaleTo(0.1, 1.0)));
        }
        return posChip[index];
    },
    setLbValue() {
        this.lb_ChipBetSide_Player.string = require("GameManager").getInstance().formatMoney(this.PValue);
        this.lb_ChipBetSide_PlayerPair.string = require("GameManager").getInstance().formatMoney(this.PPValue);
        this.lb_ChipBetSide_Banker.string = require("GameManager").getInstance().formatMoney(this.BValue);
        this.lb_ChipBetSide_BankerPair.string = require("GameManager").getInstance().formatMoney(this.BPValue);
        this.lb_ChipBetSide_Tie.string = require("GameManager").getInstance().formatMoney(this.TieValue);
    },
    effTouchStart(){

    },
    reset() {
        this.PValue = 0; this.PPValue = 0; this.BValue = 0; this.BPValue = 0; this.TieValue = 0;
        this.setLbValue();
        let spr= this.btn_Banker.normalSprite;
        for(let i =0;i<this.listSideBet.length;i++){
            this.listSideBet[i].getComponent(cc.Sprite).spriteFrame=spr;
        }
    }
    // update (dt) {},
});
