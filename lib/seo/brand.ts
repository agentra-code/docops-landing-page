import type { Locale } from '@/i18n/routing'

/*
 * Nguồn duy nhất cho định danh thương hiệu mà công cụ tìm kiếm và mô hình AI đọc.
 *
 * `description` là CÂU MÔ TẢ CHUẨN: dùng nguyên văn cho meta description trang chủ, JSON-LD (WebSite,
 * SoftwareApplication), llms.txt và mọi hồ sơ bên ngoài (LinkedIn, Facebook, danh bạ phần mềm, bài báo).
 * Mô tả khác nhau trên mạng thì câu trả lời của AI cũng khác nhau: sửa ở đây, đừng viết lại ở chỗ khác.
 *
 * Bản đồ từ khoá (mỗi URL một chủ đề chính để các trang không tranh nhau; từ khoá chính đứng đầu):
 *   / · /en                                 phần mềm AI văn bản hành chính trường đại học; Agentra DocOps
 *   /soan-thao-van-ban-nghi-dinh-30         soạn thảo văn bản theo Nghị định 30, AI soạn thảo văn bản hành chính, mẫu văn bản Nghị định 30
 *   /ra-soat-can-cu-phap-ly                 rà soát căn cứ pháp lý, văn bản hết hiệu lực, đánh giá tác động khi văn bản thay đổi
 *   /tra-cuu-van-ban-ai                     tra cứu văn bản bằng AI, hỏi đáp văn bản có trích dẫn
 *   /chuyen-doi-so-van-thu-truong-dai-hoc   chuyển đổi số công tác văn thư trường đại học, AI cho phòng hành chính, đào tạo
 *   /ai-van-ban-co-quan-doanh-nghiep        phần mềm AI văn bản hành chính cho cơ quan, doanh nghiệp, AI cho văn thư doanh nghiệp, đoàn thể
 *   /cac-loai-van-ban-hanh-chinh            các loại văn bản hành chính, 29 loại văn bản theo Nghị định 30, chữ viết tắt tên loại văn bản
 *   /the-thuc-van-ban-hanh-chinh            thể thức văn bản hành chính, cách trình bày văn bản theo Nghị định 30, kiểm tra thể thức
 *   /docops-va-chatgpt                      dùng ChatGPT cho văn bản hành chính, DocOps và ChatGPT
 *   /tai-ve                                 tải DocOps cho Windows, macOS
 *   /huong-dan-cai-dat/{macos,windows}      cài DocOps trên Mac / Windows
 *   /quy-trinh                              quy trình xử lý văn bản bằng AI có cán bộ duyệt (human in the loop)
 *   /minh-bach-ai                           minh bạch AI, bảo mật dữ liệu văn bản
 * Anchor text của link nội bộ tới một trang = từ khoá chính của trang đó, và chỉ dùng cho trang đó.
 * Độ dài: <title> ≤ 60 ký tự kể cả hậu tố " · Agentra DocOps"; meta description 110–160 ký tự (tests/unit/content.test.ts).
 */
export const brand = {
  name: 'Agentra DocOps',
  alternateName: 'DocOps',
  /** Danh mục, đúng cách người tìm gọi tên loại sản phẩm này. */
  category: {
    vi: 'Phần mềm AI xử lý văn bản hành chính trường đại học',
    en: 'AI software for university administrative documents',
  },
  description: {
    vi: 'Agentra DocOps là phần mềm AI cho văn bản hành chính trường đại học, cơ quan, doanh nghiệp: tra cứu có trích dẫn, rà soát căn cứ, soạn nháp theo Nghị định 30.',
    en: 'Agentra DocOps is AI software for administrative documents at universities, agencies and companies: cited search, legal basis checks, Decree 30 drafting.',
  },
  /** "DocOps" còn là tên một phương pháp viết tài liệu kỹ thuật và một benchmark nghiên cứu: nói rõ để AI không nhầm. */
  disambiguation: {
    vi: 'Agentra DocOps (gọi tắt DocOps) là ứng dụng desktop của Agentra JSC (Đà Nẵng, Việt Nam), không phải phương pháp DocOps trong viết tài liệu kỹ thuật.',
    en: 'Agentra DocOps (DocOps for short) is a desktop app by Agentra JSC (Da Nang, Vietnam), not the DocOps documentation-as-code practice.',
  },
  /** Mô tả công ty, theo trang agentra.io.vn. */
  organization: {
    vi: 'Agentra JSC là công ty phát triển workflow AI cho giáo dục Việt Nam, trụ sở tại Đà Nẵng.',
    en: 'Agentra JSC builds AI workflows for Vietnamese education and is based in Da Nang, Vietnam.',
  },
  audience: {
    vi: 'Cán bộ văn thư, hành chính, đào tạo và pháp chế ở trường đại học, cao đẳng; văn thư, hành chính, pháp chế ở cơ quan, doanh nghiệp, tổ chức',
    en: 'Clerical, administrative, academic affairs and legal staff at universities and colleges; clerical, administrative and legal staff at agencies, companies and organizations',
  },
  /** Tính năng có thật trong ứng dụng; giữ đúng sự thật khi sản phẩm đổi. */
  features: {
    vi: [
      'Nạp văn bản PDF, kể cả bản quét: OCR từng trang, bóc số hiệu, ngày ký, cơ quan ban hành và trích yếu kèm độ tin cậy',
      'Phân loại theo 29 loại văn bản hành chính của Nghị định 30/2020/NĐ-CP',
      'Kiểm tra thể thức 9 thành phần của văn bản đã nạp, từ quốc hiệu, tiêu ngữ tới chữ ký và dấu',
      'Tìm kiếm toàn văn không cần gõ dấu và hỏi đáp chỉ dựa trên kho văn bản của đơn vị, trích dẫn số hiệu và Điều',
      'Rà soát căn cứ pháp lý bị thay thế, bãi bỏ hoặc chưa có hiệu lực, xem lại tại một ngày bất kỳ',
      'Đồ thị quan hệ pháp lý (căn cứ, hướng dẫn, sửa đổi, thay thế, bãi bỏ) và bán kính ảnh hưởng của từng Điều',
      'Soạn thảo 29 loại văn bản theo Nghị định 30 từ một câu ý chính, đánh dấu căn cứ hết hiệu lực, xuất Word và PDF',
      'Cán bộ chốt từng văn bản vào kho và duyệt quan hệ pháp lý; mọi quyết định ghi vào nhật ký không sửa được',
      'Kho văn bản lưu tại máy; mỗi đơn vị một key và một kho riêng; sao lưu và khôi phục tại máy',
    ],
    en: [
      'Ingest PDFs, scans included: page-by-page OCR and extraction of number, signing date, issuing body and summary with confidence scores',
      'Classification into the 29 administrative document types of Decree 30/2020/ND-CP',
      'Format check of 9 parts of an ingested document, from national title and motto to signature and seal',
      'Diacritic-insensitive full-text search and Q&A answered only from the institution repository, citing document number and article',
      'Review of legal bases that were replaced, repealed or are not yet in force, as of any chosen date',
      'Legal relationship graph (basis, guidance, amendment, replacement, repeal) and the impact radius of each article',
      'Drafting of the 29 Decree 30 document types from a one-sentence brief, with expired bases flagged and Word and PDF export',
      'Staff confirm each document into the repository and approve legal relations; every decision goes into an append-only audit trail',
      'The repository stays on your machine; one key and one separate repository per institution; local backup and restore',
    ],
  },
  keywords: {
    vi: [
      'phần mềm AI văn bản hành chính trường đại học',
      'Agentra DocOps',
      'trợ lý AI cho văn thư',
      'AI soạn thảo văn bản theo Nghị định 30',
      'rà soát căn cứ pháp lý',
      'tra cứu văn bản có trích dẫn',
      'phần mềm AI văn bản hành chính cho doanh nghiệp',
    ],
    en: [
      'AI software for university administrative documents',
      'Agentra DocOps',
      'AI assistant for clerical staff',
      'Decree 30 document drafting',
      'legal basis review',
      'cited document search',
      'administrative document AI for companies',
    ],
  },
} satisfies {
  name: string
  alternateName: string
  category: Record<Locale, string>
  description: Record<Locale, string>
  disambiguation: Record<Locale, string>
  organization: Record<Locale, string>
  audience: Record<Locale, string>
  features: Record<Locale, string[]>
  keywords: Record<Locale, string[]>
}
