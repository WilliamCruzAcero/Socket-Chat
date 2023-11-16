const socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios');
}

const user = {
    name: params.get('name'),
    room: params.get('room')
};

socket.on('connect', function() {

    console.log('Conectado al servidor');

    socket.emit('enterChat', user, function( resp ) {
        renderUsers(resp);
    });
});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

// Enviar información
// socket.emit('crearMensaje', {
//     nombre: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('createMessage', function( message ) {
    renderMessage( message, false );
    scrollBottom();
});

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del chat
socket.on('listConnectedPerson', function( users ) {
    renderUsers( users );
});

// Mensajes privados
socket.on('privateMessage', function(message) {
    console.log('Mensaje Privado:', message);
});