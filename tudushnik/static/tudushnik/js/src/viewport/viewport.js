class Viewport {

    static init(viewport_dtl) {
        let viewport_type_select = document.getElementById('viewport_type_select')
        viewport_type_select.addEventListener('change', () => {
            let new_val = viewport_type_select.value
            if (new_val === 'datetimeline') {
                document.querySelector('.pagination').classList.add('hidden')
                document.querySelector('.tasks_table').classList.add('hidden')
                document.querySelector('.viewport_datetimeline').classList.remove('hidden')
                viewport_dtl.fetch_tasks();
            } else {
                document.querySelector('.pagination').classList.remove('hidden')
                document.querySelector('.tasks_table').classList.remove('hidden')
                document.querySelector('.viewport_datetimeline').classList.add('hidden')
            }
        })
    }

    constructor() {
    }
}

class ViewportDateTimeLine{
    constructor() {
        this.viewport_datetimeline = document.getElementById('viewport_type_select')
        this.scale_y = 1
        this.scale_x = 1
        this.tasks = {}
    }
    fetch_tasks(){
        let now = moment()
        let day_forward = now + 1000 * 60 * 60 * 24
        let day_backward = now - 1000 * 60 * 60 * 24
        console.log(moment(day_backward).format())
        console.log(now.format())
        console.log(moment(day_forward).format())

        $.ajax({
                    type: "POST",
                    headers: {
                        'X-CSRFToken': csrfToken
                    },
                    url: '/tasks/fetch',
                    data: {
                        'date_from': moment(day_backward).format(),
                        'date_to': moment(day_forward).format(),
                    },
                    success: (data)=>{
                        console.log(data)
                    },
                    dataType: 'json'
                });
    }
    draw(){

    }
}

export {
    Viewport,
    ViewportDateTimeLine
}