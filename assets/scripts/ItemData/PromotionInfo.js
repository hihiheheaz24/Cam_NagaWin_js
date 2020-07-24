var PromotionInfo = cc.Class({
    name: 'PromotionInfo',

    ctor: function () {
    },

    properties: ({
        notEnoughMoney: 0, // hết tiền---
        adminMoney: 0, // admin---
        upVip: 0, // upVip---
        online: 0, // online
        video: 0, // video---
        giftCode: 0, //giftcode---
        time: 0, //time còn lại của online
        videoCurrent: 0, // video current
        videoMax: 0, // video max
        onlineCurrent: 0, // online current
        onlineMax: 0, // online max
        agViewVideo: 0, // ag xem video
        agOnline: 0, // ag online
        agInviteFriend: 0, // ag invite fr

        inviteMark: 0,
        inviteNum: 0,

        numberP: 0,
        timeWaiting: [],
        chipBonus: []
    }),
});
module.exports = PromotionInfo;