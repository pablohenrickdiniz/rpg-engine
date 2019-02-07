(function(root){
    let Scenes = root.Main.Scenes,
        Scene_Map = root.Scene_Map;

    Scenes.set("intro",new Scene_Map({
        map:{
            loop_x:false,
            loop_y:false,
            tilesets:[
                {
                    graphicID:"forest2",
                    cols:8,
                    rows:149,
                    width:256,
                    height:4768
                },
                {
                    graphicID:"cavesAndUnderground",
                    cols:8,
                    rows:17,
                    width:256,
                    height:544
                }
            ],
            spriteset:{
                width:100,
                height:100,
                tileWidth:32,
                tileHeight:32,
                data:[]
            }
        },
        objects:[
            {
                class:'Event',
                x:200,
                y:200,
                width:25,
                height:15,
                static:true,
                charaID:'switch',
                pages:[
                    {
                        trigger:[
                            RPG.Consts.TRIGGER_ACTION_BUTTON
                        ],
                        initialize:function(){
                            this.turnDown();
                        },
                        script:function(){
                            if(this.isSwitchDisabled('ON')){
                                this.turnRight();
                                this.playAudio('fx','switch2');
                                this.enableSwitch('ON');
                                this.enableGlobalSwitch('LAMP');
                            }
                            else{
                                this.turnDown();
                                this.playAudio('fx','switch1');
                                this.disableSwitch('ON');
                                this.disableGlobalSwitch('LAMP');
                            }
                        }
                    }
                ]
            },
            {
                class:'Event',
                x:122,
                y:400,
                width:20,
                height:20,
                pages:[
                    {
                        charaID:'lamp',
                        trigger:RPG.Consts.TRIGGER_AUTO_RUN,
                        light:false,
                        lightRadius:500,
                        initialize:function(){
                            this.turnLeft();
                        }
                    },
                    {
                        conditions:[
                            'GLOBAL:LAMP:ON'
                        ],
                        light : true,
                        lightRadius : 500,
                        charaID:'lamp',
                        trigger:RPG.Consts.TRIGGER_AUTO_RUN,
                        initialize:function(){
                            this.turnDown();
                        }
                    }
                ]
            },
            {
                class:'Event',
                x:500,
                y:400,
                width:20,
                height:20,
                pages:[
                    {
                        charaID:'lamp',
                        trigger:RPG.Consts.TRIGGER_AUTO_RUN,
                        light:false,
                        lightRadius:500,
                        initialize:function(){
                            this.turnLeft();
                        }
                    },
                    {
                        conditions:[
                            'GLOBAL:LAMP:ON'
                        ],
                        light : true,
                        lightRadius : 500,
                        charaID:'lamp',
                        trigger:RPG.Consts.TRIGGER_AUTO_RUN,
                        initialize:function(){
                            this.turnDown();
                        }
                    }
                ]
            },
//                    {
//                        class:'Event',
//                        x:300,
//                        y:300,
//                        pages:[
//                            {
//                                animationSpeed:10,
//                                width:32,
//                                height:32,
//                                charaID:'butterfly',
//                                light:true,
//                                lightColor:'rgba(255,100,100,1)',
//                                through:true,
//                                script:function(){
//                                    this.step
//                                }
//                            }
//                        ]
//                    }
        ]
    }));
})(RPG);