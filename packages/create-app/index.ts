import inquirer from 'inquirer';
import * as chalk from 'chalk';

console.log(`${chalk.bold('Nickelcat App Creator')} 0.2.0`);

(async () => {
  // TODO Support the native builder, such as electron app or cordova app.
  let config = await inquirer.prompt([
    {
      type: 'list',
      name: 'serverType',
      message: 'Which server framework you want to use?',
      default: 'koa',
      choices: [
        'koa',
        'express',
        'node native only'
      ]
    },
    {
      type: 'list',
      name: 'clientType',
      message: 'Which client framework you want to use?',
      default: 'react',
      choices: [
        'react',
        'vue'
      ]
    },
    {
      type: 'input',
      name: 'appName',
      message: 'What is your app\'s name?'
    }
  ]);

  console.log(`${chalk.green('Please wait for a while, we are building your app now...')}`);
  console.log(`${chalk.cyan('Maybe you should have a coffee? :P')}`);

  console.log(config);
})();
