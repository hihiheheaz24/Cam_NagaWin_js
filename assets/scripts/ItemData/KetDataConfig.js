var KetDataConfig = cc.Class({
    name: 'KetDataConfig',

    ctor: function () {
    },

    properties:()=>({
        vipmin: 0,
        vipminsafe: 0,
        money: 0,
        fee: {
            default: [],
            type: [cc.Integer]
        }
    })
});
module.exports = KetDataConfig;