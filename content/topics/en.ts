import type { TopicCopy, TopicId } from './index'

/* English topic pages. Same facts as vi.ts (checked against the docops-application repo on 2026-10-04); keep both in step. */
export const TOPICS_EN: Record<TopicId, TopicCopy> = {
  'legal-basis-review': {
    name: 'Legal basis review',
    metaTitle: 'Legal basis review for expired references',
    description:
      'Find institution documents citing legal bases that were replaced, repealed or not yet in force, check them as of any date and see the impact before amending.',
    keywords: ['legal basis review', 'expired legal references', 'document validity check', 'regulatory impact analysis', 'legal relationship graph'],
    eyebrow: 'Expired legal references',
    h1: 'Legal basis review: find university documents that rest on expired references',
    lead:
      'When the Ministry issues a new circular, your regulations and decisions may still cite the one it replaced. DocOps scans the whole repository, shows which documents need work and why, and keeps the original sentence as evidence.',
    card: 'Find documents that rest on replaced, repealed or not-yet-effective bases, and see what changing one article pulls along.',
    inShort:
      'Legal basis review checks whether each institution document cites a document that was replaced, repealed or is not yet in force. DocOps runs it across the whole repository, recalculates it for any date you pick, and measures in advance how many places depend on a given article.',
    definition: {
      h2: 'What is legal basis review?',
      term: 'Legal basis review',
      rest: 'is checking the "Pursuant to …" lines of a document against the current validity of the documents they cite, to catch bases that were replaced, repealed or are not yet in force.',
      paras: [
        'At a university, one circular of the Ministry of Education and Training can be the basis for dozens of internal documents: training regulations, academic rules, decisions setting up councils. When that circular is replaced, the internal documents do not change by themselves. Tracing them by hand means remembering which document cites which, and it usually happens only after something goes wrong.',
        'DocOps stores every relationship between the documents in the repository as a graph, so "which documents still rest on the old basis?" becomes a query on data instead of a search through memory.',
      ],
    },
    imageAlt: 'DocOps review screen: document list with repealed-basis and about-to-change warnings',
    table: {
      h2: 'Manual review vs. review with DocOps',
      caption: 'Comparison of manual legal basis review and review with DocOps',
      head: ['Task', 'By hand', 'With DocOps'],
      rows: [
        ['Spot replaced or repealed bases', 'Re-read every document, look up every basis', 'Automatic warnings across the repository on the Review screen'],
        ['Indirect bases', 'Usually missed', '"About to change" warning when a basis of a basis is replaced or repealed (2 levels)'],
        ['Validity on a given date', 'Work it out from issue and effective dates', 'Pick a date in "Valid as of"; warnings are recalculated'],
        ['Impact before amending', 'Estimated from experience', 'Impact radius: counts the business rows that rely on each article'],
        ['Evidence', 'Loose notes', 'Every relation keeps the sentence that created it'],
      ],
    },
    blocks: [
      {
        h2: 'What DocOps warns about',
        paras: ['The Review screen collects warnings for the whole repository, filtered into three groups: repealed basis, about to change, and handled.'],
        items: [
          { title: 'Replaced or repealed basis', text: 'your document cites a document that another document in the repository replaces or repeals.' },
          { title: 'About to change', text: 'the direct basis is still valid, but its own basis was replaced or repealed. DocOps follows two levels like this.' },
          { title: 'Not yet in force', text: 'your document cites a document whose effective date has not arrived on the date you are viewing.' },
        ],
      },
      {
        h2: 'The legal relationship graph',
        paras: [
          'When a document is ingested, DocOps reads its cross-references and records five relation types: basis, guidance, amendment, replacement and repeal. Each relation keeps the original sentence that produced it so staff can check it. Relations with a confidence of 0.85 or more go straight in; lower ones wait for staff approval.',
          'On the Graph screen, Impact mode shows, for the selected document, what it rests on and what depends on it. Note that amendments are drawn on the graph but do not raise warnings, because an amended document is still in force.',
        ],
      },
      {
        h2: 'Impact radius: what to re-check when you change an article',
        paras: [
          'Review answers the question after the law has changed. Impact radius answers it before: how many obligations, key figures (credits, years, ratios, fees), hard gates and academic thresholds in the repository rest on a given article.',
          'DocOps counts the business rows that cite each article and draws each article as a bubble; the bigger the bubble, the more places to re-check. The count runs on your machine, is deterministic, calls no AI and uses no tokens. On the sample repository that ships with the product (104 documents, 206 articles, 280 relations), the heaviest article is cited by 12 business rows.',
        ],
      },
      {
        h2: 'What uses AI and what runs locally',
        items: [
          { title: 'Uses AI', text: 'reading documents and extracting cross-references and the four business layers from their content.' },
          { title: 'Runs locally, no AI', text: 'validity warnings, date recalculation, impact spread and impact radius. The same repository always gives the same result.' },
          { text: 'Plain-language questions about a specific document are answered by', link: { topic: 'ai-document-search' } },
          { text: 'When you write a new document, expired bases are flagged right in the draft:', link: { topic: 'decree-30-drafting' } },
        ],
      },
      {
        h2: 'Start reviewing your institution repository',
        ordered: true,
        items: [
          { text: 'Download DocOps for Windows or macOS and activate it with your institution key.' },
          { text: 'Ingest the PDFs you rely on as bases: Ministry circulars and decisions plus your internal documents.' },
          { text: 'Confirm each document into the repository and approve low-confidence relations.' },
          { text: 'Open Review, set "Valid as of" and work through the warnings; mark each one handled when done.' },
        ],
      },
    ],
    faq: [
      {
        q: 'How does DocOps know a basis has expired?',
        a: 'From the relations between documents in your repository. When the repository holds a document that replaces or repeals a basis, every document citing that basis gets a warning. That is why new Ministry documents should be ingested too.',
      },
      {
        q: 'Are amended documents flagged?',
        a: 'No. Amendments are recorded and drawn on the graph, but an amended document is still in force, so it raises no warning. DocOps warns only when a basis is replaced, repealed or not yet in force.',
      },
      {
        q: 'Can I see validity as of a past date?',
        a: 'Yes. The "Valid as of" box on the Review and Graph screens recalculates every warning for the date you choose.',
      },
      {
        q: 'Does impact radius use AI?',
        a: 'No. AI only extracts the business rows when a document is ingested. The impact radius count runs on your machine, is deterministic and uses no tokens.',
      },
      {
        q: 'Does the review replace the legal office?',
        a: 'No. DocOps shows which documents need attention and why, with the original sentence as evidence. Deciding to amend, replace or repeal a document stays with the authorised staff.',
      },
    ],
    share: { title: 'Legal basis review', subtitle: 'Find documents that rest on replaced, repealed or not-yet-effective bases' },
  },

  'decree-30-drafting': {
    name: 'Decree 30 document drafting',
    metaTitle: 'Decree 30 document drafting with AI',
    description:
      'Draft the 29 document types of Decree 30/2020/ND-CP from a one-sentence brief, with institution details filled in, expired bases flagged, Word or PDF export.',
    keywords: ['Decree 30 document drafting', 'AI drafting of administrative documents', 'Vietnamese administrative document format', 'Decree 30/2020/ND-CP templates', 'document format check'],
    eyebrow: 'AI drafting for administrative documents',
    h1: 'Decree 30 document drafting with AI, edited and signed by your staff',
    lead:
      'Write one sentence of intent and DocOps writes the whole document on an A4 page in the format of Decree 30/2020/ND-CP. Expired legal bases are flagged inside the draft, then you export to Word or PDF.',
    card: 'From a one-sentence brief to a correctly formatted draft for 29 document types, expired bases flagged, Word and PDF export.',
    inShort:
      'DocOps drafts all 29 administrative document types of Decree 30/2020/ND-CP. You write the intent, the AI writes the draft, and you edit it like a Word document. Institution details are filled in, expired bases are labelled, and the result exports to Word or PDF for your existing signing process.',
    definition: {
      h2: 'What is Decree 30 document drafting?',
      term: 'Decree 30 document drafting',
      rest: 'means laying out Vietnamese administrative documents in the format set by Government Decree 30/2020/ND-CP of 5 March 2020 on clerical work: national title and motto, issuing body, number and code, place and date, document type and summary, body, signature, seal and recipients.',
      paras: [
        'Article 7 of the Decree lists 29 administrative document types, from individual resolutions, decisions and directives to official letters, submissions, notices, plans, reports, minutes, contracts, invitations and official telegrams. The hard part is not the template. It is writing in the right administrative register for each type, and citing bases that are still in force.',
      ],
    },
    imageAlt: 'DocOps drafting screen: an administrative document draft on an A4 page with a validity label on each legal basis line',
    table: {
      h2: 'Drafting by hand vs. drafting with DocOps',
      caption: 'Comparison of drafting administrative documents by hand and with DocOps',
      head: ['Step', 'By hand', 'With DocOps'],
      rows: [
        ['Starting point', 'Open an old document and rework it', 'One sentence of intent, then "Write"'],
        ['Institution details', 'Typed again every time', 'Filled from Institution details: parent body, issuing body, place, signing authority, title, name'],
        ['Legal bases', 'Copied from old documents, easy to cite an expired one', 'Expired bases are not sent to the AI; each basis line carries a validity label'],
        ['Blank fields', 'Checked by eye', 'A "Still blank" list shows what is missing'],
        ['Output', 'Word file', 'Word (.docx) or PDF'],
      ],
    },
    blocks: [
      {
        h2: 'How DocOps drafts a document',
        ordered: true,
        items: [
          { text: 'Pick the document type from the 29 types of Decree 30.' },
          { text: 'Write the intent in one sentence, for example the purpose of a decision and who it applies to, then press "Write".' },
          { text: 'The AI writes the whole document on an A4 page; institution details come from Settings, Institution details.' },
          { text: 'Edit directly as in Word; the "Still blank" list reminds you what is left.' },
          { text: 'Export to Word or PDF and submit it for signing through your usual process.' },
        ],
      },
      {
        h2: 'Valid bases from the first draft',
        paras: [
          'Before writing, DocOps leaves out of the AI input any basis that is expired or about to change in your repository. After writing, every "Pursuant to …" line gets a label: In force, Expired, About to change, or Not in repository.',
          'An expired basis line is highlighted in yellow with two actions: "Replace basis" to insert its successor, or "Remove line". The document can still be exported, so staff make the final call.',
        ],
        items: [{ text: 'How DocOps knows which bases have expired is explained in', link: { topic: 'legal-basis-review' } }],
      },
      {
        h2: 'Bring in an existing Word file',
        paras: ['You can import a .docx file into a draft to keep editing in DocOps, and optionally let the AI re-lay it out in the correct structure.'],
      },
      {
        h2: 'Format check for incoming documents',
        paras: [
          'For documents ingested into the repository, DocOps checks 9 format parts: national title, motto, issuing body, number, place and date, summary, recipients, signature and seal. Each part is rated ok, missing or needs review, with an overall pass, needs review or fail.',
        ],
        items: [{ text: 'When you need a provision to cite, ask the repository directly with', link: { topic: 'ai-document-search' } }],
      },
    ],
    faq: [
      {
        q: 'Which document types can DocOps draft?',
        a: 'All 29 administrative document types in Article 7 of Decree 30/2020/ND-CP, including decisions, official letters, submissions, notices, plans, reports, minutes, contracts, invitations and official telegrams.',
      },
      {
        q: 'What formats does a draft export to?',
        a: 'Word (.docx) or PDF. Existing Word files can also be imported into DocOps to keep editing.',
      },
      {
        q: 'Does the AI issue documents by itself?',
        a: 'No. DocOps only writes drafts inside the app. Staff edit the content, export the file and submit it for signing through the institution process.',
      },
      {
        q: 'What if a draft cites an expired basis?',
        a: 'That basis line is labelled Expired and highlighted in yellow, with "Replace basis" and "Remove line" actions. Labels are based on the documents in your repository.',
      },
      {
        q: 'Where do the institution details in a document come from?',
        a: 'From Institution details in Settings: parent body, issuing body, place, signing authority, and the signer title and name. Fill them in once and every draft reuses them.',
      },
    ],
    share: { title: 'Decree 30 drafting', subtitle: '29 administrative document types, expired bases flagged, Word and PDF export' },
  },

  'ai-document-search': {
    name: 'AI document search',
    metaTitle: 'AI document search with citations',
    description:
      'Ask in plain language across your institution documents and get answers citing document number and article, plus diacritic-free search in about 0.01 s.',
    keywords: ['AI document search', 'document Q&A with citations', 'internal document search', 'university regulation search', 'Vietnamese full-text search without diacritics'],
    eyebrow: 'Q&A with citations',
    h1: 'AI document search where every answer names the document number and article',
    lead:
      'Ask DocOps the way you would ask a colleague who knows every regulation of your university. Answers come only from your institution repository, cite the exact document number and article, and open the source in one click.',
    card: 'Ask in plain language across your university documents; answers cite document number and article. Full-text search without diacritics.',
    inShort:
      'DocOps offers two ways to search: full-text search that ignores Vietnamese diacritics, and natural-language Q&A. Answers rely only on your institution repository, cite document number and article, and say plainly when the repository lacks a needed document instead of guessing.',
    definition: {
      h2: 'What is AI document search?',
      term: 'AI document search',
      rest: 'means asking questions in everyday language over a set of documents and getting an answer composed from those documents, with citations you can check.',
      paras: [
        'Unlike a general chatbot, a search tool for administrative documents is only useful if it answers from your own documents and shows the source. A key figure such as minimum credits or a fee must come from a specific article of a document in force, not from the model memory.',
      ],
    },
    imageAlt: 'DocOps search screen: search results and a Q&A column with document number and article citations',
    table: {
      h2: 'Shared folders, general chatbots and DocOps',
      caption: 'Comparison of document search: shared folders, general chatbots and DocOps',
      head: ['Criterion', 'Shared folder', 'General chatbot', 'DocOps'],
      rows: [
        ['Source of answers', 'You search yourself', 'The model training data', 'Only your institution repository'],
        ['Citations', 'None', 'Often missing or unverifiable', 'Document number and article, click to open'],
        ['When there is no source', 'Unknown', 'May guess', 'Says "Not found in the repository"'],
        ['Search without diacritics', 'Depends on the tool', 'Yes', 'Yes, "dinh" matches "định"'],
      ],
    },
    blocks: [
      {
        h2: 'Two ways to search in DocOps',
        items: [
          {
            title: 'Full-text search',
            text: 'searches numbers, content and articles without needing Vietnamese diacritics. On a test machine with 10,000 documents and 200,000 articles, a search takes about 0.01 s. ⌘K (Ctrl K on Windows) opens quick search on every screen.',
          },
          {
            title: 'Q&A',
            text: 'the right column of the Search screen is a conversation grounded only in your repository. The AI is instructed not to cite documents outside it and not to invent figures.',
          },
        ],
      },
      {
        h2: 'What a citation looks like',
        paras: [
          'Each answer carries citations such as "Art. 3 · 45/2023/TT-BGDĐT": the document number and the cited article. Click a citation to open that document. Each answer also shows the tokens used and the response time.',
          'When the repository lacks a needed document, DocOps says "Not found in the repository" and lists documents that were mentioned but are not in the repository, so staff know what to ingest next.',
        ],
      },
      {
        h2: 'Search by business layer',
        paras: [
          'Besides search results, the Search screen has tabs for Thresholds and figures, Hard gates and Tasks by unit. These are business rows the AI extracted at ingestion, each naming the article and document it comes from. The academic affairs office can see every academic threshold and key figure without opening each regulation.',
        ],
        items: [{ text: 'These rows also feed the impact radius described in', link: { topic: 'legal-basis-review' } }],
      },
      {
        h2: 'Where the repository comes from',
        paras: [
          'Answers are only as good as the repository. DocOps ingests PDFs, scans included: pages with a text layer are read directly, scanned pages are recognised by AI one page at a time. Number, signing date, issuing body and summary are extracted with confidence scores, then staff confirm the document into the repository.',
        ],
        items: [{ text: 'How a university builds this repository from scratch is covered in', link: { topic: 'ai-for-universities' } }],
      },
    ],
    faq: [
      {
        q: 'What sources does DocOps answer from?',
        a: 'Only your institution repository. The AI is instructed not to cite documents outside it and not to invent figures; every answer cites document number and article.',
      },
      {
        q: 'What if the repository has no document to answer from?',
        a: 'DocOps says "Not found in the repository" and lists documents that were mentioned but are not in it, instead of guessing an answer.',
      },
      {
        q: 'Do I need to type Vietnamese diacritics?',
        a: 'No. Full-text search matches without diacritics, for example "dinh" matches "định".',
      },
      {
        q: 'Is search fast on a large repository?',
        a: 'On a test machine with 10,000 documents and 200,000 articles, a full-text search takes about 0.01 s.',
      },
      {
        q: 'Do questions and documents leave my machine?',
        a: 'The repository and Q&A history stay on your machine. When you ask, DocOps sends the question with a context pack drawn from the repository through the DocOps server to the AI model provider to produce the answer.',
      },
    ],
    share: { title: 'AI document search', subtitle: 'Answers only from your repository, citing document number and article' },
  },

  'ai-for-universities': {
    name: 'AI for university administration',
    metaTitle: 'AI for university administrative offices',
    description:
      'Digital transformation of clerical work at universities: turn PDF documents into a structured repository with legal relations and cited search for every office.',
    keywords: ['AI for university administration', 'university document digital transformation', 'administrative document digitisation', 'AI for academic affairs offices', 'university document repository'],
    eyebrow: 'For universities',
    h1: 'AI for university administration: from a folder of PDFs to a knowledge repository',
    lead:
      'Digitisation does not stop at scanning. DocOps turns your university PDFs into a repository with document numbers, validity, legal relations and key figures, so every office finds what it needs.',
    card: 'Turn a folder of PDFs into a structured repository so clerical, academic affairs, legal and leadership staff find what they need.',
    inShort:
      'With DocOps, digital clerical work means every document gets its number, signing date, issuing body, summary, type, relations to other documents and business rows extracted. The repository lives on your machine, grows year after year, and does not leave when staff retire or move on.',
    definition: {
      h2: 'What does digital transformation of clerical work mean?',
      term: 'Digital transformation of clerical work',
      rest: 'means moving the receiving, storing, searching and drafting of documents from paper and loose files to structured data that software can read and cross-check, not just images of paper.',
      paras: [
        'A university works with three layers of documents: those of the Ministry of Education and Training and other ministries, internal documents issued on top of them, and the daily incoming and outgoing correspondence. How these layers relate usually lives in the heads of a few long-serving staff. When they leave, the institution loses that map.',
      ],
    },
    imageAlt: 'DocOps repository screen: ingested documents with number, type and status',
    table: {
      h2: 'Scanning vs. building a knowledge repository',
      caption: 'Comparison of scan-only digitisation and the DocOps knowledge repository',
      head: ['Aspect', 'Scanned PDFs only', 'DocOps repository'],
      rows: [
        ['Document details', 'A file name someone typed', 'Number, signing date, issuing body, summary, document type'],
        ['Relations between documents', 'None', 'Basis, guidance, amendment, replacement, repeal, with the source sentence'],
        ['Figures and thresholds', 'Open each file', 'Thresholds and figures, hard gates, tasks by unit, searchable at once'],
        ['Search', 'By file name', 'Diacritic-free full-text search and cited Q&A'],
        ['When staff leave', 'The relationship map is lost', 'Repository, graph and backups stay with the institution'],
      ],
    },
    blocks: [
      {
        h2: 'How each office uses DocOps',
        items: [
          { title: 'Clerical and administration office', text: 'ingest PDFs, check the 9 format parts of incoming documents, keep the repository complete and correct.' },
          { title: 'Academic affairs office', text: 'look up every academic threshold and key figure in the regulations in force; before amending a regulation, see which article carries the most rules.' },
          { title: 'Legal office', text: 'find internal documents resting on replaced or repealed bases and check validity as of a date.', link: { topic: 'legal-basis-review' } },
          { title: 'Leadership and specialists', text: 'ask in plain language and get answers citing number and article; draft submissions and decisions in the correct format.', link: { topic: 'decree-30-drafting' } },
        ],
      },
      {
        h2: 'Staff confirm the data, AI does the reading',
        paras: [
          'The AI reads documents (recognises scanned pages, extracts details, classifies them into the 29 types of Decree 30, extracts relations and business rows). Staff confirm the data at three points: confirming each document into the repository or returning it to source, approving relations with confidence below 0.85, and comparing against the original image when the software flags something suspicious. Every decision goes into an append-only audit trail.',
        ],
      },
      {
        h2: 'Where your data lives',
        items: [
          { text: 'The repository sits on your machine (an SQLite database), with backup and restore to local files.' },
          { text: 'One activation key and one separate repository per institution; the number of devices is set by Agentra per key.' },
          { text: 'Only what needs AI goes through the DocOps server to the model provider: document text for AI steps, page images for recognition, drafting briefs and the context pack of each question.' },
          { text: 'Details on data and AI use are on', link: { page: '/ai-transparency', label: 'AI and data transparency' } },
        ],
      },
      {
        h2: 'Up and running in one session',
        ordered: true,
        items: [
          { text: 'Download DocOps for Windows or macOS and request a key from the Activation screen.' },
          { text: 'Fill in Institution details once in Settings.' },
          { text: 'Ingest the documents you use most first: training regulations, academic rules and the circulars they rest on.' },
          { text: 'Confirm documents into the repository, then open Review and Search to start working.' },
        ],
      },
    ],
    faq: [
      {
        q: 'Does DocOps replace the university incoming/outgoing correspondence system?',
        a: 'No. DocOps does not handle the incoming/outgoing correspondence flow or digital signatures. It works on document content: building a knowledge repository, cited search, legal basis review and Decree 30 drafting, with Word or PDF export.',
      },
      {
        q: 'Which formats can DocOps ingest?',
        a: 'PDF, scanned PDF included. Pages with a text layer are read directly; scanned pages are recognised by AI one page at a time. Word files are used in drafting.',
      },
      {
        q: 'Who at a university should use DocOps?',
        a: 'Clerical, administration, academic affairs and legal staff, plus leaders and specialists who search or draft documents. Each machine is activated with the institution key; the number of devices is set by Agentra per key.',
      },
      {
        q: 'What does a university need to get started?',
        a: 'A Windows 10/11 or macOS 13+ computer with internet access, the institution activation key and the PDFs of the documents in use. No dedicated server is needed.',
      },
      {
        q: 'Is data lost when we change computers?',
        a: 'Not if you back up. Go to Settings, Backup and restore to create a backup file, then restore it on the new machine. Restore builds the repository beside the live one, so a failure midway leaves current data untouched.',
      },
    ],
    share: { title: 'AI for universities', subtitle: 'From a folder of PDFs to a knowledge repository for every office' },
  },
}
