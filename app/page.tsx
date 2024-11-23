import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { TalkAnimation } from "./talkAnimation";
import { Messages } from "./messages";
import { Spacing } from "@/components/spacing";
import { IoSearch } from "react-icons/io5";

export default async function Home() {
  const supabase = createClient();
  const { data, error } = await (await supabase).auth.getUser();
  if (!data.user || error) return redirect("/login");

  const { data: userPreferencesData, error: userPreferencesError } = await (
    await supabase
  )
    .from("UserPreferences")
    .select("*")
    .eq("user_id", data.user.id);

  if (userPreferencesError) throw new Error(userPreferencesError.message);

  if (!userPreferencesData.length) return redirect("/onboarding");

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
      <div className="size-full bg-[#121212] flex flex-col justify-center items-center">
        <TalkAnimation />
        <Spacing height={50} />
        <Messages />
      </div>
    </>
  );
}
