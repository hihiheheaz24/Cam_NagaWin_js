var MailData = cc.Class({
    name: 'MailData',

    ctor: function () {
    },

    properties: ({
        idMsg: 0,
        t: 0,
        vip: 0,
        gold: 0,
        i: 0,
        moneyType: 0,
        from_id: 0,
        to_id: 0,
        avatar_id: 0,
        fbid: 0,
        time: 0,

        from: "",
        to: "",
        nameNotMe: "",
        title: "",
        msg: "",
        
        s: false,
        d: false,
        
    }),
});
module.exports = MailData;