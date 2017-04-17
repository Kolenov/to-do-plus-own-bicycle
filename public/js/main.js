window.addEventListener('load', function() {

  var STATUS = {
        OK:      200,
        CREATED: 201,
      },

      KEY_CODE = {
        ENTER:  13,
        ESCAPE: 27,
      },
      url = '//localhost/tasks';

  var counter = {
    total:    0,
    increase: function() {
      this.total++;
      return this;
    },
    decrease: function() {
      this.total--;
      return this;
    },
  };

  var totalTasks = document.getElementById('total-tasks'),
      tasksList = document.getElementById('tasks'),
      taskTitle = document.getElementById('task-title'),
      deleteCompleted = document.getElementById('delete-completed');

  /**
   * ajaxJSON
   * @param method
   * @param url
   * @param onSuccess
   * @param onError
   * @param data
   * @returns {XMLHttpRequest}
   */
  var ajaxJSON = function(method, url, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.responseType = 'json';
    xhr.send(data || null);

    xhr.onload = function() {
      if (this.status === STATUS.OK || this.status === STATUS.CREATED) {
        if (onSuccess && isFunction(onSuccess)) {
          onSuccess(this.response);
        }
      }
    };

    xhr.onerror = function() {
      if (onError && isFunction(onError)) {
        onError(this.status);
      }
    };
    return xhr;
  };

  // get all tasks
  ajaxJSON('GET', url, function(data) {
        var fragment = document.createDocumentFragment();

        data.reduce(function(pv, cv) {
          fragment.appendChild(render(cv));
          counter.increase();
        }, fragment);

        tasksList.appendChild(fragment);
        totalTasks.innerHTML = counter.total;
      },
      function(status) {
        console.log(status);
      });

  // add task
  taskTitle.addEventListener('keyup', function(event) {
    if (event.keyCode === KEY_CODE.ENTER) {
      var that = this,
          content = this.value.trim();

      if (!content) {
        return;
      }

      ajaxJSON('POST', url,
          function(data) {
            tasksList.appendChild(render(data));
            counter.increase();
            totalTasks.innerHTML = counter.total;
            that.value = '';
          },
          function(status) {
            console.log(status);
          },
          JSON.stringify({title: content})
      );
    }
  });

  tasksList.addEventListener('click', function(e) {
    console.log(e.target);

    // delete task
    if (e.target.classList.contains('delete')) {
      var taskToDel = e.target.parentNode,
          idToDel = [];
      idToDel.push(taskToDel.getAttribute('data-item'));

      ajaxJSON('DELETE', url,
          function(data) {
            console.log(data);
            tasksList.removeChild(taskToDel);
            counter.decrease();
            totalTasks.innerHTML = counter.total;
          }, function(status) {
            console.log(status);
          }, JSON.stringify(idToDel));
    }

    // update task
    if (e.target.getAttribute('type') === 'checkbox') {

      var taskToUpd = e.target.parentNode,
          obj = {
            id:        taskToUpd.parentNode.getAttribute('data-item'),
            completed: e.target.checked,
          };

      ajaxJSON('PUT', url,
          function(data) {
            console.log(data);
            taskToUpd.classList.toggle('completed');
          },
          function(status) {
            console.log(status);
          }, JSON.stringify(obj));

    }
  });

  deleteCompleted.addEventListener('click', function(e) {
    var completed = tasksList.querySelectorAll('.completed'),
        completedID = [];
    console.log(completed);

    completed.forEach(function(element) {
      completedID.push(element.parentNode.getAttribute('data-item'));
    });

    console.log(completedID);

    ajaxJSON('DELETE', url,
        function(data) {
          console.log(data);
          completed.forEach(function(element) {
            tasksList.removeChild(element.parentNode);
            counter.decrease();
          });
          totalTasks.innerHTML = counter.total;
        }, function(status) {
          console.log(status);
        }, JSON.stringify(completedID));

  });

  /**
   *
   * @param props {taskTitle, id, completed}
   * @returns {Element}
   */
  function render(props) {

    var li = document.createElement('li'),
        checkBox = document.createElement('input'),
        taskTitle = document.createElement('div'),
        delBotton = document.createElement('span');

    checkBox.setAttribute('type', 'checkbox');
    checkBox.checked = props.completed;

    taskTitle.classList.add('task-list__item-title');

    if (props.completed) taskTitle.classList.add('completed');

    taskTitle.appendChild(checkBox);
    taskTitle.insertAdjacentText('beforeend', props.title);

    delBotton.classList.add('delete');
    delBotton.insertAdjacentText('afterbegin', '\u00D7');

    li.classList.add('task-list__item');
    li.setAttribute('data-item', props.id);

    li.appendChild(taskTitle);
    li.appendChild(delBotton);

    console.log(li);
    return li;
  }

  function isFunction(value) {
    return typeof value === 'function';
  }

});
