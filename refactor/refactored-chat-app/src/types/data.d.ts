interface Conversation {
  _id: string;
  identifier: string;
  users: Array<Types.ObjectId>;
  blocked: Array<Types.ObjectId>;
  blackList: Array<Types.ObjectId>;
  lockedInvite: boolean;
  admins: Array<Types.ObjectId>;
  creation_date: Date;
  name: string;
}
interface User {
  _id: string;
  username: string;
  personal_name: string;
  email: string;
  profile_picture: string;
  role: string;
}

interface Message {
  _id: string;
  sender: typeof Types.ObjectId;
  conversation: typeof Types.ObjectId;
  sent_date: Date;
  edited_date: Date | undefined;
  message: string;
  content: string;
  content_type: string;
  hidden: boolean;
}

interface Request {
  _id: string;
  requester: typeof Types.ObjectId;
  destinator: typeof Types.ObjectId;
  date: Date;
}
