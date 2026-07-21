export type Signal = "okay" | "check" | "stop";

export type DetectiveAnswer = {
  firstSignal?: Signal;
  firstReason?: number;
  evidence?: number;
  affected?: number;
  value?: string;
  discussionSide?: "A" | "B";
  action?: number;
  finalSignal?: Signal;
  changeReason?: string;
};

export type EthicsCase = {
  id: number;
  caseNo: string;
  badge: string;
  topic: string;
  title: string;
  question: string;
  scene: string;
  aiHelp: string;
  clues: string[];
  reasonOptions: string[];
  people: { name: string; impact: string }[];
  evidenceOptions: { label: string; detail: string; strong: boolean }[];
  values: string[];
  discussion: {
    question: string;
    sides: { id: "A" | "B"; title: string; description: string }[];
    prompts: string[];
  };
  actions: { text: string; recommended: boolean; why: string }[];
  principle: string;
  checklist: { stage: "사용 전" | "사용 중" | "사용 후"; text: string };
};

export const signalOptions: { id: Signal; label: string; description: string; symbol: string }[] = [
  { id: "okay", label: "괜찮아요", description: "지금 그대로 해도 괜찮다고 생각해요", symbol: "○" },
  { id: "check", label: "확인이 필요해요", description: "더 알아보거나 허락을 받아야 해요", symbol: "△" },
  { id: "stop", label: "멈추고 바꿔야 해요", description: "누군가 피해를 보기 전에 행동을 바꿔야 해요", symbol: "×" },
];

export const ethicsCases: EthicsCase[] = [
  {
    id: 1,
    caseNo: "CASE 01",
    badge: "확",
    topic: "사실 확인",
    title: "세종대왕의 태양열 자동차",
    question: "AI가 자신 있게 말하면 사실일까?",
    scene: "민준이는 역사 발표를 준비하며 AI에게 세종대왕의 발명품을 물었습니다. AI는 ‘세종대왕이 1435년에 태양열 자동차를 만들었다’고 답했습니다. 민준이는 이 내용을 발표 자료에 바로 넣으려고 합니다.",
    aiHelp: "발표에 쓸 정보를 빠르게 찾고 문장으로 정리해 주었습니다.",
    clues: ["AI 답변에 출처가 없습니다.", "교과서에서는 같은 내용을 찾을 수 없습니다.", "AI는 매우 확신하는 말투로 답했습니다."],
    reasonOptions: ["AI가 자신 있게 말했기 때문에 믿어도 된다", "출처가 없으므로 다른 자료를 확인해야 한다", "발표 시간이 부족하므로 일단 사용해도 된다"],
    people: [
      { name: "민준", impact: "틀린 내용으로 발표하면 친구들의 신뢰를 잃을 수 있어요." },
      { name: "발표를 듣는 친구들", impact: "틀린 정보를 사실로 기억할 수 있어요." },
      { name: "선생님", impact: "학생이 어떤 자료를 확인했는지 알기 어려워요." },
    ],
    evidenceOptions: [
      { label: "학교 역사 교과서", detail: "수업에서 사용하는 검토된 자료이며 같은 기록이 없습니다.", strong: true },
      { label: "공공 박물관 자료", detail: "세종대왕의 주요 업적을 확인할 수 있는 공식 자료입니다.", strong: true },
      { label: "AI에게 다시 한 답", detail: "같은 AI가 출처 없이 비슷한 답을 반복했습니다.", strong: false },
    ],
    values: ["지혜", "정직", "책임"],
    discussion: {
      question: "민준이는 AI의 답을 발표 자료에 넣어도 될까요?",
      sides: [
        { id: "A", title: "지금 넣어도 된다", description: "AI가 자세하고 확실하게 설명했으니 발표에 사용해도 된다." },
        { id: "B", title: "확인한 뒤 넣어야 한다", description: "말투가 확실해도 출처가 없으면 교과서와 공공 자료를 먼저 확인해야 한다." },
      ],
      prompts: ["어떤 단서가 내 의견을 뒷받침하나요?", "틀린 정보가 발표되면 누가 어떤 영향을 받나요?", "확인하려면 어떤 자료를 찾아보면 좋을까요?"],
    },
    actions: [
      { text: "교과서와 공공기관 자료 두 곳 이상에서 확인한다", recommended: true, why: "서로 다른 믿을 만한 자료를 비교하면 AI의 오류를 발견할 수 있어요." },
      { text: "AI에게 같은 질문을 한 번 더 한다", recommended: false, why: "같은 도구가 비슷한 오류를 반복할 수 있어 다른 출처 확인이 필요해요." },
      { text: "그럴듯하니 그대로 발표한다", recommended: false, why: "확인되지 않은 정보는 친구들에게 잘못 전달될 수 있어요." },
    ],
    principle: "AI의 답은 믿을 만한 자료 두 곳 이상에서 확인한다.",
    checklist: { stage: "사용 중", text: "AI의 답에 출처가 있는지 보고 다른 자료와 비교한다." },
  },
  {
    id: 2,
    caseNo: "CASE 02",
    badge: "멈",
    topic: "개인정보와 동의",
    title: "친구의 비밀 고민",
    question: "도와주려는 마음이면 친구 정보를 입력해도 될까?",
    scene: "서윤이는 친구 지아의 고민을 해결해 주고 싶었습니다. 그래서 AI 상담창에 지아의 이름, 학교, 반, 가족 이야기와 고민을 모두 입력했습니다. 하지만 지아에게는 미리 물어보지 않았습니다.",
    aiHelp: "친구를 도울 방법을 빠르게 제안해 줄 수 있습니다.",
    clues: ["실명과 학교 정보가 함께 입력되었습니다.", "가족 이야기와 고민은 지아의 비밀입니다.", "정보의 주인인 지아는 허락하지 않았습니다."],
    reasonOptions: ["친구를 도우려는 좋은 마음이므로 괜찮다", "다른 사람의 정보는 먼저 허락을 받아야 한다", "AI만 보는 내용이므로 개인정보가 아니다"],
    people: [
      { name: "지아", impact: "내 비밀이 허락 없이 입력되어 불안하고 속상할 수 있어요." },
      { name: "서윤", impact: "좋은 의도였어도 친구의 신뢰를 잃을 수 있어요." },
      { name: "가족", impact: "가족의 정보까지 함께 노출될 수 있어요." },
    ],
    evidenceOptions: [
      { label: "정보의 주인인 지아의 말", detail: "지아는 자신의 정보를 입력해도 된다고 허락한 적이 없습니다.", strong: true },
      { label: "개인정보 체크리스트", detail: "이름·학교·반이 합쳐지면 특정 사람을 알아볼 수 있습니다.", strong: true },
      { label: "AI의 ‘조심하세요’ 답변", detail: "일반적인 안내일 뿐 지아의 동의를 대신할 수 없습니다.", strong: false },
    ],
    values: ["존중", "배려", "책임"],
    discussion: {
      question: "좋은 의도라면 친구의 개인정보를 허락 없이 입력해도 될까요?",
      sides: [
        { id: "A", title: "도움을 위한 일이니 괜찮다", description: "친구를 놀리거나 해치려는 목적이 아니므로 입력해도 된다." },
        { id: "B", title: "좋은 의도여도 먼저 허락받아야 한다", description: "정보의 주인은 친구이므로 무엇을 어디에 입력할지 친구가 결정해야 한다." },
      ],
      prompts: ["좋은 의도와 좋은 행동은 항상 같을까요?", "지아가 이 사실을 알게 되면 어떤 기분일까요?", "AI 대신 누구에게 도움을 요청할 수 있을까요?"],
    },
    actions: [
      { text: "입력을 멈추고 지아에게 알린 뒤 믿을 만한 어른에게 도움을 구한다", recommended: true, why: "정보의 주인에게 알리고 안전한 도움을 구하는 것이 친구를 존중하는 방법이에요." },
      { text: "이름만 별명으로 바꾸고 계속 입력한다", recommended: false, why: "학교·반·가족 이야기만으로도 친구를 알아볼 수 있어요." },
      { text: "AI 답변을 다른 친구들에게도 보여준다", recommended: false, why: "비밀이 더 넓게 퍼져 지아가 더 큰 피해를 볼 수 있어요." },
    ],
    principle: "나와 친구의 개인정보는 허락 없이 AI에 입력하지 않는다.",
    checklist: { stage: "사용 전", text: "질문에 나와 다른 사람의 개인정보가 들어 있지 않은지 확인한다." },
  },
  {
    id: 3,
    caseNo: "CASE 03",
    badge: "살",
    topic: "권리와 배려",
    title: "웃긴 합성 사진",
    question: "친구가 싫다고 말하지 않으면 동의한 걸까?",
    scene: "도윤이는 현장학습에서 찍은 친구 사진을 AI로 우스꽝스럽게 바꾸어 모둠 채팅방에 올렸습니다. 여러 친구가 웃었지만 사진 속 친구는 아무 말도 하지 않았습니다.",
    aiHelp: "사진을 빠르고 재미있게 바꾸어 새로운 이미지를 만들었습니다.",
    clues: ["사진 속 친구에게 허락을 받지 않았습니다.", "채팅방 친구들이 사진을 저장하거나 다시 보낼 수 있습니다.", "사진 속 친구는 웃지 않았지만 싫다는 말도 하지 않았습니다."],
    reasonOptions: ["친구들이 웃었으므로 재미있는 장난이다", "사진 속 사람의 허락과 마음을 먼저 확인해야 한다", "싫다고 말하지 않았으므로 동의한 것이다"],
    people: [
      { name: "사진 속 친구", impact: "내 모습이 웃음거리가 되어 창피하고 불안할 수 있어요." },
      { name: "도윤", impact: "장난이 친구의 권리를 침해했다는 사실을 뒤늦게 알 수 있어요." },
      { name: "채팅방 친구들", impact: "사진을 퍼뜨리는 행동에 함께 책임이 생길 수 있어요." },
    ],
    evidenceOptions: [
      { label: "사진 속 친구의 직접적인 말", detail: "친구는 합성 사진이 불편했고 올리지 않았으면 좋겠다고 말했습니다.", strong: true },
      { label: "채팅방 공유 기록", detail: "이미 사진을 저장한 친구가 있어 더 퍼질 가능성이 있습니다.", strong: true },
      { label: "주변 친구들의 웃음", detail: "다른 사람의 웃음은 사진 속 친구의 동의를 뜻하지 않습니다.", strong: false },
    ],
    values: ["존중", "공감", "책임"],
    discussion: {
      question: "사진 속 친구가 싫다고 말하지 않았다면 합성하고 공유해도 될까요?",
      sides: [
        { id: "A", title: "친한 친구끼리의 장난이니 괜찮다", description: "나쁜 뜻이 없고 모둠 채팅방 안에서만 보았으므로 괜찮다." },
        { id: "B", title: "분명한 허락이 없으면 하면 안 된다", description: "침묵은 동의가 아니며 사진 속 사람이 자신의 모습을 결정할 권리가 있다." },
      ],
      prompts: ["웃는 사람이 많으면 피해가 없는 걸까요?", "사진 속 친구가 말을 못 한 이유는 무엇일까요?", "이미 퍼진 사진을 줄이기 위해 무엇을 먼저 해야 할까요?"],
    },
    actions: [
      { text: "사진을 삭제하고 저장·공유하지 말아 달라고 요청한 뒤 사과한다", recommended: true, why: "피해가 더 커지는 것을 막고 사진 속 친구의 권리를 회복하는 행동이에요." },
      { text: "친한 친구들만 보는 방이므로 그대로 둔다", recommended: false, why: "채팅방의 사진도 저장되고 다른 곳으로 퍼질 수 있어요." },
      { text: "더 재미있게 바꾸어 분위기를 푼다", recommended: false, why: "친구의 불편함과 피해를 더 크게 만들 수 있어요." },
    ],
    principle: "다른 사람의 사진은 합성하거나 공유하기 전에 분명히 허락받는다.",
    checklist: { stage: "사용 전", text: "다른 사람의 사진·글·목소리를 사용할 때 허락받았는지 확인한다." },
  },
  {
    id: 4,
    caseNo: "CASE 04",
    badge: "밝",
    topic: "정직과 책임",
    title: "AI와 만든 환경 포스터",
    question: "AI의 도움을 받으면 내 작품이 아닌 걸까?",
    scene: "하린이는 환경 포스터 대회에서 AI로 문구와 그림을 만든 뒤 자신의 생각으로 조금 고쳤습니다. 대회 안내에는 AI 사용 여부를 밝히라고 되어 있었지만 제출서에는 ‘모두 내가 직접 만들었다’고 적었습니다.",
    aiHelp: "문구와 그림의 초안을 빠르게 만들어 아이디어를 표현하도록 도왔습니다.",
    clues: ["주제와 수정 아이디어는 하린이가 생각했습니다.", "첫 문구와 그림은 AI가 만들었습니다.", "대회 안내에는 AI 사용 여부를 밝히라고 적혀 있습니다."],
    reasonOptions: ["조금 고쳤으므로 모두 직접 만들었다고 해도 된다", "AI가 도운 부분과 내가 한 부분을 구분해 밝혀야 한다", "AI를 사용하면 어떤 작품도 제출하면 안 된다"],
    people: [
      { name: "하린", impact: "자신이 실제로 한 노력까지 공정하게 인정받기 어려워질 수 있어요." },
      { name: "다른 참가자", impact: "AI 사용을 숨긴 작품과 경쟁하면 불공정하다고 느낄 수 있어요." },
      { name: "심사위원", impact: "작품의 과정과 학생의 노력을 정확히 판단하기 어려워요." },
    ],
    evidenceOptions: [
      { label: "대회 공식 안내문", detail: "AI를 사용한 부분과 직접 만든 부분을 구분해 적으라고 되어 있습니다.", strong: true },
      { label: "하린이의 작업 기록", detail: "주제와 수정은 하린이가, 첫 문구와 그림은 AI가 만들었습니다.", strong: true },
      { label: "친구의 ‘괜찮아’라는 의견", detail: "친구는 개인 의견을 말했지만 대회 규칙을 확인하지 않았습니다.", strong: false },
    ],
    values: ["정직", "책임", "공정"],
    discussion: {
      question: "AI와 함께 만든 포스터를 ‘모두 내가 만들었다’고 해도 될까요?",
      sides: [
        { id: "A", title: "내가 수정했으니 모두 내 작품이다", description: "주제를 정하고 결과를 고쳤으므로 AI 사용을 따로 밝히지 않아도 된다." },
        { id: "B", title: "함께 만든 과정을 정직하게 밝혀야 한다", description: "AI가 도운 부분과 내가 생각하고 수정한 부분을 구분하면 내 노력도 정확히 설명할 수 있다." },
      ],
      prompts: ["AI를 사용했다는 사실을 밝히면 내 노력이 사라질까요?", "다른 참가자는 어떤 점을 불공정하다고 느낄까요?", "AI와 내가 한 일을 어떻게 구분해서 설명할 수 있을까요?"],
    },
    actions: [
      { text: "AI가 만든 초안과 내가 생각하고 수정한 부분을 구분해 밝힌다", recommended: true, why: "AI 활용과 나의 노력을 모두 정직하고 정확하게 설명할 수 있어요." },
      { text: "조금 수정했으므로 모두 직접 만들었다고 쓴다", recommended: false, why: "대회 규칙을 어기고 다른 참가자와 심사위원을 속이게 돼요." },
      { text: "AI를 썼으니 내 생각과 노력은 전혀 없다고 쓴다", recommended: false, why: "AI 사용 사실을 밝히는 것과 자신의 노력을 없애는 것은 달라요." },
    ],
    principle: "AI가 도운 부분과 내가 직접 한 부분을 구분해 밝힌다.",
    checklist: { stage: "사용 후", text: "AI를 사용한 부분과 정보의 출처를 다른 사람에게 정직하게 밝힌다." },
  },
];

export const sharedPromises = [
  { value: "지혜", text: "AI의 답을 그대로 믿지 않고 사실과 출처를 확인한다." },
  { value: "존중", text: "나와 다른 사람의 개인정보와 권리를 소중히 지킨다." },
  { value: "공감", text: "AI 사용으로 불편하거나 상처받는 사람이 없는지 살핀다." },
  { value: "정직", text: "AI가 도운 부분과 정보의 출처를 솔직하게 밝힌다." },
  { value: "책임", text: "AI의 제안만 따르지 않고 마지막 결정은 스스로 내린다." },
];
