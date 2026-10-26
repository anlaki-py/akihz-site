import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type MaterialWebElementProps =
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
    disabled?: boolean
    indeterminate?: boolean
    label?: string
    type?: string
  }

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'md-filled-button': MaterialWebElementProps
      'md-text-button': MaterialWebElementProps
      'md-elevated-card': MaterialWebElementProps
      'md-list': MaterialWebElementProps
      'md-list-item': MaterialWebElementProps
      'md-circular-progress': MaterialWebElementProps
    }
  }
}
