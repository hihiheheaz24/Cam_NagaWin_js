cc.Class({
    name: 'CardItem',

    ctor: function () {
    },

    properties: ({
        nameProvider: "",
        payType: 0,
        listItems: {
            default: [],
            type: [require('P1Item')]
        }
    }),
});
