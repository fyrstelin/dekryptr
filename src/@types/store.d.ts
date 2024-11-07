export type User = {
  name?: string
  language?: string
}

export type Game = {
  players: Record<string, string>
  keySize: number
  messageSize: number
  history: Record<string, ReadonlyArray<Readonly<{
    cryptographer: string
    messages: ReadonlyArray<string>
  }>>>
} & ({
  phase: 'setup'
} | (
  {
    cryptographer: string
    message: ReadonlyArray<number> // TODO: should be visible only to cryptographer
  } &
  ({
    phase: 'encrypting'
  } | {
    phase: 'decrypting'
    cipher: ReadonlyArray<string>
  } | {
    phase: 'cool-down'
  }) 
) | {
  phase: 'game-over'
})

export type Screen = {
  players: Record<string, {
    suggestions: ReadonlyArray<number>
  }>
  ciphers: ReadonlyArray<string>
}