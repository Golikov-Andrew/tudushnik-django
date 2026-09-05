import {MindMapViewport} from "./viewport";

const mindmap_viewport_object = new MindMapViewport('#mindmap_viewport');

const jsonDataElement = document.getElementById('my-json-data');
const data = JSON.parse(jsonDataElement.textContent);
mindmap_viewport_object.init(
    data['tasks_mindmaps'],
    data['tasks_parent_child'],
    data['tags'],
    data['statuses']
);
window.MINDMAP_PROJECT_ID = data.project_id;

window.mindmap_viewport_object = mindmap_viewport_object
