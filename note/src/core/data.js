"use strict";

const UT = {};
const CH = {};
const DT = {};
const NUM = {};

UT.tap = f => (a, ...bs) => (f(a, ...bs),a);
UT.curry = f => (a, ...bs) => 
    bs.length? f(a, ...bs) : (...bs) => f(a, ...bs);
UT.go = (a, ...fn) => fn.reduce((a, f) => f(a), a);
UT.pipe = (...fn) => a => fn.reduce((acc, f) => f(acc), a);
UT.toArr = (_) => Array.isArray(_) ? _ : UT.flattened([_]);// 삭제 예정
UT.toMap = (_, fn) => [..._].map(fn).join(''); //삭제 예정
UT.flattened = (arr) => [].concat(...arr);
UT.getClean = arr => arr.filter(_ => _);
UT.getUniq = (k) => arr => [...new Set(arr.map(_ => _[k]))].sort();

// numb로 분리
UT.sum = arr => arr.reduce((a, b) => Number(a) + Number(b), 0);
UT.avg = arr => UT.sum(arr) / arr.length;
UT.round = (place, n) => {
    const m = Math.pow(10, place);
    return Math.round(n * m) / m
}
// 뭐하는 거지??
UT.filter = (arr, filterKey, which) => 
    arr.filter(_ => _[which].some(v => filterKey.has(v)));

UT.sort = (k, opt = CH.ascending) => arr => 
    arr.sort((a,b) => opt(a[k], b[k]));
UT.groupBy = (_k, _obj) => {
    const classify = (acc, obj) => {
        let key = obj[_k];
        if (!acc[key]) acc[key] = [];

        acc[key].push(obj);
        return acc;
    }
    return Object.values(_obj).flat().reduce(classify, {});
};
//정렬 추가하기
UT.keySet = arr => UT.go(
    arr.map(_ => Object.keys(_)),
    UT.flattened,
    _ => [...new Set(_)],
);
//삭제예정
UT.getNestedObj = (o, ...k) => {
    if (k.length === 0) return o;
    let _k = k.shift();
    return o.hasOwnProperty(_k)? 
        UT.getNestedObj(o[_k], ...k) : undefined;
};
UT.getByKeys = (...k) => (o) =>{
    if (k.length === 0) return o;
    let _k = k.shift();
    return o.hasOwnProperty(_k)? 
        UT.getNestedObj(o[_k], ...k) : undefined;
}
// 배열로 감싸진 객체를 하나의 객체로 반환 // 배열을 감싸서 반환함....
UT.trimObj = (arr) => {
    return arr.reduce((acc, obj) => {
        Object.keys(obj).forEach(key => {
            if(!acc[key]) acc[key] = [];
            acc[key].push(obj[key]);
        });
        return acc;
    }, {});
}
UT.delDups =  (arr) => [...new Set(arr.map(JSON.stringify))].map(JSON.parse);

UT.editObj = (f) => (obj) => UT.go( 
    Object.entries(obj), f, Object.fromEntries);

UT.keyOnly = (...keys) => (arr) => arr.map( obj => 
    UT.editObj(_ => _.filter(([_k]) => keys.includes(_k)))(obj)
);


NUM.sum = arr => arr.reduce((a, b) => Number(a) + Number(b), 0);
NUM.avg = arr => UT.sum(arr) / arr.length;
NUM.round = (place, n) => {
    const m = Math.pow(10, place);
    return Math.round(n * m) / m
}


CH.descending = (a,b) => a < b ? 1 : a > b ? -1 : 0;
CH.ascending = (a,b) => a < b ? -1 : a > b ? 1 : 0;
CH.trim = (a, opt = /[ ()학교자술0-9]/g,) => 
    a.slice(0,2) + a.slice(2).replace(opt, "")
CH.compare = (a,b) => CH.trim(a) === CH.trim(b);
CH.split = (_t, text) => {
    const r = text.split(_t);
    r[1] = _t + r[1];
    return r
};
CH.random = (len = 10) => {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97) + Math.random().toString(36).slice(2, len)
};


DT.date = new Date();
DT.year = DT.date.getFullYear();
DT.month = DT.date.getMonth() + 1;
DT.day = DT.date.getDate(),
DT.ipsi = DT.month > 2? DT.year+1 : DT.year;
DT.oneDay = 24*60*60*1000;
DT.convDay = n => Math.ceil(n / DT.oneDay); 
DT.setHyphen = date => date.toISOString().split('T')[0];
DT.lastDate = month => new Date(DT.year, month, 0).getDate();
DT.leftDays = (year = DT.year) => (day1, day2 = DT.date) => {
    if(!day1) return null;

    return UT.go(
        day1.split(' ~')[0].split('/'),
        ([m, d]) => new Date(year, m - 1, d),
        _ => _ - day2,
        DT.convDay,
    ); 
}
DT.setFormat = dateObj => `${dateObj.getMonth()+1}/${dateObj.getDate()}`;
DT.getNumOfDays = day => (start, end) => {
    const _s = new Date(start);
    for (var i = 0; _s <= end; _s.setDate(_s.getDate() + 1)) 
    {
        i += _s.getDay() === day ? 1 : 0;
        
    }
    return i;
}

const DATA = (_modify = _ => _) => (_raw) => {
    let data = null;
    return {
        set(v){
            const _ = _raw[v];
            data = _?.length? _.map(_modify) : _modify(_);
            return this;
        },
        get(){
            return data;
        },
        getKeys(){
            return Object.keys(_raw).sort();
        },
        getAll(k){
            return UT.go( k,
                _ => _.map(_ => this.set(_).get()),
                UT.flattened,
                UT.getClean,
            )
        },
    }
} 

const DATA_REDUCER = (data, handler = _ => _) => {
    const key = `k_${CH.random()}`;
    const flag = `UPDATE_${key}`;
    const item = `v_${key}`;
    let _DATA = {};

    const _append = (state) =>!_DATA ? state :
        Object.entries(_DATA)
        .forEach(([k, v]) => state[k] = v);

    const _ = REDUCER.set({
        name: flag, 
        initState:{
            [key] : null,
            [item] : null,
        },
        reducer:{
            change(state, {value}){
                state[key] = value;
                state[item] = data.set(value).get();
                _DATA = handler(state[item], value);
                _append(state);
            },
        }
    });
    return {..._, key, flag, item};
};

const filterHandler =  (state, k, v) =>{
    const _wrap = v === "전체"? new Set() : 
        Array.isArray(v)? new Set(v) : new Set([v]);

    return {...state, [k]:_wrap};
}
const FILTER_REDUCER = ( handler = filterHandler) => {
    const filterKey = `filter_${CH.random()}`;
    const flag = `FILTER_${filterKey}`;
    const _ = REDUCER.set({
        name: flag, 
        initState:{
            [filterKey]: null
        },
        reducer:{
            filter(state, {key, value}){
                state[filterKey] = 
                    handler(state[filterKey], key, value);
            },
            reset(state,){
                const keys = Object.entries(state[filterKey])
                    .map(([k,v]) => [k, new Set()]);
                state[filterKey] = Object.fromEntries(keys);

            },
        }
    });
    return {..._, filterKey};
} 
const _log = UT.tap(console.log);
