import { nanoid } from "nanoid";
import { FC, useMemo, useState } from "react";
import styles from './style.module.css'
import { useDebouncedCallback } from 'use-debounce'

export const Range: FC<{
  id?: string
  value: number
  range: [number, number]

  label: string

  onChange: (value?: number) => void
  onSave?: (value: number) => Promise<void>
}> = ({
  id: idFromProps,
  label,
  value,
  onChange,
  onSave,
  range: [from, to]
}) => {
  const id = useMemo(() => idFromProps ?? ('Range-' + nanoid(8)), [idFromProps])

  const [saving, setSaving] = useState(false)

  const save = useDebouncedCallback((value: number) => {
    if (onSave) {
      setSaving(true)
      onSave(value)
        .then(() =>onChange())
        .catch(err => {
          console.log('ERROR', err)
        })
        .finally(() => setSaving(false))
    }
  }, 300)

  return (
    <div className={styles['input']}>
      <label htmlFor={id}>{label}: {value}</label>
      <input
        id={id}
        type='range'
        min={from}
        max={to}
        value={value}
        disabled={saving}
        onChange={e => {
          const newValue = parseInt(e.currentTarget.value)
          onChange(newValue)
          save(newValue)
        }}
      />
    </div>
  );
}