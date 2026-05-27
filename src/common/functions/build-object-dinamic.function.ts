import {validatePropertyObject} from "./validate-property-object";

export const BuildObjectDinamicFunction = <T extends Object>(object: T,keys: string[]|null) => {
  if (!object) throw new Error('Object not found')
  if (!keys || keys.length === 0) return object;
  if (!validatePropertyObject(object,keys)) throw new Error('property not valid')
  return keys.reduce((acc, key) => {
    acc[key] = object[key];
    return acc;
  }, {})
}