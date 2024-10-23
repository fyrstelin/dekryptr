export type User = {
  name?: string
  language?: string
}

export type Game = {
  players: {
    [id: string]: 'team-1' | 'team-2'
  }
} & ({
  phase: 'setup'
} | {
  phase: 'game-over'
})