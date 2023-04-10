import type { FieldValues, Maybe, ResponseData } from '@modular-forms/shared';
import type {
  FieldArrayPath,
  FieldArrayStore,
  FieldPath,
  FieldStore,
  FieldValue,
  FormStore,
} from '../types';
import { getFieldStore, getFieldArrayStore } from '../utils';

type ErrorOptions = Partial<{
  shouldActive: boolean;
  shouldTouched: boolean;
  shouldDirty: boolean;
}>;

/**
 * Returns the error of the specified field or field array.
 *
 * @param form The form of the field or field array.
 * @param name The name of the field or field array.
 *
 * @returns The error of the field or field array.
 */
export function getError<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  name: TFieldName | TFieldArrayName,
  options: ErrorOptions = {}
): string | undefined {
  // Destructure options and set default values
  const {
    shouldActive = true,
    shouldTouched = false,
    shouldDirty = false,
  } = options;

  // Return error if field or field array corresponds to filter options
  for (const fieldOrFieldArray of [
    getFieldStore(form, name as TFieldName) as Maybe<
      FieldStore<TFieldValues, TFieldName>
    >,
    getFieldArrayStore(form, name as TFieldArrayName) as Maybe<
      FieldArrayStore<TFieldValues, TFieldArrayName>
    >,
  ]) {
    if (
      fieldOrFieldArray &&
      (!shouldActive || fieldOrFieldArray.active) &&
      (!shouldTouched || fieldOrFieldArray.touched) &&
      (!shouldDirty || fieldOrFieldArray.dirty)
    ) {
      return fieldOrFieldArray.error;
    }
  }

  // Otherwise return undefined
  return undefined;
}
