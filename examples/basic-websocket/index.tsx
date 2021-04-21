import { native } from '../../packages/core/src/index';

@native.websocket()
class Services {
  @native.websocket.get('/test')
  public static async test() {
    return 'test';
  }

  @native.http.inject()
  public ctx;
}
