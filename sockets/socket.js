const {io} = require('../index');
const {comprobarJWT} = require('../helpers/jwt');
const {usuarioConectado, usuarioDesconectado, grabarMensaje} = require('../controllers/socket');

// Mensajes de Sockets
io.on('connection', async (client) => {
    console.log('Cliente conectado');

    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);

    //Verificar autenticacion
    if (!valido) { return client.disconnect();}

    //Cliente autenticado
    await usuarioConectado(uid);

    //Ingresar al usuario a una sala en aprticular
    // sala global, client.id 6437ea8b7b97665f5657f7f5
    client.join(uid);

    //Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', async (payload) => {
        await grabarMensaje(payload);

        io.to(payload.para).emit('mensaje-personal', payload);
    });

    client.on('disconnect', async () => {
        await usuarioDesconectado(uid);
    });

});
