"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

interface IFormState {
  error: string;
}

export async function login(prevState: IFormState, formData: FormData) {
  if (!formData.get("email") || !formData.get("password"))
    return { error: "Email and Password are required" };

  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await (await supabase).auth.signInWithPassword(data);

  if (error) return { error: error.message };

  revalidatePath("/login", "layout");
  return redirect("/");
}
