(function(root){
    if(root.UI == undefined){
        throw "Progress_Bar requires UI"
    }

    if(root.UI.classes.Element == undefined){
        throw "Progress_Bar requires Element";
    }

    var UI = root.UI,
        Element = UI.classes.Element;

    var Progress_Bar = function(options){
        var self = this;
        options = options || {};
        initialize(self);
        Element.call(self,options);
        self.progress = options.progress || 0;
        self.total = options.total || 100;
        self.parent = options.parent || null;
        self.style = options.style || {};
        self.id = options.id;
        if(options.visible){
            self.show();
        }
    };

    Progress_Bar.prototype = Object.create(Element.prototype);
    Progress_Bar.prototype.constructor = Progress_Bar;

    Progress_Bar.prototype.hide = function(){
        var self = this;
        self.element.style.display = 'none';
    };

    Progress_Bar.prototype.show = function(){
        var self= this;
        self.element.style.display = 'inline-block';
    };


    Progress_Bar.prototype.remove = function(){
        var self = this;
        var el = self.element;
        if(el.parent){
            el.parent.removeChild(el);
        }
    };

    function initialize(self){
        var element = null;
        var parent = null;

        Object.defineProperty(self,'element',{
            get:function(){
                if(element == null){
                    element = document.createElement('progress');
                    element.style.appearance = 'none';
                    element.style.webkitAppearance = 'none';
                    element.style.display = 'none';
                }
                return element;
            }
        });

        Object.defineProperty(self,'progress',{
            get:function(){
                return self.element.value;
            },
            set:function(p){
                p = parseFloat(p);
                if(!isNaN(p)){
                    self.element.value = p;
                    self.element.innerHTML = p+'%';
                }
            }
        });

        Object.defineProperty(self,'total',{
            get:function(){
                return self.element.max;
            },
            set:function(total){
                total = parseFloat(total);
                if(!isNaN(total)){
                    self.element.max = total;
                }
            }
        });

        Object.defineProperty(self,'text',{
            get:function(){
                return self.element.getAttribute("text");
            },
            set:function(text){
                self.element.setAttribute("text",text);
            }
        });
    }

    UI.classes.Progress_Bar = Progress_Bar;
})(RPG);