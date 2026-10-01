export const siteName = "GLF Analytics";
export const siteUrl = "https://glfanalytics.com";
// S36 (9/30/26): the hero line and the hero paragraph, cut to fit a search
// result (title 60 characters, description 160, no comma in a title).
export const defaultTitle = "GLF Analytics | The data and the tech behind growing brands";
export const defaultDescription =
  "Gabriel Freeman helps brands grow by turning messy data into strategic recommendations. Reporting since 2017, plus marketing, websites and AI workflows.";

export const socialLinks = {
  linkedin: "https://www.linkedin.com/in/gabriel-freeman-47b80389/",
  substack: "https://glfanalytics.substack.com"
};

// S37 (10/1/26): the other places that are this same practice, for the
// Organization's sameAs in JsonLd.astro (the Person keeps LinkedIn and the
// newsletter). birthday-cards.ai is a product, not the same entity, so it is
// tied in on its case study instead (an `about` node with the Person as creator).
export const orgSameAs = [socialLinks.linkedin, socialLinks.substack, "https://glf-ai.com", "https://github.com/GLF-Analytics"];
export const personSameAs = [socialLinks.linkedin, socialLinks.substack, "https://medium.com/@gabe_freeman21"];

// S37 (10/1/26): his own properties. A link to one of these opens with rel
// "noopener" so that site's analytics sees glfanalytics.com as the referrer;
// every other outside link keeps "noreferrer".
const OWN_HOSTS = ["birthday-cards.ai", "glf-ai.com", "custom-cards.ai"];
export const outboundRel = (url: string): "noopener" | "noreferrer" => {
  try {
    return OWN_HOSTS.includes(new URL(url).host.replace(/^www\./, "")) ? "noopener" : "noreferrer";
  } catch {
    return "noreferrer";
  }
};

export const orgInfo = {
  name: "GLF Analytics",
  legalName: "GLF Analytics",
  logo: "/images/glf-logo.png",
  email: "gabrielf@glfanalytics.com",
  founder: "Gabriel Freeman",
  // S37: the practice in one sentence (also the opening line of /llms.txt) and the year it started.
  description: "GLF Analytics is Gabriel Freeman's practice in Los Angeles, independent since 2021.",
  foundingDate: "2021",
  address: {
    city: "Los Angeles",
    region: "CA",
    country: "US"
  }
};

export const bcStatsSource = {
  label: "Vercel Web Analytics on birthday-cards.ai",
  productUrl: "https://www.birthday-cards.ai",
  launchMonth: "March 2026",
  // Indexable search landing pages on the product, counted at each glf website
  // session from the birthday-cards repo (14 = the card aisle hub /ai-birthday-card-ideas, pushed 9/14/26; 13 = zodiac, 9/13).
  seoPages: "Fourteen"
};
