var plugin = JSON.parse(Plugin.manifest);
var service = require('movian/service');
var PREFIX = plugin.id;
var LOGO = Plugin.path + 'logo.png';
var BASE_URL = 'https://flarrowfilms.com/';

var UA = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:15.0) Gecko/20100101 Firefox/15.0.1'
var page = require('showtime/page');
var service = require('movian/service');
var io = require('native/io');
var prop = require('movian/prop');
var popup = require('native/popup');

var http = require('movian/http');

// на всякий случий все запросы на BASE_URL будут с UA и Referer
io.httpInspectorCreate(BASE_URL+'.*', function (ctrl) {
    ctrl.setHeader('User-Agent', UA);
    ctrl.setHeader('Referer', BASE_URL);
  });

// Create the service (ie, icon on home screen)
service.create(plugin.title, PREFIX + ':start', 'video', true, LOGO);

new page.Route(PREFIX + ':start', function (page) {
    page.type = 'directory';
    page.metadata.title = PREFIX;
    page.metadata.icon = LOGO;
  
    // /// req on base_url
    // code для консоли
    // fetch("https://flarrowfilms.com/", {
    //     "referrerPolicy": "strict-origin-when-cross-origin",
    //     "body": null,
    //     "method": "GET"
    //   }).then( res => res.text()).then(data => console.log(null == /logout/.exec(data)));
    var resp = http.request(BASE_URL, {
      debug: true,
      noFail: true, // Don't throw on HTTP errors (400- status code)
      compression: true // Will send 'Accept-Encoding: gzip' in request
      // caching: true, // Enables Movian's built-in HTTP cache
      //cacheTime: 3600
    });
    // если в хтмл нет строки логоут
    if (null == /logout/.exec(resp)) {
      //добовляем итем на страницу для вызыва URI HDRezka:login stroka > 55
      page.appendItem(PREFIX + ':login', 'directory', {
        title: 'login'
      });
    } else
      //от обратного
      //добовляем итем на страницу для вызыва URI HDRezka:logout stroka > 117
      page.appendItem(PREFIX + ':logout', 'directory', {
        title: 'logout'
      });
});

new page.Route(PREFIX + ':login', function (page, showAuth, token) {
    // попап с запросом на пороль
    var credentials = popup.getAuthCredentials(plugin.title, 'Login Required', 1, null, true);
     if (credentials.rejected) {return  page.redirect(PREFIX + ':start') }//'Rejected by user'}
    //если нет узернаме паса то
    if (credentials.username !== '' && credentials.password !== '') {
      //делаем запрос
    //   fetch("https://flarrowfilms.com/", {
    //     "headers": {
    //       "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    //       "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    //       "cache-control": "no-cache",
    //       "content-type": "application/x-www-form-urlencoded",
    //       "pragma": "no-cache",
    //       "sec-fetch-dest": "document",
    //       "sec-fetch-mode": "navigate",
    //       "sec-fetch-site": "same-origin",
    //       "sec-fetch-user": "?1",
    //       "sec-gpc": "1",
    //       "upgrade-insecure-requests": "1",
    //       "cookie": "PHPSESSID=62evo4lgm5ci9sj8o29eqapbr7",
    //       "Referer": "https://flarrowfilms.com/",
    //       "Referrer-Policy": "strict-origin-when-cross-origin"
    //     },
    //     "body": "login_name=bugger&login_password=password1&login=submit",
    //     "method": "POST"
    //   });

      v = http.request(BASE_URL, {
        //не перенапровлять
        noFollow: true,
        //не выдовать ошибку при 404
        noFail: true,
        //дебаг вывод
        debug: true,
        // пост дата для запроса с
        postdata: {
          //user
          login_name: credentials.username,
          //pass
          login_password: credentials.password,
          login: 'submit'
        },
       headers: {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded",
          'User-Agent': UA,
          'Referer': BASE_URL,
          'Accept-Encoding': 'gzip, deflate',
          'Accept-Language': 'en-US,en;q=0.8,ru;q=0.6'
        }
      });
      console.error('status code:'+v.statuscode) 
      if (v.statuscode == '200') {
        console.log('status 200');
      }
    }
    //redirekt na glavnuu
    page.redirect(PREFIX + ':start');
  });
  //log out
new page.Route(PREFIX + ':logout', function (page) {
    //тут тело функции
    // поидеи нам тут нужен только запрос на страницу лог оут
    //fetch("https://flarrowfilms.com/index.php?action=logout", {
//   "headers": {
//     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//     "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
//     "cache-control": "no-cache",
//     "pragma": "no-cache",
//     "sec-fetch-dest": "document",
//     "sec-fetch-mode": "navigate",
//     "sec-fetch-site": "same-origin",
//     "sec-fetch-user": "?1",
//     "sec-gpc": "1",
//     "upgrade-insecure-requests": "1",
//     "Referer": "https://flarrowfilms.com/",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": null,
//   "method": "GET"
// });
    http.request('http://newstudio.tv/login.php?logout=1');
    page.loading = false;
    //redirect na glavnuu
    page.redirect(PREFIX + ':start');
  });