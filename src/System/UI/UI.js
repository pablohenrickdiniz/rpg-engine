(function(root){
    let ui = null;
    let UI = {
        initialize:function(id){
            let element = document.getElementById(id);
            while(element.children.length > 0){
                element.removeChild(element.firstChild);
            }
            element.setAttribute('class','game-ui');
            ui = new UI.Element({
                id:'ui-root',
                element:element
            });
        }
    };

    Object.defineProperty(UI,'root',{
        /**
         *
         * @returns {Element}
         */
        get:function(){
            return ui;
        },
    });

    Object.defineProperty(UI,'width',{
        /**
         *
         * @returns {number}
         */
        get:function(){
            return UI.root.width;
        },
        /**
         *
         * @param w {number}
         */
        set:function(w){
            UI.root.width = w;
        }
    });

    Object.defineProperty(UI,'height',{
        /**
         *
         * @returns {number}
         */
        get:function(){
            return UI.root.height;
        },
        /**
         *
         * @param h {number}
         */
        set:function(h){
            UI.root.height = h;
        }
    });


    Object.defineProperty(root,'UI',{
        /**
         *
         * @returns {UI}
         */
        get:function(){
            return UI;
        }
    });
})(this);