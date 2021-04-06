import { Layout, Menu } from 'antd';
import Link from 'next/link';
import React, { ReactElement } from 'react';
import { Room } from '../../types/room';
import Page, { Path } from '../utils/page';

interface Props {
  room: Room;
  children: ReactElement | ReactElement[];
  path?: Path[];
  extra?: ReactElement[];
}

export default function RoomPage({
  room,
  path = [],
  extra = [],
  children,
}: Props) {
  const paths = [
    { name: 'Home', url: '/' },
    { name: 'Rooms', url: '/rooms' },
    { name: room.name, url: `/rooms/${room.id}` },
    ...path,
  ];

  return (
    <Page
      path={paths}
      extra={extra}
      sider={
        <Layout.Sider>
          <Menu
            mode="inline"
            defaultSelectedKeys={[paths[paths.length - 1].name]}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key={room.name}>
              <Link href="/rooms/[id]" as={`/rooms/${room.id}`}>
                Dashboard
              </Link>
            </Menu.Item>
            <Menu.Item key="Users">
              <Link href="/rooms/[id]/users" as={`/rooms/${room.id}/users`}>
                Users
              </Link>
            </Menu.Item>
            <Menu.Item key="Chat">
              <Link href="/rooms/[id]/chat" as={`/rooms/${room.id}/chat`}>
                Chat
              </Link>
            </Menu.Item>
            <Menu.Item key="Questions">
              <Link
                href="/rooms/[id]/questions"
                as={`/rooms/${room.id}/questions`}
              >
                Questions
              </Link>
            </Menu.Item>
          </Menu>
        </Layout.Sider>
      }
    >
      {children}
    </Page>
  );
}
