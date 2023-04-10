import {
  FieldPath,
  FieldPathValue,
  FieldValues,
  Maybe,
} from '@modular-forms/shared';
import { FieldValue, FormState } from '../types';
import { getField } from '../utils';

type ValueOptions<TTypeValidated> = Partial<{
  shouldActive: boolean;
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldValid: boolean;
  typeValidated: TTypeValidated;
}>;

/**
 * Returns the value of the specified field.
 *
 * @param form The form that contains the field.
 * @param name The name of the field to get the value from.
 * @param options The value options.
 *
 * @returns The value of the field.
 */
export function getValue<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TTypeValidated extends boolean = false
>(
  form: FormState<TFieldValues>,
  name: TFieldName,
  options: ValueOptions<TTypeValidated> = {}
): TTypeValidated extends true
  ? FieldPathValue<TFieldValues, TFieldName, FieldValue>
  : Maybe<FieldPathValue<TFieldValues, TFieldName, FieldValue>> {
  // Destructure options and set default values
  const {
    shouldActive = true,
    shouldTouched = false,
    shouldDirty = false,
    shouldValid = false,
  } = options;

  // Get specified field
  const field = getField(form, name);

  // Continue if field corresponds to filter options
  if (
    (!shouldActive || field.getActive()) &&
    (!shouldTouched || field.getTouched()) &&
    (!shouldDirty || field.getDirty()) &&
    (!shouldValid || !field.getError())
  ) {
    // Return value of field
    return field.getInput() as TTypeValidated extends true
      ? FieldPathValue<TFieldValues, TFieldName, FieldValue>
      : Maybe<FieldPathValue<TFieldValues, TFieldName, FieldValue>>;
  }

  // Otherwise return undefined
  return undefined as TTypeValidated extends true
    ? FieldPathValue<TFieldValues, TFieldName, FieldValue>
    : Maybe<FieldPathValue<TFieldValues, TFieldName, FieldValue>>;
}
