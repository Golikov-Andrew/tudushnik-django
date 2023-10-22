class Task {
    constructor(task_obj, tasks_container_elem) {
        this.task_obj = task_obj
        this.tasks_container_elem = tasks_container_elem
        this.elem = document.createElement('div')
        this.elem.classList.add('task_elem')
        let anchor_elem = document.createElement('div')
        anchor_elem.innerHTML = '&#8226;'
        anchor_elem.classList.add('task_tool')
        anchor_elem.classList.add('to_move_x')
        anchor_elem.addEventListener('mousedown', (evt) => {
            console.log('down')
            this.create_task_avatar()
            window.addEventListener('mouseup', this.dropTask.bind(this))
            window.addEventListener('mousemove', this.moveTask.bind(this))
        })


        let title_elem = document.createElement('div')
        title_elem.innerText = this.task_obj.title
        title_elem.style.display = 'inline-block'
        let desk_elem = document.createElement('div')
        let begin_at_elem = document.createElement('div')
        desk_elem.innerText = this.task_obj.content
        begin_at_elem.innerText = moment(this.task_obj.begin_at).format('Y-MM-DD HH:mm')
        desk_elem.classList.add('task_content')
        begin_at_elem.classList.add('task_begin_at')
        begin_at_elem.style.display = 'inline-block'
        desk_elem.style.display = 'inline-block'
        this.elem.append(anchor_elem)
        this.elem.append(title_elem)
        this.elem.append(begin_at_elem)
        this.elem.append(desk_elem)
        this.elem.height = 20
        this.elem.style.width = `${this.task_obj.width}px`
        this.elem.style.left = `${this.task_obj.diagram_offset_x}px`
        this.current_task_avatar = undefined
    }

    create_task_avatar() {
        this.current_task_avatar = this.elem.cloneNode(true)
        this.tasks_container_elem.append(this.current_task_avatar)
    }

    dropTask(evt) {
        console.log('up')
        this.tasks_container_elem.removeChild(this.current_task_avatar)
        this.current_task_avatar = undefined
        window.removeEventListener('mouseup', this.dropTask)
        window.removeEventListener('mousemove', this.moveTask)
    }

    moveTask(evt) {
        console.log(evt)
        console.log(this)
        this.current_task_avatar.style.top = `${evt.layerY}px`
        this.current_task_avatar.style.left = `${evt.layerX}px`
    }
}

export {
    Task
}