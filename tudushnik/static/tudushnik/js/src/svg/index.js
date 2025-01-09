function createSVGElem(tag_name) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag_name)
}

function modifySVGElemArrowMiddle(source_svg_elem, delta_width, height) {
    let abs_width = Math.abs(delta_width);
    let x1, y1, x2, y2;
    let ym = height/2;
    let xm = abs_width/2;
    source_svg_elem.setAttribute('viewBox', `0 0 ${abs_width} ${height}`)
    if(delta_width >= 0){
        x1 = 0;
        y1 = height;
        x2 = abs_width;
        y2 = 0;
    }else{
        x1 = abs_width;
        y1 = height;
        x2 = 0;
        y2 = 0;
    }
    source_svg_elem.innerHTML =
        `
<defs>
    <marker
      id="arrow"
      viewBox="0 0 10 10"
      refX="5"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      orient="auto-start-reverse">
      <path d="M 0 0 10 5 0 10" />
    </marker>
 </defs>
 <path
    d="M ${x1} ${y1} ${xm} ${ym} ${x2} ${y2}"
    stroke="black"
    fill="none"
    marker-mid="url(#arrow)"
/>
`;
}

export {
    createSVGElem, modifySVGElemArrowMiddle
}