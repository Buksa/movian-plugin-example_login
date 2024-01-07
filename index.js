var plugin = JSON.parse(Plugin.manifest);
var service = require('movian/service');
var PREFIX = plugin.id;
var LOGO = Plugin.path + 'logo.png';
var BASE_URL = 'https://megapeer.vip';

var UA = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:15.0) Gecko/20100101 Firefox/15.0.1'
var page = require('showtime/page');
var service = require('movian/service');
var io = require('native/io');
var prop = require('movian/prop');
var popup = require('native/popup');

var http = require('movian/http');

var store = require('showtime/store').create('store');

// // на всякий случий все запросы на BASE_URL будут с UA и Referer
// io.httpInspectorCreate(BASE_URL+'.*', function (ctrl) {
//     ctrl.setHeader('User-Agent', UA);
//     ctrl.setHeader('Referer', BASE_URL);
//   });

// Create the service (ie, icon on home screen)
service.create(plugin.title, PREFIX + ':start', 'video', true, LOGO);

new page.Route(PREFIX + ':start', function (page) {
    page.type = 'directory';
    page.metadata.title = PREFIX;
    page.metadata.icon = LOGO;
    // io.httpInspectorCreate('https://www.youtube.com/.*', function(ctrl) {
    //   ctrl.setHeader('User-Agent', UA);
    //   return 0;
    // });
    // /// req on base_url
    // code для консоли
    // fetch("https://megapeer.vip/", {
    //     "referrerPolicy": "strict-origin-when-cross-origin",
    //     "body": null,
    //     "method": "GET"
    //   }).then( res => res.text()).then(data => console.log(null == /logout/.exec(data)));
    console.error({store:store});
    var resp = http.request(BASE_URL, {
      debug: true,
      noFail: true, // Don't throw on HTTP errors (400- status code)
      compression: true, // Will send 'Accept-Encoding: gzip' in request
      // caching: true, // Enables Movian's built-in HTTP cache
      //cacheTime: 3600
      headers: {
        'Cookie': store.userCookie
      },
    });
    console.log(/profile.php/.exec(resp));
    console.log(null == /profile.php/.exec(resp))
    // если в хтмл нет строки 
    if (null == /profile.php/.exec(resp)) {
      //добовляем итем на страницу для вызыва URI PREFIX:login 
      page.appendItem(PREFIX + ':login', 'directory', {
        title: 'login'
      });
     } else
      //от обратного
      //добовляем итем на страницу для вызыва URI PREFIX:logout 
      page.appendItem(PREFIX + ':logout', 'directory', {
        title: 'logout'
      });
});

new page.Route(PREFIX + ':login', function (page, showAuth, token) {
    // // попап с запросом на пороль
    var credentials = popup.getAuthCredentials(plugin.title, 'Login Required', 1, null, true);
     if (credentials.rejected) {return  page.redirect(PREFIX + ':start') }//'Rejected by user'}
    //если нет узернаме паса то
    if (credentials.username !== '' && credentials.password !== '') {
      //делаем запрос
      // fetch("https://megapeer.vip/takelogin.php", {
      //   "headers": {
      //     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      //     "accept-language": "en-US,en;q=0.9",
      //     "cache-control": "max-age=0",
      //     "content-type": "application/x-www-form-urlencoded",
      //     "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Brave\";v=\"120\"",
      //     "sec-ch-ua-mobile": "?0",
      //     "sec-ch-ua-platform": "\"Windows\"",
      //     "sec-fetch-dest": "document",
      //     "sec-fetch-mode": "navigate",
      //     "sec-fetch-site": "same-origin",
      //     "sec-fetch-user": "?1",
      //     "sec-gpc": "1",
      //     "upgrade-insecure-requests": "1",
      //     "cookie": "PHPSESSID=vgacv3a225difnhk89erhvcrv2",
      //     "Referer": "https://megapeer.vip/enter",
      //     "Referrer-Policy": "strict-origin-when-cross-origin"
      //   },
      //   "body": "username=uzver&password=zzzparolzzz",
      //   "method": "POST"
      // });

      v = http.request('https://megapeer.vip/takelogin.php', {
        //не перенапровлять
        noFollow: true,
        //не выдовать ошибку при 404
        noFail: true,
        //дебаг вывод
        debug: true,
        // пост дата для запроса с
        postdata: {
          //user
          username: credentials.username,
          //pass
          password: credentials.password,
          //login: 'submit'
        },
       headers: {
          // "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          // "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
          // "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded",
          "User-Agent": UA,
          // 'Origin':'https://megapeer.vip',
          'Referer': 'https://megapeer.vip',
          // 'Accept-Encoding': 'gzip, deflate',
          // 'Accept-Language': 'en-US,en;q=0.8,ru;q=0.6'
        }
      });
      saveUserCookie(v);
      console.error('status code:'+v.statuscode)
      // console.error(v.toString());
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
    // и обнулить куки в store
    store.userCookie ='';
    http.request('https://megapeer.vip/logout.php',{
      noFollow: true,
      noFail: true,
      debug: true,
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/113.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        // "Upgrade-Insecure-Requests": "1",
        // "Sec-Fetch-Dest": "document",
        // "Sec-Fetch-Mode": "navigate",
        // "Sec-Fetch-Site": "same-origin",
        // "Sec-Fetch-User": "?1",
        "Referer": "https://megapeer.vip/profile.php",
    },
});

    page.loading = false;
    //redirect na glavnuu
    page.redirect(PREFIX + ':start');
 });

/**
 * Saves user cookies from the response headers.
 *
 * @param {Object} resp - The response object containing headers.
 * @returns {boolean} Returns true if cookies were successfully saved, false otherwise.
 */
function saveUserCookie(resp) {
  // Log the function call and response for debugging purposes
  console.error('callsaveUserCookie:');
  console.log(JSON.stringify(resp, null, 4));

  // Extract headers from the response
  var headers = resp.multiheaders;

  // Check if headers exist
  if (!headers) {
    return false;
  }

  // Extract cookies from headers
  var cookie = headers["Set-Cookie"] || headers["set-cookie"];
  console.log(JSON.stringify(cookie, null, 4));

  // Process cookies to filter out "deleted" cookies
  var resultCookies = "";
  for (var i = 0; i < cookie.length; ++i) {
    if (cookie[i].indexOf("=deleted") >= 0) {
      continue;
    }
    resultCookies += cookie[i].slice(0, cookie[i].indexOf(';') + 1);
  }

  // Store the filtered cookies
  store.userCookie = resultCookies;

  // Cookies saved successfully
  return true;
}
