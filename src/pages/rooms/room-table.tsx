import { useRouter } from 'next/router';
import React, { SyntheticEvent } from 'react';
import { Room, RoomUpdate } from '../../types/room';
import api from '../utils/api';
import { useStore } from '../utils/store/context';

interface Props {
  rooms: Room[];
}

export default function RoomTable({ rooms }: Props) {
  const {
    store: { user },
  } = useStore();

  const router = useRouter();

  const isUserPartOfRoom = (room: Room): boolean => {
    return !!(
      room.members.find((rUser) => rUser.id === user.id) ||
      room.admin.id === user.id
    );
  };

  const onGoToRoom = (roomId: number) => {
    router.push(`/rooms/${roomId}`);
  };

  const onJoin = (event: SyntheticEvent, roomId: number) => {
    event.preventDefault();
    const data: RoomUpdate = { addMember: user };
    api<Room>('patch', `api/rooms/${roomId}`, () => onGoToRoom(roomId), data);
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
            className="pointer"
            onClick={() => onGoToRoom(room.id)}
          >
            <td className="wi-100">{room.name}</td>
            <td>{room.description}</td>
            <td className="wi-100">{room.members.length + 1}</td>
            <td className="center aligned wi-100">
              {room.openToJoin && <i className="large green check icon" />}
            </td>
            <td className="center aligned wi-100">
              {isUserPartOfRoom(room) ? (
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
