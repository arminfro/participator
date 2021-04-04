import { Button, Form, Mentions } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Chat } from '../../types/chat';
import { User } from '../../types/user';

interface Props {
  onSubmit: (input: string, callback?: Dispatch<SetStateAction<Chat>>) => void;

  value: string;
  users: User[];
  onFinish?: () => void;
}
export default function ChatForm({ onSubmit, value, users, onFinish }: Props) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onLocalSubmit = async () => {
    setLoading(true);
    onSubmit(form.getFieldValue('chat'), () => {
      setLoading(false);
      form.resetFields();
      onFinish && onFinish();
    });
  };

  return (
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
  );
}
