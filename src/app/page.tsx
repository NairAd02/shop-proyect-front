"use client";

import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { useRouter } from "next/navigation";

export default function PrincipalPage() {
  // se obtiene el enrrutador de navegación
  const router = useRouter()
  const words = [
    {
      text: "Welcome",
    },
    {
      text: "to the Shop",
    },
    {
      text: "App",
    },
    {
      text: "For",
    },
    {
      text: "Most World.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-[40rem]  ">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
        The road to freedom starts from here
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <button onClick={() => {
          router.push('/login') // se redirige a la página de logeo
        }} className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
          Sing In
        </button>
        <button onClick={() => {
          router.push('/register') // se redirige a la página de registro
        }} className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
          Sign Up
        </button>
      </div>
    </div>
  );
}
