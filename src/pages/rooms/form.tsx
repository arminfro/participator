import { useRouter } from 'next/router';
import React, {
  ChangeEvent,
  ReactElement,
  SyntheticEvent,
  useState,
} from 'react';
import Room, { JoinConditions } from '../../types/room';
import api from '../utils/api';

interface Props {
  name: string;
  description: string;
  openToJoin: JoinConditions;
  isEdit: boolean;
  roomId?: number;
}

export default function RoomForm(props: Props): ReactElement {
  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState(props.description);
  const [openToJoin, setOpenToJoin] = useState<JoinConditions>(
    props.openToJoin,
  );

  const router = useRouter();

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    let payload: any = {
      name,
      description,
      openToJoin: openToJoin === JoinConditions.Open,
    };
    if (props.isEdit) {
      payload = { updateAttrs: payload };
    }
    api(
      props.isEdit ? 'patch' : 'post',
      props.isEdit ? `api/rooms/${props.roomId}` : 'api/rooms/new',
      (room: Room) => {
        router.push(`/rooms/${room ? room.id : props.roomId}`);
      },
      payload,
    );
  };

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) =>
    setOpenToJoin(e.target.value as JoinConditions);

  return (
    <form className="ui form" style={{ marginTop: 0 }} onSubmit={onSubmit}>
      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
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
              onChange={onChangeInput}
              checked={openToJoin === JoinConditions.Open}
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
              onChange={onChangeInput}
              checked={openToJoin === JoinConditions.Closed}
              value={JoinConditions.Closed}
            />
            <label htmlFor={JoinConditions.Closed}>Only on invitation</label>
          </div>
        </div>
      </div>

      <div className="ui section divider" />

      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="ui section divider"></div>
      <button className="ui button">Submit</button>
    </form>
  );
}
