(function(root){
    let ui_root = null;
    let UI = {};

    Object.defineProperty(UI,'root',{
        /**
         *
         * @returns {Element}
         */
        get:function(){
            return ui_root;
        },
        /**
         *
         * @param r {Element}
         */
        set:function(r){
            if(r !== ui_root && r instanceof UI.Element){
                if(ui_root != null){
                    while(ui_root.children.length > 0){
                        r.add(ui_root.children[0]);
                    }
                }
                ui_root = r;
                ui_root.element.setAttribute('tabindex','-1');
            }
        }
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
})(window);