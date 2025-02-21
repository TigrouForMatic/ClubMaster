const { Server } = require('socket.io');

function initializeWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'https://clubmaster.fr', 'https://www.clubmaster.fr'],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('Nouvelle connexion WebSocket établie');

    socket.on('joinConversation', (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`Client rejoint la conversation ${conversationId}`);
    });

    socket.on('leaveConversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
      console.log(`Client quitte la conversation ${conversationId}`);
    });

    socket.on('newMessage', async (messageData) => {
      try {
        // Émettre le message à tous les clients dans la conversation
        io.to(`conversation_${messageData.conversationid}`).emit('messageReceived', messageData);
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client déconnecté');
    });
  });

  return io;
}

module.exports = initializeWebSocket; 