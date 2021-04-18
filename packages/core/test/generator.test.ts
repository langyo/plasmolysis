import { parse } from '../utils/astParser';
import { transform } from '../src/generator';

describe('Simgle environment filter', () => {
  test('On top, same environment', async () => {
    const source = `
      'on client';
      let i = 1;
    `;
    const target = `
      let i = 1;
    `;
    expect(transform(source, 'client')).toEqual(parse(target));
  });

  test('On top, different environment', async () => {
    const source = `
      'on server';
      let i = 1;
    `;
    const target = `
    `;
    expect(transform(source, 'client')).toEqual(parse(target));
  });

  test('On block, same environment', async () => {
    const source = `
      {
        'on client';
        let i = 1;
      }
    `;
    const target = `
      {
        let i = 1;
      }
    `;
    expect(transform(source, 'client')).toEqual(parse(target));
  });

  test('On block, different environment', async () => {
    const source = `
      {
        'on server';
        let i = 1;
      }
    `;
    const target = `
      {
      }
    `;
    expect(transform(source, 'client')).toEqual(parse(target));
  });

  test('On function, same environment', async () => {
    const source = `
      function test() {
        'on client';
        let i = 1;
      }
    `;
    const target = `
      function test() {
        let i = 1;
      }
    `;
    expect(transform(source, 'client')).toEqual(parse(target));
  });

  test('On function, different environment', async () => {
    const source = `
      function test() {
        'on server';
        let i = 1;
      }
    `;
    const target = `
      function test() {
      }
    `;
    expect(transform(source, 'client')).toEqual(parse(target));
  });
});

describe('Multiple environment filter', () => {
  test('On top, same environment', async () => {
    const source = `
      'on client';
      let i = 1;
      'on client';
      let j = 1;
    `;
    const target = `
      let i = 1;
      let j = 1;
    `;
    expect(transform(source, 'client')).toEqual(parse(target));
  });

  test('On top, different environment', async () => {
    const source = `
      'on client';
      let i = 1;
      'on server';
      let j = 1;
    `;
    const target = `
      let i = 1;
    `;
    expect(transform(source, 'client')).toEqual(parse(target));
  });

  test('On block, same environment', async () => {
    const source = `
      'on client';
      let i = 1;
      {
        'on client';
        let i = 1;
      }
      'on client';
      let j = 1;
    `;
    const target = `
      let i = 1;
      {
        let i = 1;
      }
      let j = 1;
    `;
    expect(transform(source, 'client')).toEqual(parse(target));
  });

  test('On block, different environment', async () => {
    const source = `
      'on client';
      let i = 1;
      {
        'on server';
        let i = 1;
      }
      'on client';
      let j = 1;
      {
        'on server';
        let j = 1;
      }
      'on server';
      let k = 1;
    `;
    const target = `
      let i = 1;
      {
        'on server';
      }
      let j = 1;
      {
      }
    `;
    expect(transform(source, 'client')).toEqual(parse(target));
  });

  test('On function, same environment', async () => {
    const source = `
      'on client';
      let i = 1;
      function test() {
        'on client';
        let i = 1;
      }
      'on client';
      let j = 1;
    `;
    const target = `
      let i = 1;
      function test() {
        let i = 1;
      }
      let j = 1;
    `;
    expect(transform(source, 'client')).toEqual(parse(target));
  });

  test('On function, different environment', async () => {
    const source = `
      'on client';
      let i = 1;
      function test() {
        'on server';
        let i = 1;
      }
      'on server';
      let j = 1;
    `;
    const target = `
      let i = 1;
      function test() {
      }
    `;
    expect(transform(source, 'client')).toEqual(parse(target));
  });
});

describe('Transform data between different platform', () => {
  test('On function, transform closure', () => {
    const source = `
      'on client';
      let i = 1;
      function test() {
        'on server';
        i = 3;
      }
      test();
    `;
    const targetOnClient = `
      var __remoteContext = require('nickelcat-action-preset').generateRemoteContext('client');
      let i = 1;
      function test() {
        // Context 0
        __remoteContext.connect('server', 0, {
          closure: { i },
          arguments
        }).callback(function (context) {
          i = context.closure.i;
        });
      }
      test();
    `;
    const targetOnServer = `
      var __remoteContext = require('nickelcat-action-preset').generateRemoteContext('server');
      __remoteContext.register('test', 0, function (__remoteContext) {
        // Context 0
        var i = __remoteContext.closure.get('i');
        i = 3;
        __remoteContext.closure.set('i', i);
      });
    `;
    expect(transform(source, 'client')).toEqual(parse(targetOnClient));
    expect(transform(source, 'server')).toEqual(parse(targetOnServer));
  });

  test('On function, transform arguments', () => {
    const source = `
      'on client';
      let i = 1;
      function test(i) {
        'on server';
        return i + 3;
      }
      i = test(i);
    `;
    const targetOnClient = `
      var __remoteContext = require('nickelcat-action-preset').generateRemoteContext('client');
      let i = 1;
      function test() {
        // Context 0
        __remoteContext.connect('server', 0, {
          closure: {},
          arguments
        }).callback(function (context) { });
      }
      i = test(i);
    `;
    const targetOnServer = `
      var __remoteContext = require('nickelcat-action-preset').generateRemoteContext('server');
      __remoteContext.register('test', 0, function (__remoteContext) {
        // Context 0
        var i = __remoteContext.arguments.get(0);
        __remoteContext.callback(i + 3);
      });
    `;
    expect(transform(source, 'client')).toEqual(parse(targetOnClient));
    expect(transform(source, 'server')).toEqual(parse(targetOnServer));
  });
});
