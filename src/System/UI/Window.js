/**
 * @requires Element.js
 * @requires Button.js
 * @requires Text.js
 */
(function(root){
    let UI = root.UI,
        Element = UI.Element,
        Button = UI.Button,
        Text = UI.Text;

    /**
     *
     * @param options {object}
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
     * @param el {Element}
     * @returns {Window}
     */
    Window.prototype.add = function(el){
        let self = this;
        self.body.add(el);
        return self;
    };

    /**
     *
     * @param el
     * @returns {Window}
     */
    Window.prototype.remove = function(el){
        let self = this;
        self.body.remove(el);
        return self;
    };

    /**
     *
     * @param self {Window}
     */
    function initialize(self){
        let title = '';

        let header = new Element({
            class:'window-header'
        });

        let close = new Button({
            class:'button'
        });

        close.text = '&times';
        close.on('leftclick',function(e){
            e.stopPropagation();
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
             * @returns {Element}
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
             * @param t {string}
             */
            set:function(t){
                if(t !== title){
                    title = t;
                    headerTitle.value = title;
                }
            }
        });
    }

    Object.defineProperty(UI,'Window',{
        /**
         *
         * @returns {Window}
         */
        get:function(){
            return Window;
        }
    });
})(window);