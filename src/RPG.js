(function (w) {
    if (w.CE == undefined) {
        throw 'RPG requires Canvas Engine'
    }

    if (w.Keyboard == undefined) {
        throw "RPG requires Keyboard"
    }

    if(w.Mouse == undefined){
        throw "RPG requires Mouse"
    }

    var Keyboard = w.Keyboard,
        Mouse = w.Mouse;

    w.RPG = {
        Resources:{},
        Main: null,
        Viewport:null,
        Document:null,
        Controls:{
            Keyboard:null,
            Mouse:null
        },
        /*
         initialize(String container):void
         inicializa a engine de rpg dentro do elemento container
         */
        initialize: function (container) {
            var self = this;
            self.Controls.Keyboard = new Keyboard(container);
            self.Controls.Mouse = new Mouse(container);
            self.Viewport.initialize(container);
            self.Document.initialize();
            self.initializeEvents();
        },
        initializeEvents:function(){
            var self = this;
            w.addEventListener('blur',self.System.freeze);
            w.addEventListener('focus',self.System.resume)
        }
    };
})(window);