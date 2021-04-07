import { Button, Form, Mentions } from 'antd';
import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Chat } from '../../types/chat';
import { User } from '../../types/user';
import { useScrollOnceForRef } from '../utils/hooks/use-scroll-once';

interface Props {
  onSubmit: (input: string, callback?: Dispatch<SetStateAction<Chat>>) => void;
  value: string;
  users: User[];
  onFinish?: () => void;
  scrollOnInit?: boolean;
}

export default function ChatForm({
  onSubmit,
  value,
  users,
  onFinish,
  scrollOnInit = false,
}: Props) {
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const [form] = Form.useForm();

  useScrollOnceForRef(scrollOnInit ? ref : { current: undefined });

  const onLocalSubmit = async () => {
    setLoading(true);
    onSubmit(form.getFieldValue('chat'), () => {
      setLoading(false);
      form.resetFields();
      onFinish && onFinish();
    });
  };

  return (
    <div ref={ref}>
      <Form form={form} initialValues={{ chat: value }}>
        <Form.Item name="chat">
          <Mentions autoSize={{ minRows: 2 }}>
            {users.map((user) => (
              <Mentions.Option key={`**${String(user.id)}**`} value={user.name}>
                {user.name}
              </Mentions.Option>
            ))}
          </Mentions>
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            loading={loading}
            onClick={onLocalSubmit}
            type="primary"
          >
            {value !== '' ? 'Edit' : onFinish ? 'Reply' : 'Add'}
          </Button>
          {onFinish && <Button onClick={onFinish}>Cancel</Button>}
        </Form.Item>
      </Form>
    </div>
  );
}
