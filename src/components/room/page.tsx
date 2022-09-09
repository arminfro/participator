import { Layout, Menu } from 'antd';
import Link from 'next/link';
import React, { CSSProperties, ReactElement } from 'react';
import { Room } from '../../types/room';
import Page, { Path } from '../utils/container/page';
import useMobile from '../utils/hooks/use-mobile';

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
  const { isMobile } = useMobile();

  const menuItemStyle: CSSProperties = isMobile ? { paddingLeft: 5 } : {};
  const siderStyle: CSSProperties = isMobile
    ? { minWidth: 60, maxWidth: 60 }
    : {};

  return (
    <Page
      path={paths}
      extra={extra}
      sider={
        <Layout.Sider style={siderStyle} breakpoint={'md'}>
          <Menu
            mode="inline"
            selectedKeys={[paths[paths.length - 1].name]}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item style={menuItemStyle} key={room.name}>
              <Link href="/rooms/[id]" as={`/rooms/${room.id}`}>
                Dashboard
              </Link>
            </Menu.Item>
            <Menu.Item style={menuItemStyle} key="Users">
              <Link href="/rooms/[id]/users" as={`/rooms/${room.id}/users`}>
                Users
              </Link>
            </Menu.Item>
            <Menu.Item style={menuItemStyle} key="Chat">
              <Link href="/rooms/[id]/chat" as={`/rooms/${room.id}/chat`}>
                Chat
              </Link>
            </Menu.Item>
            <Menu.Item style={menuItemStyle} key="Questions">
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
