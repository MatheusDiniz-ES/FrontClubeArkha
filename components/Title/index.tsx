import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';

export interface TitleProps {
  children: React.ReactNode
  asChild?: boolean;
  bold?: 'light' | 'normal' | 'semibold' | 'bold' | '800' | '900'
  size?: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl',
  className?: string
}

export function Title({ 
  asChild = false,
  size = 'md',
  bold = 'bold',
  className = '',
  ...props }: TitleProps
  ) {
  const Comp = asChild ? Slot : 'h3';
  
  return (
    <>
      <Comp 
        className={clsx(
          `text-gray-700 dark:text-gray-300 ${className}`, {
            "text-sm md:text-base": size == 'xs',
            "text-base md:text-lg": size == 'sm',
            "text-lg md:text-xl": size == 'md',
            "text-xl md:text-2xl": size == 'lg',
            "text-2xl md:text-3xl": size == 'xl',
            "text-3xl md:text-4xl": size == '2xl',
            "font-light": bold == 'light',
            "font-normal": bold == 'normal',
            "font-semibold": bold == 'semibold',
            "font-bold": bold == 'bold',
            "font-extrabold": bold == '800',
            "font-black": bold == '900'
          }
        )}
        {...props} 
      />
    </>
  );
}