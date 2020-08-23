cc.Class({
    name: 'BenefitItem',

    ctor: function () {
    },

    properties: ({
        nameEn: '',
        nameMy: '',
        txt_link: '',

        id_game: 0,

        vector_vip_num: {
            default: [],
            type: [cc.Integer]
        },

        vector_vip_bool: {
            default: [],
            type: [cc.Boolean]
        },
        vector_vip_percent: {
            default: [],
            type: [cc.Integer]
        }
    }),
});