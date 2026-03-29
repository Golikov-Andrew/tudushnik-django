import {ModalWindow} from "../my_utils/modal_window";

class ActivityDisplay {
    #root_element;
    #buttons;
    #profile_settings_id;
    #ctx;
    #width;
    #height;

    constructor(root_element_selector) {
        this.#root_element = document.querySelector(root_element_selector)
        this.#profile_settings_id = +this.#root_element.querySelector(`.user_settings_id`).value;
        this.#buttons = {
            get_by_day: this.#root_element.querySelector('.btn_get_by_day'),
            get_by_week: this.#root_element.querySelector('.btn_get_by_week'),
            get_by_month: this.#root_element.querySelector('.btn_get_by_month'),
        }
        const canv = this.#root_element.querySelector('canvas')
        this.#ctx = canv.getContext('2d');
        this.#width = 380;
        this.#height = 200;
        for (const k in this.#buttons) {
            let cur_btn = this.#buttons[k];
            let count_of_days = cur_btn.getAttribute('data-days-count')
            cur_btn.addEventListener('click', (evt) => {
                send_post_json(evt, '/user/activity/', {
                    'days': count_of_days,
                    'user_settings_id': this.#profile_settings_id
                }, (resp) => {
                    const json_obj = JSON.parse(resp)
                    this.clear_canvas()
                    this.draw_points(json_obj.events, count_of_days)
                    // item_delete_handle_response(resp, redirect_url)
                }, csrfToken)

            })
        }

    }

    clear_canvas() {
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
    }

    draw_points(events, count_of_days) {
        let min_points = 999999999999;
        let min_dt = moment().subtract(count_of_days, 'day').unix();
        let max_points = 0;
        let max_dt = moment().unix();
        for (let i = 0, cur_event, upae, dt; i < events.length; i++) {
            cur_event = events[i]
            upae = cur_event.user_points_after_event
            dt = moment(cur_event.happened_at).unix()
            if (upae < min_points) {
                min_points = upae
            }
            if (upae > max_points) {
                max_points = upae
            }
        }
        let delta_points = max_points - min_points
        let delta_points_dt = max_dt - min_dt
        // let pixel_per_points = 200 / delta_points
        let points_per_pixel = delta_points / 200
        let seconds_per_pixel_dt = delta_points_dt / 380
        console.log('delta_points', delta_points)

        let start_point = null;

        for (let i = 0, cur_event, upae, dt, x, y; i < events.length; i++) {
            cur_event = events[i]
            upae = cur_event.user_points_after_event
            dt = moment(cur_event.happened_at).unix()
            // this.draw_point(0, pixel_per_points * (max_points - (upae - min_points)));
            x = (dt - min_dt) / seconds_per_pixel_dt;
            y = 200 - ((upae - min_points) / points_per_pixel);
            if (start_point !== null) {

                this.line_to(start_point.x, start_point.y, x, y);

            }
            this.draw_point(x, y);
            start_point = {x, y}
        }

    }

    draw_point(x, y) {
        // debugger;
        // this.#ctx.save();
        this.#ctx.beginPath();
        this.#ctx.arc(x, y, 2, 0, 2 * Math.PI);
        this.#ctx.fillStyle = '#008855';
        this.#ctx.fill();
        // this.#ctx.restore();

    }

    line_to(bx, by, x, y) {
        this.#ctx.beginPath();
        this.#ctx.moveTo(bx, by);
        this.#ctx.lineTo(x, y);
        this.#ctx.strokeStyle = 'blue';
        this.#ctx.lineWidth = 2;
        this.#ctx.stroke();
    }
}

const activity_display = new ActivityDisplay('#activity_display_root')

const btns_wiki_modal_open = document.querySelectorAll('.btn_wiki_modal_open')
const wiki_modals = {}
btns_wiki_modal_open.forEach((b) => {
    let modal_id = b.getAttribute('data-modal-id')
    wiki_modals[modal_id] = new ModalWindow({
        unique_id: `modal_${modal_id}`
    })
    wiki_modals[modal_id].set_content_element(document.querySelector(`#${modal_id}`))
    wiki_modals[modal_id].init()

    b.addEventListener('click', (evt) => {
        wiki_modals[modal_id].show()
    })
})
