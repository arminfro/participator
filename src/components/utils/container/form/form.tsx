import { Button, Form as AntdForm } from 'antd';
import React, { ReactElement } from 'react';
import { StructProvider } from '../../context/struct-context';
import { UseStruct } from '../../hooks/use-struct';

interface FormProps<T> {
  struct: UseStruct<T>;
  onSubmit?: (data: T) => void;
  children: ReactElement | ReactElement[];
}

export default function Form<T>({ struct, children, onSubmit }: FormProps<T>) {
  const [form] = AntdForm.useForm();

  return (
    <StructProvider struct={struct}>
      <AntdForm
        form={form}
        layout="vertical"
        initialValues={struct.get}
        onFinish={() => {
          if (struct.sync) {
            struct.sync(() => {
              onSubmit && onSubmit(struct.get);
            });
          } else {
            onSubmit && onSubmit(struct.get);
          }
        }}
      >
        {children}
        <AntdForm.Item wrapperCol={{ span: 14, offset: 4 }}>
          <Button
            disabled={struct.validationErrors.length > 0}
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        </AntdForm.Item>
      </AntdForm>
    </StructProvider>
  );
}
