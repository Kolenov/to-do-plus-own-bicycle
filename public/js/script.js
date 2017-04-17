window.addEventListener('load', function () {
  'use strict';

  var STATUS = {
    OK:      200,
    CREATED: 201
  };

  function render () {
    var target   = document.querySelector('#tasks'),
        fragment = document.createDocumentFragment();

    var li = '<li class="task-list__item" data-item="1491763979501"><div class="task-list__item-title"><input' +
      ' type="checkbox"></div><span class="delete">×</span></li>';

    // <div id="one">one</div>
    //var d1 = document.getElementById('one');
    //d1.insertAdjacentHTML('afterend', '<div id="two">two</div>');

    // At this point, the new structure is:
    // <div id="one">one</div><div id="two">two</div>

  }

  function addTask (json) {
    var xhr          = new XMLHttpRequest(),
        responseData = '';
    xhr.open('POST', '/tasks', true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.responseType = 'json';

    xhr.onreadystatechange = function () {
      if (xhr.status === STATUS.CREATED) {
        var responseData = JSON.parse(xhr.responseText);
        console.log(responseData);
      }

    };

    xhr.send(json);
  }

  function getAllTasks () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/tasks', true);
    xhr.responseType = 'json';

    xhr.onreadystatechange = function () {
      if (this.readyState === this.DONE) {
        if (this.status === STATUS.OK) {
          render(this.response);
        } else {
          //
        }
      }
    };

    xhr.send(null);
  }

  function getTask (id) {
    var xhr = new XMLHttpRequest(),
        url = 'tasks/' + id;
    xhr.open('GET', url, true);
    xhr.responseType = 'json';

    xhr.onreadystatechange = function () {
      if (this.readyState === this.DONE) {
        if (this.status === STATUS.OK) {
          render(this.response);
        } else {
          //
        }
      }
    };

    xhr.send(null);
  }

  function deleteTask (id) {
    var xhr = new XMLHttpRequest(),
        url = 'tasks/' + id;
    xhr.open('DELETE', url, true);
    xhr.responseType = 'json';

    xhr.onreadystatechange = function () {
      if (this.readyState === this.DONE) {
        if (this.status === STATUS.OK) {
          render(this.response);
        } else {
          //
        }
      }
    };

    xhr.send(null);
  }

  function updateTask (id, json) {
    var xhr = new XMLHttpRequest(),
        url = 'tasks/' + id;

    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.responseType = 'json';

    xhr.onreadystatechange = function () {
      if (this.readyState === this.DONE) {
        if (this.status === STATUS.OK) {
          render(this.response);
        } else {
          //
        }
      }
    };

    xhr.send(null);
  }

});

//
//var obj = {
//  "result":[
//    {
//      "FirstName": "Test1",
//      "LastName":  "User",
//    },
//    {
//      "FirstName": "user",
//      "LastName":  "user",
//    },
//    {
//      "FirstName": "Ropbert",
//      "LastName":  "Jones",
//    },
//    {
//      "FirstName": "hitesh",
//      "LastName":  "prajapti",
//    }
//  ]
//};
//console.log(obj);
//delete obj.result[0];
//delete obj.result[1];
//console.log(obj);
