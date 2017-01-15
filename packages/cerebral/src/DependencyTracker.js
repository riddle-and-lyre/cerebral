import {dependencyMatch} from './utils'

class StateTracker {
  constructor (computed) {
    this.propsTrackMap = {}
    this.stateTrackMap = {}
    this.computed = computed
    this.value = null
  }

  run (stateGetter, propsGetter) {
    const newStateTrackMap = {}
    const newPropsTrackMap = {}
    const stateTrackMap = this.stateTrackMap
    const propsTrackMap = this.propsTrackMap
    let hasChanged = false

    this.value = this.computed.getValue({
      state (path) {
        newStateTrackMap[path] = true

        if (!stateTrackMap[path]) hasChanged = true

        return stateGetter(path)
      },
      props (path) {
        newPropsTrackMap[path] = true

        if (!propsTrackMap[path]) hasChanged = true

        return propsGetter(path)
      }
    })

    this.stateTrackMap = newStateTrackMap
    this.propsTrackMap = newPropsTrackMap

    return hasChanged
  }

  match (stateChanges, propsChanges) {
    return (
      Boolean(dependencyMatch(stateChanges, this.stateTrackMap).length) ||
      Boolean(dependencyMatch(propsChanges, this.propsTrackMap).length)
    )
  }
}

export default StateTracker