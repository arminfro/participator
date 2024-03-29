import { subject } from '@casl/ability';
import { useRouter } from 'next/router';
import React from 'react';
import RoomMemberManage from '../../../components/room/member-manage';
import RoomPage from '../../../components/room/page';
import UserList from '../../../components/user/list';
import { Can } from '../../../components/utils/context/casl-context';
import Drawer from '../../../components/utils/container/drawer';
import { Room } from '../../../types/room';
import { User } from '../../../types/user';
import FetchDynamicImport from '../../../components/utils/container/fetch-dynamic-import';

export default function RoomUsers() {
  const router = useRouter();
  return (
    <FetchDynamicImport<Room> url={`api/rooms/${router.query.id}`}>
      {(room) => (
        <RoomPage
          room={room}
          path={[{ name: 'Users', url: `/rooms/${room.id}/users` }]}
          extra={[
            <Can I="update" this={subject('Room', room)} key="can-i-update">
              <Drawer action="Manage" subject="rooms users">
                {(onClose: () => void) => (
                  <FetchDynamicImport<User[]> url={`api/users`}>
                    {(allUsers) => (
                      <RoomMemberManage
                        allUsers={allUsers.filter(
                          (aUser) =>
                            ![room.admin, ...room.members].some(
                              (jUser) => aUser.id === jUser.id,
                            ),
                        )}
                        joinedUsers={room.members /* leave admin */}
                        roomId={room.id}
                        onCloseDrawer={onClose}
                      />
                    )}
                  </FetchDynamicImport>
                )}
              </Drawer>
            </Can>,
          ]}
        >
          <UserList users={[room.admin, ...room.members]} />
        </RoomPage>
      )}
    </FetchDynamicImport>
  );
}
