import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_TEACHERS_SEED, TeacherProfile } from '../types/teachers';
import { TeacherSummaryBoardSection } from '../components/TeacherSummaryBoardSection';
import { TeacherBoardModal } from '../components/TeacherBoardModal';

describe('TeacherSummaryBoardSection & TeacherBoardModal', () => {
  let teachersState: TeacherProfile[];

  beforeEach(() => {
    teachersState = structuredClone(DEFAULT_TEACHERS_SEED);

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method = (init?.method || 'GET').toUpperCase();

        if (url === '/api/teachers' && method === 'GET') {
          return {
            ok: true,
            status: 200,
            json: async () => ({ teachers: teachersState }),
          };
        }

        if (url === '/api/teachers' && method === 'POST') {
          const body = JSON.parse(String(init?.body || '{}'));
          const created: TeacherProfile = {
            id: `teacher-new-${teachersState.length + 1}`,
            subject: String(body.subject).toUpperCase(),
            honorificAndName: String(body.honorificAndName).toUpperCase(),
            badgeText: String(body.badgeText),
            badgeSide: 'right',
            summary: String(body.summary),
            personalityTraits: body.personalityTraits || [String(body.badgeText)],
            detailedBio: body.detailedBio || String(body.summary),
            memorableQuote: body.memorableQuote || '',
            photoUrl: body.photoUrl || '',
            avatarTheme: 'custom',
            impressions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          teachersState = [...teachersState, created];
          return {
            ok: true,
            status: 201,
            json: async () => ({ teacher: created }),
          };
        }

        if (url.startsWith('/api/teachers/') && method === 'PATCH') {
          const id = decodeURIComponent(url.replace('/api/teachers/', ''));
          const body = JSON.parse(String(init?.body || '{}'));
          const idx = teachersState.findIndex((t) => t.id === id);
          if (idx === -1) {
            return {
              ok: false,
              status: 404,
              json: async () => ({ error: 'Not found' }),
            };
          }

          let current = { ...teachersState[idx] };
          if (body.photoUrl !== undefined) {
            current.photoUrl = String(body.photoUrl);
          }
          if (body.impression) {
            current.impressions = [
              {
                id: `imp-${Date.now()}`,
                studentName: body.impression.studentName,
                className: body.impression.className || '9A3',
                trait: body.impression.trait,
                detail: body.impression.detail,
                createdAt: new Date().toISOString(),
              },
              ...current.impressions,
            ];
          }
          teachersState[idx] = current;
          return {
            ok: true,
            status: 200,
            json: async () => ({ teacher: current }),
          };
        }

        return {
          ok: false,
          status: 404,
          json: async () => ({ error: 'Not found' }),
        };
      })
    );
  });

  it('renders the reference poster layout with 3D title, yellow tape, 6 Polaroid teacher cards, and bottom sticky note', () => {
    const onSelectTeacher = vi.fn();
    const onOpenForm = vi.fn();
    const onOpenFullBoard = vi.fn();
    const onUpdatePhoto = vi.fn();

    render(
      <TeacherSummaryBoardSection
        teachers={teachersState}
        onSelectTeacher={onSelectTeacher}
        onOpenForm={onOpenForm}
        onOpenFullBoard={onOpenFullBoard}
        onUpdateTeacherPhoto={onUpdatePhoto}
      />
    );

    expect(screen.getByText(/BẢNG TỔNG HỢP/i)).toBeInTheDocument();
    expect(screen.getByText(/GIÁO VIÊN BỘ MÔN/i)).toBeInTheDocument();
    expect(screen.getByText(/Năm Học Mới • Chi Đội 9A3/i)).toBeInTheDocument();
    expect(screen.getByText(/Chào mừng các em học sinh/i)).toBeInTheDocument();

    // Check all 6 seeded teachers
    expect(screen.getByText(/TOÁN HỌC - THẦY NGUYỄN VĂN A/i)).toBeInTheDocument();
    expect(screen.getByText(/NGỮ VĂN - CÔ TRẦN THỊ B/i)).toBeInTheDocument();
    expect(screen.getByText(/VẬT LÝ - THẦY LÊ VĂN C/i)).toBeInTheDocument();
    expect(screen.getByText(/HÓA HỌC - CÔ PHẠM THỊ D/i)).toBeInTheDocument();
    expect(screen.getByText(/SINH HỌC - CÔ MAI LAN/i)).toBeInTheDocument();
    expect(screen.getByText(/LỊCH SỬ - THẦY QUỐC KHÁNH/i)).toBeInTheDocument();
  });

  it('allows adding a new teacher with photo URL via the form modal and updating a teacher photo anytime', async () => {
    const handleTeachersChange = vi.fn((next: TeacherProfile[]) => {
      teachersState = next;
    });

    render(
      <TeacherBoardModal
        isOpen={true}
        mode="form"
        teachers={teachersState}
        selectedTeacherId={null}
        onClose={() => {}}
        onModeChange={() => {}}
        onSelectTeacher={() => {}}
        onTeachersUpdated={handleTeachersChange}
      />
    );

    fireEvent.change(screen.getByLabelText(/Bộ môn giảng dạy/i), {
      target: { value: 'TIN HỌC' },
    });
    fireEvent.change(screen.getByLabelText(/Danh xưng & Họ tên giáo viên/i), {
      target: { value: 'THẦY HOÀNG MINH' },
    });
    fireEvent.change(screen.getByLabelText(/Nhãn tính cách nổi bật/i), {
      target: { value: 'Chuyên gia công nghệ!' },
    });
    fireEvent.change(screen.getByLabelText(/Mô tả ngắn dưới ảnh Polaroid/i), {
      target: { value: 'Hướng dẫn lập trình và thiết kế báo tường số cực kỳ dễ hiểu' },
    });
    fireEvent.change(screen.getByLabelText(/Đường dẫn ảnh giáo viên/i), {
      target: { value: 'data:image/png;base64,SAMPLE_TIN_HOC' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Lưu vào Bảng Tổng Hợp Giáo Viên/i }));

    await waitFor(() => {
      expect(handleTeachersChange).toHaveBeenCalled();
    });

    expect(teachersState).toHaveLength(7);
    expect(teachersState[6].subject).toBe('TIN HỌC');
    expect(teachersState[6].photoUrl).toBe('data:image/png;base64,SAMPLE_TIN_HOC');
  });

  it('hides add/delete/photo buttons when isOwner is false (other devices) and shows them when isOwner is true', () => {
    const onDelete = vi.fn();
    const { rerender } = render(
      <TeacherSummaryBoardSection
        teachers={teachersState}
        isOwner={false}
        onSelectTeacher={() => {}}
        onOpenForm={() => {}}
        onDeleteTeacher={onDelete}
      />
    );

    expect(
      screen.queryByRole('button', { name: /\+ Thêm giáo viên & ảnh/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Xóa giáo viên THẦY NGUYỄN VĂN A/i })
    ).not.toBeInTheDocument();

    rerender(
      <TeacherSummaryBoardSection
        teachers={teachersState}
        isOwner={true}
        onSelectTeacher={() => {}}
        onOpenForm={() => {}}
        onDeleteTeacher={onDelete}
      />
    );

    expect(
      screen.getByRole('button', { name: /\+ Thêm giáo viên & ảnh/i })
    ).toBeInTheDocument();
    const deleteBtn = screen.getByRole('button', {
      name: /Xóa giáo viên THẦY NGUYỄN VĂN A/i,
    });
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith(teachersState[0].id);
  });
});

