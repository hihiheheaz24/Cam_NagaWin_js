
var StoreData = cc.Class({
    name: 'StoreData',

    ctor: function () {
    },

    properties: ({
        name: '',
        state: false,
        p: {
            default: [],
            type: [cc.Boolean]
        },
        pp: {
            default: [],
            type: [cc.Integer]
        },
        pp_mark: {
            default: [],
            type: [cc.Integer]
        }
    }),
});
module.exports = StoreData;