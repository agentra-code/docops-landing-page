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
  'ai-for-organizations': {
    name: 'AI văn bản cho cơ quan, doanh nghiệp',
    metaTitle: 'AI văn bản cho cơ quan, doanh nghiệp',
    description:
      'DocOps đọc, phân loại, tra cứu có trích dẫn và soạn nháp văn bản theo Nghị định 30 cho cơ quan, doanh nghiệp, đoàn thể. Chạy song song với hệ thống e-Office.',
    keywords: [
      'phần mềm AI văn bản hành chính cho cơ quan, doanh nghiệp',
      'AI cho văn thư doanh nghiệp',
      'phần mềm AI văn bản cho đoàn thể, tổ chức',
      'tra cứu văn bản nội bộ doanh nghiệp',
      'kho tri thức văn bản nội bộ',
    ],
    eyebrow: 'Giải pháp cho cơ quan, doanh nghiệp',
    h1: 'Phần mềm AI văn bản hành chính cho cơ quan, doanh nghiệp và tổ chức',
    lead:
      'Văn bản nào của đơn vị đang dựa trên thông tư đã bị thay thế? Quy định nội bộ nói gì về việc này, ở Điều mấy? DocOps trả lời từ chính kho văn bản của bạn và soạn nháp đúng thể thức Nghị định 30, để văn thư, hành chính và pháp chế làm nhanh hơn mà vẫn tự duyệt.',
    card: 'Cho UBND, sở ngành, doanh nghiệp, đoàn thể và hội: kho văn bản riêng, tra cứu có trích dẫn, rà soát căn cứ, soạn theo Nghị định 30.',
    inShort:
      'DocOps dùng được cho mọi đơn vị trình bày văn bản theo Nghị định 30/2020/NĐ-CP, không riêng trường học. Đơn vị nạp văn bản PDF vào kho riêng trên máy, rồi tra cứu có trích dẫn, rà soát căn cứ hết hiệu lực và soạn nháp 29 loại văn bản hành chính. DocOps chạy song song với hệ thống quản lý văn bản đi – đến đang dùng.',
    definition: {
      h2: 'DocOps phục vụ những đơn vị nào',
      term: 'Agentra DocOps',
      rest: 'là phần mềm AI cho văn bản hành chính của trường đại học, cơ quan, doanh nghiệp và tổ chức trình bày văn bản theo Nghị định 30/2020/NĐ-CP về công tác văn thư.',
      paras: [
        'Theo Điều 2 của Nghị định, cơ quan, tổ chức nhà nước và doanh nghiệp nhà nước áp dụng trực tiếp; tổ chức chính trị, tổ chức chính trị - xã hội, tổ chức xã hội, tổ chức xã hội - nghề nghiệp căn cứ Nghị định cùng các quy định của Đảng, của pháp luật để áp dụng cho phù hợp. Doanh nghiệp ngoài nhà nước không thuộc đối tượng bắt buộc, nhưng có thể lấy thể thức này làm chuẩn cho văn bản nội bộ.',
        'Luật, nghị định và thông tư không phải văn bản hành chính, nhưng DocOps theo dõi chúng như căn cứ: văn bản nào dẫn văn bản nào, văn bản nào đã bị thay thế, bãi bỏ hoặc chưa có hiệu lực.',
      ],
    },
    imageAlt: 'Màn Đồ thị của DocOps: một thông tư hết hiệu lực, quyết định đang đứng trên nó và các văn bản bị kéo theo, tô màu theo hiệu lực',
    table: {
      h2: 'Việc văn thư hằng ngày: làm tay và với DocOps',
      caption: 'So sánh cách làm năm việc văn thư thường gặp ở cơ quan, doanh nghiệp, khi làm tay và khi dùng DocOps',
      head: ['Việc', 'Làm tay', 'Với DocOps'],
      rows: [
        ['Tìm quy định nội bộ về một việc', 'Mở từng thư mục, đọc lại từng văn bản', 'Hỏi bằng lời, câu trả lời dẫn số hiệu và Điều, bấm vào mở văn bản gốc'],
        ['Biết văn bản nào dựa trên thông tư đã bị thay thế', 'Nhớ hoặc dò lại bằng tay', 'Cảnh báo trên toàn kho: bị thay thế, bãi bỏ, chưa có hiệu lực'],
        ['Soạn thông báo, quyết định, tờ trình', 'Mở văn bản cũ làm mẫu, sửa từng chỗ', 'Viết một câu ý chính, nhận bản nháp đúng thể thức, xuất Word hoặc PDF'],
        ['Kiểm tra thể thức văn bản đến', 'Soát bằng mắt', 'Kiểm 9 mục thể thức, mỗi mục đạt, thiếu hoặc cần xem'],
        ['Giữ hiểu biết về văn bản khi cán bộ chuyển công tác', 'Nằm trong đầu người cũ', 'Kho có số hiệu, hiệu lực, quan hệ pháp lý, tích luỹ theo năm'],
      ],
    },
    blocks: [
      {
        h2: 'DocOps làm gì cho đơn vị của bạn',
        items: [
          { title: 'Nạp văn bản', text: 'PDF kể cả bản quét: nhận dạng từng trang, bóc số hiệu, ngày ký, cơ quan ban hành và trích yếu; cán bộ chốt từng văn bản vào kho.' },
          { title: 'Phân loại', text: 'xếp vào 29 loại văn bản hành chính của Nghị định 30, danh sách đầy đủ ở trang', link: { topic: 'administrative-document-types' } },
          { title: 'Tra cứu', text: 'tìm toàn văn không cần gõ dấu, hỏi bằng lời và nhận câu trả lời dẫn số hiệu, Điều, xem', link: { topic: 'ai-document-search' } },
          { title: 'Rà soát căn cứ', text: 'cảnh báo văn bản đang dựa trên căn cứ bị thay thế, bãi bỏ hoặc chưa có hiệu lực, xem', link: { topic: 'legal-basis-review' } },
          { title: 'Soạn nháp', text: 'quyết định, thông báo, tờ trình, kế hoạch, báo cáo… từ một câu ý chính, xem', link: { topic: 'decree-30-drafting' } },
          { title: 'Trường đại học', text: 'có thêm phần riêng cho phòng đào tạo và quy chế học vụ, xem', link: { topic: 'ai-for-universities' } },
        ],
      },
      {
        h2: 'Chạy cùng hệ thống quản lý văn bản đang dùng',
        paras: [
          'DocOps không xử lý luồng văn bản đi – đến, trình ký hay ký số. Hệ thống e-Office hoặc phần mềm quản lý văn bản điều hành của đơn vị vẫn giữ nguyên vai trò đó.',
          'DocOps làm việc trên nội dung văn bản: xây kho tri thức, tra cứu có trích dẫn, rà soát căn cứ và soạn nháp. Bản nháp xuất ra Word hoặc PDF để đưa vào quy trình ban hành hiện có.',
        ],
      },
      {
        h2: 'Dữ liệu của đơn vị ở đâu',
        items: [
          { text: 'Kho văn bản nằm trên máy (cơ sở dữ liệu SQLite); mỗi đơn vị một key và một kho riêng; sao lưu và khôi phục tại máy.' },
          { text: 'Các bước AI (nhận dạng trang quét, phân loại, hỏi đáp, soạn nháp) gửi nội dung qua máy chủ DocOps tới mô hình AI, mặc định là Claude của Anthropic. Máy chủ không lưu nội dung.' },
          { text: 'Chi tiết cách DocOps dùng AI và bảo vệ dữ liệu ở trang', link: { page: '/ai-transparency', label: 'Minh bạch AI' } },
        ],
      },
      {
        h2: 'Những gì DocOps chưa làm',
        items: [
          { text: 'Chỉ nạp tệp PDF; tệp Word dùng được khi soạn thảo (nhập .docx vào bản nháp).' },
          { text: 'Văn bản của Đảng và của tổ chức có hướng dẫn thể thức riêng (không dùng Quốc hiệu, Tiêu ngữ) chưa được hỗ trợ: khuôn soạn thảo luôn có Quốc hiệu, Tiêu ngữ và phần kiểm tra thể thức chấm theo Nghị định 30.' },
          { text: 'Không quản lý chứng từ kế toán như hoá đơn, phiếu thu, phiếu chi.' },
          { text: 'Giao diện ứng dụng bằng tiếng Việt.' },
        ],
      },
      {
        h2: 'Bắt đầu với DocOps',
        ordered: true,
        items: [
          { text: 'Tải và cài DocOps cho Windows hoặc macOS ở trang', link: { page: '/download', label: 'Tải về' } },
          { text: 'Xin key cho đơn vị ngay trong ứng dụng, hoặc qua trang', link: { page: '/contact', label: 'Liên hệ' } },
          { text: 'Điền Thông tin đơn vị (cơ quan chủ quản, cơ quan ban hành, địa danh, người ký) để bản nháp tự điền phần thể thức.' },
          { text: 'Nạp các văn bản đang dùng làm căn cứ và văn bản nội bộ, rồi chốt từng văn bản vào kho.' },
        ],
      },
    ],
    faq: [
      { q: 'Doanh nghiệp tư nhân dùng DocOps được không?', a: 'Được. Key không giới hạn loại đơn vị. Nghị định 30 không bắt buộc doanh nghiệp ngoài nhà nước, nhưng nếu đơn vị trình bày văn bản theo thể thức này thì DocOps phân loại, tra cứu, rà soát và soạn nháp được như với cơ quan nhà nước.' },
      { q: 'DocOps có thay e-Office hay phần mềm quản lý văn bản đi – đến không?', a: 'Không. DocOps không xử lý luồng văn bản đi – đến, trình ký hay ký số. DocOps làm việc trên nội dung văn bản và xuất bản nháp ra Word hoặc PDF để đưa vào quy trình đang dùng.' },
      { q: 'Văn bản của Đảng hoặc tổ chức có thể thức riêng có dùng được không?', a: 'Chưa. Những văn bản này không dùng Quốc hiệu và Tiêu ngữ, trong khi DocOps soạn và kiểm tra thể thức theo Nghị định 30, nên chúng sẽ bị đánh giá là thiếu thành phần.' },
      { q: 'DocOps có quản lý chứng từ kế toán không?', a: 'Không. DocOps làm việc với 29 loại văn bản hành chính của Nghị định 30 và văn bản pháp luật làm căn cứ. Hoá đơn, phiếu thu, phiếu chi và chứng từ kế toán khác không thuộc phạm vi.' },
      { q: 'Dữ liệu văn bản của đơn vị nằm ở đâu?', a: 'Trên máy của bạn. Máy chủ DocOps chỉ chuyển nội dung tới mô hình AI ở các bước cần AI và không lưu nội dung. Mỗi đơn vị có key và kho riêng.' },
    ],
    share: { title: 'Cho cơ quan, doanh nghiệp', subtitle: 'Kho văn bản riêng, tra cứu có trích dẫn, soạn theo Nghị định 30' },
  },
  'administrative-document-types': {
    name: 'Các loại văn bản hành chính',
    metaTitle: '29 loại văn bản hành chính và chữ viết tắt',
    description:
      'Bảng đủ 29 loại văn bản hành chính theo Điều 7 Nghị định 30/2020/NĐ-CP, chữ viết tắt theo Phụ lục III, cách ghi số, ký hiệu và các cặp viết tắt hay nhầm.',
    keywords: ['các loại văn bản hành chính', '29 loại văn bản hành chính theo Nghị định 30', 'chữ viết tắt tên loại văn bản', 'ký hiệu văn bản hành chính', 'bản sao y, trích sao, sao lục'],
    eyebrow: 'Kiến thức văn thư',
    h1: 'Các loại văn bản hành chính theo Nghị định 30 và chữ viết tắt',
    lead: 'Nghị định 30/2020/NĐ-CP quy định 29 loại văn bản hành chính và chữ viết tắt của 27 loại trong số đó. Bảng dưới đây liệt kê đủ 29 loại, cách ghép số và ký hiệu, cùng ba loại bản sao.',
    card: 'Đủ 29 loại văn bản hành chính theo Nghị định 30, chữ viết tắt chính thức, cách ghi ký hiệu và các cặp hay nhầm.',
    inShort:
      'Điều 7 Nghị định 30/2020/NĐ-CP liệt kê 29 loại văn bản hành chính, từ nghị quyết (cá biệt), quyết định (cá biệt) tới công văn, giấy mời và thư công. Phụ lục III quy định chữ viết tắt cho 27 loại; công văn và thư công không có chữ viết tắt tên loại. Ký hiệu văn bản ghép chữ viết tắt tên loại với chữ viết tắt tên cơ quan, ví dụ 15/QĐ-ABC.',
    definition: {
      h2: 'Văn bản hành chính gồm những loại nào',
      term: 'Văn bản hành chính',
      rest: 'là nhóm văn bản mà Nghị định 30/2020/NĐ-CP ngày 05/3/2020 của Chính phủ về công tác văn thư điều chỉnh, gồm 29 loại liệt kê tại Điều 7. Nhóm này khác văn bản quy phạm pháp luật như luật, nghị định, thông tư.',
      paras: ['Chữ "cá biệt" sau nghị quyết và quyết định phân biệt chúng với nghị quyết, quyết định là văn bản quy phạm pháp luật.'],
    },
    imageAlt: 'Màn Soạn thảo của DocOps: bản nháp văn bản hành chính trên trang A4 và nhãn hiệu lực của từng dòng căn cứ',
    table: {
      h2: 'Bảng 29 loại văn bản hành chính và chữ viết tắt',
      caption: 'Tên loại theo Điều 7, chữ viết tắt theo Phụ lục III Nghị định 30/2020/NĐ-CP. ABC là chữ viết tắt tên cơ quan ban hành, VP là chữ viết tắt đơn vị soạn thảo.',
      head: ['Tên loại văn bản', 'Chữ viết tắt', 'Ví dụ số, ký hiệu'],
      rows: [
        ['Nghị quyết (cá biệt)', 'NQ', '15/NQ-ABC'],
        ['Quyết định (cá biệt)', 'QĐ', '15/QĐ-ABC'],
        ['Chỉ thị', 'CT', '15/CT-ABC'],
        ['Quy chế', 'QC', '15/QC-ABC'],
        ['Quy định', 'QyĐ', '15/QyĐ-ABC'],
        ['Thông cáo', 'TC', '15/TC-ABC'],
        ['Thông báo', 'TB', '15/TB-ABC'],
        ['Hướng dẫn', 'HD', '15/HD-ABC'],
        ['Chương trình', 'CTr', '15/CTr-ABC'],
        ['Kế hoạch', 'KH', '15/KH-ABC'],
        ['Phương án', 'PA', '15/PA-ABC'],
        ['Đề án', 'ĐA', '15/ĐA-ABC'],
        ['Dự án', 'DA', '15/DA-ABC'],
        ['Báo cáo', 'BC', '15/BC-ABC'],
        ['Biên bản', 'BB', '15/BB-ABC'],
        ['Tờ trình', 'TTr', '15/TTr-ABC'],
        ['Hợp đồng', 'HĐ', '15/HĐ-ABC'],
        ['Công văn', 'Không có', '15/ABC-VP'],
        ['Công điện', 'CĐ', '15/CĐ-ABC'],
        ['Bản ghi nhớ', 'BGN', '15/BGN-ABC'],
        ['Bản thỏa thuận', 'BTT', '15/BTT-ABC'],
        ['Giấy ủy quyền', 'GUQ', '15/GUQ-ABC'],
        ['Giấy mời', 'GM', '15/GM-ABC'],
        ['Giấy giới thiệu', 'GGT', '15/GGT-ABC'],
        ['Giấy nghỉ phép', 'GNP', '15/GNP-ABC'],
        ['Phiếu gửi', 'PG', '15/PG-ABC'],
        ['Phiếu chuyển', 'PC', '15/PC-ABC'],
        ['Phiếu báo', 'PB', '15/PB-ABC'],
        ['Thư công', 'Không có', 'Không quy định chữ viết tắt tên loại'],
      ],
    },
    blocks: [
      {
        h2: 'Cách ghi số và ký hiệu văn bản',
        items: [
          { text: 'Số là số thứ tự văn bản trong năm, đăng ký tại Văn thư, viết bằng chữ số Ả Rập. Số nhỏ hơn 10 ghi thêm số 0 phía trước, ví dụ 05.' },
          { text: 'Ký hiệu gồm chữ viết tắt tên loại văn bản và chữ viết tắt tên cơ quan ban hành, ví dụ 15/QĐ-ABC.' },
          { text: 'Ký hiệu công văn gồm chữ viết tắt tên cơ quan và chữ viết tắt đơn vị soạn thảo hoặc lĩnh vực, ví dụ 15/ABC-VP.' },
          { text: 'Giữa số và ký hiệu là dấu gạch chéo (/), giữa các nhóm chữ viết tắt là dấu gạch nối (-), không cách chữ.' },
          { text: 'Chữ viết tắt tên cơ quan và tên đơn vị soạn thảo do người đứng đầu cơ quan, tổ chức quy định.' },
        ],
      },
      {
        h2: 'Các cặp viết tắt hay nhầm',
        items: [
          { title: 'QĐ và QyĐ', text: 'QĐ là quyết định, QyĐ là quy định.' },
          { title: 'ĐA và DA', text: 'ĐA là đề án, DA là dự án.' },
          { title: 'HD và HĐ', text: 'HD là hướng dẫn, HĐ là hợp đồng.' },
          { title: 'CT và CTr', text: 'CT là chỉ thị, CTr là chương trình.' },
          { title: 'TTr và TT', text: 'TTr là tờ trình, một văn bản hành chính. TT thường dùng cho thông tư, là văn bản quy phạm pháp luật và không có trong bảng này.' },
        ],
      },
      {
        h2: 'Ba loại bản sao văn bản',
        items: [
          { title: 'Bản sao y: SY', text: 'chữ viết tắt theo Phụ lục III.' },
          { title: 'Bản trích sao: TrS', text: 'chữ viết tắt theo Phụ lục III.' },
          { title: 'Bản sao lục: SL', text: 'chữ viết tắt theo Phụ lục III.' },
        ],
      },
      {
        h2: 'Mẫu trình bày trong Phụ lục III',
        ordered: true,
        items: [
          { text: 'Mẫu 1.1: Nghị quyết (cá biệt).' },
          { text: 'Mẫu 1.2: Quyết định (cá biệt) quy định trực tiếp.' },
          { text: 'Mẫu 1.3: Quyết định (cá biệt) quy định gián tiếp.' },
          { text: 'Mẫu 1.4: Văn bản có tên loại.' },
          { text: 'Mẫu 1.5: Công văn.' },
          { text: 'Mẫu 1.6: Công điện.' },
          { text: 'Mẫu 1.7: Giấy mời.' },
          { text: 'Mẫu 1.8: Giấy giới thiệu.' },
          { text: 'Mẫu 1.9: Biên bản.' },
          { text: 'Mẫu 1.10: Giấy nghỉ phép.' },
          { text: 'Thể thức từng thành phần (Quốc hiệu, số ký hiệu, chữ ký, nơi nhận…) theo Phụ lục I Nghị định 30 có ở trang', link: { topic: 'administrative-document-format' } },
        ],
      },
      {
        h2: 'DocOps dùng bảng này thế nào',
        items: [
          { title: 'Khi nạp văn bản', text: 'AI xếp văn bản vào một trong 29 loại. Văn bản ngoài bảng như luật, nghị định, thông tư được xếp "Khác" và vẫn được theo dõi làm căn cứ; cán bộ chốt kết quả.' },
          { title: 'Khi soạn thảo', text: 'chọn một trong 29 loại, ký hiệu ghi theo chữ viết tắt ở bảng trên, xem', link: { topic: 'decree-30-drafting' } },
        ],
      },
    ],
    faq: [
      { q: 'Có bao nhiêu loại văn bản hành chính?', a: 'Có 29 loại, liệt kê tại Điều 7 Nghị định 30/2020/NĐ-CP, từ nghị quyết (cá biệt) đến thư công.' },
      { q: 'Công văn viết tắt là gì?', a: 'Công văn không có chữ viết tắt tên loại. Ký hiệu công văn gồm chữ viết tắt tên cơ quan và chữ viết tắt đơn vị soạn thảo, ví dụ 15/ABC-VP.' },
      { q: 'Quy định viết tắt là QĐ hay QyĐ?', a: 'Quy định viết tắt là QyĐ. QĐ là chữ viết tắt của quyết định.' },
      { q: 'Thông tư có phải văn bản hành chính không?', a: 'Không. Thông tư là văn bản quy phạm pháp luật, không nằm trong 29 loại của Điều 7. DocOps theo dõi thông tư như căn cứ của văn bản hành chính.' },
      { q: 'Bản trích sao viết tắt là gì?', a: 'Bản trích sao viết tắt là TrS. Bản sao y viết tắt là SY, bản sao lục là SL.' },
    ],
    share: { title: '29 loại văn bản hành chính', subtitle: 'Chữ viết tắt theo Phụ lục III Nghị định 30 và cách ghi ký hiệu' },
  },
  'administrative-document-format': {
    name: 'Thể thức văn bản hành chính',
    metaTitle: 'Thể thức văn bản hành chính theo NĐ 30',
    description:
      '9 thành phần thể thức chính theo Điều 8 Nghị định 30/2020/NĐ-CP, khổ giấy, lề, phông và cỡ chữ theo Phụ lục I, kèm checklist trước khi trình ký.',
    keywords: ['thể thức văn bản hành chính', 'cách trình bày văn bản theo Nghị định 30', 'kiểm tra thể thức văn bản', 'kỹ thuật trình bày văn bản hành chính', 'căn lề văn bản hành chính'],
    eyebrow: 'Kiến thức văn thư',
    h1: 'Thể thức văn bản hành chính theo Nghị định 30: 9 thành phần và cách trình bày',
    lead: 'Thể thức là các thành phần một văn bản hành chính phải có; kỹ thuật trình bày là khổ giấy, lề, phông và cỡ chữ của từng thành phần. Trang này tóm tắt cả hai theo Nghị định 30/2020/NĐ-CP, kèm checklist soát trước khi trình ký.',
    card: '9 thành phần thể thức chính, lề, phông, cỡ chữ theo Phụ lục I Nghị định 30 và checklist soát văn bản trước khi trình ký.',
    inShort:
      'Theo Điều 8 Nghị định 30/2020/NĐ-CP, văn bản hành chính có 9 thành phần chính: Quốc hiệu và Tiêu ngữ; tên cơ quan, tổ chức ban hành; số, ký hiệu; địa danh và thời gian ban hành; tên loại và trích yếu; nội dung; chức vụ, họ tên và chữ ký người có thẩm quyền; dấu, chữ ký số của cơ quan; nơi nhận. Văn bản trình bày trên khổ A4, phông Times New Roman, lề trên và dưới 20–25 mm, trái 30–35 mm, phải 15–20 mm.',
    definition: {
      h2: 'Thể thức văn bản là gì',
      term: 'Thể thức văn bản',
      rest: 'là tập hợp các thành phần cấu thành văn bản, gồm những thành phần chính áp dụng cho mọi loại văn bản và các thành phần bổ sung trong những trường hợp cụ thể (khoản 1 Điều 8 Nghị định 30/2020/NĐ-CP).',
      paras: ['Kỹ thuật trình bày gồm khổ giấy, kiểu trình bày, định lề trang, phông chữ, cỡ chữ, kiểu chữ, vị trí các thành phần và số trang (Điều 9). Chi tiết nằm ở Phụ lục I; viết hoa theo Phụ lục II; chữ viết tắt tên loại theo Phụ lục III.'],
    },
    imageAlt: 'Màn Soạn thảo của DocOps: bản nháp văn bản hành chính trên trang A4 và nhãn hiệu lực của từng dòng căn cứ',
    table: {
      h2: 'Kỹ thuật trình bày theo Phụ lục I',
      caption: 'Quy định chung và cỡ chữ của các thành phần chính theo Phụ lục I Nghị định 30/2020/NĐ-CP',
      head: ['Yếu tố', 'Quy định'],
      rows: [
        ['Khổ giấy', 'A4 (210 mm x 297 mm), trình bày theo chiều dài'],
        ['Lề trên, lề dưới', '20–25 mm'],
        ['Lề trái', '30–35 mm'],
        ['Lề phải', '15–20 mm'],
        ['Phông chữ', 'Times New Roman, bộ mã Unicode TCVN 6909:2001, màu đen'],
        ['Quốc hiệu', 'In hoa, cỡ 12–13, đứng, đậm'],
        ['Tiêu ngữ', 'In thường, cỡ 13–14, đứng, đậm, kẻ ngang dài bằng dòng chữ'],
        ['Tên cơ quan ban hành', 'In hoa, cỡ 12–13, đứng, đậm, kẻ ngang dài 1/3–1/2 dòng chữ'],
        ['Số, ký hiệu', 'Cỡ 13; "Số" in thường, ký hiệu in hoa'],
        ['Địa danh, ngày tháng', 'In thường, cỡ 13–14, nghiêng'],
        ['Tên loại văn bản', 'In hoa, cỡ 13–14, đứng, đậm'],
        ['Trích yếu', 'In thường, cỡ 13–14, đứng, đậm; công văn ghi sau "V/v", cỡ 12–13'],
        ['Nội dung', 'In thường, cỡ 13–14, canh đều hai lề, lùi đầu dòng 1 cm hoặc 1,27 cm, cách đoạn tối thiểu 6pt, cách dòng từ đơn tới 1,5 lines'],
        ['Quyền hạn, chức vụ người ký', 'In hoa, cỡ 13–14, đứng, đậm'],
        ['Họ tên người ký', 'In thường, cỡ 13–14, đứng, đậm'],
        ['Nơi nhận', '"Nơi nhận:" cỡ 12, nghiêng, đậm; danh sách cỡ 11, đứng'],
        ['Số trang', 'Cỡ 13–14, canh giữa trong lề trên, không hiện ở trang đầu'],
      ],
    },
    blocks: [
      {
        h2: '9 thành phần thể thức chính',
        ordered: true,
        items: [
          { title: 'Quốc hiệu và Tiêu ngữ', text: 'ở góc trên bên phải trang đầu. Quốc hiệu "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM" in hoa, cỡ 12–13, đậm. Tiêu ngữ "Độc lập - Tự do - Hạnh phúc" in thường, cỡ 13–14, đậm, canh giữa dưới Quốc hiệu, kẻ ngang dài bằng dòng chữ.' },
          { title: 'Tên cơ quan, tổ chức ban hành văn bản', text: 'ghi tên chính thức, đầy đủ, kèm tên cơ quan chủ quản trực tiếp nếu có. Tên cơ quan ban hành in hoa, cỡ 12–13, đậm, kẻ ngang dài 1/3–1/2 dòng chữ.' },
          { title: 'Số, ký hiệu của văn bản', text: 'số là số thứ tự trong năm đăng ký tại Văn thư, số nhỏ hơn 10 ghi thêm số 0. Ký hiệu ghép chữ viết tắt tên loại với chữ viết tắt tên cơ quan, cỡ 13. Danh sách chữ viết tắt có ở trang', link: { topic: 'administrative-document-types' } },
          { title: 'Địa danh và thời gian ban hành văn bản', text: 'in thường, cỡ 13–14, nghiêng, cùng dòng với số, ký hiệu. Sau địa danh có dấu phẩy; ngày nhỏ hơn 10 và tháng 1, 2 ghi thêm số 0.' },
          { title: 'Tên loại và trích yếu nội dung văn bản', text: 'tên loại in hoa, cỡ 13–14, đậm; trích yếu in thường, cỡ 13–14, đậm, ngay dưới tên loại. Công văn ghi trích yếu sau "V/v", in thường, cỡ 12–13.' },
          { title: 'Nội dung văn bản', text: 'in thường, cỡ 13–14, canh đều hai lề, lùi đầu dòng 1 cm hoặc 1,27 cm, cách đoạn tối thiểu 6pt, cách dòng từ đơn tới 1,5 lines.' },
          { title: 'Chức vụ, họ tên và chữ ký của người có thẩm quyền', text: 'quyền hạn ký ghi TM., Q., KT., TL. hoặc TUQ. Quyền hạn, chức vụ in hoa, cỡ 13–14, đậm; họ tên in thường, cỡ 13–14, đậm, không ghi học hàm, học vị trước họ tên.' },
          { title: 'Dấu, chữ ký số của cơ quan, tổ chức', text: 'trên văn bản điện tử là hình ảnh dấu màu đỏ, kích thước thật, định dạng .png nền trong suốt, trùm khoảng 1/3 hình ảnh chữ ký số của người có thẩm quyền về bên trái.' },
          { title: 'Nơi nhận', text: '"Nơi nhận:" cỡ 12, nghiêng, đậm; danh sách cỡ 11, đứng; dòng cuối ghi "Lưu: VT" cùng đơn vị soạn thảo và số bản.' },
        ],
      },
      {
        h2: 'Thành phần bổ sung',
        items: [
          { title: 'Phụ lục', text: 'đi kèm văn bản khi cần (Điều 8 khoản 3 điểm a).' },
          { title: 'Dấu chỉ độ mật, mức độ khẩn, chỉ dẫn phạm vi lưu hành', text: 'mức độ khẩn gồm hỏa tốc, thượng khẩn, khẩn; độ mật gồm tuyệt mật, tối mật, mật; phạm vi lưu hành ví dụ "XEM XONG TRẢ LẠI", "LƯU HÀNH NỘI BỘ".' },
          { title: 'Ký hiệu người soạn thảo và số lượng bản phát hành', text: 'thành phần bổ sung theo điểm c khoản 3 Điều 8.' },
          { title: 'Địa chỉ cơ quan, tổ chức; thư điện tử; trang thông tin điện tử; số điện thoại; số Fax', text: 'thành phần bổ sung theo điểm d khoản 3 Điều 8.' },
        ],
      },
      {
        h2: 'Checklist trước khi trình ký',
        items: [
          { text: 'Quốc hiệu và Tiêu ngữ đúng chữ, Tiêu ngữ có gạch nối.' },
          { text: 'Tên cơ quan chủ quản và cơ quan ban hành đúng tên chính thức.' },
          { text: 'Số do Văn thư cấp khi đăng ký, ký hiệu đúng chữ viết tắt tên loại.' },
          { text: 'Địa danh có dấu phẩy, ngày nhỏ hơn 10 và tháng 1, 2 có số 0 phía trước.' },
          { text: 'Trích yếu ngắn, phản ánh nội dung chính của văn bản.' },
          { text: 'Căn cứ còn hiệu lực; lần dẫn đầu ghi đủ tên loại, số, ký hiệu, ngày ban hành, cơ quan ban hành và trích yếu. Cách rà căn cứ có ở trang', link: { topic: 'legal-basis-review' } },
          { text: 'Quyền hạn ký đúng: TM., Q., KT., TL. hoặc TUQ.' },
          { text: 'Nơi nhận đủ, dòng cuối "Lưu: VT".' },
          { text: 'Lề, phông, cỡ chữ đúng bảng kỹ thuật trình bày ở trên.' },
        ],
      },
      {
        h2: 'DocOps kiểm tra thể thức thế nào',
        paras: [
          'Với văn bản đã nạp vào kho, DocOps kiểm tra 9 mục: quốc hiệu, tiêu ngữ, tên cơ quan, số ký hiệu, địa danh và ngày, tên loại và trích yếu, nơi nhận, chữ ký, dấu. Quốc hiệu và tiêu ngữ được tách thành hai mục và phần nội dung không chấm, nên cách đếm khác chín thành phần của Điều 8. Mỗi mục có trạng thái đạt, thiếu hoặc cần xem; kết luận chung là đạt, cần xem hoặc không đạt. AI chấm, cán bộ xem lại kết quả.',
          'DocOps không đo lề, phông hay cỡ chữ của tệp.',
        ],
        items: [{ text: 'Bản nháp DocOps soạn được dựng theo khuôn Nghị định 30, xem', link: { topic: 'decree-30-drafting' } }],
      },
    ],
    faq: [
      { q: 'Văn bản hành chính có bao nhiêu thành phần thể thức?', a: 'Có 9 thành phần chính áp dụng cho mọi văn bản, kèm 4 nhóm thành phần bổ sung: phụ lục; dấu độ mật, mức độ khẩn và chỉ dẫn phạm vi lưu hành; ký hiệu người soạn thảo và số bản phát hành; địa chỉ và thông tin liên hệ của cơ quan. Căn cứ là Điều 8 Nghị định 30/2020/NĐ-CP.' },
      { q: 'Căn lề văn bản hành chính thế nào?', a: 'Theo Phụ lục I Nghị định 30, lề trên và lề dưới 20–25 mm, lề trái 30–35 mm, lề phải 15–20 mm, trên khổ A4.' },
      { q: 'Văn bản hành chính dùng phông và cỡ chữ nào?', a: 'Phông Times New Roman, bộ mã Unicode TCVN 6909:2001, màu đen. Nội dung văn bản cỡ 13–14; Quốc hiệu cỡ 12–13; Tiêu ngữ cỡ 13–14.' },
      { q: 'Trang đầu có đánh số trang không?', a: 'Không. Số trang đánh từ 1 bằng chữ số Ả Rập, cỡ 13–14, canh giữa trong lề trên, nhưng không hiển thị ở trang thứ nhất.' },
      { q: 'Ghi ngày tháng ban hành thế nào?', a: 'Địa danh và ngày tháng in thường, nghiêng, sau địa danh có dấu phẩy. Ngày nhỏ hơn 10 và tháng 1, 2 ghi thêm số 0, ví dụ "Hà Nội, ngày 05 tháng 02 năm 2026".' },
    ],
    share: { title: 'Thể thức văn bản NĐ 30', subtitle: '9 thành phần chính, lề, phông, cỡ chữ và checklist trước khi trình ký' },
  },
  'docops-vs-chatgpt': {
    name: 'DocOps và ChatGPT',
    metaTitle: 'DocOps và ChatGPT cho văn bản hành chính',
    description:
      'So sánh DocOps và ChatGPT khi làm văn bản hành chính: nguồn câu trả lời, trích dẫn số hiệu và Điều, rà soát hiệu lực, thể thức Nghị định 30, dữ liệu đi đâu.',
    keywords: ['dùng ChatGPT cho văn bản hành chính', 'DocOps và ChatGPT', 'ChatGPT soạn văn bản hành chính', 'so sánh AI cho văn thư', 'bảo mật dữ liệu khi dùng ChatGPT'],
    eyebrow: 'So sánh',
    h1: 'Dùng ChatGPT cho văn bản hành chính hay DocOps? So sánh trung thực',
    lead: 'ChatGPT viết tốt và biết rộng. DocOps làm hẹp hơn: trả lời từ chính kho văn bản của đơn vị, dẫn số hiệu và Điều, biết căn cứ nào đã hết hiệu lực và soạn đúng thể thức Nghị định 30. Bảng dưới đây so sánh từng điểm, kể cả chỗ ChatGPT hợp hơn.',
    card: 'So sánh trung thực khi làm văn bản hành chính: nguồn câu trả lời, trích dẫn, hiệu lực căn cứ, thể thức và dữ liệu.',
    inShort:
      'ChatGPT là trợ lý đa năng, trả lời từ kiến thức của mô hình, tìm kiếm web và tệp bạn tải lên. DocOps là ứng dụng desktop chỉ dành cho văn bản hành chính: câu trả lời chỉ lấy từ kho văn bản của đơn vị, dẫn số hiệu và Điều, căn cứ hết hiệu lực được cảnh báo và bản nháp theo khuôn Nghị định 30. Dùng ChatGPT cho việc viết chung; dùng DocOps khi câu trả lời phải dựa trên văn bản của đơn vị.',
    definition: {
      h2: 'Khác nhau ở đâu',
      term: 'Khác biệt chính',
      rest: 'nằm ở nguồn câu trả lời: ChatGPT trả lời từ kiến thức chung và những gì bạn đưa vào cuộc trò chuyện, còn DocOps chỉ trả lời từ kho văn bản đơn vị đã nạp và loại bỏ văn bản không có trong kho.',
      paras: ['Thông tin về ChatGPT trên trang này lấy từ trang trợ giúp của OpenAI, đối chiếu ngày 08/10/2026. Tính năng và chính sách của ChatGPT có thể thay đổi; hãy xem trang gốc trước khi quyết định.'],
    },
    imageAlt: 'Màn Tra cứu của DocOps: kết quả tìm kiếm và cột hỏi đáp với trích dẫn số hiệu, Điều',
    table: {
      h2: 'So sánh từng điểm',
      caption: 'So sánh ChatGPT và DocOps khi làm văn bản hành chính, theo trang của OpenAI và tài liệu DocOps, ngày 08/10/2026',
      head: ['Tiêu chí', 'ChatGPT', 'DocOps'],
      rows: [
        ['Nguồn câu trả lời', 'Kiến thức của mô hình, tìm kiếm web, tệp bạn tải lên và ứng dụng kết nối như Google Drive; tệp trong một dự án (Projects) dùng được cho các cuộc trò chuyện của dự án đó', 'Chỉ kho văn bản đơn vị đã nạp và cán bộ đã chốt'],
        ['Trích dẫn', 'Kèm link nguồn khi dùng tìm kiếm web', 'Mỗi câu trả lời dẫn số hiệu và Điều, bấm vào mở văn bản gốc'],
        ['Khi không có thông tin', 'Có thể trả lời từ kiến thức chung của mô hình; người dùng cần tự kiểm tra số hiệu và trích dẫn', 'Nói rõ "Chưa tìm thấy trong kho"; văn bản AI nhắc tới mà không có trong kho bị loại và hiện cảnh báo'],
        ['Căn cứ hết hiệu lực', 'Không theo dõi quan hệ thay thế, bãi bỏ giữa các văn bản của đơn vị', 'Cảnh báo căn cứ bị thay thế, bãi bỏ, chưa có hiệu lực trên toàn kho, xem tại một ngày bất kỳ'],
        ['Soạn văn bản', 'Viết theo lời nhắc; thể thức phụ thuộc lời nhắc và người dùng tự soát', 'Khuôn 29 loại theo Nghị định 30, tự điền thông tin đơn vị, chỉ đề xuất căn cứ còn hiệu lực, xuất Word và PDF'],
        ['Dữ liệu và huấn luyện', 'Gói cá nhân: hội thoại có thể được dùng để huấn luyện mô hình, trừ khi tắt "Improve the model for everyone"; kể cả khi đã tắt, bấm thích hoặc không thích một câu trả lời thì cả hội thoại đó có thể được dùng. Gói Business, Enterprise, Edu: mặc định không dùng để huấn luyện', 'Kho lưu tại máy; nội dung đi qua máy chủ DocOps tới mô hình AI để xử lý, máy chủ không lưu nội dung; Agentra không dùng dữ liệu của đơn vị để huấn luyện'],
        ['Cách dùng', 'Trên web, ứng dụng máy tính và điện thoại', 'Ứng dụng desktop Windows, macOS; kích hoạt bằng key của đơn vị'],
        ['Phạm vi', 'Đa năng: viết, dịch, tóm tắt và nhiều việc khác', 'Chỉ văn bản hành chính: nạp, phân loại, tra cứu, rà soát, soạn nháp'],
      ],
    },
    blocks: [
      {
        h2: 'Khi nào ChatGPT hợp hơn',
        items: [
          { text: 'Viết thư, bài phát biểu, nội dung truyền thông không cần căn cứ.' },
          { text: 'Hỏi kiến thức chung, giải thích khái niệm.' },
          { text: 'Dịch hoặc tóm tắt một tài liệu đơn lẻ.' },
          { text: 'Đơn vị chưa có kho văn bản và chỉ cần một bản nháp nhanh để tự sửa.' },
        ],
      },
      {
        h2: 'Khi nào DocOps hợp hơn',
        items: [
          { text: 'Câu trả lời phải dẫn đúng văn bản đơn vị đang áp dụng, xem', link: { topic: 'ai-document-search' } },
          { text: 'Cần biết văn bản nào dựa trên căn cứ đã bị thay thế, xem', link: { topic: 'legal-basis-review' } },
          { text: 'Soạn quyết định, tờ trình, thông báo đúng thể thức với căn cứ còn hiệu lực, xem', link: { topic: 'decree-30-drafting' } },
          { text: 'Muốn kho văn bản nằm tại máy và có nhật ký quyết định của cán bộ, xem', link: { page: '/ai-transparency', label: 'Minh bạch AI' } },
        ],
      },
      {
        h2: 'Lưu ý khi đưa văn bản nội bộ vào ChatGPT',
        paras: [
          'Với tài khoản cá nhân, kiểm tra mục Data Controls và tắt "Improve the model for everyone" nếu không muốn hội thoại được dùng để huấn luyện. Lưu ý: kể cả khi đã tắt, nếu bạn bấm thích hoặc không thích một câu trả lời thì cả hội thoại đó có thể được dùng để huấn luyện. Văn bản mật hoặc có thông tin cá nhân phải theo quy định về bảo vệ bí mật nhà nước và dữ liệu cá nhân của đơn vị, dù dùng công cụ AI nào.',
        ],
        items: [
          { text: 'Cài đặt huấn luyện và dữ liệu của ChatGPT:', link: { href: 'https://help.openai.com/en/articles/7730893-data-controls-in-chatgpt', label: 'Data controls in ChatGPT (OpenAI)' } },
          { text: 'Cách tệp và ứng dụng trong dự án được dùng:', link: { href: 'https://help.openai.com/en/articles/10169521-projects-in-chatgpt', label: 'Projects in ChatGPT (OpenAI)' } },
        ],
      },
      {
        h2: 'Dùng cả hai',
        paras: ['Hai công cụ không loại trừ nhau. Một cách chia việc: ChatGPT cho phần viết tự do không dựa trên văn bản của đơn vị, DocOps cho mọi câu hỏi và bản nháp phải dựa trên kho văn bản và căn cứ còn hiệu lực.'],
      },
    ],
    faq: [
      { q: 'DocOps có dùng ChatGPT bên trong không?', a: 'Không. Mô hình mặc định của DocOps là Claude của Anthropic; Agentra có thể cấu hình mô hình khác cho từng đơn vị, như GLM. Nội dung đi qua máy chủ DocOps tới nhà cung cấp mô hình, máy chủ không lưu nội dung.' },
      { q: 'Tải văn bản của đơn vị lên ChatGPT có an toàn không?', a: 'Tuỳ gói và cài đặt. Theo OpenAI, hội thoại ở gói cá nhân có thể được dùng để huấn luyện trừ khi bạn tắt "Improve the model for everyone", và bấm thích hoặc không thích một câu trả lời thì cả hội thoại đó vẫn có thể được dùng; gói Business, Enterprise và Edu mặc định không dùng dữ liệu để huấn luyện. Văn bản mật không nên đưa vào dịch vụ AI trực tuyến nào nếu quy định của đơn vị không cho phép.' },
      { q: 'ChatGPT có soạn được văn bản theo Nghị định 30 không?', a: 'Có thể soạn theo lời nhắc, nhưng ChatGPT không có sẵn thông tin đơn vị, không biết căn cứ nào trong kho còn hiệu lực, và thể thức cần người dùng tự soát. DocOps dùng khuôn 29 loại văn bản của Nghị định 30, tự điền thông tin đơn vị và chỉ đề xuất căn cứ còn hiệu lực trong kho.' },
      { q: 'DocOps có miễn phí không?', a: 'Tải và cài DocOps miễn phí; chi phí sử dụng tính theo quy mô của đơn vị, liên hệ để nhận báo giá.' },
      { q: 'Nên chọn DocOps hay ChatGPT?', a: 'Chọn theo nguồn câu trả lời bạn cần. Việc viết chung, không cần căn cứ: ChatGPT. Câu trả lời, bản nháp phải dựa trên văn bản đơn vị đang áp dụng và căn cứ còn hiệu lực: DocOps. Nhiều việc dùng được cả hai.' },
    ],
    share: { title: 'DocOps và ChatGPT', subtitle: 'Nguồn câu trả lời, trích dẫn, hiệu lực căn cứ và dữ liệu' },
  },
}
