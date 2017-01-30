(function(w){
    var document = w.document;
    var CloseButtonProto = Object.create(HTMLButtonElement.prototype);
    var GameWindowProto = Object.create(HTMLDivElement.prototype);
    var WindowHeaderProto = Object.create(HTMLDivElement.prototype);
    var WindowContentProto = Object.create(HTMLDivElement.prototype);

    WindowHeaderProto.createdCallback = function(){
        var self = this;
        self.style.width = '100%';
        self.style.backgroundColor = '#0000A0';
        self.style.display = 'inline-block';
        var button = new CloseButton();
        self.appendChild(button);
    };

    CloseButtonProto.createdCallback = function(){
        var self = this;
        self.innerHTML = '&times;';
        self.style.float = 'right';
        self.style.backgroundColor = 'white';
        self.style.border = '2px solid #FFFFFF';
    };

    WindowContentProto.createCallback = function(){
        var self = this;
        self.style.width = '100%';
    };

    var CloseButton = document.registerElement('close-button',{
        prototype:CloseButtonProto,
        extends:'button'
    });

    var WindowHeader = document.registerElement('game-window-header',{
        prototype:WindowHeaderProto
    });

    var WindowContent = document.registerElement('game-window-content',{
        prototype:WindowContentProto
    });


    GameWindowProto.createdCallback  =function(){
        var self = this;
        initialize(self);
        self.style.position = 'absolute';
        self.style.backgroundColor = 'Blue';
        self.width = 300;
        self.height = 300;
        var header = new WindowHeader();
        var content = new WindowContent();
        self.appendChild(header);
        self.appendChild(content);
    };

    GameWindowProto.hide = function(){
        var self = this;
        self.style.visibility = 'hidden';
    };

    GameWindowProto.show = function(){
        var self = this;
        self.style.visibility = 'visible';
    };


    var initialize = function(self){
        Object.defineProperty(self,'width',{
            get:function(){
                return parseFloat(self.style.width);
            },
            set:function(width){
                self.style.width = width+'px';
            }
        });

        Object.defineProperty(self,'height',{
            get:function(){
                return parseFloat(self.style.height);
            },
            set:function(height){
                self.style.height = height+'px';
            }
        });
    };

    w.GameWindow = document.registerElement('game-window',{
        prototype:GameWindowProto
    });
})(window);