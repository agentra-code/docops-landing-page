/** The made-up store behind every screenshot: one fictional university, no real person, no staff code. */
export const UNIT = 'Trường Đại học Mẫu'
export const TODAY = '2026-10-18'

export interface Doc {
  id: string
  docNumber: string
  subject: string
  docType: string
  signedOn: string
  effectiveFrom: string
  issuer: string
  pages: number
  status: 'complete' | 'analyzing' | 'awaiting_confirmation'
  ingestedAt: string
  outEdges: number
  inEdges: number
  readMode: 'lop_chu' | 'ocr'
  relationsState: 'extracted' | 'pending'
  awaitingGate?: string
}

const U = 'Trường Đại học Mẫu'
export const DOCS: Doc[] = [
  { id: 'd-qd12', docNumber: 'QĐ 12/QĐ-ĐHM', subject: 'Ban hành Quy chế đào tạo trình độ đại học', docType: 'QĐ', signedOn: '2022-03-15', effectiveFrom: '2022-04-01', issuer: U, pages: 24, status: 'complete', ingestedAt: '2026-10-12T08:41:00', outEdges: 3, inEdges: 2, readMode: 'ocr', relationsState: 'extracted' },
  { id: 'd-qd64', docNumber: 'QĐ 64/QĐ-ĐHM', subject: 'Quy định về thực tập tốt nghiệp khối cử nhân', docType: 'QĐ', signedOn: '2022-08-20', effectiveFrom: '2022-09-01', issuer: U, pages: 11, status: 'complete', ingestedAt: '2026-10-12T08:44:00', outEdges: 3, inEdges: 0, readMode: 'ocr', relationsState: 'extracted' },
  { id: 'd-qd118', docNumber: 'QĐ 118/QĐ-ĐHM', subject: 'Quy định xét công nhận tốt nghiệp đại học', docType: 'QĐ', signedOn: '2023-05-09', effectiveFrom: '2023-05-09', issuer: U, pages: 8, status: 'complete', ingestedAt: '2026-10-12T08:51:00', outEdges: 2, inEdges: 1, readMode: 'lop_chu', relationsState: 'extracted' },
  { id: 'd-qd205', docNumber: 'QĐ 205/QĐ-ĐHM', subject: 'Quy chế quản lý văn bản đi, văn bản đến', docType: 'QĐ', signedOn: '2023-11-02', effectiveFrom: '2023-12-01', issuer: U, pages: 9, status: 'complete', ingestedAt: '2026-10-13T09:10:00', outEdges: 2, inEdges: 0, readMode: 'lop_chu', relationsState: 'extracted' },
  { id: 'd-qd41', docNumber: 'QĐ 41/QĐ-ĐHM', subject: 'Quy chế tuyển sinh đại học chính quy', docType: 'QĐ', signedOn: '2024-02-27', effectiveFrom: '2024-03-15', issuer: U, pages: 18, status: 'complete', ingestedAt: '2026-10-13T09:22:00', outEdges: 2, inEdges: 0, readMode: 'lop_chu', relationsState: 'extracted' },
  { id: 'd-qd77', docNumber: 'QĐ 77/QĐ-ĐHM', subject: 'Quy định về học phí, miễn giảm và hỗ trợ sinh viên', docType: 'QĐ', signedOn: '2024-06-14', effectiveFrom: '2024-07-01', issuer: U, pages: 10, status: 'complete', ingestedAt: '2026-10-14T14:05:00', outEdges: 2, inEdges: 0, readMode: 'ocr', relationsState: 'extracted' },
  { id: 'd-hd09', docNumber: 'HD 09/HD-ĐHM', subject: 'Hướng dẫn đánh giá kết quả rèn luyện của sinh viên', docType: 'HD', signedOn: '2024-09-05', effectiveFrom: '2024-09-05', issuer: U, pages: 6, status: 'complete', ingestedAt: '2026-10-14T14:12:00', outEdges: 1, inEdges: 0, readMode: 'lop_chu', relationsState: 'extracted' },
  { id: 'd-kh03', docNumber: 'KH 03/KH-ĐHM', subject: 'Kế hoạch tổ chức đào tạo năm học 2025–2026', docType: 'KH', signedOn: '2025-08-12', effectiveFrom: '2025-08-12', issuer: U, pages: 14, status: 'complete', ingestedAt: '2026-10-15T10:30:00', outEdges: 2, inEdges: 0, readMode: 'lop_chu', relationsState: 'extracted' },
  { id: 'd-tb88', docNumber: 'TB 88/TB-ĐHM', subject: 'Thông báo lịch đăng ký học phần học kỳ 1 năm học 2026–2027', docType: 'TB', signedOn: '2026-08-04', effectiveFrom: '2026-08-04', issuer: U, pages: 2, status: 'complete', ingestedAt: '2026-10-15T10:41:00', outEdges: 1, inEdges: 0, readMode: 'lop_chu', relationsState: 'extracted' },
  { id: 'd-qd301', docNumber: 'QĐ 301/QĐ-ĐHM', subject: 'Quy định về đào tạo ngoại ngữ đối với sinh viên đại học', docType: 'QĐ', signedOn: '2026-09-22', effectiveFrom: '2026-10-01', issuer: U, pages: 7, status: 'complete', ingestedAt: '2026-10-17T15:20:00', outEdges: 0, inEdges: 0, readMode: 'ocr', relationsState: 'extracted' },
  { id: 'd-cv412', docNumber: 'CV 412/ĐHM-ĐT', subject: 'Về việc triển khai kế hoạch giảng dạy học kỳ 1', docType: 'CV', signedOn: '2026-09-08', effectiveFrom: '2026-09-08', issuer: U, pages: 3, status: 'awaiting_confirmation', ingestedAt: '2026-10-17T15:26:00', outEdges: 0, inEdges: 0, readMode: 'ocr', relationsState: 'pending' },
  // External bases that are IN the store. INVENTED: a made-up "Sở Mẫu" and "Bộ Mẫu" issue them, with numbers no real body uses.
  { id: 'd-qd05', docNumber: 'QĐ 05/QĐ-SMẪU', subject: 'Quy chế mẫu về đào tạo trình độ đại học', docType: 'QĐ', signedOn: '2021-03-18', effectiveFrom: '2021-05-05', issuer: 'Sở Mẫu', pages: 21, status: 'complete', ingestedAt: '2026-10-11T16:02:00', outEdges: 0, inEdges: 4, readMode: 'lop_chu', relationsState: 'extracted' },
  { id: 'd-hd12', docNumber: 'HD 12/HD-BMẪU', subject: 'Hướng dẫn mẫu về chuẩn chương trình đào tạo', docType: 'HD', signedOn: '2021-06-22', effectiveFrom: '2021-08-06', issuer: 'Bộ Mẫu', pages: 28, status: 'complete', ingestedAt: '2026-10-11T16:10:00', outEdges: 0, inEdges: 2, readMode: 'lop_chu', relationsState: 'extracted' },
  { id: 'd-qd09', docNumber: 'QĐ 09/QĐ-SMẪU', subject: 'Quy định mẫu về tổ chức đào tạo trình độ đại học', docType: 'QĐ', signedOn: '2019-12-30', effectiveFrom: '2019-12-30', issuer: 'Sở Mẫu', pages: 32, status: 'complete', ingestedAt: '2026-10-11T16:20:00', outEdges: 0, inEdges: 3, readMode: 'lop_chu', relationsState: 'extracted' },
  { id: 'd-hd03', docNumber: 'HD 03/HD-BMẪU', subject: 'Hướng dẫn mẫu về công tác văn thư', docType: 'HD', signedOn: '2020-03-05', effectiveFrom: '2020-03-05', issuer: 'Bộ Mẫu', pages: 19, status: 'complete', ingestedAt: '2026-10-11T16:31:00', outEdges: 0, inEdges: 2, readMode: 'lop_chu', relationsState: 'extracted' },
]

/** The citation sentences the "Căn cứ" lines of the own documents carry (the edges' `source_sentence`). */
export const CITES: Record<string, Array<{ to: string; sentence: string }>> = {
  'QĐ 12/QĐ-ĐHM': [
    { to: 'QĐ 05/QĐ-SMẪU', sentence: 'Căn cứ Quyết định số 05/QĐ-SMẪU ngày 18 tháng 3 năm 2021 của Sở Mẫu ban hành Quy chế mẫu về đào tạo trình độ đại học;' },
    { to: 'QĐ 09/QĐ-SMẪU', sentence: 'Căn cứ Quyết định số 09/QĐ-SMẪU ngày 30 tháng 12 năm 2019 của Sở Mẫu về tổ chức đào tạo trình độ đại học;' },
  ],
  'QĐ 64/QĐ-ĐHM': [
    { to: 'QĐ 05/QĐ-SMẪU', sentence: 'Căn cứ Quyết định số 05/QĐ-SMẪU ngày 18 tháng 3 năm 2021 của Sở Mẫu ban hành Quy chế mẫu về đào tạo trình độ đại học;' },
    { to: 'HD 12/HD-BMẪU', sentence: 'Căn cứ Hướng dẫn số 12/HD-BMẪU ngày 22 tháng 6 năm 2021 của Bộ Mẫu về chuẩn chương trình đào tạo;' },
  ],
  'QĐ 118/QĐ-ĐHM': [
    { to: 'QĐ 05/QĐ-SMẪU', sentence: 'Căn cứ Quyết định số 05/QĐ-SMẪU ngày 18 tháng 3 năm 2021 của Sở Mẫu ban hành Quy chế mẫu về đào tạo trình độ đại học;' },
  ],
  'KH 03/KH-ĐHM': [
    { to: 'HD 12/HD-BMẪU', sentence: 'Căn cứ Hướng dẫn số 12/HD-BMẪU ngày 22 tháng 6 năm 2021 của Bộ Mẫu về chuẩn chương trình đào tạo;' },
  ],
}

/** Body texts, written for the screenshots (made up; no real regulation is quoted). */
export const BODY: Record<string, string> = {
  'QĐ 64/QĐ-ĐHM': [
    'TRƯỜNG ĐẠI HỌC MẪU\nSố: 64/QĐ-ĐHM',
    'QUYẾT ĐỊNH\nVề việc ban hành Quy định về thực tập tốt nghiệp khối cử nhân',
    'HIỆU TRƯỞNG TRƯỜNG ĐẠI HỌC MẪU',
    CITES['QĐ 64/QĐ-ĐHM']![0]!.sentence,
    CITES['QĐ 64/QĐ-ĐHM']![1]!.sentence,
    'Căn cứ Quy chế đào tạo trình độ đại học của Trường Đại học Mẫu;',
    'Xét đề nghị của Trưởng phòng Đào tạo,',
    'QUYẾT ĐỊNH:',
    'Điều 1. Ban hành kèm theo Quyết định này Quy định về thực tập tốt nghiệp khối cử nhân của Trường Đại học Mẫu.',
    'Điều 2. Quyết định này có hiệu lực kể từ ngày 01 tháng 9 năm 2022 và áp dụng cho sinh viên các khóa tuyển sinh từ năm 2019.',
    'Điều 3. Trưởng các phòng, khoa và sinh viên có liên quan chịu trách nhiệm thi hành Quyết định này.',
  ].join('\n'),
}

/** Citation edges (from cites to). `to` may be a document that is NOT in the store. */
export const EDGES: Array<[string, string]> = [
  ['QĐ 12/QĐ-ĐHM', 'QĐ 05/QĐ-SMẪU'], ['QĐ 12/QĐ-ĐHM', 'QĐ 09/QĐ-SMẪU'], ['QĐ 12/QĐ-ĐHM', 'HD 12/HD-BMẪU'],
  ['QĐ 64/QĐ-ĐHM', 'QĐ 05/QĐ-SMẪU'], ['QĐ 64/QĐ-ĐHM', 'HD 12/HD-BMẪU'], ['QĐ 64/QĐ-ĐHM', 'QĐ 12/QĐ-ĐHM'],
  ['QĐ 118/QĐ-ĐHM', 'QĐ 05/QĐ-SMẪU'], ['QĐ 118/QĐ-ĐHM', 'QĐ 12/QĐ-ĐHM'],
  ['QĐ 205/QĐ-ĐHM', 'HD 03/HD-BMẪU'], ['QĐ 205/QĐ-ĐHM', 'QĐ 02/QĐ-SMẪU'],
  ['QĐ 41/QĐ-ĐHM', 'QĐ 09/QĐ-SMẪU'], ['QĐ 41/QĐ-ĐHM', 'HD 07/HD-BMẪU'],
  ['QĐ 77/QĐ-ĐHM', 'QĐ 21/QĐ-SMẪU'], ['QĐ 77/QĐ-ĐHM', 'QĐ 12/QĐ-ĐHM'],
  ['HD 09/HD-ĐHM', 'QĐ 12/QĐ-ĐHM'],
  ['KH 03/KH-ĐHM', 'HD 12/HD-BMẪU'], ['KH 03/KH-ĐHM', 'QĐ 41/QĐ-ĐHM'],
  ['TB 88/TB-ĐHM', 'KH 03/KH-ĐHM'],
]
/** Cited but never loaded: the graph draws them as "outside the store". */
export const OUTSIDE: Record<string, string> = {
  'QĐ 02/QĐ-SMẪU': 'Quy định mẫu về lưu trữ tài liệu',
  'HD 07/HD-BMẪU': 'Hướng dẫn mẫu về tuyển sinh đại học',
  'QĐ 21/QĐ-SMẪU': 'Quy định mẫu về thu và quản lý học phí',
}
for (const d of DOCS) {
  d.outEdges = EDGES.filter(([f]) => f === d.docNumber).length
  d.inEdges = EDGES.filter(([, t]) => t === d.docNumber).length
}
