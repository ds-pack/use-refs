import { useRef } from 'react'

type Key = string
type Register = (key: Key) => (value: any) => void
type GetRef = (key: Key) => any
type RefMap = Map<Key, any>

export function useRefs(): [Register, GetRef, RefMap] {
  const refs = useRef(new Map())

  function register(key: Key) {
    if (!key) {
      throw new Error("`useRefs`' `register` method called without a key.")
    }
    return function (ref: any) {
      refs.current.set(key, ref)
    }
  }

  function getRef(key: Key) {
    return refs.current.get(key)
  }

  return [register, getRef, refs.current]
}

type RefLike = { current: any } | ((value: any) => void)

export function mergeRefs(...refs: Array<RefLike>) {
  return function (reference: any) {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(reference)
      } else if (
        typeof ref === 'object' &&
        ref != null &&
        !Array.isArray(ref)
      ) {
        ref.current = reference
      }
    })
  }
}

export function useSharedRef(...refs: Array<RefLike>) {
  let localRef = useRef()

  return {
    set current(el) {
      mergeRefs(...refs, localRef)(el)
    },
    get current() {
      return localRef.current
    },
  }
}
