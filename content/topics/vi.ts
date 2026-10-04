import type { TopicCopy, TopicId } from './index'

/*
 * Nội dung trang chủ đề tiếng Việt. Mọi câu phải đúng với ứng dụng (đối chiếu repo docops-application,
 * 2026-10-04): trích dẫn gồm số hiệu và Điều (không có trang, khoản); chỉ nạp PDF; cảnh báo hiệu lực khi căn cứ bị
 * thay thế, bãi bỏ hoặc chưa có hiệu lực (sửa đổi không gây cảnh báo); bản nháp không có bước duyệt trong app.
 * Sản phẩm đổi thì sửa ở đây trước, vì AI trả lời đúng theo những gì trang này viết.
 */
export const TOPICS_VI: Record<TopicId, TopicCopy> = {
  'legal-basis-review': {
    name: 'Rà soát căn cứ pháp lý',
    metaTitle: 'Rà soát căn cứ pháp lý hết hiệu lực bằng AI',
    description:
      'Rà soát căn cứ pháp lý bị thay thế, bãi bỏ hoặc chưa có hiệu lực trong văn bản của trường, xem tại một ngày bất kỳ và đánh giá tác động trước khi sửa.',
    keywords: ['rà soát căn cứ pháp lý', 'văn bản hết hiệu lực', 'kiểm tra hiệu lực văn bản', 'đánh giá tác động văn bản', 'đồ thị quan hệ pháp lý'],
    eyebrow: 'Văn bản hết hiệu lực',
    h1: 'Rà soát căn cứ pháp lý hết hiệu lực trong văn bản của trường',
    lead:
      'Khi Bộ ban hành thông tư mới, quy chế và quyết định của trường có thể đang đứng trên căn cứ đã bị thay thế. DocOps dò toàn bộ kho, chỉ ra văn bản nào cần sửa và vì sao, kèm câu gốc làm bằng chứng.',
    card: 'Tìm văn bản đang dựa trên căn cứ bị thay thế, bãi bỏ hoặc chưa có hiệu lực, và biết sửa một Điều thì kéo theo những gì.',
    inShort:
      'Rà soát căn cứ pháp lý là kiểm tra xem mỗi văn bản của đơn vị có đang viện dẫn văn bản đã bị thay thế, bãi bỏ hay chưa có hiệu lực không. DocOps làm việc này trên toàn kho, tính lại theo bất kỳ ngày nào bạn chọn, và đo trước một Điều đang được bao nhiêu chỗ trong kho dựa vào.',
    definition: {
      h2: 'Rà soát căn cứ pháp lý là gì?',
      term: 'Rà soát căn cứ pháp lý',
      rest: 'là việc đối chiếu các dòng "Căn cứ …" của một văn bản với hiệu lực hiện hành của văn bản được viện dẫn, để phát hiện căn cứ đã bị thay thế, bị bãi bỏ hoặc chưa có hiệu lực.',
      paras: [
        'Ở trường đại học, một thông tư của Bộ Giáo dục và Đào tạo có thể là căn cứ cho hàng chục văn bản nội bộ: quy chế đào tạo, quy định học vụ, quyết định thành lập hội đồng. Khi thông tư đó bị thay thế, các văn bản nội bộ không tự đổi theo. Việc dò lại bằng tay đòi hỏi nhớ văn bản nào dẫn văn bản nào, và thường chỉ được làm khi đã có sự cố.',
        'DocOps lưu mọi quan hệ giữa các văn bản trong kho thành một đồ thị, nên câu hỏi "văn bản nào đang đứng trên căn cứ cũ" trở thành một phép tra trên dữ liệu, không phải một cuộc tìm kiếm trong trí nhớ.',
      ],
    },
    imageAlt: 'Màn Rà soát của DocOps: danh sách văn bản, cảnh báo căn cứ bị bãi bỏ và căn cứ sắp thay đổi',
    table: {
      h2: 'Rà soát thủ công và rà soát bằng DocOps',
      caption: 'So sánh rà soát căn cứ pháp lý thủ công và bằng DocOps',
      head: ['Việc cần làm', 'Thủ công', 'Với DocOps'],
      rows: [
        ['Phát hiện căn cứ bị thay thế, bãi bỏ', 'Đọc lại từng văn bản, tra từng căn cứ', 'Cảnh báo tự động trên toàn kho ở màn Rà soát'],
        ['Căn cứ gián tiếp', 'Thường bị bỏ sót', 'Cảnh báo "Sắp thay đổi" khi căn cứ của căn cứ bị thay thế hoặc bãi bỏ (2 tầng)'],
        ['Xem hiệu lực tại một ngày', 'Tự suy ra từ ngày ban hành, ngày hiệu lực', 'Chọn ngày ở ô "Hiệu lực tại ngày", cảnh báo được tính lại'],
        ['Đánh giá tác động trước khi sửa', 'Ước lượng theo kinh nghiệm', 'Bán kính ảnh hưởng: đếm số dòng nghiệp vụ đang dựa vào từng Điều'],
        ['Bằng chứng', 'Ghi chú rời', 'Mỗi quan hệ giữ câu gốc trong văn bản đã sinh ra nó'],
      ],
    },
    blocks: [
      {
        h2: 'DocOps cảnh báo những gì',
        paras: ['Màn Rà soát gom cảnh báo của toàn kho, lọc theo ba nhóm: Căn cứ bị bãi bỏ, Sắp thay đổi và Đã xử lý.'],
        items: [
          { title: 'Căn cứ đã bị thay thế hoặc bãi bỏ', text: 'văn bản của bạn viện dẫn một văn bản mà trong kho đã có văn bản khác thay thế hoặc bãi bỏ nó.' },
          { title: 'Căn cứ sắp thay đổi', text: 'căn cứ trực tiếp vẫn còn hiệu lực, nhưng chính căn cứ của nó đã bị thay thế hoặc bãi bỏ. DocOps dò hai tầng như vậy.' },
          { title: 'Căn cứ chưa có hiệu lực', text: 'văn bản viện dẫn một văn bản chưa tới ngày hiệu lực tại ngày đang xem.' },
        ],
      },
      {
        h2: 'Đồ thị quan hệ pháp lý',
        paras: [
          'Khi nạp văn bản, DocOps đọc các câu dẫn chiếu và ghi lại năm loại quan hệ: căn cứ, hướng dẫn, sửa đổi, thay thế và bãi bỏ. Mỗi quan hệ giữ nguyên câu gốc đã sinh ra nó để cán bộ đối chiếu. Quan hệ có độ tin cậy từ 0,85 trở lên vào kho ngay; quan hệ thấp hơn chờ cán bộ duyệt.',
          'Ở màn Đồ thị, chế độ Tác động cho thấy với một văn bản đang chọn: nó đứng trên những văn bản nào và những văn bản nào đang kéo theo nó. Lưu ý: quan hệ sửa đổi được vẽ trên đồ thị nhưng không tự sinh cảnh báo, vì văn bản bị sửa đổi vẫn còn hiệu lực.',
        ],
      },
      {
        h2: 'Bán kính ảnh hưởng: sửa một Điều thì phải rà lại những gì',
        paras: [
          'Rà soát trả lời câu hỏi sau khi luật đã đổi. Bán kính ảnh hưởng trả lời câu hỏi trước khi đổi: một Điều đang gánh bao nhiêu nghĩa vụ, con số chốt (số tín chỉ, số năm, tỉ lệ, mức thu), cổng chặn và ngưỡng học vụ trong kho.',
          'DocOps đếm số dòng nghiệp vụ viện dẫn từng Điều và vẽ mỗi Điều thành một bong bóng; bong bóng càng to thì càng nhiều chỗ phải rà lại khi sửa. Phép đếm chạy tại máy, tất định, không gọi AI và không tốn token. Trên kho mẫu đi kèm sản phẩm (104 văn bản, 206 Điều, 280 quan hệ), Điều nặng nhất đang được 12 dòng nghiệp vụ viện dẫn.',
        ],
      },
      {
        h2: 'Phần nào dùng AI, phần nào chạy tại máy',
        items: [
          { title: 'Dùng AI', text: 'đọc văn bản, bóc các quan hệ dẫn chiếu và bốn lớp nghiệp vụ từ nội dung.' },
          { title: 'Chạy tại máy, không qua AI', text: 'cảnh báo hiệu lực, tính lại theo ngày, lan truyền tác động và bán kính ảnh hưởng. Cùng một kho thì luôn cho cùng một kết quả.' },
          { text: 'Câu hỏi bằng lời về một văn bản cụ thể được trả lời ở', link: { topic: 'ai-document-search' } },
          { text: 'Khi soạn văn bản mới, căn cứ đã hết hiệu lực được đánh dấu ngay trong bản nháp:', link: { topic: 'decree-30-drafting' } },
        ],
      },
      {
        h2: 'Bắt đầu rà soát kho văn bản của trường',
        ordered: true,
        items: [
          { text: 'Tải DocOps cho Windows hoặc macOS và kích hoạt bằng key của đơn vị.' },
          { text: 'Nạp các văn bản PDF đang dùng làm căn cứ: thông tư, quyết định của Bộ và văn bản nội bộ của trường.' },
          { text: 'Chốt từng văn bản vào kho và duyệt các quan hệ có độ tin cậy thấp.' },
          { text: 'Mở màn Rà soát, đặt "Hiệu lực tại ngày" và xử lý từng cảnh báo; đánh dấu Đã xử lý khi xong.' },
        ],
      },
    ],
    faq: [
      {
        q: 'DocOps biết một căn cứ đã hết hiệu lực bằng cách nào?',
        a: 'DocOps dựa trên quan hệ giữa các văn bản trong kho của đơn vị. Khi kho có văn bản thay thế hoặc bãi bỏ một căn cứ, mọi văn bản đang viện dẫn căn cứ đó được cảnh báo. Vì vậy cần nạp cả văn bản mới của Bộ vào kho.',
      },
      {
        q: 'Văn bản bị sửa đổi có bị cảnh báo không?',
        a: 'Không. Quan hệ sửa đổi được ghi và vẽ trên đồ thị, nhưng văn bản bị sửa đổi vẫn còn hiệu lực nên không sinh cảnh báo. DocOps chỉ cảnh báo khi căn cứ bị thay thế, bị bãi bỏ hoặc chưa có hiệu lực.',
      },
      {
        q: 'Có xem được tình trạng hiệu lực tại một ngày trong quá khứ không?',
        a: 'Có. Ô "Hiệu lực tại ngày" ở màn Rà soát và màn Đồ thị tính lại toàn bộ cảnh báo theo ngày bạn chọn.',
      },
      {
        q: 'Bán kính ảnh hưởng có dùng AI không?',
        a: 'Không. AI chỉ bóc các dòng nghiệp vụ từ văn bản lúc nạp. Phép đếm bán kính ảnh hưởng chạy tại máy, tất định và không tốn token.',
      },
      {
        q: 'Rà soát có thay cho ý kiến của bộ phận pháp chế không?',
        a: 'Không. DocOps chỉ ra văn bản nào cần xem và vì sao, kèm câu gốc làm bằng chứng. Quyết định sửa, thay hay bãi bỏ văn bản vẫn do cán bộ có thẩm quyền đưa ra.',
      },
    ],
    share: { title: 'Rà soát căn cứ pháp lý', subtitle: 'Tìm văn bản đang dựa trên căn cứ bị thay thế, bãi bỏ hoặc chưa có hiệu lực' },
  },

  'decree-30-drafting': {
    name: 'Soạn thảo văn bản theo Nghị định 30',
    metaTitle: 'Soạn thảo văn bản theo Nghị định 30 bằng AI',
    description:
      'Soạn thảo 29 loại văn bản hành chính theo Nghị định 30/2020/NĐ-CP từ một câu ý chính, tự điền thông tin đơn vị, đánh dấu căn cứ hết hiệu lực, xuất Word và PDF.',
    keywords: ['soạn thảo văn bản theo Nghị định 30', 'AI soạn thảo văn bản hành chính', 'thể thức văn bản hành chính', 'mẫu văn bản Nghị định 30', 'kiểm tra thể thức văn bản'],
    eyebrow: 'AI soạn thảo văn bản hành chính',
    h1: 'Soạn thảo văn bản theo Nghị định 30 bằng AI, cán bộ sửa và ký',
    lead:
      'Viết một câu ý chính, DocOps viết cả văn bản trên trang A4 đúng thể thức Nghị định 30/2020/NĐ-CP. Căn cứ đã hết hiệu lực được đánh dấu ngay trong bản nháp, rồi xuất ra Word hoặc PDF.',
    card: 'Từ một câu ý chính ra bản nháp đúng thể thức cho 29 loại văn bản, căn cứ hết hiệu lực được đánh dấu, xuất Word và PDF.',
    inShort:
      'DocOps soạn được cả 29 loại văn bản hành chính của Nghị định 30/2020/NĐ-CP. Bạn viết ý chính, AI viết bản nháp, bạn sửa như trong Word. Thông tin đơn vị tự điền, căn cứ hết hiệu lực được gắn nhãn, và văn bản xuất ra Word hoặc PDF để đưa vào quy trình ký hiện có.',
    definition: {
      h2: 'Soạn thảo văn bản theo Nghị định 30 là gì?',
      term: 'Soạn thảo văn bản theo Nghị định 30',
      rest: 'là trình bày văn bản hành chính đúng thể thức và kỹ thuật quy định tại Nghị định 30/2020/NĐ-CP ngày 05/3/2020 của Chính phủ về công tác văn thư: quốc hiệu và tiêu ngữ, tên cơ quan, số và ký hiệu, địa danh và ngày tháng, tên loại và trích yếu, nội dung, chữ ký, dấu và nơi nhận.',
      paras: [
        'Điều 7 của Nghị định liệt kê 29 loại văn bản hành chính, từ nghị quyết cá biệt, quyết định, chỉ thị tới công văn, tờ trình, thông báo, kế hoạch, báo cáo, biên bản, hợp đồng, giấy mời và công điện. Cái khó khi soạn không nằm ở mẫu, mà ở hai chỗ: viết đúng giọng hành chính cho từng loại, và viện dẫn căn cứ còn hiệu lực.',
      ],
    },
    imageAlt: 'Màn Soạn thảo của DocOps: bản nháp văn bản hành chính trên trang A4 và nhãn hiệu lực của từng dòng căn cứ',
    table: {
      h2: 'Soạn theo mẫu bằng tay và soạn với DocOps',
      caption: 'So sánh soạn văn bản hành chính bằng tay và bằng DocOps',
      head: ['Bước', 'Soạn bằng tay', 'Với DocOps'],
      rows: [
        ['Điểm bắt đầu', 'Mở văn bản cũ, sửa lại', 'Một câu ý chính, bấm "Viết"'],
        ['Phần thể thức của đơn vị', 'Gõ lại từng lần', 'Tự điền từ Thông tin đơn vị: cơ quan chủ quản, cơ quan ban hành, địa danh, thẩm quyền ký, chức vụ, họ tên'],
        ['Căn cứ pháp lý', 'Chép từ văn bản cũ, dễ dẫn căn cứ đã hết hiệu lực', 'Căn cứ hết hiệu lực không được đưa cho AI; từng dòng căn cứ có nhãn hiệu lực'],
        ['Ô còn trống', 'Tự soát', 'Danh sách "Còn trống" chỉ ra trường chưa điền'],
        ['Đầu ra', 'Tệp Word', 'Word (.docx) hoặc PDF'],
      ],
    },
    blocks: [
      {
        h2: 'Cách DocOps soạn một văn bản',
        ordered: true,
        items: [
          { text: 'Chọn loại văn bản trong 29 loại của Nghị định 30.' },
          { text: 'Viết ý chính trong một câu, ví dụ mục đích của quyết định và đối tượng áp dụng, rồi bấm "Viết".' },
          { text: 'AI viết toàn bộ văn bản trên trang A4; thông tin đơn vị lấy từ Cài đặt, Thông tin đơn vị.' },
          { text: 'Sửa trực tiếp như trong Word; danh sách "Còn trống" nhắc những chỗ chưa điền.' },
          { text: 'Xuất ra Word hoặc PDF để trình ký theo quy trình của đơn vị.' },
        ],
      },
      {
        h2: 'Căn cứ còn hiệu lực ngay từ bản nháp',
        paras: [
          'Trước khi viết, DocOps loại khỏi dữ liệu gửi cho AI những căn cứ đã hết hiệu lực hoặc sắp thay đổi trong kho của đơn vị. Sau khi viết, mỗi dòng "Căn cứ …" trong văn bản được gắn một nhãn: Còn hiệu lực, Hết hiệu lực, Sắp thay đổi hoặc Không có trong kho.',
          'Dòng căn cứ hết hiệu lực được tô vàng kèm hai nút: "Thay câu căn cứ" để chèn căn cứ thay thế, hoặc "Bỏ dòng". Văn bản vẫn xuất được, nên cán bộ là người quyết định cuối cùng.',
        ],
        items: [{ text: 'Cách DocOps biết căn cứ nào hết hiệu lực được giải thích ở trang', link: { topic: 'legal-basis-review' } }],
      },
      {
        h2: 'Đưa văn bản Word có sẵn vào',
        paras: [
          'Có thể nhập một tệp .docx vào bản nháp để tiếp tục sửa trong DocOps, và tuỳ chọn "Nhờ AI trình bày lại" để đưa văn bản về đúng bố cục.',
        ],
      },
      {
        h2: 'Kiểm tra thể thức văn bản đến',
        paras: [
          'Với văn bản đã nạp vào kho, DocOps kiểm tra 9 thành phần thể thức: quốc hiệu, tiêu ngữ, tên cơ quan, số hiệu, địa danh và ngày tháng, trích yếu, nơi nhận, chữ ký và dấu. Mỗi thành phần được đánh giá đạt, thiếu hoặc cần xem, cùng một kết luận chung đạt, cần xem hoặc không đạt.',
        ],
        items: [{ text: 'Khi cần tìm một quy định để viện dẫn, hỏi thẳng kho văn bản ở trang', link: { topic: 'ai-document-search' } }],
      },
    ],
    faq: [
      {
        q: 'DocOps soạn được những loại văn bản nào?',
        a: 'Cả 29 loại văn bản hành chính tại Điều 7 Nghị định 30/2020/NĐ-CP, trong đó có quyết định, công văn, tờ trình, thông báo, kế hoạch, báo cáo, biên bản, hợp đồng, giấy mời và công điện.',
      },
      {
        q: 'Văn bản soạn xong xuất ra định dạng gì?',
        a: 'Word (.docx) hoặc PDF. Văn bản Word có sẵn cũng nhập được vào DocOps để sửa tiếp.',
      },
      {
        q: 'AI có tự ban hành văn bản không?',
        a: 'Không. DocOps chỉ viết bản nháp trong ứng dụng. Cán bộ sửa nội dung, xuất tệp và trình ký theo quy trình của đơn vị.',
      },
      {
        q: 'Nếu bản nháp viện dẫn căn cứ đã hết hiệu lực thì sao?',
        a: 'Dòng căn cứ đó được gắn nhãn Hết hiệu lực và tô vàng, kèm nút "Thay câu căn cứ" hoặc "Bỏ dòng". Nhãn dựa trên các văn bản có trong kho của đơn vị.',
      },
      {
        q: 'Thông tin đơn vị trên văn bản lấy từ đâu?',
        a: 'Từ mục Thông tin đơn vị trong Cài đặt: cơ quan chủ quản, cơ quan ban hành, địa danh, thẩm quyền ký, chức vụ và họ tên người ký. Điền một lần, mọi bản nháp dùng lại.',
      },
    ],
    share: { title: 'Soạn văn bản theo NĐ 30', subtitle: '29 loại văn bản hành chính, căn cứ hết hiệu lực được đánh dấu, xuất Word và PDF' },
  },

  'ai-document-search': {
    name: 'Tra cứu văn bản bằng AI',
    metaTitle: 'Tra cứu văn bản bằng AI, có trích dẫn nguồn',
    description:
      'Hỏi bằng lời trên kho văn bản của trường, nhận câu trả lời trích dẫn số hiệu và Điều. Tìm toàn văn không cần gõ dấu, 10.000 văn bản trong 0,01 giây.',
    keywords: ['tra cứu văn bản bằng AI', 'hỏi đáp văn bản có trích dẫn', 'tìm kiếm văn bản nội bộ', 'tra cứu quy chế trường đại học', 'tìm văn bản không dấu'],
    eyebrow: 'Hỏi đáp có trích dẫn',
    h1: 'Tra cứu văn bản bằng AI, mỗi câu trả lời đều chỉ ra số hiệu và Điều',
    lead:
      'Hỏi DocOps như hỏi một đồng nghiệp nắm hết quy chế của trường. Câu trả lời chỉ lấy từ kho văn bản của đơn vị, dẫn đúng số hiệu và Điều, bấm vào là mở văn bản gốc.',
    card: 'Hỏi bằng lời trên kho văn bản của trường, câu trả lời dẫn số hiệu và Điều; tìm toàn văn không cần gõ dấu.',
    inShort:
      'DocOps có hai cách tra cứu: tìm toàn văn không cần gõ dấu, và hỏi đáp bằng ngôn ngữ tự nhiên. Câu trả lời chỉ dựa trên kho văn bản của đơn vị, trích dẫn số hiệu và Điều, và nói rõ khi kho chưa có văn bản cần thiết thay vì đoán.',
    definition: {
      h2: 'Tra cứu văn bản bằng AI là gì?',
      term: 'Tra cứu văn bản bằng AI',
      rest: 'là đặt câu hỏi bằng lời thường trên một kho văn bản và nhận câu trả lời tổng hợp từ chính các văn bản đó, kèm trích dẫn để kiểm tra lại.',
      paras: [
        'Khác với chatbot đa dụng, công cụ tra cứu văn bản hành chính chỉ có giá trị khi trả lời được bằng văn bản của chính đơn vị và chỉ ra nguồn. Một con số chốt như số tín chỉ tối thiểu hay mức thu phải đến từ một Điều cụ thể của một văn bản còn hiệu lực, không đến từ trí nhớ của mô hình.',
      ],
    },
    imageAlt: 'Màn Tra cứu của DocOps: kết quả tìm kiếm và cột hỏi đáp với trích dẫn số hiệu, Điều',
    table: {
      h2: 'Thư mục chung, chatbot đa dụng và DocOps',
      caption: 'So sánh cách tra cứu văn bản: thư mục chung, chatbot đa dụng và DocOps',
      head: ['Tiêu chí', 'Thư mục chung', 'Chatbot đa dụng', 'DocOps'],
      rows: [
        ['Nguồn trả lời', 'Người đọc tự tìm', 'Dữ liệu huấn luyện của mô hình', 'Chỉ kho văn bản của đơn vị'],
        ['Trích dẫn', 'Không có', 'Thường không có hoặc không kiểm được', 'Số hiệu và Điều, bấm để mở văn bản'],
        ['Khi không có nguồn', 'Không biết', 'Có thể tự đoán', 'Báo "Chưa tìm thấy trong kho"'],
        ['Tìm không dấu', 'Tuỳ công cụ', 'Có', 'Có, "dinh" khớp "định"'],
      ],
    },
    blocks: [
      {
        h2: 'Hai cách tra cứu trong DocOps',
        items: [
          {
            title: 'Tìm toàn văn',
            text: 'tìm trên số hiệu, nội dung và điều khoản, không cần gõ dấu. Trên máy thử với 10.000 văn bản và 200.000 Điều, một lượt tìm mất khoảng 0,01 giây. Phím tắt ⌘K (Ctrl K trên Windows) mở ô tìm nhanh ở mọi màn hình.',
          },
          {
            title: 'Hỏi đáp',
            text: 'cột bên phải màn Tra cứu là một cuộc trò chuyện chỉ dựa trên kho của đơn vị. AI được yêu cầu không dẫn văn bản ngoài kho và không bịa con số.',
          },
        ],
      },
      {
        h2: 'Trích dẫn trông như thế nào',
        paras: [
          'Mỗi câu trả lời kèm trích dẫn dạng "Đ.3 · 45/2023/TT-BGDĐT": số hiệu văn bản và Điều được viện dẫn. Bấm vào trích dẫn để mở đúng văn bản đó. Mỗi câu trả lời cũng ghi số token đã dùng và thời gian trả lời.',
          'Khi kho thiếu văn bản cần thiết, DocOps nói rõ "Chưa tìm thấy trong kho" và liệt kê văn bản được nhắc tới nhưng chưa có trong kho, để cán bộ biết cần nạp thêm gì.',
        ],
      },
      {
        h2: 'Tra theo lớp nghiệp vụ',
        paras: [
          'Ngoài kết quả tìm kiếm, màn Tra cứu có các thẻ Ngưỡng và con số, Cổng chặn và Việc theo đơn vị. Đây là các dòng nghiệp vụ AI đã bóc từ văn bản lúc nạp, mỗi dòng ghi rõ lấy từ Điều nào của văn bản nào. Phòng đào tạo có thể xem ngay mọi ngưỡng học vụ và con số chốt mà không phải mở từng quy chế.',
        ],
        items: [{ text: 'Các dòng nghiệp vụ này cũng là đầu vào cho bán kính ảnh hưởng ở trang', link: { topic: 'legal-basis-review' } }],
      },
      {
        h2: 'Kho văn bản đến từ đâu',
        paras: [
          'Câu trả lời chỉ tốt bằng kho văn bản. DocOps nạp văn bản PDF, kể cả bản quét: trang có lớp chữ được đọc trực tiếp, trang quét được AI nhận dạng từng trang. Số hiệu, ngày ký, cơ quan ban hành và trích yếu được bóc kèm độ tin cậy, rồi cán bộ chốt văn bản vào kho.',
        ],
        items: [{ text: 'Cách một trường xây kho này từ đầu được mô tả ở trang', link: { topic: 'ai-for-universities' } }],
      },
    ],
    faq: [
      {
        q: 'DocOps trả lời dựa trên nguồn nào?',
        a: 'Chỉ dựa trên kho văn bản của đơn vị bạn. AI được yêu cầu không dẫn văn bản ngoài kho và không bịa con số; mỗi câu trả lời kèm trích dẫn số hiệu và Điều.',
      },
      {
        q: 'Nếu kho chưa có văn bản để trả lời thì sao?',
        a: 'DocOps báo "Chưa tìm thấy trong kho" và liệt kê văn bản được nhắc tới nhưng chưa có trong kho, thay vì tự đoán câu trả lời.',
      },
      {
        q: 'Có cần gõ tiếng Việt có dấu khi tìm không?',
        a: 'Không. Tìm toàn văn khớp cả khi gõ không dấu, ví dụ "dinh" khớp "định".',
      },
      {
        q: 'Tìm kiếm có nhanh với kho lớn không?',
        a: 'Trên máy thử với 10.000 văn bản và 200.000 Điều, một lượt tìm toàn văn mất khoảng 0,01 giây.',
      },
      {
        q: 'Câu hỏi và kho văn bản có rời khỏi máy không?',
        a: 'Kho văn bản và lịch sử hỏi đáp lưu tại máy. Khi hỏi, DocOps gửi kèm câu hỏi một gói ngữ cảnh trích từ kho qua máy chủ DocOps tới nhà cung cấp mô hình AI để tạo câu trả lời.',
      },
    ],
    share: { title: 'Tra cứu văn bản bằng AI', subtitle: 'Câu trả lời chỉ từ kho của trường, trích dẫn số hiệu và Điều' },
  },

  'ai-for-universities': {
    name: 'Chuyển đổi số văn thư trường đại học',
    metaTitle: 'Chuyển đổi số văn thư trường đại học với AI',
    description:
      'Chuyển đổi số công tác văn thư ở trường đại học: biến văn bản PDF thành kho tri thức có cấu trúc, quan hệ pháp lý và tra cứu có trích dẫn cho từng phòng ban.',
    keywords: ['chuyển đổi số văn thư trường đại học', 'ứng dụng AI trong quản lý văn bản trường đại học', 'số hoá văn bản hành chính', 'AI cho phòng đào tạo', 'kho văn bản trường đại học'],
    eyebrow: 'Giải pháp cho trường đại học',
    h1: 'Chuyển đổi số công tác văn thư trường đại học, từ thư mục PDF tới kho tri thức',
    lead:
      'Số hoá không dừng ở việc quét văn bản. DocOps biến văn bản PDF của trường thành một kho có số hiệu, hiệu lực, quan hệ pháp lý và các con số chốt, để mỗi phòng ban tra được điều mình cần.',
    card: 'Biến thư mục PDF thành kho tri thức có cấu trúc, để văn thư, phòng đào tạo, pháp chế và lãnh đạo tra được điều mình cần.',
    inShort:
      'Với DocOps, chuyển đổi số văn thư nghĩa là mỗi văn bản được bóc số hiệu, ngày ký, cơ quan ban hành, trích yếu, loại văn bản, quan hệ với văn bản khác và các dòng nghiệp vụ. Kho này nằm trên máy của trường, tích luỹ theo năm, và không mất đi khi cán bộ nghỉ hưu hay chuyển công tác.',
    definition: {
      h2: 'Chuyển đổi số công tác văn thư là gì?',
      term: 'Chuyển đổi số công tác văn thư',
      rest: 'là chuyển việc tiếp nhận, lưu trữ, tra cứu và soạn thảo văn bản từ giấy và tệp rời sang dữ liệu có cấu trúc mà máy đọc và đối chiếu được, chứ không chỉ là bản chụp của văn bản giấy.',
      paras: [
        'Một trường đại học làm việc với ba lớp văn bản: văn bản của Bộ Giáo dục và Đào tạo và các bộ ngành, văn bản nội bộ ban hành dựa trên đó, và văn bản đi đến hằng ngày. Quan hệ giữa ba lớp này thường chỉ nằm trong đầu một vài cán bộ lâu năm. Khi họ nghỉ, trường mất luôn bản đồ đó.',
      ],
    },
    imageAlt: 'Màn Kho văn bản của DocOps: danh sách văn bản đã nạp với số hiệu, loại văn bản và trạng thái',
    table: {
      h2: 'Quét văn bản và xây kho tri thức',
      caption: 'So sánh số hoá bằng cách quét và kho tri thức của DocOps',
      head: ['Khía cạnh', 'Chỉ quét lưu PDF', 'Kho tri thức DocOps'],
      rows: [
        ['Thông tin của văn bản', 'Tên tệp do người đặt', 'Số hiệu, ngày ký, cơ quan ban hành, trích yếu, loại văn bản'],
        ['Quan hệ giữa văn bản', 'Không có', 'Căn cứ, hướng dẫn, sửa đổi, thay thế, bãi bỏ, kèm câu gốc'],
        ['Con số và ngưỡng', 'Phải mở từng tệp', 'Ngưỡng và con số, cổng chặn, việc theo đơn vị tra được ngay'],
        ['Tra cứu', 'Tìm theo tên tệp', 'Tìm toàn văn không dấu và hỏi đáp có trích dẫn'],
        ['Khi cán bộ nghỉ', 'Mất bản đồ quan hệ', 'Kho, đồ thị và tệp sao lưu ở lại với đơn vị'],
      ],
    },
    blocks: [
      {
        h2: 'Mỗi phòng ban dùng DocOps thế nào',
        items: [
          { title: 'Văn thư, Tổ chức – Hành chính', text: 'nạp văn bản PDF, kiểm tra 9 thành phần thể thức của văn bản đến, giữ kho đúng và đủ.' },
          { title: 'Phòng Đào tạo', text: 'tra mọi ngưỡng học vụ và con số chốt theo quy chế đang hiệu lực; trước khi sửa một quy chế, xem Điều nào đang gánh nhiều quy định nhất.' },
          { title: 'Pháp chế', text: 'rà các văn bản nội bộ đang dựa trên căn cứ bị thay thế hoặc bãi bỏ, xem hiệu lực tại một ngày.', link: { topic: 'legal-basis-review' } },
          { title: 'Lãnh đạo và chuyên viên', text: 'hỏi bằng lời và nhận câu trả lời dẫn số hiệu, Điều; soạn tờ trình, quyết định đúng thể thức.', link: { topic: 'decree-30-drafting' } },
        ],
      },
      {
        h2: 'Cán bộ chốt dữ liệu, AI làm phần đọc',
        paras: [
          'AI đọc văn bản (nhận dạng trang quét, bóc thông tin, phân loại theo 29 loại văn bản của Nghị định 30, bóc quan hệ và dòng nghiệp vụ). Cán bộ chốt dữ liệu ở ba điểm: chốt từng văn bản vào kho hoặc trả lại nguồn, duyệt quan hệ có độ tin cậy dưới 0,85, và đối chiếu với ảnh gốc khi máy tự phát hiện chỗ đáng ngờ. Mọi quyết định được ghi vào nhật ký không sửa được.',
        ],
      },
      {
        h2: 'Dữ liệu của trường ở đâu',
        items: [
          { text: 'Kho văn bản nằm trên máy của trường (cơ sở dữ liệu SQLite), sao lưu và khôi phục bằng tệp tại máy.' },
          { text: 'Mỗi đơn vị một key kích hoạt và một kho riêng; số máy được dùng do Agentra cấp theo key.' },
          { text: 'Chỉ phần cần AI được gửi qua máy chủ DocOps tới nhà cung cấp mô hình: nội dung văn bản ở các bước AI, ảnh trang khi nhận dạng, yêu cầu soạn thảo và gói ngữ cảnh của từng câu hỏi.' },
          { text: 'Chi tiết về dữ liệu và cách dùng AI ở trang', link: { page: '/ai-transparency', label: 'Minh bạch AI và dữ liệu' } },
        ],
      },
      {
        h2: 'Triển khai trong một buổi',
        ordered: true,
        items: [
          { text: 'Tải DocOps cho Windows hoặc macOS, gửi đơn xin key ngay trong màn Kích hoạt.' },
          { text: 'Điền Thông tin đơn vị một lần trong Cài đặt.' },
          { text: 'Nạp trước các văn bản hay dùng nhất: quy chế đào tạo, quy định học vụ và thông tư làm căn cứ.' },
          { text: 'Chốt văn bản vào kho, rồi mở Rà soát và Tra cứu để dùng ngay.' },
        ],
      },
    ],
    faq: [
      {
        q: 'DocOps có thay hệ thống quản lý văn bản đi – đến của trường không?',
        a: 'Không. DocOps không xử lý luồng công văn đi – đến hay ký số. DocOps làm việc trên nội dung văn bản: xây kho tri thức, tra cứu có trích dẫn, rà soát căn cứ pháp lý và soạn thảo theo Nghị định 30, xuất ra Word hoặc PDF.',
      },
      {
        q: 'DocOps nạp được những định dạng nào?',
        a: 'Văn bản PDF, kể cả PDF quét. Trang có lớp chữ được đọc trực tiếp; trang quét được AI nhận dạng từng trang. Tệp Word dùng được trong phần soạn thảo.',
      },
      {
        q: 'Ai trong trường nên dùng DocOps?',
        a: 'Cán bộ văn thư, tổ chức – hành chính, đào tạo và pháp chế, cùng lãnh đạo và chuyên viên cần tra cứu hoặc soạn văn bản. Mỗi máy kích hoạt bằng key của đơn vị; số máy dùng được do Agentra cấp theo key.',
      },
      {
        q: 'Trường cần chuẩn bị gì để bắt đầu?',
        a: 'Một máy Windows 10/11 hoặc macOS 13 trở lên có Internet, key kích hoạt của đơn vị và các tệp PDF của văn bản đang dùng. Không cần máy chủ riêng.',
      },
      {
        q: 'Dữ liệu có bị mất khi đổi máy không?',
        a: 'Không, nếu đã sao lưu. Vào Cài đặt, Sao lưu và khôi phục để tạo tệp sao lưu, rồi khôi phục trên máy mới. Việc khôi phục dựng kho bên cạnh kho đang dùng nên lỗi giữa chừng không làm hỏng dữ liệu hiện có.',
      },
    ],
    share: { title: 'Chuyển đổi số văn thư', subtitle: 'Từ thư mục PDF tới kho tri thức cho mọi phòng ban của trường đại học' },
  },
}
