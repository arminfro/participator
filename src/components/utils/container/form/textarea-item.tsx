import TextArea from 'antd/lib/input/TextArea';
import React from 'react';
import { useStructContext } from '../../context/struct-context';
import { FormItem } from './item';

interface Props {
  name: string;
  label: string;
}

export default function FormTextareaItem<T>({ name, label }: Props) {
  const { struct } = useStructContext<T>();
  return (
    <FormItem name={name} label={label}>
      <TextArea
        autoSize
        value={struct.get[name]}
        onChange={(e) => struct.set[name](e.target.value)}
      />
    </FormItem>
  );
}
