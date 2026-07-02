import type { MouseEvent, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type AuthTransitionLinkProps = {
  children: ReactNode
  className?: string
  direction: 'forward' | 'back'
  style?: React.CSSProperties
  to: string
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> }
}

export function AuthTransitionLink({
  children,
  className,
  direction,
  style,
  to,
}: AuthTransitionLinkProps) {
  const navigate = useNavigate()

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return

    const transitionDocument = document as ViewTransitionDocument
    if (!transitionDocument.startViewTransition) return

    event.preventDefault()
    document.documentElement.dataset.authTransition = direction
    const transition = transitionDocument.startViewTransition(() => navigate(to))
    transition.finished.finally(() => {
      delete document.documentElement.dataset.authTransition
    })
  }

  return (
    <Link to={to} onClick={handleClick} className={className} style={style}>
      {children}
    </Link>
  )
}
