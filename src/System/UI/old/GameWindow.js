(function(w){
    let document = w.document;
    let CloseButtonProto = Object.create(HTMLButtonElement.prototype);
    let GameWindowProto = Object.create(HTMLDivElement.prototype);
    let WindowHeaderProto = Object.create(HTMLDivElement.prototype);
    let WindowContentProto = Object.create(HTMLDivElement.prototype);

    WindowHeaderProto.createdCallback = function(){
        let self = this;
        self.style.width = '100%';
        self.style.backgroundColor = '#0000A0';
        self.style.display = 'inline-block';
        let button = new CloseButton();
        self.appendChild(button);
    };

    CloseButtonProto.createdCallback = function(){
        let self = this;
        self.innerHTML = '&times;';
        self.style.float = 'right';
        self.style.backgroundColor = 'white';
        self.style.border = '2px solid #FFFFFF';
    };

    WindowContentProto.createCallback = function(){
        let self = this;
        self.style.width = '100%';
    };

    let CloseButton = document.registerElement('close-button',{
        prototype:CloseButtonProto,
        extends:'button'
    });

    let WindowHeader = document.registerElement('game-window-header',{
        prototype:WindowHeaderProto
    });

    let WindowContent = document.registerElement('game-window-content',{
        prototype:WindowContentProto
    });


    GameWindowProto.createdCallback  =function(){
        let self = this;
        initialize(self);
        self.style.position = 'absolute';
        self.style.backgroundColor = 'Blue';
        self.width = 300;
        self.height = 300;
        let header = new WindowHeader();
        let content = new WindowContent();
        self.appendChild(header);
        self.appendChild(content);
    };

    GameWindowProto.hide = function(){
        let self = this;
        self.style.visibility = 'hidden';
    };

    GameWindowProto.show = function(){
        let self = this;
        self.style.visibility = 'visible';
    };


    let initialize = function(self){
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