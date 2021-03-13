import React, { ReactElement, useState } from 'react';
import { ValidationResult } from '../../../types/utils';

export function useFormValidation<T>(
  validatorFunction: (model: T) => ValidationResult<T>,
  submitCb: any,
): [ReactElement, (model: T) => void] {
  const [formError, setFormError] = useState<string[]>([]);

  const errorList = formError.length !== 0 && (
    <ul className="ui negative message">
      {formError.map((err: string) => (
        <li key={err}>{err}</li>
      ))}
    </ul>
  );

  const onSubmit = (model: T) => {
    const [errs, validModel] = validatorFunction(model);
    if (validModel) {
      submitCb(validModel);
    } else {
      setFormError(errs.map((failure) => failure.message));
    }
  };

  return [errorList, onSubmit];
}
