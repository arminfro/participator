import React, { useState } from 'react';
import { User } from '../../types/user';
import api from '../utils/api';

interface Props {
  allUsers: User[];
  joinedUsers: User[];
  roomId: number;
}
export default function RoomMemberManage({
  allUsers,
  joinedUsers,
  roomId,
}: Props) {
  const [isInviting, setIsInviting] = useState(true);
  const [input, setInput] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const resetInputState = () => {
    setInput('');
    setSearchResults([]);
  };

  const onChangeInviting = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsInviting(e.target.checked);
    resetInputState();
  };

  const onSearchUsers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    const regex = new RegExp(searchTerm, 'i');
    setInput(searchTerm);
    setSearchResults(
      (isInviting ? allUsers : joinedUsers).filter(
        (user) => user.email.match(regex) || user.name.match(regex),
      ),
    );
  };

  const label = () => (isInviting ? 'Invite' : 'Kick');

  const onChooseUser = (user: User) => {
    if (window.confirm(`Are you sure you want to ${label()} ${user.name}`)) {
      const action = isInviting ? 'addMember' : 'removeMember';
      api('patch', `api/rooms/${roomId}/${action}`, resetInputState, {
        [action]: user,
      });
    }
  };

  return (
    <div className="fields">
      <h4 className="ui dividing header">Member Manage</h4>
      <div className="field">
        <div className="ui search">
          <div className="ui toggle checkbox">
            <input
              type="checkbox"
              onChange={onChangeInviting}
              checked={isInviting}
            />
            <label />
          </div>
          <div className="ui left icon input">
            <input
              type="text"
              onChange={onSearchUsers}
              value={input}
              placeholder={`Search user to ${label()}...`}
            />
            <i className="users icon" />
          </div>
          {searchResults.length > 0 && (
            <div className="results transition visible">
              {searchResults.map((user) => (
                <span
                  onClick={() => onChooseUser(user)}
                  key={user.id}
                  className="result"
                >
                  {user.name}
                  <p className="description">{user.email}</p>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
