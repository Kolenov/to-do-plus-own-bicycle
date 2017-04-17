var http = require('http'),
    url = require('url'),
    path = require('path'),
    mime = require('mime'),
    fs = require('fs'),
    shortId = require('shortid'),
    port = 80,
    dbFile = 'db.json',
    db = path.join(__dirname, dbFile),
    pubDir = 'public',
    isFile = /[\w\d_-]+\.[\w\d]+$/;

var server = http.createServer();

server.on('request', function(request, response) {

  var uri = url.parse(request.url),
      method = request.method,
      base = path.join(__dirname, pubDir),
      pathName = uri.pathname;

  /**
   *
   * @param err
   * @param status
   * @param response
   */
  function error(err, status, response) {
    console.log(err.message);
    response.statusCode = status;
    response.end();
  }

  /**
   *
   * @param request
   * @param response
   * @param file
   */
  function index(request, response, file) {
    var rStream = fs.createReadStream(file);
    rStream.on('open', function() {
      response.writeHead(200, {'Content-Type': mime.lookup(file)});
      rStream.pipe(response);
    });

    rStream.on('error', function(err) {
      return error(err, 404, response);
    });
  }

  if (method === 'GET') {
    switch (true) {
      case isFile.test(pathName):
        index(request, response, path.join(base, pathName));
        break;

      case /\/tasks/.test(pathName):
        index(request, response, db);
        break;

      default:
        index(request, response, path.join(base, '/index.html'));
        break;
    }
  }

  // add task
  if (method === 'POST' && pathName === '/tasks') {
    request.on('data', function(clientData) {
      var newTask = JSON.parse(clientData);
      var id = {id: shortId.generate()};

      Object.assign(newTask, id, {completed: false});
      console.log(newTask);

      fs.readFile(db, function(err, data) {
        if (err) {
          return error(err, 404, response);
        }

        try {
          var tasks = JSON.parse(data);
          tasks.push(newTask);
        } catch (e) {
          return error(e, 500, response);
        }

        fs.writeFile(db, JSON.stringify(tasks, '', 4), function(err) {
          if (err) {
            return error(err, 500, response);
          }
          response.writeHead(201, {'Content-Type': mime.lookup('json')});
          response.end(JSON.stringify(newTask));
        });

      });
    });
  }

  // delete task
  if (method === 'DELETE' && pathName === '/tasks') {
    var tasksRequest,
        tasksDB;

    request.on('data', function(clientData) {
      tasksRequest = JSON.parse(clientData);
      console.log('Completed Tasks ID ' + tasksRequest);

      fs.readFile(db, function(err, data) {
        if (err) {
          return error(err, 500, response);
        }

        tasksDB = JSON.parse(data);

        var newTasks = tasksDB.filter(function(cv) {
          var current = cv;
          return !tasksRequest.some(function(elem) {
            return current.id === elem;
          });
        });
        console.log(newTasks);

        fs.writeFile(db, JSON.stringify(newTasks, '', 4), function(err, data) {
          if (err) {
            return error(err, 500, response);
          }
          response.statusCode = 200;
          response.end();
        });
      });
    });
  }

  // update task
  if (method === 'PUT' && pathName === '/tasks') {
    request.on('data', function(clientData) {

      tasksRequest = JSON.parse(clientData);
      console.log(tasksRequest);

      fs.readFile(db, function(err, data) {
        if (err) {
          return error(err, 500, response);
        }

        tasksDB = JSON.parse(data);

        tasksDB.forEach(function(elem) {
          if (elem.id === tasksRequest.id) {
            elem.completed = tasksRequest.completed;
          }
        });
        console.log(tasksDB);

        fs.writeFile(db, JSON.stringify(tasksDB, '', 4), function(err, data) {
          if (err) {
            return error(err, 500, response);
          }
          response.statusCode = 200;
          response.end();
        });
      });

    });
  }

});

server.listen(port);

console.log('> http server is listening on http://127.0.0.1:' + port);