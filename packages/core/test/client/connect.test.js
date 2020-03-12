import connect from '../../src/connect';
import * from '../../src/utils/modelStore';

test('Create a simple component.', () => {
  connect(() => (<p>{"Hello"}</p>), { }, 'test');
  expect(loadComponent(test)).not.toBeUndefined();
});

