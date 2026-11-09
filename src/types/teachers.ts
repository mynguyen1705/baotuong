export type TeacherAvatarTheme =
  | 'math'
  | 'literature'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'history'
  | 'custom';

export interface TeacherImpression {
  id: string;
  studentName: string;
  className: string;
  trait: string;
  detail: string;
  createdAt: string;
}

export interface TeacherProfile {
  id: string;
  subject: string;
  honorificAndName: string;
  badgeText: string;
  badgeSide: 'left' | 'right';
  summary: string;
  personalityTraits: string[];
  detailedBio: string;
  memorableQuote: string;
  photoUrl: string;
  avatarTheme: TeacherAvatarTheme;
  impressions: TeacherImpression[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherInput {
  subject: string;
  honorificAndName: string;
  badgeText: string;
  badgeSide?: 'left' | 'right';
  summary: string;
  personalityTraits?: string[];
  detailedBio?: string;
  memorableQuote?: string;
  photoUrl?: string;
  avatarTheme?: TeacherAvatarTheme;
}

export interface UpdateTeacherInput {
  subject?: string;
  honorificAndName?: string;
  badgeText?: string;
  badgeSide?: 'left' | 'right';
  summary?: string;
  personalityTraits?: string[];
  detailedBio?: string;
  memorableQuote?: string;
  photoUrl?: string;
}

export interface AddTeacherImpressionInput {
  studentName: string;
  className: string;
  trait: string;
  detail: string;
}

export type TeacherModalMode = 'board' | 'form' | 'detail';

export const DEFAULT_TEACHERS_SEED: TeacherProfile[] = [
  {
    id: 'teacher-math-nguyen-van-a',
    subject: 'TOÁN HỌC',
    honorificAndName: 'THẦY NGUYỄN VĂN A',
    badgeText: 'Siêu vui tính!',
    badgeSide: 'right',
    summary: 'Hay đùa nhưng cực kỳ nghiêm túc khi chấm bài',
    personalityTraits: ['Siêu vui tính', 'Logic & rõ ràng', 'Chấm bài tỉ mỉ', 'Hay đố vui toán học'],
    detailedBio:
      'Thầy Nguyễn Văn A luôn mở đầu tiết Toán của lớp 9A3 bằng những câu chuyện hài hước giúp cả lớp tỉnh táo, nhưng khi vào phần chứng minh hình học và đại số thì thầy hướng dẫn cực kỳ chặt chẽ và nghiêm túc.',
    memorableQuote: '“Sai một dấu trừ là đi một dặm, các em nhớ kiểm tra lại bài nhé!”',
    photoUrl: '',
    avatarTheme: 'math',
    impressions: [
      {
        id: 'imp-math-1',
        studentName: 'Tập thể 9A3',
        className: '9A3',
        trait: 'Siêu vui tính & tận tâm',
        detail: 'Nhờ những mẹo giải nhanh của thầy mà cả lớp hết sợ bài toán hình học không gian.',
        createdAt: '2026-11-01T08:00:00.000Z',
      },
    ],
    createdAt: '2026-11-01T08:00:00.000Z',
    updatedAt: '2026-11-01T08:00:00.000Z',
  },
  {
    id: 'teacher-lit-tran-thi-b',
    subject: 'NGỮ VĂN',
    honorificAndName: 'CÔ TRẦN THỊ B',
    badgeText: 'Nhẹ nhàng & ấm áp',
    badgeSide: 'right',
    summary: 'Giọng nói truyền cảm, rất hay kể chuyện văn học',
    personalityTraits: ['Nhẹ nhàng & ấm áp', 'Giọng đọc truyền cảm', 'Thấu hiểu học trò', 'Yêu thơ văn'],
    detailedBio:
      'Cô Trần Thị B có giọng giảng bài dịu dàng, ấm áp như nắng thu. Mỗi tác phẩm văn học qua lời kể của cô đều hiện lên sống động, dạy chúng em biết yêu thương, sẻ chia và trân trọng cuộc sống.',
    memorableQuote: '“Văn học là nhân học – mỗi trang viết đều bắt đầu từ trái tim chân thành.”',
    photoUrl: '',
    avatarTheme: 'literature',
    impressions: [
      {
        id: 'imp-lit-1',
        studentName: 'Tổ 1 - Lớp 9A3',
        className: '9A3',
        trait: 'Giọng nói ấm áp',
        detail: 'Mỗi khi cô đọc thơ cả lớp đều chăm chú lắng nghe, cảm giác rất bình yên.',
        createdAt: '2026-11-01T08:05:00.000Z',
      },
    ],
    createdAt: '2026-11-01T08:05:00.000Z',
    updatedAt: '2026-11-01T08:05:00.000Z',
  },
  {
    id: 'teacher-phys-le-van-c',
    subject: 'VẬT LÝ',
    honorificAndName: 'THẦY LÊ VĂN C',
    badgeText: 'Nhiều năng lượng!',
    badgeSide: 'left',
    summary: 'Luôn có những thí nghiệm bất ngờ và thú vị',
    personalityTraits: ['Nhiều năng lượng', 'Đam mê thí nghiệm', 'Giải thích thực tế', 'Nhiệt huyết'],
    detailedBio:
      'Thầy Lê Văn C luôn bước vào lớp với nụ cười rạng rỡ và chiếc hộp dụng cụ thí nghiệm đầy bất ngờ. Những định luật quang học, điện học trở nên vô cùng gần gũi qua các màn trình diễn trực quan của thầy.',
    memorableQuote: '“Vật lý ở ngay quanh chúng ta, hãy quan sát và đặt câu hỏi tại sao!”',
    photoUrl: '',
    avatarTheme: 'physics',
    impressions: [
      {
        id: 'imp-phys-1',
        studentName: 'Nhóm Yêu Khoa Học 9A3',
        className: '9A3',
        trait: 'Thí nghiệm cực cuốn',
        detail: 'Tiết Vật lý của thầy lúc nào cũng sôi nổi, ai cũng háo hức được lên làm thí nghiệm.',
        createdAt: '2026-11-01T08:10:00.000Z',
      },
    ],
    createdAt: '2026-11-01T08:10:00.000Z',
    updatedAt: '2026-11-01T08:10:00.000Z',
  },
  {
    id: 'teacher-chem-pham-thi-d',
    subject: 'HÓA HỌC',
    honorificAndName: 'CÔ PHẠM THỊ D',
    badgeText: 'Tỉ mỉ & dễ thương',
    badgeSide: 'right',
    summary: 'Thích sơ đồ tư duy và những bài thực hành vui nhộn',
    personalityTraits: ['Tỉ mỉ & dễ thương', 'Sơ đồ tư duy đẹp', 'Thực hành vui nhộn', 'Kiên nhẫn'],
    detailedBio:
      'Cô Phạm Thị D giúp lớp 9A3 hệ thống hóa các chuỗi phản ứng hóa học bằng những sơ đồ tư duy đầy màu sắc. Trong phòng thí nghiệm, cô luôn ân cần nhắc nhở an toàn và hướng dẫn từng ống nghiệm nhỏ.',
    memorableQuote: '“Nhớ cân bằng phương trình như cân bằng niềm vui mỗi ngày nhé các em!”',
    photoUrl: '',
    avatarTheme: 'chemistry',
    impressions: [
      {
        id: 'imp-chem-1',
        studentName: 'Tổ 2 - Lớp 9A3',
        className: '9A3',
        trait: 'Tỉ mỉ & kiên nhẫn',
        detail: 'Sơ đồ tư duy của cô vẽ trên bảng đẹp như tranh, nhìn vào là nhớ bài ngay.',
        createdAt: '2026-11-01T08:15:00.000Z',
      },
    ],
    createdAt: '2026-11-01T08:15:00.000Z',
    updatedAt: '2026-11-01T08:15:00.000Z',
  },
  {
    id: 'teacher-bio-mai-lan',
    subject: 'SINH HỌC',
    honorificAndName: 'CÔ MAI LAN',
    badgeText: 'Rất yêu thiên nhiên',
    badgeSide: 'left',
    summary: 'Mang cả khu vườn và thế giới động vật vào lớp học',
    personalityTraits: ['Rất yêu thiên nhiên', 'Gần gũi thân thiện', 'Kho tàng kiến thức sống', 'Truyền cảm hứng xanh'],
    detailedBio:
      'Cô Mai Lan biến mỗi giờ Sinh học thành một chuyến dã ngoại thu nhỏ. Từ cấu trúc chuỗi ADN, tế bào thực vật đến tập tính các loài động vật đều được cô minh họa vô cùng sinh động.',
    memorableQuote: '“Mỗi mầm xanh đều mang một sức sống kỳ diệu, giống như ước mơ của các em vậy.”',
    photoUrl: '',
    avatarTheme: 'biology',
    impressions: [
      {
        id: 'imp-bio-1',
        studentName: 'Tổ 3 - Lớp 9A3',
        className: '9A3',
        trait: 'Yêu cây cỏ & học trò',
        detail: 'Cô luôn khuyến khích lớp chăm sóc góc xanh hành lang và tìm hiểu thế giới tự nhiên.',
        createdAt: '2026-11-01T08:20:00.000Z',
      },
    ],
    createdAt: '2026-11-01T08:20:00.000Z',
    updatedAt: '2026-11-01T08:20:00.000Z',
  },
  {
    id: 'teacher-hist-quoc-khanh',
    subject: 'LỊCH SỬ',
    honorificAndName: 'THẦY QUỐC KHÁNH',
    badgeText: 'Người kể chuyện',
    badgeSide: 'right',
    summary: 'Biến các mốc lịch sử thành những câu chuyện ly kỳ',
    personalityTraits: ['Người kể chuyện', 'Giọng giảng hào hùng', 'Kiến thức sâu rộng', 'Truyền lửa tự hào'],
    detailedBio:
      'Thầy Quốc Khánh sở hữu phong thái đĩnh đạc và giọng kể chuyện đầy cuốn hút. Những mốc son lịch sử dân tộc không còn là con số khô khan mà trở thành thước phim sống động đầy tự hào.',
    memorableQuote: '“Hiểu lịch sử để thêm yêu quê hương và viết tiếp tương lai xứng đáng!”',
    photoUrl: '',
    avatarTheme: 'history',
    impressions: [
      {
        id: 'imp-hist-1',
        studentName: 'Tổ 4 - Lớp 9A3',
        className: '9A3',
        trait: 'Kể chuyện lịch sử cuốn hút',
        detail: 'Nghe thầy kể các chiến dịch lịch sử mà cả lớp nhớ hết các mốc năm ngay tại lớp.',
        createdAt: '2026-11-01T08:25:00.000Z',
      },
    ],
    createdAt: '2026-11-01T08:25:00.000Z',
    updatedAt: '2026-11-01T08:25:00.000Z',
  },
];

