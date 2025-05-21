import * as React from 'react'
import { cva, VariantProps } from 'class-variance-authority'
import {
  Button as MUIButton,
  ButtonProps as MUIButtonProps,
} from '@mui/material'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      customSize: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-600',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      customSize: 'default',
      disabled: false,
    },
  }
)

export interface ButtonProps
  extends Omit<MUIButtonProps, 'color' | 'variant' | 'size'>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, customSize, disabled, ...props }, ref) => {
    return (
      <MUIButton
        ref={ref}
        className={cn(
          buttonVariants({ variant, customSize, disabled, className })
        )}
        variant={
          variant === 'default'
            ? 'contained'
            : variant === 'outline'
            ? 'outlined'
            : 'text'
        }
        color="primary"
        disabled={disabled}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
