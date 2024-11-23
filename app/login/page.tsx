"use client";
import { useActionState, useEffect, useState } from "react";
import { login } from "./actions";
import { useFormStatus } from "react-dom";
import ButtonSpinner from "@/components/buttonSpinner";
import { IoSearch } from "react-icons/io5";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Spinner from "@/components/spinner";

function Button() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="w-[50%] h-10 bg-violet-600 text-neutral-100 rounded-full cursor-pointer"
    >
      {pending && <ButtonSpinner />}
      {!pending && "Login"}
    </button>
  );
}

export default function Login() {
  const supabase = createClient();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [state, formAction] = useActionState(login, {
    error: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session && session.user) {
        router.push("/");
      }
    };

    checkUser().then(() => setIsLoading(false));
  }, [supabase, router]);

  useEffect(() => {
    if (state.error) {
      setEmail("");
      setPassword("");
    }
  }, [state]);

  if (isLoading) return <Spinner />;

  return (
    <>
      <div className="absolute top-0 left-0 w-full h-20 flex items-center px-10">
        <div className="flex gap-x-3 items-center">
          <h1 className="text-neutral-100 text-xl font-bold">MyWatson</h1>
          <div className="text-violet-600 text-xl">
            <IoSearch />
          </div>
        </div>
      </div>
      <div className="w-full min-h-screen bg-[#121212] flex justify-center items-center py-10">
        <form
          action={formAction}
          className="w-[350px] h-[450px] bg-[#1a1a1a] rounded-xl flex items-center flex-col md:rounded-r-none"
        >
          <div className="h-10" />
          <p className="text-neutral-100 font-semibold">Welcome back</p>
          <div className="w-full h-1/2 flex flex-col justify-center items-center gap-y-5 mb-2">
            <input
              name="email"
              value={email}
              autoComplete="username"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              className="w-[80%] h-fit bg-transparent border-l-4 border-violet-600 text-sm py-2 px-3 text-neutral-200 outline-none placeholder:text-neutral-400 font-semibold"
            />
            <input
              name="password"
              value={password}
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              type="password"
              className="w-[80%] h-fit bg-transparent border-l-4 border-violet-600 text-sm py-2 px-3 text-neutral-200 outline-none placeholder:text-neutral-400 font-semibold"
            />
          </div>
          <Button />
          {state.error && (
            <p className="mt-5 text-red-400 pl-2 text-xs">{state.error}</p>
          )}
        </form>
        <div className="w-[200px] h-[450px] md:flex hidden bg-violet-600 rounded-r-xl flex-col"></div>
      </div>
    </>
  );
}
