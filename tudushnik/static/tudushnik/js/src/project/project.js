class Project{
    #app
    #pk;
    #title;
    #description;
    #color;
    #tags;

    constructor(pk, title, description, color, tags){
        this.#app = null
        this.#pk = pk
        this.#title = title
        this.#description = description
        this.#color = color
        this.#tags = tags
    }
    set app(value){
        this.#app = value
    }
    get app(){
        return this.#app;
    }
    get pk(){
        return this.#pk;
    }
    get title(){
        return this.#title;
    }
    get description(){
        return this.#description;
    }
    get color(){
        return this.#color;
    }
    get tags(){
        return this.#tags;
    }

}

export {
    Project
}