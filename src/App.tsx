import { useState } from 'react';
import { useUser, from, useLanguage } from './lib'
import { AppShell, Button, Group, NativeSelect, Stack, TextInput } from '@mantine/core';
import { IconFlag } from '@tabler/icons-react'
import languages from './languages';

export function App() {
  const user = useUser();
  const { landingPage } = useLanguage();

  const [name, setName] = useState<string>()

  if (!user) {
    return <AppShell.Main>Loading</AppShell.Main>
  }

  return (
    <>
      <AppShell.Main>
        <Stack>
          <h1>{landingPage.welcome}</h1>
          
          <TextInput
            label={landingPage.name.label}
            placeholder={landingPage.name.placeholder}
            value={name ?? user.name}
            onChange={e => setName(e.currentTarget.value)}
            onBlur={() => {
              from<{
                name: string
              }>('users').patch(user.id, {
                name: name ?? ''
              }).then(() => setName(undefined))
            }}
          />
          
          <Button fullWidth>{landingPage.newGame}</Button>
        </Stack>
      </AppShell.Main>

      <AppShell.Footer>
        <Group justify='flex-end'>
          <NativeSelect
            value={user.language}
            leftSection={<IconFlag/>}
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
          </NativeSelect>
        </Group>
      </AppShell.Footer>
    </>
  )
}
