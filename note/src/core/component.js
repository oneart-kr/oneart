"use strict";
const DOM = {};
const UI = {};

DOM.$ = (k, p = document) => p.querySelector(k);
DOM.$_$ = (k, p = document) => p.querySelectorAll(k);
DOM.map = fn => _ => _.map(fn).join('');
DOM.html = html => {
    const _ = document.createElement("div");
    _.insertAdjacentHTML("beforeend", html);
    return _.children;
}
DOM.convHTML = (fn, _) => _.size? DOM.html(DOM.map(fn)([..._])) : DOM.html(DOM.map(fn)(_));

DOM.section = (id, c = "width-max_1140") => (...i) => {
    const _ = DOM.html(`<section id ="${id}" class="${c} dp-none"></section>`)[0];
    _.append(...i);
    return DOM.$("#wrap").append(_)
}
DOM.set = (con) => {
    const _append = (fn, _id) => fn(_id);
    con.forEach(_append);
    DOM.$("#wrap").firstChild?.classList?.remove("dp-none");
}
DOM.removeChild = (el) => {
    while (el.firstChild) el.removeChild(el.firstChild);
}

DOM.toggle =(fn = () => true, c = "dp-none") => 
    (arr) => arr.forEach(_ => _.classList.toggle(c, !fn(_)));

DOM.switch = (init, obj) => (k = init) => {    
    obj.forEach(_ => _.classList.add("dp-none"));
    obj.get(k).classList.remove("dp-none")
}
DOM.showMatch = (filterKey) => (_c) => {
    const _match = (set, [k,v]) =>{
        if(v.size === 0) return set;
        return  set.add(v.has(_c.dataset?.[k]));
    };
    const isMatch = Object.entries(filterKey)
        .reduce(_match, new Set());

    const _visible = isMatch.has(false)? false : true;
    _c.classList.toggle("dp-none", !_visible);
}
DOM.drag = (btn, $) =>{
    let _curX = 0;
    let _curY = 0;
    let _prevX = 0;
    let _prevY = 0;

    const _elementDrag = (e) => {
        e.preventDefault();
        _curX = _prevX - e.clientX;
        _curY = _prevY - e.clientY;
        _prevX = e.clientX;
        _prevY = e.clientY;

        const {offsetTop , offsetLeft}= $;
        $.style.top = (offsetTop  - _curY) + "px";
        $.style.left = (offsetLeft - _curX) + "px";
    }
    const _closeDragElement = () => {
        document.onmouseup = null;
        document.onmousemove = null;
    }
    const _dragMouseDown = (e) => {
        e.preventDefault();
        _prevX = e.clientX;
        _prevY = e.clientY;
        document.onmouseup = _closeDragElement
        document.onmousemove = _elementDrag
    }
    btn.onmousedown= _dragMouseDown;
}
DOM.scrollFade = (...c)=> ($) =>{
    window.addEventListener("scroll", () => {
        if (window.scrollY > 100) 
          $.classList.add(...c);
        else 
          $.classList.remove(...c);
    });
}


//favicon
(() => document.head.appendChild(DOM.html(`
    <link rel="icon" href="src/img/asset/svg/favicon.svg" type="image/svg+xml">`)[0]))();

UI.group = (c = "flex-row")=>(...el) => {
    const _ = DOM.html(`<div class="${c}"></div>`)[0];
    _.append(...el);
    return _
}
UI.container = (id = `con_${CH.random()}`, c = "flex-center", f) => {
    const _ = DOM.html(`<div id=${id} class="${c}"></div>`)[0];
    if(f) _.addEventListener("click", f);
    return _;
}
UI.tab = (el, target, c) => {
    el.childNodes.forEach(_ => _.classList.remove(c));
    target.classList.add(c);
}
UI.optionBar = (c = "flex-gap_40 bg-blur") => (...i) => {
    const _ = DOM.html(`
        <div class="flex-center sticky-area">
            <div id = "options" class="font_08 flex-center option-bar ${c} transit_05"></div>
        </div>
    `)[0];

    DOM.$('#options', _).append(...i);
    DOM.scrollFade("bg-blur_dark")(DOM.$('#options', _));
    new Set(i).has(null) && _.classList.add("dp-none");
    return  _;
}
UI.popOver = (container, content) => {
    const {_id} = content
    const _btn = `<button popovertarget = "${_id}"></button>`;

    container.append(_btn, content);
    return container;
}
UI.accordion = (
    pos = "fix-block-end_left",
    btn = "flex-row flex-end",
    c = "font_08 flex-row bg-blur") => 
    (...con) => {
        const _id = `acc_${CH.random()}`;
        const _ = DOM.html(`
            <div class="accordion  ${btn} flex-gap_0 ${pos}">
                <input type="checkbox" id="${_id}" checked/>
                <label class="font_15 flex-center btn-circle bg-blur_dark entitie-filter cursor-pointer" for="${_id}"></label>
                <div class="accordion-content ${c}"></div>
            </div>`)[0];
        DOM.$(`.accordion-content `, _).append(...con);
        return _ 
}
UI.img = () => {    
    const _ratio = r => r > 1? "grid-img-wide" : "grid-img-narrow";

    const _meta = meta => DOM.map(_ => `<span>${_}</span>`)(meta);

    const _dataSet = obj => DOM.map(([k,v])=>`data-${k}="${v}"`)(Object.entries(obj));

    const _zoom = (meta,{dataset}) =>DOM.html(`<div>
        <div class="color-white flex-row column-line padding_05">${[...meta].map( _ => _.outerHTML).join('')}</div>
        <img class="img-zoom" src="./src/img/web/${dataset.path}"></div>`)[0];

    const handle = ({target}) => {
        if (target.tagName !== "IMG") return;
        const meta = DOM.$('.img-meta',target.parentNode).childNodes;
        UI.modal.set(_zoom(meta, target));
    }
    const _set =({ path, ratio = 1.4, meta, filter }) =>  `
        <div class="${_ratio(ratio)}" ${filter ? _dataSet(filter) : ''}>
            <img class= "img-thum" src="./src/img/thum/${path}" loading="lazy" data-path= "${path}">
            <div class="img-meta">${ meta ? _meta(meta) : ''}</div>
        </div>`;

    return {
        css: "grid-img cursor-zoom", handle, _set
    };
}
UI.ctrls = (f, c = ["btn-round btn-nonborder" , "bg-black"]) => {
    const _id = `btn_${CH.random()}`;
    const _set = _ => `<button class="${c[0]}" value="${_}">${_}</button>`;
    
    const _tab = (target) => {
        UI.tab(DOM.$(`#${_id}`), target, c[1]);
        return target.value;
    }
    const _toggle = (target) => {
        target.classList.toggle(c[1]);
        return UT.go(
            [...DOM.$(`#${_id}`).childNodes],
            _ =>_.filter(_ => _.classList.contains(c[1])),
            _ => _.map(_ => _.value)
            );
    }
    const _clear = (target) =>{
        const v = target.value;
        target.remove();
        return v;
    }
    const handle = (option) => (e) => {
        e.preventDefault();
        if(e.target.tagName !== "BUTTON") return;
        f(option(e.target));
    }
    return {
        toggle(css = "flex-row"){
            return {_set, _id, css, handle: handle(_toggle)};
        },
        clear(css = "flex-row"){
            return {_set, _id, css, handle: handle(_clear)};
        },
        reset(){
            const _ = DOM.html(`<button class="btn-circle bg-black font_16 entitie-clear"></button>`)[0];
            _.addEventListener("click",f);
            return _;
        },
        tab(arr){
            return UT.go(
                UI.container(_id, "flex-center", handle(_tab)),
                _ => (_.append(...DOM.convHTML(_set, arr)), _),
                _ => (_.firstChild.classList.add(c[1]), _),
                );
        }
    }
}
UI.table = {};

UI.table.cell = v => `<div class="flex_04">${v}</div>`;

UI.table.findIndex = (head) => con => head.indexOf(con);

UI.table.setRow = (length, cell = UI.table.cell) => Array.from({length}, () => cell);

UI.table.setHead = head => {
    const _row = UI.table.setRow(head.length);
    _row.forEach((row, i) => _row[i] = _row[i](head[i]));
    return _row;
}

UI.table.trim = row => row.map(_row => typeof _row === "function"? _row(''): _row);

UI.dropDown = (name, f) =>{
    const _id = `li_${CH.random()}`;
    const _handle ={};

    const _set =(a) => {
        return `<li><button class="dropdown-item" value="${a}">${a}</button></li>`
    }
    const _select = (c = "select") => DOM.html(`
    <div class="flex-align-center dropdown">
        <button class="dropdown-btn ${c}" value="${name}">${name}</button>
        <ul id ="${_id}" class="dropdown-list"></ul>
    </div>`
    )[0];
    const _search = () =>  DOM.html(`
        <div class="flex-align-center dropdown">
            <input class="input-list entitie-search" name ="${name}" placeholder="${name}">
            <ul id ="${_id}" class="dropdown-list "></ul>
            <button class="btn-clear entitie-clear bg-white dp-none"></button>
        </div>
    `)[0];
    const clickItems = ({target}) =>{
        const {value, tagName} = target;
        if(tagName !=="BUTTON") return;

        const _1 = target.closest(".dropdown").firstElementChild;
        _1.value = value;
        _1.innerText = value;
        _1.dispatchEvent(new Event('change'));
        _1.dispatchEvent(new Event('blur'));
    }
    const reset = ({target}) => {
        DOM.$('input', target.parentNode).value = "";
        _handle.keyup(null);
    } 
    _handle.change = ({target}) => f(target.value);
    _handle.focus = ({target}) => {
        target.parentNode.classList.add("active");
        DOM.$(`.btn-clear`, target.parentNode)?.classList.remove("dp-none");
    }
    _handle.blur = ({target}) => {
        const {parentNode, value} = target;
        parentNode.classList.remove("active");
        const isNull = value.length === 0;
        DOM.$(`.btn-clear`, parentNode)?.classList.toggle("dp-none", isNull)
    }
    _handle.keyup = (e) => {
        const _filter = (_) => {
            const btn = _.firstChild;
            const isMatch = e === null? true 
                : btn.value.includes(e.target.value);
            _.classList.toggle("dp-none", !isMatch);
        }
        DOM.$(`#${_id}`).childNodes.forEach(_filter);
    }
    const update=() => {
        const _p = DOM.$("button", DOM.$(`#${_id}`).parentNode);
        _p.value = name;
        _p.innerText = name;
    }
    return {
        select(arr = [], css){
            const container = _select(css);
            const btn = DOM.$("button", container);
            const ul = DOM.$(`#${_id}`, container);

            ["change", "focus", "blur",].forEach(_ => 
                btn.addEventListener(_, _handle[_]));

            ul.addEventListener("mousedown", clickItems);
            ul.append(...DOM.convHTML(_set, arr));
            const observer = new MutationObserver(update);
            observer.observe(ul, {childList: true})

            return {_id, css, container, _set}
        },
        search(arr = []){
            const container = _search();
            const ul = DOM.$(`#${_id}`, container);
            const btn = DOM.$('button', container);

            ul.append(...DOM.convHTML(_set, arr));
            ul.addEventListener("mousedown", clickItems);
            btn.addEventListener("click", reset);

            Object.keys(_handle).forEach(_ => 
                DOM.$('input',container).addEventListener(_, _handle[_]));

            return {_id, container, _set}
        }, 
    }
}
UI.modal =(() => {
    const _close = ({target}) => {
        if(target.tagName !== "DIALOG") return;
        target.close();
        DOM.removeChild(_);
    }
    const _ = DOM.html(`<dialog class="margin_0 entitie-close"></dialog>`)[0];
    _.addEventListener("click", _close);
    document.body.prepend(_);

    return {
        set(t){
            _.append(t);
            _.showModal();
        },
        disable(){
            _.removeEventListener("click", _close);
            _.classList.remove("entitie-close");
        },
        close(){
            _.close();
        }
    } 
})();
UI.nav = (() => {
    const navBar = DOM.html(`
        <nav class="nav bg-blur">
            <div class="nav-bar flex-align-center flex-btwn">
                <a class="flex-center" href="index.html">
                    <img class="nav-logo" src="src/img/asset/svg/logo-blue.svg"></a>
                <div id="nav-gap" class="flex-row flex_08"></div>
                <button id="nav-btn" class="nav-btn"></button>
                <ul id="nav-list" class="nav-list"></ul>
            </div>
        </nav>`)[0];
    document.body.prepend(navBar);

    const _set = (k) => `<li class="nav-item"><a title="${k}">${k}</a></li>`;

    const _active = ({target})=> target.classList.toggle("active");  
    const _select = ({target}) =>{
        const {tagName} = target;
        if (tagName!== "A" && tagName !== "LI") return;

        const title = target.title || target.firstChild.title;
        DOM.toggle(({id}) => id === title)(DOM.$_$("section"));

        UI.tab(DOM.$('#nav-list'), target.closest("li"), "color-blue_90");
        DOM.$("#nav-btn").classList.toggle("active");  
    }

    DOM.$('#nav-btn').addEventListener("click",_active);
    DOM.$("#nav-list").addEventListener("click",_select);
    return {
        run(con){
            DOM.$("#nav-list").append(...DOM.convHTML(_set, [...con.keys()]));
            DOM.$("#nav-list").firstElementChild.classList.add("color-blue_90")
        },
        append(...i){
            DOM.$("#nav-gap").append(...i);
        },
        disable(){
            DOM.$('#nav-btn').remove();
            DOM.$("#nav-list").remove();
        }
    }
})();
UI.toast = (() => {
    document.body.prepend(DOM.html(`<div id="toa--st" class="toast"></div>`)[0]);
    const _set = msg => DOM.html(`<div class="toast-item flex-center"><span>${msg}</span></div>`)[0];
    return {
        set(msg = "데이터가 없습니다."){
            const _ = _set(msg);
            DOM.$('#toa--st').append(_);

            setTimeout(() =>{
                _.classList.add("fadeOut");
                setTimeout(() =>  _.remove(), 1000);
            }, 2000);
        }
    }
})(); 
