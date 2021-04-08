import { Button, Drawer as ADrawer, DrawerProps } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';

interface Props extends DrawerProps {
  children:
    | ReactElement
    | ReactElement[]
    | ((onClose: () => void) => ReactElement);
  subject: string;
  action: string;
}

export default function Drawer({
  children,
  subject,
  action,
  ...drawerProps
}: Props) {
  const [visible, setVisibility] = useState(false);
  useEffect(() => {
    setVisibility(visible);
  }, [visible, setVisibility]);

  const onClose = () => {
    setVisibility(false);
  };

  return (
    <>
      <Button onClick={() => setVisibility(true)}>{action}</Button>
      <ADrawer
        title={`${action} ${subject}`}
        onClose={onClose}
        visible={visible}
        {...drawerProps}
      >
        {typeof children === 'function' ? children(onClose) : children}
      </ADrawer>
    </>
  );
}
