import React, { memo, useMemo } from 'react'
import { HistoryManagement, StoreContext, useGeschichte } from '../../store.js'

interface Props {
  readonly search?: string
}

const StaticGeschichteProvider = ({
  search,
  children,
}: React.PropsWithChildren<Props>) => {
  const historyInstance: HistoryManagement = useMemo(() => {
    return {
      initialSearch: () => search || '?',
      push: async () => {
        return
      },
      replace: async () => {
        return
      },
    }
  }, [search])

  const value = useMemo(() => useGeschichte(historyInstance), [historyInstance])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export default memo(StaticGeschichteProvider)
