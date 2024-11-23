"use server";
import { createClient } from "./supabase/server";

export const saveAnswers = async (answers: string[]) => {
  const supabase = createClient();

  const { data, error: userError } = await (await supabase).auth.getUser();

  if (!data.user || userError)
    throw new Error(userError ? userError.message : "There was an error");

  const { data: userPreferencesData, error: userPreferencesError } = await (await supabase)
    .from("UserPreferences")
    .select("*")
    .eq("user_id", data.user.id);

    
  if (userPreferencesError)
    throw new Error(userPreferencesError.message);

  if (userPreferencesData && userPreferencesData?.length > 0)
    throw new Error("User has already preferences");

  const { error } = await (await supabase).from("UserPreferences").insert({
    user_id: data.user.id,
    assistant_name: answers[0],
    organization: answers[1],
    field_of_research: answers[2],
    project: answers[3],
    goals: answers[4],
    frequent_sites: answers[5],
  });
  if (error) throw new Error(error.message);
};
