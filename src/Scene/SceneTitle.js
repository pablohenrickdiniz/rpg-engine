(function (root,w) {
    if (root.Scene == undefined) {
        throw "SceneTitle requires Scene"
    }

    if(root.UI_Window == undefined){
        throw "SceneTitle requires UI_Window"
    }

    var Scene = root.Scene,
        UI_Window = root.UI_Window;

    var command_window = null;

    var create_command_window = function(){
        command_window = new UI_Window(null,{
            verticalAlign:'center',
            horizontalAlign:'center',
            borderWidth:3,
            borderColor:'gray',
            backgroundOpacity:50,
            width:300,
            height:300
        });
        command_window.show();
    };

    root.SceneTitle = new Scene({
        audio:{
            BGM: {
                'opening': 'audio/01 - Opening (Destroyed Science Academy Research Station).mp3',
                'musica2': 'audio/7batldun.mp3'
            }
        },
        images:{
            Misc: {
                'metroid-1994': 'img/1994-metroid.png',
                'nintendo-logo': 'img/nintendo-logo.png',
                Logo3: 'img/nintendo-logo.png'
            }
        },
        command_window:null,
        start:function () {
           // create_command_window();



            var System = root.System,
                Resources = root.Resources,
                Graphic = Resources.Graphic,
                Audio = System.Audio;


            var nintendo_logo = Graphic.get('Misc','nintendo-logo');
            var metroid_logo = Graphic.get('Misc','metroid-1994');

            var nintendo_logo_options = {
                vAlign:'center',
                hAlign:'center',
                layer: 'EF2',
                time: 500
            };

            var self = this;
            self.fadeInImage(nintendo_logo,nintendo_logo_options,function(){
                System.wait(1500, function () {
                    self.fadeOutImage(nintendo_logo,nintendo_logo_options,function(){
                        System.wait(2000,function(){
                            Audio.play('BGM','opening');
                            System.wait(700,function(){
                                self.drawImage(metroid_logo,{vAlign:'center',hAlign:'center',sWidth:'20.6%', layer: 'EF2'});
                                System.wait(200,function(){
                                    self.clear('EF2');
                                    self.drawImage(metroid_logo,{vAlign:'center',hAlign:'center', sWidth:'48.2%', layer: 'EF2'});
                                    System.wait(200,function(){
                                        self.clear('EF2');
                                        self.drawImage(metroid_logo,{vAlign:'center',hAlign:'center', sWidth:'78.8%', layer: 'EF2'});
                                        System.wait(200,function(){
                                           self .clear('EF2');
                                           self.drawImage(metroid_logo,{vAlign:'center',hAlign:'center', sWidth:'100%', layer: 'EF2'});

                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
    });
})(RPG,window);