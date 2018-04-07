(function (root) {
    if (root.Document == undefined) {
        throw "UI_Element requires Document"
    }

    var document = root.Document;

    var ID = 0;
    const TRANSPARENT_REG = /^\s*transparent\s*|rgba\((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\s*,\s*0\s*\)\s*$/;
    var prop_implies = {
        'width':{
            'self':['realWidth']
        },
        'height':{
            'self':['realHeight']
        },
        'realWidth':{
            'self':['containerWidth','realLeft','scrollRightButtonX','scrollUpButtonX','scrollDownButtonX','railWidth','horizontalScrollActive','visibleBoundsWidth'],
            'children':['realWidth','realLeft']
        },
        realHeight:{
            'self':['containerHeight','realTop','scrollLeftButtonY','scrollRightButtonY','scrollDownButtonY','railHeight','verticalScrollActive','visibleBoundsHeight'],
            'children':['realHeight','realTop']
        },
        'padding':{
            'self':['containerWidth','containerHeight','containerX','containerY','verticalScrollActive','horizontalScrollActive'],
            'children':['absoluteLeft','absoluteTop']
        },
        'verticalScrollActive':{
            'self':['containerWidth']
        },
        'horizontalScrollActive':{
            'self':['containerHeight']
        },
        'left':{
            'self':['realLeft']
        },
        'top':{
            'self':['realTop']
        },
        'horizontalAlign':{
            'self':['realLeft']
        },
        'verticalAlign':{
            'self':['realTop']
        },
        'absoluteLeft':{
            'self':['containerX','scrollLeftButtonX','scrollRightButtonX','scrollUpButtonX','scrollDownButtonX','visibleBoundsX','visibleBoundsWidth'],
            'children':['absoluteLeft']
        },
        'absoluteTop':{
            'self':['containerY', 'scrollLeftButtonY','scrollRightButtonY','scrollUpButtonY','scrollDownButtonY','visibleBoundsY','visibleBoundsHeight'],
            'children':['absoluteTop']
        },
        'scrollLeft':{
            'children':['absoluteLeft']
        },
        'scrollTop':{
            'children':['absoluteTop']
        },
        'realLeft':{
            'self':['absoluteLeft']
        },
        'realTop':{
            'self':['absoluteTop']
        },
        'level':{
            'children':['level']
        },
        'scrollWidth':{
            'self':['scrollLeftButtonX','scrollLeftButtonY','scrollRightButtonX', 'scrollRightButtonY','scrollUpButtonX','scrollUpButtonY','scrollDownButtonX','scrollDownButtonY','railWidth','railHeight']
        },
        'contentHeight': {
            'self': ['maxScrollTop','verticalScrollActive']
        },
        'contentWidth':{
            'self': ['maxScrollLeft','horizontalScrollActive']
        },
        'containerHeight':{
            'self':['maxScrollTop'],
            'children':['visibleBoundsHeight']
        },
        'containerWidth':{
            'self':['maxScrollLeft'],
            'children':['visibleBoundsWidth']
        },
        'scrollableX':{
            'self':['horizontalScrollActive']
        },
        'scrollableY':{
            'self':['verticalScrollActive']
        },
        'containerX':{
            'children':['visibleBoundsX','visibleBoundsWidth']
        },
        'containerY':{
            'children':['visibleBoundsY','visibleBoundsHeight']
        },
        'visibleBoundsX':{
            'self':['visibleBounds']
        },
        'visibleBoundsY':{
            'self':['visibleBounds']
        },
        'visibleBoundsWidth':{
            'self':['visibleBounds']
        },
        'visibleBoundsHeight':{
            'self':['visibleBounds']
        }
    };




    /**
     *
     * @param parent
     * @param options
     * @constructor
     */
    var UI_Element = function (parent, options) {
        var self = this;
        options = options || {};
        self.listeners = {};
        self.contents = [];
        self.id = ID;
        ID++;
        initialize(self);
        self.name = options.name || '';
        self.left = options.left || 0;
        self.top = options.top || 0;
        self.verticalAlign = options.verticalAlign || null;
        self.horizontalAlign = options.horizontalAlign || null;
        self.width = options.width || 0;
        self.height = options.height || 0;
        self.padding = options.padding || 0;
        self.backgroundOpacity = options.backgroundOpacity || 100;
        self.borderOpacity = options.borderOpacity || 100;
        self.backgroundColor = options.backgroundColor || '#f1f1f1';
        self.borderColor = options.borderColor || 'yellow';
        self.borderWidth = options.borderWidth || 0;
        self.borderStyle = options.borderStyle || 'rounded';
        self.visible = options.visible || false;
        self.scrollLeft = options.scrollLeft || 0;
        self.scrollTop = options.scrollTop || 0;
        self.scrollWidth = options.scrollWidth || 20;
        self.scrollHeight = 0;
        self.draggable = false;
        self.overflow = 'hidden';
        self.scrollableX = options.scrollableX || false;
        self.scrollableY = options.scrollableY || false;
        self.type = 'Element';
        self.scrolling = 0;
        self.scrollingStart = null;
        self.scrollTime = options.scrollTime || 1000;
        self.scrollStep = options.scrollStep || 100;
        self.startScrollTop = self.scrollTop;
        self.parent = parent || document;
        self.initialized = true;
         UI_Element.fire_change('all', self);
    };


    UI_Element.prototype.add = function (element) {
        var self = this;
        if (element instanceof UI_Element && self.contents.indexOf(element) == -1) {
            element.parent = self;
            element.index = self.contents.length;
            self.contents.push(element);
        }
        return self;
    };


    UI_Element.prototype.lastItem = function () {
        var self = this;
        if (self.contents.length > 0) {
            return self.contents[self.contents.length - 1];
        }
        return null;
    };

    /**
     *
     * @param element
     * @returns {UI_Element}
     */
    UI_Element.prototype.remove = function (element) {
        var self = this;
        if (element != undefined) {
            var index = self.contents.indexOf(element);
            if (index != -1) {
                element.parent = null;
                element.index = null;
                self.contents.splice(index, 1);
                var length = self.contents.length;
                var i;
                for (i = index; i < length; i++) {
                    self.contents[i].index = i;
                }
            }
        }
        else {
            self.parent.remove(self);
        }
        return self;
    };

    UI_Element.prototype.addEventListener = function (name, callback) {
        var self = this;
        if (self.listeners[name] == undefined) {
            self.listeners[name] = [];
        }

        self.listeners[name].push(callback);
        return self;
    };

    UI_Element.prototype.removeEventListener = function (name, callback) {
        var self = this;
        if (self.listeners[name] != undefined) {
            var index = self.listeners[name].indexOf(callback);
            if (index != -1) {
                self.listeners[name].splice(index, 1);
            }
        }
        return self;
    };

    UI_Element.prototype.show = function () {
        var self = this;
        self.visible = true;
        return self;
    };

    UI_Element.prototype.hide = function () {
        var self = this;
        self.visible = false;
        return self;
    };

    var initialize = function (self) {
        //FIXED VARS
        var width = [100];
        var height = [100];
        var opacity = [50];
        var left = 0;
        var top = 0;
        var padding = [0];
        var backgroundColor = ['transparent'];
        var borderColor = ['yellow'];
        var borderWidth = [2];
        var borderStyle = ['rounded'];
        var visible = [true];
        var draggable = ['draggable'];
        var parent = null;
        var state = 0;
        var cursor = ['default'];
        var backgroundOpacity = [100];
        var horizontalAlign = [null];
        var verticalAlign = [null];
        var scrollableX = false;
        var scrollableY = false;
        var scrollLeft = 0;
        var scrollTop = 0;
        var scrollWidth = 15;
        var scrollHeight = 0;
        var index = 0;


        //SIZE
        //SIZE VARS
        var realWidth = null;       //self.width,parent.realWidth
        var realHeight = null;      //self.height,parent.realHeight
        var containerWidth = null;  //self.realWidth,self.padding,self.verticalScrollActive
        var containerHeight = null; //self.realHeight,self.padding,self.horizontalScrollActive


        Object.defineProperty(self, 'realWidth', {
            get: function () {
                if (realWidth == null) {
                    realWidth = calc_size(self.width, parent ? parent.realWidth : 0);
                }
                return realWidth;
            },
            set: function (rw) {
                if (!rw) {
                    realWidth = null;
                    UI_Element.uncache(self,'realWidth');
                }
            }
        });

        Object.defineProperty(self, 'realHeight', {
            get: function () {
                if (realHeight == null) {
                    realHeight = calc_size(self.height, parent ? parent.realHeight : 0);
                }
                return realHeight;
            },
            set: function (rh) {
                if (!rh) {
                    realHeight = null;
                    UI_Element.uncache(self,'realHeight');
                }
            }
        });

        Object.defineProperty(self, 'containerWidth', {
            get: function () {
                if (containerWidth == null) {
                    containerWidth = self.realWidth - self.padding * 2 - (self.verticalScrollActive ? scrollWidth : 0);
                }
                return containerWidth;
            },
            set: function (cw) {
                if (!cw) {
                    containerWidth = null;
                    UI_Element.uncache(self,'containerWidth');
                }
            }
        });

        Object.defineProperty(self, 'containerHeight', {
            get: function () {
                if (containerHeight == null) {
                    containerHeight = self.realHeight - self.padding * 2 - (self.horizontalScrollActive ? scrollWidth : 0);
                }
                return containerHeight;
            },
            set: function (ch) {
                if (!ch) {
                    containerHeight = null;
                    UI_Element.uncache(self,'containerHeight');
                }
            }
        });


        //POSITION
        //POSITION VARS
        var realLeft = null;     //self.left,self.horizontalAlign,parent.realWidth,self.realWidth
        var realTop = null;      //self.top,self.verticalAlign,parent.realHeight,self.realHeight
        var absoluteLeft = null; //parent.absoluteLeft,parent.padding,parent.scrollLeft,self.realLeft
        var absoluteTop = null;  //parent.absoluteTop, parent.padding,parent.scrollTop,self.realTop
        var containerX = null;   //self.absoluteLeft,self.padding;
        var containerY = null;   //self.absoluteTop,self.padding;
        var level = null;        //parent.level

        //POSITION VARS CACHED
        Object.defineProperty(self, 'realLeft', {
            get: function () {
                if (realLeft == null) {
                    var sum = 0;
                    var ha = horizontalAlign[state] || horizontalAlign[0];
                    var l = calc_size(self.left, parent ? parent.realWidth : 0);

                    if (ha != null) {
                        sum = calculate_align(ha, self.realWidth, parent ? parent.realWidth : 0);
                    }

                    realLeft = l + sum;
                }
                return realLeft;
            },
            set: function (rl) {
                if (!rl) {
                    realLeft = null;
                    UI_Element.uncache(self,'realLeft');
                }
            }
        });

        Object.defineProperty(self, 'realTop', {
            get: function () {
                if (realTop == null) {
                    var sum = 0;
                    var va = verticalAlign[state] || verticalAlign[0];
                    var t = calc_size(self.top, parent ? parent.realHeight : 0);


                    if (va != null) {
                        sum = calculate_align(va, self.realHeight, parent ? parent.realHeight : 0);
                    }


                    realTop = t + sum;
                }
                return realTop;
            },
            set: function (rt) {
                if (!rt) {
                    realTop = null;
                    UI_Element.uncache(self,'realTop');
                }
            }
        });

        Object.defineProperty(self, 'absoluteLeft', {
            get: function () {
                if (absoluteLeft == null) {
                    var parent = self.parent;
                    var sum = 0;
                    if (parent != null) {
                        sum += parent.absoluteLeft + parent.padding - parent.scrollLeft;
                    }
                    absoluteLeft = self.realLeft + sum;
                }
                return absoluteLeft;
            },
            set: function (al) {
                if (!al) {
                    absoluteLeft = null;
                    UI_Element.uncache(self,'absoluteLeft');
                }
            }
        });

        Object.defineProperty(self, 'absoluteTop', {
            get: function () {
                if (absoluteTop == null) {
                    var parent = self.parent;
                    var sum = 0;
                    if (parent != null) {
                        sum += parent.absoluteTop + parent.padding - parent.scrollTop;
                    }
                    absoluteTop = self.realTop + sum;
                }
                return absoluteTop;
            },
            set: function (at) {
                if (!at) {
                    absoluteTop = null;
                    UI_Element.uncache(self,'absoluteTop');
                }
            }
        });

        Object.defineProperty(self, 'index', {
            get: function () {
                return index;
            },
            set: function (i) {
                if (i != index) {
                    index = i;
                     UI_Element.fire_change('all', self);
                }
            }
        });


        Object.defineProperty(self, 'horizontalAlign', {
            get: function () {
                return horizontalAlign[state] || horizontalAlign[0];
            },
            set: function (ha) {
                if (ha != horizontalAlign[state]) {
                    horizontalAlign[state] = ha;
                    UI_Element.uncache(self, 'horizontalAlign');
                     UI_Element.fire_change('all', self);
                }
            }
        });


        Object.defineProperty(self, 'verticalAlign', {
            get: function () {
                return verticalAlign[state] || verticalAlign[0];
            },
            set: function (va) {
                if (va != verticalAlign[state]) {
                    verticalAlign[state] = va;
                    UI_Element.uncache(self, 'verticalAlign');
                     UI_Element.fire_change('all', self);
                }
            }
        });


        Object.defineProperty(self, 'containerX', {
            get: function () {
                if (containerX == null) {
                    containerX = self.absoluteLeft + self.padding;
                }
                return containerX;
            },
            set: function (cx) {
                if (!cx) {
                    containerX = null;
                    UI_Element.uncache(self,'containerX');
                }
            }
        });


        Object.defineProperty(self, 'containerY', {
            get: function () {
                if (containerY == null) {
                    containerY = self.absoluteTop + self.padding;
                }
                return containerY;
            },
            set:function(cy){
                if(!cy){
                    containerY = null;
                    UI_Element.uncache(self,'containerY');
                }
            }
        });


        //set if element can appear on screen
        Object.defineProperty(self, 'visible', {
            get: function () {
                return (visible[state] || visible[0]) && (parent ? parent.visible : true);
            },
            set: function (v) {
                if (v != visible[state]) {
                    visible[state] = v;
                     UI_Element.fire_change('all', self);
                }
            }
        });

        //Checks if element is visible on screen
        //returns boolean;
        Object.defineProperty(self, 'visibleOnScreen', {
            get: function () {
                var xa = self.absoluteLeft;
                var ya = self.absoluteTop;
                var wa = self.realWidth;
                var ha = self.realHeight;
                var xb = parent ? parent.containerX : 0;
                var yb = parent ? parent.containerY : 0;
                var wb = parent ? parent.containerWidth : 0;
                var hb = parent ? parent.containerHeight : 0;
                return collide_bounds(xa, ya, wa, ha, xb, yb, wb, hb);
            }
        });

        Object.defineProperty(self, 'level', {
            get: function () {
                if (level == null) {
                    if (self.parent instanceof  UI_Element) {
                        level = self.parent.level + 1;
                    }
                    else {
                        level = 0;
                    }
                }
                return level;
            }
        });

        Object.defineProperty(self, 'width', {
            get: function () {
                return width[state] || width[0];
            },
            set: function (w) {
                if (w != width[state]) {
                    width[state] = w;
                    UI_Element.uncache(self,'width');
                     UI_Element.fire_change('all', self);
                }
            }
        });

        Object.defineProperty(self, 'height', {
            get: function () {
                return height[state] || height[0];
            },
            set: function (h) {
                if (h != height[state]) {
                    height[state] = h;
                    UI_Element.uncache(self,'height');
                     UI_Element.fire_change('all', self);
                }
            }
        });


        Object.defineProperty(self, 'padding', {
            get: function () {
                return padding[state] || padding[0];
            },
            set: function (pad) {
                if (pad != padding[state]) {
                    padding[state] = pad;
                    UI_Element.uncache(self,'padding');
                     UI_Element.fire_change('all', self);
                }
            }
        });

        Object.defineProperty(self, 'left', {
            get: function () {
                return left;
            },
            set: function (l) {
                if (l != left[state]) {
                    left = l;
                    UI_Element.uncache(self,'left');
                     UI_Element.fire_change('all', self);
                }
            }
        });

        Object.defineProperty(self, 'top', {
            get: function () {
                return top;
            },
            set: function (t) {
                if (t != top[state]) {
                    top = t;
                    UI_Element.uncache(self,'top');
                     UI_Element.fire_change('all', self);
                }
            }
        });

        Object.defineProperty(self, 'borderWidth', {
            get: function () {
                return borderWidth[state] || borderWidth[0];
            },
            set: function (bw) {
                if (bw != borderWidth[state]) {
                    borderWidth[state] = bw;
                     UI_Element.fire_change('self', self);
                }
            }
        });

        Object.defineProperty(self, 'opacity', {
            get: function () {
                return opacity[state] || opacity[0];
            },
            set: function (o) {
                if (o != opacity[state]) {
                    opacity[state] = o;
                     UI_Element.fire_change('self', self);
                }
            }
        });

        Object.defineProperty(self, 'backgroundColor', {
            get: function () {
                return backgroundColor[state] || backgroundColor[0];
            },
            set: function (bc) {
                if (bc != backgroundColor[state]) {
                    backgroundColor[state] = bc;
                    if (self.backgroundColor[state].constructor == {}.constructor) {
                        switch (backgroundColor[state].type) {
                            case 'linearGradient':
                                Object.defineProperty(backgroundColor[state], 'x0', {
                                    get: function () {
                                        return self.absoluteLeft;
                                    }
                                });

                                Object.defineProperty(backgroundColor[state], 'y0', {
                                    get: function () {
                                        return self.absoluteTop;
                                    }
                                });

                                Object.defineProperty(backgroundColo[state], 'x1', {
                                    get: function () {
                                        return self.absoluteLeft + self.width;
                                    }
                                });

                                Object.defineProperty(backgroundColor[state], 'y1', {
                                    get: function () {
                                        return self.absoluteTop + self.height;
                                    }
                                });
                        }
                    }
                     UI_Element.fire_change('self', self);
                }
            }
        });

        Object.defineProperty(self, 'backgroundOpacity', {
            get: function () {
                return backgroundOpacity[state] || backgroundOpacity[0];
            },
            set: function (bo) {
                if (bo != backgroundOpacity[state]) {
                    backgroundOpacity[state] = bo;
                     UI_Element.fire_change('self', self);
                }
            }
        });

        Object.defineProperty(self, 'borderColor', {
            get: function () {
                return borderColor[state] || borderColor[0];
            },
            set: function (bc) {
                if (bc != borderColor[state]) {
                    borderColor[state] = bc;
                     UI_Element.fire_change('self', self);
                }
            }
        });

        Object.defineProperty(self, 'borderStyle', {
            get: function () {
                return borderStyle[state] || borderStyle[0];
            },
            set: function (bs) {
                if (bs != borderStyle[state]) {
                    borderStyle[state] = bs;
                     UI_Element.fire_change('self', self);
                }
            }
        });


        Object.defineProperty(self, 'draggable', {
            get: function () {
                return draggable[state] || draggable[0];
            },
            set: function (d) {
                if (d != draggable[state]) {
                    draggable[state] = d;
                }
            }
        });


        Object.defineProperty(self, 'parent', {
            get: function () {
                return parent;
            },
            set: function (p) {
                if (p != parent) {
                    if (parent != null) {
                        parent.remove(self);
                    }
                    parent = p;
                    if (parent != null) {
                        parent.add(self);
                    }
                }
            }
        });

        Object.defineProperty(self, 'hover', {
            get: function () {
                return state == 1;
            },
            set: function (h) {
                if (h) {
                    self.state = 1;
                }
                else {
                    self.state = 0;
                }
            }
        });

        Object.defineProperty(self, 'state', {
            get: function () {
                return state;
            },
            set: function (s) {
                if (s != state) {
                    state = s;
                     UI_Element.fire_change('all', self);
                }
            }
        });

        Object.defineProperty(self, 'cursor', {
            get: function () {
                return cursor[state] || cursor[0];
            },
            set: function (c) {
                if (c != cursor[state]) {
                    cursor[state] = c;
                     UI_Element.fire_change('self', self);
                }
            }
        });


        //SCROLL
        //SCROLL VARS
        var scrollLeftButtonX = null; //self.absoluteLeft,self.scrollWidth
        var scrollLeftButtonY = null; //self.absoluteTop,self.realHeight,self.scrollWidth
        var scrollRightButtonX = null;//self.absoluteLeft,self.realWidth,self.scrollWidth
        var scrollRightButtonY = null;//self.absoluteTop,self.realHeight,self.scrollWidth
        var scrollUpButtonX = null;    //self.absoluteLeft,self.realWidth,self.scrollWidth;
        var scrollUpButtonY = null;   //self.absoluteTop,self.scrollWidth;
        var scrollDownButtonX = null; //self.absoluteLeft,self.realWidth,self.scrollWidth
        var scrollDownButtonY = null; //self.absoluteTop,self.realHeight,self.scrollWidth
        var railWidth = null;         //self.realWidth,self.scrollWidth
        var railHeight = null;        //self.realHeight,self.scrollWidth
        var maxScrollTop = null;      //self.contentHeight,self.containerHeight
        var maxScrollLeft = null;     //self.contentWidth,self.containerWidth;
        var verticalScrollActive = null; //self.scrollableY,self.contentHeight,self.realHeight,self.padding
        var horizontalScrollActive = null;//self.scrollableX,self.contentWidth,self.realWidth, self.padding


        //SCROLL CACHE
        Object.defineProperty(self, 'scrollLeftButtonX', {
            get: function () {
                if(scrollLeftButtonX == null){
                    scrollLeftButtonX = self.absoluteLeft + scrollWidth;
                }
                return scrollLeftButtonX;
            },
            set:function(slbx){
                if(!slbx){
                    scrollLeftButtonX = null;
                    UI_Element.uncache(self,'scrollLeftButtonX')
                }
            }
        });

        Object.defineProperty(self, 'scrollLeftButtonY', {
            get: function () {
                if(scrollLeftButtonY == null){
                    scrollLeftButtonY = self.absoluteTop + self.realHeight - self.scrollWidth;
                }
                return scrollLeftButtonY;
            },
            set:function(slby){
                if(!slby){
                    scrollLeftButtonY = null;
                    UI_Element.uncache(self,'scrollLeftButtonY')
                }
            }
        });

        Object.defineProperty(self, 'scrollRightButtonX', {
            get: function () {
                if(scrollRightButtonX == null){
                    scrollRightButtonX = self.absoluteLeft + self.realWidth - self.scrollWidth * 2;
                }
                return scrollRightButtonX;
            },
            set:function(srbx){
                if(!srbx){
                    scrollRightButtonX = null;
                    UI_Element.uncache(self,'scrollRightButtonX')
                }
            }
        });

        Object.defineProperty(self, 'scrollRightButtonY', {
            get: function () {
                if(scrollRightButtonY == null){
                    scrollRightButtonY = self.absoluteTop + self.realHeight - self.scrollWidth;
                }
                return scrollRightButtonY;
            },
            set:function(srby){
                if(!srby){
                    scrollRightButtonY = null;
                    UI_Element.uncache(self,'scrollRightButtonY')
                }
            }
        });

        Object.defineProperty(self, 'scrollUpButtonX', {
            get: function () {
                if(scrollUpButtonX == null){
                    scrollUpButtonX = self.absoluteLeft + self.realWidth - self.scrollWidth;
                }
                return scrollUpButtonX;
            },
            set:function(subx){
                if(!subx){
                    scrollUpButtonX = null;
                    UI_Element.uncache(self,'scrollUpButtonX')
                }
            }
        });

        Object.defineProperty(self, 'scrollUpButtonY', {
            get: function () {
                if(scrollUpButtonY == null){
                    scrollUpButtonY = self.absoluteTop + self.scrollWidth;
                }
                return scrollUpButtonY;
            },
            set:function(suby){
                if(!suby){
                    scrollUpButtonY = null;
                    UI_Element.uncache(self,'scrollUpButtonY')
                }
            }
        });

        Object.defineProperty(self, 'scrollDownButtonX', {
            get: function () {
                if(scrollDownButtonX == null){
                    scrollDownButtonX = self.absoluteLeft + self.realWidth - self.scrollWidth;
                }
                return scrollDownButtonX;
            },
            set:function(sdbx){
                if(!sdbx){
                    scrollDownButtonX = null;
                    UI_Element.uncache(self,'scrollDownButtonX')
                }
            }
        });

        Object.defineProperty(self, 'scrollDownButtonY', {
            get: function () {
                if(scrollDownButtonY == null){
                    scrollDownButtonY = self.absoluteTop + self.realHeight - self.scrollWidth * 2;
                }
                return scrollDownButtonY;
            },
            set:function(sdby){
                if(!sdby){
                    scrollDownButtonY = null;
                    UI_Element.uncache(self,'scrollDownButtonY')
                }
            }
        });

        Object.defineProperty(self, 'railWidth', {
            get: function () {
                if(railWidth == null){
                    railWidth = self.realWidth - self.scrollWidth * 4;
                }
                return railWidth;
            },
            set:function(rw){
                if(!rw){
                    railWidth = null;
                    UI_Element.uncache(self,'railWidth');
                }
            }
        });

        Object.defineProperty(self, 'railHeight', {
            get: function () {
                if(railHeight == null){
                    railHeight = self.realHeight - self.scrollWidth * 4;
                }
                return railHeight;
            },
            set:function(rh){
                if(!rh){
                    railHeight = null;
                    UI_Element.uncache(self,'railHeight');
                }
            }
        });


        Object.defineProperty(self, 'maxScrollTop', {
            get: function () {
                if(maxScrollTop == null){
                    maxScrollTop = self.contentHeight - self.containerHeight;
                }
                return maxScrollTop;
            },
            set:function(mst){
                if(!mst){
                    maxScrollTop = null;
                    UI_Element.uncache(self,'maxScrollTop');
                }
            }
        });

        Object.defineProperty(self, 'maxScrollLeft', {
            get: function () {
                if(maxScrollLeft == null){
                    maxScrollLeft = self.contentWidth - self.containerWidth;
                }
                return maxScrollLeft;
            },
            set:function(msl){
                if(!msl){
                    maxScrollLeft = null;
                    UI_Element.uncache(self,'maxScrollLeft');
                }
            }
        });

        Object.defineProperty(self, 'verticalScrollActive', {
            get: function () {
                if(verticalScrollActive == null){
                    verticalScrollActive = scrollableY && self.contentHeight > (self.realHeight - self.padding * 2);
                }
                return verticalScrollActive;
            },
            set:function(vsa){
                if(!vsa){
                    verticalScrollActive = null;
                    UI_Element.uncache(self,'verticalScrollActive');
                }
            }
        });

        Object.defineProperty(self, 'horizontalScrollActive', {
            get: function () {
                if(horizontalScrollActive == null){
                    horizontalScrollActive = scrollableX && self.contentWidth > (self.realWidth - self.padding * 2);
                }
                return horizontalScrollActive;
            },
            set:function(hsa){
                if(!hsa){
                    horizontalScrollActive = null;
                    UI_Element.uncache(self,'horizontalScrollActive');
                }
            }
        });

        //SCROLL FIXED VARS
        Object.defineProperty(self, 'scrollableX', {
            get: function () {
                return scrollableX;
            },
            set: function (s) {
                if (s != scrollableX) {
                    scrollableX = s;
                    UI_Element.uncache(self,'scrollableX');
                     UI_Element.fire_change('self', self);
                }
            }
        });

        Object.defineProperty(self, 'scrollableY', {
            get: function () {
                return scrollableY;
            },
            set: function (s) {
                if (s != scrollableY) {
                    scrollableY = s;
                    UI_Element.uncache(self,'scrollableY');
                     UI_Element.fire_change('self', self);
                }
            }
        });


        Object.defineProperty(self, 'scrollLeft', {
            get: function () {
                if (scrollableX) {
                    return scrollLeft;
                }
                return 0;
            },
            set: function (sl) {
                if (sl != scrollLeft) {
                    var max = self.maxScrollLeft;
                    if (sl < 0) {
                        sl = 0;
                    }
                    else if (sl > max) {
                        sl = max;
                    }

                    scrollLeft = sl;
                    UI_Element.uncache(self,'scrollLeft');
                     UI_Element.fire_change('all', self);
                }
            }
        });

        Object.defineProperty(self, 'scrollTop', {
            get: function () {
                if (scrollableY) {
                    return scrollTop;
                }
                return 0;
            },
            set: function (st) {
                if (st != scrollTop) {
                    var max = self.maxScrollTop;
                    if (st < 0) {
                        st = 0;
                    }
                    else if (st > max) {
                        st = max;
                    }

                    scrollTop = st;
                    UI_Element.uncache(self,'scrollTop');
                     UI_Element.fire_change('all', self);
                }
            }
        });

        Object.defineProperty(self, 'scrollWidth', {
            get: function () {
                return scrollWidth;
            },
            set: function (sw) {
                if (sw != scrollWidth) {
                    scrollWidth = sw;
                    UI_Element.uncache(self,'scrollWidth');
                     UI_Element.fire_change('self', self);
                }
            }
        });

        Object.defineProperty(self, 'scrollHeight', {
            get: function () {
                return scrollHeight;
            },
            set: function (sh) {
                if (sh != scrollHeight) {
                    scrollHeight = sh;
                    UI_Element.uncache(self,'scrollHeight');
                     UI_Element.fire_change('self', self);
                }
            }
        });


        //BOUND VARS
        var visibleBoundsX = null;      //parent.containerX, self.absoluteLeft
        var visibleBoundsY = null;      //parent.containerY, self.absoluteTop
        var visibleBoundsWidth = null;  //parent.containerWidth, parent.containerX,self.absoluteLeft,self.realWidth
        var visibleBoundsHeight = null; //parent.containerHeight,parent.containerY,self.absoluteTop,self.realHeight
        var visibleBounds = null; //self.visibleBoundsX,self.visibleBoundsY,self.visibleBoundsWidth,self.visibleBoundsHeight

        Object.defineProperty(self, 'visibleBoundsX', {
            get: function () {
                if(visibleBoundsX == null){
                    visibleBoundsX = self.visibleBounds.x;
                }
                return visibleBoundsX;
            },
            set:function(vbx){
                if(!vbx){
                    visibleBoundsX = null;
                    UI_Element.uncache(self,'visibleBoundsX');
                }
            }
        });

        Object.defineProperty(self, 'visibleBoundsY', {
            get: function () {
                if(visibleBoundsY == null){
                    visibleBoundsY = self.visibleBounds.y;
                }
                return visibleBoundsY;
            },
            set:function(vby){
                if(!vby){
                    visibleBoundsY = null;
                    UI_Element.uncache(self,'visibleBoundsY');
                }
            }
        });

        Object.defineProperty(self, 'visibleBoundsWidth', {
            get: function () {
                if(visibleBoundsWidth == null){
                    visibleBoundsWidth = self.visibleBounds.width;
                }
                return visibleBoundsWidth;
            },
            set:function(vbw){
                if(!vbw){
                    visibleBoundsWidth = null;
                    UI_Element.uncache(self,'visibleBoundsWidth');
                }
            }
        });

        Object.defineProperty(self, 'visibleBoundsHeight', {
            get: function () {
                if(visibleBoundsHeight == null){
                    visibleBoundsHeight = self.visibleBounds.height;
                }
                return visibleBoundsHeight;
            },
            set:function(vbh){
                if(!vbh){
                    visibleBoundsHeight = null;
                    UI_Element.uncache(self,'visibleBoundsHeight');
                }
            }
        });

        Object.defineProperty(self, 'visibleBounds', {
            get: function () {
                if(visibleBounds == null){
                    var xb = self.absoluteLeft;
                    var yb = self.absoluteTop;
                    var wb = self.realWidth;
                    var hb = self.realHeight;
                    if(parent){
                        var xa = parent.containerX;
                        var ya = parent.containerY;
                        var wa = parent.containerWidth;
                        var ha = parent.containerHeight;
                        visibleBounds = rect_intersect(xa,ya,wa,ha,xb,yb,wb,hb);
                    }
                    else{
                        visibleBounds = {
                            x:xb,
                            y:yb,
                            width:wb,
                            height:hb
                        };
                    }
                }
                return visibleBounds;
            },
            set:function(vb){
                if(!vb){
                    visibleBounds = null;
                }
            }
        });
    };
    /**
     *
     * @param layer
     */
    UI_Element.prototype.update = function (layer) {
        var self = this;
        if (self.visible && self.visibleOnScreen) {
            var lineWidth = self.borderWidth;
            var self_content_width = self.contentWidth;
            var self_content_height = self.contentHeight;
            var self_container_width = self.containerWidth;
            var self_container_height = self.containerHeight;
            var fillStyle = self.backgroundColor;
            var strokeStyle = self.borderColor;
            var borderOpacity = self.borderOpacity;
            var backgroundOpacity = self.backgroundOpacity;

            var bounds = self.visibleBounds;
            var x = body.x;
            var y = body.y;
            var width = body.width;
            var height = body.height;

            layer.rect({
                x:x,
                y:y,
                width:width,
                height:height,
                lineWidth: lineWidth,
                fillStyle: fillStyle,
                strokeStyle: strokeStyle,
                backgroundOpacity: backgroundOpacity,
                borderOpacity: borderOpacity
            });

            var scrollbar_size = self.scrollWidth;
            var fontSize = scrollbar_size / 1.5;

            //SCROLL VERTICAL
            if (self.scrollableY && self_content_height > self_container_height) {
                var buttonUpX = self.scrollUpButtonX;
                var buttonUpY = self.scrollUpButtonY;
                var buttonDownX = self.scrollDownButtonX;
                var buttonDownY = self.scrollDownButtonY;
                var rail_y = y + scrollbar_size * 2;
                var rail_height = self.railHeight;

                //Scrollbar background
                layer.rect({
                    x: buttonUpX,
                    y: rail_y,
                    width: scrollbar_size,
                    height: rail_height,
                    fillStyle: 'Blue',
                    backgroundOpacity: 80
                });

                var scroll_y = rail_y + rail_height * (self.scrollTop / self_content_height);
                var scroll_height = (self_container_height / self_content_height) * rail_height;


                //  Scrollbar Slider
                layer.rect({
                    x: buttonUpX,
                    y: scroll_y,
                    width: scrollbar_size,
                    height: scroll_height,
                    fillStyle: 'White',
                    lineWidth: 1,
                    strokeStyle: 'Black'
                });


                //Scrollbar button up
                layer.rect({
                    x: buttonUpX,
                    y: buttonUpY,
                    width: scrollbar_size,
                    height: scrollbar_size,
                    fillStyle: 'White',
                    lineWidth: 1,
                    strokeStyle: 'Black'
                });

                //Scrollbar character up
                layer.text('▲', {
                    x: buttonUpX,
                    y: buttonUpY,
                    color: 'Blue',
                    width: scrollbar_size,
                    height: scrollbar_size,
                    textAlign: 'center',
                    fontSize: fontSize
                });

                //Scrollbar button down
                layer.rect({
                    x: buttonDownX,
                    y: buttonDownY,
                    width: scrollbar_size,
                    height: scrollbar_size,
                    fillStyle: 'White',
                    lineWidth: 1,
                    strokeStyle: 'Black'
                });

                //Scrollbar character down
                layer.text('▼', {
                    x: buttonDownX,
                    y: buttonDownY + (scrollbar_size / 7.5),
                    color: 'Blue',
                    width: scrollbar_size,
                    height: scrollbar_size,
                    textAlign: 'center',
                    fontSize: fontSize
                });
            }

            //SCROLL HORIZONTAL
            if (self.scrollableX && self_content_width > self_container_width) {
                var buttonLeftX = self.scrollLeftButtonX;
                var buttonLeftY = self.scrollLeftButtonY;
                var buttonRightX = self.scrollRightButtonX;
                var buttonRightY = self.scrollRightButtonY;

                var rail_x = x + scrollbar_size * 2;
                var rail_width = self.railWidth;

                //Scrollbar background
                layer.rect({
                    x: rail_x,
                    y: buttonLeftY,
                    width: rail_width,
                    height: scrollbar_size,
                    fillStyle: 'Blue',
                    backgroundOpacity: 80
                });

                var scroll_x = rail_x + rail_width * (self.scrollLeft / self_content_width);
                var scroll_width = (self_container_width / self_content_width) * rail_width;

                //  Scrollbar Slider
                layer.rect({
                    x: scroll_x,
                    y: buttonLeftY,
                    width: scroll_width,
                    height: scrollbar_size,
                    fillStyle: 'White',
                    lineWidth: 1,
                    strokeStyle: 'Black'
                });


                //Scrollbar button left
                layer.rect({
                    x: buttonLeftX,
                    y: buttonLeftY,
                    width: scrollbar_size,
                    height: scrollbar_size,
                    fillStyle: 'White',
                    lineWidth: 1,
                    strokeStyle: 'Black'
                });

                //Scrollbar character left
                layer.text('◀', {
                    x: buttonLeftX,
                    y: buttonLeftY + (scrollbar_size / 7.5),
                    color: 'Blue',
                    width: scrollbar_size,
                    height: scrollbar_size,
                    textAlign: 'center',
                    fontSize: fontSize
                });

                //Scrollbar button right
                layer.rect({
                    x: buttonRightX,
                    y: buttonRightY,
                    width: scrollbar_size,
                    height: scrollbar_size,
                    fillStyle: 'White',
                    lineWidth: 1,
                    strokeStyle: 'Black'
                });

                //Scrollbar character right
                layer.text('▶', {
                    x: buttonRightX,
                    y: buttonRightY + (scrollbar_size / 7.5),
                    color: 'Blue',
                    width: scrollbar_size,
                    height: scrollbar_size,
                    textAlign: 'center',
                    fontSize: fontSize
                });
            }
        }
    };

    UI_Element.prototype.mousedown = function (x, y) {

    };

    UI_Element.prototype.mouseup = function () {

    };
    /**
     *
     * @param layer
     */
    UI_Element.prototype.clear = function (layer) {
        var self = this;
        var bounds = self.visibleBounds;
        if (body.width != 0 && body.height != 0) {
            layer.clear(body.x, body.y, body.width, body.height);
        }
    };
    /**
     *
     * @param state
     * @param style
     * @param value
     * @returns {UI_Element}
     */
    UI_Element.prototype.setStateStyle = function (state, style, value) {
        var self = this;
        var tmp = self.state;
        self.state = state;
        self[style] = value;
        self.state = tmp;
        return self;
    };
    /**
     *
     * @param type
     * @param self
     */
    UI_Element.fire_change = function (type, self) {
        if (self.initialized) {
            document.change(type, self.level, self);
        }
    };


    UI_Element.uncache = function (el, prop) {
        if(prop_implies[prop] != undefined){
            var implies = prop_implies[prop];
            var i;
            var key;

            if(implies['self']){
                var length = implies['self'].length;
                for(i =0; i < length;i++){
                    key = implies['self'][i];
                    el[key] = false;
                }
            }

            if(implies['children'] && el.contents.length > 0){
                var children = el.contents;
                var lengthA = el.contents.length;
                var lengthB = implies['children'].length;
                var j;
                var child;

                for(i = 0; i < lengthA;i++){
                    child = children[i];
                    for(j =0; j < lengthB;j++){
                        key = implies['children'][j];
                        child[key] = false;
                    }
                }
            }
        }
    };


    //var save_state = function (self) {
    //    if (self.initialized) {
    //        self.oldWidth = self.realWidth;
    //        self.oldHeight = self.realHeight;
    //        self.oldLeft = self.absoluteLeft;
    //        self.oldTop = self.absoluteTop;
    //        self.oldBorderWidth = self.borderWidth;
    //        self.oldBackgroundOpacity = self.backgroundOpacity;
    //        self.oldPadding = self.padding;
    //        fire_change(self);
    //    }
    //};

    /**
     *
     * @param size
     * @param total
     * @returns {*}
     */
    var calc_size = function (size, total) {
        if (/[0-9]+(.\[0-9]+)?%/.test(size)) {
            var pc = parseFloat(size);
            return (total * pc) / 100
        }
        return size;
    };

    /**
     *
     * @param align
     * @param objSize
     * @param contSize
     * @returns {number}
     */
    var calculate_align = function (align, objSize, contSize) {
        switch (align) {
            case 'top':
            case 'left':
                return 0;
                break;
            case 'center':
                return (contSize / 2) - (objSize / 2);
                break;
            case 'bottom':
            case 'right':
                return contSize - objSize;
                break;
        }
    };

    /**
     *
     * @param xa
     * @param ya
     * @param wa
     * @param ha
     * @param xb
     * @param yb
     * @param wb
     * @param hb
     * @returns {boolean}
     */
    var collide_bounds = function (xa, ya, wa, ha, xb, yb, wb, hb) {
        return !(xa > xb + wb || xb > xa + wa || ya > yb + hb || yb > ya + ha);
    };


    var rect_intersect = function(xa,ya,wa,ha,xb,yb,wb,hb){
        var rect = {
            x:0,
            y:0,
            width:0,
            height:0
        };

        var xaw = xa+wa;
        var xbw = xb+wb;
        var yah = ya+ha;
        var ybh = yb+hb;

        if(xb > xaw || xa > xbw || yb > yah || ya > ybh){
            return rect;
        }

        rect.x = Math.max(xa,xb);
        rect.y = Math.max(ya,yb);
        rect.width = Math.min(xa+wa,xb+wb)-rect.x;
        rect.height = Math.min(ya+ha,yb+hb)-rect.y;


        return rect;
    };


    root.UI_Element = UI_Element;
})(RPG);