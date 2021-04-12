import { Button, Form, Input, Radio } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { ReactElement } from 'react';
import { Failure } from 'superstruct';
import formItemValidator from '../funcs/form-item-validation';
import { UseStruct } from '../hooks/use-struct';

interface FormItemProps {
  name: string;
  validationErrors: Failure[];
  label: string;
  children: ReactElement;
}

const FormItem = ({
  name,
  label,
  validationErrors,
  children,
}: FormItemProps): ReactElement => (
  <Form.Item
    name={name}
    rules={[formItemValidator(validationErrors)]}
    label={label}
  >
    {children}
  </Form.Item>
);

type Type = 'input' | 'textarea' | 'radio';

interface FormItemProp {
  name: string;
  label: string;
  type: Type;
  choices?: { value: any; label: string }[];
}

interface FormProps<T> {
  struct: UseStruct<T>;
  items: FormItemProp[];
  onSubmit?: (data: T) => void;
}

export default function FormContainer<T>({
  struct,
  items,
  onSubmit,
}: FormProps<T>) {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      initialValues={struct.get}
      onFinish={() => {
        struct.sync();
        onSubmit && onSubmit(struct.get);
      }}
    >
      {items.map((item) => (
        <React.Fragment key={item.name}>
          {item.type === 'input' && (
            <FormItem
              name={item.name}
              label={item.label}
              validationErrors={struct.validationErrors}
            >
              <Input
                value={struct.get[item.name]}
                onChange={(e) => struct.set[item.name](e.target.value, false)}
              />
            </FormItem>
          )}
          {item.type === 'textarea' && (
            <FormItem
              name={item.name}
              label={item.label}
              validationErrors={struct.validationErrors}
            >
              <TextArea
                autoSize
                value={struct.get[item.name]}
                onChange={(e) => struct.set[item.name](e.target.value)}
              />
            </FormItem>
          )}
          {item.type === 'radio' && item.choices.length > 0 && (
            <Form.Item
              label={item.label}
              rules={[formItemValidator(struct.validationErrors)]}
            >
              <Radio.Group
                value={struct.get[item.name]}
                onChange={(e) => struct.set[item.name](e.target.value, false)}
              >
                {item.choices.map((choice) => (
                  <Radio key={choice.value} value={choice.value}>
                    {choice.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          )}
        </React.Fragment>
      ))}
      <Form.Item>
        <Button htmlType="submit" type="primary">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
