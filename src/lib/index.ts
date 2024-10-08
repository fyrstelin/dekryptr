import { initializeApp } from 'firebase/app'
import { doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { useEffect, useMemo, useState } from 'react';
import { map, Observable } from 'rxjs';
import languages from '../languages';

const supportedLanguages = Object.keys(languages)

const defaultLanguage = [...navigator.languages]
  .map(l => l.split('-', 1)[0].trim())
  .find(l => supportedLanguages.includes(l)) ?? supportedLanguages[0]


const app = initializeApp({
    apiKey: "AIzaSyBydY-r1umo4m1bY4cuZl6NJTwXdGDvs2E",
    authDomain: "dekryptr.firebaseapp.com",
    projectId: "dekryptr",
    storageBucket: "dekryptr.appspot.com",
    messagingSenderId: "730386670463",
    appId: "1:730386670463:web:629bde604fe66df942f04a"
  });

const auth = getAuth(app);
const store = getFirestore(app);


export const from = <T extends {}>(path: string, ...segments: ReadonlyArray<string>) => ({
  patch: (id: string, data: Partial<T>) => setDoc(doc(store, path, ...segments, id), data, { merge: true }),
  stream: (id: string, defaultTo?: T) => new Observable<T>(s => {
    return onSnapshot(doc(store, path, ...segments, id), snapshot => {
      const data = snapshot.data() ?? defaultTo;
      if (data) {
        s.next(data as T)
      }
    }, err => s.error(err), () => s.complete());
  })
});


export const useUser = () => {
  const [userId, setUserId] = useState<string | null>();

  const user = useStream(useMemo(() => userId ? from<{
    name?: string
    language?: string
  }>('users')
    .stream(userId, {})
    .pipe(
      map(({ name, language }) => ({
        id: userId,
        name: name ?? '',
        language: language ?? defaultLanguage
      }))
    ) : undefined, [userId]))

  useEffect(() => auth.onAuthStateChanged(async () => {
    setUserId(auth.currentUser?.uid ?? null);
  }))

  useEffect(() => {
    if (userId === null) {
      const h = setTimeout(() => {
        signInAnonymously(auth)
      }, 300)
      return () => clearTimeout(h);
    }
  }, [userId])

  return user
}

export const useStream = <T>(stream?: Observable<T>) => {
  const [data, setData] = useState<T>()

  useEffect(() => {
    setData(undefined)
    if (!stream) return
    const subscription = stream.subscribe(value => {
      console.log('stream', value)
      return setData(value);
    })

    return () => {
      console.log('unsubscribe')
      return subscription.unsubscribe();
    };
    
  }, [stream])

  return data;
}

export const useLanguage = () => languages[useUser()?.language ?? defaultLanguage];