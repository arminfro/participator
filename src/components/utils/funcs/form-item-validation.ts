import { Failure } from 'superstruct';

interface FormItemValidator {
  validator: (rule: any, value: any) => Promise<string | boolean>;
}

export default function formItemValidator(
  validationErrors: Failure[],
): FormItemValidator {
  return {
    validator: (rule) =>
      new Promise((resolve, reject) => {
        const errors = validationErrors.filter(
          (failure) => failure.refinement === rule.field,
        );
        errors.length
          ? reject(errors.map((err) => err.message).join('\n'))
          : resolve(true);
      }),
  };
}
