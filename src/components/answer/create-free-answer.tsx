import { Form } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React from 'react';

interface Props {
  setFreeAnswer: (answer: string) => void;
}
export default function CreateFreeAnswer({ setFreeAnswer }: Props) {
  return (
    <Form.Item label={'Type your Answer'}>
      <TextArea onChange={(e) => setFreeAnswer(e.target.value)} rows={4} />
    </Form.Item>
  );
}
