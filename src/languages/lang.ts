export type Language = {
  id: string
  title: string
  landingPage: {
    name: {
      label: string
      placeholder: string
    }
    newGame: string
    welcome: string
  }
}

export const Language = (lang: Language) => lang;