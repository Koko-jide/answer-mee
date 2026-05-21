import type { UserStats } from '../types';

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  category: 'Contributions' | 'Points' | 'Recognition' | 'Breadth' | 'Special';
  description: string;
  howToEarn: string;
  check: (stats: UserStats) => boolean;
  progress: ((stats: UserStats) => { current: number; max: number }) | null;
}

export const ACHIEVEMENTS: Achievement[] = [
  // --- Contributions ---
  {
    id: 'first-question',
    name: 'First Steps',
    icon: '🌱',
    category: 'Contributions',
    description: 'You posed your first question and began your academic journey on Academia.',
    howToEarn: 'Post your first question in the discussion feed.',
    check: (s) => s.questionCount >= 1,
    progress: (s) => ({ current: Math.min(s.questionCount, 1), max: 1 }),
  },
  {
    id: 'five-questions',
    name: 'Questioner',
    icon: '❓',
    category: 'Contributions',
    description: 'An active mind always seeks deeper understanding — you have asked five questions.',
    howToEarn: 'Post 5 questions in the discussion feed.',
    check: (s) => s.questionCount >= 5,
    progress: (s) => ({ current: Math.min(s.questionCount, 5), max: 5 }),
  },
  {
    id: 'ten-questions',
    name: 'Inquisitor',
    icon: '🔍',
    category: 'Contributions',
    description: 'You consistently drive intellectual discourse with a relentless curiosity.',
    howToEarn: 'Post 10 questions in the discussion feed.',
    check: (s) => s.questionCount >= 10,
    progress: (s) => ({ current: Math.min(s.questionCount, 10), max: 10 }),
  },
  {
    id: 'first-answer',
    name: 'First Voice',
    icon: '💬',
    category: 'Contributions',
    description: 'You shared your knowledge with the community for the very first time.',
    howToEarn: 'Submit your first answer to any question.',
    check: (s) => s.answerCount >= 1,
    progress: (s) => ({ current: Math.min(s.answerCount, 1), max: 1 }),
  },
  {
    id: 'five-answers',
    name: 'Contributor',
    icon: '✏️',
    category: 'Contributions',
    description: 'A consistent contributor whose explanations help peers across the platform.',
    howToEarn: 'Submit 5 answers across any questions.',
    check: (s) => s.answerCount >= 5,
    progress: (s) => ({ current: Math.min(s.answerCount, 5), max: 5 }),
  },
  {
    id: 'ten-answers',
    name: 'Scholar',
    icon: '📚',
    category: 'Contributions',
    description: 'Your depth of knowledge and willingness to help enrich every discussion.',
    howToEarn: 'Submit 10 answers across any questions.',
    check: (s) => s.answerCount >= 10,
    progress: (s) => ({ current: Math.min(s.answerCount, 10), max: 10 }),
  },
  {
    id: 'twentyfive-answers',
    name: 'Mentor',
    icon: '🧑‍🏫',
    category: 'Contributions',
    description: 'You have become a guiding voice, shaping the understanding of countless peers.',
    howToEarn: 'Submit 25 answers across any questions.',
    check: (s) => s.answerCount >= 25,
    progress: (s) => ({ current: Math.min(s.answerCount, 25), max: 25 }),
  },
  {
    id: 'fifty-answers',
    name: 'Luminary',
    icon: '🕯️',
    category: 'Contributions',
    description: 'Fifty answers — a beacon of knowledge whose light illuminates the academic community.',
    howToEarn: 'Submit 50 answers across any questions.',
    check: (s) => s.answerCount >= 50,
    progress: (s) => ({ current: Math.min(s.answerCount, 50), max: 50 }),
  },

  // --- Points ---
  {
    id: 'fifty-points',
    name: 'Rising Star',
    icon: '⭐',
    category: 'Points',
    description: 'Your academic contributions are beginning to gain recognition.',
    howToEarn: 'Earn 50 points through questions (+5), answers (+10), and received likes (+2 each).',
    check: (s) => s.points >= 50,
    progress: (s) => ({ current: Math.min(s.points, 50), max: 50 }),
  },
  {
    id: 'hundred-points',
    name: 'Academic',
    icon: '🌟',
    category: 'Points',
    description: 'A century of points — a true academic whose presence enriches the platform.',
    howToEarn: 'Earn 100 points through questions, answers, and received likes.',
    check: (s) => s.points >= 100,
    progress: (s) => ({ current: Math.min(s.points, 100), max: 100 }),
  },
  {
    id: 'twofifty-points',
    name: 'Distinguished',
    icon: '💫',
    category: 'Points',
    description: 'Your scholarship stands clearly distinguished among your peers.',
    howToEarn: 'Earn 250 points through questions, answers, and received likes.',
    check: (s) => s.points >= 250,
    progress: (s) => ({ current: Math.min(s.points, 250), max: 250 }),
  },
  {
    id: 'fivehundred-points',
    name: 'Excellence',
    icon: '🏅',
    category: 'Points',
    description: 'Five hundred points — an exceptional scholar whose excellence is undeniable.',
    howToEarn: 'Earn 500 points through questions, answers, and received likes.',
    check: (s) => s.points >= 500,
    progress: (s) => ({ current: Math.min(s.points, 500), max: 500 }),
  },
  {
    id: 'thousand-points',
    name: 'Grand Scholar',
    icon: '👑',
    category: 'Points',
    description: 'One thousand points — you have reached the pinnacle of academic recognition.',
    howToEarn: 'Earn 1,000 points through questions, answers, and received likes.',
    check: (s) => s.points >= 1000,
    progress: (s) => ({ current: Math.min(s.points, 1000), max: 1000 }),
  },

  // --- Recognition ---
  {
    id: 'ten-likes',
    name: 'Helpful',
    icon: '👍',
    category: 'Recognition',
    description: 'Your answers resonate — peers have found your contributions genuinely useful.',
    howToEarn: 'Receive a total of 10 likes across all your answers.',
    check: (s) => s.totalLikesReceived >= 10,
    progress: (s) => ({ current: Math.min(s.totalLikesReceived, 10), max: 10 }),
  },
  {
    id: 'twentyfive-likes',
    name: 'Insightful',
    icon: '🎖️',
    category: 'Recognition',
    description: 'Your explanations consistently illuminate complex topics for the community.',
    howToEarn: 'Receive a total of 25 likes across all your answers.',
    check: (s) => s.totalLikesReceived >= 25,
    progress: (s) => ({ current: Math.min(s.totalLikesReceived, 25), max: 25 }),
  },
  {
    id: 'fifty-likes',
    name: 'Authoritative',
    icon: '🥇',
    category: 'Recognition',
    description: 'Widely recognized as a trusted, authoritative voice in academic discourse.',
    howToEarn: 'Receive a total of 50 likes across all your answers.',
    check: (s) => s.totalLikesReceived >= 50,
    progress: (s) => ({ current: Math.min(s.totalLikesReceived, 50), max: 50 }),
  },
  {
    id: 'hundred-likes',
    name: 'Celebrated',
    icon: '🎗️',
    category: 'Recognition',
    description: 'One hundred likes — a celebrated scholar whose words carry genuine weight.',
    howToEarn: 'Receive a total of 100 likes across all your answers.',
    check: (s) => s.totalLikesReceived >= 100,
    progress: (s) => ({ current: Math.min(s.totalLikesReceived, 100), max: 100 }),
  },

  // --- Breadth ---
  {
    id: 'three-subjects',
    name: 'Interdisciplinary',
    icon: '🔬',
    category: 'Breadth',
    description: 'You bridge knowledge across multiple academic disciplines, enriching cross-field understanding.',
    howToEarn: 'Answer questions in at least 3 different subjects.',
    check: (s) => s.subjectsAnswered >= 3,
    progress: (s) => ({ current: Math.min(s.subjectsAnswered, 3), max: 3 }),
  },
  {
    id: 'five-subjects',
    name: 'Polymath',
    icon: '📐',
    category: 'Breadth',
    description: 'A true Renaissance scholar — your knowledge spans five distinct academic disciplines.',
    howToEarn: 'Answer questions in at least 5 different subjects.',
    check: (s) => s.subjectsAnswered >= 5,
    progress: (s) => ({ current: Math.min(s.subjectsAnswered, 5), max: 5 }),
  },
  {
    id: 'eight-subjects',
    name: 'Universal Mind',
    icon: '🌐',
    category: 'Breadth',
    description: 'You have contributed insights across eight fields — a truly universal intellect.',
    howToEarn: 'Answer questions in all 8 available subjects.',
    check: (s) => s.subjectsAnswered >= 8,
    progress: (s) => ({ current: Math.min(s.subjectsAnswered, 8), max: 8 }),
  },

  // --- Special ---
  {
    id: 'verified',
    name: 'Verified Scholar',
    icon: '🎓',
    category: 'Special',
    description: 'You have provided your institutional affiliation and academic field, lending credibility to your contributions.',
    howToEarn: 'Fill in your school and academic field in Profile Settings.',
    check: (s) => s.isVerified,
    progress: null,
  },
  {
    id: 'founder',
    name: 'Founding Member',
    icon: '🔑',
    category: 'Special',
    description: 'You were among the very first scholars to join Academia — a founding member of this community.',
    howToEarn: 'This achievement is awarded to the original founding members of the platform.',
    check: (s) => s.isFounder,
    progress: null,
  },
];

export const ACHIEVEMENT_CATEGORIES = ['All', 'Contributions', 'Points', 'Recognition', 'Breadth', 'Special'] as const;
export type AchievementFilter = 'All' | 'Earned' | 'Not Yet' | Achievement['category'];
