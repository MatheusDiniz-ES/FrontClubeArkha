import clsx from "clsx";

interface ButtonToggleProps {
  className?: string;
  value: boolean;
  color: string;
  onToggle: () => void;
}



export const ButtonToggle = ({ className, value, color, onToggle }: ButtonToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className={clsx(
        "min-w-[64px] h-9 rounded-full bg-gray-0 flex items-center px-1 transition mt-5 dark:bg-slate-300 bg-gray-500",
        className
      )}
    >
      <div
        className={clsx(
          "w-7 h-7 rounded-full transition-all duration-300 transform dark:bg-slate-300 bg-gray-500",
          value ? "translate-x-7" : "translate-x-0"
        )}
        style={{ backgroundColor: value ? color : "#fff" }}
      />
    </button>
  );
};

export default ButtonToggle;