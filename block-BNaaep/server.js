/** @format */

let http = require('http');
let fs = require('fs');
let url = require('url');
let path = require('path');
let qs = require('querystring');

let contactspath = path.join(__dirname, `/contacts/`);

let server = http.createServer(handleRequest);

function handleRequest(req, res) {
  let store = '';
  let parsedUrl = url.parse(req.url, true);
  let path = parsedUrl.path;
  let pathname = parsedUrl.pathname;
  let query = parsedUrl.query;

  req.on('data', (chunk) => {
    store += chunk;
  });

  req.on('end', () => {
    if (req.url === '/' && req.method === 'GET') {
      res.setHeader('content-type', 'text/html');
      fs.createReadStream(`./index.html`).pipe(res);
    } else if (path === `/assets/index.css` && req.method === 'GET') {
      res.setHeader('content-type', 'text/css');

      fs.createReadStream(`/assets/index.css`).pipe(res);
    } else if (path === `/assets/about.png` && req.method === `GET`) {
      res.setHeader(`content-type`, `image/png`);
      fs.createReadStream(`./assets/about.png`).pipe(res);
    } else if (req.url === '/form' && req.method === 'POST') {
      let parsedData = qs.parse(store);
      let username = parsedData.username;
      let strData = JSON.stringify(parsedData);

      fs.open(contactsPath + username + `.json`, `wx`, (err, fd) => {
        if (err) return console.log(err);
        fs.writeFile(fd, strData, (err) => {
          fs.close(fd, (err) => {
            console.log(`${username} created successfully`);
            res.setHeader(`content-type`, `text/html`);
            res.write(`<h2> Contact saved</h2>`);
            res.end();
          });
        });
      });
    } else if (pathname === `/users` && req.method === `GET`) {
      let username = query.username;
      fs.readFile(contactsPath + username + `.json`, (err, content) => {
        let contentData = JSON.parse(content.toString());
        if (err) return console.log(err);
        res.setHeader(`content-type`, `text/html`);
        res.write(`<h2>name: ${contentData.name}</h2>`);
        res.write(`<h2>email: ${contentData.email}</h2>`);
        res.write(`<h2>age: ${contentData[`Age`]}</h2>`);
        res.write(`<h2>username: ${contentData.username}</h2>`);
        res.write(`<h2>bio: ${contentData.bio}</h2>`);
        res.end();
      });
    }
  });
}

server.listen(4000, () => {
  console.log('server listening on port 4000');
});
