import { $, type QRL, type QwikFocusEvent } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import type { JSX } from '@builder.io/qwik/jsx-runtime';
import type {
  FieldElement,
  FieldValues,
  Maybe,
  MaybeArray,
  MaybeValue,
  PartialKey,
  ResponseData,
  ValidateField,
} from '@modular-forms/shared';
import type {
  FieldArrayPath,
  FieldElementProps,
  FieldPath,
  FieldPathValue,
  FieldStore,
  FieldType,
  FieldValue,
  FormStore,
} from '../types';
import {
  getElementInput,
  getFieldStore,
  updateFieldValue,
  validateIfRequired,
} from '../utils';
import { Lifecycle } from './Lifecycle';

export type FieldProps<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  of: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>;
  name: TFieldName;
  children: (
    store: FieldStore<TFieldValues, TFieldName>,
    props: FieldElementProps<TFieldValues, TFieldName>
  ) => JSX.Element;
  type: FieldType<FieldPathValue<TFieldValues, TFieldName>>;
  validate?: Maybe<
    MaybeArray<QRL<ValidateField<FieldPathValue<TFieldValues, TFieldName>>>>
  >;
  keepActive?: Maybe<boolean>;
  keepState?: Maybe<boolean>;
  key?: Maybe<string | number>;
};

/**
 * Headless form field that provides reactive properties and state.
 */
export function Field<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>({
  children,
  name,
  type,
  ...props
}: FieldPathValue<TFieldValues, TFieldName> extends MaybeValue<string>
  ? PartialKey<
      FieldProps<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
      'type'
    >
  : FieldProps<
      TFieldValues,
      TResponseData,
      TFieldName,
      TFieldArrayName
    >): JSX.Element {
  // Destructure props
  const { of: form } = props;

  // Get store of specified field
  const field = getFieldStore(form, name);

  return (
    <Lifecycle key={name} store={field} {...props}>
      {children(field, {
        name,
        autoFocus: isServer && !!field.error,
        ref: $((element: Element) => {
          field.internal.elements.push(element as FieldElement);
        }),
        onInput$: $((_: Event, element: FieldElement) => {
          const field = getFieldStore(form, name);
          updateFieldValue(
            form,
            field,
            name,
            getElementInput(element, field, type)
          );
        }),
        onChange$: $(() => {
          validateIfRequired(form, getFieldStore(form, name), name, {
            on: ['change'],
          });
        }),
        onBlur$: $(
          (_: QwikFocusEvent<FieldElement>, { type, value }: FieldElement) => {
            // Get store of specified field
            const field = getFieldStore(form, name);

            // Set input to "NaN" if type is "number" and value is emtpy
            if (type === 'number' && value === '') {
              updateFieldValue(
                form,
                field,
                name,
                NaN as FieldPathValue<TFieldValues, TFieldName>
              );

              // Otheriwse, just update touched state
            } else {
              field.touched = true;
              form.touched = true;
            }

            // Validate value if required
            validateIfRequired(form, field, name, {
              on: ['touched', 'blur'],
            });
          }
        ),
      })}
    </Lifecycle>
  );
}
