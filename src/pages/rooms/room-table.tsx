import { subject } from '@casl/ability';
import { useRouter } from 'next/router';
import React, { SyntheticEvent } from 'react';
import { Action } from '../../casl/action';
import { Room, RoomUpdate } from '../../types/room';
import api from '../utils/api';
import { useAbility } from '../utils/casl-context';
import { useStore } from '../utils/store/context';

interface Props {
  rooms: Room[];
}

export default function RoomTable({ rooms }: Props) {
  const {
    store: { user },
  } = useStore();

  const ability = useAbility();
  const router = useRouter();

  const canReadRoom = (room: Room): boolean => {
    return ability.can(Action.Read, subject('Room', room));
  };

  const onGoToRoom = (room: Room) => {
    canReadRoom(room) && router.push(`/rooms/${room.id}`);
  };

  const onJoin = (event: SyntheticEvent, roomId: number) => {
    event.preventDefault();
    const data: RoomUpdate = { addMember: user };
    api<Room>(
      'patch',
      `api/rooms/${roomId}`,
      () => onGoToRoom(rooms.find((r) => r.id === roomId)),
      data,
    );
  };

  return (
    <table className="ui celled striped table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Members Count</th>
          <th>Open to join</th>
          <th>Room Joined?</th>
        </tr>
      </thead>
      <tbody>
        {rooms.map((room) => (
          <tr
            key={room.id}
            className={canReadRoom(room) && 'pointer'}
            onClick={() => onGoToRoom(room)}
          >
            <td className="wi-100">{room.name}</td>
            <td>{room.description}</td>
            <td className="wi-100">{room.members.length + 1}</td>
            <td className="center aligned wi-100">
              {room.openToJoin && <i className="large green check icon" />}
            </td>
            <td className="center aligned wi-100">
              {canReadRoom(room) ? (
                <i
                  className={`large icon ${
                    room.admin.id === user.id ? 'yellow star' : 'green check'
                  }`}
                />
              ) : (
                room.openToJoin && (
                  <button
                    onClick={(e) => onJoin(e, room.id)}
                    className="ui button"
                  >
                    Join
                  </button>
                )
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
