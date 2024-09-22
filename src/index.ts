import type { TransformResult, UnpluginInstance, UnpluginOptions } from 'unplugin'
import { createUnplugin } from 'unplugin'

export interface DoctorOptions {
  buildStart?: (ctx: DoctorContext) => void | Promise<void>
  beforeLoad?: (id: string, ctx: DoctorContext) => void | Promise<void>
  afterLoad?: (id: string, code: TransformResult, ctx: DoctorContext) => void | Promise<void>
  beforeTransform?: (id: string, code: string, ctx: DoctorContext) => void | Promise<void>
  afterTransform?: (id: string, code: TransformResult, ctx: DoctorContext) => void | Promise<void>
  buildEnd?: (ctx: DoctorContext) => void | Promise<void>
}

export type DoctorContext = ReturnType<typeof createContext>

export function createContext(options: UnpluginOptions) {
  return {
    options
  }
}

function toArray<T>(array?: T | T[]): Array<T> {
  array = array || []
  if (Array.isArray(array))
    return array
  return [array]
}

export default <T>(unplugin: UnpluginInstance<T>, options: T) => createUnplugin<DoctorOptions | undefined>((lifecycle = {}) => {
  const rawPlugins = toArray(unplugin.raw(options, {} as any))

  const rawOptions: UnpluginOptions[] = rawPlugins.map((options) => {
    const ctx = createContext(options)

    return {
      ...options,

      async buildStart(this) {
        await options.buildStart?.bind(this)()
        await lifecycle.buildStart?.(ctx)
      },

      async load(this, id) {
        await lifecycle.beforeLoad?.(id, ctx)
        const transformResult = await options.load?.bind(this)(id)
        await lifecycle.afterLoad?.(id, transformResult, ctx)
        return transformResult
      },

      async transform(this, code, id) {
        await lifecycle.beforeTransform?.(id, code, ctx)
        const transformResult = await options.transform?.bind(this)(code, id)
        await lifecycle.afterTransform?.(id, transformResult, ctx)
        return transformResult
      },

      async buildEnd(this) {
        await options.buildEnd?.bind(this)()
        await lifecycle.buildEnd?.(ctx)
      },
    }
  })

  if (rawPlugins.length > 1)
    return rawOptions

  return rawOptions[0]
})
