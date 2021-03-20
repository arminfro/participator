import { useRouter } from 'next/router';
import React, { ChangeEvent, ReactElement, SyntheticEvent } from 'react';
import { JoinConditions, RoomCreate, RoomUpdate } from '../../types/room';
import { UseStructWithValidation } from '../utils/hooks/use-struct';

interface Props {
  room:
    | UseStructWithValidation<RoomCreate>
    | UseStructWithValidation<RoomUpdate>;
  roomId?: number; // present if `isEdit`
}

export default function RoomForm({ room, roomId }: Props): ReactElement {
  const router = useRouter();

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    room.sync(() => {
      router.push(`/rooms${roomId ? `/${roomId}` : ''}`);
    });
  };

  const onChangeJoinPolicy = (e: ChangeEvent<HTMLInputElement>) =>
    room.set.openToJoin(e.target.value === JoinConditions.Open, false);

  return (
    <form className="ui form" style={{ marginTop: 0 }} onSubmit={onSubmit}>
      <label>Name</label>
      <input
        type="text"
        value={room.get.name}
        onChange={(e) => {
          room.set.name(e.target.value, false);
        }}
      />

      <div className="ui section divider" />

      <label>Join Policy</label>
      <div className="ui radio">
        <div className="field">
          <div className="ui radio checkbox">
            <input
              type="radio"
              name="openToJoin"
              onChange={onChangeJoinPolicy}
              checked={room.get.openToJoin}
              value={JoinConditions.Open}
            />
            <label htmlFor={JoinConditions.Open}>Open To Join</label>
          </div>
        </div>

        <div className="field">
          <div className="ui radio checkbox">
            <input
              type="radio"
              name="openToJoin"
              onChange={onChangeJoinPolicy}
              checked={!room.get.openToJoin}
              value={JoinConditions.Closed}
            />
            <label htmlFor={JoinConditions.Closed}>Only on invitation</label>
          </div>
        </div>
      </div>

      <div className="ui section divider" />

      <label>Description</label>
      <textarea
        value={room.get.description}
        onChange={(e) => room.set.description(e.target.value, false)}
      />

      <div className="ui section divider"></div>
      {room.validationErrors.length > 0 && (
        <ul className="ui negative message">
          {room.validationErrors.map((failure) => (
            <li key={failure.key}>{failure.message}</li>
          ))}
        </ul>
      )}
      <button className="ui button">Submit</button>
    </form>
  );
}
