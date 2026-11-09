import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { InteractivePosterView } from '../components/InteractivePosterView';
import { BAO_TUONG_DATA } from '../data/baotuongData';

describe('InteractivePosterView (Ảnh minh họa Poster Toàn Cảnh Tương Tác)', () => {
  it('hiển thị ảnh minh họa poster toàn cảnh và 5 nút tương tác trực tiếp trên poster', () => {
    const handleSelectSection = vi.fn();
    const handleOpenSectionQr = vi.fn();

    render(
      <InteractivePosterView
        config={BAO_TUONG_DATA}
        sections={BAO_TUONG_DATA.sections}
        onSelectSection={handleSelectSection}
        onOpenSectionQr={handleOpenSectionQr}
      />
    );

    // 1. Kiểm tra có hiển thị hình ảnh poster minh họa
    const posterImg = screen.getByTestId('interactive-poster-image');
    expect(posterImg).toBeInTheDocument();
    expect(posterImg).toHaveAttribute('src', '/posters/poster-toan-canh.jpg');

    // 2. Kiểm tra có 5 nút tương tác "NHẤP VÀO ĐÂY ĐỂ XEM" ứng với 5 chuyên mục
    const hotspotLoiNgo = screen.getByTestId('hotspot-loi-ngo');
    const hotspotTruyenNgan = screen.getByTestId('hotspot-truyen-ngan');
    const hotspotTho = screen.getByTestId('hotspot-tho');
    const hotspotMv = screen.getByTestId('hotspot-mv');
    const hotspotTriAn = screen.getByTestId('hotspot-tri-an');

    expect(hotspotLoiNgo).toBeInTheDocument();
    expect(hotspotTruyenNgan).toBeInTheDocument();
    expect(hotspotTho).toBeInTheDocument();
    expect(hotspotMv).toBeInTheDocument();
    expect(hotspotTriAn).toBeInTheDocument();

    // 3. Nhấp vào các nút mở đúng section id
    fireEvent.click(hotspotLoiNgo);
    expect(handleSelectSection).toHaveBeenCalledWith('loi-ngo');

    fireEvent.click(hotspotMv);
    expect(handleSelectSection).toHaveBeenCalledWith('mv');

    // 4. Đã loại bỏ thang điểm 100 theo yêu cầu và giữ lại ban biên tập chi đội
    expect(screen.queryByText(/Cấu Trúc Thang Điểm Thể Lệ/i)).toBeNull();
    expect(screen.getAllByText(/Chi đội 9A3/i).length).toBeGreaterThan(0);
  });
});
