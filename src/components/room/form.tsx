import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import FormContainer from '../utils/container/form';
import { UseStruct } from '../utils/hooks/use-struct';

interface Props<T> {
  room: UseStruct<T>;
  roomId?: number; // present if `isEdit`
  onCloseDrawer?: () => void;
}

export default function RoomForm<T>({
  room,
  roomId,
  onCloseDrawer,
}: Props<T>): ReactElement {
  const router = useRouter();

  const onSubmit = () => {
    room.sync(() => {
      onCloseDrawer
        ? onCloseDrawer()
        : router.push(`/rooms${roomId ? `/${roomId}` : ''}`);
    });
  };

  return (
    <>
      <FormContainer<T>
        onSubmit={onSubmit}
        struct={room}
        items={[
          { type: 'input', name: 'name', label: 'Name' },
          {
            type: 'radio',
            name: 'openToJoin',
            label: 'Open to Join',
            choices: [
              { value: true, label: 'Open to join' },
              { value: false, label: 'Only on invitation' },
            ],
          },
          { type: 'textarea', name: 'description', label: 'Description' },
        ]}
      />
    </>
  );
}
