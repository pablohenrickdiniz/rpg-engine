(function(root){
    if(root.UI_Element == undefined){
        throw "UI_List requires UI_Element"
    }

    var UI_Element = root.UI_Element;

    var UI_List = function(parent,options){
        var self = this;
        UI_Element.call(self,parent,options);
    };

    UI_List.prototype = Object.create(UI_Element.prototype);
    UI_List.constructor = UI_List;

    UI_List.prototype.add = function(listItem){
        var self = this;
        if(self.contents.indexOf(listItem) == -1){
            listItem.parent = self;
            self.contents.push(listItem);
        }
    };

    UI_List.prototype.remove = function(item){
        var self =this;
        var index = self.contents.indexOf(item);
        if(index != -1){
            self.contents.splice(index,1)[0].parent = null;
        }
    };

    UI_List.prototype.indexOf = function(item){
        var self  =this;
        return self.contents.indexOf(item);
    };

    UI_List.prototype.swapIndex = function(indexA, indexB){
        var self = this;
        if(self.contents[indexA] != undefined && self.contents[indexB] != undefined){
            var tmp = self.contents[indexA];
            self.contents[indexA] = self.contents[indexB];
            self.contents[indexB] = tmp;
        }
    };

    console.log(UI_List.prototype);

    root.UI_List = UI_List;
})(RPG);