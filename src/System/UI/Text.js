(function(root){
    if(root.UI == undefined){
        throw "Text requires UI"
    }

    if(root.UI.classes.Element == undefined){
        throw "Text requires Element";
    }

    var UI = root.UI,
        Element = UI.classes.Element;

    var Text = function(options,tag){
        var self = this;
        tag = tag || 'p';
        options = options || {};
        Element.call(self,options,tag);
        initialize(self);
    };

    Text.prototype = Object.create(Element.prototype);
    Text.prototype.constructor = Text;

    function initialize(self){
        var value = '';

        Object.defineProperty(self,'value',{
            get:function(){
                return value;
            },
            set:function(v){
                if(v != value){
                    value = v;
                    self.element.innerHTML = value;
                }
            }
        });
    }

    UI.classes.Text = Text;
})(RPG);