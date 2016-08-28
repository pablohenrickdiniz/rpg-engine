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
        change: function (level, id) {
            var self = this;
            if (self.changed[level] == undefined) {
                self.changed[level] = {};
            }
            self.changed[level][id] = true;
        },
        initialize: function () {
            var Mouse = root.Controls.Mouse;
            //   Mouse.addEventListener('mousedown', mousedown);
            Mouse.addEventListener('mousemove', mousemove);
            Mouse.addEventListener('mouseout', mouseout);
        },
        finalize: function () {
            var Mouse = root.Controls.Mouse;
            // Mouse.removeEventListener('mousedown', mousedown);
            Mouse.removeEventListener('mousemove', mousemove);
            Mouse.removeEventListener('mouseout', mouseout);
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
            var layer = null;
            var ids;
            var length;
            var id;

            if (self.changed[0] && self.levels[0]) {
                layer = viewport.getLayer('UI1');
                ids = Object.keys(self.changed[0]);
                length = ids.length;
                for (i = 0; i < length; i++) {
                    id = ids[i];
                    self.levels[0][id].clear(layer);
                    self.levels[0][id].update(layer);
                    delete self.changed[0][id];
                }
            }

            if (self.changed[1] && self.levels[1]) {
                layer = viewport.getLayer('UI2');
                ids = Object.keys(self.changed[1]);
                length = ids.length;
                for (i = 0; i < length; i++) {
                    id = ids[i];
                    self.levels[1][id].clear(layer);
                    self.levels[1][id].update(layer);
                    delete self.changed[1][id];
                }
            }

            if (self.changed[2] && self.levels[2]) {
                layer = viewport.getLayer('UI3');
                ids = Object.keys(self.changed[2]);
                length = ids.length;
                for (i = 0; i < length; i++) {
                    id = ids[i];
                    self.levels[2][id].clear(layer);
                    self.levels[2][id].update(layer);
                    delete self.changed[2][id];
                }
            }
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
        if (Document.hover_target != element) {
            if (Document.hover_target != null) {
                Document.hover_target.hover = false;
            }
            Document.hover_target = element;

            if (element != null) {
                element.hover = true;
            }
        }
    };

    var mouseout = function () {
        if (Document.hover_target != null) {
            Document.hover_target.hover = false;
            Document.hover_target = null;
        }
    };

    system.addSteplistener(function () {
        Document.update();
    });

    root.Document = Document;
})(RPG);