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
      ic_rank : {
          default : null,
          type : cc.Node
      },
      bg_avt : {
          default : null,
          type : cc.Sprite
      },
      lb_agwon : {
          default : null,
          type : cc.Label
      },
      lb_rank : {
          default : null,
          type : cc.Label
      },
      list_icon : {
          default : [],
          type : [cc.SpriteFrame]
      },
      lb_name : {
          default : null,
          type : cc.Label
      },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    init(data, rank){
        cc.log('chay chay chay chacyt hacyaycays');

        if (rank <= 3) {
            if (this.lb_rank != null)
                this.lb_rank.node.active = false;
            this.ic_rank.active = true;
            if (rank != 2)
                this.ic_rank.getComponent(cc.Sprite).spriteFrame = this.list_icon[rank - 1];
            else
                this.ic_rank.getComponent(cc.Sprite).spriteFrame = this.list_icon[1];
        } else {
            if (this.ic_rank != null)
                this.ic_rank.active = false;
            this.lb_rank.node.active = true;
            this.lb_rank.string = rank;
        }
        //if(rank % 2 == 0) this.getComponent(cc.Sprite).enabled = false;
        //set avt
        this.setAvatar(data.AV, data.N, data.FID);
        //set ag
        this.lb_agwon.string = require('GameManager').getInstance().formatMoneyAg(data.AG);
        //set name
        let name = data.N
        if (name.length > 9) {
            name = name.substring(0, 9) + "...";
        }
        this.lb_name.string = name;
    },
    setAvatar(id, name, fid) {
        this.bg_avt.node.getComponent("AvatarItem").loadTexture(id, name, fid);
    },

    // update (dt) {},
});
