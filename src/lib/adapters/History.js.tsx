/* tslint:disable:no-expression-statement readonly-array */
import { History } from 'history'
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo
} from 'react'
import { StoreApi, UseStore } from 'zustand'
// tslint:disable-next-line:no-submodule-imports
import shallow from 'zustand/shallow'
import { StoreState } from '../middleware'
import { geschichte, HistoryManagement, StoreContext } from '../store'

export interface Props {
  /** a history instance (e.g. createBrowserHistory()) */
  readonly history: History
  readonly children: React.ReactNode
}

export interface Refs {
  readonly updateFromQuery: (query: string) => void
}

const GeschichteWithHistory = forwardRef<Refs, Props>(
  ({ children, history }, ref) => {
    const historyInstance: HistoryManagement = useMemo(() => {
      return {
        initialSearch: history.location.search,
        push: (next: string) =>
          history.push({ search: next, state: { __g__: true } }),
        replace: (next: string) =>
          history.replace({ search: next, state: { __g__: true } })
      }
    }, [history])

    const value = useMemo(() => geschichte(historyInstance), []) as [
      UseStore<StoreState<any>>,
      StoreApi<StoreState<any>>
    ]
    const [useStore] = value
    const state = useStore(
      ({ unregister, updateFromQuery }: StoreState<any>) => ({
        unregister,
        updateFromQuery
      }),
      shallow
    )

    useEffect(() => {
      return history.listen((location, action) => {
        // don't handle our own actions
        if (
          (action === 'REPLACE' || action === 'PUSH') &&
          location.state &&
          // @ts-ignore
          location.state.__g__
        ) {
          return
        }
        state.updateFromQuery(location.search)
      })
    }, [history, state.updateFromQuery])

    useImperativeHandle(
      ref,
      () => ({
        updateFromQuery: state.updateFromQuery
      }),
      [state]
    )
    useEffect(() => {
      const { unregister } = state
      return () => {
        return unregister()
      }
    }, [state])
    return (
      <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
    )
  }
)

export default GeschichteWithHistory