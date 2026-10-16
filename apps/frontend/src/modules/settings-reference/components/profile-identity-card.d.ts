import type { ReactElement } from 'react'
export declare function ProfileIdentityCard(props: {
  name: string; username: string; avatarUrl: string | null; role: string; memberSince: string
  stats: {id: string; label: string; value: string}[]; completeness: number; pending?: boolean
  onChangePhoto: () => void; onRemovePhoto: () => void
}): ReactElement
