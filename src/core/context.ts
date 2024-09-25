import type { UnpluginOptions } from 'unplugin'
import type { DoctorAnalysis } from './types'

export function createContext(plugins: UnpluginOptions[]) {
  let _index = 0
  const data: Record<string, DoctorAnalysis> = {}

  const inter = {
    next: () => { _index++ },
    clear: () => { _index = 0 },
    get: () => _index,
  }

  return {
    data,
    plugins,
    inter,

    get options() {
      return plugins[_index]
    },
  }
}
