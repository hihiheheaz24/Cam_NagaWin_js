
cc.Class({
    extends: cc.Component,

    properties: {
        listImgBox:[cc.SpriteFrame],
        aniBlackJack:sp.Skeleton,
        textBust:cc.Node,
        boxPoint:cc.Node,
        labelPoint:cc.Label,
        labelMonney:cc.Label,
        nodeWating:cc.Node,
        Box2 : null,
        BoxMoney2 : null,
        money : 0,
        score : 0,
        background:cc.Node,
        parentCard:cc.Node,
        parentChip:cc.Node,
        parentChipDouble:cc.Node,
        parentChipWin:cc.Node,
        parentChipBaoHie:cc.Node,
        rangeMoveBoxPoint:13,
        positionXBoxPoint:47,
        id:null,
        player:null,
        atlatSpriteChip: cc.SpriteAtlas,
        shadowCard:cc.Node,
        isTypeWin:null,
        moneyAdd:0,
        nodeTextWin:cc.Node,
        listSpF:[cc.SpriteFrame],
        aniCheckBaiUp: sp.SkeletonData,
        aniBust : sp.SkeletonData,
        aniWow : sp.SkeletonData,
        posPlayerView:cc.Vec2,
        chip2:cc.SpriteFrame,
        isBox2:false,
    },
    start(){
        this.node.cascadeOpacity = false;
    },
    setInfo(id ){
        this.id = id;
       switch(id){
            case 0:
                // this.node.skewX = 1;
                this.node.rotation = 1;
               break;
            case 1:
                    // this.node.skewX = 8;
                    this.node.rotation = 38;
                    // this.parentChip.skewX = -8;
                    this.parentChip.rotation = -38;
                    // this.parentChipWin.skewX = -8;
                    this.parentChipWin.rotation = -38;
                    // this.parentChipDouble.skewX = -8;
                    this.parentChipDouble.rotation = -38;
                    // this.boxPoint.skewX = -7;
                    this.boxPoint.rotation = -38;
               break;
            case 4:
                    // this.node.skewX = -8;
                    this.node.rotation = -38;
                    // this.parentChip.skewX = 8;
                    this.parentChip.rotation = 38;
                    // this.parentChipWin.skewX = 8;
                    this.parentChipWin.rotation = 38;
                    // this.parentChipDouble.skewX = 8;
                    this.parentChipDouble.rotation = 38;
                    // this.boxPoint.skewX = 7;
                    this.boxPoint.rotation = 38;
               break;
            case 5:
                    // this.node.skewX = 1;
                    this.node.rotation = 1;
               break;

       }
    },
    initPosPlayerView(){
        let playerView ;
        for(let z = 0 ; z < this.gameView.players.length ; z++){
            if(this.id == this.gameView.players[z]._indexDynamic){
                this.player =  this.gameView.players[z];
             //   playerView = this.gameView.players[z]._playerView.node;
             cc.NGWlog('chay vao innit view blackjack=== ' + this.id);
                break;
            }
        }
    },
    effectChipEnd(type , money){
        this.posPlayerView =   this.getPostionInOtherNode(this.node , this.player._playerView.node);
        if(type >= 0){;
           
            let posPlayer =  this.posPlayerView;
            cc.NGWlog('== =toa do thang playerview la=== ' + posPlayer);
            let acSpawn = cc.spawn(cc.moveTo(0.2,posPlayer), cc.scaleTo(0.2, 0));
            this.parentChip.runAction(cc.sequence(acSpawn , cc.callFunc(()=>{
                for(let i = 0 ;  i < this.parentChip.childrenCount ; i++){
                    let item = this.parentChip.children[i];
                    item.removeFromParent();
                    item.destroy;
                }
            })));
            acSpawn = cc.spawn(cc.moveTo(0.2,posPlayer), cc.scaleTo(0.2, 0));
            this.parentChipDouble.runAction(cc.sequence(acSpawn , cc.callFunc(()=>{
                for(let i = 0 ;  i < this.parentChip.childrenCount ; i++){
                    let item = this.parentChip.children[i];
                    item.removeFromParent();
                    item.destroy;
                }
            })));
            if(type != 0){
                let posPlayer = this.posPlayerView;
                
                setTimeout(()=>{
                    if(this.node == null || typeof this.node == 'undefined') return;
                    acSpawn = cc.spawn(cc.moveTo(0.2,posPlayer), cc.scaleTo(0.2, 0));
                    this.parentChipWin.runAction(cc.sequence(acSpawn , cc.callFunc(()=>{
                    for(let i = 0 ;  i < this.parentChip.childrenCount ; i++){
                        let item = this.parentChip.children[i];
                        item.removeFromParent();
                        item.destroy;
                    }

                    let han = 0;
                    if(this.isBox2) han = 1;

                    let _money = this.moneyAdd + this.money;
                    cc.NGWlog('monnay ve la== ' + _money);
                    require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_nemxu);
                    this.player._playerView.setupEffectChangeMoney(this.player.ag , this.player.ag += _money);
                    this.gameView.InstantiateTextMoney(this.id,_money , han , 0);
                    
                })));
                },200);
            }else{
                setTimeout(()=>{
                    if(this.node == null || typeof this.node == 'undefined') return;
                    this.player._playerView.setupEffectChangeMoney(this.player.ag , this.player.ag += this.money );
                },200)
            }

            
        }else{
            let pos = this.getPostionInOtherNode(this.node,this.gameView.node.getChildByName('chip_Table'));
            let acSpawn =cc.spawn(cc.moveTo(0.2, pos), cc.scaleTo(0.2, 0).easing(cc.easeBackIn())) ;
            this.parentChip.runAction(cc.sequence(acSpawn , cc.callFunc(()=>{
                for(let i = 0 ;  i < this.parentChip.childrenCount ; i++){
                    let item = this.parentChip.children[i];
                    item.removeFromParent();
                    item.destroy;
                }
            })));
            acSpawn = cc.spawn(cc.moveTo(0.2, pos), cc.scaleTo(0.2, 0).easing(cc.easeBackIn())) ;
            this.parentChipDouble.runAction(cc.sequence(acSpawn , cc.callFunc(()=>{
                for(let i = 0 ;  i < this.parentChip.childrenCount ; i++){
                    let item = this.parentChip.children[i];
                    item.removeFromParent();
                    item.destroy;
                }
                let han = 0;
                    if(this.isBox2) han = 1;
                this.gameView.InstantiateTextMoney(this.id,-this.money,han );
                    
            })));
        }
    },
    dealerTracuoc(){
        this.InstantiateChipWithMoney(this.moneyAdd , this.parentChipWin , true);
        let pos =   this.getPostionInOtherNode(this.node,this.gameView.node.getChildByName('chip_Table'));
        this.parentChipWin.position = pos;
        this.parentChipWin.scale = 0;
        this.parentChipWin.runAction(cc.sequence( cc.spawn(cc.moveTo(0.2, cc.v2(0, 37)),cc.scaleTo(0.2,1)), /*cc.spawn(cc.sequence(cc.scaleTo(0.1,1.1),cc.scaleTo(0.1,1) ),*/cc.callFunc(()=>{
            this.parentChip.runAction(cc.sequence(cc.scaleTo(0.1,1.1), cc.scaleTo(0.1,1)));
        })));
    },
    handleFinish(moneyAdd){
        //this.boxPoint.active = false;
        //this.textBust.active = false;
        this.aniBlackJack.node.active = false;
        this.moneyAdd = parseInt(moneyAdd);
        this.nodeTextWin.active = true;
        let item = this.nodeTextWin.children[0];
        if(moneyAdd > 0){
            item.getComponent(cc.Sprite).spriteFrame = this.listSpF[0];
            require('SoundManager1').instance.dynamicallyPlayMusic('sounds/Roulette/coinAdd');
        }else if (moneyAdd == 0){
            item.getComponent(cc.Sprite).spriteFrame = this.listSpF[1];
        }else{
            item.getComponent(cc.Sprite).spriteFrame = this.listSpF[2];
            setTimeout(()=>{
                if(this.node == null || typeof this.node =='undefined') return;
                let length = this.parentCard.childrenCount;
                for(let i = 1 ; i < length ; i++){
                    let card = this.parentCard.children[i].getComponent(require('Card'));
                    card.setDark(true);
                }
            },200);
            require('SoundManager1').instance.dynamicallyPlayMusic('sounds/boluot');
        }
        item.x = 115;
        item.runAction(cc.sequence(cc.moveTo(0.2, cc.v2(0,0)).easing(cc.easeBackOut()), cc.delayTime(0.3),cc.moveTo(0.2,cc.v2(115,0)).easing(cc.easeBackIn()),cc.callFunc(()=>{this.nodeTextWin.active = false})));
        setTimeout(()=>{
            if(this.node == null || typeof this.node =='undefined') return;
            if(moneyAdd > 0){
                this.dealerTracuoc(moneyAdd);
                this.isTypeWin = 1;
            }else if (moneyAdd  == 0){
                this.isTypeWin = 0;
            }else{
                this.isTypeWin = -1;
                this.effectChipEnd(-1);
                this.labelMonney.node.active = false;
            }
        },500)
        
    },
    clearBet(){
        if(this.isTypeWin == null) return;
        this.labelMonney.node.active = false;
       if(this.isTypeWin == 1){
           this.effectChipEnd(1)
       }else if (this.isTypeWin == 0){
        this.effectChipEnd(0)
       }else if( this.isTypeWin == -1){
        
       }
    },
    bet(money){
        this.money = money;
        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/nemxu');
        if(!this.labelMonney.node.active)this.labelMonney.node.active = true;
        this.labelMonney.string =  require('GameManager').getInstance().formatMoney(money);
        this.parentChip.removeAllChildren();
        this.InstantiateChipWithMoney(money , this.parentChip );
    },
    SettingChipFly( node, delayTime , chipWin , posPlayer) {
        let parent = node.parent;
        let lengthListChip = parent.childrenCount;
        let temp = 6;
        
        let offsetY = temp * (lengthListChip - 1);
        node.opacity = 255;
        node.y = offsetY
        node.scale = 0.6;

        if(lengthListChip > 9)  node.opacity = 0;

        if(!chipWin){
            // node.runAction(cc.sequence( cc.callFunc(() => {
            //     node.position = posPlayer;
                 node.scale = 0
            //     node.opacity = 255;
            //     node.y += (5 * (lengthListChip - 1));
            // })))/*, cc.spawn(cc.moveBy(0.2, cc.v2(0, -20)).easing(cc.easeIn(2)), cc.fadeTo(0.15, 255).easing(cc.easeIn(2)), cc.scaleTo(0.2, 0.6).easing(cc.easeIn(2)))));*/
            node.runAction(cc.sequence(cc.place(posPlayer) ,cc.spawn(cc.moveTo(0.3, cc.v2(0,offsetY)), cc.sequence(cc.delayTime(0.1), cc.scaleTo(0.2,0.6)))));
        }
        
        
        // this.parentChip.position = posPlayer;
        // this.parentChip.scale = 0;
        // this.parentChip.runAction(cc.sequence(cc.spawn(cc.moveTo(0.3,cc.v2(0,-12)),cc.sequence(cc.delayTime(0.1) ,cc.scaleTo(0.2, 1)))   ,cc.scaleTo(0.15,1.1) , cc.scaleTo(0.1,1)));
        //  node.runAction(cc.moveTo(0.4,cc.v2(target.x + this.generateRandomNumber(-20,20) ,target.y + this.generateRandomNumber(-20,20))).easing(cc.easeExponentialOut()));
    },
    InstantiateChipWithMoney(_money , node, chipWin = false){
        let money = _money;
        if(money == 398)  money = 400;
        if(money == 990)  money = 1000;
        if(money < this.money ) money = this.money;

        var i = this.gameView.listCurChip.length - 1;
        let delayTime = 0;
        this.posPlayerView = this.getPostionInOtherNode(this.node , this.player._playerView.node);
        let posPlayer = this.posPlayerView;
        cc.NGWlog('pos chip playerview la== ' + posPlayer);
        for (i; i >= 0; i--) {
            let chip = this.gameView.listCurChip[i];
            if (money >= chip) {
                money -= chip;
                let item = new cc.Node();
                let cpSp = item.addComponent(cc.Sprite);
                let name = require('GameManager').getInstance().formatMoneyChip(chip);
                if(name == 2){
                    cpSp.spriteFrame = this.chip2;
                }else{
                    cpSp.spriteFrame = this.atlatSpriteChip.getSpriteFrame(name);
                }
                
                node.addChild(item, GAME_ZORDER.Z_PLAYERVIEW);
                item.opacity = 0;
                this.SettingChipFly(item,delayTime , chipWin , posPlayer);
                delayTime += 0.2;
                i++;
            }
            if (money <= 0) break;
        }
        setTimeout(()=>{
            if(this.node == null || typeof this.node == 'undefined') return;
            this.parentChip.runAction(cc.sequence(cc.scaleTo(0.1,1.1) , cc.scaleTo(0.1,1)))
        }, 300)
    },
    showScore(){
        let offset  = this.rangeMoveBoxPoint*  (this.parentCard.childrenCount - 3);
        this.boxPoint.x = this.positionXBoxPoint +  offset;
      //  cc.NGWlog('chay vao ham show score =============' + (this.positionXBoxPoint +  offset) + '====== ' + (this.parentCard.childrenCount - 3));
        if(this.id == 0 || this.id == 5){
            this.shadowCard.width = 117 +  (33  *(this.parentCard.childrenCount - 3));
        }
        if(this.score == 999){
            this.boxPoint.active = false;
            this.aniBlackJack.node.active = true;
            this.aniBlackJack.setAnimation(0,'animation',false);
        }else{
                if(!this.boxPoint.active) this.boxPoint.active = true;
                this.labelPoint.string = this.score;
                if(this.score > 21){
                    this.boxPoint.getComponent(cc.Sprite).spriteFrame = this.listImgBox[0];
                    if(this.id != 0 && this.id != 5) this.textBust.active = true;
                }else if(this.score == 21){
                this.boxPoint.getComponent(cc.Sprite).spriteFrame = this.listImgBox[2];
                }else{
                this.boxPoint.getComponent(cc.Sprite).spriteFrame = this.listImgBox[1];}
        }
    },
    turnOfBorderBox(){
        //this.betBordef.getComponent(cc.Sprite).enabled = false;
    },
    showWating(isShow){
        this.nodeWating.active = isShow;
    },
    doubleBoxCard( indexDy,target){
        this.boxPoint.active = false;
        this.shadowCard.width = 84;
        this.Box2 = cc.instantiate(this.gameView.boxCardPf).getComponent('BoxCard');
        this.Box2.gameView = this.gameView;
        this.Box2.setInfo(this.id);
        this.Box2.shadowCard.width = 84;
        this.Box2.isBox2 = true;
        switch(parseInt(indexDy)){
            case 0 :
            
            this.Box2.node.position = cc.v2(120,-100) ;
            this.node.x -= 120;
        
                break;
            case 1 :
             this.Box2.node.position = cc.v2(-525 , 139) //-507;
         
                break;
            case 2 :
      
                break;
            case 3 :
               
                break;
            case 4 :
             
             this.Box2.node.setPosition(cc.v2(525,139));
                break;      
        }
        target.node.addChild(this.Box2.node,this.node.zIndex - 1);
        this.Box2.player = this.player;
        this.Box2.bet(this.money);
    },
    doubleMonney(){
        require('SoundManager1').instance.dynamicallyPlayMusic('sounds/nemxu');
        this.money += this.money;
        this.labelMonney.string =  require('GameManager').getInstance().formatMoney(this.money);
        let itemChip = cc.instantiate(this.parentChip);
        this.parentChipDouble.addChild(itemChip);
        itemChip.rotation = 0;
        itemChip.skewX = 0;
        itemChip.position = cc.v2(0,0);
        this.parentChipDouble.scale = 0;
        this.parentChipDouble.y -= 100;
        this.parentChipDouble.x = 30;
        this.parentChip.runAction(cc.moveBy(0.3, cc.v2(-30,0)));
        setTimeout(()=>{
            if(this.node == null || typeof this.node =='undefined') return;
            this.parentChipDouble.runAction(cc.spawn(cc.moveBy(0.3,cc.v2(0,100)),cc.scaleTo(0.1,1)));
        },200)
    },
    unuse2(){
        let posMoveCard = this.getPostionInOtherNode(this.node , this.gameView.cardDeckL);
        this.aniBlackJack.node.active = false;
        this.boxPoint.active = false;
        this.textBust.active = false;
        this.labelMonney.node.active = false;
        let delay = 0;
        for(let v = 1 ; v < this.parentCard.childrenCount ; v++){
            let card = this.parentCard.children[v];
            let cpCard = card.getComponent(require('Card'));
            // cpCard.setTextureWithCode(0);
            cpCard.hideEffectCard();
            cpCard.setDark(false);
            let angle = this.convertAngle(card,-100);
            card.runAction(
                cc.sequence(
                    cc.delayTime(delay),
                    cc.spawn(
                        cc.moveTo(0.6, cc.v2(posMoveCard.x,posMoveCard.y-30)).easing(cc.easeCubicActionOut()),
                        cc.rotateTo(0.3,angle).easing(cc.easeCubicActionOut()),
                        cc.sequence(
                            cc.spawn(
                                cc.scaleTo(0.15,0.01,0.4),
                                cc.skewTo(0.15,0,-15),
                            ),
                            cc.callFunc(()=>{
                                card.getComponent('Card').setTextureWithCode(0),
                                card.skewY = 15;
                            }),
                            cc.spawn(
                                cc.scaleTo(0.15,0.4),
                                cc.skewTo(0.15,0,0),
                            ),
                        )
                    ), 
                    cc.callFunc(()=>{
                        card.active = false;
                    })
                )   
            );
            delay = delay + 0.3;
        }
        setTimeout(()=>{
            if(this.node == null || typeof this.node == 'undefined') return;
            if(this.Box2 != null){
                this.Box2.node.destroy();
                this.Box2 = null;
                if(this.id == 0) this.node.x = 0;
            }
            
            this.isTypeWin = null;
            this.boxPoint.x = 47;
            this.boxPoint.y = 90;
            this.score = 0;
           // this.node.active = true;
            this.nodeWating.active = false;
            this.shadowCard.width = 117;
            this.parentChip.stopAllActions();
            this.parentChipDouble.stopAllActions();
            this.parentChipWin.stopAllActions();
            this.parentChipBaoHie.stopAllActions();
            this.parentChip.scale = 1;
            this.parentChip.position = cc.v2(0,-12);
            this.parentChipDouble.scale = 1;
            this.parentChipDouble.position = cc.v2(0,-12);
            this.parentChipWin.scale = 1;
            this.parentChipWin.position = cc.v2(0,37);
            this.parentChipBaoHie.scale = 1;
            this.parentChipBaoHie.position = cc.v2(0,0);
            this.parentChip.removeAllChildren();
            this.parentChipWin.removeAllChildren();
            this.parentChipDouble.removeAllChildren();
            this.parentChipBaoHie.removeAllChildren();
        },300)
       
    },

    convertAngle (card,angle){
        let offset = this.node.rotation;
        let result = angle - offset;
        return result;
    },

    foldDownCard (card,delay){
        let size = card.scale;
        card.runAction(
            cc.sequence(
                cc.delayTime(delay),
                cc.spawn(
                    cc.scaleTo(0.15,0.01,size),
                    cc.skewTo(0.15,0,-15),
                ),
                cc.callFunc(()=>{
                    card.getComponent('Card').setTextureWithCode(0),
                    card.skewY = 15;
                }),
                cc.spawn(
                    cc.scaleTo(0.15,size),
                    cc.skewTo(0.15,0,0),
                ),
            )
        )
    },

    acceptScore(){
        let str = this.labelPoint.string.toString();
      //  debugger;
        if(str.split('/').length > 1){
            this.labelPoint.string = str.split('/')[1];
            let scotetemp = str.split('/')[1]
            if (scotetemp == 21){
                this.boxPoint.getComponent(cc.Sprite).spriteFrame = this.listImgBox[2];
            }

        }
    },
    setPosition(pos){
        // this.node.position = pos;
        // if(this.background != null)
        // this.background.position = pos;
    },
    getPostionInOtherNode(spaceNode, targetNode) {
        if (targetNode.parent == null) {
          return null;
        }
        let pos = targetNode.parent.convertToWorldSpaceAR(targetNode.getPosition());
        return spaceNode.convertToNodeSpaceAR(pos);
    },
    isTurnPlayer(isTurn = true){
        if (this.id != 0 && this.id != 5) return;
        if(isTurn){
            setTimeout(()=>{
                if(this.node == null || typeof this.node == 'undefined') return;
              this.parentCard.setSiblingIndex(5);
            },100);

            cc.NGWlog('chay vaoham actie shwdowCard');
            this.shadowCard.active = true;
            let posMove = cc.v2(0,115);
            let posBoxPointMove = cc.v2(80,194);
            if(this.id == 5){
                 posMove = cc.v2(0,45);
            }else{
                cc.NGWlog('chay vao ham move box point')
                this.boxPoint.stopAllActions();
                this.boxPoint.runAction(cc.moveTo(0.3, posBoxPointMove));
            }
            this.parentCard.stopAllActions();
            this.parentCard.runAction(cc.spawn(cc.scaleTo(0.3, 1.7),cc.moveTo(0.3 ,posMove)));
            this.rangeMoveBoxPoint = 13 * 1.7;
            this.positionXBoxPoint = 80;
        }else{
            this.parentCard.stopAllActions();
            this.parentCard.runAction( cc.spawn(cc.scaleTo(0.3, 1),cc.moveTo(0.3 , cc.v2(0,45))));
            this.rangeMoveBoxPoint = 13;
            this.positionXBoxPoint = 47;
            let offset   = 47 + this.rangeMoveBoxPoint*  (this.parentCard.childrenCount - 3);
            this.boxPoint.stopAllActions();
            this.boxPoint.runAction(cc.moveTo(0.3, cc.v2(offset  , 91)));
            setTimeout(()=>{
                if(this.node == null || typeof this.node == 'undefined') return;
               this.shadowCard.active = false;
               cc.NGWlog('chay vaoham off shwdowCard');
               this.parentCard.setSiblingIndex(1);
               if((this.id ==5 || this.id ==0 ) && this.score > 21  &&  this.score < 999){
                   this.textBust.active = true;
               }
            },280)
        }
    },
    TraCuocBaoHiem(){
        let itemChip = cc.instantiate(this.parentChip);
        this.parentChipBaoHie.addChild(itemChip);
        itemChip.rotation = 0;
        itemChip.skewX = 0;
        itemChip.position = cc.v2(0,0);
        this.parentChipBaoHie.scale = 0;

        let pos = this.getPostionInOtherNode(this.node,this.gameView.node.getChildByName('chip_Table'));
        let posTarget ;
        if(this.id == 4){
             posTarget = cc.v2(this.posPlayerView.x - 140 ,this.posPlayerView.y + 80  );
        }else{
             posTarget = cc.v2(this.posPlayerView.x + 140 ,this.posPlayerView.y + 80  );
        }
       
        this.parentChipBaoHie.position = pos;
        this.parentChipBaoHie.runAction(cc.sequence(cc.spawn(cc.moveTo(0.3,posTarget),cc.sequence(cc.delayTime(0.2),cc.scaleTo(0.1,1))), cc.delayTime(0.5),
        cc.spawn(cc.moveTo(0.2,this.posPlayerView),cc.sequence(cc.delayTime(0.1),cc.scaleTo(0.1,0))),
        cc.callFunc(()=>{
            for(let i = 0 ;  i < this.parentChipBaoHie.childrenCount ; i++){
                let item = this.parentChipBaoHie.children[i];
                item.removeFromParent();
                item.destroy;
            };
            this.gameView.InstantiateTextMoney(this.id,this.money);
        }),
        
        ));
    },
    initEffectcard(type){
        let ani;
        if(type == 0){
         ani = this.InstantiatiAni(this.aniBust);
         require('SoundManager1').instance.dynamicallyPlayMusic('sounds/boluot');
         ani.position = this.parentCard.position;
         ani.scale = this.parentCard.scale;
        }else if(type == 1){
            ani = this.InstantiatiAni(this.aniWow);
            require('SoundManager1').instance.dynamicallyPlayMusic('sounds/Roulette/PopUpOpen');
            ani.position = this.parentCard.position;
         ani.scale = this.parentCard.scale;
        }else if(type == 2){
            ani = this.InstantiatiAni(this.aniCheckBaiUp);
            ani.position = this.getPostionInOtherNode(this.node, this.parentCard.children[2]) 
            ani.scale = 0.5
        }
        setTimeout(()=>{
            ani.removeFromParent();
            ani.destroy();
        },2000)
    },
    InstantiatiAni(aniData , isLoop = false , ani = 'animation' ){
        let nodeAni = new cc.Node();
        this.node.addChild(nodeAni , GAME_ZORDER.Z_BUTTON);
        let cpCheckBai = nodeAni.addComponent(sp.Skeleton);
        cpCheckBai.skeletonData = aniData;
        cpCheckBai.premultipliedAlpha = false;
        cpCheckBai.setAnimation(0, ani, isLoop);
        return nodeAni;
    },

    
    // LIFE-C{YCLE CALLBACKS:


    // update (dt) {},
});
