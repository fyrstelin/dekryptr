import { FC, useMemo } from "react"
import { Game, User } from "../@types/store"
import { from, useStream, useUser } from "../lib"
import { map } from "rxjs"
import { Button } from "../components"
import { Group } from "../components/Group"

const PlayerName: FC<{
  uid: string
}> = ({ uid }) => {
  const name = useStream(useMemo(() => from<User>('users')
    .stream(uid)
    .pipe(
      map(x => x.name || 'Mr unknown')
    ), [uid]))

  return <>{name}</>
}

const Team: FC<{
  team: ReadonlyArray<string>
  children: string
  onJoin: () => Promise<void>
  onLeave: () => Promise<void>
}> = ({
  team,
  children,
  onJoin,
  onLeave
}) => {
  const userId = useUser()?.id ?? '';
  const onTeam = userId && team.includes(userId);

  return (
    <>
      <h1>
        {children}
      </h1>
      
      {onTeam
          ? team.includes(userId)
            ? <Button onClick={onLeave}>
              Leave
            </Button>
            : null
          : <Button onClick={onJoin}>
            Join
          </Button>
        }
      
      <ul>
        {team.map(uid => <li key={uid}>
          <PlayerName uid={uid}/>
        </li>)}
      </ul>
    </>
  )
}

export const Setup: FC<{
  id: string
  game: Game & {
    phase: 'setup'
  }
}> = ({ id, game }) => {
  const userId = useUser()?.id

  const teams = Object.entries(game.players)
    .reduce((acc, [uid, team]) => {
      acc[team].push(uid)
      return acc;
    }, {
      'team-1': [] as string[],
      'team-2': [] as string[]
    })

  const join = (team: 'team-1' | 'team-2') => () =>
    from<Game>('games')
      .execute(id, g => ({
        ...g,
        players: {
          ...g.players,
          [userId!]: team
        }
      }))

  const leave = () =>
    from<Game>('games')
      .execute(id, g => {
        const { [userId!]: _, ...players } = g.players
        return ({
          ...g,
          players
        })
      })

  return <>
    <header>{id}</header>
    <main>
      <Group>
        <Team
          team={teams['team-1']}
          onJoin={join('team-1')}
          onLeave={leave}
        >Team 1</Team>  
        <Team
          team={teams['team-2']}
          onJoin={join('team-2')}
          onLeave={leave}
        >Team 2</Team>  
      </Group>
    </main>

  </>
}