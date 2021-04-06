import { subject } from '@casl/ability';
import { Button } from 'antd';
import Link from 'next/link';
import React, { ReactElement, useState } from 'react';
import { Room } from '../../types/room';
import { User } from '../../types/user';
import { Can } from '../utils/casl-context';
import Drawer from '../utils/drawer';
import Fetch from '../utils/fetch';
import RoomDashboard from './dashboard';
import RoomMemberManage from './member-manage';
import RoomPage from './page';

interface Props {
  room: Room;
}

export default function RoomDetails({ room }: Props): ReactElement {
  const [showEdit, setShowEdit] = useState(false);
  const joinedUsers = [room.admin, ...room.members];

  return (
    <RoomPage
      extra={[
        <Can I="update" this={subject('Room', room)} key="can-i-update">
          <Button onClick={() => setShowEdit(true)}>Manage</Button>
          <Drawer
            visible={showEdit}
            setVisibility={setShowEdit}
            title="Manage Room"
          >
            <h2>Room Manage</h2>
            <Fetch<User[]> url={`api/users`}>
              {(allUsers) => (
                <RoomMemberManage
                  allUsers={allUsers.filter(
                    (aUser) =>
                      !joinedUsers.some((jUser) => aUser.id === jUser.id),
                  )}
                  joinedUsers={room.members /* leave admin */}
                  roomId={room.id}
                />
              )}
            </Fetch>
            <Link href="/rooms/[id]/edit" as={`/rooms/${room.id}/edit`}>
              <button className="ui button yellow">Edit</button>
            </Link>
          </Drawer>
        </Can>,
      ]}
      room={room}
    >
      <RoomDashboard room={room} />
    </RoomPage>
  );
}
