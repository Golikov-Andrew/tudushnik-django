import 'jquery';

class Task {

    static tasks = {}

    static init() {
        let task_item_rows = document.getElementsByClassName('task-item-row');
        for (let i = 0, cur_row, cur_id, cur_done; i < task_item_rows.length; i++) {
            cur_row = task_item_rows[i];
            cur_id = cur_row.querySelector('.task-item-id').getAttribute('data-task-id');
            cur_done = cur_row.querySelector('.task-item-done');
            cur_done.addEventListener('change', () => {
                $.ajax({
                    type: "POST",
                    headers: {
                        'X-CSRFToken': csrfToken
                    },
                    url: '/tasks/update_attrs',
                    data: JSON.stringify({
                        'task_id': cur_id,
                        'is_done': cur_done.checked,
                    }),
                    success: (data) => {
                        // console.log(data)
                        if (data.success === true) {
                            cur_done.checked = data.is_done;
                        } else {
                            alert(data.error_message);
                            cur_done.checked = !data.is_done;
                        }
                    },
                    dataType: 'json'
                });
            })
            cur_done.removeAttribute('disabled');
        }
    }

    constructor(obj) {
        this.obj = obj
    }
}

export {
    Task
}