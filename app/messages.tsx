"use client";

import { Spacing } from "@/components/spacing";
import { useAssistant } from "@/context/assistantContext";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IUserPreferences {
  assistant_name: string;
  created_at: string;
  field_of_research: string;
  frequent_sites: string;
  goals: string;
  id: number;
  organization: string;
  project: string;
  user_id: string | null;
}

export const Messages = () => {
  const supabase = createClient();

  const router = useRouter();

  const {
    isRecording,
    isOnboarding,
    setIsOnboarding,
    isLoadingAnswer,
    handleAsk,
    handleStopAsk,
    currentResponse,
  } = useAssistant();

  const [userPreferencesData, setUserPreferencesData] =
    useState<IUserPreferences | null>(null);

  useEffect(() => {
    const getUserPreferences = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!data.user || error) return router.push("/login");

      const { data: userPreferences, error: userPreferencesError } =
        await supabase
          .from("UserPreferences")
          .select("*")
          .eq("user_id", data.user.id);

      if (userPreferencesError) throw new Error(userPreferencesError.message);

      if (!userPreferences.length) return router.push("/onboarding");

      setIsOnboarding(false);
      setUserPreferencesData(userPreferences[0]);
    };

    getUserPreferences();
  }, []);

  const askButtonAction = () => {
    if (isLoadingAnswer || !userPreferencesData) return;
    if (isRecording) {
      handleStopAsk();
    } else {
      handleAsk(userPreferencesData);
    }
  };

  const askButtonText = isLoadingAnswer
    ? "Loading"
    : isRecording
    ? "Stop"
    : "Ask";

  return (
    <div className="w-[300px] h-fit min-h-20 text-center flex flex-col justify-center items-center">
      <p className="text-neutral-100 text-xs">{currentResponse}</p>
      <Spacing height={30} />
      {!isOnboarding && (
        <div
          className="w-32 h-10 rounded-full bg-violet-600 flex justify-center items-center text-neutral-100 cursor-pointer hover:opacity-70"
          onClick={askButtonAction}
        >
          {askButtonText}
        </div>
      )}
    </div>
  );
};
