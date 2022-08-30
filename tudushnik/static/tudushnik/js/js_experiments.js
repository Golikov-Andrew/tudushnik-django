console.log('js_experiments script begin')
let test_qs = '?arr[te]=3&arr[hs]=4&test=5'
let qs_obj = new URLSearchParams(test_qs)
let obj = qs_obj.toObject()
console.log(obj)
console.log(qs_obj.toString())
