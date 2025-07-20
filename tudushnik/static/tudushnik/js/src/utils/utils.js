function pop_from_list(list, value){
    const index = list.indexOf(value)
    if(index !== -1){
        return list.splice(index, 1)[0]
    }
    return null
}

export{
    pop_from_list
}