import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SchoolSideDecorations } from '../components/SchoolDecorations';
import { App } from '../App';

describe('SchoolSideDecorations (Cành hoa phượng đỏ rực rỡ & máy bay giấy hai bên trang chủ chuẩn Poster)', () => {
  it('đã xoá toàn bộ bình thí nghiệm, công thức toán và hiển thị cành hoa phượng đỏ cùng phi đội máy bay giấy', () => {
    render(<SchoolSideDecorations />);

    const container = screen.getByTestId('school-side-decorations');
    expect(container).toBeInTheDocument();

    // 1. Cành hoa phượng đỏ hai bên trái & phải chuẩn phong cách Poster
    const leftBranch = screen.getByTestId('flamboyant-branch-left');
    const rightBranch = screen.getByTestId('flamboyant-branch-right');
    expect(leftBranch).toBeInTheDocument();
    expect(rightBranch).toBeInTheDocument();

    // 2. Tuyệt đối không còn bình thí nghiệm, nguyên tử, công thức toán học cũ
    expect(screen.queryByTestId('chemistry-lab-decor')).toBeNull();
    expect(screen.queryByTestId('atom-model-decor')).toBeNull();
    expect(screen.queryByTestId('math-formulas-decor')).toBeNull();

    // 3. Phi đội máy bay giấy bay lượn
    expect(screen.getByTestId('flying-paper-airplanes')).toBeInTheDocument();
  });

  it('tích hợp trực tiếp SchoolSideDecorations vào trang chủ chính (App) với cành phượng và máy bay giấy', () => {
    render(<App />);
    expect(screen.getByTestId('school-side-decorations')).toBeInTheDocument();
    expect(screen.getByTestId('flamboyant-branch-left')).toBeInTheDocument();
    expect(screen.getByTestId('flamboyant-branch-right')).toBeInTheDocument();
    expect(screen.queryByTestId('chemistry-lab-decor')).toBeNull();
  });
});
