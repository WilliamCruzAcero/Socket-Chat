var params = new URLSearchParams(window.location.search);

// referencias de jQuery
const divUsers = $('#divUsers');
const formSend = $('#formSend');
const txtMessage = $('#txtMessage');
const divChatbox = $('#divChatbox');

// funciones para renderizar usuarios
function renderUsers( people ) {
    console.log(people);

    let html = '';

    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span>'+ params.get('room') +'</span></a>';
    html += '</li>';

    for ( let i = 0; i < people.length; i++ ) {
        html += '<li>';
        html += '    <a data-id="'+ people[i].id +'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+ people[i].name +'<small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsers.html(html);
};

function renderMessage( message, myMessage ) {

    let html = '';
    const  date = new Date(message.date);
    const hour = date.getHours() + ':' + date.getMinutes();
    let adminClass = 'info';
    
    if ( message.name === 'Administrador' ) {
        adminClass = 'danger';
    };

    if ( myMessage ) {

        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>'+ message.name +'</h5>';
        html += '        <div class="box bg-light-inverse">'+ message.message +'</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">'+ hour +'</div>';
        html += '</li>';

    } else {

        html += '<li class="animated fadeIn">';

        if ( message.name !== 'Administrador') {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }

        html += '    <div class="chat-content">';
        html += '        <h5>'+ message.name +'</h5>';
        html += '        <div class="box bg-light-'+ adminClass +'">'+ message.message +'</div>';
        html += '    </div>';
        html += '    <div class="chat-time">'+ hour +'</div>';
        html += '</li>';
    };

    
    divChatbox.append(html);
};

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//listeners
divUsers.on('click', 'a', function() {
    var id = $(this).data('id');
    if ( id ) {
        console.log( id );
    }
});

formSend.on('submit', function(ev) {

    ev.preventDefault();
    if ( txtMessage.val().trim().length === 0) {
        return;
    };

    // Enviar información
    socket.emit('createMessage', {
        name: params.get('name'),
        message: txtMessage.val()
    }, function(message) {
        txtMessage.val('').focus();
        renderMessage( message, true );
        scrollBottom();
    });
});