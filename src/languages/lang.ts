export type Language = Readonly<{
  id: string
  title: string
  landingPage: Readonly<{
    myGames: string
    name: Readonly<{
      label: string
      placeholder: string
    }>
    newGame: string
    welcome: string
  }>,
  nouns: ReadonlyArray<string>
}>

export const Language = (lang: Language) => lang;