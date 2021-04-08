import { Failure } from 'superstruct';

interface FormItemValidator {
  validator: (rule: any, value: any) => Promise<string | boolean>;
}

// todo, better integration of superstruct- and antd form-validation
export default function formItemValidator(
  validationErrors: Failure[],
): FormItemValidator {
  return {
    // todo, FormItemProps doens't seem to have validator prop
    validator: (rule) =>
      new Promise((resolve, reject) => {
        const errors = validationErrors.filter(
          (failure) => failure.key === rule.field,
        );
        errors.length
          ? reject(errors.map((err) => err.message).join('\n'))
          : resolve(true);
      }),
  };
}
