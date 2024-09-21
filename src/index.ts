import { createUnplugin, type TransformResult, type UnpluginInstance, type UnpluginOptions } from 'unplugin'

export interface DoctorOptions {
  buildStart?: (options: UnpluginOptions) => void | Promise<void>
  load?: (id: string, transformResult: TransformResult, options: UnpluginOptions) => void | Promise<void>
  transform?: (id: string, code: string, transformResult: TransformResult, options: UnpluginOptions) => void | Promise<void>
  buildEnd?: (options: UnpluginOptions) => void | Promise<void>
}

export default <T>(unplugin: UnpluginInstance<T>, options: T) => createUnplugin<DoctorOptions | undefined>((lifecycle = {}) => {
  const factory = unplugin.raw(options, {} as any)
  const rawFactories = Array.isArray(factory) ? factory : [factory]
  const isMultipe = rawFactories.length > 1

  const rawOptions: UnpluginOptions[] = rawFactories.map(options => ({
    ...options,

    async buildStart(this) {
      await options.buildStart?.bind(this)()
      await lifecycle.buildStart?.(options)
    },

    async load(this, id) {
      const transformResult = await options.load?.bind(this)(id)
      if (transformResult)
        await lifecycle.load?.(id, transformResult, options)
      return transformResult
    },

    async transform(this, code, id) {
      const transformResult = await options.transform?.bind(this)(code, id)
      if (transformResult)
        await lifecycle.transform?.(id, code, transformResult, options)
      return transformResult
    },

    async buildEnd(this) {
      await options.buildEnd?.bind(this)()
      await lifecycle.buildEnd?.(options)
    },
  }))

  if (isMultipe)
    return rawOptions

  return rawOptions[0]
})
