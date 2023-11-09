"use strict";
const createStore = (reducer = REDUCER) => {
    let state;
    let isDispatching = false;
    const _observer = new Map(); //{ flag : fn }
    return {
        getState(){
            return {...state};
        },
        dispatch(action){
            const oldState = { ...state };

            if (isDispatching) {
                throw new Error('Reducers may not dispatch actions.')
            }
            try {
                isDispatching = true;
                state = reducer.run(state, action);

                for (const key in state) {
                    if (oldState[key] !== state[key] && _observer.has(key)) {
                        _observer.get(key).forEach(_ => _ && _());
                    }
                }
            } finally {
                isDispatching = false;
            }
        },
        subscribe(type, _obs){
            if(!_observer.has(type))
                    _observer.set(type, new Set());
            _observer.get(type).add(_obs);
        },
    }
};
const REDUCER = (() => {
    const map = {};
    const COW = f => (state, {payload}) => {
        const copy = Object.assign({}, state);
        f(copy, payload);
        return copy;
    }
    return {
        set ({name, initState, reducer}) {
            const flag = name;
            const getAction = (_,[key]) =>{
                _[key] = (o) => ({
                    type: [_name, key], 
                    flag,
                    payload : o});
                return _
            };
            
            const _wrap = (_, [key,f])=>{
                _[key] = (state = initState, {payload}) =>{
                    const copy = Object.assign({}, state);
                    f(copy, payload);
                    return copy;
                }
                // _[key] = COW(f);
                return _
            };
            const _name = `${name}_${CH.random()}`;
            const _reducer = Object.entries(reducer);

            map[_name] = _reducer.reduce(_wrap, {});
            return {flag,..._reducer.reduce(getAction,{})}
        },
        run (state, action){
            return UT.getNestedObj(map, ...action.type)(state, action) || state;
        },
    }
})();
const configureView = (store) => (_state, c) => {
    const _id = c._id || CH.random();
    const _noContent = c._noContent || '';
    const _con = c.container || UI.container(_id, c.css, c.handle);

    const _set = () => {
        const _ = store.getState()[_state];
        if(!_ || _.size === 0 || _.length === 0) return _con.append(_noContent);

        return DOM.convHTML(c._set, _);
    }
    const _render = () => {
        const $ = DOM.$(`#${_id}`);
        DOM.removeChild($);

        const _ = store.getState()[_state];
        if(!_ || _.size === 0 || _.length === 0) return _con.append(_noContent);

        $.append(...DOM.convHTML(c._set, _));
    }
    const _filter = _keys => () =>{
        const keys = store.getState()[_keys];
        _con.childNodes.forEach(DOM.showMatch(keys));
    }
    const _check = (opt, _keys) => () => {
        const keys = store.getState()[_keys];
        const check = _ => _?.classList.toggle(opt, keys[_?.value]);

        setTimeout(() => {
            _con.childNodes.forEach(check)
        }, 10);
    }
    const _modal = () => {
        DOM.removeChild(_con);
        const _ = _set();

        if(_) _con.append(..._);
    }
    return {
        render(){
            store.subscribe(_state, _render);
            return this
        },
        modal(){
            store.subscribe(_state, _modal);
            return this
        },
        filter(k){
            store.subscribe(k, _filter(k));
            return this
        },
        disable(){
            _con.removeEventListener("click", c.handle);
            _con.classList.remove("cursor-zoom");
            return this
        },
        check(opt = "", k){
            store.subscribe(_state, _check(opt, k))
            return this
        },
        set(){
            return _con
        },
    }
}
const INIT = () =>{
    const STORE = createStore();
    const VIEW = configureView(STORE);
    const ACTION  = (fn, key = "payload") => value => 
        STORE.dispatch(fn({key, value}));
    return { ACTION, VIEW}
}



// const combineReducers = (reducers) => {
//     return (state = {}, action) => {
//       const nextState = {};
//       for (const key in reducers) {
//         console.log(action)
//         nextState[key] = reducers[key](state[key], action);
//         console.log(nextState)
//       }
//       return nextState;
//     };
//   };