import { IoSearch } from "react-icons/io5";
import { TalkAnimation } from "../talkAnimation";
import { Spacing } from "@/components/spacing";
import OnboardingMessage from "./onboarding";

export default function Onboarding() {
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
        <OnboardingMessage />
      </div>
    </>
  );
}