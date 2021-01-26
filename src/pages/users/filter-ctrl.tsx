import React, {
  useState,
  ReactElement,
  ChangeEvent,
  SyntheticEvent,
} from 'react';
import User from '../../types/user';
import { UserFilter } from './index';

function useInput(
  initialValue: string,
): [string, (e: ChangeEvent<HTMLInputElement>) => void] {
  const [value, setValue] = useState(initialValue);
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }
  return [value, handleChange];
}

interface Option {
  value: string;
  icon: string;
  filterTrue: (u: User) => boolean;
  filterFalse: (u: User) => boolean;
}

interface Options {
  online: Option;
  reg: Option;
  hand: Option;
}

interface Props {
  setFilter: (filter: UserFilter) => void;
}

function UserFilterCtrl({ setFilter }: Props): ReactElement {
  const options: Options = {
    online: {
      value: 'online',
      icon: 'cloud',
      filterTrue: (u) => u.active,
      filterFalse: (u) => !u.active,
    },
    reg: {
      value: 'reg',
      icon: 'cloud upload',
      filterTrue: (u) => u.randomGroup,
      filterFalse: (u) => !u.randomGroup,
    },
    hand: {
      value: 'hand',
      icon: 'hand point up outline',
      filterTrue: (u) => u.hasHandUp,
      filterFalse: (u) => !u.hasHandUp,
    },
  };

  const [filterTrue, setFilterTrue] = useState(true);

  const [chosenFilter, setChosenFilter] = useInput('');

  const onSetFilter = (e: ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setChosenFilter(e);
    setFilter(
      filterTrue
        ? options[e.target.value as keyof Options].filterTrue
        : options[e.target.value as keyof Options].filterFalse,
    );
  };

  const onClick = (e: SyntheticEvent<EventTarget>) => {
    if ((e.target as HTMLInputElement).value === chosenFilter) {
      if (filterTrue) {
        setFilter(
          options[(e.target as HTMLInputElement).value as keyof Options]
            .filterFalse,
        );
        setFilterTrue(false);
      } else {
        setChosenFilter({
          target: { value: '' },
        } as ChangeEvent<HTMLInputElement>);
        setFilter((a: User) => !!a);
        setFilterTrue(true);
      }
    }
  };

  return (
    <>
      <div className="ui form">
        <div className="inline fields">
          <label htmlFor="filter">Select filter:</label>
          {(['online', 'reg', 'hand'] as Array<keyof Options>).map(
            (filterSetting) => (
              <div key={filterSetting} className="field">
                <div className="ui radio checkbox">
                  <input
                    type="radio"
                    id={options[filterSetting].value}
                    value={options[filterSetting].value}
                    checked={options[filterSetting].value === chosenFilter}
                    onChange={onSetFilter}
                    name="filter"
                    tabIndex={0}
                    className="hidden"
                    onClick={onClick}
                  />
                  <label htmlFor={options[filterSetting].value}>
                    <i
                      className={`${options[filterSetting].icon} icon`}
                      style={{
                        color:
                          filterTrue &&
                          chosenFilter === options[filterSetting].value
                            ? 'green'
                            : '',
                      }}
                    />
                  </label>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </>
  );
}

export default UserFilterCtrl;
