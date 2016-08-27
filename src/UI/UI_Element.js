(function(root){
    if(root.Document == undefined){
        throw "UI_Element requires Document"
    }

    var document = root.Document,
        viewport = root.Viewport;

    var ID = 0;

    var UI_Element = function(parent,options){
        var self = this;
        options = options || {};
        self.events = {};
        self.contents = [];
        self.id = ID;
        ID++;
        initialize(self);
        if (parent == null) {
            document.add(self);
            parent = viewport;
        }
        else{
            parent.add(self);
        }
        self.parent = parent;
        self.width = options.width || 100;
        self.height = options.height || 100;
        self.backgroundOpacity = options.backgroundOpacity || 100;
        self.borderOpacity = options.borderOpacity || 100;
        self.backgroundColor = options.backgroundColor || 'transparent';
        self.borderColor = options.borderColor || 'yellow';
        self.borderWidth = options.borderWidth || 0;
        self.borderStyle = options.borderStyle || 'rounded';
        self.visible = options.visible || false;
        self.draggable = false;
    };


    UI_Element.prototype.add = function (element) {
        var self = this;
        if (element instanceof UI_Element && self.contents.indexOf(element) == -1) {
            element.parent = self;
            self.contents.push(element);
        }
        return self;
    };

    UI_Element.prototype.remove = function (element) {
        var self = this;
        if(element != undefined){
            var index = self.contents.indexOf(element);
            if(index != -1){
                element.parent = null;
                self.contents.splice(index,1);
            }
        }
        else{
            self.parent.remove(self);
        }
        return self;
    };

    UI_Element.prototype.addEventListener = function (name, callback) {
        var self = this;
        if (self.events[name] == undefined) {
            self.events[name] = [];
        }

        self.events[name].push(callback);
        return self;
    };

    UI_Element.prototype.removeEventListener = function (name, callback) {
        var self = this;
        if (self.events[name] != undefined) {
            var index = self.events[name].indexOf(callback);
            if (index != -1) {
                self.events[name].splice(index, 1);
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
        var width = [100];
        var height = [100];
        var opacity = [50];
        var left = [0];
        var top = [0];
        var backgroundColor = ['transparent'];
        var borderColor = ['yellow'];
        var borderWidth = [2];
        var borderStyle = ['rounded'];
        var visible = ['visible'];
        var draggable = ['draggable'];
        var old_width = ['old_width'];
        var old_height = height;
        var old_left = left;
        var old_top = top;
        var old_borderWidth = borderWidth;
        var parent = null;
        var state = 0;
        var cursor = ['default'];
        var backgroundOpacity = [100];


        Object.defineProperty(self, 'realWidth', {
            get: function () {
                var w = width[state] || width[0];
                if(/[0-9]+(.\[0-9]+)?%/.test(w)){
                    var pc = parseFloat(w);
                    return (self.parent.realWidth*pc)/100
                }
                return w;
            }
        });

        Object.defineProperty(self, 'realHeight', {
            get: function () {
                var h = height[state] || height[0];
                if(/[0-9]+(.\[0-9]+)?%/.test(h)){
                    var pc = parseInt(h);
                    return (self.parent.realHeight*pc)/100
                }
                return h;
            }
        });

        Object.defineProperty(self, 'width', {
            get: function () {
                return width[state]|| width[0];
            },
            set: function (w) {
                if (w != width[state]) {
                    old_width = width[state];
                    width[state] = w;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'height', {
            get: function () {
                return height[state] || height[0];
            },
            set: function (h) {
                if (h != height[state]) {
                    old_height = height[state];
                    height[state] = h;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'left', {
            get: function () {
                return left[state] || left[0];
            },
            set: function (l) {
                if (l != left[state]) {
                    old_left = left[state];
                    left[state] = l;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'top', {
            get: function () {
                return top[state] || top[0];
            },
            set: function (t) {
                if (t != top[state]) {
                    old_top = top[state];
                    top[state] = t;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'borderWidth', {
            get: function () {
                return borderWidth[state] || borderWidth[0];
            },
            set: function (bw) {
                if (bw != borderWidth[state]) {
                    old_borderWidth = borderWidth[state];
                    borderWidth[state] = bw;
                    self.changed = true;
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
                    self.changed = true;
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
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'backgroundOpacity', {
            get: function () {
                return backgroundOpacity[state] ||  backgroundOpacity[0];
            },
            set: function (bo) {
                if (bo != backgroundOpacity[state]) {
                    backgroundOpacity[state] = bo;
                    self.changed = true;
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
                    self.changed = true;
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
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self, 'visible', {
            get: function () {
                return visible[state] || visible[0];
            },
            set: function (v) {
                if (v != visible[state]) {
                    visible[state] = v;
                    self.changed = true;
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

        Object.defineProperty(self, 'changed', {
            get: function () {
                return document.changed;
            },
            set: function (c) {
                if(c){
                    document.changed = true;
                }
            }
        });

        Object.defineProperty(self,'level',{
            get:function(){
                if(self.parent instanceof  UI_Element){
                    return self.parent.level +1;
                }
                return 0;
            }
        });

        Object.defineProperty(self,'parent',{
            get:function(){
                return parent;
            },
            set:function(p){
                if(p != parent){
                    if(parent != null){
                        document.removeFromLevel(self.level,self);
                    }
                    parent = p;
                    if(parent != null){
                        document.addToLevel(self.level,self);
                    }

                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self,'hover',{
            get:function(){
                return state == 1;
            },
            set:function(h){
                if(h != state){
                    if(h){
                        self.state = 1;
                    }
                    else{
                        self.state = 0;
                    }
                }
            }
        });

        Object.defineProperty(self,'state',{
            get:function(){
                return state;
            },
            set:function(s){
                if(s != state){
                    state = s;
                    self.changed = true;
                }
            }
        });

        Object.defineProperty(self,'cursor',{
            get:function(){
                return cursor[state] || cursor[0];
            },
            set:function(c){
                if(c != cursor[state]){
                    cursor[state] = c;
                    self.changed = true;
                }
            }
        });
    };


    UI_Element.prototype.setStateStyle = function(state,style,value){
        var self = this;
        var tmp = self.state;
        self.state = state;
        self[style] = value;
        self.state = tmp;
        return self;
    };

    UI_Element.prototype.update = function(){
        var self = this;
        var length = self.contents.length;
        var i;
        for (i = 0; i < length; i++) {
            self.contents[i].update();
        }
    };

    root.UI_Element = UI_Element;
})(RPG);