# Nova

A cross-platform peer-to-peer file transfer application.


### Apps and Packages

- `bootstrap`: bootstrapping node
- `client`: desktop client
- `relay`: relay server
- `node`: peer-to-peer server client
- `ui`: a stub React component library shared applications
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

### Build

To build all apps and packages, run the following command:

```
cd nova
npm run build
```

### Develop

To develop all apps and packages, run the following command:

```
cd nova
npm run dev
```

### Workspaces

To work within a workspace, run the following command:

```
cd nova
npm run dev -- --filter [workspace]
```
