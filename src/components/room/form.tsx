import React, { ReactElement } from 'react';
import { RoomCreate, RoomUpdate } from '../../types/room';
import Form from '../utils/container/form/form';
import { FormInputItem } from '../utils/container/form/input-item';
import FormRadioGroupItem from '../utils/container/form/radio-group-item';
import FormTextareaItem from '../utils/container/form/textarea-item';
import { UseStruct } from '../utils/hooks/use-struct';

interface Props<T> {
  room: UseStruct<T>;
  onCloseDrawer: () => void;
}

export default function RoomForm<T = RoomUpdate | RoomCreate>({
  room,
  onCloseDrawer,
}: Props<T>): ReactElement {
  const onSubmit = (promise: Promise<T>) => promise.then(onCloseDrawer);
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
