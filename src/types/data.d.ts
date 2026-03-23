interface Conversation {
  _id: string;
  identifier: string;
  users: Array<string>;
  blocked: Array<string>;
  blackList: Array<string>;
  lockedInvite: boolean;
  admins: Array<string>;
  creation_date: string;
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
  conversation: string;
  sent_date: Date;
  edited_date: Date | undefined;
  message: string;
  content: string;
  content_type: string;
  hidden: boolean;
  trueId?: string;
  error?: boolean;
  temporary?: boolean;
}

interface Request {
  _id: string;
  requester: typeof Types.ObjectId;
  destinator: typeof Types.ObjectId;
  date: Date;
}

interface Contact {
  _id: string;
  identifier: string;
  creation_date: string;
  user: User;
}
