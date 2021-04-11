import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Form,
  Input,
  Radio,
  RadioChangeEvent,
  Space,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { QuestionCreate, QuestionUpdate } from '../../types/question';
import { UseStruct } from '../utils/hooks/use-struct';

interface Props {
  question: UseStruct<QuestionCreate | QuestionUpdate>;
  roomId: number;
  questionId?: number;
  onCloseDrawer?: () => void;
}

const presets = [
  {
    label: 'From 1 to 10',
    fixAnswers: [
      { text: '1' },
      { text: '2' },
      { text: '3' },
      { text: '4' },
      { text: '5' },
      { text: '6' },
      { text: '7' },
      { text: '8' },
      { text: '9' },
      { text: '10' },
    ],
  },
];

export default function QuestionForm({
  question,
  roomId,
  questionId,
  onCloseDrawer,
}: Props): ReactElement {
  const router = useRouter();

  const answersFormatSelect = (e: RadioChangeEvent) => {
    question.set.answersFormat(e.target.value);
  };

  const onChangeFixAnswer = (newValue: string, index: number) => {
    question.set.fixAnswers((currentFixAnswers) => {
      const copyFixAnswers = [...currentFixAnswers];
      copyFixAnswers[index] = { ...copyFixAnswers[index], text: newValue };
      return copyFixAnswers;
    });
  };

  const onAddFixAnswer = () => {
    question.set.fixAnswers((currentFixAnswers) => [
      ...currentFixAnswers,
      { text: '' },
    ]);
  };

  const onRemoveFixAnswer = () => {
    question.set.fixAnswers((currentFixAnswers) => {
      const copyFixAnswers = [...currentFixAnswers];
      if (copyFixAnswers.length > 1) {
        copyFixAnswers.pop();
      }
      return copyFixAnswers;
    });
  };

  const onSubmit = () => {
    question.sync(() => {
      onCloseDrawer && onCloseDrawer();
      router.push(
        `/rooms/${roomId}/questions${questionId ? `/${questionId}` : ''}`,
      );
    });
  };

  return (
    <Form initialValues={question.get} onFinish={onSubmit}>
      <Form.Item label={'Your answer type'}>
        <Radio.Group
          value={question.get.answersFormat}
          onChange={answersFormatSelect}
        >
          <Radio value={'fix'}>fix answers</Radio>
          <Radio value={'free'}>free answers</Radio>
        </Radio.Group>
      </Form.Item>
      <Divider />
      <Form.Item label="Your polling question">
        <TextArea
          autoSize
          value={question.get.text}
          onChange={(e) => question.set.text(e.target.value)}
          placeholder="Type your question"
        />
      </Form.Item>
      {question.get.answersFormat === 'fix' && (
        <>
          <Divider />
          <Form.Item label="Choose a Preset">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                onClick={() => question.set.fixAnswers(preset.fixAnswers)}
              >
                {preset.label}
              </Button>
            ))}
          </Form.Item>
        </>
      )}
      {question.get.answersFormat === 'fix' && (
        <>
          <Form.Item label="Answers">
            <Button style={{ marginLeft: 4 }} onClick={onAddFixAnswer}>
              <PlusCircleOutlined />
            </Button>
            <Button onClick={onRemoveFixAnswer}>
              <MinusCircleOutlined />
            </Button>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {question.get.fixAnswers.map((fixAnswer, index) => (
                <Space key={index} style={{ margin: 4, width: 190 }}>
                  <Input
                    placeholder={`Answer No.${index + 1}`}
                    value={fixAnswer.text}
                    onChange={(e) => onChangeFixAnswer(e.target.value, index)}
                  />
                </Space>
              ))}
            </div>
          </Form.Item>
        </>
      )}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
