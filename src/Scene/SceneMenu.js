(function (root,w) {
    if (root.Scene == undefined) {
        throw "SceneTitle requires Scene"
    }

    if(root.UI_Window == undefined){
        throw "SceneTitle requires UI_Window"
    }

    var Scene = root.Scene,
        UI_Window = root.UI_Window,
        UI_List = root.UI_List;
    root.SceneMenu= new Scene({
        command_window:null,
        start:function () {
            var command_window = new UI_Window(null,{
                verticalAlign:'center',
                horizontalAlign:'center',
                borderWidth:3,
                borderColor:'gray',
                backgroundOpacity:50,
                width:300,
                height:300
            });
            command_window.show();

            var list = new UI_List(command_window,{
                width:'30%',
                height:'95%',
                backgroundColor:'Green',
                verticalAlign:'center',
                left:'3%'
            });

            list.show();
        }
    });
})(RPG,window);