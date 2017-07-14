(function(root){
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
        self.height = options.height || 350;
    };

    Window.prototype = Object.create(Element.prototype);
    Window.prototype.constructor = Window;


    function initialize(self){
        var element = null;
        var title = '';
        var width = 0;
        var height = 0;

        Object.defineProperty(self,'element',{
            get:function(){
                if(element == null){
                    element = document.createElement('div');
                    element.setAttribute('class',self.class);
                    Element.bind(self,element);
                }
                return element;
            }
        });

        var header = new Element({
            class:'window-header',
            parent:self
        });

        header.show();

        var header_title = new Text({
            class:'window-header-title',
            parent:header,
            tag:'h1'
        });

        header_title.show();

        var header_close = new Button({
            parent:header,
            class:'button'
        });
        header_close.text = '&times';
        header_close.show();


        header_close.addEventListener('leftclick',function(){
            self.hide();
        });

        Object.defineProperty(self,'title',{
            get:function(){
                return title;
            },
            set:function(t){
                if(t != title){
                    title = t;
                    header_title.value = title;
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
    }

    UI.classes.Window = Window;
})(RPG);