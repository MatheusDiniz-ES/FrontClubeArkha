import clsx from 'clsx';
import { ClassNameValue } from 'tailwind-merge/dist/lib/tw-join';

export interface SubtitleProps {
  children: React.ReactNode
  bold?: 'light' | 'normal' | 'semibold' | 'bold' | '800' | '900'
  size?: 'xs' | 'sm' | 'md' | 'lg' ,
  className?: ClassNameValue
}

export function Subtitle({ 
  size = 'sm',
  bold = 'semibold',
  className = '',
  ...props }: SubtitleProps
  ) {

  return (
    <>
      <p 
        className={clsx(
          `text-gray-400 ${className}`, {
            "text-xs": size == 'xs',
            "text-sm": size == 'sm',
            "text-base": size == 'md',
            "text-lg": size == 'lg',
            "font-light": bold == 'light',
            "font-normal": bold == 'normal',
            "font-semibold": bold == 'semibold',
            "font-bold": bold == 'bold',
            "font-extrabold": bold == '800',
            "font-black": bold == '900'
          }
        )}
      >
        {props.children}
      </p>
    </>
  );
}