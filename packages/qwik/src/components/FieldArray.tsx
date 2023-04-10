import type { QRL } from '@builder.io/qwik';
import type { JSX } from '@builder.io/qwik/jsx-runtime';
import type {
  FieldValues,
  Maybe,
  MaybeArray,
  ResponseData,
  ValidateFieldArray,
} from '@modular-forms/shared';
import type {
  FieldPath,
  FieldArrayPath,
  FormStore,
  FieldArrayStore,
  FieldValue,
} from '../types';
import { getFieldArrayStore } from '../utils';
import { Lifecycle } from './Lifecycle';

export type FieldArrayProps<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  of: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>;
  name: TFieldArrayName;
  children: (
    store: FieldArrayStore<TFieldValues, TFieldArrayName>
  ) => JSX.Element;
  validate?: Maybe<MaybeArray<QRL<ValidateFieldArray<number[]>>>>;
  keepActive?: Maybe<boolean>;
  keepState?: Maybe<boolean>;
};

/**
 * Headless field array that provides reactive properties and state.
 */
export function FieldArray<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>({
  children,
  name,
  ...props
}: FieldArrayProps<
  TFieldValues,
  TResponseData,
  TFieldName,
  TFieldArrayName
>): JSX.Element {
  // Destructure props
  const { of: form } = props;

  // Get store of specified field
  const fieldArray = getFieldArrayStore(form, name);

  return (
    <Lifecycle key={name} store={fieldArray} {...props}>
      {children(fieldArray)}
    </Lifecycle>
  );
}
