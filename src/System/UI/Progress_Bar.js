(function(root){
    if(root.UI == undefined){
        throw "Progress_Bar requires UI"
    }

    var UI = root.UI;

    var Progress_Bar = function(options){
        var self = this;
        options = options || {};
        initialize(self);
        self.progress = options.progress || 0;
        self.total = options.total || 100;
        self.parent = options.parent || null;
        self.style = options.style || {};
        self.id = options.id;
    };


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

        Object.defineProperty(self,'parent',{
            get:function(){
                return parent;
            },
            set:function(p){
                if(p instanceof Node && p != parent){
                    var element  =self.element;
                    if(parent != null){
                        parent.removeChild(element);
                    }
                    parent = p;
                    parent.appendChild(element);
                }
            }
        });


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

        Object.defineProperty(self,'id',{
            get:function(){
                return self.element.id;
            },
            set:function(i){
                if(typeof i == 'string'){
                    self.element.id = i;
                }
            }
        });
    }

    UI.Progress_bar = Progress_Bar;
})(RPG);