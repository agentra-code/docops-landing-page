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
    h1: 'Legal basis review: find documents that rest on expired references',
    lead:
      'When new circulars or decrees are issued, your organization\'s regulations and decisions may still rest on bases that have been replaced. DocOps scans the whole repository, shows which documents need changing and why, with the source sentence as evidence.',
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
          'Review answers the question after the law has changed. Impact radius answers it before: how many key figures (years, ratios, fees, credits), hard gates and thresholds in the repository rest on a given article.',
          'DocOps counts the business rows that cite each article and draws each article as a bubble; the bigger the bubble, the more places to re-check. The count runs on your machine, is deterministic, calls no AI and uses no tokens. On the sample repository that ships with the product (104 documents, 206 articles, 280 relations), the heaviest article is cited by 12 business rows.',
        ],
      },
      {
        h2: 'What uses AI and what runs locally',
        items: [
          { title: 'Uses AI', text: 'reading documents and extracting cross-references and three business layers (key figures, hard gates, thresholds) from their content.' },
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
          { text: 'Ingest the PDFs you rely on as bases: circulars and decisions of higher authorities plus your internal documents.' },
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
    keywords: ['Decree 30 document drafting', 'AI drafting of administrative documents', 'Decree 30/2020/ND-CP templates', 'drafting decisions, submissions and notices with AI'],
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
        items: [
          { text: 'When you need a provision to cite, ask the repository directly with', link: { topic: 'ai-document-search' } },
          { text: 'The full set of format parts and layout rules under Decree 30 is on', link: { topic: 'administrative-document-format' } },
        ],
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
      'Ask DocOps the way you would ask a colleague who knows every regulation of your organization. Answers come only from your institution repository, cite the exact document number and article, and open the source in one click.',
    card: 'Ask in plain language across your organization’s documents; answers cite document number and article. Full-text search without diacritics.',
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
          'Besides search results, the Search screen has a Thresholds and figures tab and a Hard gates tab. These are business rows the AI extracted at ingestion, each naming the article and document it comes from. At a university, the academic affairs office sees every academic threshold and key figure without opening each regulation.',
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
        ['Figures and thresholds', 'Open each file', 'Thresholds and figures and hard gates, searchable at once'],
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
          { title: 'Beyond universities', text: 'agencies, companies and organizations use the same features, see', link: { topic: 'ai-for-organizations' } },
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
  'ai-for-organizations': {
    name: 'Document AI for agencies and companies',
    metaTitle: 'Document AI for agencies and companies',
    description:
      'DocOps reads, classifies, searches with citations and drafts Decree 30 documents for agencies, companies and associations, alongside your e-Office system.',
    keywords: [
      'administrative document AI for agencies and companies',
      'AI for corporate records and clerical work',
      'document AI for unions and organizations',
      'internal company document search',
      'internal document knowledge base',
    ],
    eyebrow: 'For agencies and companies',
    h1: 'Administrative document AI for agencies and companies, under Decree 30',
    lead:
      'Which of your documents rest on a circular that has been replaced? What does the internal regulation say about this, and in which Article? DocOps answers from your own repository and drafts to the Decree 30 format, so clerical, administration and legal staff work faster and still review everything themselves.',
    card: 'For people’s committees, departments, companies, unions and associations: your own repository, cited search, legal basis review, Decree 30 drafting.',
    inShort:
      'DocOps works for any organization that formats documents under Decree 30/2020/NĐ-CP, not just schools. The organization ingests PDF documents into its own repository on the machine, then searches with citations, reviews expired legal bases and drafts all 29 types of administrative document. DocOps runs alongside the incoming/outgoing document system already in use.',
    definition: {
      h2: 'Which organizations DocOps serves',
      term: 'Agentra DocOps',
      rest: 'is AI software for the administrative documents of universities, agencies, companies and organizations that format documents under Decree 30/2020/NĐ-CP on clerical work.',
      paras: [
        'Under Article 2 of the Decree, state agencies and organizations and state-owned enterprises apply it directly; political organizations, socio-political organizations, social organizations and socio-professional organizations apply it as appropriate, based on the Decree together with the regulations of the Communist Party and of the law. Non-state companies are not bound by it, but can adopt this format as the standard for internal documents.',
        'Laws, decrees and circulars are not administrative documents, but DocOps tracks them as legal bases: which document cites which, and which has been replaced, repealed or not yet taken effect.',
      ],
    },
    imageAlt: 'DocOps graph screen: an expired circular, the decision that rests on it and the documents pulled along, coloured by validity',
    table: {
      h2: 'Everyday clerical work: by hand and with DocOps',
      caption: 'Comparison of how five common clerical tasks at agencies and companies are done by hand and with DocOps',
      head: ['Task', 'By hand', 'With DocOps'],
      rows: [
        ['Find the internal rule on a matter', 'Open folder after folder, reread each document', 'Ask in plain words; the answer cites the number and Article, click to open the source document'],
        ['Know which documents rest on a replaced circular', 'Remember or check by hand', 'Warnings across the whole repository: replaced, repealed, not yet in force'],
        ['Draft a notice, decision or submission', 'Open an old document as a template, edit it line by line', 'Write one sentence of intent, get a draft in the right format, export to Word or PDF'],
        ['Check the format of an incoming document', 'Check by eye', 'Check 9 format items, each marked passed, missing or needs review'],
        ['Keep document knowledge when staff move on', 'Lives in the departed person’s head', 'A repository with numbers, validity and legal relations, building up year by year'],
      ],
    },
    blocks: [
      {
        h2: 'What DocOps does for your organization',
        items: [
          { title: 'Ingest', text: 'PDF, scans included: pages are recognised one at a time, with the number, signing date, issuing body and subject extracted; staff confirm each document into the repository.' },
          { title: 'Classify', text: 'files each document under one of the 29 types of administrative document in Decree 30; the full list is on', link: { topic: 'administrative-document-types' } },
          { title: 'Search', text: 'full-text search without typing accents, plain-language questions and answers that cite the number and Article, see', link: { topic: 'ai-document-search' } },
          { title: 'Legal basis review', text: 'warns about documents resting on bases that are replaced, repealed or not yet in force, see', link: { topic: 'legal-basis-review' } },
          { title: 'Drafting', text: 'decisions, notices, submissions, plans, reports… from one sentence of intent, see', link: { topic: 'decree-30-drafting' } },
          { title: 'Universities', text: 'get a dedicated section for academic affairs and academic regulations, see', link: { topic: 'ai-for-universities' } },
        ],
      },
      {
        h2: 'Runs alongside your document management system',
        paras: [
          'DocOps does not handle the incoming/outgoing document flow, submission for signature or digital signing. Your e-Office or document management software keeps that role unchanged.',
          'DocOps works on document content: building a knowledge repository, cited search, legal basis review and drafting. Drafts export to Word or PDF to enter your existing issuance process.',
        ],
      },
      {
        h2: 'Where your organization’s data lives',
        items: [
          { text: 'The repository lives on the machine (a SQLite database); each organization has its own key and its own repository; backup and restore happen on the machine.' },
          { text: 'AI steps (recognising scanned pages, classification, question answering, drafting) send content through the DocOps server to an AI model, by default Anthropic’s Claude. The server does not store the content.' },
          { text: 'Details on how DocOps uses AI and protects data are on', link: { page: '/ai-transparency', label: 'AI and data transparency' } },
        ],
      },
      {
        h2: 'What DocOps does not do yet',
        items: [
          { text: 'It ingests PDF files only; Word files are usable in drafting (importing .docx into a draft).' },
          { text: 'Communist Party documents and those of organizations with their own format guidance (no National Title or Motto) are not supported: the drafting template always includes the National Title and Motto, and the format check scores against Decree 30.' },
          { text: 'It does not manage accounting vouchers such as invoices, receipts or payment vouchers.' },
          { text: 'The app interface is in Vietnamese.' },
        ],
      },
      {
        h2: 'Getting started with DocOps',
        ordered: true,
        items: [
          { text: 'Download and install DocOps for Windows or macOS on', link: { page: '/download', label: 'Download' } },
          { text: 'Request a key for your organization in the app, or through', link: { page: '/contact', label: 'Contact' } },
          { text: 'Fill in the organization details (parent body, issuing body, place name, signer) so drafts fill in the format parts automatically.' },
          { text: 'Ingest the documents you rely on as bases and your internal documents, then confirm each one into the repository.' },
        ],
      },
    ],
    faq: [
      { q: 'Can a private company use DocOps?', a: 'Yes. A key is not limited by type of organization. Decree 30 does not bind non-state companies, but if the organization formats documents this way, DocOps classifies, searches, reviews and drafts just as it does for state agencies.' },
      { q: 'Does DocOps replace e-Office or an incoming/outgoing document system?', a: 'No. DocOps does not handle the incoming/outgoing flow, submission for signature or digital signing. It works on document content and exports drafts to Word or PDF to enter the process you already use.' },
      { q: 'Can Communist Party documents or those with their own format be used?', a: 'Not yet. These documents do not use the National Title and Motto, while DocOps drafts and checks format under Decree 30, so they would be judged as missing components.' },
      { q: 'Does DocOps manage accounting vouchers?', a: 'No. DocOps works with the 29 types of administrative document in Decree 30 and the legal documents they rest on. Invoices, receipts, payment vouchers and other accounting vouchers are out of scope.' },
      { q: 'Where is the organization’s document data kept?', a: 'On your machine. The DocOps server only passes content to the AI model for steps that need AI and does not store it. Each organization has its own key and repository.' },
    ],
    share: { title: 'Agencies and companies', subtitle: 'Your own repository, cited search, Decree 30 drafting' },
  },
  'administrative-document-types': {
    name: 'Administrative document types',
    metaTitle: '29 administrative document types in Vietnam',
    description:
      'All 29 administrative document types in Article 7 of Decree 30/2020/ND-CP, abbreviations from Appendix III, how to write reference numbers and common mix-ups.',
    keywords: ['types of administrative documents', '29 administrative document types under Decree 30', 'document type abbreviations Vietnam', 'Vietnamese document reference number format', 'certified copy, extract, duplicate'],
    eyebrow: 'Records management basics',
    h1: 'Types of administrative documents under Decree 30 and their abbreviations',
    lead: 'Decree 30/2020/ND-CP defines 29 types of administrative document and gives official abbreviations for 27 of them. The table below lists all 29, how the number and reference code are put together, and the three kinds of copy.',
    card: 'All 29 administrative document types in Decree 30, their official abbreviations, how to write the reference code and the pairs people mix up.',
    inShort:
      'Article 7 of Decree 30/2020/ND-CP lists 29 types of administrative document, from resolution (individual) and decision (individual) to official letter, invitation and letter of greeting. Appendix III gives abbreviations for 27 of them; the official letter and the letter of greeting have no type abbreviation. A reference code joins the type abbreviation to the issuing body’s abbreviation, for example 15/QĐ-ABC.',
    definition: {
      h2: 'Which types count as administrative documents',
      term: 'Administrative documents',
      rest: 'are the group of documents governed by Government Decree 30/2020/ND-CP of 5 March 2020 on clerical work, 29 types listed in Article 7. They are distinct from legal normative documents such as laws, decrees and circulars.',
      paras: ['The word “individual” (cá biệt) after resolution and decision separates them from resolutions and decisions that are legal normative documents.'],
    },
    imageAlt: 'DocOps Drafting screen: a draft administrative document on an A4 page, with a validity label on each line of legal basis',
    table: {
      h2: 'Table of the 29 administrative document types and abbreviations',
      caption: 'Type names from Article 7, abbreviations from Appendix III of Decree 30/2020/ND-CP. ABC stands for the issuing body’s abbreviation, VP for the drafting unit’s abbreviation. Abbreviations and examples stay in Vietnamese.',
      head: ['Document type', 'Abbreviation', 'Example number and code'],
      rows: [
        ['Resolution, individual (Nghị quyết cá biệt)', 'NQ', '15/NQ-ABC'],
        ['Decision, individual (Quyết định cá biệt)', 'QĐ', '15/QĐ-ABC'],
        ['Directive (Chỉ thị)', 'CT', '15/CT-ABC'],
        ['Regulations (Quy chế)', 'QC', '15/QC-ABC'],
        ['Rules (Quy định)', 'QyĐ', '15/QyĐ-ABC'],
        ['Communiqué (Thông cáo)', 'TC', '15/TC-ABC'],
        ['Notice (Thông báo)', 'TB', '15/TB-ABC'],
        ['Guidelines (Hướng dẫn)', 'HD', '15/HD-ABC'],
        ['Programme (Chương trình)', 'CTr', '15/CTr-ABC'],
        ['Plan (Kế hoạch)', 'KH', '15/KH-ABC'],
        ['Scheme (Phương án)', 'PA', '15/PA-ABC'],
        ['Project proposal (Đề án)', 'ĐA', '15/ĐA-ABC'],
        ['Project (Dự án)', 'DA', '15/DA-ABC'],
        ['Report (Báo cáo)', 'BC', '15/BC-ABC'],
        ['Minutes (Biên bản)', 'BB', '15/BB-ABC'],
        ['Submission (Tờ trình)', 'TTr', '15/TTr-ABC'],
        ['Contract (Hợp đồng)', 'HĐ', '15/HĐ-ABC'],
        ['Official letter (Công văn)', 'Không có', '15/ABC-VP'],
        ['Telegram (Công điện)', 'CĐ', '15/CĐ-ABC'],
        ['Memorandum (Bản ghi nhớ)', 'BGN', '15/BGN-ABC'],
        ['Agreement (Bản thỏa thuận)', 'BTT', '15/BTT-ABC'],
        ['Letter of authorization (Giấy ủy quyền)', 'GUQ', '15/GUQ-ABC'],
        ['Invitation (Giấy mời)', 'GM', '15/GM-ABC'],
        ['Letter of introduction (Giấy giới thiệu)', 'GGT', '15/GGT-ABC'],
        ['Leave form (Giấy nghỉ phép)', 'GNP', '15/GNP-ABC'],
        ['Forwarding slip (Phiếu gửi)', 'PG', '15/PG-ABC'],
        ['Transfer slip (Phiếu chuyển)', 'PC', '15/PC-ABC'],
        ['Notification slip (Phiếu báo)', 'PB', '15/PB-ABC'],
        ['Letter of greeting (Thư công)', 'Không có', 'Không quy định chữ viết tắt tên loại'],
      ],
    },
    blocks: [
      {
        h2: 'How to write the number and reference code',
        items: [
          { text: 'The number is the document’s sequence number within the year, registered at the records office, in Arabic numerals. Numbers below 10 get a leading 0, for example 05.' },
          { text: 'The reference code is the type abbreviation plus the issuing body’s abbreviation, for example 15/QĐ-ABC.' },
          { text: 'For an official letter, the code is the issuing body’s abbreviation plus the drafting unit’s or field’s abbreviation, for example 15/ABC-VP.' },
          { text: 'A slash (/) separates the number from the code and a hyphen (-) separates the abbreviation groups, with no spaces.' },
          { text: 'The abbreviations of the issuing body and the drafting unit are set by the head of the agency or organization.' },
        ],
      },
      {
        h2: 'Abbreviation pairs people mix up',
        items: [
          { title: 'QĐ and QyĐ', text: 'QĐ is a decision, QyĐ is rules (quy định).' },
          { title: 'ĐA and DA', text: 'ĐA is a project proposal (đề án), DA is a project (dự án).' },
          { title: 'HD and HĐ', text: 'HD is guidelines (hướng dẫn), HĐ is a contract (hợp đồng).' },
          { title: 'CT and CTr', text: 'CT is a directive (chỉ thị), CTr is a programme (chương trình).' },
          { title: 'TTr and TT', text: 'TTr is a submission (tờ trình), an administrative document. TT is commonly used for circulars, which are legal normative documents and are not in this table.' },
        ],
      },
      {
        h2: 'The three kinds of copy',
        items: [
          { title: 'Certified true copy: SY', text: 'abbreviation from Appendix III.' },
          { title: 'Extract copy: TrS', text: 'abbreviation from Appendix III.' },
          { title: 'Duplicate from the original: SL', text: 'abbreviation from Appendix III.' },
        ],
      },
      {
        h2: 'Layout templates in Appendix III',
        ordered: true,
        items: [
          { text: 'Template 1.1: Resolution (individual).' },
          { text: 'Template 1.2: Decision (individual) with direct provisions.' },
          { text: 'Template 1.3: Decision (individual) with indirect provisions.' },
          { text: 'Template 1.4: Documents that carry a type name.' },
          { text: 'Template 1.5: Official letter.' },
          { text: 'Template 1.6: Telegram.' },
          { text: 'Template 1.7: Invitation.' },
          { text: 'Template 1.8: Letter of introduction.' },
          { text: 'Template 1.9: Minutes.' },
          { text: 'Template 1.10: Leave form.' },
          { text: 'The format of each component (National Title, number and code, signature, recipients…) under Appendix I of Decree 30 is covered on', link: { topic: 'administrative-document-format' } },
        ],
      },
      {
        h2: 'How DocOps uses this table',
        items: [
          { title: 'When ingesting', text: 'AI files each document under one of the 29 types. Documents outside the table, such as laws, decrees and circulars, are filed as “Other” and are still tracked as legal bases; staff confirm the result.' },
          { title: 'When drafting', text: 'you pick one of the 29 types and the reference code uses the abbreviations in the table above, see', link: { topic: 'decree-30-drafting' } },
        ],
      },
    ],
    faq: [
      { q: 'How many types of administrative document are there?', a: 'There are 29, listed in Article 7 of Decree 30/2020/ND-CP, from resolution (individual) to letter of greeting.' },
      { q: 'What is the abbreviation for an official letter?', a: 'An official letter (công văn) has no type abbreviation. Its reference code is the issuing body’s abbreviation plus the drafting unit’s abbreviation, for example 15/ABC-VP.' },
      { q: 'Is the abbreviation for “quy định” QĐ or QyĐ?', a: 'It is QyĐ. QĐ is the abbreviation for a decision (quyết định).' },
      { q: 'Is a circular an administrative document?', a: 'No. A circular is a legal normative document and is not among the 29 types in Article 7. DocOps tracks circulars as legal bases of administrative documents.' },
      { q: 'What is the abbreviation for an extract copy?', a: 'The extract copy (bản trích sao) is TrS. The certified true copy (bản sao y) is SY and the duplicate from the original (bản sao lục) is SL.' },
    ],
    share: { title: '29 document types', subtitle: 'Official Decree 30 abbreviations and how to write reference numbers' },
  },
  'administrative-document-format': {
    name: 'Administrative document format',
    metaTitle: 'Administrative document format, Decree 30',
    description:
      'The nine main format parts in Article 8 of Decree 30/2020/ND-CP, plus paper size, margins, font and sizes from Appendix I, with a checklist before signing.',
    keywords: ['administrative document format', 'how to format documents under Decree 30', 'check document format', 'Vietnamese document layout rules', 'administrative document margins'],
    eyebrow: 'Records management basics',
    h1: 'Administrative document format under Decree 30: nine parts and layout rules',
    lead: 'The format of a document is the set of parts an administrative document must carry; the layout rules are the paper size, margins, font and sizes of each part. This page summarizes both under Decree 30/2020/ND-CP, with a checklist to run before signing.',
    card: 'The nine main format parts, margins, font and sizes from Appendix I of Decree 30, and a checklist to run before a document goes for signature.',
    inShort:
      'Under Article 8 of Decree 30/2020/ND-CP, an administrative document has nine main parts: National Title and Motto; name of the issuing body; number and reference code; place and date; type and summary; content; position, name and signature of the authorized person; seal or digital signature of the body; recipients. The paper is A4, the font is Times New Roman, and margins are 20–25 mm top and bottom, 30–35 mm left and 15–20 mm right.',
    definition: {
      h2: 'What is document format',
      term: 'Document format (thể thức văn bản)',
      rest: 'is the set of parts that make up a document: the main parts that apply to every type of document and the additional parts used in specific cases (Article 8, clause 1, Decree 30/2020/ND-CP).',
      paras: ['Layout rules cover paper size, page orientation, margins, font, font size, font style, the position of each part and page numbers (Article 9). The detail is in Appendix I; capitalization follows Appendix II; type abbreviations follow Appendix III.'],
    },
    imageAlt: 'DocOps Drafting screen: a draft administrative document on an A4 page, with a validity label on each line of legal basis',
    table: {
      h2: 'Layout rules in Appendix I',
      caption: 'General rules and font sizes of the main parts under Appendix I of Decree 30/2020/ND-CP.',
      head: ['Element', 'Rule'],
      rows: [
        ['Paper size', 'A4 (210 mm x 297 mm), portrait'],
        ['Top and bottom margins', '20–25 mm'],
        ['Left margin', '30–35 mm'],
        ['Right margin', '15–20 mm'],
        ['Font', 'Times New Roman, Unicode character set TCVN 6909:2001, black'],
        ['National Title (Quốc hiệu)', 'Capitals, size 12–13, upright, bold'],
        ['Motto (Tiêu ngữ)', 'Lower case, size 13–14, upright, bold, underlined with a line as long as the text'],
        ['Issuing body name', 'Capitals, size 12–13, upright, bold, underlined with a line 1/3–1/2 the length of the text'],
        ['Number and reference code', 'Size 13; “Số” in lower case, reference code in capitals'],
        ['Place and date', 'Lower case, size 13–14, italic'],
        ['Document type name', 'Capitals, size 13–14, upright, bold'],
        ['Summary', 'Lower case, size 13–14, upright, bold; in an official letter it follows “V/v”, size 12–13'],
        ['Content', 'Lower case, size 13–14, justified, first-line indent 1 cm or 1.27 cm, at least 6pt between paragraphs, line spacing from single to 1.5 lines'],
        ['Signing authority and position', 'Capitals, size 13–14, upright, bold'],
        ['Signer’s name', 'Lower case, size 13–14, upright, bold'],
        ['Recipients (Nơi nhận)', '“Nơi nhận:” size 12, italic, bold; the list size 11, upright'],
        ['Page number', 'Size 13–14, centred in the top margin, not shown on the first page'],
      ],
    },
    blocks: [
      {
        h2: 'The nine main format parts',
        ordered: true,
        items: [
          { title: 'National Title and Motto', text: 'at the top right of the first page. The National Title “CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM” is in capitals, size 12–13, bold. The Motto “Độc lập - Tự do - Hạnh phúc” is in lower case, size 13–14, bold, centred under the National Title and underlined with a line as long as the text.' },
          { title: 'Name of the issuing agency or organization', text: 'the full official name, plus the name of the directly supervising body if there is one. The issuing body’s name is in capitals, size 12–13, bold, underlined with a line 1/3–1/2 the length of the text.' },
          { title: 'Number and reference code', text: 'the number is the sequence number within the year, registered at the records office; numbers below 10 get a leading 0. The code joins the type abbreviation to the body’s abbreviation, size 13. The abbreviations are listed on', link: { topic: 'administrative-document-types' } },
          { title: 'Place and date of issue', text: 'lower case, size 13–14, italic, on the same line as the number and code. A comma follows the place name; days below 10 and months 1 and 2 get a leading 0.' },
          { title: 'Type and summary', text: 'the type name is in capitals, size 13–14, bold; the summary is in lower case, size 13–14, bold, right under the type name. An official letter writes its summary after “V/v”, in lower case, size 12–13.' },
          { title: 'Content', text: 'lower case, size 13–14, justified, first-line indent 1 cm or 1.27 cm, at least 6pt between paragraphs, line spacing from single to 1.5 lines.' },
          { title: 'Position, name and signature of the authorized person', text: 'the signing authority is written TM., Q., KT., TL. or TUQ. The authority and position are in capitals, size 13–14, bold; the name is in lower case, size 13–14, bold, with no academic title or degree before it, unless the head of the sector rules otherwise for armed forces and for education, health and science public-service bodies.' },
          { title: 'Seal or digital signature of the body', text: 'on an electronic document this is a red seal image at real size, as a transparent-background .png, overlapping about 1/3 of the authorized person’s digital signature image on its left side.' },
          { title: 'Recipients', text: '“Nơi nhận:” is size 12, italic, bold; the list is size 11, upright; the last line reads “Lưu: VT” followed by the drafting unit and the number of copies.' },
        ],
      },
      {
        h2: 'Additional parts',
        items: [
          { title: 'Appendix', text: 'attached to the document when needed (Article 8, clause 3, point a).' },
          { title: 'Confidentiality, urgency and circulation marks', text: 'urgency levels are hỏa tốc, thượng khẩn and khẩn; confidentiality levels are tuyệt mật, tối mật and mật; circulation notes include “XEM XONG TRẢ LẠI” and “LƯU HÀNH NỘI BỘ”.' },
          { title: 'Drafter’s code and number of copies issued', text: 'an additional part under Article 8, clause 3, point c: the drafter’s code and the number of copies issued.' },
          { title: 'Address, email, website, phone and fax of the body', text: 'an additional part under Article 8, clause 3, point d: the body’s address, email, website, phone and fax number.' },
        ],
      },
      {
        h2: 'Checklist before signing',
        items: [
          { text: 'The National Title and Motto are spelled correctly and the Motto has its hyphens.' },
          { text: 'The supervising body and the issuing body are named exactly as officially registered.' },
          { text: 'The number was issued by the records office at registration and the reference code uses the right type abbreviation.' },
          { text: 'A comma follows the place name; days below 10 and months 1 and 2 have a leading 0.' },
          { text: 'The summary is short and reflects the main content.' },
          { text: 'The legal bases are still in force; the first citation gives the type, number, code, date, issuing body and summary in full. How to review them is covered on', link: { topic: 'legal-basis-review' } },
          { text: 'The signing authority is right: TM., Q., KT., TL. or TUQ.' },
          { text: 'The recipient list is complete and ends with “Lưu: VT”.' },
          { text: 'Margins, font and sizes match the layout table above.' },
        ],
      },
      {
        h2: 'How DocOps checks format',
        paras: [
          'For documents already ingested into the repository, DocOps checks nine items: National Title, Motto, issuing body name, number and code, place and date, type and summary, recipients, signature and seal. The National Title and the Motto are separate items and the content is not graded, so the count differs from the nine parts in Article 8. Each item is marked pass, missing or needs review; the overall result is pass, needs review or fail. AI does the grading and staff review the result.',
          'DocOps does not measure the margins, font or font size of a file.',
        ],
        items: [{ text: 'Drafts written by DocOps follow the Decree 30 template, see', link: { topic: 'decree-30-drafting' } }],
      },
    ],
    faq: [
      { q: 'How many format parts does an administrative document have?', a: 'Nine main parts that apply to every document, plus four groups of additional parts: appendices; confidentiality, urgency and circulation marks; the drafter’s code and number of copies; and the body’s address and contact details. The source is Article 8 of Decree 30/2020/ND-CP.' },
      { q: 'What margins does an administrative document use?', a: 'Under Appendix I of Decree 30, 20–25 mm at the top and bottom, 30–35 mm on the left and 15–20 mm on the right, on A4 paper.' },
      { q: 'Which font and size does an administrative document use?', a: 'Times New Roman, Unicode character set TCVN 6909:2001, in black. Content is size 13–14, the National Title is size 12–13 and the Motto is size 13–14.' },
      { q: 'Is the first page numbered?', a: 'No. Pages are numbered from 1 in Arabic numerals, size 13–14, centred in the top margin, but the number is not shown on the first page.' },
      { q: 'How is the date of issue written?', a: 'Place and date are in lower case italics with a comma after the place name. Days below 10 and months 1 and 2 get a leading 0, for example “Hà Nội, ngày 05 tháng 02 năm 2026”.' },
    ],
    share: { title: 'Decree 30 format', subtitle: 'Nine main parts, margins, font, sizes and a checklist before signing' },
  },
  'docops-vs-chatgpt': {
    name: 'DocOps vs ChatGPT',
    metaTitle: 'DocOps vs ChatGPT for official documents',
    description:
      'DocOps vs ChatGPT for administrative documents: where answers come from, citations to number and article, validity checks, Decree 30 format and where data goes.',
    keywords: ['ChatGPT for administrative documents', 'DocOps vs ChatGPT', 'drafting administrative documents with ChatGPT', 'AI comparison for records officers', 'data privacy when using ChatGPT'],
    eyebrow: 'Comparison',
    h1: 'ChatGPT for administrative documents, or DocOps? An honest comparison',
    lead: 'ChatGPT writes well and knows a lot. DocOps does something narrower: it answers from the agency’s own document repository, cites the document number and Article, knows which legal bases have expired and drafts in the Decree 30 format. The table below compares them point by point, including where ChatGPT is the better fit.',
    card: 'An honest comparison for administrative documents: answer sources, citations, validity of legal bases, format and data.',
    inShort:
      'ChatGPT is a general-purpose assistant that answers from the model’s knowledge, web search and files you upload. DocOps is a desktop app built only for administrative documents: answers come only from the agency’s repository with the document number and Article cited, expired legal bases are flagged and drafts follow the Decree 30 template. Use ChatGPT for general writing; use DocOps when the answer must rest on the agency’s own documents.',
    definition: {
      h2: 'Where they differ',
      term: 'The main difference',
      rest: 'is the source of the answer: ChatGPT answers from general knowledge and whatever you bring into the conversation, while DocOps answers only from the repository the agency has ingested and drops any document that is not in it.',
      paras: ['Information about ChatGPT on this page comes from OpenAI’s help pages, checked on 8 October 2026. ChatGPT’s features and policies can change; read the original pages before you decide.'],
    },
    imageAlt: 'DocOps search screen: search results and a Q&A column with document number and article citations',
    table: {
      h2: 'Point-by-point comparison',
      caption: 'ChatGPT and DocOps compared for administrative documents, based on OpenAI’s help pages and DocOps documentation, 8 October 2026',
      head: ['Criterion', 'ChatGPT', 'DocOps'],
      rows: [
        ['Source of answers', 'The model’s knowledge, web search, files you upload and connected apps such as Google Drive; files in a project (Projects) are available to that project’s chats', 'Only the repository the agency has ingested and staff have confirmed'],
        ['Citations', 'Source links when web search is used', 'Every answer cites the document number and Article, and one click opens the original document'],
        ['When there is no information', 'May answer from the model’s general knowledge; the user needs to check numbers and citations', 'Says “Chưa tìm thấy trong kho” (not found in the repository); documents the AI mentions that are not in the repository are dropped and a warning is shown'],
        ['Expired legal bases', 'Does not track replacement or repeal relationships between the agency’s documents', 'Warns about replaced, repealed or not-yet-effective bases across the whole repository, as of any chosen date'],
        ['Drafting', 'Writes from your prompt; the format depends on the prompt and the user checks it', 'Templates for the 29 types in Decree 30, fills in the agency’s details, proposes only legal bases still in force, exports Word and PDF'],
        ['Data and training', 'Personal plans: conversations may be used to train models unless “Improve the model for everyone” is turned off; even then, giving thumbs up or down on a response may let the whole conversation be used. Business, Enterprise and Edu plans: not used for training by default', 'The repository is stored on the device; content goes through the DocOps server to the AI model for processing and the server does not store it; Agentra does not use the agency’s data for training'],
        ['How it is used', 'On the web, desktop apps and phones', 'Desktop app for Windows and macOS, activated with the agency’s key'],
        ['Scope', 'General purpose: writing, translating, summarizing and much more', 'Administrative documents only: ingest, classify, search, review, draft'],
      ],
    },
    blocks: [
      {
        h2: 'When ChatGPT is the better fit',
        items: [
          { text: 'Writing letters, speeches and communications that need no legal basis.' },
          { text: 'Asking general questions and explaining concepts.' },
          { text: 'Translating or summarizing a single document.' },
          { text: 'An agency with no document repository yet that just needs a quick draft to edit by hand.' },
        ],
      },
      {
        h2: 'When DocOps is the better fit',
        items: [
          { text: 'Answers must cite the documents the agency actually applies, see', link: { topic: 'ai-document-search' } },
          { text: 'You need to know which documents rest on a replaced legal basis, see', link: { topic: 'legal-basis-review' } },
          { text: 'Drafting decisions, submissions and notices in the right format with legal bases still in force, see', link: { topic: 'decree-30-drafting' } },
          { text: 'You want the repository on your own device and a log of staff decisions, see', link: { page: '/ai-transparency', label: 'AI transparency' } },
        ],
      },
      {
        h2: 'Before putting internal documents into ChatGPT',
        paras: [
          'On a personal account, check Data Controls and turn off “Improve the model for everyone” if you do not want conversations used for training. Note that even with it off, giving thumbs up or down on a response may let the whole conversation be used for training. Classified documents and documents with personal data must follow the agency’s rules on state secrets and personal data protection, whichever AI tool is used.',
        ],
        items: [
          { text: 'ChatGPT training and data settings:', link: { href: 'https://help.openai.com/en/articles/7730893-data-controls-in-chatgpt', label: 'Data controls in ChatGPT (OpenAI)' } },
          { text: 'How files and apps in a project are used:', link: { href: 'https://help.openai.com/en/articles/10169521-projects-in-chatgpt', label: 'Projects in ChatGPT (OpenAI)' } },
        ],
      },
      {
        h2: 'Using both',
        paras: ['The two tools do not exclude each other. One way to split the work: ChatGPT for free writing that does not rest on the agency’s documents, DocOps for every question and draft that must rest on the repository and on legal bases still in force.'],
      },
    ],
    faq: [
      { q: 'Does DocOps use ChatGPT inside?', a: 'No. DocOps’s default model is Claude by Anthropic; Agentra can configure another model per agency, such as GLM. Content goes through the DocOps server to the model provider and the server does not store it.' },
      { q: 'Is it safe to upload an agency’s documents to ChatGPT?', a: 'It depends on the plan and settings. According to OpenAI, conversations on personal plans may be used for training unless you turn off “Improve the model for everyone”, and giving thumbs up or down on a response can still let the whole conversation be used; Business, Enterprise and Edu plans do not use data for training by default. Classified documents should not go into any online AI service the agency’s rules do not allow.' },
      { q: 'Can ChatGPT draft documents under Decree 30?', a: 'It can draft from a prompt, but ChatGPT does not know your agency’s details unless you provide them, does not know which legal bases in your repository are still in force, and the user has to check the format. DocOps uses the Decree 30 templates for 29 document types, fills in the agency’s details and proposes only legal bases still in force in the repository.' },
      { q: 'Is DocOps free?', a: 'Downloading and installing DocOps is free; usage is priced by the size of the agency, contact us for a quote.' },
      { q: 'Should I choose DocOps or ChatGPT?', a: 'Choose by the source of answer you need. General writing that needs no legal basis: ChatGPT. Answers and drafts that must rest on the documents the agency applies and on legal bases still in force: DocOps. Many tasks can use both.' },
    ],
    share: { title: 'DocOps vs ChatGPT', subtitle: 'Answer sources, citations, validity checks and data' },
  },
}
