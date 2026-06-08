import {MindMapViewport} from "./viewport";

const mindmap_viewport = new MindMapViewport('#mindmap_viewport');

const jsonDataElement = document.getElementById('my-json-data');
const data = JSON.parse(jsonDataElement.textContent);
mindmap_viewport.init(data['tasks_mindmaps']);
