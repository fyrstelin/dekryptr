import { initializeApp } from 'firebase/app'
import { collection, doc, getFirestore, onSnapshot, query, runTransaction, setDoc, where, WhereFilterOp } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { useEffect, useMemo, useState } from 'react';
import { map, Observable } from 'rxjs';
import languages from '../languages';
import { User } from '../@types/store';
import { customAlphabet, urlAlphabet } from 'nanoid';

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
  where: (key: string, operator: WhereFilterOp, value: any) => {
    return {
      stream: () => new Observable<ReadonlyArray<{ data: T, id: string }>>(s => {
        const q = query(collection(store, path, ...segments), where(key, operator, value))
        return onSnapshot(q, snapshot => {
          const ts = [] as { data: T, id: string }[]
          snapshot.forEach(d => ts.push({
            id: d.id,
            data: d.data() as any
          }));
          s.next(ts)
        }, err => s.error(err), () => s.complete());
      })
    }
  },
  insert: async (data: T) => {
    const i = id();
    await setDoc(doc(store, path, ...segments, i), data)
    return i
  },
  execute: (id: string, command: (data: T) => T | void) => runTransaction(store, async tx => {
    const ref = doc(store, path, ...segments, id);
    const snapshot = await tx.get(ref)
    if (!snapshot.exists()) throw new Error('Data not found');
    const data = snapshot.data()
    tx.update(ref, command(data as any) ?? data)
  }),
  patch: (id: string, data: Partial<T>) => setDoc(doc(store, path, ...segments, id), data, { merge: true }),
  stream: (id: string, defaultTo?: T) => new Observable<T>(s => {
    return onSnapshot(doc(store, path, ...segments, id), snapshot => {
      const data = snapshot.data() ?? defaultTo;
      if (data) {
        s.next(data as T)
      }
    }, err => s.error(err), () => s.complete());
  }),
  streamAll: () => new Observable<ReadonlyArray<T>>(s => {
    const q = query(collection(store, path, ...segments))
    return onSnapshot(q, snapshot => {
      const ts = [] as T[]
      snapshot.forEach(d => ts.push(d.data() as any));
      s.next(ts)
    }, err => s.error(err), () => s.complete());
  })
});


export const useUser = () => {
  const [userId, setUserId] = useState<string | null>();

  const user = useStream(useMemo(() => userId ? from<User>('users')
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
    const subscription = stream.subscribe(value => setData(value))

    return () => subscription.unsubscribe();
    
  }, [stream])

  return data;
}

export const useLanguage = () => languages[useUser()?.language ?? defaultLanguage];

export const id = customAlphabet(urlAlphabet, 8);
