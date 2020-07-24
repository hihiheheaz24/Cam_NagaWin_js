var ServerIP = cc.Class({
    name: 'ServerIP',

    ctor: function () {
    },

    properties: ({
        gameID: 0,
        gameIP: '',
        tx: false,
        txlob: false,
        chipsRoom: {
            default: [],
            type: [cc.Integer]
        },
        vip: 11,
    }),
});
module.exports = ServerIP;