import { Button, Drawer as AntdDrawer, DrawerProps } from 'antd';
import React, { ReactElement } from 'react';
import { useQueryParamsBoolean } from '../hooks/use-query-params';

interface Props extends Omit<DrawerProps, 'children'> {
  children:
    | ReactElement
    | ReactElement[]
    | ((onClose: () => void) => ReactElement);
  subject: string;
  primaryButton?: boolean;
  action: string;
}

export default function MyDrawer({
  children,
  subject,
  action,
  primaryButton = false,
  ...drawerProps
}: Props) {
  const [open, setOpen] = useQueryParamsBoolean(action, false);

  const onClose = () => setOpen(false);

  return (
    <>
      <Button
        type={primaryButton ? 'primary' : 'default'}
        onClick={() => setOpen(true)}
      >
        {action}
      </Button>
      <AntdDrawer
        title={`${action} ${subject}`}
        onClose={onClose}
        open={open}
        {...drawerProps}
      >
        {typeof children === 'function' ? children(onClose) : children}
      </AntdDrawer>
    </>
  );
}
