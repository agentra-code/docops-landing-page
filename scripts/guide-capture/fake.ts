import { BODY, CITES, DOCS, EDGES, OUTSIDE, TODAY, UNIT, type Doc } from './world'
import { IPC_CONTRACT } from '@contracts/ipc'
import { docBodyOfPlainText } from '@contracts/docBody'
import { inboxByDocumentReply, inboxItem, journeyDocument } from '@testutils/gateFixtures'

type Handler = (params: any) => unknown
const ok = (data: unknown) => ({ ok: true, data })
const iso = (offsetMs: number) => new Date(Date.now() + offsetMs).toISOString()
const label = (d: Doc) => d.docNumber

/** Mutable bits a screenshot script flips before it clicks. */
export const state: { ingest: 'running' | 'idle'; agentOn: boolean; chat: 'empty' | 'answered' } = { ingest: 'idle', agentOn: true, chat: 'empty' }

// ── Warnings: which basis is dead, which documents lean on it ───────────────────────────────
const BASES = {
  'TT 08/2021/TT-BGDĐT': { replacedBy: 'TT 56/2026/TT-BGDĐT', reason: 'bị thay thế', fromDate: '2026-09-01' },
  'TT 17/2021/TT-BGDĐT': { replacedBy: 'TT 54/2026/TT-BGDĐT', reason: 'bị thay thế', fromDate: '2026-09-01' },
}
const WARN: Record<string, string[]> = {
  'QĐ 12/QĐ-ĐHM': ['TT 08/2021/TT-BGDĐT'],
  'QĐ 64/QĐ-ĐHM': ['TT 08/2021/TT-BGDĐT', 'TT 17/2021/TT-BGDĐT'],
  'QĐ 118/QĐ-ĐHM': ['TT 08/2021/TT-BGDĐT'],
  'KH 03/KH-ĐHM': ['TT 17/2021/TT-BGDĐT'],
}
const basisTotals: Record<string, number> = { 'QĐ 12/QĐ-ĐHM': 3, 'QĐ 64/QĐ-ĐHM': 3, 'QĐ 118/QĐ-ĐHM': 2, 'KH 03/KH-ĐHM': 2 }

function esc(t: string): string { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;') }
/** A page that LOOKS like a Vietnamese administrative document: national header, unit, title, grey text lines. */
function pageSvg(d: Doc | undefined, page: number): string {
  const lines: string[] = []
  let y = page === 1 ? 330 : 120
  for (let i = 0; i < (page === 1 ? 26 : 38); i++) {
    const w = 560 + ((i * 53) % 130) - (i % 7 === 6 ? 300 : 0)
    lines.push(`<rect x="110" y="${y}" width="${w}" height="9" rx="3" fill="#cfd3d0"/>`)
    y += 25
  }
  const head = page === 1 && d ? `
    <text x="110" y="92" font-size="13" font-weight="700" font-family="Times New Roman,serif" fill="#222">${esc(d.issuer.toUpperCase())}</text>
    <text x="110" y="112" font-size="13" font-family="Times New Roman,serif" fill="#222">Số: ${esc(d.docNumber)}</text>
    <text x="560" y="92" text-anchor="middle" font-size="12" font-weight="700" font-family="Times New Roman,serif" fill="#222">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</text>
    <text x="560" y="112" text-anchor="middle" font-size="12" font-weight="700" font-family="Times New Roman,serif" fill="#222">Độc lập – Tự do – Hạnh phúc</text>
    <text x="397" y="210" text-anchor="middle" font-size="19" font-weight="700" font-family="Times New Roman,serif" fill="#222">QUYẾT ĐỊNH</text>
    <text x="397" y="236" text-anchor="middle" font-size="14" font-family="Times New Roman,serif" fill="#222">${esc(d.subject.slice(0, 70))}</text>` : ''
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="794" height="1123" viewBox="0 0 794 1123"><rect width="794" height="1123" fill="#fff"/>${head}${lines.join('')}</svg>`)
}
const DRAFT_TEXT = [
  'Căn cứ Quy chế đào tạo trình độ đại học của Trường Đại học Mẫu ban hành kèm theo Quyết định số 12/QĐ-ĐHM ngày 15 tháng 3 năm 2022;',
  'Căn cứ Quy định xét công nhận tốt nghiệp đại học ban hành kèm theo Quyết định số 118/QĐ-ĐHM ngày 09 tháng 5 năm 2023;',
  'Xét đề nghị của Trưởng phòng Đào tạo,',
  'QUYẾT ĐỊNH:',
  'Điều 1. Thành lập Hội đồng xét công nhận tốt nghiệp đợt 2 năm 2026 của Trường Đại học Mẫu (sau đây gọi là Hội đồng) gồm các thành viên có tên trong danh sách kèm theo.',
  'Điều 2. Hội đồng có nhiệm vụ xét điều kiện tốt nghiệp của sinh viên, đề nghị Hiệu trưởng công nhận tốt nghiệp và cấp bằng cho sinh viên đủ điều kiện theo quy định hiện hành.',
  'Điều 3. Quyết định này có hiệu lực kể từ ngày ký. Trưởng các phòng, khoa và các thành viên Hội đồng chịu trách nhiệm thi hành Quyết định này.',
].join('\n')
const draft = {
  id: 2, docType: 'decision', parentAgency: 'BỘ GIÁO DỤC VÀ ĐÀO TẠO', issuer: 'TRƯỜNG ĐẠI HỌC MẪU', docNumber: '', place: 'Hà Nội',
  signedDate: '2026-10-18', subject: 'thành lập Hội đồng xét công nhận tốt nghiệp đợt 2 năm 2026', issuingAuthority: 'HIỆU TRƯỞNG TRƯỜNG ĐẠI HỌC MẪU',
  addressee: null, body: docBodyOfPlainText(DRAFT_TEXT), recipients: 'Như Điều 3;\nLưu: VT, ĐT.',
  intent: 'Thành lập Hội đồng xét công nhận tốt nghiệp đợt 2 năm 2026, giao Phòng Đào tạo làm đầu mối.',
  signerAuthority: 'KT.', signerTitle: 'PHÓ HIỆU TRƯỞNG', signerName: '', signer2Title: '', signer2Name: '', updatedAt: iso(-90_000),
}
let ingestStartedAt = Date.now() - 48_000
const norm = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase()
const hit = (snippet: string, word: string): Array<[number, number]> => {
  const out: Array<[number, number]> = []
  const s = norm(snippet), w = norm(word)
  for (let i = s.indexOf(w); i >= 0; i = s.indexOf(w, i + w.length)) out.push([i, i + w.length])
  return out
}
const docId = (n: string) => DOCS.find((d) => d.docNumber === n)!.id
function passageOf(docNumber: string, snippet: string, word: string, page: number, headingPath: string | null, passageId: number) {
  return { docNumber, documentId: docId(docNumber), label: docNumber, subject: DOCS.find((d) => d.docNumber === docNumber)!.subject,
    passageId, headingPath, page, kind: 'section' as const, snippet, matchRanges: hit(snippet, word) }
}
function searchFor(q: string) {
  const n = norm(q)
  if (n.includes('08/2021')) {
    const s = 'Căn cứ Thông tư số 08/2021/TT-BGDĐT ngày 18 tháng 3 năm 2021 của Bộ trưởng Bộ Giáo dục và Đào tạo ban hành Quy chế đào tạo trình độ đại học;'
    return {
      documents: [{ docNumber: 'TT 08/2021/TT-BGDĐT', subject: 'Ban hành Quy chế đào tạo trình độ đại học' }],
      legalBases: [{ docNumber: 'TT 08/2021/TT-BGDĐT', citingCount: 3 }],
      articles: [
        { docNumber: 'QĐ 12/QĐ-ĐHM', articleNo: 7, title: 'Tổ chức đào tạo theo tín chỉ', text: 'Việc tổ chức đào tạo theo hệ thống tín chỉ thực hiện theo quy định tại Thông tư số 08/2021/TT-BGDĐT và hướng dẫn của Nhà trường.' },
        { docNumber: 'QĐ 118/QĐ-ĐHM', articleNo: 2, title: 'Cơ sở xét công nhận tốt nghiệp', text: 'Việc xét công nhận tốt nghiệp căn cứ Điều 31 của Thông tư số 08/2021/TT-BGDĐT.' },
      ],
      elapsedMs: 7,
      passages: [
        passageOf('QĐ 12/QĐ-ĐHM', s, '08/2021', 1, 'Căn cứ', 101),
        passageOf('QĐ 64/QĐ-ĐHM', s, '08/2021', 1, 'Căn cứ', 202),
        passageOf('QĐ 118/QĐ-ĐHM', s, '08/2021', 1, 'Căn cứ', 303),
      ],
      passagesRelaxed: false, indexing: null,
    }
  }
  if (n.includes('tot nghiep')) {
    const s1 = 'Sinh viên được xét công nhận tốt nghiệp khi đã tích lũy đủ số tín chỉ của chương trình đào tạo, đạt chuẩn đầu ra ngoại ngữ và không đang trong thời gian bị kỷ luật.'
    const s2 = 'Điều kiện xét công nhận tốt nghiệp đối với sinh viên các khóa tuyển sinh từ năm 2019 thực hiện theo quy định tại Điều 3 của Quyết định này.'
    return {
      documents: [
        { docNumber: 'QĐ 118/QĐ-ĐHM', subject: 'Quy định xét công nhận tốt nghiệp đại học' },
        { docNumber: 'QĐ 64/QĐ-ĐHM', subject: 'Quy định về thực tập tốt nghiệp khối cử nhân' },
      ],
      legalBases: [],
      articles: [
        { docNumber: 'QĐ 118/QĐ-ĐHM', articleNo: 3, title: 'Điều kiện xét công nhận tốt nghiệp', text: s1 },
        { docNumber: 'QĐ 12/QĐ-ĐHM', articleNo: 24, title: 'Điều kiện tốt nghiệp và cấp bằng', text: 'Sinh viên được xét tốt nghiệp khi đáp ứng các điều kiện của Quy chế này và quy định của Bộ Giáo dục và Đào tạo.' },
      ],
      elapsedMs: 9,
      passages: [
        passageOf('QĐ 118/QĐ-ĐHM', s2, 'tốt nghiệp', 2, 'Điều 3', 311),
        passageOf('QĐ 12/QĐ-ĐHM', s1, 'tốt nghiệp', 11, 'Điều 24', 124),
      ],
      passagesRelaxed: false, indexing: null,
    }
  }
  return { documents: [], legalBases: [], articles: [], elapsedMs: 3, passages: [], passagesRelaxed: false, indexing: null }
}
const LIBRARY_BODY_HITS: Record<string, { passageId: number; page: number; headingPath: string; snippet: string }> = {
  'QĐ 12/QĐ-ĐHM': { passageId: 124, page: 11, headingPath: 'Điều 24', snippet: 'Sinh viên được xét công nhận tốt nghiệp khi đã tích lũy đủ số tín chỉ của chương trình đào tạo, đạt chuẩn đầu ra ngoại ngữ và không đang trong thời gian bị kỷ luật.' },
  'QĐ 118/QĐ-ĐHM': { passageId: 311, page: 2, headingPath: 'Điều 3', snippet: 'Điều kiện xét công nhận tốt nghiệp đối với sinh viên các khóa tuyển sinh từ năm 2019 thực hiện theo quy định tại Điều 3 của Quyết định này.' },
}
const T0 = '2026-10-18T09:38:00.000Z'
const turnBase = { attached: [], actions: [], notFound: [], droppedCitations: [], inputTokens: null, outputTokens: null, cacheWriteTokens: null, cacheReadTokens: null, elapsedMs: null, createdAt: T0 }
const chatTurns = () => state.chat === 'empty' ? [] : [
  { ...turnBase, id: 1, seq: 1, kind: 'user', text: 'Quy định về điều kiện xét tốt nghiệp nằm ở văn bản nào, Điều mấy?', citations: [] },
  { ...turnBase, id: 2, seq: 2, kind: 'assistant',
    text: 'Điều kiện xét công nhận tốt nghiệp nằm ở QĐ 118/QĐ-ĐHM, Điều 3 [ID:311]: sinh viên phải tích lũy đủ số tín chỉ của chương trình, đạt chuẩn đầu ra ngoại ngữ và không đang bị kỷ luật. Quy chế đào tạo QĐ 12/QĐ-ĐHM, Điều 24 [ID:124] quy định chung về tốt nghiệp và cấp bằng.\n\nCả hai văn bản đang dẫn Thông tư 08/2021/TT-BGDĐT, căn cứ này đã được thay bằng TT 56/2026/TT-BGDĐT, nên cần rà soát lại.',
    citations: [
      { docNumber: 'QĐ 118/QĐ-ĐHM', articleNo: 3, passageId: 311, page: 2, label: 'QĐ 118/QĐ-ĐHM' },
      { docNumber: 'QĐ 12/QĐ-ĐHM', articleNo: 24, passageId: 124, page: 11, label: 'QĐ 12/QĐ-ĐHM' },
    ],
    actions: [{ kind: 'open_review', arg: null, label: 'Mở Rà soát' }, { kind: 'open_graph', arg: 'QĐ 12/QĐ-ĐHM', label: 'Xem đồ thị QĐ 12/QĐ-ĐHM' }],
    inputTokens: 5210, outputTokens: 214, cacheWriteTokens: 0, cacheReadTokens: 3920, elapsedMs: 6400 },
]
export const handlers: Record<string, Handler> = {
  getSession: () => ok({ isActivated: true, unitName: UNIT, deviceRejected: false }),
  getStoreCounts: () => ok({ documents: DOCS.length, drafts: 3, conversations: 2, pageImages: 212 }),
  getBackendHealth: () => ok({ reachable: true, url: 'https://docops.agentra.io.vn' }),
  getProgress: () => ok({ analyzing: 0 }),
  getAnalysisProgress: () => ok({ rows: [] }),
  getUpdateState: () => ok({ appVersion: '1.3.0', enabled: true, status: 'current', version: null, percent: null, transferredBytes: null, totalBytes: null, message: null }),
  getFeedbackSentAt: () => ok({ sentAt: null }),
  getKeyRequestSentAt: () => ok({ sentAt: null }),
  getIngestErrorReport: () => ok({ report: null }),
  getTextLayerRepairPending: () => ok({ count: 0 }),
  getReanalyzeProgress: () => ok({ documentId: null, page: 0, pageCount: 0 }),
  getRelationReextractStatus: () => ok({ running: false, stopping: false }),
  recordActivity: () => ok({ turnId: 1 }),
  listConversations: () => ok({ conversations: state.chat === 'empty' ? [] : [{ id: 1, title: 'Điều kiện xét tốt nghiệp', updatedAt: T0, turnCount: 2 }] }),
  createConversation: () => ok({ id: 1 }),
  getConversation: () => ok({ id: 1, title: state.chat === 'empty' ? 'Cuộc trò chuyện mới' : 'Điều kiện xét tốt nghiệp', turns: chatTurns() }),
  search: (p: { query: string }) => ok(searchFor(p.query)),
  getReferenceTable: () => ok({ rows: [] }),
  readIngestQueue: () => {
    if (state.ingest === 'idle') return ok({ batchId: null, total: 0, done: 0, failed: 0, pending: 0, running: null, cancelling: false, waitingUntil: null, waitingMessage: null, items: [] })
    const startedAt = new Date(ingestStartedAt).toISOString()
    const running = { path: '/Users/van-thu/Documents/Quet/QD-301-ngoai-ngu.pdf', name: 'QD-301-ngoai-ngu.pdf', stage: 'ocr' as const, step: 'read' as const, startedAt, page: 4, pageCount: 9, pageStartedAt: new Date(ingestStartedAt + 36_000).toISOString() }
    const it = (name: string, st: string, docNumber: string | null = null, message: string | null = null) => ({ path: '/Users/van-thu/Documents/Quet/' + name, name, state: st as any, documentId: docNumber, docNumber, message })
    return ok({
      batchId: 'b-1', total: 4, done: 1, failed: 1, pending: 2, running, cancelling: false, waitingUntil: null, waitingMessage: null,
      items: [
        it('QD-205-van-ban-di-den.pdf', 'done', 'QĐ 205/QĐ-ĐHM'),
        it('HD-09-ren-luyen.pdf', 'failed', null, 'Không đọc được tệp — tệp có thể hỏng hoặc không phải PDF'),
        it('QD-301-ngoai-ngu.pdf', 'ocr', null, 'Đang đọc chữ từ ảnh (trang 4/9)'),
        it('CV-412-ke-hoach-giang-day.pdf', 'queued'),
      ],
    })
  },
  pickDocumentFiles: () => ok({ paths: ['/Users/van-thu/Documents/Quet/QD-301-ngoai-ngu.pdf'] }),
  ingestDocuments: () => { state.ingest = 'running'; ingestStartedAt = Date.now() - 48_000; return ok({ batchId: 'b-1', queued: 4 }) },

  getInbox: () => ok({
    items: [], waitingCount: 2,
    counts: { waiting: 2, in_progress: 0, decided: 5, auto_passed: 9, overdue: 0 },
    warnings: [],
  }),

  getOverview: () => {
    const byYear: Record<number, number> = {}
    const byType: Record<string, number> = {}
    for (const d of DOCS) {
      const y = Number(d.signedOn.slice(0, 4)); byYear[y] = (byYear[y] ?? 0) + 1
      byType[d.docType] = (byType[d.docType] ?? 0) + 1
    }
    const risks = Object.entries(WARN).map(([n, w]) => {
      const d = DOCS.find((x) => x.docNumber === n)!
      return { docNumber: n, docNumberLabel: n, subject: d.subject, warningCount: w.length, basisTotal: basisTotals[n]! }
    }).sort((a, b) => b.warningCount - a.warningCount).slice(0, 5)
    const events = Object.entries(BASES).map(([b, v]) => ({
      legalBasis: b, replacedBy: v.replacedBy, reason: v.reason, kind: 'replaced' as const,
      affectedDocuments: Object.values(WARN).filter((w) => w.includes(b)).length,
    }))
    return ok({
      totalDocuments: DOCS.length, needUrgentReview: Object.keys(WARN).length, expiredBases: Object.keys(BASES).length,
      awaitingConfirmation: 2, events, risks,
      byYear: Object.entries(byYear).map(([year, count]) => ({ year: Number(year), count })).sort((a, b) => a.year - b.year),
      byType: Object.entries(byType).map(([docType, count]) => ({ docType, count })).sort((a, b) => b.count - a.count),
      articleCount: 164, edgeCount: EDGES.length, reviewedCount: 6, unanalyzedCount: 2,
      inspected: { documents: DOCS.length - 2, edges: EDGES.length }, lastAnalyzedAt: iso(-3 * 3600_000),
    })
  },

  getUnitInfo: () => ok({ parentAgency: 'BỘ GIÁO DỤC VÀ ĐÀO TẠO', issuer: 'TRƯỜNG ĐẠI HỌC MẪU', place: 'Hà Nội', signerAuthority: 'KT.', signerTitle: 'PHÓ HIỆU TRƯỞNG', signerName: '' }),
  getKeyDevices: () => ok({
    status: 'active', unitName: UNIT, devicesInUse: 3, maxDevices: 10,
    devices: [
      { name: 'MAY-VANTHU-01', thisMachine: true, lastSeenAt: '2026-10-18T02:41:12.000Z' },
      { name: 'MAY-DAOTAO-02', thisMachine: false, lastSeenAt: '2026-10-17T21:20:48.000Z' },
      { name: 'MAY-PHONG-HCTH', thisMachine: false, lastSeenAt: '2026-10-15T01:03:27.000Z' },
    ],
  }),
  getStoreSize: () => ok({ imageBytes: 412_000_000, imageCount: 212, unconvertedBytes: 268_000_000, unconvertedCount: 131, savedBytes: 96_000_000, dbBytes: 18_400_000, estimatedAfterBytes: 188_000_000 }),
  getImageConversionStatus: () => ok({ running: false, stopping: false, done: 0, total: 0, failed: 0, savedBytes: 0, stopped: false }),
  getUsage: () => ok({ from: '2026-10-01', to: '2026-10-31', inputTokens: 1_842_310, outputTokens: 214_880, cacheWriteTokens: 96_400, cacheReadTokens: 1_120_500, amount: '186450' }),
  getAgentConnection: () => ok({
    enabled: state.agentOn, listening: state.agentOn ? { host: '127.0.0.1', port: 51234 } : null, problem: null,
    exportDir: '/Users/van-thu/Documents/DocOps-xuat', dailyCap: 200, usedToday: 14,
    claudeDesktopConfig: '{"mcpServers":{"docops":{"command":"/Applications/DocOps.app/Contents/MacOS/DocOps"}}}',
    claudeCodeCommand: 'claude mcp add docops -- /Applications/DocOps.app/Contents/MacOS/DocOps',
    recentCalls: [
      { at: iso(-12 * 60_000), client: 'Claude Desktop', tool: 'search_documents', title: 'Tìm văn bản', argsSummary: '"quy chế đào tạo"', resultCode: 'OK', durationMs: 84 },
      { at: iso(-9 * 60_000), client: 'Claude Desktop', tool: 'get_document', title: 'Đọc văn bản', argsSummary: 'QĐ 12/QĐ-ĐHM', resultCode: 'OK', durationMs: 31 },
      { at: iso(-2 * 3600_000), client: 'Claude Code', tool: 'list_warnings', title: 'Liệt kê cảnh báo hiệu lực', argsSummary: '', resultCode: 'OK', durationMs: 57 },
    ],
  }),
  getReview: (p: { asOfDate: string; filter: string }) => {
    const order = ['QĐ 64/QĐ-ĐHM', 'QĐ 12/QĐ-ĐHM', 'QĐ 118/QĐ-ĐHM', 'KH 03/KH-ĐHM']
    const rows = order.map((n) => {
      const d = DOCS.find((x) => x.docNumber === n)!
      const warnings = WARN[n]!.map((b) => ({
        warningType: 'basis_expired' as const, legalBasis: b, replacedBy: (BASES as any)[b].replacedBy,
        fromDate: (BASES as any)[b].fromDate, reason: (BASES as any)[b].reason, handled: false,
        sourceSentence: { text: CITES[n]!.find((c) => c.to === b)!.sentence, citedDocNumber: b },
      }))
      return { docNumber: n, subject: d.subject, signedOn: d.signedOn, issuer: d.issuer, unhandledCount: warnings.length, warnings }
    })
    return ok({ rows, inspected: { documents: DOCS.length - 2, edges: EDGES.length } })
  },
  getInboxByDocument: () => ok(inboxByDocumentReply([
    journeyDocument({ documentId: 'd-qd301', docNumberLabel: 'QĐ 301/QĐ-ĐHM', subject: DOCS.find((d) => d.id === 'd-qd301')!.subject,
      items: [inboxItem({ subjectId: 'd-qd301', gateCode: 'H2', summary: 'Duyệt vào kho — QĐ 301/QĐ-ĐHM', fieldsToDecide: 3, documentId: 'd-qd301', createdAt: iso(-20 * 3600_000) })] }),
    journeyDocument({ documentId: 'd-cv412', docNumberLabel: 'CV 412/ĐHM-ĐT', subject: DOCS.find((d) => d.id === 'd-cv412')!.subject,
      items: [inboxItem({ subjectId: 'd-cv412', gateCode: 'H2', summary: 'Duyệt vào kho — CV 412/ĐHM-ĐT', fieldsToDecide: 4, documentId: 'd-cv412', createdAt: iso(-20 * 3600_000) })] }),
  ], { warnings: [] }).data),
  getDocumentContent: (p: { docNumber?: string; documentId?: string }) => {
    const d = DOCS.find((x) => x.docNumber === p.docNumber || x.id === p.documentId)
    if (!d) return ok({ content: null })
    const text = BODY[d.docNumber] ?? [d.issuer.toUpperCase() + '\nSố: ' + d.docNumber, 'QUYẾT ĐỊNH\n' + d.subject, ...(CITES[d.docNumber] ?? []).map((c) => c.sentence), 'Điều 1. Ban hành kèm theo Quyết định này ' + d.subject.toLowerCase() + '.', 'Điều 2. Quyết định này có hiệu lực kể từ ngày ký.'].join('\n')
    return ok({ content: { id: d.id, docNumber: d.docNumber, subject: d.subject, readMode: d.readMode, pageCount: d.pages, textSource: 'full_text', articles: [], fullText: text } })
  },
  getGraph: () => {
    const expired = new Set(Object.keys(BASES))
    const nodes = [
      ...DOCS.filter((d) => d.status === 'complete').map((d) => ({
        docNumber: d.docNumber, subject: d.subject, outsideStore: false,
        validity: expired.has(d.docNumber) ? ('expired' as const) : ('in_force' as const),
        ...(expired.has(d.docNumber) ? { expiredOn: '2026-09-01' } : {}),
      })),
      ...Object.entries(OUTSIDE).map(([docNumber, subject]) => ({ docNumber, subject, outsideStore: true, validity: 'in_force' as const })),
    ]
    return ok({ nodes, edges: EDGES.map(([from, to]) => ({ from, to, relationType: 'CITES' as const })) })
  },
  getArticleRadius: () => ok({ articles: [], inspected: { articles: 164, citations: EDGES.length } }),
  openBlankDraft: () => ok({ id: 2 }),
  getDraft: (p: { id: number }) => ok({ draft: { ...draft, id: p.id } }),
  listDrafts: () => ok({ drafts: [
    { id: 2, docType: 'decision', docNumber: '', subject: draft.subject, signedDate: '2026-10-18', updatedAt: iso(-90_000) },
    { id: 3, docType: 'official_letter', docNumber: '', subject: 'đề nghị phối hợp tổ chức lễ tốt nghiệp', signedDate: '2026-10-15', updatedAt: iso(-3 * 86400_000) },
    { id: 4, docType: 'notice', docNumber: '', subject: 'lịch nghỉ lễ Quốc khánh', signedDate: '2026-08-28', updatedAt: iso(-50 * 86400_000) },
  ] }),
  saveDraft: () => ok({ updatedAt: iso(0) }),
  readDraftBases: () => ok({ bases: [
    { docNumber: 'QĐ 12/QĐ-ĐHM', block: 0, subject: 'Ban hành Quy chế đào tạo trình độ đại học', validity: 'in_force', replacedBy: null, fromDate: null, replacementSentence: null },
    { docNumber: 'QĐ 118/QĐ-ĐHM', block: 1, subject: 'Quy định xét công nhận tốt nghiệp đại học', validity: 'in_force', replacedBy: null, fromDate: null, replacementSentence: null },
  ] }),
  suggestLegalBasis: () => ok({ suggestions: [] }),
  listBackups: () => ok({ lastBackupAt: iso(-26 * 3600_000) }),
  getDocumentDetail: (p: { documentId?: string; docNumber?: string }) => {
    const d = DOCS.find((x) => x.id === p.documentId || x.docNumber === p.docNumber)
    if (!d) return { ok: false, code: 'NOT_FOUND', message: 'Không thấy văn bản' }
    return ok({
      id: d.id, docNumber: d.docNumber, docNumberLabel: label(d), subject: d.subject, docType: d.docType,
      signedOn: d.signedOn, issuer: d.issuer, signer: null, effectiveFrom: d.effectiveFrom, readMode: d.readMode,
      status: d.status, processingStatus: d.status === 'complete' ? 'done' : 'running', notRunReason: null, suspectReason: null,
      awaitingGate: d.awaitingGate ?? null, pageCount: d.pages, edges: { out: d.outEdges, in: d.inEdges }, duplicateOf: null,
    })
  },
  getPageImage: (p: { documentId: string; pageIndex: number }) => {
    const d = DOCS.find((x) => x.id === p.documentId)
    return ok({ mediaType: 'image/svg+xml', dataUrl: pageSvg(d, p.pageIndex), width: 794, height: 1123 })
  },
  listDocuments: (p: { filter: string; limit?: number | null }) => {
    let rows = [...DOCS].sort((a, b) => b.ingestedAt.localeCompare(a.ingestedAt))
    // `'all'` is the contract's own word for "do not filter" (the Overview band and the library's first read send it).
    const q = p.filter === 'all' ? '' : norm(p.filter ?? '').trim()
    const bodyHit = (d: Doc) => (q === 'tot nghiep' ? LIBRARY_BODY_HITS[d.docNumber] ?? null : null)
    if (q !== '') rows = rows.filter((d) => norm(d.docNumber + ' ' + d.subject).includes(q) || bodyHit(d) !== null)
    if (p.limit) rows = rows.slice(0, p.limit)
    return ok({
      rows: rows.map((d) => {
        const h = bodyHit(d)
        return {
          id: d.id, docNumber: d.docNumber, docNumberLabel: label(d), subject: d.subject, docType: d.docType,
          year: Number(d.signedOn.slice(0, 4)), status: d.status, notRunReason: null, suspectReason: null,
          awaitingGate: d.awaitingGate ?? null, ingestedAt: d.ingestedAt, relationsState: d.relationsState,
          openUnresolvedBases: 0,
          bodyMatch: h === null ? null : { passageId: h.passageId, page: h.page, headingPath: h.headingPath, snippet: h.snippet, matchRanges: hit(h.snippet, 'tốt nghiệp') },
        }
      }),
    })
  },
}

export function installFakeBridge(): void {
  const calls: Array<{ name: string; params: unknown }> = []
  const listeners: Array<(d: string) => void> = []
  ;(window as any).__calls = calls
  ;(window as any).__fake = state
  ;(window as any).__emit = (d: string) => listeners.forEach((l) => l(d))
  ;(window as any).docops = {
    invoke: async (name: string, params: unknown) => {
      calls.push({ name, params })
      const h = handlers[name]
      if (!h) { console.warn('[fake] NO HANDLER', name, JSON.stringify(params)); return { ok: false, code: 'NOT_FOUND', message: 'Không có lệnh này' } }
      // The renderer's own bridge validates the reply and turns a bad one into a quiet CONTRACT_MISMATCH screen;
      // say it LOUDLY here so the capture driver can refuse to photograph it.
      const contract = (IPC_CONTRACT as Record<string, { input: any; output: any }>)[name]
      const badIn = contract?.input.safeParse(params)
      if (badIn && !badIn.success) console.warn('[fake] BAD INPUT', name, JSON.stringify(badIn.error.issues.slice(0, 3)))
      const reply = h(params) as { ok: boolean; data?: unknown }
      if (reply.ok && contract) {
        const parsed = contract.output.safeParse(reply.data)
        if (!parsed.success) console.warn('[fake] CONTRACT MISMATCH', name, JSON.stringify(parsed.error.issues.slice(0, 3)))
      }
      return reply
    },
    onChanged: (l: (d: string) => void) => { listeners.push(l); return () => { listeners.splice(listeners.indexOf(l), 1) } },
  }
}
