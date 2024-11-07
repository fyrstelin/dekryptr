import { FC, useMemo } from "react"
import { from, useStream } from "../lib"
import type * as Types from "../@types/store"
import { Loading } from "../components/Loading"
import { Setup } from "./Setup"
import { Button } from "../components"
import { InProgress } from "./InProgress"


export const Game: FC<{
  id: string
}> = ({ id }) => {
  const game = useStream(useMemo(() => from<Types.Game>('games').stream(id), [id]))

  const reset = () => from<Types.Game>('games')
    .execute(id, g => ({
      ...g,
      phase: 'setup'
    }))

  if (!game) {
    return <Loading/>
  }

  switch (game.phase) {
    case "setup": return <Setup id={id} game={game}/>
    case 'encrypting': return <InProgress id={id} game={game}/>
    default: return (
      <main>
        <h2>Unknown game phase: {game.phase}</h2>
        <pre>{JSON.stringify(game, undefined, 2)}</pre>
        <Button onClick={reset}>Reset</Button>
      </main>
    )
  }
}