import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Space } from 'antd';
import React, { ReactElement } from 'react';
import { QuestionCreate, QuestionUpdate } from '../../types/question';
import Form from '../utils/container/form/form';
import { FormItem } from '../utils/container/form/item';
import FormRadioGroupItem from '../utils/container/form/radio-group-item';
import FormTextareaItem from '../utils/container/form/textarea-item';
import { UseStruct } from '../utils/hooks/use-struct';

interface Props {
  question: UseStruct<QuestionCreate | QuestionUpdate>;
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

export default function QuestionForm<T = QuestionCreate | QuestionUpdate>({
  question,
  onCloseDrawer,
}: Props): ReactElement {
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

  const onRemoveFixAnswer = (index: number) => {
    question.set.fixAnswers((currentFixAnswers) => {
      const copyFixAnswers = [...currentFixAnswers];
      copyFixAnswers.splice(index, 1);
      return copyFixAnswers;
    });
  };

  const onSubmit = (promise: Promise<T>) =>
    promise.then((data) => {
      onCloseDrawer && onCloseDrawer();
      return data;
    });

  return (
    <>
      <Form struct={question} onSubmit={onSubmit}>
        <FormRadioGroupItem
          label="Your answer type"
          name="answersFormat"
          choices={[
            { label: 'fix answers', value: 'fix' },
            { label: 'free answers', value: 'free' },
          ]}
        />
        <Divider />
        <FormTextareaItem label="Your question" name="text" />
        {question.get.answersFormat === 'fix' && (
          <>
            <Divider />
            <FormItem label="Choose a Preset">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  onClick={() => question.set.fixAnswers(preset.fixAnswers)}
                >
                  {preset.label}
                </Button>
              ))}
            </FormItem>
            <FormItem
              label={
                <span>
                  Answers
                  <PlusCircleOutlined
                    style={{ marginLeft: '.5em' }}
                    onClick={onAddFixAnswer}
                  />
                </span>
              }
            >
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {question.get.fixAnswers.map((fixAnswer, index) => (
                  <Space key={index} style={{ margin: 4, width: 188 }}>
                    <Input
                      placeholder={`Answer No.${index + 1}`}
                      addonAfter={
                        <MinusCircleOutlined
                          onClick={() => onRemoveFixAnswer(index)}
                        />
                      }
                      value={fixAnswer.text}
                      onChange={(e) => onChangeFixAnswer(e.target.value, index)}
                    />
                  </Space>
                ))}
              </div>
            </FormItem>
          </>
        )}
      </Form>
    </>
  );
}
