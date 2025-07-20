class Projects {
    constructor(calendar) {
        this.calendar = calendar
        this.projects = {}
        this.calendar.projects = this.projects
    }
    fetch() {
        return send_json_promise(undefined, 'GET', '/calendar/projects/list', {},  csrfToken)
    }
}

class Tasks {
    constructor(calendar) {
        this.calendar = calendar
        this.tasks = {}
        this.calendar.tasks = this.tasks
    }

    fetch() {
        return send_json_promise(undefined, 'GET', '/calendar/tasks/list', {}, csrfToken)
    }
}

export {
    Tasks, Projects
}