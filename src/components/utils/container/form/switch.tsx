import { Switch, SwitchProps } from 'antd';
import React, { ReactElement } from 'react';
import { useStructContext } from '../../context/struct-context';
import { FormItem } from './item';

interface FormSwitchItemProps extends SwitchProps {
  name?: string;
  label?: string;
}

export function FormSwitchItem<T>({
  name,
  label,
  ...switchProps
}: FormSwitchItemProps): ReactElement {
  const { struct } = useStructContext<T>();
  return (
    <FormItem label={label} name={name}>
      <Switch {...switchProps} checked={Boolean(struct.get[name])} />
    </FormItem>
  );
}
