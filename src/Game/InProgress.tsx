import { FC, Fragment, PropsWithChildren, useEffect, useMemo, useState } from "react";
import { Game, Screen } from "../@types/store";
import { from, useStream, useUser } from "../lib";
import { Group } from "../components/Group";
import { Header } from "../components/Header";
import cx from 'classnames'
import styles from './InProgress.module.css'
import { map, NEVER } from "rxjs";
import { Button } from "../components";

const nothing = [] as const

const Cipher: FC<PropsWithChildren<{
  onClick: () => void
  selected: boolean
}>> = ({ children, onClick, selected }) => (
  <div className={cx(styles.cipher, { [styles.selected]: selected })} onClick={onClick}>
    {children}
  </div>
) 

const Hint: FC<PropsWithChildren<{
  onClick: () => void
  selected: boolean
  mySuggestion?: string
}>> = ({ children, onClick, selected, mySuggestion }) => (
  <div className={cx(styles.hint, { [styles.selected]: selected })} onClick={onClick}>
    {children}
    <div className={styles['my-suggestion']}>{mySuggestion}</div>
  </div>
)

export const InProgress: FC<{
  id: string
  game: Game & {
    phase: 'encrypting' | 'decrypting'
  }
}> = ({
  id: gameId,
  game
}) => {
  const userId = useUser()?.id ?? ''

  const myTeam = game.players[userId]
  const teamInTurn = game.players[userId] == game.players[game.cryptographer]
  const myTurn = game.cryptographer == userId

  const [suggestions, setSuggestions] = useState<ReadonlyArray<number | undefined>>([])
  const [selectedHint, setSelectedHint] = useState<number>()
  const [selectedCipher, setSelectedCipher] = useState<number>()

  useEffect(() => {
    if (selectedHint == undefined || selectedCipher == undefined) return

    setSelectedCipher(undefined)
    setSelectedHint(undefined)
    setSuggestions(s => s
      .map(x => x === selectedCipher ? undefined : x)
      .map((x, i) => i === selectedHint ? selectedCipher : x)
    )
  }, [selectedHint, selectedCipher])

  const myCiphers = useStream(
    useMemo(
      () => myTeam
        ? from<Screen>('games', gameId, 'screens')
          .stream(myTeam)
          .pipe(
            map(s => s.ciphers)
          )
        : NEVER,
      [gameId, myTeam]
    )
  ) ?? nothing
  const ciphers = teamInTurn ? myCiphers : myCiphers.map(() => '?') 

  const [hints, setHints] = useState<ReadonlyArray<string>>([]);

  useEffect(() => {
    setHints(myCiphers.map(() => ''))
  }, [myCiphers])

  useEffect(() => {
    setSuggestions([...new Array(game.messageSize)].map(() => undefined))
  }, [game.messageSize, game.cryptographer])

  const submitHints = async () => from<Game>('games')
    .execute(gameId, g => ({
      ...g,
      // hints: game.currentCode.map(i => hints[i].trim())
    }));

  const suggest = () => from<Screen>("games", gameId, 'screens')
    .execute(game.players[userId], s => ({
      ...s,
      players: {
        ...s.players,
        [userId]: {
          ...s.players[userId],
          suggestions: suggestions as ReadonlyArray<number>
        }
      }
    }))


  return (
    <>
      <Header className={cx({
        [styles['opponents-turn']]: !teamInTurn
      })}>
        Game blah b
      </Header>
      <main>
        <Group>
          { ciphers.map((c, i) => (
            <Fragment key={i}>
              <Cipher
                onClick={() => setSelectedCipher(i)}
                selected={selectedCipher === i}
              >{c}</Cipher>
              {myTurn && game.phase === 'encrypting' &&
                <input
                  disabled={game.message.includes(i)}
                  value={hints[i] ?? ''}
                  onChange={e => setHints(p => p.map((h, idx) => idx === i ? e.currentTarget.value : h))}
                  placeholder='Hint'
                />}
            </Fragment>
          ))}
        </Group>

        <hr/>

        <Group>
          {game.phase === 'decrypting' && game.cipher.map((h, i) => (
            <Hint
              key={i}
              onClick={() => setSelectedHint(i)}
              selected={selectedHint === i}
              mySuggestion={ciphers[suggestions[i] ?? -1]}
            >
              {h}
            </Hint>
          ))}
        </Group>
      </main>
      <footer>
        { myTurn && <Button onClick={hints.every((h, i) => !game.message.includes(i) || h) 
          ? submitHints
          : undefined
        }>Submit</Button> }
        { myTurn && <Button onClick={suggestions.every(x => x !== undefined) ? suggest : undefined}>
            Suggest
          </Button>}
      </footer>
    </>
  )
}