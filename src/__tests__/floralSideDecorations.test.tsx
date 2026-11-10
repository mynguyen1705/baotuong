import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SchoolSideDecorations } from '../components/SchoolDecorations';
import { App } from '../App';

describe('SchoolSideDecorations (Sách vở, đồ dùng học tập, kí hiệu Toán & Hoá học hai bên trang chủ)', () => {
  it('đã xoá toàn bộ hoa và hiển thị sách vở, đồ dùng học tập, kí hiệu toán - hoá hai bên trái phải cùng máy bay giấy', () => {
    render(<SchoolSideDecorations />);

    const container = screen.getByTestId('school-side-decorations');
    expect(container).toBeInTheDocument();

    // 1. Tuyệt đối không còn hoa (hoa phượng, hoa hướng dương)
    expect(screen.queryByTestId('flamboyant-branch-left')).toBeNull();
    expect(screen.queryByTestId('flamboyant-branch-right')).toBeNull();
    expect(screen.queryByTestId('sunflower-bouquet-left')).toBeNull();
    expect(screen.queryByTestId('sunflower-bouquet-right')).toBeNull();
    expect(document.querySelector('img[src*="hoa-phuong"]')).toBeNull();
    expect(document.querySelector('img[src*="hoa-huong-duong"]')).toBeNull();

    // 2. Sách vở và đồ dùng học tập hai bên trái & phải
    const leftSupplies = screen.getByTestId('school-supplies-left');
    const rightSupplies = screen.getByTestId('school-supplies-right');
    expect(leftSupplies).toBeInTheDocument();
    expect(rightSupplies).toBeInTheDocument();

    // 3. Kí hiệu & dụng cụ Hoá Học: Bình tam giác sủi bọt, ống nghiệm, vòng benzen, nguyên tử
    expect(screen.getAllByTestId('chemistry-lab-decor').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('atom-model-decor').length).toBeGreaterThan(0);

    // 4. Kí hiệu & công thức Toán Học: pi, căn x, sigma, tích phân, a^2+b^2=c^2
    expect(screen.getAllByTestId('math-formulas-decor').length).toBeGreaterThan(0);

    // 5. Phi đội máy bay giấy bay lượn
    expect(screen.getByTestId('flying-paper-airplanes')).toBeInTheDocument();
  });

  it('tích hợp trực tiếp SchoolSideDecorations vào trang chủ chính (App) và không còn hoa trên trang chủ', () => {
    render(<App />);
    expect(screen.getByTestId('school-side-decorations')).toBeInTheDocument();
    expect(screen.getByTestId('school-supplies-left')).toBeInTheDocument();
    expect(screen.getByTestId('school-supplies-right')).toBeInTheDocument();
    expect(document.querySelector('img[src*="hoa-phuong"]')).toBeNull();
    expect(document.querySelector('img[src*="hoa-huong-duong"]')).toBeNull();
  });
});
