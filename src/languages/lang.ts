export type Language = {
  id: string
  title: string
  landingPage: {
    newGame: string
    welcome: string
  }
}

export const Language = (lang: Language) => lang;