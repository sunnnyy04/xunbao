import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  background?: string;
  fontSize?: string;
  color?: string;
  borderRadius?: string;
  boxShadowColor?: string;
  className?: string;
}

const XButton: React.FC<ButtonProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`
        bg-black
        text-2xl
        text-white
        shadow-[5px_7px_0_white]
        inline-block
        transition-all
        duration-200
        relative
        top-0
        px-6
        py-5
        cursor-pointer
        mx-5
        border
        border-white
        active:top-[3px]
        active:shadow-[1px_2px_0_white]
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default XButton;
