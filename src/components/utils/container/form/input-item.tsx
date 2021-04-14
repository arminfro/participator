import { FormItemProps as AntdFormItemProps, Input, InputProps } from 'antd';
import React, { ReactElement } from 'react';
import { useStructContext } from '../../context/struct-context';
import { FormItem } from './item';

interface FormInputItemProps {
  name: string;
  label: string;
  inputProps?: InputProps;
  formItemProps?: Exclude<AntdFormItemProps, 'label'>;
}
export function FormInputItem<T>({
  name,
  label,
  inputProps = {},
  formItemProps = {},
}: FormInputItemProps): ReactElement {
  const { struct } = useStructContext<T>();
  return (
    <FormItem {...formItemProps} name={name} label={label}>
      {inputProps.type === 'password' ? (
        <Input.Password
          {...inputProps}
          value={struct.get[name]}
          onChange={(e) => struct.set[name](e.target.value, false)}
        />
      ) : (
        <Input
          {...inputProps}
          value={struct.get[name]}
          onChange={(e) => struct.set[name](e.target.value, false)}
        />
      )}
    </FormItem>
  );
}
