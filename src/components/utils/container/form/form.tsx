import { Button, Form as AntdForm } from 'antd';
import React, { ReactElement, useState } from 'react';
import { StructProvider } from '../../context/struct-context';
import { UseStruct } from '../../hooks/use-struct';

interface FormProps<T> {
  struct: UseStruct<T>;
  onSubmit: (data: Promise<T>) => Promise<void>;
  children: ReactElement | ReactElement[];
}

export default function Form<T>({ struct, children, onSubmit }: FormProps<T>) {
  const [form] = AntdForm.useForm();
  const [loading, setLoading] = useState(false);

  const onLocalReset = () => {
    form.resetFields();
    struct.initialValues
      ? struct.setToInitialState()
      : console.debug('Form reset called without initialValues');
  };

  return (
    <StructProvider struct={struct}>
      <AntdForm
        form={form}
        layout="vertical"
        initialValues={struct.initialValues ? struct.initialValues : struct.get}
        onFinish={() => {
          if (struct.sync) {
            setLoading(true);
            onSubmit(
              (struct.sync ? struct.sync() : Promise.resolve(struct.get)).then(
                (payload: T) => {
                  onLocalReset();
                  return payload;
                },
              ),
            ).finally(() => setLoading(false)); //.catch(() => struct?.reset());
          }
        }}
      >
        {children}
        <AntdForm.Item>
          <Button
            disabled={struct.validationErrors.length > 0}
            loading={loading}
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
          {struct.isEdit && <Button onClick={onLocalReset}>Reset</Button>}
        </AntdForm.Item>
      </AntdForm>
    </StructProvider>
  );
}
