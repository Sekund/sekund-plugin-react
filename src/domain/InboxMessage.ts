export interface InboxMessage {
  _id: string;
  title: string;
  sender: string;
  senderAvatar: string;
  sentTime: number;
  content: string;
}
