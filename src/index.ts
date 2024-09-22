import type { TransformResult, UnpluginInstance, UnpluginOptions } from 'unplugin'
import { createUnplugin } from 'unplugin'

export interface DoctorOptions {
  buildStart?: (ctx: DoctorContext) => void | Promise<void>
  beforeLoad?: (ctx: DoctorContext) => void | Promise<void>
  afterLoad?: (ctx: DoctorContext) => void | Promise<void>
  beforeTransform?: (ctx: DoctorContext) => void | Promise<void>
  afterTransform?: (ctx: DoctorContext) => void | Promise<void>
  buildEnd?: (ctx: DoctorContext) => void | Promise<void>
}

export type DoctorContext = ReturnType<typeof createContext>

export function createContext(options: UnpluginOptions) {
  const _id = ''
  const _code = ''
  const _transformResult = undefined as TransformResult

  return {
    id: _id,
    code: _code,
    transformResult: _transformResult,
    options,
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
        ctx.id = id
        await lifecycle.beforeLoad?.(ctx)
        const transformResult = await options.load?.bind(this)(id)
        ctx.transformResult = transformResult
        await lifecycle.afterLoad?.(ctx)
        return transformResult
      },

      async transform(this, code, id) {
        ctx.id = id
        ctx.code = code
        await lifecycle.beforeTransform?.(ctx)
        const transformResult = await options.transform?.bind(this)(code, id)
        ctx.transformResult = transformResult
        await lifecycle.afterTransform?.(ctx)
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
