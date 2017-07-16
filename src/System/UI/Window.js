(function(root,w){
    if(root.UI == undefined){
        throw "Window requires UI"
    }

    if(root.UI.classes.Element == undefined){
        throw "Window requires Element";
    }

    if(root.UI.classes.Button == undefined){
        throw "Window requires Button";
    }

    if(root.UI.classes.Text == undefined){
        throw "Window requires Text"
    }

    var UI = root.UI,
        Element = UI.classes.Element,
        Button = UI.classes.Button,
        Text = UI.classes.Text;

    var Window = function(options){
        var self = this;
        options = options || {};
        Element.call(self,options);
        initialize(self);
        self.title = options.title || 'window';
        self.width = options.width || 200;
        self.height = options.height || 200;
        self.sl = 0;
        self.st = 0;
    };

    Window.prototype = Object.create(Element.prototype);
    Window.prototype.constructor = Window;

    Window.prototype.add = function(el){
        var self = this;
        self.body.add(el);
    };

    Window.prototype.remove = function(el){
        var self = this;
        self.body.remove(el);
    };

    function initialize(self){
        var title = '';
        var width = 0;
        var height = 0;



        var header = new Element({
            class:'window-header'
        });
        var close = new Button({
            class:'button'
        });
        close.text = '&times';
        close.addEventListener('leftclick',function(){
            self.visible = false;
        });

        var body =   body =  new Element({
            class:'window-body'
        });


        var headerTitle = new Text({
            class:'window-header-title'
        },'h1');

        header.add(headerTitle);
        header.add(close);


        self.children.push(header);
        self.children.push(body);
        self.element.appendChild(header.element);
        self.element.appendChild(body.element);

        Object.defineProperty(self,'body',{
            get:function(){
                return body;
            }
        });

        Object.defineProperty(self,'title',{
            get:function(){
                return title;
            },
            set:function(t){
                if(t != title){
                    title = t;
                    headerTitle.value = title;
                }
            }
        });


        Object.defineProperty(self,'width',{
            get:function(){
                return width;
            },
            set:function(w){
                w = parseInt(w);
                if(!isNaN(w) && w >= 0 && w != width){
                    width = w;
                    self.element.style.width = w+'px';
                }
            }
        });

        Object.defineProperty(self,'height',{
            get:function(){
                return height;
            },
            set:function(h){
                h = parseInt(h);
                if(!isNaN(h) && h >= 0 && h != height){
                    height = h;
                    self.element.style.height = h+'px';
                }
            }
        });

        self.addEventListener('dragstart',function(){
            self.st = parseInt(self.element.top);
            self.sl = parseInt(self.element.left);
        });

        self.addEventListener('dragend',function(e){
            var width = w.innerWidth;
            var height = w.innerHeight;

            var left =e.clientX;
            var top = e.clientY;

            left = left*100/width;
            top = top*100/height;

            self.element.style.left = left+'%';
            self.element.style.top = top+'%';
        });
    }

    UI.classes.Window = Window;
})(RPG,window);