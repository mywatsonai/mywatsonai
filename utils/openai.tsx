"use server";
import OpenAI from "openai";

interface IUserPreferences {
  assistant_name: string;
  organization: string;
  field_of_research: string;
  project: string;
  frequent_sites: string;
  goals: string;
}

export const transcription = async (file: File) => {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const transcription = client.audio.transcriptions.create({
    model: "whisper-1",
    file: file,
    response_format: "text",
  });

  return transcription;
};

export const checkAnswer = async (text: string, answerPrompt: string) => {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const asnwer = client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: answerPrompt },
      { role: "user", content: text },
    ],
  });

  return (await asnwer).choices[0].message.content;
};

export const chat = async (
  input: string,
  userPreferencesData: IUserPreferences
) => {
  const {
    assistant_name,
    organization,
    field_of_research,
    project,
    goals,
    frequent_sites,
  } = userPreferencesData;

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are an AI assistant called ${assistant_name} for a user, a member of ${organization}. 
          he works in the field of ${field_of_research} and is currently working on the project '${project}'.
          his goals are: ${goals}.
          Please tailor your response based on the following context:
          - Their preferred sources of information include: ${frequent_sites}.`,
      },
      { role: "user", content: input },
    ],
  });

  return (await response).choices[0].message.content;
};
