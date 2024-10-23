import { nanoid } from "nanoid"
import { FC, useMemo } from "react"
import styles from './TextInput.module.css'

export const TextInput: FC<{
  id?: string
  value: string
  placeholder: string

  label?: string


  onChange: (value?: string) => void
  onSave: () => Promise<void>
}> = ({
  value,
  onChange,
  onSave,
  placeholder,
  label,
  id: idFromProps
}) => {
  const id = useMemo(() => idFromProps ?? ('TextInput-' + nanoid(8)), [idFromProps])

  return (
    <div className={styles['text-input']}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.currentTarget.value ?? '')}
        onBlur={() => onSave().then(() => onChange())}
      />
    </div>
  );
}