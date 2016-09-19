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
        UI_ListHorizontal = root.UI_ListHorizontal,
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
                height:500,
                name:'command_window',
                padding:5
            });
            command_window.show();


            var vertical = new UI_ListVertical(command_window,{
                width:'25%',
                height:390,
                padding:3,
                scrollableY:true,
                scrollableX:true
            });

            var horizontal = new UI_ListHorizontal(command_window,{
                left:'30%',
                backgroundColor:'transparent',
                width:270,
                height:390,
                padding:3,
                scrollableX:true,
                scrollableY:true,
                borderWidth:2,
                borderColor:'white',
                name:'listHorizontal'
            });

            vertical.show();
            horizontal.show();


            for(var i = 0; i < 20;i++){
                var element = new UI_Element(horizontal,{
                    width:35,
                    height:'50%',
                    backgroundColor:'rgb('+[i*10,i*10,i*10].join(',')+')',
                    borderColor:'white',
                    borderWidth:2
                });
                element.show();
            }


            for(var i = 0; i < 20;i++){
                var element = new UI_Element(vertical,{
                    width:'100%',
                    height:35,
                    backgroundColor:'rgb('+[i*10,i*10,i*10].join(',')+')',
                    borderColor:'white',
                    borderWidth:2
                });

                element.setStateStyle(1,'backgroundColor','rgb('+[(i+1)*10,(i+1)*10,(i+1)*10].join(',')+')');

                element.show();
            }
        }
    });
})(RPG,window);