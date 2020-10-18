import { IRuntimeObject } from '../index';
import { runAction, registerAction } from '../runtimeManager';

export function martix(
  mapper: (
    payload: { [key: string]: any },
    variants: Readonly<{ [key: string]: any }>
  ) => { [key: string]: IRuntimeObject },
  key?: string
): IRuntimeObject {
  return {
    type: '*.martix',
    args: { mapper, key }
  };
}

registerAction(
  '*.martix',
  '*',
  ({ mapper, key }) => async (
    payload, variants
  ) => {
    const mapped = mapper(payload, variants);
    if (typeof mapped[key] !== 'undefined') {
      for (const name of Object.keys(mapped).filter(n => n !== key)) {
        setTimeout(() => runAction(
          mapped[name].type, mapped[name].args, payload, variants
        ), 0);
      }
      return await runAction(
        mapped[key].type, mapped[key].args, payload, variants
      );
    }
    else {
      for (const name of Object.keys(mapped)) {
        setTimeout(() => runAction(
          mapped[name].type, mapped[name].args, payload, variants
        ), 0);
      }
      return payload;
    }
  }
)