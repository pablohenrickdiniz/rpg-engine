/**
 * Created by Pablo Henrick on 24/08/2016.
 */
(function (root) {
    if (root.System == undefined) {
        throw "UI_Document requires System"
    }

    if (root.Canvas == undefined) {
        throw "UI_Document requires Viewport"
    }

    var viewport = root.Canvas,
        system = root.System;

    var hover = false;

    /**
     *
     * @type {{contents: Array, left: number, top: number, width: number, height: number, realLeft: number, realTop: number, absoluteLeft: number, absoluteTop: number, realWidth: number, realHeight: number, borderWidth: number, scrollTop: number, scrollLeft: number, padding: number, visible: boolean, scrolling_data: {element: null, startX: number, startY: number, sign: number, type: string, scrollTop: number}, changed: {}, ui_states: {}, propagating: Array, mousedown: Function, change: Function, initialize: Function, finalize: Function, add: Function, remove: Function, updateScroll: Function, update: Function, addState: Function, removeState: Function, getStates: Function, resetScrollingData: Function}}
     */
    var Document = {
        contents: [],
        left: 0,
        top: 0,
        width: 600,
        height: 600,
        realLeft: 0,
        realTop: 0,
        absoluteLeft: 0,
        absoluteTop: 0,
        realWidth: 600,
        realHeight: 600,
        borderWidth: 0,
        scrollTop: 0,
        scrollLeft: 0,
        padding: 0,
        containerX:0,
        containerY:0,
        containerWidth:600,
        containerHeight:600,
        visible: true,
        scrolling_data: {
            element: null,
            startX: 0,
            startY: 0,
            sign: 0,
            type: '',
            scrollTop: 0,
            scrollLeft:0,
            scrollbar:''
        },
        changed: {},
        ui_states: {},
        propagating: [],
        mousedown: function (x, y) {

        },
        /**
         *
         * @param type
         * @param level
         * @param element
         */
        change: function (type, level, element) {
            var self = this;
            if (self.changed[type] == undefined) {
                self.changed[type] = {};
            }

            if (self.changed[type][level] == undefined) {
                self.changed[type][level] = [];
            }
            self.changed[type][level].push(element);
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
        /**
         *
         * @param element
         */
        add: function (element) {
            var self = this;
            if (self.contents.indexOf(element) == -1) {
                self.contents.push(element);
            }
        },
        /**
         *
         * @param element
         */
        remove: function (element) {
            var self = this;
            var index = self.contents.indexOf(element);
            if (index != -1) {
                self.contents.splice(index, 1);
            }
        },
        updateScroll: function () {
            var self = this;
            var Mouse = root.Controls.Mouse;
            if (Mouse.left) {
                if (self.scrolling_data.element != null) {
                    scroll(self.scrolling_data);
                }
            }
        },
        update: function () {
            var self = this;
            self.updateScroll();
            var i;
            var j;
            var layer = null;
            var types = Object.keys(self.changed);
            var layers = [];
            var lengthA = types.length;
            var lengthB;
            var layerIndex;
            var type;

            for (i = 0; i < lengthA; i++) {
                type = types[i];
                layers = Object.keys(self.changed[type]);
                lengthB = layers.length;
                for(j = 0; j < lengthB;j++){
                    layerIndex = parseInt(layers[j]);
                    layer = viewport.getLayer('UI', layerIndex);
                    var elements = self.changed[type][layerIndex];
                    while(elements.length > 0){
                        var el = elements.pop();
                        el.clear(layer, viewport);
                        el.update(layer, viewport);
                        switch(type){
                            case 'all':
                                fire_update(el.contents,layerIndex+1);
                                break;
                        }
                    }
                }
            }
        },
        /**
         *
         * @param state
         * @param ui_element
         */
        addState: function (state, ui_element) {
            var self = this;
            if (self.ui_states[state] == undefined) {
                self.ui_states[state] = [];
            }
            if (self.ui_states[state].indexOf(ui_element) == -1) {
                self.ui_states[state].push(ui_element);
            }
        },
        /**
         * @param state
         * @param ui_element
         * @returns {*}
         */
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
        /**
         * @param state
         * @returns {*}
         */
        getStates: function (state) {
            var self = this;
            if (self.ui_states[state] != undefined) {
                return self.ui_states[state];
            }

            return [];
        },
        resetScrollingData: function () {
            var self = this;
            self.scrolling_data.element = null;
            self.scrolling_data.sign = 0;
            self.scrolling_data.type = '';
            self.scrolling_data.scrollTop = 0;
            self.scrolling_data.startX = 0;
            self.scrolling_data.startY = 0;
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


    var get_tree = function(element,levels){
        levels = levels || [];
        var contents = element.contents;
        var length = contents.length;
        if(length > 0){
            levels.unshift(contents);
            for(var i =0; i < length;i++){
                get_tree(contents[i],levels);
            }
        }
        return levels;
    };

    /**
     *
     * @param x
     * @param y
     * @returns {{contents: Array, left: number, top: number, width: number, height: number, realLeft: number, realTop: number, absoluteLeft: number, absoluteTop: number, realWidth: number, realHeight: number, borderWidth: number, scrollTop: number, scrollLeft: number, padding: number, visible: boolean, scrolling_data: {element: null, startX: number, startY: number, sign: number, type: string, scrollTop: number}, changed: {}, ui_states: {}, propagating: Array, mousedown: Function, change: Function, initialize: Function, finalize: Function, add: Function, remove: Function, updateScroll: Function, update: Function, addState: Function, removeState: Function, getStates: Function, resetScrollingData: Function}}
     */
    var retrieve_element = function (x, y) {
        var levels = get_tree(Document);
        var keysA = Object.keys(levels);
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
            keysB = Object.keys(levels[level]);
            lengthB = keysB.length;
            for (kB = 0; kB < lengthB; kB++) {
                id = keysB[kB];
                el = levels[level][id];
                var bounds = el.visibleBounds;
                if (inside_bounds(x, y, body.x, body.y, body.width, body.height)) {
                    return el;
                }

            }
        }
        return Document;
    };

    /**
     *
     * @param mx
     * @param my
     * @param bx
     * @param by
     * @param bWidth
     * @param bHeight
     * @returns {boolean}
     */
    var inside_bounds = function (mx, my, bx, by, bWidth, bHeight) {
        return mx >= bx && mx <= bx + bWidth && my >= by && my <= by + bHeight;
    };

    /**
     *
     * @param x
     * @param y
     */
    var mousemove = function (x, y) {
        if (!Document.propagating['hover']) {
            Document.propagating['hover'] = true;
            var element = retrieve_element(x, y);
            if (element != null) {
                var ui_states = Document.getStates('hover');
                var propagated = propagate('hover', element, [x, y]);
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
                for (i = 0; i < length; i++) {
                    Document.addState('hover', propagated[i]);
                }
            }
        }
    };
    /**
     *
     * @param el
     * @param x
     * @param y
     */
    var check_element_scroll = function (el, x, y) {
        var sign = 0;
        var scrollbar = '';

        if (collide_scroll_up(el, x, y)) {
            sign = -1;
            scrollbar = 'vertical';
        }
        else if (collide_scroll_down(el, x, y)) {
            sign = 1;
            scrollbar = 'vertical';
        }
        else if (collide_vertical_scrollbar(el, x, y)) {
            scrollbar = 'vertical';
            sign = 2;
        }
        else if(collide_scroll_left(el,x,y)){
            sign = -1;
            scrollbar = 'horizontal';
        }
        else if(collide_scroll_right(el,x,y)){
            sign = 1;
            scrollbar = 'horizontal';
        }
        else if(collide_horizontal_scrollbar(el,x,y)){
            sign = 2;
            scrollbar = 'horizontal';
        }

        if (sign != 0) {
            Document.scrolling_data.element = el;
            Document.scrolling_data.scrollbar = scrollbar;
            switch (sign) {
                case -1:
                case 1:
                    Document.scrolling_data.sign = sign;
                    Document.scrolling_data.type = 'button';
                    break;
                case 2:
                    Document.scrolling_data.startX = x;
                    Document.scrolling_data.startY = y;
                    Document.scrolling_data.type = 'drag';
                    switch(scrollbar){
                        case 'vertical':
                            Document.scrolling_data.scrollTop = el.scrollTop;
                            break;
                        case 'horizontal':
                            Document.scrolling_data.scrollLeft = el.scrollLeft;
                    }

                    break;
            }
        }
    };
    /**
     *
     * @param x
     * @param y
     */
    var mouseup = function (x, y) {
        if (!Document.propagating['mouseup']) {
            Document.propagating['mouseup'] = true;
            Document.resetScrollingData();
            var element = retrieve_element(x, y);
            if (element != null) {
                propagate('mouseup', element, [x, y]);
            }
        }
    };
    /**
     *
     * @param x
     * @param y
     */
    var mousedown = function (x, y) {
        if (!Document.propagating['mousedown']) {
            Document.propagating['mousedown'] = true;
            var element = retrieve_element(x, y);
            if (element != null) {
                propagate('mousedown', element, [x, y]);
            }
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
    /**
     *
     * @param event
     * @param element
     * @param args
     * @param propagated
     * @returns {*|Array}
     */
    var propagate = function (event, element, args, propagated) {
        propagated = propagated || [];
        args = args || [];
        propagated.push(element);
        switch (event) {
            case 'hover':
                element.hover = true;
                break;
            case 'mousedown':
                check_element_scroll(element, args[0], args[1]);
                element.mousedown(args[0], args[1]);
                break;
        }
        if (element.parent) {
            propagate(event, element.parent, args, propagated);
        }
        else {
            Document.propagating[event] = false;
        }
        return propagated;
    };
    /**
     *
     * @param data
     */
    var scroll = function (data) {
        var self = data.element;

        switch (data.type) {
            case 'button':
                var step = (10 * data.sign);
                switch(data.scrollbar){
                    case 'vertical':
                        self.scrollTop = self.scrollTop + step;
                        break;
                    case 'horizontal':
                        self.scrollLeft = self.scrollLeft + step;
                        break;
                }

                break;
            case 'drag':
                var Mouse = root.Controls.Mouse;
                var step = Mouse.lastY - data.startY;
                switch(data.scrollbar){
                    case 'vertical':
                        var scroll_y = data.scrollTop + step * (self.contentHeight / self.containerHeight);
                        self.scrollTop = scroll_y;
                        break;
                    case 'horizontal':
                        var scroll_x = data.scrollLeft + step * (self.contentWidth / self.containerWidth);
                        self.scrollLeft = scroll_x;
                        break;
                }

                break;
        }
    };


    system.addSteplistener(function () {
        Document.update();
    });
    /**
     *
     * @param el
     * @param x
     * @param y
     * @returns {boolean}
     */
    var collide_scroll_up = function (el, x, y) {
        var sw = el.scrollWidth;
        var sx = el.scrollUpButtonX;
        var sy = el.scrollUpButtonY;
        return x >= sx && x <= sx + sw && y >= sy && y <= sy + sw;
    };
    /**
     *
     * @param el
     * @param x
     * @param y
     * @returns {boolean}
     */
    var collide_scroll_down = function (el, x, y) {
        var sw = el.scrollWidth;
        var sx = el.scrollDownButtonX;
        var sy = el.scrollDownButtonY;
        return x >= sx && x <= sx+sw && y >= sy && y <= sy+sw;
    };

    /**
     *
     * @param el
     * @param x
     * @param y
     * @returns {boolean}
     */
    var collide_scroll_left = function (el, x, y) {
        var sw = el.scrollWidth;
        var sx = el.scrollLeftButtonX;
        var sy = el.scrollLeftButtonY;
        return x >= sx && x <= sx + sw && y >= sy && y <= sy + sw;
    };
    /**
     *
     * @param el
     * @param x
     * @param y
     * @returns {boolean}
     */
    var collide_scroll_right = function (el, x, y) {
        var sw = el.scrollWidth;
        var sx = el.scrollRightButtonX;
        var sy = el.scrollRightButtonY;

        return x >= sx && x <= sx + sw && y >= sy && y <= sy + sw;
    };

    /**
     *
     * @param el
     * @param x
     * @param y
     * @returns {boolean}
     */
    var collide_vertical_scrollbar = function (el, x, y) {
        var sw = el.scrollWidth;
        var sh = el.railHeight;
        var rail_y = el.absoluteTop + sw;
        var content_height = el.contentHeight;
        var sx = el.scrollUpButtonX;
        var sy = rail_y + sh * (el.scrollTop / content_height);
        return x >= sx && x <= sx + sw && y >= sy && y <= sy + sh;
    };

    /**
     *
     * @param el
     * @param x
     * @param y
     * @returns {boolean}
     */
    var collide_horizontal_scrollbar = function (el, x, y) {
        var sw = el.railWidth;
        var sh = el.scrollWidth;
        var rail_x = el.absoluteLeft + sw;
        var content_width = el.contentWidth;
        var sy = el.scrollLeftButtonY;
        var sx = rail_x + sh * (el.scrollLeft / content_width);
        return x >= sx && x <= sx + sw && y >= sy && y <= sy + sh;
    };

    /**
     *
     * @param elements
     * @param index
     */
    var fire_update = function(elements,index){
        var length = elements.length;
        var layer = viewport.getLayer('UI', index);

        for(var i =0; i < length;i++){
            var el = elements[i];
            el.update(layer, viewport);
            fire_update(el.contents,index+1);
        }
    };

    root.Document = Document;
})(RPG);