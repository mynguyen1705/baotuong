import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FallingPetals } from '../components/FallingPetals';
import { App } from '../App';

describe('FallingPetals & Loại bỏ hoàn toàn chồng sách, lọ thuốc trên trang chủ', () => {
  it('hiển thị hiệu ứng những cánh hoa sen và lá phong rơi nhẹ nhàng khắp trang', () => {
    render(<FallingPetals />);

    const container = screen.getByTestId('falling-petals');
    expect(container).toBeInTheDocument();

    // Có các cánh hoa sen và cánh lá phong rơi
    const lotusPetals = screen.getAllByTestId('falling-petal-lotus');
    const mapleLeaves = screen.getAllByTestId('falling-petal-maple');

    expect(lotusPetals.length).toBeGreaterThan(0);
    expect(mapleLeaves.length).toBeGreaterThan(0);
  });

  it('tích hợp FallingPetals vào App và đã xóa hoàn toàn mọi biểu tượng chồng sách, lọ thuốc, bình hóa học', () => {
    render(<App />);

    // 1. Hiệu ứng cánh hoa rơi đang hoạt động trên App
    expect(screen.getByTestId('falling-petals')).toBeInTheDocument();

    // 2. Đã xóa hoàn toàn các biểu tượng chồng sách, lọ thuốc/bình hóa học
    expect(screen.queryByTestId('chemistry-lab-decor')).toBeNull();
    expect(screen.queryByTestId('school-supplies-left')).toBeNull();
    expect(screen.queryByTestId('school-supplies-right')).toBeNull();
    expect(screen.queryByTestId('atom-model-decor')).toBeNull();
  });
});
