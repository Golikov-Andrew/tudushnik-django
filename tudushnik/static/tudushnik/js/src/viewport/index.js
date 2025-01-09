require("moment")
require("moment-duration-format");
import {Viewport, ViewportDateTimeLine} from "./viewport";

let viewport_dtl;
window.addEventListener('load',()=>{
    viewport_dtl = new ViewportDateTimeLine()
    Viewport.init(viewport_dtl);
    window.viewport_dtl = viewport_dtl;
})