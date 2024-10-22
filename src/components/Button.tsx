import { FC, ReactNode, useState } from "react";

const Loading = () => {

  return <>...</>
}

export const Button: FC<{
  onClick?: () => Promise<void>
  children: ReactNode
}> = ({
  children,
  onClick
}) => {
  const [working, setWorking] = useState(false)

  return (
    <button disabled={working || !onClick} onClick={async () => {
      if (onClick) {
        setWorking(true)
        onClick()
        .finally(() => setWorking(false))
      }
    }}>
      {working ? <Loading/> : children}
    </button>
  )
}