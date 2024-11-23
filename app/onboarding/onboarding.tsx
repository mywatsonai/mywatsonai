"use client";
import { Spacing } from "@/components/spacing";
import { useAssistant } from "@/context/assistantContext";

export default function OnboardingMessage() {
  const {
    currentMessage,
    isOnboarding,
    isSpeaking,
    isLoadingAnswer,
    isRecording,
    hasAnswered,
    onboarded,
    handleNextMessage,
    startOnboarding,
    handleStartRecording,
    handleStopRecording,
    isLoading,
  } = useAssistant();

  const showButton = isOnboarding && !isSpeaking;
  const requiresAnswer = currentMessage?.requireAnswer;

  const buttonText = isLoadingAnswer
    ? "Loading"
    : !isRecording
    ? requiresAnswer && !hasAnswered
      ? "Answer"
      : onboarded
      ? "Continue"
      : "Start"
    : "Stop";

  const buttonAction = () => {
    if (isLoadingAnswer || isLoading) return;
    if (requiresAnswer && !hasAnswered) {
      if (isRecording) {
        handleStopRecording();
      } else {
        handleStartRecording();
      }
    } else {
      if (onboarded) {
        handleNextMessage();
      } else {
        startOnboarding();
      }
    }
  };

  return (
    <div className="w-[300px] h-fit min-h-20 text-center flex flex-col justify-center items-center">
      <p className="text-neutral-100 text-xs">
        {currentMessage?.message || ""}
      </p>
      <Spacing height={30} />
      {showButton && (
        <div
          className="w-32 h-10 rounded-full bg-violet-600 flex justify-center items-center text-neutral-100 cursor-pointer hover:opacity-70"
          onClick={buttonAction}
        >
          {isLoading ? "Loading" : buttonText}
        </div>
      )}
    </div>
  );
}
