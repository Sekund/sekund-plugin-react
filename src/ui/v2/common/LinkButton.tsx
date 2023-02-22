import React from "react";

type Props = {
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
};

export default function LinkButton({ onClick, children, icon, className }: Props) {
  return (
    <a className={`${className} flex items-center text-xs hover:underline`} onClick={onClick}>
      {icon} <span style={{ marginLeft: "2px" }}>{children}</span>
    </a>
  );
}
