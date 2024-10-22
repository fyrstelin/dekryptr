import { FC, ReactNode } from "react";

export const Button: FC<{
  onClick: () => void | Promise<void>
  children: ReactNode
}> = ({
  children,
  onClick
}) => {

  return (
    <button onClick={() => onClick()}>
      {children}
    </button>
  )
}