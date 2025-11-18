import React, { type JSX } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
  textColor?: string;
  hoverBg?: string;
  hoverText?: string;
}

const Button = ({
  children,
  className = "",
  bgColor = "",
  textColor = "text-white",
  hoverBg = "hover:bg-accent",
  hoverText = "",
  ...props
}: ButtonProps): JSX.Element => {
  return (
    <button
      className={`font-semibold transition-colors duration-200 ease-in-out cursor-pointer ${bgColor} ${textColor} ${hoverBg} ${hoverText} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
