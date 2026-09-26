"use client";
import { ButtonHTMLAttributes } from "react";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes < HTMLButtonElement > & { variant ? : "primary" | "ghost" }) {
  const base = "w-full rounded-2xl px-5 py-4 text-base font-semibold transition disabled:opacity-40";
  const styles =
    variant === "primary" ?
    "bg-emerald-500 text-black hover:bg-emerald-400" :
    "bg-white/5 text-white hover:bg-white/10";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}