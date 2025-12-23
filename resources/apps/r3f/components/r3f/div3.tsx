import { cn } from '@/lib/utils'
import { View, type ViewProps } from '@/providers/r3f'

const Component = ({ children, className, ...props }: ViewProps) => (
  <div
    className={cn(
      'relative w-full h-full rounded-lg bg-cyan-300 aspect-square sm:aspect-auto',
      className,
    )}
  >
    <View {...props}>{children}</View>
  </div>
)

export default Component
