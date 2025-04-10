import {Calendar} from './calendar'
import {Projects, Tasks} from "./tasks";

const calendar = new Calendar(document.querySelector('.calendar'))
calendar.init()

const projects = new Projects(calendar)
const tasks = new Tasks(calendar)

projects.fetch().then(
    (response) => {
        let json_obj = JSON.parse(response)
        for (let i = 0; i < json_obj.results.length; i++) {
            projects.projects[json_obj.results[i].id] = json_obj.results[i]
        }

        tasks.fetch().then(
            (response) => {
                let json_obj = JSON.parse(response)
                for (let i = 0; i < json_obj.results.length; i++) {
                    tasks.tasks[json_obj.results[i].id] = json_obj.results[i]
                }
                calendar.add_projects(projects)
                calendar.add_tasks(tasks)
            }
        )
    }
).catch((err) => {
    console.log(err)
})


window.mycalendar = calendar