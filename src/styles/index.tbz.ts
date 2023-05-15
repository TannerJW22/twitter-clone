import { tailbreeze } from "tailbreeze";

export const primaryButtonStyle = tailbreeze({
  bg: "bg-gradient-to-br from-black to-[#191919]",
  hover_bg: "hover:bg-gradient-to-tr hover:from-black hover:to-[#191919]",
  active_bg: "active:scale-[0.96]",
  border:
    "border border-slate-100 border-opacity-30 rounded-full hover:border-opacity-80",
  spacing: "px-5 py-1.5",
  text: "text-slate-200 font-semibold hover:text-white",
});

export const secondaryButtonStyle = tailbreeze({
  size: "w-[120px]",
  bg: "bg-black",
  hover: "hover:border-opacity-80 hover:text-white",
  active_bg: "active:scale-[0.96]",
  border: "rounded-full border border-slate-100 border-opacity-50",
  spacing: "px-5 py-1.5",
  text: "text-slate-200 font-base",
});
