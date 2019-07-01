const path = require("path");
const fs = require("fs");

const chalk = require("chalk");
const shelljs = require("shelljs");
const prompts = require('prompts');

const DEFAULT_FOLDER = "trust-scripts-demo";

const init = async ({ folder = "trust-scripts-demo" }) => {
  console.log();
  const response = await prompts({
    type: 'text',
    name: 'folder',
    message: 'Name your project?',
    initial: DEFAULT_FOLDER,
  });

  const projectName = response.folder || folder;

  const cwd = process.cwd();
  const templatePath = path.join(__dirname, '../', 'template');
  const projectPath = path.join(cwd, folder);
  if (!fs.existsSync(projectPath)) {
    console.log(
      chalk.green("INFO:"),
      `PATH: ${chalk.yellow(projectPath)} not exists`
    );

    console.log(chalk.green("- Create folder..."));
    shelljs.mkdir(projectPath);
    console.log(chalk.green(`√ Create Success ${projectPath}!`));
  }

  console.log(chalk.green('- Copy the template...'));
  shelljs.cp("-r", `${templatePath}/*`, projectPath);
  console.log(chalk.green("√ Copy Success!"));

  console.log(chalk.green("- Run npm install..."))
  shelljs.cd(projectName);
  if (shelljs.exec('npm install').code !== 0) {
    shelljs.echo('Error: npm install failed');
    shelljs.exit(1);
    process.exit(1);
  }
  console.log(chalk.green("\n√ NPM install succeed!"))
  console.log(chalk.blue("\n========================================================================================"))
  console.log(chalk.blue('\nWelcome to use trust-scripts!!!'))
  console.log(chalk.blue('Follow the next steps, and build your awesome project without caring about how to build\n'))
  console.log(chalk.green(`1. cd ${folder}`));
  // console.log(chalk.green(`2. npm install`));
  console.log(chalk.green(`2. npm start`));
  console.log(chalk.green(`3. npm run build`));
  console.log(chalk.blue("\n========================================================================================"))
};

module.exports = init;
