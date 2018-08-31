'use strict';
(function(root){
    if(root.Game_Player === undefined){
        throw "Game_Party requires Game_Player";
    }

    let Game_Player = root.Game_Player;

    root.Game_Party = {
        $player:new Game_Player(),
        $actors:[]
    };
})(RPG);