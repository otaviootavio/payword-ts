# Payword on Typescript

It uses npm, TypeScript compiler, Jest, webpack, ESLint, Prettier, husky, pinst, commitlint. The production files include CommonJS, ES Modules, UMD version and TypeScript declaration files.

## Using the library

```bash
npm i payword-ts node-forge
```


```
npm i --save-dev @types/node-forge
```

### Node

```ts
import { UserCertification, UserCertificationSigned, generateUserCertification, hash, verifyUserCertificationSigned } from 'paywordts'
import dotenv from 'dotenv'
import { pki } from 'node-forge'

dotenv.config()
const brokerPrivateKey = pki.privateKeyFromPem(
    process.env['BROKER_PRIVATE_KEY'] ?? ''
)
const brokerPublicKey = pki.publicKeyFromPem(
    process.env['BROKER_PUBLIC_KEY'] ?? ''
)
const userPrivateKey = pki.privateKeyFromPem(
    process.env['USER_PRIVATE_KEY'] ?? ''
)
const userPublicKey = pki.publicKeyFromPem(process.env['USER_PUBLIC_KEY'] ?? '')

const userCertification: UserCertification = {
    brokerId: 'brokerId',
    userId: 'userId',
    vendorId: 'vendorId',
    expirationDate: 123321,
    toAddress: 'toAddress',
    userPubKey: userPublicKey,
}

const userCertificationSigned: UserCertificationSigned =
    generateUserCertification(userCertification, brokerPrivateKey)

const isValid: boolean = verifyUserCertificationSigned(
    userCertificationSigned,
    brokerPublicKey
)

console.log(isValid)
```

### React ( Vite )
```tsx
import {
  UserCertification,
  UserCertificationSigned,
  UserMessage,
  UserMessageSigned,
  generateUserCertification,
  generateUserMessageSigned,
  getHashChainArrayByMessage,
} from "paywordts";
import "./App.css";
import { pki } from "node-forge";

const brokerPrivateKey = pki.privateKeyFromPem(
  import.meta.env.VITE_BROKER_PRIVATE_KEY ?? ""
);

const userPrivateKey = pki.privateKeyFromPem(
  import.meta.env.VITE_USER_PRIVATE_KEY ?? ""
);
const userPublicKey = pki.publicKeyFromPem(
  import.meta.env.VITE_USER_PUBLIC_KEY ?? ""
);

function App() {
  const userCertification: UserCertification = {
    brokerId: "brokerId",
    userId: "userId",
    vendorId: "vendorId",
    expirationDate: 123321,
    toAddress: "toAddress",
    userPubKey: userPublicKey,
  };

  const userCertificationSigned: UserCertificationSigned =
    generateUserCertification(userCertification, brokerPrivateKey);

  const h0: string = "hashzero";
  const n = 100;
  const hashArray: string[] = getHashChainArrayByMessage(h0, n);
  const hn: string = hashArray[n] ?? "";

  const userMessage: UserMessage = {
    expirationDate: 1010,
    hn,
    n,
    userCertificationSigned,
    vendorId: "vendorId",
  };

  const userMessageSigned: UserMessageSigned = generateUserMessageSigned(
    userPrivateKey,
    userMessage
  );
  return <>{JSON.stringify(userMessageSigned)}</>;
}

export default App;
```
## Development from source
The source code is avaliable at our [repository](https://github.com/otaviootavio/payword-ts)
### Set up tools and environment

You need to have [Node.js](https://nodejs.org/en/download/) installed. Node includes npm as its default package manager.

Open the whole package folder with a good code editor, preferably [Visual Studio Code](https://code.visualstudio.com/download). Consider installing VS Code extensions [ES Lint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

In the VS Code top menu: **Terminal** -> **New Terminal**

### Install dependencies

Install dependencies with npm:

```bash
npm i
```

### Test

Test your code with Jest framework:

```bash
npm run test
```

**Note:** Example TypeScript Package uses [husky](https://typicode.github.io/husky/), [pinst](https://github.com/typicode/pinst) and [commitlint](https://commitlint.js.org/) to automatically execute test and [lint commit message](https://www.conventionalcommits.org/) before every commit.

### Build

Build production (distribution) files in your **dist** folder:

```bash
npm run build
```

It generates CommonJS (in **dist/cjs** folder), ES Modules (in **dist/esm** folder), bundled and minified UMD (in **dist/umd** folder), as well as TypeScript declaration files (in **dist/types** folder).

### Try it before publishing

Run:

```bash
npm link
```

[npm link](https://docs.npmjs.com/cli/v6/commands/npm-link) will create a symlink in the global folder, which may be **{prefix}/lib/node_modules/example-typescript-package** or **C:\Users\<username>\AppData\Roaming\npm\node_modules\example-typescript-package**.

Create an empty folder elsewhere, you don't even need to `npm init` (to generate **package.json**). Open the folder with VS Code, open a terminal and just run:

```bash
npm link example-typescript-package
```

This will create a symbolic link from globally-installed example-typescript-package to **node_modules/** of the current folder.

You can then create a, for example, **testnum.ts** file with the content:

```ts
import { Num } from 'example-typescript-package'
console.log(new Num(5).add(new Num(6)).val() === 11)
```

If you don't see any linting errors in VS Code, if you put your mouse cursor over `Num` and see its type, then it's all good.

Whenever you want to uninstall the globally-installed example-typescript-package and remove the symlink in the global folder, run:

```bash
npm uninstall example-typescript-package -g
```

## References

- [Creating and publishing unscoped public packages - npm docs](https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages)
- [npm-publish - npm docs](https://docs.npmjs.com/cli/v6/commands/npm-publish)
- [Publishing - TypeScript docs](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html)
- [Publishing Node.js packages - GitHub Docs](https://docs.github.com/en/free-pro-team@latest/actions/guides/publishing-nodejs-packages)

Btw, if you want to publish Python package, go to [Example PyPI (Python Package Index) Package & Tutorial / Instruction / Workflow for 2021](https://github.com/tomchen/example_pypi_package).
