import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTeachersStore, TeacherNotFoundError, TeacherValidationError } from '../server/teachersStore';

describe('teachersStore', () => {
  let tempDir: string;
  let storageFilePath: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'baotuong-teachers-test-'));
    storageFilePath = path.join(tempDir, 'teachers.json');
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('seeds the 6 default subject teachers from the reference poster on initial load', async () => {
    const store = createTeachersStore({ storageFilePath });
    const teachers = await store.listTeachers();

    expect(teachers).toHaveLength(6);
    expect(teachers[0].subject).toBe('TOÁN HỌC');
    expect(teachers[0].honorificAndName).toBe('THẦY NGUYỄN VĂN A');
    expect(teachers[0].badgeText).toBe('Siêu vui tính!');
    expect(teachers[0].summary).toContain('Hay đùa nhưng cực kỳ nghiêm túc khi chấm bài');

    expect(teachers[1].subject).toBe('NGỮ VĂN');
    expect(teachers[1].honorificAndName).toBe('CÔ TRẦN THỊ B');

    expect(teachers[2].subject).toBe('VẬT LÝ');
    expect(teachers[2].honorificAndName).toBe('THẦY LÊ VĂN C');

    expect(teachers[3].subject).toBe('HÓA HỌC');
    expect(teachers[3].honorificAndName).toBe('CÔ PHẠM THỊ D');

    expect(teachers[4].subject).toBe('SINH HỌC');
    expect(teachers[4].honorificAndName).toBe('CÔ MAI LAN');

    expect(teachers[5].subject).toBe('LỊCH SỬ');
    expect(teachers[5].honorificAndName).toBe('THẦY QUỐC KHÁNH');
  });

  it('allows adding unlimited new teachers with or without custom photos', async () => {
    const store = createTeachersStore({ storageFilePath });

    // Add 8 additional teachers to verify there is no maximum limit
    for (let i = 1; i <= 8; i++) {
      const created = await store.addTeacher({
        subject: `MÔN TỰ CHỌN ${i}`,
        honorificAndName: `THẦY GIÁO ${i}`,
        badgeText: `Nhiệt huyết ${i}!`,
        summary: `Luôn truyền cảm hứng học tập cho lớp 9A3 ở môn số ${i}`,
        detailedBio: `Thầy rất tận tâm và có nhiều phương pháp giảng dạy sáng tạo số ${i}.`,
        personalityTraits: ['Tận tâm', 'Sáng tạo', `Đặc điểm ${i}`],
        memorableQuote: `Cố gắng thêm một chút mỗi ngày nhé 9A3! (${i})`,
        photoUrl: i % 2 === 0 ? `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=` : '',
      });
      expect(created.id).toBeTruthy();
    }

    const allTeachers = await store.listTeachers();
    expect(allTeachers).toHaveLength(6 + 8);
    expect(allTeachers[13].subject).toBe('MÔN TỰ CHỌN 8');
    expect(allTeachers[13].photoUrl).toContain('data:image/png;base64,');
  });

  it('allows adding or changing a teacher photo at any time for both seeded and newly added teachers', async () => {
    const store = createTeachersStore({ storageFilePath });
    const initial = await store.listTeachers();
    const mathTeacherId = initial[0].id;

    const firstPhoto = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/FIRST_PHOTO';
    const updated1 = await store.updateTeacher(mathTeacherId, {
      photoUrl: firstPhoto,
    });
    expect(updated1.photoUrl).toBe(firstPhoto);

    const secondPhoto = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/SECOND_PHOTO';
    const updated2 = await store.updateTeacher(mathTeacherId, {
      photoUrl: secondPhoto,
      badgeText: 'Cực kỳ vui tính!',
    });
    expect(updated2.photoUrl).toBe(secondPhoto);
    expect(updated2.badgeText).toBe('Cực kỳ vui tính!');

    const reloaded = await store.listTeachers();
    expect(reloaded[0].photoUrl).toBe(secondPhoto);
  });

  it('allows students to append personality details and impressions to an existing teacher', async () => {
    const store = createTeachersStore({ storageFilePath });
    const initial = await store.listTeachers();
    const litTeacherId = initial[1].id;

    const updated = await store.addImpression(litTeacherId, {
      studentName: 'Nguyễn Minh Anh',
      className: '9A3',
      trait: 'Giọng đọc thơ siêu truyền cảm',
      detail: 'Mỗi giờ Ngữ văn của cô đều khiến cả lớp lặng đi vì xúc động.',
    });

    expect(updated.impressions.length).toBeGreaterThanOrEqual(2);
    expect(updated.impressions[0].studentName).toBe('Nguyễn Minh Anh');
    expect(updated.impressions[0].trait).toBe('Giọng đọc thơ siêu truyền cảm');
  });

  it('validates required fields and throws TeacherNotFoundError for unknown ID', async () => {
    const store = createTeachersStore({ storageFilePath });

    await expect(
      store.addTeacher({
        subject: '',
        honorificAndName: '',
        badgeText: '',
        summary: '',
      })
    ).rejects.toBeInstanceOf(TeacherValidationError);

    await expect(
      store.updateTeacher('non-existent-id', { photoUrl: 'https://example.com/photo.jpg' })
    ).rejects.toBeInstanceOf(TeacherNotFoundError);
  });

  it('allows deleting a teacher by ID and throws TeacherNotFoundError if ID does not exist', async () => {
    const store = createTeachersStore({ storageFilePath });
    const initial = await store.listTeachers();
    expect(initial).toHaveLength(6);

    await store.deleteTeacher(initial[0].id);

    const afterDelete = await store.listTeachers();
    expect(afterDelete).toHaveLength(5);
    expect(afterDelete.some((t) => t.id === initial[0].id)).toBe(false);

    await expect(store.deleteTeacher('non-existent-id')).rejects.toBeInstanceOf(
      TeacherNotFoundError
    );
  });

  it('allows adding, updating, and deleting impressions on a teacher profile', async () => {
    const store = createTeachersStore({ storageFilePath });
    const initial = await store.listTeachers();
    const target = initial[0];

    // 1. Add impression
    const updatedWithImp = await store.addImpression(target.id, {
      studentName: 'Nguyễn Văn B',
      className: '9A3',
      trait: 'Hài hước vui tính',
      detail: 'Thầy luôn kể chuyện cười trước khi vào bài giảng.',
    });

    const newImp = updatedWithImp.impressions[0];
    expect(newImp.studentName).toBe('Nguyễn Văn B');
    expect(newImp.trait).toBe('Hài hước vui tính');

    // 2. Update impression
    const updatedImpTeacher = await store.updateImpression(target.id, newImp.id, {
      trait: 'Siêu hài hước',
      detail: 'Thầy luôn kể chuyện vui và giúp lớp tiếp thu bài nhanh.',
    });

    const editedImp = updatedImpTeacher.impressions.find((i) => i.id === newImp.id);
    expect(editedImp?.trait).toBe('Siêu hài hước');
    expect(editedImp?.detail).toBe('Thầy luôn kể chuyện vui và giúp lớp tiếp thu bài nhanh.');

    // 3. Delete impression
    const afterDeleteTeacher = await store.deleteImpression(target.id, newImp.id);
    expect(afterDeleteTeacher.impressions.some((i) => i.id === newImp.id)).toBe(false);
  });
});

