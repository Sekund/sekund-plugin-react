import React, { useEffect } from "react";

type Props = {
  open: boolean;
  setOpen: (o: boolean) => void;
  text: string;
};

export default function Tooltip({ text, open, setOpen }: Props) {
  useEffect(() => {}, []);

  useEffect(() => {
    const closeTooltip = () => {
      setOpen(false);
      window.removeEventListener("click", closeTooltip);
    };
    if (open) {
      window.addEventListener("click", closeTooltip);
    }
  }, [open]);

  if (open) {
    return (
      <div
        className="absolute right-0 px-4 py-3 text-sm text-yellow-100 transform -translate-x-1/2 bg-yellow-600 rounded w-form left-1/2"
        style={{ bottom: "calc(100% + 0.5rem)", width: "fit-content" }}
      >
        {text}
        <svg className="absolute left-0 w-full h-2 text-yellow-600 transform scale-125 top-full" x="0px" y="0px" viewBox="0 0 255 255">
          <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
        </svg>
      </div>
    );
  }
  return null;
}
