interface IMessage {
  message: string;
  requireAnswer: boolean;
  answerPrompt?: string;
}

export const messages: IMessage[] = [
  {
    message: "Benvenuto, Io Sono Watson",
    requireAnswer: false,
  },
  {
    message: "Vuoi chiamarmi Watson o preferisci un altro nome?",
    requireAnswer: true,
    answerPrompt:
      "You are given the answer to this question: 'Vuoi chiamarmi Watson o preferisci un altro nome?', you need to extract the name the user want, if you can't find it, return 'Watson'.",
  },
  {
    message: "Come si chiama la tua organizzazione?",
    requireAnswer: true,
    answerPrompt:
      "You are given the answer to this question: 'Come si chiama la tua organizzazione?', you need to extract the organization name, if you can't, return 'Not specified'.",
  },
  {
    message: "Qual è il tuo campo di ricerca?",
    requireAnswer: true,
    answerPrompt:
      "You are given the answer to this question: 'Qual è il tuo campo di ricerca?', you need to extract the work field name, if you can't, return 'Not specified'.",
  },
  {
    message: "A cosa stai lavorando?",
    requireAnswer: true,
    answerPrompt:
      "You are given the answer to this question: 'A cosa stai lavorando?', you need to extract the job name, if you can't, return 'Not specified'.",
  },
  {
    message: "Quali sono i tuoi obiettivi?",
    requireAnswer: true,
    answerPrompt:
      "You are given the answer to this question: 'Quali sono i tuoi obiettivi?', you need to extract the objectives, if you can't, return 'Not specified'.",
  },
  {
    message:
      "Quali siti visiti più frequentemente per la letteratura scientifica?",
    requireAnswer: true,
    answerPrompt:
      "You are given the answer to this question: 'Quali siti visiti più frequentemente?', you need to extract the websites name (note that they may just be the website name not the path), if you can't, return 'Not specified'.",
  },
];
