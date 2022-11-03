class ModelRelease extends FilterModel{
    constructor(school){
        super();
        this._data = school;
        this._filterKey ={
            area : "과천",
            year: 2022,
        }
    }
    getList(){
        return DOM.set(this._data, "area");
    }
    getData(){
        const {area} = this._filterKey;
        return this._data.filter(a=>a.area === area);
    }
    update(key){
        super.setFilterKey(key);

        this.notify("update");
    }
    getSequence(){
        return this.getData()
            .sort((a,b)=> a.sequence - b.sequence)
            .map(s => s.name);
    }
} 

class CtrlReleaseArea extends View{
    constructor(model){
        super(model);
        this.$target.className ="flex-row flex-gap_0";
        this.$target.addEventListener("click",
            this.handleClick.bind(this));
        this.selectOne(); 
    }
    create(){
        return this._model.getList().map(t =>{
            const tab = new Button({
                type: "tab",
                active : "tab-select",
                value : t
            })
            this.$target.append(tab.getContent());
            return tab;
        });
    }
    selectOne(){
        this._content[0].handleSelect();
    }
    handleClick({target}){
        const {value} = target;
        Contents.handleTab(
            this._content, value);
        this._model.update({area : value});
    }
}
class ReleaseDetail{
    static set(data){
        return new ReleaseDetail(data);
    }
    constructor(detail){
        this.$target = document.createElement("div");
        this.$target.className= "flex-row padding-block-start_10";
        this._detail = detail;
        this._noteNum = 180;
        this._path = './src/img/web/note_release/';
        this._thum = './src/img/thum/note_release/';
        this._year = 2022;
        this._numOf = 200;
        this._box;
    }
    getContent(){
        this.create();
        return this.$target;
    }
    getNumOfBox(){
        return this._box;
    }
    create(){
        const div = document.createElement("div");
        div.className ="flex_20 flex-column";
        div.append(this.setTitle(),
            this.setDetail())
        this.$target.append(
            div,
            this.setImg());
    }
    setImg(){
        const {prefix, name, img} = this._detail;
        const div = document.createElement("div");
        div.className ="flex_40 column-img";

        img.map(_img =>{
                const path = this._path + prefix +_img;
                const thum = this._thum + prefix +_img;
                const ratio = 1.4;
                const desc = [name];

                return new Img({
                    img : {path, thum, ratio, desc}
                });
            })
            .forEach(img=> 
                div.append(img.getContent()));
        return div;
    }
    setTitle(){
        const {name, time} = this._detail;

        const div = document.createElement("div");
        div.className = "flex-row";
        const content = `
        <div class="font_20 text--left">${name}</div>
        <div class="font_14 btn-box">${time}</div>`;
        div.insertAdjacentHTML("beforeend", content);

        return div;
    }
    setDetail(){
        const {front, back} = this.calcNumOfBox();

        const div = document.createElement("div");
        div.className= "flex-row";
        let content = `<div class="btn-round btn-select-pink"> 정문 : ${front}박스</div>`;

        if(back > 0) 
            content +=
            `<div class="btn-round btn-select-turquoise"> 후문 : ${back}박스</div>`;

        div.insertAdjacentHTML("beforeend", content);
        return div;
    }
    calcNumOfBox(){
        const {numOfBox} = this._detail;
        const box = this._detail[this._year] / this._numOf;
        const front = Math.ceil(box *(numOfBox.front /100));
        const back = Math.ceil(box *(numOfBox.back/100));
        this._box = front + back;
        return {front,back}
    }

}

class ViewRelease extends View{
    constructor(model){
        super(model);
        super.subscribe("update", super.render);
        this.$target.className='row-underline padding-block_10';
    }
    create(){
        this.setSequence();
        const data = this._model.getData()
            .map(ReleaseDetail.set);
        data.forEach(d => 
                this.$target.append(d.getContent()));
        this.setNumOfBox(data);
        return data;
    }
    setSequence(){
        const sequence = this._model.getSequence()
            .join(" > ");
        const div=document.createElement("div");
        div.className = "btn-rectangle btn-select-black";
        div.innerText = sequence;
        this.$target.append(div);
    }
    setNumOfBox(data){
        const num = data
            .map(c => c.getNumOfBox())
            .reduce((t,n)=> t+=n);
        const div=document.createElement("div");
        div.className = "btn-rectangle btn-select-black";
        div.innerText = "총 상자 수 : " + num;
        this.$target.prepend(div);
    }
}
main();
function main(){
    new Nav();

    noteRelease(work_distribution,
        document.querySelector("#note--release"))
}

function noteRelease(school, section){
    const model = new ModelRelease(school);
    const items = [{
        id: "#con--tents",
        item : new ViewRelease(model)
    },{
        id: "#ctrl--area",
        item : new CtrlReleaseArea(model)
    }];

    DOM.appendContent(items, section);
}
