import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useNavigationType } from "react-router";

const Context = createContext<string | null>(null);


export const PreviousPageProvider: FC<PropsWithChildren> = ({ children }) => {
  const [stack, setStack] = useState<ReadonlyArray<string>>([])

  const type = useNavigationType()

  useEffect(() => {
    if (stack.length === 0) {
      setStack([location.pathname])
    } else if (type === 'POP') {
      setStack(s => s.slice(1))
    } else {
      setStack(s => [location.pathname, ...s])
    }
  }, [type])

  return (
    <Context.Provider value={stack[1] ?? null}>
      {children}
    </Context.Provider>
  )
}

export const usePreviousPage = () => useContext(Context)