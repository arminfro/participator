import { Drawer as ADrawer } from 'antd';
import React, { ReactElement, useEffect } from 'react';

interface Props {
  children: ReactElement | ReactElement[];
  visible: boolean;
  setVisibility: (b: boolean) => void;
  title: string;
}

export default function Drawer({
  children,
  title,
  setVisibility,
  visible = false,
}: Props) {
  useEffect(() => {
    setVisibility(visible);
  }, [visible, setVisibility]);

  const onClose = () => {
    setVisibility(false);
  };

  return (
    <ADrawer title={title} onClose={onClose} visible={visible}>
      {children}
    </ADrawer>
  );
}
