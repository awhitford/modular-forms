import type {
  ArrayKey,
  FieldValues,
  IsTuple,
  TupleKeys,
} from '@modular-forms/shared';
import type { FieldValue } from './field';

/**
 * Returns a template path of a specified type.
 */
type TypeTemplatePath<
  Key extends string | number,
  Value,
  Type
> = Value extends Type
  ? Value extends Array<any> | Record<string, any>
    ? `${Key}` | `${Key}.${TypeTemplatePaths<Value, Type>}`
    : `${Key}`
  : Value extends
      | FieldValues<FieldValue>
      | (FieldValue | FieldValues<FieldValue>)[]
  ? `${Key extends number ? '$' : Key}.${TypeTemplatePaths<Value, Type>}`
  : never;

/**
 * Returns all template paths of a specified type.
 */
type TypeTemplatePaths<Data, Type> = Data extends Array<infer Child>
  ? IsTuple<Data> extends true
    ? {
        [Key in TupleKeys<Data>]-?: TypeTemplatePath<
          Key & string,
          Data[Key],
          Type
        >;
      }[TupleKeys<Data>]
    : TypeTemplatePath<ArrayKey, Child, Type>
  : {
      [Key in keyof Data]-?: TypeTemplatePath<Key & string, Data[Key], Type>;
    }[keyof Data];

/**
 * See {@link TypePaths}
 */
export type TypeInfoPath<
  TFieldValues extends FieldValues<FieldValue>,
  Type
> = TypeTemplatePaths<TFieldValues, Type>;
