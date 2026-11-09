export type SectionId = 'loi-ngo' | 'truyen-ngan' | 'tho' | 'mv' | 'tri-an';

export interface PoemItem {
  id: string;
  title: string;
  author: string;
  source: string;
  yearOrContext: string;
  stanzas: string[][];
  commentary: string;
}

export interface MvScene {
  timeRange: string;
  location: string;
  description: string;
}

export interface MvData {
  songTitle: string;
  composer: string;
  artist: string;
  videoUrl: string;
  youtubeEmbedUrl?: string;
  schoolContextNote: string;
  scenes: MvScene[];
  lyricsExcerpt: string[][];
}

export type TypoPalette = 'amber' | 'emerald' | 'crimson' | 'cobalt' | 'terracotta';

export interface TypoSectionTheme {
  displayNumeral: '01' | '02' | '03' | '04' | '05';
  kicker: string;
  accentWord: string;
  featuredLines: string[];
  metaTags: string[];
  palette: TypoPalette;
}

export interface SectionData {
  id: SectionId;
  orderNumber: number;
  badgeTitle: string;
  title: string;
  subtitle: string;
  categoryLabel: string;
  scoringWeight: string;
  summary: string;
  authorCredit: string;
  sourceNote: string;
  pullQuote?: string;
  paragraphs?: string[];
  poems?: PoemItem[];
  audioRecitationUrl?: string;
  studentVoiceNote?: string;
  mvData?: MvData;
  typoTheme: TypoSectionTheme;
}

export interface EditorialMember {
  role: string;
  name: string;
  task: string;
}

export interface BaoTuongConfig {
  newspaperTitle: string;
  competitionTheme: string;
  celebrationTitle: string;
  className: string;
  schoolName: string;
  schoolYear: string;
  homeroomTeacher: string;
  posterImageUrl?: string;
  editorialBoard: EditorialMember[];
  sections: SectionData[];
}
