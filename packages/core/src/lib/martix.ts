import { IRuntimeObject } from '../index';
import { runAction, registerAction } from '../runtimeManager';
import { actionEnterEvent, actionLeaveEvent } from '../logManager';

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
        setTimeout(() => {
          actionEnterEvent(mapped[name].type, variants.entityId, payload);
          runAction(mapped[name].type, mapped[name].args, payload, variants);
          actionLeaveEvent(mapped[name].type, variants.entityId, payload);
        }, 0);
      }
      actionEnterEvent(mapped[key].type, variants.entityId, payload);
      const ret = await runAction(
        mapped[key].type, mapped[key].args, payload, variants
      );
      actionLeaveEvent(mapped[key].type, variants.entityId, payload);
      return ret;
    }
    else {
      for (const name of Object.keys(mapped)) {
        setTimeout(() => {
          actionEnterEvent(mapped[name].type, variants.entityId, payload);
          runAction(mapped[name].type, mapped[name].args, payload, variants);
          actionLeaveEvent(mapped[name].type, variants.entityId, payload);
        }, 0);
      }
      return payload;
    }
  }
)