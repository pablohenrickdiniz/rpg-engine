(function (root,w) {
    if (root.Scene == undefined) {
        throw "SceneTitle requires Scene"
    }

    if(root.UI_Window == undefined){
        throw "SceneTitle requires UI_Window"
    }

    var Scene = root.Scene,
        UI_Window = root.UI_Window,
        UI_ListVertical = root.UI_ListVertical,
        UI_Element = root.UI_Element,
        UI_Text = root.UI_Text;


    root.SceneMenu= new Scene({
        command_window:null,
        start:function () {
            var command_window = new UI_Window(null,{
                verticalAlign:'center',
                horizontalAlign:'center',
                borderWidth:3,
                borderColor:'gray',
                width:400,
                height:400,
                name:'command_window',
                scrollable:true,
                padding:5
            });
            command_window.show();


            var vertical = new UI_ListVertical(command_window,{
                backgroundColor:'transparent',
                width:'25%',
                height:390,
                padding:3,
                scrollable:true
            });
            vertical.show();

            for(var i = 0; i < 15;i++){
                var element = new UI_Element(vertical,{
                    width:'100%',
                    height:35,
                    backgroundColor:'rgb('+[i*10,i*10,i*10].join(',')+')',
                    borderColor:'white',
                    borderWidth:2,
                    name:'el'
                });

                element.setStateStyle(1,'backgroundColor','rgb('+[(i+1)*10,(i+1)*10,(i+1)*10].join(',')+')');

                element.show();
            }
        }
    });
})(RPG,window);