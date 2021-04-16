import { CloudOutlined, LikeOutlined } from '@ant-design/icons';
import { subject } from '@casl/ability';
import { Card, Image, Skeleton } from 'antd';
import Meta from 'antd/lib/card/Meta';
import Link from 'next/link';
import React, { CSSProperties, ReactElement, SyntheticEvent } from 'react';
import { Action } from '../../casl/action';
import { User, UserUpdateToggleKeys } from '../../types/user';
import { useAbility } from '../utils/context/casl-context';
import { useUserUpdate } from '../utils/hooks/use-user';

const onlineStyle = {
  color: 'green',
};

const offlineStyle = {
  color: 'black',
};

export interface Props {
  user: User;
}

export default function UserCard({ user }: Props): ReactElement {
  const userUpdate = useUserUpdate(user.id, user, true);
  const ability = useAbility();
  const canReadUser = () => ability.can(Action.Read, subject('User', user));

  const onToggle = (e: SyntheticEvent, attr: UserUpdateToggleKeys) => {
    e.preventDefault();
    canReadUser() && userUpdate.set[attr](!userUpdate.get[attr]);
  };

  const stylesForIcon = (attr: UserUpdateToggleKeys): CSSProperties => {
    const style = userUpdate.get[attr] ? onlineStyle : offlineStyle;
    return canReadUser() ? style : { ...style, cursor: 'default' };
  };

  return (
    <div>
      <LinkWrapper canReadAbility={canReadUser()} id={user.id}>
        <Card
          cover={
            <Image
              style={{ width: '60%', margin: 'auto' }}
              preview={false}
              src="https://cdn0.iconfinder.com/data/icons/account-avatar/128/user_-512.png"
            />
          }
          actions={[
            <CloudOutlined
              style={stylesForIcon('active')}
              key="active"
              onClick={(e) => onToggle(e, 'active')}
            />,
            <LikeOutlined
              style={stylesForIcon('hasHandUp')}
              key="hasHandUp"
              onClick={(e) => onToggle(e, 'hasHandUp')}
            />,
          ]}
        >
          <Skeleton loading={false} active>
            <Meta title={user.name} />
          </Skeleton>
        </Card>
      </LinkWrapper>
    </div>
  );
}

const LinkWrapper = (props: {
  children: ReactElement;
  canReadAbility: boolean;
  id: number;
}): ReactElement => {
  if (props.canReadAbility) {
    return (
      <Link href={`/users/[id]`} as={`/users/${props.id}`}>
        <a>{props.children}</a>
      </Link>
    );
  } else {
    return props.children;
  }
};
