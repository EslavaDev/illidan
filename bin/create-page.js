const fse = require('fs-extra');
const path = require('path');

const root = process.cwd();

async function run({ page: name }) {
  // eslint-disable-next-line no-param-reassign
  name = name.toLowerCase().trim();
  const baseSsrPath = path.resolve(root, 'src/app/pages/', name);
  const baseClientPath = path.resolve(root, 'src/app/client');

  const exist = await fse.pathExists(baseSsrPath);

  if (exist) {
    throw Error(`Path ${baseSsrPath} already exist`);
  }

  const controller = `${baseSsrPath}/controller.tsx`;
  const view = `${baseSsrPath}/view.tsx`;
  const index = `${baseSsrPath}/index.ts`;
  const styles = `${baseSsrPath}/${name}.scss`;
  const client = `${baseClientPath}/${name}.tsx`;

  const ComponentName = name.charAt(0).toUpperCase() + name.slice(1);

  await fse.outputFile(
    view,
    `import { FC } from 'react';
import { Page } from '@eslavadev/illidian/declarative';

export const ${ComponentName}: FC<{ state: any }> = ({ state }) => {
  return (
    <Page state={state}>
      <h1>${ComponentName} works!</h1>
    </Page>
  );
};
`,
    'utf8',
  );
  console.log('Created view at: ', view);
  await fse.outputFile(
    controller,
    `import { FC } from 'react';
import { Request, Response } from '@eslavadev/illidian/server';
import { ${ComponentName} } from 'app/pages/${name}/view';

export const render = (req: Request, res: Response) => {
  const state = {};
  const View: FC<any> = () => (
    <>
      <${ComponentName} state={state} />
    </>
  );
  res.reactRender(View, {
    title: req.t('${name}.works'),
    clientName: '${name}',
  });
};
`,
    'utf8',
  );
  console.log('Created controller at: ', view);
  await fse.outputFile(
    index,
    `import { Router } from '@eslavadev/illidian/server';
import { isAuthorized } from '@eslavadev/illidian/middlewares';
import { render } from './controller';

const router = Router();

router.get('/', isAuthorized(['${name}:read']), render);

export default router;
`,
    'utf8',
  );
  console.log('Created index at: ', view);

  await fse.outputFile(styles, '', 'utf8');

  console.log('Created styles at: ', view);

  await fse.outputFile(
    client,
    `import { hydrate } from '@eslavadev/illidian/client';
import { ${ComponentName} } from 'app/pages/${name}/view';

hydrate((state) => <${ComponentName} state={state} />);
`,
    'utf8',
  );
  console.log('Created client hydrate at: ', client);

  const illidanConfigPath = path.resolve(root, 'illidan.config.js');

  // eslint-disable-next-line import/no-dynamic-require
  const illidanConfig = require(illidanConfigPath);
  illidanConfig.clientEntry[name] = [
    `./src/app/client/${name}.tsx`,
    `./src/app/pages/${name}/${name}.scss`,
  ];
  await fse.outputFile(
    illidanConfigPath,
    JSON.stringify(illidanConfig.clientEntry, null, 2),
    'utf8',
  );

  console.log('added entries hydrate at: ', illidanConfigPath);
}

module.exports = run;
