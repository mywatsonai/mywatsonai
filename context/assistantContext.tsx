import { createContext, useContext, useEffect, useRef, useState } from "react";
import { messages } from "@/utils/costants";
import { transcription, checkAnswer, chat } from "@/utils/openai";
import { saveAnswers } from "@/utils/utils";
import { useRouter } from "next/navigation";

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

interface IAssistantContext {
  isSpeaking: boolean;
  isRecording: boolean;
  isOnboarding: boolean;
  onboarded: boolean;
  startOnboarding: () => void;
  handleNextMessage: () => void;
  currentMessage: IMessage | null;
  handleStartRecording: () => void;
  handleStopRecording: () => void;
  isLoadingAnswer: boolean;
  hasAnswered: boolean;
  currentResponse: string;
  handleAsk: (userPreferencesData: IUserPreferences) => void;
  handleStopAsk: () => void;
  isLoading: boolean;
  setIsOnboarding: (value: boolean) => void;
}

interface ITTSOptions {
  language: string;
  rate: number;
  pitch: number;
  volume: number;
  voiceName?: string;
}

interface IMessage {
  message: string;
  requireAnswer: boolean;
  answerPrompt?: string;
}

const AssistantContextDefaultValue: IAssistantContext = {
  isSpeaking: false,
  isRecording: false,
  isOnboarding: true,
  onboarded: false,
  startOnboarding: () => {},
  handleNextMessage: () => {},
  currentMessage: null,
  handleStartRecording: () => {},
  handleStopRecording: () => {},
  isLoadingAnswer: false,
  hasAnswered: false,
  currentResponse: "",
  handleAsk: () => {},
  handleStopAsk: () => {},
  isLoading: false,
  setIsOnboarding: () => {},
};

const AssistantContext = createContext<IAssistantContext>(
  AssistantContextDefaultValue
);

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOnboarding, setIsOnboarding] = useState<boolean>(true);
  const [onboarded, setOnboarded] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<IMessage | null>(null);
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState<boolean>(false);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [answers, setAnswers] = useState<string[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const router = useRouter();

  const handleStartRecording = async () => {
    try {
      if (!currentMessage) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/mp3" });
        setIsLoadingAnswer(true);
        const textTranscription = await transcription(
          new File([audioBlob], "recording.mp3")
        );
        const answer = await checkAnswer(
          textTranscription,
          currentMessage.answerPrompt || ""
        );
        if (!answer) return;
        setAnswers((previous) => [...previous, answer]);
        setIsLoadingAnswer(false);
        console.log(textTranscription, answer);
        setHasAnswered(true);
        audioChunks.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone: ", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const speak = (text: string, options: ITTSOptions) => {
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    setIsSpeaking(true);
    utterance.lang = options.language || "en-US";
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    utterance.onend = () => {
      setIsSpeaking(false);
    };
    window.speechSynthesis.speak(utterance);
  };

  const startOnboarding = () => {
    setCurrentIndex(0);
    setOnboarded(true);
  };

  useEffect(() => {
    if (isOnboarding && currentIndex >= 0 && currentIndex < messages.length) {
      setCurrentMessage(messages[currentIndex]);
      speak(messages[currentIndex].message, {
        language: "it-IT",
        pitch: 1,
        rate: 1,
        volume: 1,
      });
    }
  }, [isOnboarding, currentIndex]);

  useEffect(() => {
    if (!isOnboarding) {
      speak(currentResponse, {
        language: "it-IT",
        pitch: 1,
        rate: 1,
        volume: 1,
      });
    }
  }, [currentResponse]);

  const handleNextMessage = () => {
    if (isOnboarding && currentIndex < messages.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setHasAnswered(false);
    } else {
      setIsLoading(true);
      setHasAnswered(false);
      setIsOnboarding(false);
      setCurrentMessage(null);
      saveAnswers(answers);
      setIsLoading(false);
      router.push("/");
    }
  };

  const handleAsk = async (userPreferencesData: IUserPreferences) => {
    if (!userPreferencesData) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/mp3" });
        setIsLoadingAnswer(true);
        const textTranscription = await transcription(
          new File([audioBlob], "recording.mp3")
        );
        if (!textTranscription) return;
        const response = await chat(textTranscription, userPreferencesData);
        if (!response) return;
        setCurrentResponse(response);
        setIsLoadingAnswer(false);
        audioChunks.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone: ", error);
    }
  };

  const handleStopAsk = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  return (
    <AssistantContext.Provider
      value={{
        isSpeaking,
        isRecording,
        isOnboarding,
        onboarded,
        startOnboarding,
        handleNextMessage,
        currentMessage,
        handleStartRecording,
        handleStopRecording,
        isLoadingAnswer,
        hasAnswered,
        currentResponse,
        handleAsk,
        handleStopAsk,
        isLoading,
        setIsOnboarding,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
}

export const useAssistant = () => useContext(AssistantContext);
