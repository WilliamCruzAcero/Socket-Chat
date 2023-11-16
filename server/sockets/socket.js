const { io } = require('../server');
const { Users } = require('../class/users');
const { createMessage } = require('../utils/utils');

const users = new Users();

io.on('connection', (client) => {

    client.on('enterChat', (data, callback) => {

        if ( !data.name || !data.room ) {
            return callback({
                error: true,
                msg: 'El nombre/room es necesario'
            });
        }

        client.join(data.room);

        users.addPerson( client.id, data.name, data.room );

        client.broadcast.to(data.room).emit( 'listConnectedPerson', users.getPeopleRoom( data.room ));
        callback( users.getPeopleRoom( data.room) );
    });

    client.on( 'createMessage', (data) => {

        let person = users.getPerson( client.id)

        let message = createMessage( person.name, data.message );
        client.broadcast.to(person.room).emit( 'createMessage', message );
    })

    client.on('disconnect', () => {

        let deletedPerson = users.deletePerson( client.id )

        client.broadcast.to(deletedPerson.room).emit('createMessage', createMessage('Administrador', `${deletedPerson.name} abandono el chat`));
        client.broadcast.to(deletedPerson.room).emit( 'listConnectedPerson', users.getPeopleRoom( deletedPerson.room ));
    });

    //mensajes privados
    client.on('privateMessage', data => {

        let person = users.getPerson( client.id );
        client.broadcast.to(data.addressee).emit( 'privateMessage', createMessage(person.name, data.message));
    })
});