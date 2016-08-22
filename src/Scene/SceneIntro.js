(function (root,w) {
    if (root.Scene == undefined) {
        throw "SceneIntro requires Scene"
    }

    var Scene = root.Scene;

    w.SceneIntro = new Scene({
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
        ready:function (rpg) {
            var System = rpg.System,
                Resources = rpg.Resources,
                Video = System.Video,
                Audio = System.Audio,
                Graphic = Resources.Graphic,
                keyboard = System.Controls.Keyboard;

            keyboard.addShortcutListener('ESC',function(){
                if (!System.running) {
                    System.run();
                }
                else {
                    System.pause();
                }
            });

            keyboard.addShortcutListener('ENTER', function () {
                rpg.actionEvents();
            });

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
                                Video.drawGraphic(metroid_logo,{vAlign:'center',hAlign:'center',sWidth:'20.6%', layer: 'EF2'});
                                System.wait(200,function(){
                                    Video.clear('EF2');
                                    Video.drawGraphic(metroid_logo,{vAlign:'center',hAlign:'center', sWidth:'48.2%', layer: 'EF2'});
                                    System.wait(200,function(){
                                        Video.clear('EF2');
                                        Video.drawGraphic(metroid_logo,{vAlign:'center',hAlign:'center', sWidth:'78.8%', layer: 'EF2'});
                                        System.wait(200,function(){
                                            Video.clear('EF2');
                                            Video.drawGraphic(metroid_logo,{vAlign:'center',hAlign:'center', sWidth:'100%', layer: 'EF2'});
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