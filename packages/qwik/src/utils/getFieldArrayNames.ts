import type { FieldValues, ResponseData } from '@modular-forms/shared';
import type {
  FieldPath,
  FieldArrayPath,
  FormStore,
  FieldValue,
} from '../types';

/**
 * Returns a list with the names of all file arrays.
 *
 * @param form The form of the field arrays.
 *
 * @returns All field array names of the form.
 */
export function getFieldArrayNames<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>
): TFieldArrayName[] {
  return Object.keys(form.internal.fieldArrays) as TFieldArrayName[];
}
