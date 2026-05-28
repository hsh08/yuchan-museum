// 박물관 소장 작품 목록 (assets 폴더 이미지)
const ARTWORKS = [
  {
    id: "origin",
    file: "assets/유찬원본.jpg",
    title: "원형: 태초의 유찬",
    titleEn: "Primordial Yuchan",
    era: "기원전 · 식탁의 황혼",
    description:
      "만물의 시작. 짜장과 짬뽕 사이에서 태어난 존재의 원형을 담은, 박물관 최고의 성물.",
    featured: true,
  },
  {
    id: "raphael",
    file: "assets/라파엘유찬.png",
    title: "라파엘의 화신",
    titleEn: "Avatar of Raphael",
    era: "르네상스 · 천상",
    description:
      "천사 라파엘의 이름을 빌려 빛난 걸작. 박물관의 이름을 짓게 한 영원한 수호작.",
    featured: true,
  },
  {
    id: "creation",
    file: "assets/창조의 신 유찬.png",
    title: "창조의 신: 유찬",
    titleEn: "The Creation of Yuchan",
    era: "르네상스 · 시스티나",
    description:
      "천지를 열 손가락 하나로. 인류 최초의 걸작이 유찬의 형상으로 재탄생한 성스러운 벽화.",
  },
  {
    id: "lastsupper",
    file: "assets/최후의만찬 유찬.png",
    title: "최후의 만찬: 유찬",
    titleEn: "The Last Supper of Yuchan",
    era: "르네상스 · 밀라노",
    description:
      "열두 제자 대신 열두 유찬이 둘러앉은 장엄한 만찬. 역사상 가장 유쾌한 성찬식의 기록.",
  },
  {
    id: "moses",
    file: "assets/모세의 기적 유찬.png",
    title: "모세의 기적: 유찬",
    titleEn: "The Miracle of Moses Yuchan",
    era: "고전 · 출애굽",
    description:
      "홍해를 가른 손짓 대신, 유찬이 펼친 기적의 순간. 믿음과 유머가 공존하는 구약의 걸작.",
  },
  {
    id: "jesus",
    file: "assets/지저스유찬.png",
    title: "지저스: 구원의 유찬",
    titleEn: "Jeezus Yuchan",
    era: "성서 · 갈릴리",
    description:
      "구원자의 초상이 유찬의 얼굴로 빛난 희귀 성화. 천국과 지상을 잇는 경건한 미소.",
  },
  {
    id: "sacred",
    file: "assets/성스러운 유찬이.png",
    title: "성스러운 유찬이",
    titleEn: "Sacred Yuchan",
    era: "중세 · 성화",
    description:
      "금박과 성광 속에 떠오른 유찬. 경건함과 장난기가 한 프레임에 공존하는 신비의 아이콘.",
  },
  {
    id: "dream",
    file: "assets/꿈이룬유찬.png",
    title: "꿈이 이룬 유찬",
    titleEn: "Dream Fulfilled",
    era: "현대 · 별빛",
    description: "소원이 하늘에 닿은 순간. 희망이 금빛으로 응결된 환상의 초상.",
  },
  {
    id: "baseball",
    file: "assets/야구선수 유찬.png",
    title: "야구선수 유찬",
    titleEn: "Yuchan the Athlete",
    era: "20세기 · 다이아몬드",
    description: "투구와 타격 사이, 운동의 신성함을 포착한 역동의 걸작.",
  },
  {
    id: "love",
    file: "assets/여자친구생긴유찬.png",
    title: "인연의 유찬",
    titleEn: "Yuchan in Love",
    era: "로맨틱 · 황금기",
    description: "사랑이 찾아온 날의 기록. 두 영혼이 하나의 프레임에 머문 희귀작.",
  },
  {
    id: "dishes",
    file: "assets/유찬설거지.png",
    title: "설거지의 유찬",
    titleEn: "Yuchan at the Sink",
    era: "일상 · 성스러운 노동",
    description: "고귀한 가사의 순간. 평범함 속에서 발견된 성인(聖人)의 모습.",
  },
  {
    id: "jjajang",
    file: "assets/짜장유찬.png",
    title: "짜장의 유찬",
    titleEn: "Yuchan & Jjajang",
    era: "조선 · 맛의 미학",
    description: "검은 소스 위에 떠오른 미소. 한국 미식사의 결정적 한 장.",
  },
  {
    id: "jjamppong",
    file: "assets/짬뽕유찬.png",
    title: "짬뽕의 유찬",
    titleEn: "Yuchan & Jjamppong",
    era: "조선 · 화염의 미학",
    description: "붉은 국물과 함께 타오르는 열정. 짜장과 짝을 이루는 쌍둥이 걸작.",
  },
];
