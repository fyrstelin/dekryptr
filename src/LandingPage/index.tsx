import { useMemo, useState } from 'react';
import { useUser, from, useLanguage, useStream } from '../lib'
import languages from '../languages';
import type { Game, User } from '../@types/store';
import { useNavigate } from 'react-router';
import { Loading } from '../components/Loading';
import { NEVER } from 'rxjs';
import { Button, TextInput } from '../components';
import { Link } from 'react-router-dom';

export function LandingPage() {
  const navigateTo = useNavigate();
  
  const user = useUser();
  const { landingPage } = useLanguage();

  const games = useStream(useMemo(() => user?.id ? from<Game>('games')
    .where('players.' + user.id, '!=', null)
    .stream() : NEVER, [user?.id])) ?? []


  const [name, setName] = useState<string>()

  if (!user) {
    return <Loading/>
  }

  return (
    <>
      <main>

        <h1>{landingPage.welcome}</h1>
            
        <TextInput
          label={landingPage.name.label}
          placeholder={landingPage.name.placeholder}
          value={name ?? user.name}
          onChange={setName}
          onSave={() => from<User>('users')
            .patch(user.id, {
              name: name ?? ''
            })
          }
        />
          
        <Button
          onClick={() =>
            from<Game>("games")
              .insert({
                phase: 'setup',
                players: {}
              })
              .then(id => {
                navigateTo(['games', id].join('/'))
              })
          }
        >
          {landingPage.newGame}
        </Button>

        <h3>{landingPage.myGames}</h3>
        <div>
          {games.map(g =>
            <Link
              key={g.id}
              to={['games', g.id].join('/')}
            >
              {g.id}
            </Link>)
          }
        </div>
      </main>

      <footer>
        <select
          value={user.language}
          onChange={e => from<{ language: string }>('users').patch(user.id, {
            language: e.currentTarget.value
          })}
        >
          {Object.values(languages)
            .sort((a, b) => a.title.localeCompare(b.title))
            .map(l => (
              <option value={l.id} key={l.id}>{l.title}</option>
            ))
          }
        </select>
      </footer>
    </>
  )
}
