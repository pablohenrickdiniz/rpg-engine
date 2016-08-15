(function (root,w) {
    if (root.Scene == undefined) {
        throw "SceneIntro requires Scene"
    }

    w.SceneIntro = {
        audio: {
            BGM: {
                'opening': 'audio/01 - Opening (Destroyed Science Academy Research Station).mp3'
            }
        },
        images: {
            Misc: {
                'metroid-1994': 'img/1994-metroid.png',
                'nintendo-logo': 'img/nintendo-logo.png',
                Logo3: 'img/nintendo-logo.png'
            }
        },
        ready: function (rpg) {
            console.log('Scene Intro loaded...');
            var System = rpg.System,
                Video = System.Video,
                Audio = System.Audio,
                Graphic = System.Graphic;

            var nintendo_logo = Graphic.get('Misc','nintendo-logo');
            var metroid_logo = Graphic.get('Misc','metroid-1994');

            var nintendo_logo_options = {
                vAlign:'center',
                hAlign:'center',
                layer: 'EF2',
                time: 500
            };

            var metroid_logo_options = {
                dx:250,
                dy:250,
                sx:0,
                sy:0,
                sWidth:23,
                sHeight:35,
                layer: 'EF2'
            };


            Video.fadeInImage(nintendo_logo,nintendo_logo_options,function(){
                System.wait(1500, function () {
                    Video.fadeOutImage(nintendo_logo,nintendo_logo_options,function(){
                       System.wait(2000,function(){
                           Audio.play('BGM','opening');
                           System.wait(700,function(){
                               Video.drawGraphic(metroid_logo,{vAlign:'center',hAlign:'center',sWidth:23, sHeight:35, layer: 'EF2'});
                               System.wait(200,function(){
                                   Video.clear('EF2');
                                   Video.drawGraphic(metroid_logo,{vAlign:'center',hAlign:'center', sWidth:46, sHeight:35, layer: 'EF2'});
                                   System.wait(200,function(){
                                       Video.clear('EF2');
                                       Video.drawGraphic(metroid_logo,{vAlign:'center',hAlign:'center', sWidth:69, sHeight:35, layer: 'EF2'});
                                       System.wait(200,function(){
                                           Video.clear('EF2');
                                           Video.drawGraphic(metroid_logo,{vAlign:'center',hAlign:'center', sWidth:102, sHeight:35, layer: 'EF2'});
                                       });
                                   });
                               });
                           });
                        });
                    });
                });
            });
        }
    };
})(RPG,window);