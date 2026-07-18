export type Signal = "green" | "yellow" | "red";

export type EthicsCase = {
  id: number;
  caseNo: string;
  category: string;
  title: string;
  summary: string;
  scene: string;
  evidence: string[];
  discuss: string;
  viewpoints: { role: string; question: string }[];
  values: string[];
  actions: string[];
  recommended: Signal;
  solution: string;
  badge: { syllable: string; title: string; text: string };
};

export const ethicsCases: EthicsCase[] = [
  {
    id: 1,
    caseNo: "CASE 01",
    category: "환각 · 사실 확인",
    title: "사라진 세종대왕의 발명품",
    summary: "AI가 알려준 놀라운 정보, 정말 믿어도 될까?",
    scene:
      "민준이는 역사 발표를 준비하며 AI에게 물었습니다. AI는 ‘세종대왕이 1435년에 태양열 자동차를 만들었다’고 답했고, 민준이는 그대로 발표 자료에 넣으려 합니다.",
    evidence: [
      "AI 답변에는 출처 링크가 없다.",
      "교과서에는 같은 내용이 나오지 않는다.",
      "AI는 매우 확신하는 말투로 답했다.",
    ],
    discuss: "확신 있게 말하는 답은 항상 사실일까요? 어떤 자료로 확인하면 좋을까요?",
    viewpoints: [
      { role: "발표자", question: "틀린 정보로 발표하면 어떤 일이 생길까?" },
      { role: "친구", question: "그 발표를 들은 친구들은 무엇을 믿게 될까?" },
      { role: "탐정", question: "믿을 만한 출처를 어떻게 찾을까?" },
    ],
    values: ["지혜", "정직", "책임"],
    actions: ["교과서와 공공기관 자료에서 다시 확인한다", "그럴듯하니 그대로 사용한다", "AI에게 한 번 더 묻기만 한다"],
    recommended: "red",
    solution: "AI도 틀린 내용을 사실처럼 말할 수 있어요. 서로 다른 믿을 만한 자료 두 곳 이상에서 확인하고, 확인되지 않은 내용은 사용하지 않아요.",
    badge: { syllable: "확", title: "확인 배지", text: "다른 믿을 만한 자료와 비교해요." },
  },
  {
    id: 2,
    caseNo: "CASE 02",
    category: "개인정보 · 동의",
    title: "비밀 일기 상담 사건",
    summary: "친구의 고민을 AI에게 대신 물어봐도 될까?",
    scene:
      "서윤이는 친구 지아를 돕고 싶어 AI 상담창에 지아의 이름, 학교, 반, 가족 이야기와 고민을 모두 입력했습니다. 지아에게는 미리 말하지 않았습니다.",
    evidence: [
      "친구를 도우려는 좋은 마음이었다.",
      "실명과 학교 정보가 함께 입력되었다.",
      "정보의 주인인 지아는 동의하지 않았다.",
    ],
    discuss: "좋은 의도라면 다른 사람의 개인정보를 허락 없이 입력해도 될까요?",
    viewpoints: [
      { role: "지아", question: "내 비밀이 입력된 것을 알면 어떤 기분일까?" },
      { role: "서윤", question: "친구를 도울 다른 안전한 방법은 무엇일까?" },
      { role: "보호자", question: "어떤 정보는 어른과 상의해야 할까?" },
    ],
    values: ["존중", "배려", "책임"],
    actions: ["정보를 지우고 친구에게 알린 뒤 믿을 만한 어른에게 도움을 구한다", "이름만 별명으로 바꾸고 계속 입력한다", "답변을 친구들에게도 공유한다"],
    recommended: "red",
    solution: "내 정보뿐 아니라 친구의 정보도 허락 없이 AI에 입력하지 않아요. 도움이 필요할 때는 보호자나 선생님처럼 믿을 만한 어른에게 먼저 이야기해요.",
    badge: { syllable: "멈", title: "멈춤 배지", text: "개인정보라면 입력하기 전에 멈춰요." },
  },
  {
    id: 3,
    caseNo: "CASE 03",
    category: "권리 · 합성 이미지",
    title: "웃긴 사진의 주인은 누구?",
    summary: "친구 사진을 재미있게 바꾸는 것도 허락이 필요할까?",
    scene:
      "도윤이는 현장학습에서 찍은 친구 사진을 AI로 우스꽝스럽게 바꿔 모둠 채팅방에 올렸습니다. 여러 친구가 웃었지만 사진 속 친구는 아무 말도 하지 않았습니다.",
    evidence: [
      "사진 속 친구에게 허락을 받지 않았다.",
      "채팅방 친구들이 사진을 다시 저장할 수 있다.",
      "사진 속 친구가 웃지 않았지만 싫다는 말도 하지 않았다.",
    ],
    discuss: "싫다고 말하지 않으면 동의한 것일까요? 재미와 권리가 부딪힐 때 무엇을 먼저 봐야 할까요?",
    viewpoints: [
      { role: "사진 속 친구", question: "많은 친구가 내 사진을 보면 어떤 기분일까?" },
      { role: "도윤", question: "장난이 피해가 되었다는 것을 어떻게 알 수 있을까?" },
      { role: "방장", question: "더 퍼지지 않게 무엇을 해야 할까?" },
    ],
    values: ["존중", "공감", "책임"],
    actions: ["즉시 삭제를 부탁하고 당사자에게 사과한다", "친한 친구들만 보는 방이라 그대로 둔다", "더 재미있게 바꿔 분위기를 푼다"],
    recommended: "red",
    solution: "사진의 주인은 사진 속 사람입니다. 합성하거나 공유하기 전에 분명하게 허락받고, 불편함을 알게 되면 즉시 삭제하고 사과해요.",
    badge: { syllable: "살", title: "살핌 배지", text: "누군가 다치거나 불편하지 않은지 살펴요." },
  },
  {
    id: 4,
    caseNo: "CASE 04",
    category: "정직 · 저작권",
    title: "혼자 만든 포스터의 비밀",
    summary: "AI와 함께 만든 작품을 내 작품이라고 해도 될까?",
    scene:
      "하린이는 환경 포스터 대회에서 AI로 문구와 그림을 만든 뒤 조금 고쳤습니다. 제출서에는 ‘모두 내가 직접 만들었다’고 적었습니다.",
    evidence: [
      "주제와 수정 아이디어는 하린이가 생각했다.",
      "그림과 첫 문구는 AI가 만들었다.",
      "대회 안내에는 AI 사용 여부를 밝히라고 적혀 있었다.",
    ],
    discuss: "AI의 도움을 받으면 내 생각과 노력이 모두 사라질까요? 정직하게 밝히는 방법은 무엇일까요?",
    viewpoints: [
      { role: "하린", question: "내가 직접 한 부분을 어떻게 설명할까?" },
      { role: "다른 참가자", question: "사용 사실을 숨기면 공정하다고 느낄까?" },
      { role: "심사위원", question: "작품을 판단하려면 어떤 정보가 필요할까?" },
    ],
    values: ["정직", "책임", "공정"],
    actions: ["AI를 사용한 부분과 내가 수정한 부분을 구분해 밝힌다", "조금 고쳤으니 모두 내가 만들었다고 한다", "친구가 대신 만들었다고 적는다"],
    recommended: "yellow",
    solution: "AI를 활용하는 것 자체가 잘못은 아니에요. 규칙을 확인하고, AI가 도운 부분과 내가 직접 생각하고 고친 부분을 정직하게 밝혀요.",
    badge: { syllable: "밝", title: "밝힘 배지", text: "AI 사용 사실과 출처를 정직하게 밝혀요." },
  },
];

export const constitutionRules = [
  "우리는 개인정보와 친구의 비밀을 AI에 입력하지 않는다.",
  "우리는 AI의 답을 믿을 만한 자료 두 곳 이상에서 확인한다.",
  "우리는 다른 사람의 사진과 작품을 허락 없이 사용하지 않는다.",
  "우리는 AI를 사용한 부분과 출처를 정직하게 밝힌다.",
  "우리는 AI의 결정에만 기대지 않고 마지막 판단은 스스로 한다.",
  "우리는 차별하거나 상처 주는 결과를 발견하면 사용을 멈추고 알린다.",
];
