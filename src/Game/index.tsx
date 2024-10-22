import { FC, useMemo } from "react"
import { from, useStream } from "../lib"
import type * as Types from "../@types/store"
import { Loading } from "../components/Loading"
import { Setup } from "./Setup"



export const Game: FC<{
  id: string
}> = ({ id }) => {
  const game = useStream(useMemo(() => from<Types.Game>('games').stream(id), [id]))

  if (!game) {
    return <Loading/>
  }

  switch (game.phase) {
    case "setup": return <Setup id={id} game={game}/>
    case "game-over": return <>TODO</>
  }
}