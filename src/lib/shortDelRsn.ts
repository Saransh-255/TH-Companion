export default function shortDelRsn(reason) {
  const MATCHES = [
    {
      short: "External Link",
      keys: ["link to a website other than Brainly"]
    },
    {
      short: "SPAM",
      keys: ["content such as advertisements, meeting codes", "unhelpful"]
    },
    {
      short: "Miscellaneous",
      keys: ["violates Brainly's Terms of Use"]
    },
    {
      short: "Incorrect",
      keys: ["mistakes"]
    },
    {
      short: "Personal Information",
      keys: ["personal info", "social media"]
    },
    {
      short: "Harmful",
      keys: ["hate speech, profanity, sexual content, threats, and/or bullying"]
    },
    {
      short: "Cheating",
      keys: ["online calculators or translation software"]
    },
    {
      short: "Plagiarism",
      keys: ["presenting it as content written by you"]
    },
    {
      short: "IDK Answer",
      keys: ["you're not sure how to answer their question"]
    },
    {
      short: "Nonsense",
      keys: ["gibberish-like", "unclear or does not answer the question being asked."]
    },
    {
      short: "Off-topic",
      keys: ["non-educational, off-topic conversations", "not relevant to the question asked."]
    },
    {
      short: "Low Effort",
      keys: ["hard to comprehend", "missing some important steps.", "it was incomplete"]
    },
    {
      short: "Wrong Context",
      keys: ["in the wrong spot!"]
    },
    {
      short: "Wrong Language",
      keys: ["in a different language", "in a language other than English"]
    },
    {
      short: "Inappropriate",
      keys: ["zero-tolerance policy for inappropriate subjects"]
    },
    {
      short: "Question about question",
      keys: [`use the "Ask for Details" button`]
    },
    //question reasons
    {
      short: "Too Trivial",
      keys: ["a bit too simple"]
    },
    {
      short: "Wrong Subject",
      keys: ["wrong subject."]
    },
    {
      short: "Too General",
      keys: ["a bit too vague"]
    },
    {
      short: "NASP",
      keys: ["not part of an academic assignment."]
    },
    {
      short: "Exam",
      keys: ["academic dishonesty"]
    },
    {
      short: "Default",
      keys: ["Guidelines, so we had to take it down."]
    },
    {
      short: "Brainly-related",
      keys: ["how to use Brainly!"]
    },
    {
      short: "Incomplete",
      keys: ["missing some crucial information."]
    },
    {
      short: "Too Complex",
      keys: ["it was too complex."]
    },
    {
      short: "Unclear",
      keys: ["unclear or a bit confusing."]
    },
    //comment reasons
    {
      short: "Misleading",
      keys: ["confusing or incorrect information."]
    },
    {
      short: "Answer in Comments",
      keys: ["answer as a comment."]
    },
    {
      short: "Question in Comments",
      keys: ["question as a comment."]
    },
    {
      short: "MD",
      keys: ["Deleting all comments", "Deleting all reported comments"]
    },
  ];
  let val = "";
  MATCHES.forEach(match => {
    match.keys.forEach(key => {
      if (reason.includes(key)) val = match.short;
    });
  });

  return val;
}