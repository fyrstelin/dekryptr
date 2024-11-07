import { FC, ReactNode, useMemo, useState } from "react"
import { Game, Screen, User } from "../@types/store"
import { from, id, useLanguage, useStream, useUser, shuffle } from "../lib"
import { map } from "rxjs"
import { Button, Range } from "../components"
import { Group } from "../components/Group"
import { Header } from "../components/Header"


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
  children: ReactNode
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
}> = ({ id: gameId, game }) => {
  const userId = useUser()?.id
  const { nouns } = useLanguage()

  const [messageSize, setMessageSize] = useState<number>()
  const [keySize, setKeySize] = useState<number>()

  const teams = Object.entries(game.players)
    .reduce((acc, [uid, team]) => {
      acc[team] = acc[team] ?? []
      acc[team].push(uid)
      return acc;
    }, {} as Record<string, string[]>)

  const join = (team: string) => () =>
    from<Game>('games')
      .execute(gameId, g => ({
        ...g,
        players: {
          ...g.players,
          [userId!]: team
        }
      }))

  const leave = () =>
    from<Game>('games')
      .execute(gameId, g => {
        const { [userId!]: _, ...players } = g.players
        return ({
          ...g,
          players
        })
      })

  const update = (patch: Partial<{
    keySize: number
    messageSize: number
  }>) =>
    from<Game>('games')
      .execute(gameId, g => ({
        ...g,
        ...patch
      }))

  const startGame = async () => {
    const teams = [
      ...new Set(Object.values(game.players))
    ];
    await Promise.all([
      from<Game>('games')
        .execute(gameId, g => ({
          ...g,
          phase: 'encrypting',
          cryptographer: shuffle(Object.keys(g.players))[0],
          message: shuffle([...new Array(game.keySize).map((_, i) => i)]).slice(0, game.messageSize),
          history: Object.fromEntries(teams.map(id => [id, [] as const]))
        })),
      ...teams.map(teamId => from<Screen>('games', gameId, 'screens')
        .patch(teamId, {
          ciphers: shuffle(nouns).slice(0, 4),
          players: Object.fromEntries(Object.entries(game.players)
            .filter(([_, team]) => team == teamId)
            .map(([id]) => [id, { suggestions: [] }] as const))
        }))
    ])
  }
      

  return <>
    <Header parent="/">{gameId}</Header>
    <main>
      <Range
        range={[2, 6]}
        value={messageSize ?? game.messageSize}
        label="Message size"
        onChange={setMessageSize}
        onSave={messageSize => update({ messageSize })}
      />
      
      <Range
        range={[2, 6]}
        value={keySize ?? game.keySize}
        label="Key size"
        onChange={setKeySize}
        onSave={keySize => update({ keySize })}
      />
      <Group>
        {Object.entries(teams)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([id, team]) =>
          <Team
            key={id}
            team={team}
            onJoin={join(id)}
            onLeave={leave}
          >Team {id}</Team>
        )}
      </Group>

      </main>

    <footer>
      <Group>
        <Button
          onClick={Object.entries(teams).length < 4 ? join(id(3)) : undefined}
        >
          Join new team
        </Button>

        <Button onClick={startGame}>Start game</Button>

      </Group>
    </footer>
  </>
}