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
      'md-outlined-button': MaterialWebElementProps
      'md-text-button': MaterialWebElementProps
      'md-assist-chip': MaterialWebElementProps
      'md-divider': MaterialWebElementProps
      'md-fab': MaterialWebElementProps
      'md-icon-button': MaterialWebElementProps
      'md-elevated-card': MaterialWebElementProps
      'md-filled-card': MaterialWebElementProps
      'md-list': MaterialWebElementProps
      'md-list-item': MaterialWebElementProps
      'md-circular-progress': MaterialWebElementProps
    }
  }
}
