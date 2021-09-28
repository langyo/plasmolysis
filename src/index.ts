import BabelCore, { PluginObj } from '@babel/core';
import generate from '@babel/generator';
import { join, parse } from 'path';

/*
  插件只做一件事，抽离、移动不属于目标编译平台的代码片段
  用户需要做的，是根据需求调用 controllerStreamLib 中的特殊标记函数（remote 函数），指定某部分代码在某位置执行
  特殊标记函数除了接受一个函数对象以外，还接受一批标记的变量，这是跨平台传递信息时准备传递的参数

  具体的解析流程思路：
  1.  完整遍历所有对外引用（原则上只分析 import 语句，require 函数因其不确定性不予解析）并记录
  2.  遍历所有对被特殊标记的函数的调用，抽离与记录交给目标平台执行的代码
  2.1.  检查调用方提供的第二个参数，确认其作用域引用了最外层 import 的哪些语句，记录下来
        其中分为两种情况，一种是第二个参数直接引用一个外部文件导出的常量，另一种是当场定义函数对象
        此举是为了一并抽离不兼容的 import 语句，例如在浏览器中引用了 node 环境才有的 fs 模块时就需要进行抽离
  2.2.  储存第二个参数的 AST 树对象，然后剪裁节点，将第二个参数替换为返回唯一的交换编号的函数
        这个交换编号是编译时从数字 1 逐个分配的，发起调用的平台一侧的 remote 函数能够自动执行并依据此编号发送请求数据包
  2.3.  检查抽离了第二个参数后的整个源代码 AST 树，如果先前记录的对外引用中有不再被引用的，同时移除这些无效节点
        因为可能有部分引用是发起调用的平台与目标平台都在使用，所以不能贸然移除引用节点
  3.  将抽离出来的远程调用打包写入临时文件，供目标平台的工具函数联合编译
  3.1.  以原来所属的每一个文件为单位，写入此文件当时被抽离的所有对外引用与远程调用的具体逻辑，输出为文本格式的源码
        远程调用的函数将通过常量导出（export const 语句）来公开，常量名为每个函数对应的交换编号
  3.2.  生成一份整合的源码，默认导出一个映射表，供目标平台的服务逻辑读取与装载
        映射表以交换编号对应具体的执行函数，通过从上一个步骤生成的每一份文件导入常量以获取对应的函数
*/

export function BabelPluginObj({ types }: typeof BabelCore): PluginObj {
  return {
    name: 'nickelcat-demo',
    visitor: {
      Program(globalPath, state) {
        // 对引用了 controllerStreamLib 的文件进行处理，检查引用情况
        globalPath.traverse({
          ImportDeclaration(path) {
            console.debug('提取完整语句内容测试：', generate(path.node).code);
            if (path.node.source.value[0] === '.') {
              let filePath = join(
                parse(state.file.opts.filename).dir,
                path.node.source.value
              );
              if (!/\.ts$/.test(filePath)) {
                filePath = `${filePath}.ts`;
              }
              if (
                filePath ===
                join(process.cwd(), './src/utils/controllerStreamLib.ts')
              ) {
                // 解析到了特殊函数 remote 的引用，提取引用的标识符
                path.traverse({
                  ImportSpecifier(path) {
                    if (
                      types.isIdentifier(path.node.imported) &&
                      path.node.imported.name === 'remote'
                    ) {
                      console.debug(
                        '检查到跨平台请求的特殊函数引用 remote：',
                        path.node.local.name
                      );
                    }
                  },
                });
              }
            }
          },
        });
      },
    },
  };
}
