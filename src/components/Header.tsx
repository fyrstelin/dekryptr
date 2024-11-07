import { FC, PropsWithChildren } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from './Header.module.css'
import { usePreviousPage } from "./PreviousPage";
import cx from 'classnames'

export const Header: FC<PropsWithChildren<{
  className?: string
  parent?: string
}>> = ({
  parent,
  className, 
  children
}) => {
  const previousPage = usePreviousPage()
  const navigate = useNavigate()

  return (
    <header className={cx(styles.header, className)}>
      <div>
        {parent && <Link
          to={parent}
          className={styles.back}
          onClick={e => {
            if (previousPage == parent) {
              e.preventDefault()
              navigate(-1)
            }
          }}
        >🡐</Link>}
      </div>
      <div>
        {children}
      </div>
      <div>
      </div>
    </header>
  )
}