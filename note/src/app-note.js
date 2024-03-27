(() => {
    const { ACTION, VIEW } = INIT();

    const content = new Map([
        ["배포", viewNote],
        // ["알바", viewWorker],
    ]);
    DOM.set(content);
    UI.nav.run(content);

  
    function viewNote (id){
        const data = DATA(calc)(oneart_note);
        const pics = viewList();
        const {change, item} = DATA_REDUCER(data);
        
        DOM.section(id, 'width-max_40')( 
            UI.optionBar()(
                UI.ctrls(ACTION(change)).tab(data.getKeys())
            ),
            VIEW(item, pics).render().set()
        );
        ACTION(change)(data.getKeys()[0]);


        function calc (school) {
            const {numOfStdnt, ratio} = school;
            const numOfNote = 160;
            const sendR = 70 / 100
            const stdnt = numOfStdnt[DT.year]|| numOfStdnt[DT.year-1];

            const _calcBox = (type) => Math.ceil((stdnt/numOfNote)*sendR*(ratio[type]/100));

            return {...school, stdnt, front: _calcBox('front'), back:_calcBox('back'),}
        }

        
        function viewList (){
            const _img = _=>`<img class="flex_02 img-thum" style="width:30%;"src="./src/img/web/note/${_}">`;

            const css = 'row-line row-padding_05';

            const _set = ({name, pics, time, worker, stdnt, front, back}) =>`
            <div>
                <div class="font_08 flex-align-center flex-btwn padding_05">
                    <div class="flex-align-center">                    
                        <div class="font_15 font_H">${name}</div>
                        <div class="btn-box">${time}</div>
                        <div class="btn-rectangle bg-indigo">${worker} 명</div>
                    </div>
                    <div class="flex-row">
                        <span class="btn-round bg-sky_20">정문 : ${front}</span>
                        <span class="btn-round bg-yellow_90">후문 : ${back}</span>
                        <span class="btn-round btn-black">${stdnt} 명</span>
                    </div>
                </div>
                <div class="flex-row flex-items_stratch">
                    ${DOM.map(_img)(pics)}
                </div>
            </div>
            `
            return {_set, css};
        }
    }

    function viewWorker (){

    }

})();
