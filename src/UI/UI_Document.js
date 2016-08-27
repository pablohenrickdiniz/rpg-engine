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
        changed: false,
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
                self.levels[level] = [];
            }
            if (self.levels[level].indexOf(element) == -1) {
                self.levels[level].push(element);
            }
        },
        removeFromLevel: function (level, element) {
            var self = this;
            if (self.levels[level] != undefined) {
                var index = self.levels[level].indexOf(element);
                if (index != -1) {
                    self.levels[level].splice(index, 1);
                }
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
            var length = self.contents.length;
            var i;


            if (self.changed) {
                self.changed = false;
                self.clearUILayers();
                for (i = 0; i < length; i++) {
                    self.contents[i].update();
                }
            }
        },
        clearUILayers: function () {
            var layer1 = viewport.getLayer('UI1');
            var layer2 = viewport.getLayer('UI2');
            var layer3 = viewport.getLayer('UI3');
            layer1.clear();
            layer2.clear();
            layer3.clear();
        }
    };

    Object.defineProperty(Document, 'hover', {
        get: function () {
            return hover;
        },
        set: function (h) {
            if(hover != h){
                hover = h;
                Document.changed = true;
            }
        }
    });


    var retrieve_element = function (x, y) {
        var keys = Object.keys(Document.levels).reverse();
        var k;
        var l;
        var key;
        var lengthA = keys.length;
        var lengthB;
        var el;

        for (k = 0; k < lengthA; k++) {
            key = keys[k];
            lengthB = Document.levels[key].length;
            for (l = 0; l < lengthB; l++) {
                el = Document.levels[key][l];
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
        }
    };

    system.addSteplistener(function () {
        Document.update();
    });

    root.Document = Document;
})(RPG);