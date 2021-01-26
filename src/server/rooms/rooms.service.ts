import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository, UpdateResult } from 'typeorm';
import { RoomCreate, RoomUpdate } from '../../types/room';
import { User } from '../users/user.entity';
import { Room } from './room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private roomsRepository: Repository<Room>,
  ) {}

  async create(roomCreate: RoomCreate): Promise<Room> {
    const room = await this.build(roomCreate);
    console.log('room to save', room);
    await getManager().save(room);
    return room;
  }

  async findAll(): Promise<Room[]> {
    return await this.roomsRepository.find({
      relations: ['admin', 'members'],
    });
  }

  async findOne(id: number): Promise<Room | undefined> {
    const room = await this.roomsRepository.findOne(id, {
      relations: ['admin', 'members'],
    });
    return room;
  }

  async update(
    id: number,
    roomUpdate: RoomUpdate,
  ): Promise<UpdateResult | void> {
    const room = await this.findOne(id);
    if (room) {
      if (roomUpdate.addMember) {
        if (roomUpdate.addMember.id === room.admin.id) {
          return;
        }
        room.members = [
          // filter makes sure user is unique
          ...room.members.filter((user) => user.id !== roomUpdate.addMember.id),
          roomUpdate.addMember as User,
        ];
        await this.roomsRepository.save(room);
        // todo, use this case
      } else if (roomUpdate.removeMember) {
        room.members = room.members.filter(
          (user) => user.id !== roomUpdate.removeMember.id,
        );
        return await this.roomsRepository.update(id, room);
      } else if (roomUpdate.updateAttrs) {
        return await this.roomsRepository.update(id, roomUpdate.updateAttrs);
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
}
