"use client";
import { useAssistant } from "@/context/assistantContext";

export const TalkAnimation = () => {
  const { isSpeaking } = useAssistant();

  return (
    <div className="w-56 h-20 flex justify-between items-center">
      <span
        style={{
          animationDelay: isSpeaking ? "0s" : "0s",
        }}
        className={`w-3 h-full rounded-md bg-neutral-100 ${
          isSpeaking ? "animate-wave" : "animate-stop"
        }`}
      ></span>
      <span
        style={{
          animationDelay: isSpeaking ? "0.2s" : "0s",
        }}
        className={`w-3 h-full rounded-md bg-neutral-100 ${
          isSpeaking ? "animate-wave" : "animate-stop"
        }`}
      ></span>
      <span
        style={{
          animationDelay: isSpeaking ? "0.6s" : "0s",
        }}
        className={`w-3 h-full rounded-md bg-neutral-100 ${
          isSpeaking ? "animate-wave" : "animate-stop"
        }`}
      ></span>
      <span
        style={{
          animationDelay: isSpeaking ? "0.7s" : "0s",
        }}
        className={`w-3 h-full rounded-md bg-neutral-100 ${
          isSpeaking ? "animate-wave" : "animate-stop"
        }`}
      ></span>
      <span
        style={{
          animationDelay: isSpeaking ? "0.5s" : "0s",
        }}
        className={`w-3 h-full rounded-md bg-neutral-100 ${
          isSpeaking ? "animate-wave" : "animate-stop"
        }`}
      ></span>
      <span
        style={{
          animationDelay: isSpeaking ? "0.3s" : "0s",
        }}
        className={`w-3 h-full rounded-md bg-neutral-100 ${
          isSpeaking ? "animate-wave" : "animate-stop"
        }`}
      ></span>
      <span
        style={{
          animationDelay: isSpeaking ? "0.1s" : "0s",
        }}
        className={`w-3 h-full rounded-md bg-neutral-100 ${
          isSpeaking ? "animate-wave" : "animate-stop"
        }`}
      ></span>
    </div>
  );
};
