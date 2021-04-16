import { Form, FormItemProps as AntdFormItemProps } from 'antd';
import React, { ReactElement } from 'react';
import { useStructContext } from '../../context/struct-context';
import formItemValidator from '../../funcs/form-item-validation';

interface FormItemProps extends Exclude<AntdFormItemProps, 'label'> {
  name?: string;
  label?: string | ReactElement | ReactElement[];
  children: ReactElement | ReactElement[];
}

export function FormItem<T>({
  name,
  label,
  children,
}: FormItemProps): ReactElement {
  const {
    struct: { validationErrors },
  } = useStructContext<T>();
  return (
    <Form.Item
      name={name}
      rules={[formItemValidator(validationErrors)]}
      label={label}
    >
      {children}
    </Form.Item>
  );
}
