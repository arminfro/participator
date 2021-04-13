import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Space } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { QuestionCreate, QuestionUpdate } from '../../types/question';
import FormContainer from '../utils/container/form';
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
      if (copyFixAnswers.length > 2) {
        copyFixAnswers.pop();
      }
      return copyFixAnswers;
    });
  };

  const onSubmit = () => {
    onCloseDrawer && onCloseDrawer();
    router.push(
      `/rooms/${roomId}/questions${questionId ? `/${questionId}` : ''}`,
    );
  };

  return (
    <>
      <FormContainer
        struct={question}
        onSubmit={onSubmit}
        items={[
          {
            type: 'radio',
            label: 'Your answer type',
            name: 'answersFormat',
            choices: [
              { label: 'fix answers', value: 'fix' },
              { label: 'free answers', value: 'free' },
            ],
          },
          { component: <Divider /> },
          { type: 'textarea', label: 'Your question', name: 'text' },
          question.get.answersFormat === 'fix' && {
            component: (
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
                <Form.Item label="Answers">
                  <Button style={{ marginLeft: 4 }} onClick={onAddFixAnswer}>
                    <PlusCircleOutlined />
                  </Button>
                  <Button onClick={onRemoveFixAnswer}>
                    <MinusCircleOutlined />
                  </Button>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {question.get.fixAnswers.map((fixAnswer, index) => (
                      <Space key={index} style={{ margin: 4, width: 188 }}>
                        <TextArea
                          autoSize
                          placeholder={`Answer No.${index + 1}`}
                          value={fixAnswer.text}
                          onChange={(e) =>
                            onChangeFixAnswer(e.target.value, index)
                          }
                        />
                      </Space>
                    ))}
                  </div>
                </Form.Item>
              </>
            ),
          },
        ]}
      />
    </>
  );
}
