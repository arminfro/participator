import { CloseOutlined, CloudOutlined, LikeOutlined } from '@ant-design/icons';
import { Button, Form, Radio } from 'antd';
import React, {
  CSSProperties,
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { User } from '../../types/user';
import { UserFilter } from './list';

interface Option {
  value: string;
  filterTrue: (u: User) => boolean;
  filterFalse: (u: User) => boolean;
}

interface Options {
  active: Option;
  hasHandUp: Option;
}

interface Props {
  setFilters: Dispatch<SetStateAction<UserFilter[]>>;
}

interface TargetValueOption {
  target: { value: keyof Options };
}

type FilterValue = 'all' | 'true' | 'false';

type FilterState = {
  [T in keyof Options]: FilterValue;
};

type FormState = {
  filter: keyof Options | 'dummy';
};

export default function UserFilterCtrl({ setFilters }: Props): ReactElement {
  const [form] = Form.useForm<FormState>();
  const [filterState, setFilterState] = useState<FilterState>({
    active: 'all',
    hasHandUp: 'all',
  });

  const options = useMemo<Options>(
    () => ({
      active: {
        value: 'active',
        filterTrue: (u) => u.active,
        filterFalse: (u) => !u.active,
      },
      hasHandUp: {
        value: 'hasHandUp',
        filterTrue: (u) => u.hasHandUp,
        filterFalse: (u) => !u.hasHandUp,
      },
    }),
    [],
  );

  useEffect(() => {
    setFilters(
      Object.keys(filterState)
        .map((filterKey) => {
          if (filterState[filterKey] === 'true') {
            return options[filterKey].filterTrue;
          }
          if (filterState[filterKey] === 'false') {
            return options[filterKey].filterFalse;
          }
          return () => true; //?
        })
        .filter((a) => a),
    );
  }, [filterState, options, setFilters]);

  const setNextFilterState = (
    filterKey: keyof FilterState,
    currentFilterValue: FilterValue,
  ): void => {
    setFilterState((currentFilterState) => {
      const newFilterState = {
        [filterKey]: onFilterChange(currentFilterValue),
      };
      return { ...currentFilterState, ...newFilterState };
    });
  };

  const onFilterChange = (currentFilterValue: FilterValue): FilterValue => {
    switch (currentFilterValue) {
      case 'all':
        return 'true';
      case 'true':
        return 'false';
      case 'false':
        return 'all';
    }
  };

  const onClick = (
    e: React.MouseEvent<HTMLElement, MouseEvent> & TargetValueOption,
  ) => {
    const filterKey = e.target.value;
    const filterValue = filterState[filterKey];
    if (onFilterChange(filterValue) === 'all') {
      resetFields();
    }
    setNextFilterState(filterKey, filterValue);
  };

  const iconStyle = (attr: keyof Options): CSSProperties => {
    let color: string;
    if (filterState[attr] === 'true') {
      color = 'green';
    } else if (filterState[attr] === 'false') {
      color = 'red';
    }
    if (color) {
      return { color };
    }
  };

  const resetFields = () => {
    setFilterState({ active: 'all', hasHandUp: 'all' });
    form.resetFields();
  };

  return (
    <Form
      form={form}
      initialValues={{
        filter: 'dummy',
      }}
    >
      <Form.Item label="Select Filter" name="filter">
        <Radio.Group>
          <Radio.Button value="active" onClick={onClick}>
            <CloudOutlined style={iconStyle('active')} />
          </Radio.Button>
          <Radio.Button value="hasHandUp" onClick={onClick}>
            <LikeOutlined style={iconStyle('hasHandUp')} />
          </Radio.Button>
          <Radio style={{ display: 'none' }} value="dummy">
            {' '}
          </Radio>
          <Button onClick={resetFields}>
            <CloseOutlined />
          </Button>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
}
