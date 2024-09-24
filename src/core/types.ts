import type { TransformResult } from 'unplugin'
import type { createContext } from './context'

export type MaybePromise<T> = T | Promise<T>

export interface BeforeTransformReturn {
  id?: string
  code?: string
}

export type DoctorContext = ReturnType<typeof createContext>

export interface DoctorOptions {
  buildStart?: (ctx: DoctorContext) => void | Promise<void>
  afterLoadInclude?: (id: string, isInclude: boolean | null | undefined, ctx: DoctorContext) => void | boolean | null | undefined
  beforeLoad?: (id: string, ctx: DoctorContext) => MaybePromise<string | void>
  afterLoad?: (id: string, code: TransformResult, ctx: DoctorContext) => MaybePromise<TransformResult | void>
  beforeTransform?: (id: string, code: string, ctx: DoctorContext) => MaybePromise<BeforeTransformReturn | void>
  afterTransform?: (id: string, code: TransformResult, ctx: DoctorContext) => MaybePromise<TransformResult | void>
  buildEnd?: (ctx: DoctorContext) => void | Promise<void>
}

export interface LifecycleAnalysis {
  duration: number
}

export interface DoctorAnalysis {
  buildStart?: LifecycleAnalysis
}
