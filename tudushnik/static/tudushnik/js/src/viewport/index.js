import {Viewport, ViewportDateTimeLine} from "./viewport";

window.addEventListener('load',()=>{
    const viewport_dtl = new ViewportDateTimeLine()
    Viewport.init(viewport_dtl);
})