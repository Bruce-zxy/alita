import React, {useEffect, useReducer} from 'react';
import _ from 'lodash';

import superFetch from '../lib/api';
import { setKeyValue, getKeyValue } from '../lib/persistance';
// import config from '../config';

import ShopContext from './shop';
import { shopReducer, ACTION_SET } from './shop.reducer';

const gTargetUrl = {
    login: '/login',
    user: '/user',
    current: '/user/current',
    orders: '/orders',
    carousel: '/carousel/list',
    category: '/category/list',
    content: '/content/list',
    service: '/service/list',
    attention: '/content/list',
    requirement: '/flow/requirement',
    task: '/flow/task',
    score: '/user/details'
}
export default function ShopProvider(props) {

    const [shopState, dispatch] = useReducer(shopReducer, {
        user: null,
        carousel: [],
        category: [],
        content: [],
        attention: [],
        service: [],
        requirements: [],
        tasks: [],
        score: []
    });

    console.log(shopState, 'init');

    useEffect(() => {
        (async () => {
            const params = window.location.search.slice(1).split('&').map(item => ({ [item.split('=')[0]]: item.split('=')[1] }));
            const token_obj = _.find(params, (o) => !!o['token']);
            const token = getKeyValue('token') ? getKeyValue('token') : token_obj ? token_obj.token : null;
            global.TNT('【TOKEN】', token);

            const promise_all = [];
            if (!token) {
                return alert('登陆失败！');
            } else {
                setKeyValue('token', token);
                promise_all.push(superFetch.get(gTargetUrl['category'] + '?pageSize=1000'));
                promise_all.push(superFetch.get(gTargetUrl['content'] + '?pageSize=1000'));
                promise_all.push(superFetch.get(gTargetUrl['service'] + '?pageSize=1000'));
                promise_all.push(superFetch.get(gTargetUrl['carousel'] + '?pageSize=100'));
                promise_all.push(superFetch.get(gTargetUrl['current']));
                promise_all.push(superFetch.get(gTargetUrl['requirement'] + '?pageSize=1000'));
                promise_all.push(superFetch.get(gTargetUrl['task'] + '?pageSize=1000'));
                promise_all.push(superFetch.get(gTargetUrl['score'] + '?pageSize=1000'));
            }
            Promise.all(promise_all).then(([category, content, service, carousel, user, requirements, tasks, score]) => {
                global.TNT('【category】：', category);
                global.TNT('【content】：', content);
                global.TNT('【service】：', service);
                global.TNT('【carousel】：', carousel);
                global.TNT('【user】：', user);
                global.TNT('【requirements】：', requirements);
                global.TNT('【tasks】：', tasks);
                global.TNT('【score】：', score);
                setKeyValue('current_user', !!user ? JSON.stringify(user) : '');
                dispatch({
                    type: ACTION_SET,
                    payload: { 
                        user: user,
                        category: !category || category instanceof Error ? [] : category.sort((a,b) => a.sort - b.sort),
                        content: !content || content instanceof Error ? [] : content.sort((a,b) => a.sort - b.sort),
                        service: !service || service instanceof Error ? [] : service.sort((a,b) => a.sort - b.sort),
                        carousel: !carousel || carousel instanceof Error ? [] : carousel.sort((a,b) => a.sort - b.sort),
                        user: !!user ? user : null,
                        requirements: !requirements || requirements instanceof Error ? [] : requirements.sort((a,b) => new Date(a.create_at) - new Date(b.create_at)),
                        tasks: !tasks || tasks instanceof Error ? [] : tasks.sort((a,b) => new Date(a.create_at) - new Date(b.create_at)),
                        score: !score || score instanceof Error ? [] : score.sort((a, b) => new Date(a.create_at) - new Date(b.create_at)),
                    }
                });
                console.log('ShopProvider::useEffect: ', {shopState, user});
            })
        })();
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
            const { token } = await superFetch.post(gTargetUrl['login'], payload);
            if (!token) throw new Error('登陆失败！');

            const user = await superFetch.get(gTargetUrl['user'] + '/current', null, { authorization: 'Bearer ' + token })

            dispatch({
                type: ACTION_SET,
                payload: { user: user }
            });

            setKeyValue('token', token);
            setKeyValue('current_user', JSON.stringify(user));
        } catch (err) {
            console.error('ShopProvider::login Error: ', err);
            return err;
        }
    }
    const updateUserInfo = async () => {
        try {
            const user = await superFetch.get(gTargetUrl['current']);
            
            if (!!user && !!user.id) {
                dispatch({
                    type: ACTION_SET,
                    payload: { user: user }
                });
                
                setKeyValue('current_user', JSON.stringify(user));
            }

        } catch (err) {
            console.error('ShopProvider::login Error: ', err);
            return err;
        }
    }

    const updateCurrentUserInfo = async (payload) => {
        try {
            const user = await superFetch.put(gTargetUrl['user'], payload);

            console.log(user);
            

            if (!!user && !!user.id) {
                dispatch({
                    type: ACTION_SET,
                    payload: { user: user }
                });

                setKeyValue('current_user', JSON.stringify(user));
            }

        } catch (err) {
            console.error('ShopProvider::login Error: ', err);
            return err;
        }
    }

    const getOrder = async () => {
        try {
            const requirements = await superFetch.get(gTargetUrl['requirement'] + '?pageSize=1000');
            const tasks = await superFetch.get(gTargetUrl['task'] + '?pageSize=1000');
            
            if (requirements instanceof Array && tasks instanceof Array) {
                dispatch({
                    type: ACTION_SET,
                    payload: { 
                        requirements: requirements.sort((a,b) => new Date(a.create_at) - new Date(b.create_at)), 
                        tasks: tasks.sort((a,b) => new Date(a.create_at) - new Date(b.create_at)) 
                    }
                });
            }
        } catch (err) {
            console.error('ShopProvider::update Error: ', err);
            return err;
        }
    }

    const getScore = async () => {
        try {
            const scores = await superFetch.get(gTargetUrl['score'] + '?pageSize=1000');
            if (scores instanceof Array) {
                dispatch({
                    type: ACTION_SET,
                    payload: {
                        scores: scores.sort((a, b) => new Date(a.create_at) - new Date(b.create_at))
                    }
                });
            }
        } catch (err) {
            console.error('ShopProvider::update Error: ', err);
            return err;
        }
    }
    

    return (
        <ShopContext.Provider value={{
            ...shopState,

            dispatch,

            fetch,
            create,
            remove,
            update,

            updateUserInfo,
            updateCurrentUserInfo,
            login,
            getOrder
        }}>
            {props.children}
        </ShopContext.Provider>
    );
}
