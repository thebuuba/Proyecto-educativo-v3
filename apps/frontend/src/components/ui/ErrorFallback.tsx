import { AlertTriangle, RefreshCw } from 'lucide-react'
import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'

import { Button } from '@/components/ui/Button'

type Props = {
  children: ReactNode
}

type State = {
  didCatch: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { didCatch: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { didCatch: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.didCatch) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-8 text-destructive" />
            </div>
            <h1 className="mt-6 text-xl font-bold text-foreground">
              Algo salió mal
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ocurrió un error inesperado al cargar la página.
            </p>
            {import.meta.env.DEV && this.state.error ? (
              <pre className="mt-4 max-h-32 overflow-auto rounded-lg bg-muted p-4 text-left text-xs text-muted-foreground">
                {this.state.error.message}
              </pre>
            ) : null}
            <Button
              variant="primary"
              className="mt-6"
              onClick={() => this.setState({ didCatch: false, error: null })}
            >
              <RefreshCw className="size-4" />
              Reintentar
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
