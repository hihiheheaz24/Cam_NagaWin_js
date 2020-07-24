cc.Class({
    extends: cc.Component,

    properties: {
        key: "",
        isChange: true
    },

    onEnable() 
    {
        cc.log('vso dsy ko  dđmdmdmdmdmdmdmdm');
        var lb = this.getComponent(cc.Label);
        if (lb === null) return;
        lb.string = require('GameManager').getInstance().getTextConfig(this.key);
        let list = require('GameManager').getInstance().listCCFS;
        if (!list.includes(this)) list.push(this);
    },

    getText() {
        var lb = this.getComponent(cc.Label);
        lb.string = require('GameManager').getInstance().getTextConfig(this.key);
    },
});