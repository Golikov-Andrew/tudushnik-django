function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {

  options = {
    path: '/',
    // при необходимости добавьте другие значения по умолчанию
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}


function deleteCookie(name) {
  setCookie(name, "", {
    'max-age': -1
  })
}

let user_settings = null;
class UserSettings{
  constructor(){
    if(user_settings !== null) throw Error('UserSettings - Singleton !');
    user_settings = this;
    //defolt
    this.data = {
      viewport_type: 'table',
      datetimeline_scale: 1,
      datetimeline_scroll_top: 0
    } // datetimeline
    this.datetimeline_scroll_top_timeout = null;
  }
  load(){
    let data = localStorage.getItem('tudushnik_user_settings')
    if(data === null){
      this.save()
    }else{
      this.data = JSON.parse(data)
    }
  }
  save(){
    localStorage.setItem('tudushnik_user_settings', JSON.stringify(this.data))
  }
  set(key, val){
    this.data[key] = val;
    this.save();
    console.log('set user settings', key, val)
  }
  get(key){
    return this.data[key]
  }
}
user_settings = new UserSettings();
user_settings.load()
console.log(user_settings.data)
