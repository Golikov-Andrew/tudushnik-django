import {Form} from "../my_utils/form";
import {DurationWidget} from "../../duration_annotation";

new Form('form.form')

const durationWidget = new DurationWidget(
    '#id_duration', {disabled: true}
)
durationWidget.init()