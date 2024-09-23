# unplugin-doctor

🩺 Inject lifecycle hooks in [unplugin](https://github.com/unjs/unplugin) tools for better develop experience.

## Features

- Easy to analysis each step of unplugin
- Provide before / after lifecycle hooks
- Written in typescript
- Support diff origin code with transform result

## Installation

```
pnpm i unplugin-doctor -D
```

## Usage

### Wrap Unplugin

Use [unplugin-vue-router](https://github.com/posva/unplugin-vue-router) as example:

```ts
// vite.config.ts
import Doctor from 'unplugin-doctor'
import VueRouter from 'unplugin-vue-router'

export default defineConfig({
  plugins: [
    Doctor(VueRouter, {
      /* vue router options */
    }).vite({})
  ],
})
```

### Inject Lifecycle Hooks

```ts
Doctor(VueRouter, {}).vite({
  beforeLoad() {
    console.time('[vue router load module]')
  },
  afterLoad(id, code) {
    console.timeEnd('[vue router load module]')
    console.log(id, code)
  }
})
```

## Props

### `props.buildStart`

- Type: `(ctx: { options: Options }) => void | Promise<void>`
- Default: `undefined`

### `props.beforeLoad`

- Type: `(id: string, ctx: { options: Options }) => void | Promise<void>`
- Default: `undefined`

### `props.afterLoad`

- Type: `(id: string, code: TransformResult, ctx: { options: Options }) => void | Promise<void>`
- Default: `undefined`

### `props.beforeTransform`

- Type: `(id: string, code: string, ctx: { options: Options }) => void | Promise<void>`
- Default: `undefined`

### `props.afterTransform`

- Type: `(id: string, code: TransformResult, ctx: { options: Options }) => void | Promise<void>`
- Default: `undefined`

### `props.buildEnd`

- Type: `(ctx: { options: Options }) => void | Promise<void>`
- Default: `undefined`

## License

[MIT](./LICENSE) License © 2024-PRESENT [Tamago](https://github.com/tmg0)
