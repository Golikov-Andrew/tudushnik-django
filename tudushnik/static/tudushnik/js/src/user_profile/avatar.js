import {ModalWindow} from "../my_utils/modal_window";
import {DOMElem} from "../../dom_utils";
import {send_post_formdata} from "../utils/utils";

class Avatar {
    constructor(root_element_selector) {
        this.element = document.querySelector(root_element_selector)
        this.modal = new ModalWindow({
            unique_id: 'modal_upload_avatar', buttons: ['ok', 'cancel']
        })

        this.validation_errors = []
        this.is_new_image_chosen = false
        this.modal.init()

        this.element.addEventListener('click', (evt) => {
            let image_element = new DOMElem('img', {
                classes: ['modal_avatar_img'],
                attrs: {
                    src: this.element.src, alt: 'preview'
                }
            }).element
            let input_file_element = new DOMElem('input', {
                attrs: {
                    type: 'file',
                    accept: '.jpg, .jpeg'
                }
            }).element
            let validation_errors_element = new DOMElem('div', {
                classes: ['validation_errors'],
                children:[
                    new DOMElem('div',{
                        classes:['hint'],
                        html:'Загружаемое изображение должно быть формата jpg, квадратным, иметь стороны не менее 50 и не более 300 пикселов.'
                    })
                ]
            }).element
            this.modal.set_content(
                new DOMElem('div', {
                    children: [
                        image_element,
                        input_file_element,
                        validation_errors_element
                    ]
                }).element.innerHTML
            )
            this.modal.element.querySelector('input[type="file"]').addEventListener('change', (evt) => {
                let reader = new FileReader();
                this.validation_errors = []
                reader.onload = (e) => {
                    let img = new Image();
                    img.onload = () => {
                        let width = img.naturalWidth;
                        let height = img.naturalHeight;
                        if (width !== height) {
                            this.validation_errors.push(`Ошибка! Изображение должно быть квадратным! Ваше изображение ${width}x${height}}`)
                        }
                        if (width < 50 || height < 50) {
                            this.validation_errors.push(`Ошибка! Стороны изображения не должны быть меньше 50 пикселей!}`)
                        }
                        if (width > 300 || height > 300) {
                            this.validation_errors.push(`Ошибка! Стороны изображения не должны быть больше 300 пикселей!}`)
                        }
                        if (this.validation_errors.length === 0) {
                            this.modal.element.querySelector('.validation_errors').innerHTML = ''
                            this.modal.element.querySelector('img').src = reader.result;
                            this.is_new_image_chosen = true
                        } else {
                            this.modal.show_errors()
                        }
                    }
                    img.src = e.target.result;
                }
                reader.readAsDataURL(evt.target.files[0])
            })
            this.modal.show()
        })

        this.modal.show = () => {
            this.is_new_image_chosen = false
            this.validation_errors = []
            showElem(this.modal.element)
        }

        this.modal.show_errors = () => {
            this.modal.element.querySelector('.validation_errors').innerHTML = this.validation_errors.join('<br>')
        }

        this.modal.validate = () => {
            console.log('this.is_new_image_chosen', this.is_new_image_chosen)
            if (!this.is_new_image_chosen) {
                this.validation_errors.push('Сперва загрузите картинку')
                return false
            }
            if (this.validation_errors.length !== 0) {
                this.validation_errors.push('Загрузите картинку требуемых параметров')
                return false
            }
            return true
        }

        this.modal.perform_ok = () => {
            let form_data = new FormData()
            form_data.append('image', this.modal.element.querySelector('input[type="file"]').files[0])
            send_post_formdata(undefined, csrfToken, '/user/avatar', form_data, (data) => {
                let json_obj = JSON.parse(data)
                if (json_obj.success === true) {
                    this.element.src = json_obj.path_to_avatar
                }
            })
        }
    }
}

export {
    Avatar
}