import React from 'react';

interface Props {
  setRangeAnswer: (s: number) => void;
}

export default function RangeAnswer({ setRangeAnswer }: Props) {

  const selectRangeValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRangeAnswer(parseInt(e.target.value));
  };

  const rangeMax = 10;
  const rangeArray = [];

  const feedRangeArray = (scale: number) => {
    for (let i = 0; i < scale; i++) {
      rangeArray.push(i + 1);
    }
  };

  feedRangeArray(rangeMax);


  return (
    <div>
      {rangeArray.map((singleRangeValue: number, index: number) => {
        return (
          <span key={index}>
            {` ${singleRangeValue} `}
            <input
              type="radio"
              value={singleRangeValue}
              onChange={selectRangeValue}
              name="typeOfAnswer"
            />
          </span>
        )
      })}
    </div>
  );
}
