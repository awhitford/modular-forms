import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  Maybe,
  ResponseData,
} from '@modular-forms/shared';
import type { FieldStore, FieldValue, FormStore } from '../types';
import { isFieldDirty } from './isFieldDirty';
import { updateFormDirty } from './updateFormDirty';

/**
 * Updates the dirty state of a field.
 *
 * @param form The form of the field.
 * @param field The store of the field.
 */
export function updateFieldDirty<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  form: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  field: FieldStore<TFieldValues, TFieldName>
): void {
  // Check if field is dirty
  const dirty = isFieldDirty(
    field.internal.startValue as Maybe<FieldValue>,
    field.value as Maybe<FieldValue>
  );

  // Update dirty state of field if necessary
  if (dirty !== field.dirty) {
    field.dirty = dirty;

    // Update dirty state of form
    updateFormDirty(form, dirty);
  }
}
