import { Button, Form as AntdForm, message } from 'antd';
import React, { ReactElement, useState } from 'react';
import { StructProvider } from '../../context/struct-context';
import { UseStruct } from '../../hooks/use-struct';

interface FormProps<T> {
  struct: UseStruct<T>;
  onSubmit: (data: Promise<T>) => Promise<T>;
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

  console.log('validationErrors', struct.validationErrors);

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
            )
              .catch((e) => {
                console.debug('Error in Form container', e);
                if (e.message) {
                  message.error(e.message);
                }
                onLocalReset();
              })
              .finally(() => {
                setLoading(false);
              });
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
