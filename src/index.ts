import { createHooks, type Hookable } from 'hookable'
import { createUnplugin, type UnpluginOptions } from 'unplugin'

export interface DoctorOptions {
  unplugin :Array<UnpluginOptions> | UnpluginOptions
  lifecycle: (hooks: Hookable<Record<string, any>, string>) => void
}

export const unplugin = createUnplugin<DoctorOptions>(({ unplugin }) => {
  const hooks = createHooks()
  const unpluginOptions = Array.isArray(unplugin) ? unplugin : [unplugin]
  const isMultipe = unpluginOptions.length > 1

  hooks.callHook('docker:setup', unplugin)

  function normalizeHookName(name: string, options: UnpluginOptions) {
    return [
      isMultipe ? options.name : undefined,
      name,
    ].filter(Boolean).join(':')
  }

  const values: DoctorOptions['unplugin'] = unpluginOptions.map(options => ({
    ...options,

    async buildStart(this) {
      await options.buildStart?.call(this)
      hooks.callHook(normalizeHookName('buildStart', options))
    },

    async load(this, id) {
      const transformResult = await options.load?.call(this, id)
      if (transformResult)
        hooks.callHook(normalizeHookName('load', options), id, transformResult)
    },

    async transform(this, code, id) {
      const transformResult = await options.transform?.call(this, code, id)
      hooks.callHook(normalizeHookName('transform', options), id, transformResult)
    },

    async buildEnd(this) {
      await options.buildEnd?.call(this)
      hooks.callHook(normalizeHookName('buildEnd', options))
    },
  }))

  if (isMultipe)
    return values

  return values[0]
})

export default unplugin
