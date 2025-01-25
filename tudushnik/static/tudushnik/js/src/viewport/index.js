require("moment")
require("moment-duration-format");
import {Viewport, ViewportDateTimeLine} from "./viewport";

const form_chart_datetimes = document.getElementById('form_chart_datetimes')
const gantt_apply_filters = document.getElementById('gantt_apply_filters')
// form_chart_datetimes.addEventListener('click',(evt)=>{
//     evt.preventDefault();
// })
let gantt_apply_filters_object = undefined;
if(gantt_apply_filters){
    gantt_apply_filters_object = JSON.parse(gantt_apply_filters.innerText.trim())
    console.log('gantt_apply_filters_object', gantt_apply_filters_object)
}



let viewport_dtl;
window.addEventListener('load',()=>{
    viewport_dtl = new ViewportDateTimeLine()
    Viewport.init(viewport_dtl, gantt_apply_filters_object);
    window.viewport_dtl = viewport_dtl;
})

export {
    gantt_apply_filters_object
}