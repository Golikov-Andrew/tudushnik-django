import {DOMElem} from "../../dom_utils";

class CurrentAbstract {
    constructor(view_type, label_text, value) {
        this.view_type = view_type
        this.value = value
        this.label_element = new DOMElem('div', {
                classes: ['label'], html: label_text
            }
        ).element
        this.value_element = new DOMElem('div', {
            classes: ['value'], html: this.value
        }).element
        this.element = new DOMElem('div', {
            classes: ['view_type'], children: [
                this.label_element, this.value_element
            ]
        }).element
    }
}

class CurrentYear extends CurrentAbstract {
    constructor(val) {
        super('year', 'Год', val);
    }
}

class CurrentMonth extends CurrentAbstract {
    constructor(val) {
        super('month', 'Месяц', val);
    }
}

class CurrentWeek extends CurrentAbstract {
    constructor(val) {
        super('week', 'Неделя', val);
    }
}

class CurrentDay extends CurrentAbstract {
    constructor(val) {
        super('day', 'Дата', val);
    }
}


class CurrentDate {
    constructor(moment_now) {
        this.views = {
            year: new CurrentYear(moment_now.format('YYYY')),
            month: new CurrentMonth(moment_now.format('MM')),
            week: new CurrentWeek(moment_now.format('WW')),
            day: new CurrentDay(moment_now.format('DD')),
        }
        this.element = new DOMElem('div', {
            classes: ['current_date'], children: [
                new DOMElem('div', {classes: ['calendar_fieldset_legend'], html:'Сегодня:'}),
                this.views.year.element,
                this.views.month.element,
                this.views.week.element,
                this.views.day.element,
            ]
        }).element
    }
    get(view){
        return this.views[view].value
    }
}

export {
    CurrentDate
}