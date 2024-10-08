import { Anchor } from '@mantine/core'
import type { AnchorProps, PolymorphicComponentProps } from '@mantine/core'
import { useNavigate } from 'react-router'

export default (props: PolymorphicComponentProps<'a', AnchorProps>) => {
  const navigate = useNavigate()

  return <Anchor
    {...props}
    onClick={e => {
      if (props.href) {
        e.preventDefault()
        navigate(props.href)
      }
      props.onClick && props.onClick(e)
    }}
  />
}