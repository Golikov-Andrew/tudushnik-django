class Form {
    #element;
    #fieldsets;

    constructor(form_selector) {
        this.#element = document.querySelector(form_selector)
        this.#fieldsets = this.#element.querySelectorAll('.fieldset.openable')
        this.#fieldsets.forEach(fieldset => {
            const label = fieldset.querySelector('.label')
            label.addEventListener('click', () => {
                fieldset.classList.toggle('opened')
            })
        })
    }

    expand_fieldset(field_selector) {
        const target_element = this.#element.querySelector(field_selector)
        if (target_element) {
            const fieldset = target_element.closest('.fieldset.openable');
            if (fieldset) {
                fieldset.classList.add('opened');
            }
        }
    }
}

export {
    Form
}
