function createRulerItem(prop_for_size, size, text) {
    const new_elem = document.createElement('div');
    new_elem.style[prop_for_size] = `${size}px`;
    new_elem.style.outline = '1px solid #888888';
    new_elem.innerHTML = text;
    new_elem.classList.add('item')
    return new_elem
}

class Ruler {
    _canvas;
    _element;

    constructor(canvas) {
        this._canvas = canvas;
        this._element = document.createElement('div');
        this._element.style.position = 'absolute';
        this._element.style.display = 'flex';
        this._element.style.zIndex = '999999';
        this._element.style.backgroundColor = '#aaaaaa';
        this._element.style.top = '-50px';
        this._element.style.left = '-50px';
        this._element.classList.add('ruler');
    }

    redraw(prop_for_size, min_val, max_val) {
        this._element.innerHTML = '';
        const offset = (0 - min_val) % 50;
        if (offset > 0){
            this._element.appendChild(createRulerItem(prop_for_size, offset, min_val));
        }
        for (let i = min_val + offset; i < max_val - 50; i += (50 / this.scale)) {
            this._element.appendChild(createRulerItem(prop_for_size, 50, i));
        }
    }

    get scale(){
        return this._canvas.scale
    }
}

class HorizontalRuler extends Ruler {
    constructor(canvas) {
        super(canvas);
        this._element.style.width = 'calc(100% + 100px)';
        this._element.style.height = '20px';
        this._canvas.element.appendChild(this._element);
    }
}

class VerticalRuler extends Ruler {
    constructor(canvas) {
        super(canvas);
        this._element.style.width = '20px';
        this._element.style.height = 'calc(100% + 100px)';
        this._canvas.element.appendChild(this._element);
        this._element.style.flexDirection = 'column';
    }
}

export {
    HorizontalRuler, VerticalRuler
}