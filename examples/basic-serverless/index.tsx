import { native } from '../../packages/core/src/index';

@native.serverless('aliyun-fc')
class Services {
  @native.serverless.get('/test')
  public static async test() {
    return 'test';
  }

  @native.http.inject()
  public ctx;
}
