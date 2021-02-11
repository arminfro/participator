import React from 'react';

interface Props {
  setRangeAnswer: any;
}

export default function RangeAnswer({ setRangeAnswer }: Props) {
  const rangeValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRangeAnswer(parseInt(e.target.value));
  };
  return (
    <>
      <div>
        <input
          type="radio"
          value="1"
          onChange={rangeValue}
          name="typeOfAnswer"
        />{' '}
        1 |
        <input
          type="radio"
          value="2"
          onChange={rangeValue}
          name="typeOfAnswer"
        />{' '}
        2 |
        <input
          type="radio"
          value="3"
          onChange={rangeValue}
          name="typeOfAnswer"
        />{' '}
        3 |
        <input
          type="radio"
          value="4"
          onChange={rangeValue}
          name="typeOfAnswer"
        />{' '}
        4 |
        <input
          type="radio"
          value="5"
          onChange={rangeValue}
          name="typeOfAnswer"
        />{' '}
        5 |
        <input
          type="radio"
          value="6"
          onChange={rangeValue}
          name="typeOfAnswer"
        />{' '}
        6 |
        <input
          type="radio"
          value="7"
          onChange={rangeValue}
          name="typeOfAnswer"
        />{' '}
        7 |
        <input
          type="radio"
          value="8"
          onChange={rangeValue}
          name="typeOfAnswer"
        />{' '}
        8 |
        <input
          type="radio"
          value="9"
          onChange={rangeValue}
          name="typeOfAnswer"
        />{' '}
        9 |
        <input
          type="radio"
          value="10"
          onChange={rangeValue}
          name="typeOfAnswer"
        />{' '}
        10 |
      </div>
    </>
  );
}
