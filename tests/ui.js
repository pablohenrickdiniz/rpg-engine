(function(root,w){
    let UI = w.UI;

    let requiredInteractCallbacks = [];

    let sceneLoadProgress = new UI.Progress_Bar({
        id:'loading-progress'
    });

    let playerInfo = new UI.Player_Info({
        id:'player-info',
        visible:false
    });

    let playerInventory = new UI.Inventory({
        id:'inventory',
        class:'window inventory',
        width:200,
        height:323,
        visible:false,
        draggable:true,
        left:300,
        top:300
    });

    let stats =  new UI.Stats({
        id:'stats',
        class:'window stats',
        width:200,
        height:300,
        visible:false,
        draggable:true,
        left:300,
        top:300
    });

    let continueButton = new UI.Button({
        id:'continue',
        class:'dom-interact',
        text:'CLICK TO CONTINUE',
        visible:false
    });

    continueButton.on('leftclick',function(){
        while(requiredInteractCallbacks.length > 0){
            requiredInteractCallbacks.pop()();
        }
        continueButton.visible = false;
        sceneLoadProgress.visible = true;
    });

    function windowresize(){
        UI.height = w.innerHeight;
        UI.width = w.innerWidth;
    }

    root.Events.on('initialize',function(){
        UI.initialize('ui-root');
        let ui = UI.root;
        ui.add(sceneLoadProgress);
        ui.add(playerInfo);
        ui.add(playerInventory);
        ui.add(stats);
        ui.add(continueButton);
        UI.width = w.innerWidth;
        UI.height = w.innerHeight;
        w.addEventListener('resize',windowresize);
    });

    root.Events.on('finalize',function(){
        w.removeEventListener('resize',windowresize);
    });

    root.Events.on('sceneLoaded',function(){
        sceneLoadProgress.visible = false;
    });

    root.Events.on('sceneProgress',function(progress){
        sceneLoadProgress.progress = progress;
    });

    root.Events.on('playerChanged',function(actor){
        if(actor != null){
            playerInfo.player = actor;
            stats.character = actor;
            playerInfo.visible = true;
            playerInventory.inventory = actor.inventory;
        }
        else{
            playerInfo.player = null;
            stats.character = null;
            playerInfo.visible = false;
            playerInventory.inventory = null;
        }
    });

    root.Events.on('keyboardCreate',function(keyboard){
        keyboard.on('state,I,active', function () {
            playerInventory.visible = !playerInventory.visible;
        });

        keyboard.on('state,S,active', function () {
            stats.visible = !stats.visible;
        });
    });

    root.Events.on('requireDOMInteraction',function(callback){
        requiredInteractCallbacks.push(callback);
        continueButton.visible = true;
        sceneLoadProgress.visible = false;
    });
})(RPG,window);