import { Breadcrumb, PageHeader } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { useSiderRefContext } from './sider-ref-context';

export interface Path {
  name: string;
  url?: string;
}

interface Props {
  children: ReactElement | ReactElement[];
  sider?: ReactElement | ReactElement[];
  title?: string;
  path?: Path[];
  extra?: ReactElement[];
}

export default function Page({ children, path, extra, sider, title }: Props) {
  const { ref } = useSiderRefContext();
  const router = useRouter();

  return (
    <>
      {sider && createPortal(sider, ref.current)}
      {path && path.length > 0 && (
        <Breadcrumb>
          {path.map((pathSeg) => (
            <Breadcrumb.Item key={pathSeg.name}>
              {pathSeg.url ? (
                <Link key={pathSeg.name} href={pathSeg.url}>
                  <a>{pathSeg.name}</a>
                </Link>
              ) : (
                <>{pathSeg.name}</>
              )}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      )}
      <PageHeader
        style={{ padding: 0 }}
        title={(path && path[path.length - 1].name) || title}
        onBack={router.back}
        extra={extra}
      />
      <Content>{children}</Content>
    </>
  );
}
