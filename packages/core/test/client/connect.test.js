import connect from '../../src/client/connect';
import {
  loadComponent
} from '../../src/client/utils/modelStore';

test('Create a simple component.', () => {
  connect(() => (<p>{"Hello"}</p>), { }, 'test');
  expect(loadComponent('test')).not.toBeUndefined();
});

