import React, { useState, MouseEvent } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const d = Math.max(button.clientWidth, button.clientHeight);

    const x = event.clientX - rect.left - d / 2;
    const y = event.clientY - rect.top - d / 2;

    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    if (onClick) onClick(event);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  const baseStyles = "ripple-container relative overflow-hidden font-bold uppercase tracking-wider transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-gradient-to-r from-yellow-600 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-400 shadow-lg px-8 py-3 rounded-sm",
    secondary: "bg-dark border border-wood-600 text-wood-100 hover:bg-wood-900/50 px-6 py-2 rounded-sm",
    outline: "border border-white/20 hover:border-gold-400 text-white hover:text-gold-400 px-6 py-2 rounded-sm backdrop-blur-sm",
    ghost: "text-wood-300 hover:text-white px-4 py-2"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={createRipple}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '200%',
            height: '200%', // Ensure it covers the button
          }}
        />
      ))}
    </button>
  );
};
