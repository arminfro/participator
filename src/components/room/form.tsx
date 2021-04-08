import { Button, Form, Input, Radio, RadioChangeEvent } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { JoinConditions, RoomCreate, RoomUpdate } from '../../types/room';
import formItemValidator from '../utils/funcs/form-item-validation';
import { UseStructWithValidation } from '../utils/hooks/use-struct';

interface Props {
  room:
    | UseStructWithValidation<RoomCreate>
    | UseStructWithValidation<RoomUpdate>;
  roomId?: number; // present if `isEdit`
  onCloseDrawer?: () => void;
}

export default function RoomForm({
  room,
  roomId,
  onCloseDrawer,
}: Props): ReactElement {
  const router = useRouter();

  const onSubmit = () => {
    room.sync(() => {
      onCloseDrawer
        ? onCloseDrawer()
        : router.push(`/rooms${roomId ? `/${roomId}` : ''}`);
    });
  };

  const onChangeJoinPolicy = (e: RadioChangeEvent) =>
    room.set.openToJoin(e.target.value === JoinConditions.Open, false);

  return (
    <Form initialValues={room.get} onFinish={onSubmit}>
      <Form.Item
        name="name"
        label="Name"
        rules={[formItemValidator(room.validationErrors)]}
      >
        <Input
          value={room.get.name}
          onChange={(e) => room.set.name(e.target.value, false)}
        />
      </Form.Item>
      <Form.Item label="Join Policy">
        <Radio.Group
          value={
            room.get.openToJoin ? JoinConditions.Open : JoinConditions.Closed
          }
          onChange={onChangeJoinPolicy}
        >
          <Radio value={JoinConditions.Open}>Open to Join</Radio>
          <Radio value={JoinConditions.Closed}>Only on invitation</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="Description">
        <TextArea
          autoSize
          value={room.get.description}
          onChange={(e) => room.set.description(e.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
