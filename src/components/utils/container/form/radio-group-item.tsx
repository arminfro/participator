import { Form, Radio } from 'antd';
import React from 'react';
import { useStructContext } from '../../context/struct-context';
import formItemValidator from '../../funcs/form-item-validation';
import sort from '../../funcs/sort';

interface Props {
  name: string;
  label: string;
  choices?: { value: any; label: string }[];
}
export default function FormRadioGroupItem<T>({ name, label, choices }: Props) {
  const { struct } = useStructContext<T>();
  return (
    <Form.Item
      label={label}
      rules={[formItemValidator(struct.validationErrors)]}
    >
      <Radio.Group
        value={struct.get[name]}
        onChange={(e) => {
          struct.set[name](e.target.value, false);
        }}
      >
        {sort(choices, 'label').map((choice) => (
          <Radio key={choice.value} value={choice.value}>
            {choice.label}
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  );
}
