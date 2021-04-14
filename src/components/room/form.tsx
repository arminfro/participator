import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import Form from '../utils/container/form/form';
import { FormInputItem } from '../utils/container/form/input-item';
import FormRadioGroupItem from '../utils/container/form/radio-group-item';
import FormTextareaItem from '../utils/container/form/textarea-item';
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
      <Form<T> onSubmit={onSubmit} struct={room}>
        <FormInputItem label="Name" name="name" />
        <FormRadioGroupItem
          label="Join Policy"
          name="openToJoin"
          choices={[
            { value: true, label: 'Open to join' },
            { value: false, label: 'Only on invitation' },
          ]}
        />
        <FormTextareaItem label="Description" name="description" />
      </Form>
    </>
  );
}
