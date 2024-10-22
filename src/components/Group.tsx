import { Children, FC, PropsWithChildren } from "react";
import styles from './Group.module.css'

export const Group: FC<PropsWithChildren> = ({ children }) => {

  return (
    <div className={styles.group}>
      {Children.map(children, child => <div>{child}</div>)}
    </div>
  )
}