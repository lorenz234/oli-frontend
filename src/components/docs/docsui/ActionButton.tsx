import React from 'react';

interface ActionButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  external?: boolean;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  href,
  onClick,
  children,
  variant = 'glass',
  size = 'md',
  icon,
  external = false,
  className = ""
}) => {
  const baseClasses = "inline-flex items-center rounded-lg transition-colors";
  
  const variantClasses = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
    glass: "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const content = (
    <>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </>
  );

  if (href) {
    return (
      <a 
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={classes}
    >
      {content}
    </button>
  );
};

export default ActionButton;
