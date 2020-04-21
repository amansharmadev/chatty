const io = require('socket.io')(3000);

let list = [{
    id: 1,
    email: 'a@a.com',
    pass: '123456',
    name: 'Aman',
    socketId: null
},
{
    id: 2,
    email: 'b@b.com',
    pass: '123456',
    name: 'HP',
    socketId: null
}]

io.on('connection', (socket) => {
    /**
     * Firstly, if a clients login we set its id in our db.
     * As a client is login
     */
    modifyUserStatus(socket.id, socket.handshake.query['id'], 'connect');


    /**
     * After, a client login
     * Checking how many messages he got pending
     */
    checkIfPendingMessages(socket, socket.handshake.query['id']);


    /**
     * If a client gets disconnected,
     * update its status into offline
     */
    socket.on('disconnect', type => { modifyUserStatus(socket.id, null, 'disconnect') })

    /**
     * If a user send messages,
     * we check receipent info and send message
     */
    socket.on('new_message' , (data)=>{
        sendMessageToClient(data);
    })
})


function checkIfPendingMessages (socket, userId) {
    try {
        let pendingMessages = [1];
        pendingMessages.forEach( a => {
            socket.emit('recieve_new_message',{from:'chatty', message:userId});
        })
    } catch (error) {
        console.log(error);
    }
}


function sendMessageToClient ( data ){
    let findUser = list[list.findIndex(u=>u.id==data.id)];
    if(findUser && findUser.socketId)
    io.to(findUser.socketId).emit('recieve_new_message', {message:data.message, from: data.id});
}




function modifyUserStatus(socketId, userId, status) {
    try {
        if (status == 'connect') {
            list[list.findIndex(u => u.id == userId)].socketId = socketId;
        } else {
            list.find(u => u.socketId == socketId).socketId = null;
        }
    } catch (error) {
        console.log(error);
    }
}
