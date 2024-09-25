import type { UnpluginInstance, UnpluginOptions } from 'unplugin'
import type { DoctorOptions } from './core/types'
import { createUnplugin } from 'unplugin'
import { createContext } from './core/context'

function toArray<T>(array?: T | T[]): Array<T> {
  array = array || []
  if (Array.isArray(array))
    return array
  return [array]
}

export default <T>(unplugin: UnpluginInstance<T>, options: T = {} as any) => createUnplugin<DoctorOptions | undefined>((lifecycle = {}) => {
  const rawPlugins = toArray(unplugin.raw(options, {} as any))
  const ctx = createContext(rawPlugins)

  const rawOptions = rawPlugins.map((options) => {
    const r: UnpluginOptions = {
      ...options,

      async buildStart(this) {
        await options.buildStart?.bind(this)()
        await lifecycle.buildStart?.(ctx)
      },

      loadInclude(this, id) {
        let isInclude = options.loadInclude?.bind(this)(id)
        isInclude = lifecycle.afterLoadInclude?.(id, isInclude, ctx) ?? isInclude
        return isInclude
      },

      async load(this, id) {
        id = await lifecycle.beforeLoad?.(id, ctx) ?? id
        let transformResult = await options.load?.bind(this)(id)
        transformResult = await lifecycle.afterLoad?.(id, transformResult, ctx) ?? transformResult
        return transformResult
      },

      async transform(this, code, id) {
        const { code: _code, id: _id } = await lifecycle.beforeTransform?.(id, code, ctx) ?? {}
        code = _code ?? code
        id = _id ?? id
        let transformResult = await options.transform?.bind(this)(code, id)
        transformResult = await lifecycle.afterTransform?.(id, transformResult, ctx) ?? transformResult
        return transformResult
      },

      async buildEnd(this) {
        await options.buildEnd?.bind(this)()
        await lifecycle.buildEnd?.(ctx)
      },
    }

    ctx.inter.next()

    return r
  })

  ctx.inter.clear()

  if (rawPlugins.length > 1)
    return rawOptions

  return rawOptions[0]
})
