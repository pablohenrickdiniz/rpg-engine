const server = require('http').createServer();
const io = require('socket.io')(server);
const RPG = require('../RPG.js');
const port = 8080;

io.on('connection', client => {
    client.on('event', data => {

    });
    client.on('disconnect', () => {

    });
});

server.on('error', error => {
   if(error.code === 'EACCES'){
       console.error("A porta "+error.port+" está em uso");
   }
});

server.on('listening',() => {
   console.log("servidor iniciado na porta "+port);
});

server.listen(port);

