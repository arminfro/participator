import React, { ReactElement } from 'react';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Radio, Space } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useRouter } from 'next/router';
import { QuestionCreate, QuestionUpdate } from '../../types/question';
import { UseStructWithValidation } from '../utils/hooks/use-struct';

interface Props {
  question: UseStructWithValidation<QuestionCreate | QuestionUpdate>;
  roomId: number;
  questionId?: number;
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
}: Props): ReactElement {
  const router = useRouter();

  const answersFormatSelect = (e: any) => {
    question.set.answersFormat(e.target.value);
  };

  const onChangeFixAnswer = (newValue: string, index: number) => {
    const newFixAnswers = (currentFixAnswers) => {
      const copyFixAnswers = [...currentFixAnswers];
      copyFixAnswers[index] = { ...copyFixAnswers[index], text: newValue };
      return copyFixAnswers;
    };
    question.set.fixAnswers(newFixAnswers(question.get.fixAnswers));
  };

  const onAddFixAnswer = () => {
    const newCurrentAnswers = (currentFixAnswers) => [
      ...currentFixAnswers,
      { text: '' },
    ];
    question.set.fixAnswers(newCurrentAnswers(question.get.fixAnswers));
  };

  const onRemoveFixAnswer = () => {
    const newFixAnswers = (currentFixAnswers) => {
      const copyFixAnswers = [...currentFixAnswers];
      if (copyFixAnswers.length > 1) {
        copyFixAnswers.pop();
      }
      return copyFixAnswers;
    };
    question.set.fixAnswers(newFixAnswers(question.get.fixAnswers));
  };

  const onSubmit = () => {
    question.sync(() => {
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
      {question.get.answersFormat === 'fix' && (
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
      )}
      <Divider />
      <Form.Item label="Your polling question">
        <TextArea
          rows={4}
          value={question.get.text}
          onChange={(e) => question.set.text(e.target.value)}
          placeholder="Type your question"
        />
      </Form.Item>
      <Divider />
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
                <Space key={index} style={{ margin: 4 }}>
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
