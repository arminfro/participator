import React, { ReactElement } from 'react';
import { JoinConditions } from '../../types/room';
import RoomForm from './form';

export default function RoomCreate(): ReactElement {
  return (
    <div className="ui segment">
      <h4 className="ui top attached block header">New Room</h4>
      <div className="ui section divider" />
      <RoomForm
        name=""
        description=""
        openToJoin={JoinConditions.Open}
        isEdit={false}
      />
    </div>
  );
}
