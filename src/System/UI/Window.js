'use strict';
(function(root,w){
    if(root.UI === undefined){
        throw "Window requires UI";
    }

    if(root.UI.classes.Element === undefined){
        throw "Window requires Element";
    }

    if(root.UI.classes.Button === undefined){
        throw "Window requires Button";
    }

    if(root.UI.classes.Text === undefined){
        throw "Window requires Text";
    }

    let UI = root.UI,
        Element = UI.classes.Element,
        Button = UI.classes.Button,
        Text = UI.classes.Text;

    /**
     *
     * @param options
     * @constructor
     */
    let Window = function(options){
        let self = this;
        options = options || {};
        Element.call(self,options);
        initialize(self);
        self.title = options.title || 'window';
        self.left = options.left || (w.innerWidth/2-self.width/2);
        self.top = options.top || (w.innerHeight/2-self.height/2);
    };

    Window.prototype = Object.create(Element.prototype);
    Window.prototype.constructor = Window;

    /**
     *
     * @param el
     */
    Window.prototype.add = function(el){
        let self = this;
        self.body.add(el);
    };

    /**
     *
     * @param el
     */
    Window.prototype.remove = function(el){
        let self = this;
        self.body.remove(el);
    };

    /**
     *
     * @param self
     */
    function initialize(self){
        let title = '';
        let width = 0;
        let height = 0;
        let header = new Element({
            class:'window-header'
        });
        let close = new Button({
            class:'button'
        });
        close.text = '&times';
        close.addEventListener('leftclick',function(){
            self.visible = false;
        });

        let body =  new Element({
            class:'window-body'
        });

        let headerTitle = new Text({
            class:'window-header-title'
        },'h1');

        header.add(headerTitle);
        header.add(close);
        self.children.push(header);
        self.children.push(body);
        self.element.appendChild(header.element);
        self.element.appendChild(body.element);

        Object.defineProperty(self,'body',{
            /**
             *
             * @returns {*|Element}
             */
            get:function(){
                return body;
            }
        });

        Object.defineProperty(self,'title',{
            /**
             *
             * @returns {string}
             */
            get:function(){
                return title;
            },
            /**
             *
             * @param t
             */
            set:function(t){
                if(t !== title){
                    title = t;
                    headerTitle.value = title;
                }
            }
        });
    }

    UI.classes.Window = Window;
})(RPG,window);