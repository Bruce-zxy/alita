const APP_ROOT = "/app/lvyoto";

module.exports = {
    "APP_NAME": "SYS_APP_LVYOTO",
    "VERSION": "Ver 0.0.1 Build 20190722",

    "LOCAL_URL": {
        "ROOT"            : "/",

        "HOME"        : APP_ROOT + "/home",
        "HOME_DETAIL" : APP_ROOT + "/home/detail",
        
        "PROJECT": APP_ROOT + "/project",
        "PROJECT_FUNDS": APP_ROOT + "/project/funds",
        "PROJECT_FINANCING": APP_ROOT + "/project/financing",
        
        "SERVICE": APP_ROOT + "/service",
        "SERVICE_DETAIL": APP_ROOT + "/service/detail",
        
        "NEWS": APP_ROOT + "/news",
        "NEWS_DETAIL": APP_ROOT + "/news/detail",
        
        "MINE": APP_ROOT + "/mine",
        "MINE_FINANCIAL": APP_ROOT + "/mine/financial",
        "MINE_SERVICE": APP_ROOT + "/mine/service",
        "MINE_CARD": APP_ROOT + "/mine/card",
        "MINE_PROJECT": APP_ROOT + "/mine/project",
        "MINE_FUNDS": APP_ROOT + "/mine/funds",
        "MINE_PROVIDER": APP_ROOT + "/mine/provider",

        "SIGNUP": APP_ROOT + "/signup",
        "SIGNIN": APP_ROOT + "/signin",

        "PUBLISH": APP_ROOT + "/publish",
        "PUBLISH_PROJECT": APP_ROOT + "/publish/project",
        "PUBLISH_FUNDS": APP_ROOT + "/publish/funds",
        "PUBLISH_SERVICE": APP_ROOT + "/publish/service",
        "PUBLISH_MEMBER": APP_ROOT + "/publish/member",

    },

    "LOCAL_URL_SHOW": ['home', 'project', 'service', 'news', 'mine'],

    // "API_ROOT": "http://atlantis.yg-net.com/api",
    "API_ROOT": "http://localhost:3000/api",
    "API_URL": {
        "UPLOAD": {
            "BACKEND_STORAGE": ""
        }
    },

    DEFAULT_AVATAR: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1561547251987&di=e63f4f0adfe4ffffa7ed7fa8c0fc9580&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fa12f24e688c1cda3ff4cc453f3486a88adaf08cc2cdb-tQvJqX_fw658',
    COLOR_ARRAY: ['#42C7A9', '#F87477', '#FCB240', '#258CF6', '#8E73E2']
};


