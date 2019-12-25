var express = require("express");
var app = express();
var fs = require("fs");
var template = require('./lib/template.js');
var qs = require('querystring');
var bodyParser = require('body-parser');
var compression = require('compression');
var topicRouter = require('./routes/topic');

app.use(express.static('public')); // 정적인 파일의 서비스(이미지 불러오기)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression()); // 파일 압축 시키기 (검사페이지에서 cmd + shift + R)
app.get('*',function (request, response, next) { // 모든 app.get에 부여함
    fs.readdir('./data', function (error, filelist) {
        request.list = filelist;
        next(); // 다음에 실행될 미들웨어를 실행 
    });
});

app.use('/topic', topicRouter); // /topic으로 시작되는 주소들에게 topicRouter 미들웨어를 적용

app.get('/', function (request, response) {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `
        <h2>${title}</h2>${description}
        <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px">
        `,
        `<a href="/topic/create">create</a>`
    );
    response.send(html);
});

app.use(function(req, res, next){
    res.status(404).send('Sorry cant find that!')
});

app.use(function(err, req, res, next){
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
