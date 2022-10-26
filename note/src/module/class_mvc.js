
class Observer { // 모델이 상속
    constructor(){
        this._observer = {};
    }
    // 옵저버 객체속에 이벤트 종류별로 Set을 생성하고
    // Set에 함수 저장
    // observer = { 이벤트타입 : 함수 }
    subscribe(...observer){
        observer.map(observer => Object.entries(observer))
            .flat()
            .forEach(([type, observer]) => 
            {
                if(!this._observer[type])
                    this._observer[type] = new Set();
                this._observer[type].add(observer);
            });
    }
    // 이벤트 종류에 옵저버 객체 속에 저장된 함수 실행
    notify(...type){
        type.forEach(_type => 
            this._observer[_type]
                .forEach(observer => observer()
            )
        );
    }
}
class FilterModel extends Observer{
    constructor(){
        super();
        this._filterKey;
        this._state;
        this._content;
    }
    setFilterKey(keys){
        Object.keys(keys).forEach(key => 
            this._filterKey[key] = keys[key]);
    }
    setState(obj){
        Object.keys(obj).forEach(key => 
            this._state[key] = obj[key]);
    }
    getState(){
        return this._state;
    }
    getFilterKey(){
        return this._filterKey;
    }
    filter(){
        const keys = this._filterKey;
        const _keys = Object.keys(keys);
        return _keys.reduce((t, k) =>{
            if(keys[k].size === 0) return t;

            const filterd = t.filter(data => 
                this.match(keys[k], data[k]))
            t = filterd;
            return t;
        }, this._content);
    }
    match(k1, k2){
        //비교값(k2)이 배열이 아닌경우 배열로 감싸기
        const key2 = Array.isArray(k2)? k2 : [k2];
        return [...key2].some(_k => k1.has(_k)); 
    }
    isNoKeys(){
        const _keys = Object.keys(this._filterKey);
        return _keys.every(k => 
            this._filterKey[k].size === 0);
    }
    dropdownSelect(){}
    
}
class View{
    constructor(model){
        this._model = model;
        this.$target = document.createElement("div");
        this._content;
        this.render();
    }
    assign(...f){
        f.forEach(_f => 
            this.subscribe(_f.name , _f));
    }
    subscribe(action, f){
        this._model.subscribe({
            [action] : f.bind(this)})
    }
    getContent(){
        return this.$target;
    }
    render(){
        this.reset();
        this._content = this.create();
    }
    update(){
        this.reset();
        this._content.forEach(c =>
            this.$target.append(c.getContent()));
    }
    reset(){
        DOM.removeChild(this.$target);
    }
    append(item){
        item.forEach(_i => 
            this.$target.append(
                _i.getContent()));
    }
    create(){}
}

class CtrlDropdown extends View{
    constructor(model, name, type){
        super(model);
        this._type = type;
        this._name = name;
        super.render();
    }
    create(){
        if(!this._name || !this._type) return;

        const items = this._model.getList()[this._name]
        const dropdown = this._type.set(items);

        this.$target.append(dropdown.getContent());
        dropdown.handle(this.handleClick.bind(this));
        
        return dropdown;
    }
    handleClick({target}){
        if(target.value !== "")
            this._model.dropdownSelect(
                {[this._name]:target.value});
    }
}


class CtrlBtn extends View{
    constructor(model){
        super(model);
        this.$target.className ="flex-row";
        this._type;
        this._active;
    }
    create(){
        const data = this.setData();
        if(!data || !this._type) return;
        return this.btns(data);
    }
    btns(data){
        return data.map(_d =>{
            const btn =  new Button({
                type: this._type, 
                active : this._active, 
                value : _d});

            this.$target.append(
                btn.getContent());
            return btn;
        });
    }
    selectOne(value){
        Contents.handleTab(this._content, value);
    }
    handle(){
        this.$target.addEventListener("click", e =>{
            const {tagName, value} = e.target;
            if(tagName !== "BUTTON") return;

            if(this._selectOne)
                this.selectOne(value);
            this.action(value);
        });
    }
    action(value){}
    setData(){}
}