# Requirements

* React 17
* Node >14

## Before install

This Package is distributed by eslavadev github registry. Create an `.npmrc` file with the following content in your project:
```bash
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
@eslavadev:registry=https://npm.pkg.github.com
```
`NPM_TOKEN` is a github personal access token. You can create one [here](https://github.com/settings/tokens) and enable `read:packages` permission, that will allow you to download `@eslavadev` scoped packages.

## Installation

```bash
npm i react react-dom @eslavadev/illidan
```

## Configure env variables

Configure the env variables for every scope in the root of your project.

```
.env.development
.env.test
.env.sandbox
.env.staging
.env.production
```