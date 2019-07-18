const APP_ROOT = "/app/volunteer";

module.exports = {
    "APP_NAME": "SYS_APP_WECHAT_volunteer",
    "VERSION": "Ver 0.1.0 Build 20190621",

    "LOCAL_URL": {
        "ROOT"            : "/",
        "HOME_URL"        : APP_ROOT,
        "EXCEPTION"       : APP_ROOT + "/exception",
        "MAIN_PAGE"       : APP_ROOT + "/mainpage",

        "HOME"            : APP_ROOT + "/mainpage/home",
        "HOME_LIST"       : APP_ROOT + "/mainpage/home/list",
        "LATEST_ACTIVITY" : APP_ROOT + "/mainpage/home/list/latest_activity",
        "ACTIVITY_NOTICE" : APP_ROOT + "/mainpage/home/list/activity_notice",
        "TRAINING_NOTICE" : APP_ROOT + "/mainpage/home/list/training_notice",
        "LATEST_RECRUIT"  : APP_ROOT + "/mainpage/home/list/latest_recruit",
        "HOME_DETAIL"     : APP_ROOT + "/mainpage/home/detail",
        
        "ATTENTION"       : APP_ROOT + "/mainpage/attention",
        "ATTENTION_DETAIL": APP_ROOT + "/mainpage/attention/detail",
        "ATTENTION_SEARCH": APP_ROOT + "/mainpage/attention/search",
        
        "SERVICE"         : APP_ROOT + "/mainpage/service",
        "SERVICE_SUBMIT"  : APP_ROOT + "/mainpage/service/submit",
        
        "MINE"            : APP_ROOT + "/mainpage/mine",
        "SETTING"         : APP_ROOT + "/mainpage/mine/setting",
        "NICKNAME"        : APP_ROOT + "/mainpage/mine/setting/nickname",
        "GENDER"          : APP_ROOT + "/mainpage/mine/setting/gender",
        "PHONE"           : APP_ROOT + "/mainpage/mine/setting/phone",
        "SCORES"          : APP_ROOT + "/mainpage/mine/scores",
        "ORDER"           : APP_ROOT + "/mainpage/mine/order",
        "ORDER_TODO"      : APP_ROOT + "/mainpage/mine/order/todo",
        "ORDER_WANTDO"    : APP_ROOT + "/mainpage/mine/order/wantdo",
        "SUGGESTION"      : APP_ROOT + "/mainpage/mine/suggestion",
        "COMPLAINT"       : APP_ROOT + "/mainpage/mine/complaint",
        "VOLUNTEER_APPLY" : APP_ROOT + "/mainpage/mine/volunteer_apply"
    },

    "API_ROOT": "http://atlantis.yg-net.com/api",
    "API_URL": {
        "UPLOAD": {
            "BACKEND_STORAGE": ""
        }
    },

    "ORDERS": {
        "LIFE_LONG_IN_MINUTE": 2
    },

    "EXCHANGE_RATE": {
        "POINTS": {
            "RATE_TO_DECUCT_CASH": 20,
            "RATE_TO_REWARD_CONSUMPTION": 10
        }
    },

    "WEATHER": {
        "API_URL": "http://api.k780.com",
        "APP_NAME": "weather.today",
        "API_KEY": "27807",
        "API_SIGN": "3a0343bfe2324c0837afde0d26e9d0e7",
        "API_WEAID": "36"
    },
    AMAP: {
        API_V3_URL: 'http://restapi.amap.com/v3',
        KEY: '6d03400761065ced940e1a7ef444a7b8'
    },
    DEFAULT_AVATAR: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1561547251987&di=e63f4f0adfe4ffffa7ed7fa8c0fc9580&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fa12f24e688c1cda3ff4cc453f3486a88adaf08cc2cdb-tQvJqX_fw658'
};


