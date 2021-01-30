import Room from './room';
import User from './user';

export interface ChatCreate {
  roomId: number;
  userId: number;
  msg: string;
}

export default interface Chat {
  readonly id: number;
  readonly msg: string;
  readonly room: Room;
  readonly user: User;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
