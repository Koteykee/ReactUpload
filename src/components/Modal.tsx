import type { ReactNode } from "react";

interface ModalProps {
  modelValue: boolean;
  children: (props: { close: () => void }) => ReactNode;
  onClose: () => void;
}

export const Modal = ({ modelValue, children, onClose }: ModalProps) => {
  if (!modelValue) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-[#D4E6BA] max-w-[80%] max-h-[90%] min-w-[40%] min-h-[50%] p-5 rounded-[10px] flex flex-col justify-center items-center">
        {children({ close: onClose })}
      </div>
    </>
  );
};
