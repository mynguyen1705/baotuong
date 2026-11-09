import { describe, it, expect } from 'vitest';
import { BAO_TUONG_DATA, getSectionById } from '../data/baotuongData';
import { countVietnameseWords } from '../utils/wordCount';

describe('BAO_TUONG_DATA compliance with yeucau.txt', () => {
  it('chứa đúng thông tin Chi đội 9A3, Trường TH&THCS Hiệp Thạnh và chủ đề cuộc thi', () => {
    expect(BAO_TUONG_DATA.className).toContain('9A3');
    expect(BAO_TUONG_DATA.schoolName).toContain('TH&THCS Hiệp Thạnh');
    expect(BAO_TUONG_DATA.competitionTheme).toBe('Tôn sư trọng đạo - Nét bút tri ân');
    expect(BAO_TUONG_DATA.newspaperTitle).toBe('CHẮP CÁNH ƯỚC MƠ');
  });

  it('có đủ 5 chuyên mục khớp với poster và thể lệ', () => {
    const ids = BAO_TUONG_DATA.sections.map((s) => s.id);
    expect(ids).toEqual(['loi-ngo', 'truyen-ngan', 'tho', 'mv', 'tri-an']);
  });

  it('chuyên mục Thơ sử dụng các bài thơ của tác giả nổi tiếng về tuổi học trò & thầy cô có ghi rõ tác giả/nguồn', () => {
    const thoSection = getSectionById('tho');
    expect(thoSection?.poems?.length).toBeGreaterThanOrEqual(3);
    thoSection?.poems?.forEach((poem) => {
      expect(poem.author.length).toBeGreaterThan(0);
      expect(poem.source.length).toBeGreaterThan(0);
    });
  });

  it('chuyên mục MV sử dụng bài hát Người gieo mầm xanh của Hứa Kim Tuyền và Hoàng Dũng', () => {
    const mvSection = getSectionById('mv');
    expect(mvSection?.mvData?.songTitle).toContain('Người gieo mầm xanh');
    expect(mvSection?.mvData?.composer).toContain('Hứa Kim Tuyền');
    expect(mvSection?.mvData?.artist).toContain('Hoàng Dũng');
  });

  it('Bài Lời tri ân (mục 5) có độ dài khoảng 600 chữ (550 - 650 chữ)', () => {
    const triAnSection = getSectionById('tri-an');
    const fullText = (triAnSection?.paragraphs ?? []).join(' ');
    const words = countVietnameseWords(fullText);
    expect(words).toBeGreaterThanOrEqual(550);
    expect(words).toBeLessThanOrEqual(650);
  });
});

