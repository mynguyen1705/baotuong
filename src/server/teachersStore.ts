import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { triggerAutoGitPush } from './autoGitSync';
import {
  AddTeacherImpressionInput,
  CreateTeacherInput,
  DEFAULT_TEACHERS_SEED,
  TeacherAvatarTheme,
  TeacherImpression,
  TeacherProfile,
  UpdateTeacherInput,
} from '../types/teachers';

export class TeacherValidationError extends Error {
  public readonly fieldErrors: Partial<Record<string, string>>;

  constructor(message: string, fieldErrors: Partial<Record<string, string>> = {}) {
    super(message);
    this.name = 'TeacherValidationError';
    this.fieldErrors = fieldErrors;
  }
}

export class TeacherNotFoundError extends Error {
  constructor(message = 'Không tìm thấy giáo viên trong bảng tổng hợp.') {
    super(message);
    this.name = 'TeacherNotFoundError';
  }
}

export interface TeachersStoreOptions {
  storageFilePath?: string;
}

export interface TeachersStore {
  listTeachers(): Promise<TeacherProfile[]>;
  addTeacher(input: CreateTeacherInput): Promise<TeacherProfile>;
  updateTeacher(id: string, input: UpdateTeacherInput): Promise<TeacherProfile>;
  deleteTeacher(id: string): Promise<void>;
  addImpression(id: string, input: AddTeacherImpressionInput): Promise<TeacherProfile>;
  syncImpressions?(id: string, items: TeacherImpression[]): Promise<TeacherProfile>;
  updateImpression(
    teacherId: string,
    impressionId: string,
    input: Partial<AddTeacherImpressionInput>
  ): Promise<TeacherProfile>;
  deleteImpression(teacherId: string, impressionId: string): Promise<TeacherProfile>;
}

function normalizeImpressionContentKey(imp: {
  studentName?: string;
  className?: string;
  trait?: string;
  detail?: string;
}): string {
  const s = cleanText(imp.studentName).toLowerCase();
  const c = (cleanText(imp.className) || '9A3').toLowerCase();
  const t = cleanText(imp.trait).toLowerCase();
  const d = cleanText(imp.detail).toLowerCase();
  if (!s || !t || !d) return '';
  return `${s}|${c}|${t}|${d}`;
}

function mergeTeacherImpressionLists(...lists: (TeacherImpression[] | undefined)[]): TeacherImpression[] {
  const byId = new Map<string, TeacherImpression>();
  const seenKeys = new Set<string>();

  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const raw of list) {
      if (!raw || typeof raw !== 'object') continue;
      const id = cleanText(raw.id);
      const studentName = cleanText(raw.studentName);
      const className = cleanText(raw.className) || '9A3';
      const trait = cleanText(raw.trait);
      const detail = cleanText(raw.detail);
      const createdAt = cleanText(raw.createdAt) || new Date().toISOString();
      if (!id || !studentName || !trait || !detail) continue;

      const key = normalizeImpressionContentKey({ studentName, className, trait, detail });
      if (byId.has(id)) continue;
      if (key && seenKeys.has(key)) continue;

      byId.set(id, { id, studentName, className, trait, detail, createdAt });
      if (key) seenKeys.add(key);
    }
  }

  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function inferAvatarTheme(subject: string, provided?: TeacherAvatarTheme): TeacherAvatarTheme {
  if (provided) return provided;
  const upper = subject.toUpperCase();
  if (upper.includes('TOÁN')) return 'math';
  if (upper.includes('VĂN') || upper.includes('TIẾNG VIỆT')) return 'literature';
  if (upper.includes('LÝ') || upper.includes('LÍ') || upper.includes('CÔNG NGHỆ')) return 'physics';
  if (upper.includes('HÓA')) return 'chemistry';
  if (upper.includes('SINH') || upper.includes('TỰ NHIÊN')) return 'biology';
  if (upper.includes('SỬ') || upper.includes('ĐỊA') || upper.includes('GDCD')) return 'history';
  return 'custom';
}

function cleanText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeTraits(traits: unknown, badgeText: string): string[] {
  if (Array.isArray(traits)) {
    const cleaned = traits
      .map((item) => cleanText(item))
      .filter((item) => item.length > 0);
    if (cleaned.length > 0) return cleaned;
  }
  return badgeText ? [badgeText] : ['Tận tâm & nhiệt huyết'];
}

const CLOUD_IMPRESSIONS_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a1c10cd3967210';

async function fetchCloudImpressions(): Promise<Record<string, TeacherImpression[]> | null> {
  if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
    return null;
  }
  try {
    const res = await fetch(CLOUD_IMPRESSIONS_URL, {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      return data?.data?.impressionsByTeacher || null;
    }
  } catch {
    // Bỏ qua lỗi mạng
  }
  return null;
}

async function pushCloudImpressions(
  teachers: TeacherProfile[],
  forceReplaceForTeacherId?: string
): Promise<boolean> {
  if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
    return false;
  }
  try {
    // Gộp dữ liệu Cloud hiện có trước khi đẩy để không bao giờ ghi đè mất cảm nhận từ thiết bị khác
    const existingCloud = (await fetchCloudImpressions()) || {};
    const impressionsByTeacher: Record<string, TeacherImpression[]> = { ...existingCloud };

    for (const t of teachers) {
      const localImps = Array.isArray(t.impressions) ? t.impressions : [];
      if (forceReplaceForTeacherId && t.id === forceReplaceForTeacherId) {
        impressionsByTeacher[t.id] = localImps;
      } else {
        const merged = mergeTeacherImpressionLists(localImps, existingCloud[t.id]);
        if (merged.length > 0) {
          impressionsByTeacher[t.id] = merged;
        }
      }
    }
    const res = await fetch(CLOUD_IMPRESSIONS_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'baotuong_impressions',
        data: { impressionsByTeacher },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function createTeachersStore(options?: TeachersStoreOptions): TeachersStore {
  const storageFilePath =
    options?.storageFilePath ||
    process.env.TEACHERS_STORAGE_FILE ||
    path.resolve(process.cwd(), 'server', 'data', 'teachers.json');

  const isCustomStorage = Boolean(options?.storageFilePath || process.env.TEACHERS_STORAGE_FILE);

  let writeQueue: Promise<unknown> = Promise.resolve();

  async function writeRecords(records: TeacherProfile[]): Promise<void> {
    await fs.mkdir(path.dirname(storageFilePath), { recursive: true });
    await fs.writeFile(storageFilePath, JSON.stringify({ teachers: records }, null, 2), 'utf-8');

    if (!isCustomStorage) {
      try {
        const publicFile = path.resolve(process.cwd(), 'public', 'teachers-data.json');
        await fs.mkdir(path.dirname(publicFile), { recursive: true });
        await fs.writeFile(
          publicFile,
          JSON.stringify({ teachers: records, isOwner: false }, null, 2),
          'utf-8'
        );
      } catch {
        // Bỏ qua lỗi ghi file tĩnh
      }

      pushCloudImpressions(records).catch(() => {});
      triggerAutoGitPush();
    }
  }

  async function readRecords(): Promise<TeacherProfile[]> {
    try {
      const raw = await fs.readFile(storageFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as TeacherProfile[];
      }
      if (parsed && Array.isArray(parsed.teachers)) {
        return parsed.teachers as TeacherProfile[];
      }
      const seeded = structuredClone(DEFAULT_TEACHERS_SEED);
      await writeRecords(seeded);
      return seeded;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === 'ENOENT') {
        if (!isCustomStorage) {
          try {
            const publicFallback = path.resolve(process.cwd(), 'public', 'teachers-data.json');
            const publicRaw = await fs.readFile(publicFallback, 'utf-8');
            const publicParsed = JSON.parse(publicRaw);
            const teachers = Array.isArray(publicParsed) ? publicParsed : publicParsed?.teachers;
            if (Array.isArray(teachers) && teachers.length > 0) {
              await writeRecords(teachers);
              return teachers;
            }
          } catch {
            // ignore fallback error
          }
        }
        const seeded = structuredClone(DEFAULT_TEACHERS_SEED);
        await writeRecords(seeded);
        return seeded;
      }
      throw err;
    }
  }

  return {
    async listTeachers(): Promise<TeacherProfile[]> {
      const records = await readRecords();

      // Đồng bộ hai chiều các cảm nhận thầy cô từ Cloud Store về Local (chống trùng lặp cả theo ID và nội dung)
      if (!isCustomStorage) {
        try {
          const cloudImpressions = await fetchCloudImpressions();
          if (cloudImpressions && typeof cloudImpressions === 'object') {
            let hasNew = false;
            for (const teacher of records) {
              const cloudList = cloudImpressions[teacher.id];
              if (Array.isArray(cloudList) && cloudList.length > 0) {
                const currentLen = (teacher.impressions || []).length;
                const merged = mergeTeacherImpressionLists(teacher.impressions, cloudList);
                if (merged.length > currentLen) {
                  hasNew = true;
                  teacher.impressions = merged;
                  const traitSet = new Set(teacher.personalityTraits || []);
                  for (const imp of merged) {
                    if (imp.trait) traitSet.add(imp.trait);
                  }
                  teacher.personalityTraits = Array.from(traitSet);
                }
              }
            }
            if (hasNew) {
              await writeRecords(records);
            }
          }
        } catch {
          // Bỏ qua lỗi mạng
        }
      }

      return records;
    },

    async addTeacher(input: CreateTeacherInput): Promise<TeacherProfile> {
      const subject = cleanText(input.subject).toUpperCase();
      const honorificAndName = cleanText(input.honorificAndName).toUpperCase();
      const badgeText = cleanText(input.badgeText);
      const summary = cleanText(input.summary);

      const fieldErrors: Partial<Record<string, string>> = {};
      if (!subject) fieldErrors.subject = 'Vui lòng nhập tên bộ môn (ví dụ: TIẾNG ANH, TIN HỌC).';
      if (!honorificAndName) {
        fieldErrors.honorificAndName = 'Vui lòng nhập danh xưng và họ tên thầy/cô.';
      }
      if (!badgeText) {
        fieldErrors.badgeText = 'Vui lòng nhập nhãn tính cách nổi bật (ví dụ: Siêu vui tính!).';
      }
      if (!summary) {
        fieldErrors.summary = 'Vui lòng nhập mô tả ngắn về tính cách hoặc phong cách dạy của thầy/cô.';
      }

      if (Object.keys(fieldErrors).length > 0) {
        throw new TeacherValidationError(
          Object.values(fieldErrors)[0] || 'Thông tin giáo viên chưa hợp lệ.',
          fieldErrors
        );
      }

      const task = writeQueue.then(async () => {
        const records = await readRecords();
        const nowIso = new Date().toISOString();
        const badgeSide: 'left' | 'right' =
          input.badgeSide === 'left' || input.badgeSide === 'right'
            ? input.badgeSide
            : records.length % 2 === 0
              ? 'right'
              : 'left';

        const detailedBio =
          cleanText(input.detailedBio) ||
          `${honorificAndName} phụ trách bộ môn ${subject}. ${summary}.`;
        const memorableQuote =
          cleanText(input.memorableQuote) ||
          '“Mỗi tiết học là một hành trình khám phá tri thức mới cùng tập thể 9A3.”';
        const photoUrl = cleanText(input.photoUrl);

        const newTeacher: TeacherProfile = {
          id: `teacher-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
          subject,
          honorificAndName,
          badgeText,
          badgeSide,
          summary,
          personalityTraits: normalizeTraits(input.personalityTraits, badgeText),
          detailedBio,
          memorableQuote,
          photoUrl,
          avatarTheme: inferAvatarTheme(subject, input.avatarTheme),
          impressions: [],
          createdAt: nowIso,
          updatedAt: nowIso,
        };

        // Không giới hạn số lượng giáo viên tối đa
        const updated = [...records, newTeacher];
        await writeRecords(updated);
        return newTeacher;
      });

      writeQueue = task.catch(() => {});
      return task;
    },

    async updateTeacher(id: string, input: UpdateTeacherInput): Promise<TeacherProfile> {
      const targetId = cleanText(id);
      if (!targetId) {
        throw new TeacherNotFoundError();
      }

      const task = writeQueue.then(async () => {
        const records = await readRecords();
        const index = records.findIndex((item) => item.id === targetId);
        if (index === -1) {
          throw new TeacherNotFoundError();
        }

        const existing = records[index];
        const nextSubject =
          input.subject !== undefined ? cleanText(input.subject).toUpperCase() : existing.subject;
        const nextName =
          input.honorificAndName !== undefined
            ? cleanText(input.honorificAndName).toUpperCase()
            : existing.honorificAndName;
        const nextBadge =
          input.badgeText !== undefined ? cleanText(input.badgeText) : existing.badgeText;
        const nextSummary =
          input.summary !== undefined ? cleanText(input.summary) : existing.summary;

        if (!nextSubject || !nextName || !nextBadge || !nextSummary) {
          throw new TeacherValidationError('Các trường môn học, tên, nhãn tính cách và mô tả không được để trống.');
        }

        const updatedTeacher: TeacherProfile = {
          ...existing,
          subject: nextSubject,
          honorificAndName: nextName,
          badgeText: nextBadge,
          badgeSide:
            input.badgeSide === 'left' || input.badgeSide === 'right'
              ? input.badgeSide
              : existing.badgeSide,
          summary: nextSummary,
          personalityTraits:
            input.personalityTraits !== undefined
              ? normalizeTraits(input.personalityTraits, nextBadge)
              : existing.personalityTraits,
          detailedBio:
            input.detailedBio !== undefined
              ? cleanText(input.detailedBio) || existing.detailedBio
              : existing.detailedBio,
          memorableQuote:
            input.memorableQuote !== undefined
              ? cleanText(input.memorableQuote) || existing.memorableQuote
              : existing.memorableQuote,
          // Cho phép thêm hoặc đổi ảnh giáo viên bất cứ lúc nào
          photoUrl:
            input.photoUrl !== undefined ? cleanText(input.photoUrl) : existing.photoUrl,
          updatedAt: new Date().toISOString(),
        };

        const nextRecords = [...records];
        nextRecords[index] = updatedTeacher;
        await writeRecords(nextRecords);
        return updatedTeacher;
      });

      writeQueue = task.catch(() => {});
      return task;
    },

    async deleteTeacher(id: string): Promise<void> {
      const targetId = cleanText(id);
      if (!targetId) {
        throw new TeacherNotFoundError();
      }

      const task = writeQueue.then(async () => {
        const records = await readRecords();
        const index = records.findIndex((item) => item.id === targetId);
        if (index === -1) {
          throw new TeacherNotFoundError();
        }

        const nextRecords = records.filter((item) => item.id !== targetId);
        await writeRecords(nextRecords);
      });

      writeQueue = task.catch(() => {});
      return task;
    },

    async addImpression(id: string, input: AddTeacherImpressionInput): Promise<TeacherProfile> {
      const targetId = cleanText(id);
      const studentName = cleanText(input.studentName);
      const className = cleanText(input.className) || '9A3';
      const trait = cleanText(input.trait);
      const detail = cleanText(input.detail);

      const fieldErrors: Partial<Record<string, string>> = {};
      if (!studentName) fieldErrors.studentName = 'Vui lòng nhập tên học sinh hoặc nhóm học sinh.';
      if (!trait) fieldErrors.trait = 'Vui lòng nhập nét tính cách ấn tượng của thầy/cô.';
      if (!detail) fieldErrors.detail = 'Vui lòng chia sẻ chi tiết hoặc kỷ niệm về thầy/cô.';

      if (Object.keys(fieldErrors).length > 0) {
        throw new TeacherValidationError(
          Object.values(fieldErrors)[0] || 'Thông tin cảm nhận chưa hợp lệ.',
          fieldErrors
        );
      }

      const task = writeQueue.then(async () => {
        const records = await readRecords();
        const index = records.findIndex((item) => item.id === targetId);
        if (index === -1) {
          throw new TeacherNotFoundError();
        }

        const existing = records[index];
        const newImpression: TeacherImpression = {
          id: `imp-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
          studentName,
          className,
          trait,
          detail,
          createdAt: new Date().toISOString(),
        };

        const mergedTraits = existing.personalityTraits.includes(trait)
          ? existing.personalityTraits
          : [...existing.personalityTraits, trait];

        const updatedTeacher: TeacherProfile = {
          ...existing,
          personalityTraits: mergedTraits,
          impressions: [newImpression, ...existing.impressions],
          updatedAt: new Date().toISOString(),
        };

        const nextRecords = [...records];
        nextRecords[index] = updatedTeacher;
        await writeRecords(nextRecords);
        return updatedTeacher;
      });

      writeQueue = task.catch(() => {});
      return task;
    },

    async syncImpressions(id: string, items: TeacherImpression[]): Promise<TeacherProfile> {
      const targetId = cleanText(id);
      const task = writeQueue.then(async () => {
        const records = await readRecords();
        const index = records.findIndex((item) => item.id === targetId);
        if (index === -1) {
          throw new TeacherNotFoundError();
        }

        const existing = records[index];
        const mergedImps = mergeTeacherImpressionLists(existing.impressions, items);
        const traitSet = new Set(existing.personalityTraits || []);
        for (const imp of mergedImps) {
          if (imp.trait) traitSet.add(imp.trait);
        }

        const updatedTeacher: TeacherProfile = {
          ...existing,
          personalityTraits: Array.from(traitSet),
          impressions: mergedImps,
          updatedAt: new Date().toISOString(),
        };

        if (mergedImps.length !== (existing.impressions || []).length) {
          const nextRecords = [...records];
          nextRecords[index] = updatedTeacher;
          await writeRecords(nextRecords);
        }
        return updatedTeacher;
      });

      writeQueue = task.catch(() => {});
      return task;
    },

    async updateImpression(
      teacherId: string,
      impressionId: string,
      input: Partial<AddTeacherImpressionInput>
    ): Promise<TeacherProfile> {
      const targetId = cleanText(teacherId);
      const targetImpId = cleanText(impressionId);

      const task = writeQueue.then(async () => {
        const records = await readRecords();
        const index = records.findIndex((item) => item.id === targetId);
        if (index === -1) {
          throw new TeacherNotFoundError();
        }

        const existing = records[index];
        const impIndex = existing.impressions.findIndex((imp) => imp.id === targetImpId);
        if (impIndex === -1) {
          throw new TeacherValidationError('Không tìm thấy cảm nhận cần chỉnh sửa.');
        }

        const currentImp = existing.impressions[impIndex];
        const updatedImp: TeacherImpression = {
          ...currentImp,
          studentName:
            input.studentName !== undefined ? cleanText(input.studentName) : currentImp.studentName,
          className:
            input.className !== undefined ? cleanText(input.className) || '9A3' : currentImp.className,
          trait: input.trait !== undefined ? cleanText(input.trait) : currentImp.trait,
          detail: input.detail !== undefined ? cleanText(input.detail) : currentImp.detail,
        };

        const nextImpressions = [...existing.impressions];
        nextImpressions[impIndex] = updatedImp;

        const updatedTeacher: TeacherProfile = {
          ...existing,
          impressions: nextImpressions,
          updatedAt: new Date().toISOString(),
        };

        const nextRecords = [...records];
        nextRecords[index] = updatedTeacher;
        await writeRecords(nextRecords);
        return updatedTeacher;
      });

      writeQueue = task.catch(() => {});
      return task;
    },

    async deleteImpression(teacherId: string, impressionId: string): Promise<TeacherProfile> {
      const targetId = cleanText(teacherId);
      const targetImpId = cleanText(impressionId);

      const task = writeQueue.then(async () => {
        const records = await readRecords();
        const index = records.findIndex((item) => item.id === targetId);
        if (index === -1) {
          throw new TeacherNotFoundError();
        }

        const existing = records[index];
        const nextImpressions = existing.impressions.filter((imp) => imp.id !== targetImpId);

        const updatedTeacher: TeacherProfile = {
          ...existing,
          impressions: nextImpressions,
          updatedAt: new Date().toISOString(),
        };

        const nextRecords = [...records];
        nextRecords[index] = updatedTeacher;
        await writeRecords(nextRecords);
        return updatedTeacher;
      });

      writeQueue = task.catch(() => {});
      return task;
    },
  };
}

