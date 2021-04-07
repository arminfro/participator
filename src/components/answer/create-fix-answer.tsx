import { Form, Radio } from 'antd';
import React, { ReactElement } from 'react';
import { FixAnswer as IFixAnswer } from '../../types/question';
import sort from '../utils/sort';

interface Props {
  fixAnswers: IFixAnswer[];
  setFixAnswerId: (id: number) => void;
  chosenAnswerId: number;
}

export default function CreateFixAnswer({
  fixAnswers,
  setFixAnswerId,
  chosenAnswerId,
}: Props): ReactElement {
  return (
    <Form.Item label={'Choose one answer'}>
      <Radio.Group
        value={chosenAnswerId}
        onChange={(e) => setFixAnswerId(e.target.value)}
      >
        {sort<IFixAnswer>(fixAnswers, 'text').map(
          (fixAnswer, index: number) => (
            <Radio key={index} value={fixAnswer.id}>
              {fixAnswer.text}
            </Radio>
          ),
        )}
      </Radio.Group>
    </Form.Item>
  );
}
