import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  Maybe,
  ResponseData,
  ValidationMode,
} from '@modular-forms/shared';
import { validate } from '../methods';
import type {
  FieldArrayStore,
  FieldStore,
  FieldValue,
  FormStore,
} from '../types';

type ValidateOptions = {
  on: Exclude<ValidationMode, 'submit'>[];
  shouldFocus?: Maybe<boolean>;
};

/**
 * Validates a field or field array only if required.
 *
 * @param form The form of the field or field array.
 * @param fieldOrFieldArray The store of the field or field array.
 * @param name The name of the field or field array.
 * @param options The validate options.
 */
export function validateIfRequired<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  fieldOrFieldArray:
    | FieldStore<TFieldValues, TFieldName>
    | FieldArrayStore<TFieldValues, TFieldArrayName>,
  name: TFieldName | TFieldArrayName,
  options: ValidateOptions
): void {
  // Destructure options
  const { on: modes, shouldFocus = false } = options;

  // Validate only if validation mode matches
  if (
    (modes as string[]).includes(
      (
        form.internal.validateOn === 'submit'
          ? form.submitted
          : fieldOrFieldArray.error
      )
        ? form.internal.revalidateOn
        : form.internal.validateOn
    )
  ) {
    validate(form, name, { shouldFocus });
  }
}
