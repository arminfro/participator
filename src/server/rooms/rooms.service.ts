import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Failure } from 'superstruct';
import { Repository, UpdateResult } from 'typeorm';
import { RoomCreate, RoomUpdate } from '../../types/room';
import {
  validateRoomCreate,
  validateRoomUpdate,
} from '../../types/room.validation';
import { ChatsService } from '../chats/chats.service';
import { User } from '../users/user.entity';
import { Room } from './room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private roomsRepository: Repository<Room>,
    private chatsService: ChatsService,
  ) {}

  async create(roomCreate: RoomCreate): Promise<Room> {
    const room = await this.build(roomCreate);
    this.validateRoom(room, validateRoomCreate(roomCreate)[0] || []);
    await this.roomsRepository.save(room);
    room.chat = await this.chatsService.create(
      { userId: room.admin.id, msg: `Room chat for ${room.name}` },
      room.id,
    );
    await this.roomsRepository.save(room);
    return room;
  }

  async findAll(): Promise<Room[]> {
    return await this.roomsRepository.find({
      relations: ['admin', 'members'],
    });
  }

  async findOne(id: number): Promise<Room | undefined> {
    const room = await this.roomsRepository.findOne(id, {
      relations: ['admin', 'members', 'chat', 'questions', 'questions.answers'],
    });
    return room;
  }

  async update(
    id: number,
    roomUpdate: RoomUpdate,
  ): Promise<UpdateResult | void> {
    const room = await this.findOne(id);
    if (validateRoomUpdate(roomUpdate) && room) {
      if (roomUpdate.addMember) {
        if (roomUpdate.addMember.id === room.admin.id) {
          return;
        }
        room.members = [
          ...room.members.filter((user) => user.id !== roomUpdate.addMember.id),
          roomUpdate.addMember as User,
        ];
        await room.save();
      } else if (roomUpdate.removeMember) {
        room.members = room.members.filter(
          (user) => user.id !== roomUpdate.removeMember.id,
        );
        await room.save();
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { addMember, removeMember, ...roomUpdateAttrs } = roomUpdate;
        return await this.roomsRepository.update(id, roomUpdateAttrs);
      }
    }
  }

  async remove(id: number): Promise<void> {
    await this.roomsRepository.delete(id);
  }

  async build(roomCreate: RoomCreate): Promise<Room> {
    const room = new Room();
    room.name = roomCreate.name;
    room.admin = roomCreate.admin as User;
    room.openToJoin = roomCreate.openToJoin;
    room.description = roomCreate.description;
    return room;
  }

  private async validateRoom(
    room: Room,
    failures: Failure[],
  ): Promise<void | never> {
    const validationErrors = room ? await validate(room) : [];

    const errors = [
      ...failures.map((failure) => failure.message),
      ...validationErrors.map((err) => err.toString(false)),
    ];

    if (errors.length > 0 || !room) {
      throw new HttpException(errors.join('. '), HttpStatus.BAD_REQUEST);
    }
  }
}
