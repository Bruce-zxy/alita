import React, {useEffect, useReducer} from 'react';

import superFetch from '../lib/api';
import { setKeyValue, getKeyValue } from '../lib/persistance';
// import config from '../config';

import ShopContext from './shop';
import { shopReducer, ACTION_SET } from './shop.reducer';

const gTargetUrl = {
    login: '/login',
    user: '/user',
    orders: '/orders'
}
export default function ShopProvider(props) {

    const [shopState, dispatch] = useReducer(shopReducer, {
        user: {
            "id": "6d9f7d95-a714-4107-87f3-e8f43b9f5ce6",
            "create_at": "2019-06-28T00:53:37.360Z",
            "update_at": "2019-06-28T01:04:21.551Z",
            "account": "uu123",
            "nickname": "uu123",
            "avatar": null,
            "gender": 0,
            "vip": 0,
            "points": 0,
            "realName": "",
            "phone": "",
            "idCard": "",
            "address": "",
            "status": "",
            "ex_info": {},
            "roles": [
                {
                    "id": "00000000-0000-0000-0000-000000000001",
                    "create_at": "2019-06-28T00:31:24.128Z",
                    "update_at": "2019-06-28T00:31:24.128Z",
                    "name": "普通用户",
                    "token": "user",
                    "desc": "普通用户",
                    "sort": 1,
                    "ex_info": {},
                    "isSuperAdmin": false
                }
            ],
            "org": null,
            "avatarPath": "",
            "isSuperAdmin": false,
            "isVolunteer": false,
            "authorities": []
        },
        loading: false,
        orders: [],
    });

    useEffect(() => {
        const user = getKeyValue('current_user');
        console.log('ShopProvider::useEffect: ', {shopState, user});
        if (!!user) {
            dispatch({
                type: ACTION_SET,
                payload: { user: JSON.parse(user) }
            });
        }
    }, []);

    const fetch = async (target, criteria) => { 
        console.log('ShopProvider::fetch: ', {target, criteria});
        if (!target || !gTargetUrl[target]) return new Error('Parameter error!');
        try {
            const records = await superFetch.get(gTargetUrl[target], criteria);
            // console.log({records});
            if (!records || records instanceof Error) throw records;

            if (!!criteria) shopState.criteria[target] = criteria;
            dispatch({
                type: ACTION_SET,
                payload: { 
                    [target]: records,
                    criteria: {...shopState.criteria}
                }
            });
            
            return records;

        } catch (err) {
            console.error('ShopProvider::fetch Error: ', err);
            return err;
        }
    };
    const create = async (target, payload, refresh=true) => { 
        console.log('ShopProvider::create: ', {target, payload});
        if (!target || !gTargetUrl[target] ) return new Error('Parameter error!');
        try {
            const records = await superFetch.post(gTargetUrl[target], payload);
            // console.log({records});
            if (!records || records instanceof Error) throw records;

            if(refresh) fetch(target, shopState.criteria[target]);
            
            return records;

        } catch (err) {
            console.error('ShopProvider::create Error: ', err);
            return err;
        }
    };
    const remove = async (target, criteria, refresh=true) => { 
        console.log('ShopProvider::remove: ', {target, criteria}); 
        if (!target || !gTargetUrl[target] ) return new Error('Parameter error!');
        try {
            const records = await superFetch.delete(gTargetUrl[target], criteria);
            // console.log({records});
            if (!records || records instanceof Error) throw records;

            if(refresh) fetch(target, shopState.criteria[target]);
            
            return records;

        } catch (err) {
            console.error('ShopProvider::delete Error: ', err);
            return err;
        }
    };
    const update = async (target, payload, refresh=true) => { 
        console.log('ShopProvider::update: ', {target, payload}); 
        if (!target || !gTargetUrl[target] ) return new Error('Parameter error!');
        try {
            const records = await superFetch.put(gTargetUrl[target], payload);
            // console.log({records});
            if (!records || records instanceof Error) throw records;

            if(refresh) fetch(target, shopState.criteria[target]);
            
            return records;

        } catch (err) {
            console.error('ShopProvider::update Error: ', err);
            return err;
        }
    };
    const login = async (payload) => {
        try {
            const result = await superFetch.post(gTargetUrl['login'], payload);
            if (!result) throw new Error('登陆失败！')

            dispatch({
                type: ACTION_SET,
                payload: { user: result }
            });
            setKeyValue('current_user', JSON.stringify(result));
        } catch (err) {
            console.error('ShopProvider::login Error: ', err);
            return err;
        }
    }
    const updateCurrentUserInfo = async (newvalue) => { 
        console.log('ShopProvider::updateCurrentUserInfo: ', {newvalue, user: shopState.user}); 
        if (!shopState.user || !shopState.user.credential || !shopState.user.credential.user) throw new Error('未找到当前用户登陆信息！');
        
        try {
            const [userinfo] = await superFetch.put(gTargetUrl['users'], {
                criteria: {obj: { id: shopState.user.credential.user.id } },
                newvalue
            });
            // console.log({userinfo});
            if (!userinfo) throw new Error('用户信息更新失败！');
            
            const [credential] = await superFetch.get(gTargetUrl['usercredentials'], { id: shopState.user.credential.id });
            // console.log({credential});
            if (!credential) throw new Error('用户信息获取失败！');

            shopState.user.credential = credential;
            dispatch({
                type: ACTION_SET,
                payload: shopState
            });
            setKeyValue('current_user', JSON.stringify(shopState.user));

            return userinfo;

        } catch (err) {
            console.error('ShopProvider::update Error: ', err);
            return err;
        }
    };

    return (
        <ShopContext.Provider value={{
            ...shopState,

            dispatch,

            fetch,
            create,
            remove,
            update,

            updateCurrentUserInfo,
            login,
        }}>
            {props.children}
        </ShopContext.Provider>
    );
}
