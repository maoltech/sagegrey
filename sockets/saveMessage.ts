import { Message } from "../model/message.model";

export const saveMessage = async(messageData: any) => {
    const message = new Message(messageData);
     return await message.save();
    // console.log('Message saved:', message);
  };
  
  export const getConversation = async(userId: string) => {
    try {
        const conversations = await Message.aggregate([
          {
            $match: {
              $or: [{ sender: userId }, { recipient: userId }],
            },
          },
          {
            $group: {
              _id: {
                $cond: [
                  { $eq: ['$sender', userId] },
                  '$recipient',
                  '$sender',
                ],
              },
              lastMessage: { $last: '$$ROOT' },
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: '_id',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $unwind: '$user',
          },
          {
            $project: {
              _id: 0,
              user: { _id: 1, name: 1 },
              lastMessage: { content: 1, timestamp: 1 },
            },
          },
        ]);
        console.log(`Conversations retrieved for user: ${userId}`);
        return conversations;
      } catch (error) {
        console.error('Error retrieving conversations:', error);
        return [];
      }
  };
  
  export const getConversations = async(senderId: string, recipientId: string) => {
      
    return await Message.find({
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: recipientId, recipient: senderId }
      ]
    }).sort({ timestamp: 1 });
  }