import * as ImmutableUtils from './ImmutableUtils';

export const normalize = (schema, input, parent, key, visit, addEntity) => {
  const object = { ...input };
  Object.keys(schema).forEach((key) => {
    const localSchema = schema[key];
    const value = visit(input[key], input, key, localSchema, addEntity);
    if (value === undefined || value === null) {
      delete object[key];
    } else {
      object[key] = value;
    }
  });
  return object;
};

export const denormalize = (schema, input, unvisit, cache) => {
  if (ImmutableUtils.isImmutable(input)) {
    return ImmutableUtils.denormalizeImmutable(schema, input, unvisit, cache);
  }

  const object = { ...input };
  Object.keys(schema).forEach((key) => {
    if (object[key]) {
      object[key] = unvisit(object[key], schema[key], cache);
    }
  });
  return object;
};

export default class ObjectSchema {
  constructor(definition) {
    this.define(definition);
  }

  define(definition) {
    this.schema = Object.keys(definition).reduce((entitySchema, key) => {
      const schema = definition[key];
      return { ...entitySchema, [key]: schema };
    }, this.schema || {});
  }

  normalize(...args) {
    return normalize(this.schema, ...args);
  }

  denormalize(...args) {
    return denormalize(this.schema, ...args);
  }
}
