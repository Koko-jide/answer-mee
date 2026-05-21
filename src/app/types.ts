export interface Answer {
  id: string;
  body: string;
  authorId: string;
  authorName: string;
  authorSchool: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
}

export interface Question {
  id: string;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  authorSchool: string;
  subject: string;
  createdAt: string;
  answers: Answer[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  field: string;
  school: string;
  bio: string;
  points: number;
  answerCount: number;
  joinedAt: string;
  isFounder?: boolean;
}

export interface UserStats {
  questionCount: number;
  answerCount: number;
  points: number;
  totalLikesReceived: number;
  subjectsAnswered: number;
  isVerified: boolean;
  isFounder: boolean;
}
