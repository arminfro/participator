// import io from 'socket.io-client';
import { urlWithProtocol } from '../../src/constants';
import { Chat, ChatCreate, Events } from '../../src/types/chat';
import { Room } from '../../src/types/room';
import GenericSeeder from './generic-seeder';

export default class ChatSeeder extends GenericSeeder<Chat> {
  token: string;
  socket: SocketIOClient.Socket;

  constructor(userToken: string, public userId: number, public room: Room) {
    super();
    this.token = userToken;
    this.create = this.create.bind(this);

    const namespace = `${urlWithProtocol}/rooms/${this.room.id}/chat`;
    // todo, doesn't work
    // this.socket = io.connect(namespace, {
    //   transportOptions: {
    //     polling: {
    //       extraHeaders: {
    //         Authorization: `${this.token}`,
    //       },
    //     },
    //   },
    // });

    // this.socket.on('connect', () => {
    //   // todo, is never called
    //   console.log('ws connected');
    //   this.create();
    //   this.socket.off('connect');
    // });
  }

  async create() {
    this.socket.emit(Events.create, {
      msg: 'Hello Chat, pls parse my [link](https://en.wikipedia.org/wiki/Web_Application_Description_Language)',
      userId: this.userId,
      parentId: this.room.chat.id,
    } as ChatCreate);
  }
}
