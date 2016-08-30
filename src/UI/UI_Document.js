/**
 * Created by Pablo Henrick on 24/08/2016.
 */
(function (root) {
    if (root.System == undefined) {
        throw "UI_Document requires System"
    }

    if (root.Viewport == undefined) {
        throw "UI_Document requires Viewport"
    }

    var viewport = root.Viewport,
        system = root.System;

    var hover = false;

    var Document = {
        contents: [],
        levels: [],
        left: 0,
        top: 0,
        hover_target: null,
        changed: {},
        ui_states: {},
        change: function (level, id) {
            var self = this;
            if (self.changed[level] == undefined) {
                self.changed[level] = {};
            }
            self.changed[level][id] = true;
        },
        initialize: function () {
            var Mouse = root.Controls.Mouse;
            Mouse.addEventListener('mousemove', mousemove);
            Mouse.addEventListener('mouseout', mouseout);
            Mouse.addEventListener('mousedown', mousedown);
            Mouse.addEventListener('mouseup', mouseup)
        },
        finalize: function () {
            var Mouse = root.Controls.Mouse;
            Mouse.removeEventListener('mousemove', mousemove);
            Mouse.removeEventListener('mouseout', mouseout);
            Mouse.removeEventListener('mousedown', mousedown);
            Mouse.removeEventListener('mouseup', mouseup)
        },
        addToLevel: function (level, element) {
            var self = this;
            if (self.levels[level] == undefined) {
                self.levels[level] = {};
            }
            self.levels[level][element.id] = element;
        },
        removeFromLevel: function (level, id) {
            var self = this;
            if (self.levels[level] != undefined) {
                delete self.levels[level][id];
            }
        },
        add: function (element) {
            var self = this;
            if (self.contents.indexOf(element) == -1) {
                self.contents.push(element);
            }
        },
        remove: function (element) {
            var self = this;
            var index = self.contents.indexOf(element);
            if (index != -1) {
                self.contents.splice(index, 1);
            }
        },
        update: function () {
            var self = this;
            var i;
            var j;
            var layer = null;
            var ids;
            var id;
            var keys = Object.keys(self.changed);
            var lengthA = keys.length;
            var lengthB;
            var key;

            for (i = 0; i < lengthA; i++) {
                key = keys[i];
                if (self.changed[key] && self.levels[key]) {
                    layer = viewport.getLayer('UI', key);
                    ids = Object.keys(self.changed[key]);
                    lengthB = ids.length;
                    for (j = 0; j < lengthB; j++) {
                        id = ids[j];
                        self.levels[key][id].clear(layer,viewport);
                        self.levels[key][id].update(layer,viewport);
                        delete self.changed[key][id];
                    }
                }
            }
        },
        addState: function (state, ui_element) {
            var self = this;
            if (self.ui_states[state] == undefined) {
                self.ui_states[state] = [];
            }
            if (self.ui_states[state].indexOf(ui_element) == -1) {
                self.ui_states[state].push(ui_element);
            }
        },
        removeState: function (state, ui_element) {
            var self = this;
            if (self.ui_states[state] != undefined) {
                if (/^[0-9]+$/.test(ui_element)) {
                    if (self.ui_states[state][ui_element] != undefined) {
                        return self.ui_states[state].splice(ui_element, 1)[0];
                    }
                }
                else {
                    var index = self.ui_states[state].indexOf(ui_element);
                    if (index != -1) {
                        return self.ui_states[state].splice(index, 1)[0];
                    }
                }
            }
            return null;
        },
        getStates: function (state) {
            var self = this;
            if (self.ui_states[state] != undefined) {
                return self.ui_states[state];
            }

            return [];
        }
    };

    Object.defineProperty(Document, 'hover', {
        get: function () {
            return hover;
        },
        set: function (h) {
            if (hover != h) {
                hover = h;
            }
        }
    });


    var retrieve_element = function (x, y) {
        var keysA = Object.keys(Document.levels).reverse();
        var keysB;
        var kA;
        var kB;
        var level;
        var id;
        var lengthA = keysA.length;
        var lengthB;
        var el;

        for (kA = 0; kA < lengthA; kA++) {
            level = keysA[kA];
            keysB = Object.keys(Document.levels[level]);
            lengthB = keysB.length;
            for (kB = 0; kB < lengthB; kB++) {
                id = keysB[kB];
                el = Document.levels[level][id];

                if (inside_bounds(x, y, el.absoluteLeft, el.absoluteTop, el.realWidth, el.realHeight)) {
                    return el;
                }

            }
        }
        return Document;
    };

    var inside_bounds = function (mx, my, bx, by, bWidth, bHeight) {
        return mx >= bx && mx <= bx + bWidth && my >= by && my <= by + bHeight;
    };


    var mousemove = function (x, y) {
        var element = retrieve_element(x, y);
        if (element != null) {
            var ui_states = Document.getStates('hover');
            var propagated = propagate('hover', element,[x,y]);
            var length = ui_states.length;
            var i;
            for (i = 0; i < length; i++) {
                if (propagated.indexOf(ui_states[i]) == -1) {
                    var el = Document.removeState('hover', i);
                    el.hover = false;
                    i--;
                    length--;
                }
            }
            length = propagated.length;
            for(i =0; i < length;i++){
                Document.addState('hover',propagated[i]);
            }
        }
    };

    var mouseup = function(x,y){
        var element = retrieve_element(x, y);
        if (element != null) {
            propagate('mouseup',element,[x,y]);
        }
    };

    var mousedown = function(x,y){
        var element = retrieve_element(x, y);
        if (element != null) {
            propagate('mousedown',element,[x,y]);
        }
    };

    var mouseout = function () {
        var ui_states = Document.getStates('hover');
        var length = ui_states.length;
        var i;
        for (i = 0; i < length; i++) {
            var el = Document.removeState('hover', i);
            el.hover = false;
            i--;
            length--;
        }
    };

    var propagate = function (event, element,args, propagated) {
        propagated = propagated || [];
        args = args || [];
        propagated.push(element);
        switch (event) {
            case 'hover':
                element.hover = true;
                break;
            case 'mousedown':
                element.mousedown(args[0],args[1]);
                break;
        }
        if (element.parent) {
            propagate(event, element.parent,args, propagated);
        }
        return propagated;
    };

    system.addSteplistener(function () {
        Document.update();
    });


    root.Document = Document;
})(RPG);