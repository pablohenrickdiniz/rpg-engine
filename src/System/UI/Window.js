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
        self.left = options.left || (w.innerWidth/2-self.width/2);
        self.top = options.top || (w.innerHeight/2-self.height/2);
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
    }

    UI.classes.Window = Window;
})(RPG,window);