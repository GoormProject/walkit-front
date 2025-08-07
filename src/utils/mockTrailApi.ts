import type { GeoJSONFeatureCollection } from '../types/trail';

/**
 * 등록된 산책로 타입 정의
 */
export interface RegisteredTrail {
  walkId: number;
  title: string;
  description: string;
  location: string;
  length: number;
  routeImageUrl: string;
  geoPoint: {
    longitude: number;
    latitude: number;
  };
  path: Array<{
    longitude: number;
    latitude: number;
  }>;
  isUploaded: boolean;
}

/**
 * Mock 산책 경로 데이터
 * 실제 API 응답과 동일한 구조로 설계
 */
const mockTrailPaths: GeoJSONFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [126.9780, 37.5665], // 서울시청
          [126.9790, 37.5675],
          [126.9800, 37.5685],
          [126.9810, 37.5695],
          [126.9820, 37.5705]
        ]
      },
      properties: {
        id: 'trail-1',
        name: '한강 산책로 (여의도)',
        courseType: 'easy',
        difficulty: '쉬움',
        distance: 2.5,
        duration: 30,
        description: '한강변을 따라 걷는 편안한 산책로'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [126.9850, 37.5715],
          [126.9860, 37.5725],
          [126.9870, 37.5735],
          [126.9880, 37.5745],
          [126.9890, 37.5755],
          [126.9900, 37.5765]
        ]
      },
      properties: {
        id: 'trail-2',
        name: '북한산 등산로',
        courseType: 'hard',
        difficulty: '어려움',
        distance: 5.2,
        duration: 120,
        description: '북한산 정상까지 이어지는 등산로'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [126.9750, 37.5645],
          [126.9760, 37.5655],
          [126.9770, 37.5665],
          [126.9780, 37.5675]
        ]
      },
      properties: {
        id: 'trail-3',
        name: '남산 타워 전망로',
        courseType: 'scenic',
        difficulty: '보통',
        distance: 1.8,
        duration: 45,
        description: '서울 전경을 감상할 수 있는 전망로'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [126.9830, 37.5685],
          [126.9840, 37.5695],
          [126.9850, 37.5705],
          [126.9860, 37.5715],
          [126.9870, 37.5725]
        ]
      },
      properties: {
        id: 'trail-4',
        name: '올림픽 공원 둘레길',
        courseType: 'medium',
        difficulty: '보통',
        distance: 3.5,
        duration: 60,
        description: '올림픽 공원을 한 바퀴 도는 둘레길'
      }
    }
  ]
};

/**
 * Mock API 호출 함수
 * 실제 API와 동일한 인터페이스 제공
 */
export const getTrailPaths = async (): Promise<GeoJSONFeatureCollection> => {
  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 에러 시뮬레이션 (10% 확률)
  if (Math.random() < 0.1) {
    throw new Error('서버 연결에 실패했습니다.');
  }
  
  return mockTrailPaths;
};

/**
 * 특정 경로 조회 Mock API
 */
export const getTrailPathById = async (id: string): Promise<GeoJSONFeatureCollection> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const trail = mockTrailPaths.features.find(feature => feature.properties.id === id);
  
  if (!trail) {
    throw new Error(`경로를 찾을 수 없습니다: ${id}`);
  }
  
  return {
    type: 'FeatureCollection',
    features: [trail]
  };
};

/**
 * 지역별 경로 조회 Mock API
 */
export const getTrailPathsByRegion = async (region: string): Promise<GeoJSONFeatureCollection> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 지역별 필터링 로직 (실제로는 더 복잡할 수 있음)
  const filteredFeatures = mockTrailPaths.features.filter(feature => 
    feature.properties.name?.includes(region)
  );
  
  return {
    type: 'FeatureCollection',
    features: filteredFeatures
  };
};

/**
 * 코스 타입별 경로 조회 Mock API
 */
export const getTrailPathsByCourseType = async (courseType: string): Promise<GeoJSONFeatureCollection> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const filteredFeatures = mockTrailPaths.features.filter(feature => 
    feature.properties.courseType === courseType
  );
  
  return {
    type: 'FeatureCollection',
    features: filteredFeatures
  };
};

/**
 * Mock 산책로 목록 조회 (index.tsx에서 사용)
 */
export const getTrails = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const trails = [
    {
      id: 1,
      name: '한강공원 산책로',
      location: '서울특별시 영등포구',
      length: 5.2,
      rating: 4.7,
      reviewCount: 35,
    },
    {
      id: 2,
      name: '남산 둘레길',
      location: '서울특별시 중구',
      length: 3.1,
      rating: 4.5,
      reviewCount: 28,
    },
    {
      id: 3,
      name: '북서울꿈의숲',
      location: '서울특별시 강북구',
      length: 2.8,
      rating: 4.3,
      reviewCount: 22,
    },
  ];

  return {
    status: 200,
    message: '산책로 리스트 조회 성공',
    trails: trails,
    totalElements: trails.length,
  };
};

/**
 * Mock 산책로 상세 조회 (TrailDetailCard에서 사용)
 */
export const getTrailById = async (trailId: number) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Mock 상세 데이터
  const mockTrailDetail = {
    httpStatus: 200,
    message: '단건 조회 성공',
    data: {
      title: '남산 둘레길',
      description: '남산 둘레길을 돌아보는 초급 코스입니다.',
      location: '서울 중구 남산공원',
      length: 3.8,
      routeImageUrl: 'https://example.com/images/namsan-trail.png',
      reviewCount: 25,
      rating: 4.3,
      pathId: trailId,
      startPoint: [126.75791835403612, 37.662510637017874] as [number, number],
      path: [
        [126.75791835403612, 37.662510637017874],
        [126.75790151956403, 37.66262761454681],
        [126.75789029658108, 37.662723861742975],
        [126.75790900155192, 37.66283343532169],
        [126.75795763447428, 37.662935605134706],
        [126.75809792174988, 37.66306886989648],
        [126.75818770560676, 37.66312069501714]
      ]
    }
  };

  return mockTrailDetail;
};

/**
 * Mock 등록된 산책로 목록 조회 (RegisteredTrailList에서 사용)
 */
export const getRegisteredTrails = async (): Promise<RegisteredTrail[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const registeredTrails: RegisteredTrail[] = [
    {
      walkId: 0,
      title: "일산호수공원",
      description: "일산호수공원은 경기도 고양시 일산동구에 위치한 국내 최대 규모의 도심형 인공 호수공원으로, 넓은 호수와 풍부한 자연경관이 어우러진 도심 속 힐링 명소입니다.",
      location: "고양시 일산동구",
      length: 4.83,
      routeImageUrl: "",
      geoPoint: {
        longitude: 126.76825741711764,
        latitude: 37.655421913643224
      },
      path: [
        {"longitude": 126.77135189682474, "latitude": 37.65027052160558},
        {"longitude": 126.77131351285408, "latitude": 37.65043430508767},
        {"longitude": 126.77108411977213, "latitude": 37.65083378345081},
        {"longitude": 126.77102926183642, "latitude": 37.65089615450049},
        {"longitude": 126.77083210720764, "latitude": 37.6509784634093},
        {"longitude": 126.77032271993909, "latitude": 37.65149995077323},
        {"longitude": 126.77017293239948, "latitude": 37.65160434820275},
        {"longitude": 126.7700213802766, "latitude": 37.65161293863986},
        {"longitude": 126.76967124583206, "latitude": 37.651566744910056},
        {"longitude": 126.76945094849685, "latitude": 37.65158935175316},
        {"longitude": 126.76912326373923, "latitude": 37.65170980122903},
        {"longitude": 126.76902933632675, "latitude": 37.65169005530309},
        {"longitude": 126.76846329913235, "latitude": 37.651318382050434},
        {"longitude": 126.76830834895043, "latitude": 37.651245384250146},
        {"longitude": 126.7681986039716, "latitude": 37.651254279160256},
        {"longitude": 126.76768838197978, "latitude": 37.65163895798578},
        {"longitude": 126.76773811853604, "latitude": 37.651918873471104},
        {"longitude": 126.76776350616274, "latitude": 37.65199913668333},
        {"longitude": 126.76829989395605, "latitude": 37.652930339293775},
        {"longitude": 126.7683003149466, "latitude": 37.65305220006766},
        {"longitude": 126.76801783198005, "latitude": 37.65333735977492},
        {"longitude": 126.76794001117918, "latitude": 37.65345557273696},
        {"longitude": 126.76786126128053, "latitude": 37.65394642977866},
        {"longitude": 126.76808083608444, "latitude": 37.65446495550867},
        {"longitude": 126.76828939624693, "latitude": 37.65478518515219},
        {"longitude": 126.76851981383737, "latitude": 37.65501842753132},
        {"longitude": 126.7685489517412, "latitude": 37.65509139406193},
        {"longitude": 126.76850526288973, "latitude": 37.655216463929534},
        {"longitude": 126.76830938614245, "latitude": 37.655323094307676},
        {"longitude": 126.76825867343632, "latitude": 37.65543235209043},
        {"longitude": 126.76822546505707, "latitude": 37.655660236176445},
        {"longitude": 126.76816067274831, "latitude": 37.655724765838926},
        {"longitude": 126.76792746582527, "latitude": 37.655838127418036},
        {"longitude": 126.7672808349833, "latitude": 37.65592098855008},
        {"longitude": 126.76717168955662, "latitude": 37.65596711543233},
        {"longitude": 126.76708289178731, "latitude": 37.65610756361647},
        {"longitude": 126.76695468244634, "latitude": 37.65622604127188},
        {"longitude": 126.76660898385285, "latitude": 37.656397919956035},
        {"longitude": 126.76638268817709, "latitude": 37.656762597796316},
        {"longitude": 126.76609586236191, "latitude": 37.657260192588694},
        {"longitude": 126.7660217244653, "latitude": 37.65747383995728},
        {"longitude": 126.76598945906909, "latitude": 37.658013754237345},
        {"longitude": 126.76608315747177, "latitude": 37.65835289866814},
        {"longitude": 126.76624418607219, "latitude": 37.658589872499874},
        {"longitude": 126.76627366767849, "latitude": 37.65873592531423},
        {"longitude": 126.76624664310003, "latitude": 37.6588872750836},
        {"longitude": 126.76585370632023, "latitude": 37.65914604078645},
        {"longitude": 126.76563744578345, "latitude": 37.65925332829174},
        {"longitude": 126.76549871803377, "latitude": 37.65936855773499},
        {"longitude": 126.7651485992505, "latitude": 37.65981586824839},
        {"longitude": 126.76503985642762, "latitude": 37.6601426614222},
        {"longitude": 126.76488821177247, "latitude": 37.660423841297415},
        {"longitude": 126.76468568110113, "latitude": 37.66067576873243},
        {"longitude": 126.7644992535271, "latitude": 37.66082920255876},
        {"longitude": 126.7642140469319, "latitude": 37.66092327091897},
        {"longitude": 126.76366126770597, "latitude": 37.660944400371264},
        {"longitude": 126.76317454701194, "latitude": 37.66094959013017},
        {"longitude": 126.76223849334065, "latitude": 37.66115041277146},
        {"longitude": 126.76209473909319, "latitude": 37.661249830985156},
        {"longitude": 126.7616618223932, "latitude": 37.66174500169315},
        {"longitude": 126.76158206690582, "latitude": 37.66225138121159},
        {"longitude": 126.76160549128019, "latitude": 37.66253972996927},
        {"longitude": 126.7615432637179, "latitude": 37.6627999373389},
        {"longitude": 126.76122587428443, "latitude": 37.66318265570047},
        {"longitude": 126.76093741943566, "latitude": 37.663465473266655},
        {"longitude": 126.7606886138272, "latitude": 37.66361075129171},
        {"longitude": 126.76029277949141, "latitude": 37.66371332712984},
        {"longitude": 126.75955272986778, "latitude": 37.66405554055977},
        {"longitude": 126.75937583089348, "latitude": 37.664165550086125},
        {"longitude": 126.75917813502218, "latitude": 37.66417536321043},
        {"longitude": 126.75884961224546, "latitude": 37.66406657553368},
        {"longitude": 126.75877756681848, "latitude": 37.664008686435466},
        {"longitude": 126.75869314932157, "latitude": 37.663893258857456},
        {"longitude": 126.7584555611005, "latitude": 37.66347240688641},
        {"longitude": 126.75818005102309, "latitude": 37.66312206962799},
        {"longitude": 126.7581101620487, "latitude": 37.66307962448258},
        {"longitude": 126.75795895771603, "latitude": 37.662932558695076},
        {"longitude": 126.75791224098333, "latitude": 37.662845814545506},
        {"longitude": 126.75791672698352, "latitude": 37.66252172298228},
        {"longitude": 126.75795167724584, "latitude": 37.66238758848564},
        {"longitude": 126.75840622035605, "latitude": 37.66171983861133},
        {"longitude": 126.75855537572659, "latitude": 37.661570023477026},
        {"longitude": 126.7593776799041, "latitude": 37.66153970467731},
        {"longitude": 126.75983602126888, "latitude": 37.66148012284192},
        {"longitude": 126.76001542644173, "latitude": 37.66138739740096},
        {"longitude": 126.76021779589598, "latitude": 37.661003489868676},
        {"longitude": 126.76033433934464, "latitude": 37.660630404261326},
        {"longitude": 126.76028327844944, "latitude": 37.66027030587567},
        {"longitude": 126.76049696147925, "latitude": 37.6598227368963},
        {"longitude": 126.76056694237712, "latitude": 37.65977631220004},
        {"longitude": 126.76117588935955, "latitude": 37.65956486531634},
        {"longitude": 126.76128694507378, "latitude": 37.659496204875424},
        {"longitude": 126.7614833585285, "latitude": 37.65931345432482},
        {"longitude": 126.76161129623335, "latitude": 37.65907099655978},
        {"longitude": 126.76160145784604, "latitude": 37.65875300804724},
        {"longitude": 126.76162193816089, "latitude": 37.65845818160693},
        {"longitude": 126.76170924302664, "latitude": 37.65828695820376},
        {"longitude": 126.76209672295374, "latitude": 37.65783460854371},
        {"longitude": 126.7623305921042, "latitude": 37.65735022426745},
        {"longitude": 126.76216282788329, "latitude": 37.657057776304455},
        {"longitude": 126.7621405287324, "latitude": 37.65650348295503},
        {"longitude": 126.76233037922685, "latitude": 37.65578221510947},
        {"longitude": 126.76250530677845, "latitude": 37.65530951342916},
        {"longitude": 126.76272093015444, "latitude": 37.65490333075786},
        {"longitude": 126.76284484311145, "latitude": 37.654799082559464},
        {"longitude": 126.76312092968209, "latitude": 37.654730800624264},
        {"longitude": 126.76338819675061, "latitude": 37.65462614480586},
        {"longitude": 126.76394530499942, "latitude": 37.654295062674194},
        {"longitude": 126.76410575880254, "latitude": 37.65408099091084},
        {"longitude": 126.76426806696884, "latitude": 37.65382019259731},
        {"longitude": 126.76437901221817, "latitude": 37.65341574015936},
        {"longitude": 126.76422500286992, "latitude": 37.6524139113579},
        {"longitude": 126.76439979622978, "latitude": 37.65187714954179},
        {"longitude": 126.76456118979576, "latitude": 37.65186117926383},
        {"longitude": 126.76482629547922, "latitude": 37.65171776337604},
        {"longitude": 126.76503445541823, "latitude": 37.65146158907433},
        {"longitude": 126.76513549126076, "latitude": 37.65119803048387},
        {"longitude": 126.76530616039776, "latitude": 37.65111445323734},
        {"longitude": 126.76563834191643, "latitude": 37.65105601008197},
        {"longitude": 126.76629369803288, "latitude": 37.65111734505061},
        {"longitude": 126.76647399723896, "latitude": 37.651090325578124},
        {"longitude": 126.76669913448592, "latitude": 37.65100195623769},
        {"longitude": 126.7677629339056, "latitude": 37.6503812581814},
        {"longitude": 126.76832702955153, "latitude": 37.65033870908351},
        {"longitude": 126.76848008799334, "latitude": 37.65028540337879},
        {"longitude": 126.76874305532039, "latitude": 37.650147488311035},
        {"longitude": 126.76894934999854, "latitude": 37.64988627689648},
        {"longitude": 126.76924400603536, "latitude": 37.64939963755779},
        {"longitude": 126.76932215299354, "latitude": 37.649353998874076},
        {"longitude": 126.76980622586689, "latitude": 37.64932709232882},
        {"longitude": 126.76996423219481, "latitude": 37.649359603275585},
        {"longitude": 126.7704066783977, "latitude": 37.64960455537687},
        {"longitude": 126.77065303208332, "latitude": 37.649641631551376},
        {"longitude": 126.77126186755231, "latitude": 37.650091706698845},
        {"longitude": 126.77133376734912, "latitude": 37.650231675363},
        {"longitude": 126.7713421417186, "latitude": 37.65024725521424},
        {"longitude": 126.77135229981405, "latitude": 37.65027015625611}
      ],
      isUploaded: true
    }
  ];

  return registeredTrails;
};

/**
 * Mock 등록된 산책로 상세 조회 (RegisteredTrailWalker에서 사용)
 */
export const getRegisteredTrailById = async (walkId: number): Promise<RegisteredTrail | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const registeredTrails: RegisteredTrail[] = [
    {
      walkId: 0,
      title: "일산호수공원",
      description: "일산호수공원은 경기도 고양시 일산동구에 위치한 국내 최대 규모의 도심형 인공 호수공원으로, 넓은 호수와 풍부한 자연경관이 어우러진 도심 속 힐링 명소입니다.",
      location: "고양시 일산동구",
      length: 4.83,
      routeImageUrl: "",
      geoPoint: {
        longitude: 126.76825741711764,
        latitude: 37.655421913643224
      },
      path: [
        {"longitude": 126.77135189682474, "latitude": 37.65027052160558},
        {"longitude": 126.77131351285408, "latitude": 37.65043430508767},
        {"longitude": 126.77108411977213, "latitude": 37.65083378345081},
        {"longitude": 126.77102926183642, "latitude": 37.65089615450049},
        {"longitude": 126.77083210720764, "latitude": 37.6509784634093},
        {"longitude": 126.77032271993909, "latitude": 37.65149995077323},
        {"longitude": 126.77017293239948, "latitude": 37.65160434820275},
        {"longitude": 126.7700213802766, "latitude": 37.65161293863986},
        {"longitude": 126.76967124583206, "latitude": 37.651566744910056},
        {"longitude": 126.76945094849685, "latitude": 37.65158935175316},
        {"longitude": 126.76912326373923, "latitude": 37.65170980122903},
        {"longitude": 126.76902933632675, "latitude": 37.65169005530309},
        {"longitude": 126.76846329913235, "latitude": 37.651318382050434},
        {"longitude": 126.76830834895043, "latitude": 37.651245384250146},
        {"longitude": 126.7681986039716, "latitude": 37.651254279160256},
        {"longitude": 126.76768838197978, "latitude": 37.65163895798578},
        {"longitude": 126.76773811853604, "latitude": 37.651918873471104},
        {"longitude": 126.76776350616274, "latitude": 37.65199913668333},
        {"longitude": 126.76829989395605, "latitude": 37.652930339293775},
        {"longitude": 126.7683003149466, "latitude": 37.65305220006766},
        {"longitude": 126.76801783198005, "latitude": 37.65333735977492},
        {"longitude": 126.76794001117918, "latitude": 37.65345557273696},
        {"longitude": 126.76786126128053, "latitude": 37.65394642977866},
        {"longitude": 126.76808083608444, "latitude": 37.65446495550867},
        {"longitude": 126.76828939624693, "latitude": 37.65478518515219},
        {"longitude": 126.76851981383737, "latitude": 37.65501842753132},
        {"longitude": 126.7685489517412, "latitude": 37.65509139406193},
        {"longitude": 126.76850526288973, "latitude": 37.655216463929534},
        {"longitude": 126.76830938614245, "latitude": 37.655323094307676},
        {"longitude": 126.76825867343632, "latitude": 37.65543235209043},
        {"longitude": 126.76822546505707, "latitude": 37.655660236176445},
        {"longitude": 126.76816067274831, "latitude": 37.655724765838926},
        {"longitude": 126.76792746582527, "latitude": 37.655838127418036},
        {"longitude": 126.7672808349833, "latitude": 37.65592098855008},
        {"longitude": 126.76717168955662, "latitude": 37.65596711543233},
        {"longitude": 126.76708289178731, "latitude": 37.65610756361647},
        {"longitude": 126.76695468244634, "latitude": 37.65622604127188},
        {"longitude": 126.76660898385285, "latitude": 37.656397919956035},
        {"longitude": 126.76638268817709, "latitude": 37.656762597796316},
        {"longitude": 126.76609586236191, "latitude": 37.657260192588694},
        {"longitude": 126.7660217244653, "latitude": 37.65747383995728},
        {"longitude": 126.76598945906909, "latitude": 37.658013754237345},
        {"longitude": 126.76608315747177, "latitude": 37.65835289866814},
        {"longitude": 126.76624418607219, "latitude": 37.658589872499874},
        {"longitude": 126.76627366767849, "latitude": 37.65873592531423},
        {"longitude": 126.76624664310003, "latitude": 37.6588872750836},
        {"longitude": 126.76585370632023, "latitude": 37.65914604078645},
        {"longitude": 126.76563744578345, "latitude": 37.65925332829174},
        {"longitude": 126.76549871803377, "latitude": 37.65936855773499},
        {"longitude": 126.7651485992505, "latitude": 37.65981586824839},
        {"longitude": 126.76503985642762, "latitude": 37.6601426614222},
        {"longitude": 126.76488821177247, "latitude": 37.660423841297415},
        {"longitude": 126.76468568110113, "latitude": 37.66067576873243},
        {"longitude": 126.7644992535271, "latitude": 37.66082920255876},
        {"longitude": 126.7642140469319, "latitude": 37.66092327091897},
        {"longitude": 126.76366126770597, "latitude": 37.660944400371264},
        {"longitude": 126.76317454701194, "latitude": 37.66094959013017},
        {"longitude": 126.76223849334065, "latitude": 37.66115041277146},
        {"longitude": 126.76209473909319, "latitude": 37.661249830985156},
        {"longitude": 126.7616618223932, "latitude": 37.66174500169315},
        {"longitude": 126.76158206690582, "latitude": 37.66225138121159},
        {"longitude": 126.76160549128019, "latitude": 37.66253972996927},
        {"longitude": 126.7615432637179, "latitude": 37.6627999373389},
        {"longitude": 126.76122587428443, "latitude": 37.66318265570047},
        {"longitude": 126.76093741943566, "latitude": 37.663465473266655},
        {"longitude": 126.7606886138272, "latitude": 37.66361075129171},
        {"longitude": 126.76029277949141, "latitude": 37.66371332712984},
        {"longitude": 126.75955272986778, "latitude": 37.66405554055977},
        {"longitude": 126.75937583089348, "latitude": 37.664165550086125},
        {"longitude": 126.75917813502218, "latitude": 37.66417536321043},
        {"longitude": 126.75884961224546, "latitude": 37.66406657553368},
        {"longitude": 126.75877756681848, "latitude": 37.664008686435466},
        {"longitude": 126.75869314932157, "latitude": 37.663893258857456},
        {"longitude": 126.7584555611005, "latitude": 37.66347240688641},
        {"longitude": 126.75818005102309, "latitude": 37.66312206962799},
        {"longitude": 126.7581101620487, "latitude": 37.66307962448258},
        {"longitude": 126.75795895771603, "latitude": 37.662932558695076},
        {"longitude": 126.75791224098333, "latitude": 37.662845814545506},
        {"longitude": 126.75791672698352, "latitude": 37.66252172298228},
        {"longitude": 126.75795167724584, "latitude": 37.66238758848564},
        {"longitude": 126.75840622035605, "latitude": 37.66171983861133},
        {"longitude": 126.75855537572659, "latitude": 37.661570023477026},
        {"longitude": 126.7593776799041, "latitude": 37.66153970467731},
        {"longitude": 126.75983602126888, "latitude": 37.66148012284192},
        {"longitude": 126.76001542644173, "latitude": 37.66138739740096},
        {"longitude": 126.76021779589598, "latitude": 37.661003489868676},
        {"longitude": 126.76033433934464, "latitude": 37.660630404261326},
        {"longitude": 126.76028327844944, "latitude": 37.66027030587567},
        {"longitude": 126.76049696147925, "latitude": 37.6598227368963},
        {"longitude": 126.76056694237712, "latitude": 37.65977631220004},
        {"longitude": 126.76117588935955, "latitude": 37.65956486531634},
        {"longitude": 126.76128694507378, "latitude": 37.659496204875424},
        {"longitude": 126.7614833585285, "latitude": 37.65931345432482},
        {"longitude": 126.76161129623335, "latitude": 37.65907099655978},
        {"longitude": 126.76160145784604, "latitude": 37.65875300804724},
        {"longitude": 126.76162193816089, "latitude": 37.65845818160693},
        {"longitude": 126.76170924302664, "latitude": 37.65828695820376},
        {"longitude": 126.76209672295374, "latitude": 37.65783460854371},
        {"longitude": 126.7623305921042, "latitude": 37.65735022426745},
        {"longitude": 126.76216282788329, "latitude": 37.657057776304455},
        {"longitude": 126.7621405287324, "latitude": 37.65650348295503},
        {"longitude": 126.76233037922685, "latitude": 37.65578221510947},
        {"longitude": 126.76250530677845, "latitude": 37.65530951342916},
        {"longitude": 126.76272093015444, "latitude": 37.65490333075786},
        {"longitude": 126.76284484311145, "latitude": 37.654799082559464},
        {"longitude": 126.76312092968209, "latitude": 37.654730800624264},
        {"longitude": 126.76338819675061, "latitude": 37.65462614480586},
        {"longitude": 126.76394530499942, "latitude": 37.654295062674194},
        {"longitude": 126.76410575880254, "latitude": 37.65408099091084},
        {"longitude": 126.76426806696884, "latitude": 37.65382019259731},
        {"longitude": 126.76437901221817, "latitude": 37.65341574015936},
        {"longitude": 126.76422500286992, "latitude": 37.6524139113579},
        {"longitude": 126.76439979622978, "latitude": 37.65187714954179},
        {"longitude": 126.76456118979576, "latitude": 37.65186117926383},
        {"longitude": 126.76482629547922, "latitude": 37.65171776337604},
        {"longitude": 126.76503445541823, "latitude": 37.65146158907433},
        {"longitude": 126.76513549126076, "latitude": 37.65119803048387},
        {"longitude": 126.76530616039776, "latitude": 37.65111445323734},
        {"longitude": 126.76563834191643, "latitude": 37.65105601008197},
        {"longitude": 126.76629369803288, "latitude": 37.65111734505061},
        {"longitude": 126.76647399723896, "latitude": 37.651090325578124},
        {"longitude": 126.76669913448592, "latitude": 37.65100195623769},
        {"longitude": 126.7677629339056, "latitude": 37.6503812581814},
        {"longitude": 126.76832702955153, "latitude": 37.65033870908351},
        {"longitude": 126.76848008799334, "latitude": 37.65028540337879},
        {"longitude": 126.76874305532039, "latitude": 37.650147488311035},
        {"longitude": 126.76894934999854, "latitude": 37.64988627689648},
        {"longitude": 126.76924400603536, "latitude": 37.64939963755779},
        {"longitude": 126.76932215299354, "latitude": 37.649353998874076},
        {"longitude": 126.76980622586689, "latitude": 37.64932709232882},
        {"longitude": 126.76996423219481, "latitude": 37.649359603275585},
        {"longitude": 126.7704066783977, "latitude": 37.64960455537687},
        {"longitude": 126.77065303208332, "latitude": 37.649641631551376},
        {"longitude": 126.77126186755231, "latitude": 37.650091706698845},
        {"longitude": 126.77133376734912, "latitude": 37.650231675363},
        {"longitude": 126.7713421417186, "latitude": 37.65024725521424},
        {"longitude": 126.77135229981405, "latitude": 37.65027015625611}
      ],
      isUploaded: true
    }
  ];

  const trail = registeredTrails.find(t => t.walkId === walkId);
  return trail || null;
}; 
