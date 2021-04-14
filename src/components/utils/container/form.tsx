import { Form, InputProps } from 'antd';
import { ReactElement } from 'react';
import { UseStruct } from '../hooks/use-struct';

type Type = 'input' | 'textarea' | 'radio';

interface FormItemProp {
  name: string;
  label: string;
  type: Type;
  inputProps?: InputProps;
  choices?: { value: any; label: string }[];
}

export type ItemProp =
  | FormItemProp
  | { component: ReactElement | ReactElement[] }
  | undefined
  | false;

interface FormProps<T> {
  struct: UseStruct<T>;
  items: ItemProp[];
  onSubmit?: (data: T) => void;
}

export default function FormContainer<T>({
  struct,
  items,
  onSubmit,
}: FormProps<T>) {
  const [form] = Form.useForm();

  return null;
}
