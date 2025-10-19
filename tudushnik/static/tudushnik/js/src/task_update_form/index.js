import {Form} from "../my_utils/form";
import {SelectMultipleWidget} from "../../select_multiple_widget";
import {DurationWidget} from "../../duration_annotation";

const form = new Form('form.form')

const durationWidget = new DurationWidget('#id_duration')
durationWidget.init()

const id_begin_at = document.querySelector('#id_begin_at')
const begin_at_delta = document.querySelector('input[name="begin_at_delta"]')
let old_begin_at_value;
if (id_begin_at !== null && begin_at_delta !== null) {
    old_begin_at_value = id_begin_at.value;
    id_begin_at.addEventListener('change', () => {
        begin_at_delta.value = moment.duration(moment(id_begin_at.value).diff(old_begin_at_value)).asSeconds()
    })
}

// const select_multiple_widget_tags = new SelectMultipleWidget('#id_tags')
// select_multiple_widget_tags.init()

if(window.innerWidth >= 768){
    form.expand_fieldset('input[name="begin_at"]')
    form.expand_fieldset('textarea[name="content"]')
}