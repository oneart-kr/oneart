class DOM{
    static replaceTxt(d, o, p){
        for (const key in o) {
            const t = p.querySelector(o[key]);
            t.innerText = (isNaN(d[key]))? 
                d[key]: d[key].toLocaleString();
        }
    }
    static set(d, k){
        return [...new Set(d.map(d => d[k])
            .filter(d=> d)
            .sort())];
    }
    static removeChild(t){
        while (t.firstChild){
            t.removeChild(t.firstChild);
          }
    }
    static appendContent(items, section){
        items.forEach(elem => 
            section.querySelector(elem.id)
                .append(elem.item.getContent())
        );
    }
}

class JS{
    static clone(o){
        return JSON.parse(JSON.stringify(o));
    }
    static avgNum(a){
        if (a.length === 0) return 0;
        return this.round2(a.reduce((t,n) =>
            t += n,0)/a.length);
    }
    static round2(n){
        return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
    }
    static descendingNum(n){
        return n.sort((a,b) => Number(b) - Number(a));
    }
    //(data, key)
    static groupBy(d, k){
        return d.reduce((t, e) => {
            const keyValue = e[k];

            if(!t[keyValue])
                t[keyValue] = [];

            t[keyValue].push(e);
            return t;
        },{})
    }
    //(target, key, number)
    static compareChar(t, k, n){
        if(!t|| !k) return false;
        return t.substring(0, n).includes(k.substring(0,n))
    }
    static mergeArr(...a){
        return a.reduce((t,e)=> {
            !e || t.push(...e);
            return t;
        },[]);
    }
    static sortChar(a,b){
        if (a > b) return -1;
        else if (b > a) return 1;
        else return 0;
    }    
    static charAscending(a,b){
        if (a > b) return -1;
        else if (b > a) return 1;
        else return 0;
    }
    static charDescending(a,b){
        if (a > b) return 1;
        else if (b > a) return -1;
        else return 0;
    }
    static avg(a,b){
        return Number(a) + Number(b)
    }
    static checkNum(n){
        if (!isNaN(n)) return true;
        else return false;
    }
}
class CC{
    static createNotice(className, msg){
        const div = document.createElement("div");
        div.className = "area_notice";

        div.insertAdjacentHTML("beforeend", `
        <span class="${className}"></span>
        <span class="color-grey_60">${msg}</span>`);
        return div;
    }
    static guideSelect(msg){
        return this.createNotice("img-guide-select", msg);
    }
    static filterNotice(msg){
        return this.createNotice("img-no-content", msg);
    }
}

class Modal{
    constructor(size, ...content){
        this.$modal = document.querySelector("#mo--dal")
            || this.create();

        this._content = this.createContent(size, content);
        this.$modal.addEventListener("click",
            this.handleClose.bind(this));
    }
    create(){
        const modal = document.createElement("div");
        modal.className = "modal-body dp-none";
        modal.id = "mo--dal";
        document.body.prepend(modal);
        return modal;
    }
    setBackgroundColor(className){
        this._content.classList.add(className);
        return this;
    }
    show(){
        this.$modal.classList.remove("dp-none");
        return this;
    }
    createContent(size, content){
        const div = document.createElement("div");
        div.className= size;
        div.append(...content);
        this.$modal.append(div);
        return div;
    }
    handleClose(){
        this._content.remove();
        this.$modal.classList.add("dp-none");
        document.body.classList.remove("overflow-hidden");
    }
}

class Nav{
    constructor(data){
        this.$nav = document.createElement("nav");
        this.$nav.className = "nav-bar";
        this.$target = document.createElement("div");
        this.$target.className = "nav";
        this.$nav.append(this.$target);
        document.body.prepend(this.$nav);
        
        this.gap = this.createGap();
        this.navBtn = this.createBtn();
        this.listGroup = document.createElement("div");
        this.list = data;
        this.clickBtn();
        this.action();
        this.$target.append(this.logo, this.gap, this.listGroup);
    }
    get logo(){
        const tagA = document.createElement("a");
        const logo = document.createElement("img");
        logo.className = "logo";
        logo.src= "src/img/asset/svg/logo-blue.svg";
        tagA.setAttribute("href", "index.html")
        tagA.append(logo)
        return tagA
    }
    get list(){
        return this._list
    }
    set list(value){
        if(!value) return document.createElement("ul");

        const ul = document.createElement("ul");
        ul.className ="nav-list";
        this.listGroup.append(this.navBtn,ul);
        value.forEach(d => 
            ul.insertAdjacentHTML("beforeend", 
            `<li class="nav-item"><a title="${d[1]}">${d[0]}</a></li>`));
        this._list = ul
    }
    createGap(){
        const gap = document.createElement("div");
        gap.classList.add("flex-row", "flex_20");
        return gap
    }
    createBtn(){
        const btn = document.createElement("button");
        btn.className = "nav-btn";
        return btn
    }
    switch(title){
        document.querySelectorAll("section")
            .forEach(d => d.classList.add("dp-none"));
        document.getElementById(title)
            .classList.remove("dp-none");
    }
    clickBtn(){
        this.navBtn.addEventListener("click", 
            e => this.navBtn.classList.toggle("active"));
    }
    action(){
        this.listGroup.addEventListener("click", e =>{
            if (e.target.tagName !== "A" 
                && e.target.tagName !== "LI") return
            e.preventDefault();
            const target = this.getTitle(e.target);
            this.switch(target);
            this.showSelect(target);
            this.navBtn.classList.toggle("active");  
        });
    }
    getTitle(target){
        if(target.tagName === "A") return target.title;
        else if(target.tagName ==="LI") return target.firstChild.title;
        else return undefined;
    }
    showSelect(title){
        [...document.getElementsByTagName("select")]
        .forEach(d => {
            if(d.name === title || d.name === "al--ways")
                d.classList.remove("dp-none");
            else d.classList.add("dp-none");
        });
        return this;
    }
    darkNavBar(){
        this.$nav.className = "nav-bar-dark";
    }
}

class SelectTag{
    constructor({data, name}){
        this._data = data;
        this._name = name;

        this.$target = document.createElement("select");
        this.$target.name = name;
        this.$target.className = "flex_8";
        this.createList();

        this.$target.addEventListener("change",
            this.handleChange.bind(this));
    }
    createList(){
        this._data.forEach(data => 
            this.$target.insertAdjacentHTML("beforeend",
            `<option value="${data}">${data}</option>`)
            );
    }
    getContent(){
        return this.$target
    }
    handleChange({target}){
    }
    setData(data){
        this._data = data;
        this._data.unshift("전체");
        this.createList();
    }
}
class Dropdown{
    static set(items){
        return new this(items);
    }
    constructor(data){
        this._data = data;
        this.$target = document.createElement("div");
        this.$target.className ="flex-align-center dropdown";

        this._ul = this.createList();
        this._title;
    }
    getContent(){
        return this.$target;
    }
    createList(){
        const ul = document.createElement("ul");
        ul.className = "dropdown-list";
        const item  = this._data.map(data =>{
            const li = document.createElement("li");
            const btn = document.createElement("button");
            btn.className = "dropdown-item";
            btn.value = data;
            btn.innerText = data;

            btn.addEventListener("mousedown",
                this.handleClick.bind(this));
            li.append(btn);
            ul.append(li);
            return { data, li}
        }); 
        return {ul, item}
    }
    setTitle(key){
        this._title.innerText = key;
    }
    handleClick(e){
        const {target} = e;
        this._title.value = target.value;
        this._title.innerText = target.value;
        this.$target.classList.remove("active");
    }
    handle(f){
        this._title.addEventListener("blur",f);
    }
    handleBlur(){
        this.$target.classList.remove("active");
    }
}
class Select extends Dropdown{
    constructor(data){
        super(data);
        this._title = this.createBtn();
        this.create();
        this._title.addEventListener("blur",
            this.handleBlur.bind(this));
    }
    create(){
        this.$target.append(this._title, this._ul.ul);
    }
    createBtn(){
        const btn = document.createElement("button");
        btn.className ="dropdown-btn";
        btn.innerText = this._data[0];

        btn.addEventListener("click", e=>{
            e.target.focus();
            this.$target.classList.toggle("active");
        });
        return btn;
    }
    setStyle(className){
        this._title.className = className;
    }
}
class Search extends Dropdown{
    constructor({data, txt}){
        super(data);
        this._txt = txt;
        this._target;
        this._title = this.createInput();
        this._clearBtn = this.createClearBtn();

        this.create();
        this._title.addEventListener("blur",
            this.handleBlur.bind(this));
    }
    create(){
        this.$target.append(
            this._title, this._ul.ul, this._clearBtn);
    }
    createInput(){
        const input = document.createElement("input");
        input.className = "input-list entitie-search";
        input.placeholder = this._txt;

        input.addEventListener("focus", e => {
            this.$target.classList.add("active");
            this._clearBtn.classList.remove("dp-none");
            if (e.target.value.length === 0)
                this.filterList(false);
        });

        input.addEventListener("keyup", e=>{
            this.toggleClearBtn(e.target.value);
            this.filterList(e.target.value);
        });
        return input;
    }
    createClearBtn(){
        const btn = document.createElement("button");
        btn.className = "btn-clear entitie-close btn-white dp-none";

        btn.addEventListener("click", e => {
            this._title.value = null;
            btn.classList.add('dp-none');
        });
        return btn
    }
    filterList(filter){
        this._ul.item.forEach(list => {
            const isVisible = filter === false? 
                1 : 
                list.data.includes(filter);
            list.li.classList.toggle("dp-none", !isVisible)
        })
    }
    toggleClearBtn(value){
        this._clearBtn.classList.toggle("dp-none",
                value.length === 0);
    }
    setTitle(key){
        this._title.value = key;
    }
}


class Contents{
    static set(data){
        return new this(data);
    }
    constructor(){
        this._visible = true;
        this._able = false;
        this._on = false;
        this._item;
        this._active;
    }
    static handleTab(c, v){
        c.forEach(_c =>{
            this.handleActive(_c,
                _c._value === v);
        });
    }
    static showActive(c){
        c._visible = c._on;
        Contents.handleVisible(c);
    }
    static handleAble(c,b){
        if(b) c._able = true;
        else c._able= false;
        c._item.classList.toggle("disable", b);
    }
    static handleActive(c,b){
        if(b) c._on = true;
        else c._on = false;
        c._item.classList.toggle(c._active, b);
    }   
    static show(c){
        c._visible = true;
        Contents.handleVisible(c);
    }
    static filter(c, key){
        c.forEach(d=>{
            this.filterContent(d, key);
            this.handleVisible(d)});
    }
    static handleVisible(c){
        c._item.classList.toggle("dp-none", 
            !c._visible);
    }
    static filterContent(c, key){
        const target = Object.keys(key);
        const r = target.reduce((t, k) =>{
            if(key[k].size === 0) return t;

            //value가 배열이 아닌경우 배열로 감싸기
            const keys = Array.isArray(c._value[k])?
                c._value[k] : [c._value[k]];
            const match = [...keys]
                .some(v => key[k].has(v));
            t.add(match);
            return t;
        },  new Set());
        if(r.has(false)) c._visible = false;
        else c._visible = true;
    }
    static getSelected(c){
        return c._on; 
    }
    static getValue(c){
        return c._value;
    }
    getActiveState(){
        return this._on;
    }
    handleSelect(){
        if(this._on) this._on = false;
        else this._on = true;

        this._item.classList.toggle(
            this._active, this._on);
    }
    getContent(){
        return this._item;
    }
    addClassName(c){
        this._item.classList.add(c);
    }
}
class Item extends Contents{
    constructor({item, value, active}){
        super();
        this._item = item;
        this._value = value;
        this._active = active; //선택됨
    }
    append(content){
        this._item.append(content)
    }
}
class Button extends Contents{
    constructor({type, active, value}){
        super();
        this._active = active; // 버튼 누른 효과;
        this._value = value;
        this._item = this.create(type);
        this._item.addEventListener("click", 
            super.handleSelect.bind(this));
    }
    create(type){
        const btn = document.createElement("button");
        btn.className = type;
        btn.innerText = this._value;
        btn.value = this._value;
        return btn;
    }
    setInnerText(txt){
        this._item.innerText = txt;
    }
}
class Img extends Contents{
    constructor({img, value}){
        super();
        this._img = img;
        this._value = value;
        this._item = this.createItem();
    }
    createItem(){
        const div = document.createElement("div");
        div.className ="column-img-item";
        div.append(this.createImg(), 
            this.createDesc());

        div.addEventListener("click", 
            this.handleModal.bind(this));
        return div;
    }
    createImg(){
        const img = document.createElement("img");
        img.className = "img"
        img.setAttribute("src", this._img.thum);
        return img;
    }
    createDesc(){
        const desc = document.createElement("div");
        desc.className = "img-desc column-line";

        if(!this._img.desc) return
        this._img.desc.forEach(d =>
            desc.insertAdjacentHTML("beforeend",
            `<span>${d}</span>`));
        return desc;
    }
    handleModal(){
        const div = document.createElement("div");
        const desc = this.createDesc();
        desc.className ="flex-row flex-end column-line color-white padding-block_05";
        
        const img = document.createElement("img");
        img.setAttribute("src", this._img.path);
        img.className = (this._img.ratio > 1)? "img-wide" : "img-narrow";

        div.append(desc, img)
        if(this._img.ratio > 1)
            new Modal("modal-img-wide", desc, img).show();
        else
            new Modal("modal-img-narrow", desc,img).show();
    }
}
class Card extends Contents{
    static count = 0;
    static getID(_c){
        return _c._id;
    }
    static checkCard(c,v){
        c.forEach(_c =>{
            const is = v.has(_c._id);
            super.handleActive(_c, is);
        })
    }
    constructor(data){
        super();
        this._id = this.setID();
        this._data = data;
        this._active = "card-item_select";
        this._item = document.createElement("div");
        this._item.addEventListener("click",
            this.selectable.bind(this));
    }
    setID(){
        Card.count ++;
        return Card.count;
    }
    selectable({target}){
        const {tagName} = target;
        if(tagName === "BUTTON") return;
        super.handleSelect();
    }
}



class Input{
    constructor({type, value, className}){
        this._item = document.createElement("input");
        this._item.type = type;
        this._item.value = value;
        this._item.className = className;
    }
    getContent(){
        return this._item;
    }
    handleChange(f){
        this._item.addEventListener("change",f);
    }
    setMinMax(min, max){
        this._item.min = min;
        this._item.max = max;
    }
}

