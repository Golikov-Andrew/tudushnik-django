import {Card} from "./card";
import {HorizontalRuler, VerticalRuler} from "./ruler";
import {ContextMenu, ContextMenuAction} from "../my_utils/context_menu";
import {CardsRelation} from "./cards_relation";

class Origin {
    #element;
    #relations_container;
    #cards_container;
    #left_offset;
    #top_offset;
    #canvas;

    constructor(canvas) {
        this.#canvas = canvas;
        this.#element = document.createElement('div');
        this.#element.classList.add('origin');
        this.#element.style.position = 'absolute';
        this.set_offsets(500, 500);
        this.#element.style.width = '1px';
        this.#element.style.height = '1px';
        this.#element.style.outline = '1px solid black';

        this.#relations_container = document.createElement('div');
        this.#relations_container.classList.add('relations_container');
        this.#relations_container.style.position = 'relative';

        this.#cards_container = document.createElement('div');
        this.#cards_container.classList.add('cards_container');
        this.#cards_container.style.position = 'relative';

        this.#element.appendChild(this.#relations_container);
        this.#element.appendChild(this.#cards_container);
    }


    get left_offset() {
        return this.#left_offset;
    }

    get top_offset() {
        return this.#top_offset;
    }

    get cards_container() {
        return this.#cards_container;
    }

    get relations_container() {
        return this.#relations_container;
    }

    get element() {
        return this.#element;
    }

    set_offsets(left, top) {
        this.#left_offset = left;
        this.#top_offset = top;
        this.#element.style.left = `${this.#left_offset * this.#canvas.scale + (50 * this.#canvas.scale - 50)}px`;
        this.#element.style.top = `${this.#top_offset * this.#canvas.scale + (50 * this.#canvas.scale - 50)}px`;
    }
}

class Canvas {
    #app;
    #element;
    #origin;
    #cards;
    #cards_relations;
    #task_id_card_id__dict;
    #width;
    #height;
    #margin;
    #rulers;
    #parent_task_for_binding_chosen;
    #tags;
    #statuses;

    constructor(app) {
        this.#app = app;
        this.#element = document.createElement('div');
        this.#element.classList.add('canvas');
        this.#element.style.position = 'relative';
        this.#width = 1000;
        this.#height = 1000;
        this.#element.style.width = `${this.#width * this.scale}px`;
        this.#element.style.height = `${this.#height * this.scale}px`;

        this.#element.style.backgroundColor = '#CCCCCC';
        this.#margin = 50;
        this.#element.style.marginRight = `${this.#margin * this.scale}px`;
        this.#element.style.marginBottom = `${this.#margin * this.scale}px`;
        this.#element.style.marginTop = `${this.#margin * this.scale}px`;
        this.#element.style.marginLeft = `${this.#margin * this.scale}px`;
        this.#parent_task_for_binding_chosen = null;

        this.#rulers = {
            'h': new HorizontalRuler(this),
            'v': new VerticalRuler(this),
        }

        this.#cards = {};
        this.#cards_relations = {};
        this.#task_id_card_id__dict = {};

        this.#origin = new Origin(this);
        this.#element.appendChild(this.#origin.element);

        this.#element.addEventListener('contextmenu', (evt) => {
            evt.preventDefault()

            const tag_closest = evt.target.closest('.card .tag');
            if (tag_closest) {
                const current_card_elem = tag_closest.closest('.card');
                const task_mindmap_id = current_card_elem.dataset.taskMindMapId;
                const current_card = this.#cards[task_mindmap_id]
                const current_task_id = current_card_elem.dataset.taskId;
                const current_tag_id = tag_closest.dataset.tagId;
                const context_menu = new ContextMenu({
                    event: evt,
                    data: {
                        task_id: +current_task_id,
                        tag_id: +current_tag_id
                    }
                })
                context_menu.add_action(
                    new ContextMenuAction('Удалить тег', () => {
                        send_json(evt, 'DELETE', `/task/tag/`, {
                            task_id: +current_task_id,
                            tag_id: +current_tag_id
                        }, (resp) => {
                            let json_obj = JSON.parse(resp)
                            if ('success' in json_obj) {
                                if (json_obj['success'] === true) {
                                    const tags = current_card.data.task.tags
                                    for (let i = 0; i < tags.length; i++) {
                                        if (tags[i].pk === +current_tag_id) {
                                            tags.splice(i, 1)
                                            break;
                                        }
                                    }
                                    tag_closest.parentElement.removeChild(tag_closest)
                                    context_menu.destroy()
                                }
                            }
                        }, csrfToken)
                    })
                )

                console.log(context_menu);
                context_menu.create();
                return
            }

            const create_add_tag_button = evt.target.closest('.create_add_tag_button');
            if (create_add_tag_button) {
                const current_card_elem = create_add_tag_button.closest('.card');
                const task_mindmap_id = current_card_elem.dataset.taskMindMapId;
                const current_card = this.#cards[task_mindmap_id]
                const current_task_id = current_card_elem.dataset.taskId;
                const context_menu = new ContextMenu({
                    event: evt,
                    data: {
                        task_id: +current_task_id,
                    }
                })

                for (let i = 0, cur_t; i < this.#tags.length; i++) {
                    cur_t = this.#tags[i]
                    let is_tag_already_exists = false;
                    for (let j = 0; j < current_card.data.task.tags.length; j++) {
                        if (cur_t.pk === current_card.data.task.tags[j].pk) {
                            is_tag_already_exists = true;
                            break;
                        }
                    }
                    if (is_tag_already_exists) continue;

                    context_menu.add_action(
                        new ContextMenuAction(cur_t.title, () => {
                            console.log(`${cur_t.title} выбран`);

                            send_json(evt, 'POST', `/task/tag/`, {
                                task_id: +current_task_id,
                                tag_id: +cur_t.pk
                            }, (resp) => {
                                let json_obj = JSON.parse(resp)
                                if ('success' in json_obj) {
                                    if (json_obj['success'] === true) {
                                        const new_tag = structuredClone(cur_t)
                                        current_card.data.task.tags.push(new_tag);
                                        current_card.add_tag(new_tag)
                                        context_menu.destroy()
                                    }
                                }
                            }, csrfToken)
                        })
                    )
                }


                console.log(context_menu);
                context_menu.create();
                return
            }

            const status_element = evt.target.closest('.card .status');
            if (status_element) {
                const current_card_elem = status_element.closest('.card');
                const task_mindmap_id = current_card_elem.dataset.taskMindMapId;
                const current_card = this.#cards[task_mindmap_id]
                const current_task_id = current_card_elem.dataset.taskId;
                const context_menu = new ContextMenu({
                    event: evt,
                    data: {
                        task_id: +current_task_id,
                    }
                })

                for (let i = 0, cur_s; i < this.#statuses.length; i++) {
                    cur_s = this.#statuses[i]
                    if (cur_s.title === current_card.data.task.status) continue;

                    context_menu.add_action(
                        new ContextMenuAction(cur_s.title, () => {
                            send_json(undefined, 'POST', `/tasks/update_attrs`, {
                                task_id: current_card.data.task.pk,
                                status_id: cur_s.pk
                            }, (resp) => {
                                let json_obj = JSON.parse(resp)
                                if ('success' in json_obj) {
                                    if (json_obj['success'] === true) {
                                        const new_status = structuredClone(cur_s)
                                        current_card.status = new_status.title
                                    }
                                }
                                context_menu.destroy()
                            }, csrfToken)
                        })
                    )
                }


                console.log(context_menu);
                context_menu.create();
                return
            }

            console.log('closest', evt.target.closest('.card'))
            const target = evt.target.closest('.card');
            const project_id = window.MINDMAP_PROJECT_ID;
            const context_menu = new ContextMenu({
                event: evt,
                data: {
                    project_id: project_id
                }
            })

            if (target !== null) {
                const task_id = target.dataset.taskId;
                const task_mindmap_id = target.dataset.taskMindMapId;
                context_menu.add_action(
                    new ContextMenuAction('Редактировать задачу', () => {
                        window.location.href = `/tasks/edit/${task_id}/`
                    })
                )
                context_menu.add_action(
                    new ContextMenuAction('Удалить задачу', () => {
                        const target_task = this.#cards[+task_mindmap_id]
                        let ans = confirm(`Вы действительно хотите удалить задачу '${target_task.data.task.title}'?`)
                        if (ans === true) {
                            send_post_json(evt, `/tasks/delete/${task_id}/`, {}, (resp) => {
                                let json_obj = JSON.parse(resp)
                                if ('success' in json_obj) {
                                    if (json_obj['success'] === true) {
                                        this.remove_card(task_mindmap_id)
                                        context_menu.destroy()
                                    }
                                }
                            }, csrfToken)
                        }
                    })
                )


            } else {
                context_menu.add_action(
                    new ContextMenuAction('Создать задачу', () => {
                        window.location.href = `/tasks/create?project_id=${project_id}`
                    })
                )
            }
            console.log(context_menu)
            context_menu.create()
        })


    }

    get cards() {
        return this.#cards;
    }

    get parent_task_for_binding_chosen() {
        return this.#parent_task_for_binding_chosen;
    }

    set parent_task_for_binding_chosen(value) {
        this.#parent_task_for_binding_chosen = value;
    }

    get element() {
        return this.#element;
    }

    get app() {
        return this.#app;
    }

    get origin() {
        return this.#origin;
    }

    get rulers() {
        return this.#rulers
    }

    get task_id_card_id__dict() {
        return this.#task_id_card_id__dict;
    }

    add_card(card) {
        this.#origin.cards_container.appendChild(card.element)
        this.#task_id_card_id__dict[card.data.task.pk] = card.pk
    }

    add_relation(parent_card, child_card, curve) {
        const relation = new CardsRelation(this, parent_card, child_card, curve)
        this.#cards_relations[`${parent_card.pk}_${child_card.pk}`] = relation
        this.#origin.relations_container.appendChild(relation.element)
    }

    remove_relation(parent_card, child_card) {
        const relation = this.#cards_relations[`${parent_card.pk}_${child_card.pk}`];
        this.#origin.relations_container.removeChild(relation.element);
        delete this.#cards_relations[`${parent_card.pk}_${child_card.pk}`];
    }

    redraw_relations() {
        for (const key in this.#cards_relations) {
            this.#cards_relations[key].redraw()
        }
    }

    redraw_cards() {
        for (const key in this.#cards) {
            this.#cards[key].redraw()
        }
    }

    get_status_object_by_title(title) {
        return get_dict_from_list_by_key_val(this.#statuses,'title', title, null)
    }

    load_cards(cards_list, tasks_parent_child) {
        for (let i = 0, c, new_card; i < cards_list.length; i++) {
            c = cards_list[i];
            new_card = new Card(this, c);
            this.#cards[c.pk] = new_card;
            this.add_card(new_card);
        }
        for (const pk in this.#cards) {
            const current_card = this.#cards[pk]
            const current_card_task_pk = current_card.data.task.pk
            const children = current_card.data.task.children
            for (let i = 0, c, child_pk, child_card_pk, curve; i < children.length; i++) {
                c = children[i]
                child_pk = c.pk
                child_card_pk = this.#task_id_card_id__dict[child_pk]
                curve = {}
                for (let j = 0, tpc; j < tasks_parent_child.length; j++) {
                    tpc = tasks_parent_child[j]
                    if (current_card_task_pk === tpc.parent_id && tpc.child_id === child_pk) {
                        curve = tpc.curve
                    }
                }
                this.add_relation(current_card, this.#cards[child_card_pk], curve)
            }

        }
    }

    load_tags(tags_json_list) {
        this.#tags = tags_json_list
    }

    load_statuses(statuses_json_list) {
        this.#statuses = statuses_json_list
    }

    remove_card(task_mindmap_id) {
        const target_card = this.#cards[task_mindmap_id];
        this.#origin.cards_container.removeChild(target_card.element)
        delete this.#cards[task_mindmap_id];
    }

    refresh_view() {
        let top_border = -500;
        let right_border = 500;
        let bottom_border = 500;
        let left_border = -500;

        for (const pk in this.#cards) {
            const card = this.#cards[pk];
            if (card.y < top_border) top_border = card.y;
            if (card.x + card.width > right_border) right_border = card.x + card.width;
            if (card.y + card.height > bottom_border) bottom_border = card.y + card.height;
            if (card.x < left_border) left_border = card.x;
        }

        this.set_dimensions(right_border - left_border, bottom_border - top_border);
        this.#origin.set_offsets(-left_border, -top_border);
        this.redraw_rulers()
    }

    get scale(){
        return this.#app.scale;
    }

    redraw_rulers() {
        this.#rulers.h.redraw('width', -this.#origin.left_offset - 50, this.#width - this.#origin.left_offset + 50)
        this.#rulers.v.redraw('height', -this.#origin.top_offset - 50, this.#height - this.#origin.top_offset + 50)
    }

    increase_margin_top(value) {
        this.#element.style.marginTop = `${this.#margin + value}px`;
    }

    increase_margin_left(value) {
        this.#element.style.marginLeft = `${this.#margin + value}px`;
    }

    set_dimensions(width, height) {
        this.#width = width;
        this.#height = height;
        this.#element.style.width = `${this.#width * this.scale}px`;
        this.#element.style.height = `${this.#height * this.scale}px`;
        this.#element.style.marginLeft = `${this.#margin}px`;
        this.#element.style.marginTop = `${this.#margin}px`;
    }


}

export {
    Canvas
}