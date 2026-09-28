/*
  Copy for /contact, the contact form, and the two emails behind it (S33,
  9/28/26). Edit words here only; the page, the component and /api/lead read
  this file. Voice: "I" (the glfanalytics.com register in POSITIONING.md):
  plain nouns, no commas in headings, no em or en dashes, no exclamation
  points, no credibility labels, no prices, no "doing this alone" tone.
  S34 (9/28/26, his live read): no reply promise anywhere ("as soon as I can"),
  no consent line, no "link is in your inbox" line, the confirmation email cut
  to his four lines.
*/

/** The service areas, his words (Airtable `intent` single select, 9/28/26). The value is written to the row as is. */
export const intents = [
  { value: "marketing", label: "Marketing" },
  { value: "database work", label: "Database work" },
  { value: "ai tooling", label: "AI tooling" },
  { value: "web development", label: "Web development" },
  { value: "other", label: "Other" }
] as const;
export type Intent = (typeof intents)[number]["value"];
export const DEFAULT_INTENT: Intent = "other";

export const meta = {
  slug: "contact",
  eyebrow: "Contact",
  title: "Start a conversation",
  description: "Tell Gabriel Freeman what you are working on. Every message gets a reply, or pick a time on the calendar.",
  lede: "Tell me what you are working on and what you want out of it. I read every message and get back as soon as I can. If a call is easier, the calendar link is below the form."
};

export const form = {
  about: "What is this about",
  name: "Name",
  email: "Email",
  company: "Company (optional)",
  message: "What you are working on and what you want to get out of it",
  send: "Send",
  sending: "Sending",
  sent: "Sent. I will get back to you as soon as I can.",
  bookLine: "If a call is easier, pick a time.",
  book: "Book a call",
  missing: "Add a name, an email, and a message.",
  badEmail: "Check the address.",
  rate: "Too many sends from this connection. Try again in a few minutes.",
  off: "The form is off right now. Email me instead and your message goes in the body.",
  failed: "It did not go through. Email me instead and your message goes in the body.",
  emailMe: "Email me"
};

export const direct = {
  heading: "Other ways to reach me",
  book: "Book a call",
  bookNote: "Thirty minutes on Google Meet.",
  email: "Email me",
  linkedin: "LinkedIn"
};

export const faq: { q: string; a: string }[] = [
  {
    q: "What happens after I send this",
    a: "You get a short confirmation by email with a link to my calendar. I read the message and get back to you as soon as I can, with questions or a time to talk."
  },
  {
    q: "What should I include",
    a: "The business, the problem, and what you have tried so far. A link to the site or the report you are working from helps. No brief needed."
  },
  {
    q: "How does the work usually run",
    a: "Exploration first: I map how the business runs today and where the friction is. Then a short ranked list, then the build, in weeks rather than quarters. You keep everything at the end: the code, the runbook, and the accounts."
  }
];

/** The two emails. Plain text only. The confirmation is his four lines (9/28); the notification carries everything. */
export const mail = {
  confirmSubject: "Got your message",
  confirm(i: { name: string; booking?: string; postal: string }): string {
    const lines = [`Hi ${i.name},`, "", "Thanks for writing. Your message has been received and I will get back to you as soon as I can.", ""];
    if (i.booking) lines.push(`If a call is easier, pick a time here: ${i.booking}`, "");
    lines.push("Gabriel Freeman", `GLF Analytics, ${i.postal}`);
    return lines.join("\n");
  },
  notifySubject: (intent: string, name: string) => `Site contact (${intent}): ${name}`,
  notify(i: { name: string; email: string; company: string; intent: string; message: string; page: string; source: string }): string {
    return [
      `Name: ${i.name}`,
      `Email: ${i.email}`,
      `Company: ${i.company || "none"}`,
      `About: ${i.intent}`,
      `Page: ${i.page || "none"}`,
      `Source: ${i.source || "none"}`,
      "",
      i.message
    ].join("\n");
  }
};
