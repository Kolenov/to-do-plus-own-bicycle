(function () {
    var arraySlice = Array.prototype.slice,
        lib = function (selector) {
            return new lib.prototype.init(selector);
        };

    lib.prototype = {
        constructor: lib,
        init: $$Lib,
        find: find,
        on: on,
        off: off,
        each: each,
        attr: attr,
        toggleClass: toggleClass,
        addClass: addClass,
        removeClass: removeClass,
        append: append,
        remove: remove
    };

    $$Lib.prototype = lib.prototype;
    window.$$Lib = lib;

    function $$Lib(selector, element) {
        this.res = [];
        if (!selector) {
            return this;
        } else if (!isString(selector)) {
            this.res.push(selector);
            return this;
        }
        this.res = selectAll(selector, element);
        return this;
    }

    /**
     * Find element in the collection elements
     * @param selector
     * @returns {$$Lib}
     */
    function find(selector) {
        this.res = this.res.reduce(function (pV, cV, i, arr) {
            return pV.concat(selectAll(selector, cV));
        }, []);
        return this;
    }

    /**
     * Iterate over a $$Lib object, executing a function for each element.
     * @param callback
     * @returns {each}
     */
    function each(callback) {
        if (!isFunction(callback)) {
            throw new TypeError("Callback should be Function");
        }
        this.res.forEach(callback);
        return this;
    }

    /**
     * Add attribute to element
     * @param name
     * @param value
     * @returns {attr}
     */
    function attr(name, value) {
        var attributes;
        if (isString(name) && name && value) {
            this.each(function (element) {
                element.setAttribute(name, value);
            });
        } else if (isString(name) && name) {
            this.each(function (element) {
                attributes = element.getAttribute(name);
            });
            return attributes;

        }
        return this;
    }

    /**
     * Add class to element's classList
     * @param name
     * @returns {addClass}
     */
    function addClass(name) {
        if (isString(name) && name) {
            this.each(function (obj) {
                obj.classList.add(name);
            });
        }
        return this;
    }

    /**
     * Remove class from element's classList
     * @param name
     * @returns {removeClass}
     */
    function removeClass(name) {
        if (isString(name) && name) {
            this.each(function (element) {
                element.classList.remove(name);
            });
        }
        return this;
    }

    /**
     *
     * @param name
     * @param state {boolean} w.o - toggle class, true - add class, false - remove class
     * @returns {toggleClass}
     */
    function toggleClass(name, state) {
        if (isString(name) && name) {
            this.each(function (element) {
                element.classList.toggle(name, state);
            });
        }
        return this;
    }

    /**
     *
     * @param content
     * @returns {append}
     */
    function append(content) {
        if (isString(content) && content) {

            var res = this.res,
                elem = document.createElement(content);

            this.each(function (element) {
                res.shift(element);
                var node = element.appendChild(elem);
                res.push(node);
            });
        }
        return this;
    }

    /**
     *
     * @param content
     * @returns {remove}
     */
    function remove(element) {
        console.log(element);
        if (element) {
            this.each(function (obj) {
                console.log(obj);
                element.res.reduce(function (pV, cV, i, arr) {
                    obj.removeChild(cV);
                }, 0);

            });
        }
        return this;
    }

    /**
     *
     * @param event
     * @param handler
     * @param capture
     * @returns {on}
     */
    function on(event, handler, capture) {
        var useCapture = capture || false;
        if (isString(event) && isFunction(handler)) {
            this.each(function (obj) {
                var memento = obj.memento = obj.memento || {};
                obj.addEventListener(event, handler, useCapture);
                memento[event] = memento[event] || [];
                memento[event].push({handler: handler, capture: capture});
            });
        }
        return this;
    }

    /**
     *
     * @param event
     * @param handler
     * @param capture
     * @returns {off}
     */
    function off(event, handler, capture) {
        this.each(function (obj) {
            if (isString(event) && event && isFunction(handler) && handler) {
                removeEvent.call(obj, event, handler, capture);
            } else if (isString(event) && event) {
                removeEvent.call(obj, event);
            } else {
                for (var val in obj.memento) {
                    if (obj.memento.hasOwnProperty(val)) {
                        removeEvent.call(obj, val);
                    }
                }
            }
        });
        return this;
    }


    function selectAll(selector, element) {
        element = element || document;
        return arraySlice.call(element.querySelectorAll(selector));
    }

    function isString(value) {
        return typeof value === "string";
    }

    function isFunction(value) {
        return typeof value === "function";
    }

    function removeEvent(event, handler, capture) {
        var that = this;
        capture = capture || false;
        that.memento[event].reduce(function (pV, cV, i, arr) {
            handler = handler || cV.handler;
            capture = capture || cV.capture;
            that.removeEventListener(event, handler, capture);
            arr.splice(i, 1);
        }, 0);
    }

    return lib;
}(window, document));


window.onload = function () {
    var tasksList = $$Lib("#tasks"),
        taskInput = $$Lib("#task-input"),
        totalTasks = $$Lib("#total-tasks"),
        deleteButton = $$Lib("#delete-completed"),
        classDelete = "delete";

    var counter = function () {
    };
    counter.total = 0;
    counter.addTask = function () {
        this.total += 1;
        return this;
    };
    counter.deleteTask = function () {
        this.total -= 1;
        return this;
    };


    var addTask = function (event) {
        if (event.keyCode === 13) {
            var content = this.value;
            $$Lib("#tasks").append("li")
                .addClass("task-list__item")
                .attr("data-item", Date.now())
                .each(function (element) {
                    element.innerHTML = content;
                }).append("span").addClass(classDelete).each(function (element) {
                element.innerHTML = "\u00D7";
            });

            counter.addTask();

            totalTasks.each(function (element) {
                element.innerHTML = counter.total;
            });

            this.value = "";
        }
    };

    var deleteTask = function (event) {
        if (event.target.classList.contains(classDelete)) {

            tasksList.remove($$Lib(event.target.parentNode));
            counter.deleteTask();

            totalTasks.each(function (element) {
                element.innerHTML = counter.total;
            });

        }
    };

    var markCompleted = function (event) {
        $$Lib(event.target).toggleClass("completed");
    };

    var deleteCompleted = function () {
        var completed = $$Lib(".task-list__item.completed");
        completed.each(function () {
            counter.deleteTask();
            console.log(counter.total);
        });

        $$Lib("#tasks").remove(completed);

        totalTasks.each(function (element) {
            element.innerHTML = counter.total;
        });
    };

    taskInput.on("keydown", addTask);
    tasksList.on("click", deleteTask);
    tasksList.on("dblclick", markCompleted);
    deleteButton.on("click", deleteCompleted);

};