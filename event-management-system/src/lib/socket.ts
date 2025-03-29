import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { Chat } from '@/models/Chat';
import { canParticipateInChat } from '@/middleware/roleCheck';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

export const initializeSocket = (res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server);
    res.socket.server.io = io;

    io.use(async (socket, next) => {
      try {
        const session = await getServerSession(authOptions);
        
        if (!session || !canParticipateInChat(session.user.role)) {
          next(new Error('Unauthorized'));
          return;
        }

        socket.data.user = session.user;
        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Join chat room
      socket.on('join_chat', async (chatId: string) => {
        try {
          const chat = await Chat.findById(chatId);
          if (!chat) {
            socket.emit('error', 'Chat not found');
            return;
          }

          if (!chat.participants.includes(socket.data.user.id)) {
            socket.emit('error', 'Not a participant of this chat');
            return;
          }

          socket.join(chatId);
          socket.emit('joined_chat', chatId);
        } catch (error) {
          socket.emit('error', 'Failed to join chat');
        }
      });

      // Send message
      socket.on('send_message', async (data: {
        chatId: string;
        content: string;
        attachments?: { type: string; url: string; name: string; }[];
      }) => {
        try {
          const chat = await Chat.findById(data.chatId);
          if (!chat) {
            socket.emit('error', 'Chat not found');
            return;
          }

          const message = {
            sender: socket.data.user.id,
            content: data.content,
            timestamp: new Date(),
            readBy: [socket.data.user.id],
            attachments: data.attachments,
          };

          chat.messages.push(message);
          await chat.save();

          io.to(data.chatId).emit('new_message', {
            chatId: data.chatId,
            message,
          });
        } catch (error) {
          socket.emit('error', 'Failed to send message');
        }
      });

      // Mark messages as read
      socket.on('mark_read', async (data: {
        chatId: string;
        messageIds: string[];
      }) => {
        try {
          const chat = await Chat.findById(data.chatId);
          if (!chat) {
            socket.emit('error', 'Chat not found');
            return;
          }

          chat.messages = chat.messages.map(msg => {
            if (data.messageIds.includes(msg._id.toString())) {
              if (!msg.readBy.includes(socket.data.user.id)) {
                msg.readBy.push(socket.data.user.id);
              }
            }
            return msg;
          });

          await chat.save();

          io.to(data.chatId).emit('messages_read', {
            chatId: data.chatId,
            messageIds: data.messageIds,
            userId: socket.data.user.id,
          });
        } catch (error) {
          socket.emit('error', 'Failed to mark messages as read');
        }
      });

      // Handle typing status
      socket.on('typing_start', (chatId: string) => {
        socket.to(chatId).emit('user_typing', {
          chatId,
          userId: socket.data.user.id,
          name: socket.data.user.name,
        });
      });

      socket.on('typing_end', (chatId: string) => {
        socket.to(chatId).emit('user_stopped_typing', {
          chatId,
          userId: socket.data.user.id,
        });
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }
  return res.socket.server.io;
}; 