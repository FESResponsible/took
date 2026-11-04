// UI 언어 사전. 화면 선택지는 LOCALES만 쓴다. es, fr, de는 같은 칸에 값을 더하면 나중에 켤 수 있다.
const LOCALES = [
  { id: 'ko', lang: 'ko', label: '한국어' },
  { id: 'en', lang: 'en', label: 'English' },
  { id: 'zh-Hans', lang: 'zh-Hans', label: '简体中文' },
  { id: 'zh-Hant', lang: 'zh-Hant', label: '繁體中文' }
];
export const LOCALE_STORAGE_KEY = 'took-locale';
export { LOCALES };

const L = (ko, en, hans, hant) => ({ ko, en, 'zh-Hans': hans, 'zh-Hant': hant });
const C = (tourism, daily) => ({ modes: { tourism, daily } });
const P = (en, hans, hant, aliases = []) => ({ en, 'zh-Hans': hans, 'zh-Hant': hant, aliases });

const MESSAGES = {
  'lang.group': L('언어', 'Language', '语言', '語言'),
  'a11y.home': L('TooK 홈', 'TooK home', 'TooK 首页', 'TooK 首頁'),
  'a11y.mainNav': L('주 메뉴', 'Main menu', '主菜单', '主選單'),
  'a11y.mobileNav': L('모바일 메뉴', 'Mobile menu', '手机菜单', '手機選單'),
  'a11y.menuOpen': L('메뉴 열기', 'Open menu', '打开菜单', '打開選單'),
  'a11y.menuClose': L('메뉴 닫기', 'Close menu', '关闭菜单', '關閉選單'),
  'a11y.skip': L('본문으로 바로가기', 'Skip to content', '跳到正文', '跳到正文'),
  'nav.story': L('서비스 소개', 'About', '服务介绍', '服務介紹'),
  'nav.places': L('보관 장소 찾기', 'Find storage', '查找寄存点', '尋找寄存點'),
  'nav.how': L('이용 방법', 'How it works', '使用方法', '使用方法'),
  'nav.faq': L('자주 묻는 질문', 'FAQ', '常见问题', '常見問題'),
  'nav.bookings': L('내 예약', 'My bookings', '我的预约', '我的預約'),
  'nav.partner': L('파트너 신청', 'Become a partner', '申请合作', '申請合作'),
  'nav.partnerInfo': L('파트너 안내', 'For partners', '合作说明', '合作說明'),
  'nav.footerPlaces': L('보관 공간 둘러보기', 'Browse storage', '浏览寄存点', '瀏覽寄存點'),
  'nav.footerHow': L('이용 방법', 'How it works', '使用方法', '使用方法'),
  'nav.footerGuide': L('이용 안내', 'Help', '使用说明', '使用說明'),
  'hero.alt': L('노란 캐리어를 끌며 서울의 햇살 가득한 한옥 골목을 걷는 여행자', 'A traveler pulling a yellow suitcase through a sunny hanok alley in Seoul', '旅客拖着黄色行李箱，走在首尔阳光充足的韩屋巷弄', '旅客拖著黃色行李箱，走在首爾陽光充足的韓屋巷弄'),
  'hero.note': L('앱 설치 없이 예약하고, QR로 간편하게.', 'Book without an app, then show your QR code.', '不用安装应用，出示二维码即可。', '不用安裝應用程式，出示 QR code 即可。'),
  'hero.ticketSoft': L('손은 가볍게, 하루는 자유롭게', 'Hands free, day open', '双手轻松，一天自在', '雙手輕鬆，一天自在'),
  'hero.ticketStrong': L('맡기고. 즐기고. 다시 찾고.', 'Drop it. Enjoy. Pick it up.', '寄存。游玩。再取回。', '寄存。遊玩。再取回。'),
  'search.where': L('어디에 맡길까요?', 'Where should we store it?', '想寄存在哪里？', '想寄存在哪裡？'),
  'search.placeholder': L('지역, 동네 이름', 'City or neighborhood', '城市或商圈', '城市或商圈'),
  'search.here': L('현재 위치', 'Current location', '当前位置', '目前位置'),
  'search.date': L('보관 날짜', 'Storage date', '寄存日期', '寄存日期'),
  'search.time': L('시작 시간', 'Start time', '开始时间', '開始時間'),
  'search.bags': L('짐 개수와 종류', 'Bags and type', '行李数量和种类', '行李數量和種類'),
  'search.popoverTitle': L('맡길 짐', 'Bags to store', '要寄存的行李', '要寄存的行李'),
  'search.popoverHelp': L('개수는 10개까지, 종류는 자유롭게 적어 주세요.', 'Up to 10 bags. Describe them in your own words.', '最多 10 件，种类请随意填写。', '最多 10 件，種類請隨意填寫。'),
  'search.minus': L('짐 수량 줄이기', 'Decrease bag count', '减少行李数量', '減少行李數量'),
  'search.plus': L('짐 수량 늘리기', 'Increase bag count', '增加行李数量', '增加行李數量'),
  'search.noteLabel': L('짐 종류', 'What are you storing?', '行李种类', '行李種類'),
  'search.notePlaceholder': L('예: 기내용 캐리어, 쇼핑백', 'Example: cabin suitcase, shopping bag', '例如：登机箱、购物袋', '例如：登機箱、購物袋'),
  'search.confirm': L('확인', 'Done', '确认', '確認'),
  'search.submit': L('보관 장소 찾기', 'Find storage', '查找寄存点', '尋找寄存點'),
  'search.popular': L('많이 찾는 곳', 'Popular areas', '热门地区', '熱門地區'),
  'search.priceNote': L('요금은 짐 종류와 상관없이 같아요. 시간당 1,000원, 하루 최대 5,000원이에요. 쇼핑백은 3개까지 1개 요금이에요.', 'The rate is the same for every bag type. ₩1,000 per hour, up to ₩5,000 per day. Shopping bags are billed as one item for every three.', '费用与行李种类无关。每小时 1,000韩元，每天最多 5,000韩元。购物袋每 3 件按 1 件计费。', '費用與行李種類無關。每小時 1,000韓元，每天最多 5,000韓元。購物袋每 3 件按 1 件計費。'),
  'story.when': L('언제 쓸까요?', 'When is it useful?', '什么时候用？', '什麼時候用？'),
  'story.kicker': L('TooK 이 책임지는 가벼운 하루', 'A lighter day, with TooK', 'TooK 负责的轻松一天', 'TooK 負責的輕鬆一天'),
  'story.question': L('이런 적 있으시죠?', 'Sound familiar?', '有过这种时候吗？', '有過這種時候嗎？'),
  'persona.cold': L('식품은 시원하게, 늦은 시간은 24시간 곳에서', 'Keep food cool, and use a 24-hour spot late at night', '食品放凉处，深夜选 24 小时地点', '食品放涼處，深夜選 24 小時地點'),
  'needs.title': L('무엇을 맡길 수 있나요', 'What can you store?', '可以寄存什么？', '可以寄存什麼？'),
  'needs.carryon': L('기내용 캐리어와 백팩', 'Cabin suitcases and backpacks', '登机箱和背包', '登機箱和背包'),
  'needs.small': L('쇼핑백, 손에 든 작은 짐', 'Shopping bags and small items in hand', '购物袋和手上的小件', '購物袋和手上的小件'),
  'needs.food': L('시원하게 두고 싶은 식품', 'Food you want kept cool', '想冷藏的食品', '想冷藏的食品'),
  'needs.howTitle': L('어떻게 쓰나요', 'How do you use it?', '怎么使用？', '怎麼使用？'),
  'needs.price': L('시간당 1,000원, 오래 맡겨도 하루 5,000원을 넘지 않아요', '₩1,000 per hour, and never more than ₩5,000 per bag each day', '每小时 1,000韩元，每件每天不超过 5,000韩元', '每小時 1,000韓元，每件每天不超過 5,000韓元'),
  'needs.steps': L('날짜와 시작 시간, 짐 종류를 적고 결제로 이어져요', 'Add the date, start time, and bag type, then continue to payment', '填写日期、开始时间和行李种类，然后进入付款', '填寫日期、開始時間和行李種類，然後進入付款'),
  'places.kicker': L('FIND YOUR LIGHT SPOT', 'FIND YOUR LIGHT SPOT', 'FIND YOUR LIGHT SPOT', 'FIND YOUR LIGHT SPOT'),
  'places.title': L('어디에서 가벼워질까요?', 'Where will you lighten the load?', '想在哪里轻装上阵？', '想在哪裡輕裝上陣？'),
  'places.lead': L('전체 목록에서 고르거나, 핫플과 보관 옵션, 현재 위치로 좁혀 보세요.', 'Browse the full list, or narrow it by area, storage option, and your location.', '可看全部，也可按地区、寄存条件和当前位置缩小范围。', '可看全部，也可按地區、寄存條件和目前位置縮小範圍。'),
  'view.group': L('장소 보기 방식', 'Place view', '地点查看方式', '地點查看方式'),
  'view.list': L('목록', 'List', '列表', '列表'),
  'view.map': L('지도', 'Map', '地图', '地圖'),
  'filter.region': L('지역 필터', 'City filter', '城市筛选', '城市篩選'),
  'filter.district': L('세부 지역', 'Neighborhoods', '细分地区', '細分地區'),
  'filter.options': L('보관 옵션', 'Storage options', '寄存条件', '寄存條件'),
  'filter.hours24': L('24시간 운영', 'Open 24 hours', '24 小时营业', '24 小時營業'),
  'filter.cold': L('냉장/냉동 보관', 'Fridge or freezer', '冷藏或冷冻', '冷藏或冷凍'),
  'filter.sort': L('장소 정렬', 'Sort places', '地点排序', '地點排序'),
  'filter.recommended': L('추천순', 'Recommended', '推荐', '推薦'),
  'filter.distance': L('현재 위치에서 가까운 순', 'Nearest to me', '离我最近', '離我最近'),
  'filter.category': L('업종 필터', 'Category filter', '类型筛选', '類型篩選'),
  'filter.all': L('전체', 'All', '全部', '全部'),
  'filter.cityAll': L('{city} 전체', 'All {city}', '{city}全部', '{city}全部'),
  'results.loading': L('보관 공간을 불러오는 중입니다.', 'Loading storage spots.', '正在载入寄存点。', '正在載入寄存點。'),
  'results.query': L('{query} 보관 공간 {count}곳', '{query} {count} storage spots', '{query} 寄存点 {count}处', '{query} 寄存點 {count}處'),
  'results.area': L('{area} 보관 공간 {count}곳', '{area} {count} storage spots', '{area} 寄存点 {count}处', '{area} 寄存點 {count}處'),
  'results.near': L('현재 위치 주변 보관 공간 {count}곳', '{count} storage spots near you', '您附近的寄存点 {count}处', '您附近的寄存點 {count}處'),
  'results.all': L('전체 보관 공간 {count}곳', '{count} storage spots in total', '全部寄存点 {count}处', '全部寄存點 {count}處'),
  'empty.title': L('이 조건에 맞는 공간이 없어요.', 'No spots match these filters.', '没有符合条件的地点。', '沒有符合條件的地點。'),
  'empty.body': L('지역이나 보관 옵션을 바꾸거나, 전체 목록을 봐 주세요.', 'Change the area or storage option, or view the full list.', '请更换地区或寄存条件，或查看全部。', '請更換地區或寄存條件，或查看全部。'),
  'empty.reset': L('전체 공간 보기', 'View all spots', '查看全部地点', '查看全部地點'),
  'map.title': L('선택한 보관 장소 지도', 'Map of the selected storage spot', '所选寄存点地图', '所選寄存點地圖'),
  'how.kicker': L('PACK LESS WORRY', 'PACK LESS WORRY', 'PACK LESS WORRY', 'PACK LESS WORRY'),
  'how.title': L('복잡한 건 내려놓고,<br>이렇게 가볍게.', 'Set the complicated part down.<br>Keep the day light.', '把麻烦放下，<br>让这一天变轻。', '把麻煩放下，<br>讓這一天變輕。'),
  'how.findCaption': L('FIND A SPOT', 'FIND A SPOT', 'FIND A SPOT', 'FIND A SPOT'),
  'how.findTitle': L('가까운 공간을 찾고', 'Find a nearby spot', '先找附近的地点', '先找附近的地點'),
  'how.findBody': L('지역, 날짜, 시작 시간으로 검색하고,<br>지도에서 위치를 확인해요.', 'Search by area, date, and start time,<br>then check the pin on the map.', '按地区、日期和开始时间搜索，<br>再在地图上确认位置。', '按地區、日期和開始時間搜尋，<br>再在地圖上確認位置。'),
  'how.dropCaption': L('DROP YOUR BAGS', 'DROP YOUR BAGS', 'DROP YOUR BAGS', 'DROP YOUR BAGS'),
  'how.dropTitle': L('QR로 가볍게 맡기면', 'Drop bags with your QR code', '用二维码轻松寄存', '用 QR code 輕鬆寄存'),
  'how.dropBody': L('예약 내역의 QR을 보여주고,<br>매장에서 짐을 맡겨요.', 'Show the QR code in your booking,<br>then leave the bags at the spot.', '出示预约记录里的二维码，<br>在店里放下行李。', '出示預約記錄裡的 QR code，<br>在店裡放下行李。'),
  'how.ready': L('맡길 준비가 되었어요', 'Ready to drop off', '可以寄存了', '可以寄存了'),
  'how.keepCaption': L('KEEP YOUR DAY', 'KEEP YOUR DAY', 'KEEP YOUR DAY', 'KEEP YOUR DAY'),
  'how.keepTitle': L('이제, 오늘을 즐겨요', 'Now enjoy the day', '然后去享受今天', '然後去享受今天'),
  'how.keepBody': L('가벼운 손으로 마음껏 둘러보고,<br>약속한 시간에 짐을 찾아요.', 'Walk around with free hands,<br>then pick the bags up at the agreed time.', '空着手随便逛，<br>再在约定时间取回行李。', '空著手隨便逛，<br>再在約定時間取回行李。'),
  'how.free': L('자유로운 하루, 시작!', 'A free day starts now', '轻松的一天，开始', '輕鬆的一天，開始'),
  'how.nearSmall': L('내 주변 보관 공간', 'Storage near me', '我附近的寄存点', '我附近的寄存點'),
  'price.kicker': L('SAME RATE', 'SAME RATE', 'SAME RATE', 'SAME RATE'),
  'price.title': L('요금은 모든 공간이 같아요', 'Every spot uses the same rate', '所有地点价格相同', '所有地點價格相同'),
  'price.same': L('짐 종류와 상관없이 같은 요금이에요.', 'The rate does not change with bag type.', '不因行李种类改变价格。', '不因行李種類改變價格。'),
  'price.perHour': L('시간당', 'Per hour', '每小时', '每小時'),
  'price.min': L('최소 보관', 'Minimum', '最短寄存', '最短寄存'),
  'price.perDay': L('개당 하루 최대', 'Daily cap per bag', '每件每天上限', '每件每天上限'),
  'price.bags': L('쇼핑백은 1개 요금', 'Shopping bags share one fee', '购物袋按一件计', '購物袋按一件計'),
  'price.hourValue': L('1,000원', '₩1,000', '1,000韩元', '1,000韓元'),
  'price.dayValue': L('5,000원', '₩5,000', '5,000韩元', '5,000韓元'),
  'price.minValue': L('2시간', '2 hours', '2小时', '2小時'),
  'price.bagValue': L('3개까지', 'Up to 3', '最多3件', '最多3件'),
  'care.alt': L('여행하며 둘러볼 수 있는 서울 도심 풍경', 'A Seoul city view you can wander through', '可以一边旅行一边闲逛的首尔市景', '可以一邊旅行一邊閒逛的首爾市景'),
  'care.kicker': L('A LITTLE MORE PEACE OF MIND', 'A LITTLE MORE PEACE OF MIND', 'A LITTLE MORE PEACE OF MIND', 'A LITTLE MORE PEACE OF MIND'),
  'care.title': L('잠시 맡기는 짐에도,<br>꼼꼼한 안심을.', 'Even a short drop-off<br>gets careful care.', '短暂寄存，<br>也仔细放心。', '短暫寄存，<br>也仔細放心。'),
  'care.intro': L('소중한 짐을 맡길 때 필요한 것들.<br>보관 과정을 더 분명하게 확인해요.', 'What you need when leaving something important.<br>The storage steps stay easy to check.', '寄存重要物品时需要的安排。<br>保管过程可以清楚确认。', '寄存重要物品時需要的安排。<br>保管過程可以清楚確認。'),
  'care.compTitle': L('모든 짐, 기본 30만 원까지 보상', 'Every bag includes cover up to ₩300,000', '每件行李基本保障到 30万韩元', '每件行李基本保障到 30萬韓元'),
  'care.compBody': L('맡긴 짐에 문제가 생기면 TooK이 직접 확인하고 보상해요.', 'If something happens to a stored bag, TooK checks it and covers it.', '寄存行李出问题，由 TooK 直接确认并补偿。', '寄存行李出問題，由 TooK 直接確認並補償。'),
  'care.photoTitle': L('맡기고 찾을 때, 사진으로 확인', 'Photos when you drop off and pick up', '寄存和取回时拍照确认', '寄存和取回時拍照確認'),
  'care.photoBody': L('보관 전후의 짐 상태를 사진으로 남겨요.', 'The bag’s condition is photographed before and after storage.', '寄存前后都会留下行李状态照片。', '寄存前後都會留下行李狀態照片。'),
  'care.qrTitle': L('예약마다 다른 나만의 QR', 'A different QR code for every booking', '每次预约都有专属二维码', '每次預約都有專屬 QR code'),
  'care.qrBody': L('예약을 확인하고 간편하게 맡기고 찾아요.', 'Confirm the booking, then drop off and pick up with ease.', '确认预约后，轻松寄存和取回。', '確認預約後，輕鬆寄存和取回。'),
  'care.sealTitle': L('보관 중에는 보안씰과 함께', 'A security seal while it is stored', '寄存期间贴上安全封条', '寄存期間貼上安全封條'),
  'care.sealBody': L('보안씰을 통해 짐을 구분하고 보관해요.', 'The seal keeps each bag identified while it is stored.', '用安全封条区分并保管行李。', '用安全封條區分並保管行李。'),
  'partner.kicker': L('BETTER SPACE, BETTER TRAVEL', 'BETTER SPACE, BETTER TRAVEL', 'BETTER SPACE, BETTER TRAVEL', 'BETTER SPACE, BETTER TRAVEL'),
  'partner.title': L('우리 매장의 작은 여유가,<br>누군가의 가벼운 여행이 되도록.', 'A little spare room in your shop<br>can lighten someone’s trip.', '店里多出的一点空间，<br>可以换成别人的轻旅行。', '店裡多出的一點空間，<br>可以換成別人的輕旅行。'),
  'partner.button': L('파트너로 함께하기', 'Join as a partner', '成为合作伙伴', '成為合作夥伴'),
  'faq.kicker': L('GOOD TO KNOW', 'GOOD TO KNOW', 'GOOD TO KNOW', 'GOOD TO KNOW'),
  'faq.title': L('궁금한 점이<br>남았나요?', 'Still have<br>a question?', '还有<br>想问的吗？', '還有<br>想問的嗎？'),
  'faq.lead': L('처음 맡기는 날에도<br>걱정 없이 시작할 수 있도록.', 'So the first drop-off<br>can start without worry.', '让第一次寄存<br>也能安心开始。', '讓第一次寄存<br>也能安心開始。'),
  'faq.q1': L('예약은 어떻게 하나요?', 'How do I book?', '如何预约？', '如何預約？'),
  'faq.a1': L('원하는 공간을 고른 뒤 날짜, 시작 시간, 짐 개수와 종류를 확인하고 결제하기를 눌러 주세요.', 'Choose a spot, check the date, start time, bag count, and bag type, then press Pay.', '选好地点后，确认日期、开始时间、行李数量和种类，再按付款。', '選好地點後，確認日期、開始時間、行李數量和種類，再按付款。'),
  'faq.q2': L('요금은 어떻게 되나요?', 'How much does it cost?', '费用怎么算？', '費用怎麼算？'),
  'faq.a2': L('짐 종류와 상관없이 시간당 1,000원이에요. 2시간부터 맡길 수 있고, 오래 맡겨도 개당 하루 5,000원을 넘지 않아요. 쇼핑백은 3개까지 1개 요금으로 계산해요.', 'Every bag type is ₩1,000 per hour. Storage starts at 2 hours, and a bag never exceeds ₩5,000 per day. Shopping bags are billed as one item for every three.', '不论种类，每小时 1,000韩元。最短 2 小时，每件每天不超过 5,000韩元。购物袋每 3 件按 1 件计费。', '不論種類，每小時 1,000韓元。最短 2 小時，每件每天不超過 5,000韓元。購物袋每 3 件按 1 件計費。'),
  'faq.q3': L('짐이 분실되거나 망가지면요?', 'What if a bag is lost or damaged?', '行李丢失或损坏怎么办？', '行李遺失或損壞怎麼辦？'),
  'faq.a3': L('모든 짐은 기본 30만 원까지, 안심 플러스를 고르면 100만 원까지 보상해요. 현금, 귀중품, 여권, 노트북, 휴대폰은 보상 대상이 아니에요.', 'Every bag includes cover up to ₩300,000, or ₩1,000,000 with Peace Plus. Cash, valuables, passports, laptops, and phones are not covered.', '每件基本保障 30万韩元，选择安心加值可达 100万韩元。现金、贵重品、护照、笔记本和手机不在保障范围。', '每件基本保障 30萬韓元，選擇安心加值可達 100萬韓元。現金、貴重品、護照、筆電和手機不在保障範圍。'),
  'faq.q4': L('24시간이나 냉장 보관도 되나요?', 'Can I store overnight or keep food cold?', '可以 24 小时或冷藏吗？', '可以 24 小時或冷藏嗎？'),
  'faq.a4': L('목록 위의 24시간 운영, 냉장/냉동 보관으로 그런 공간을 골라 볼 수 있어요. 요금은 다른 공간과 같아요.', 'Use the 24-hour and fridge or freezer filters above the list. The rate is the same as other spots.', '可用列表上方的 24 小时营业、冷藏或冷冻来筛选。价格与其他地点相同。', '可用列表上方的 24 小時營業、冷藏或冷凍來篩選。價格與其他地點相同。'),
  'faq.q5': L('예약 내용은 어디서 확인하나요?', 'Where do I see my booking?', '在哪里查看预约？', '在哪裡查看預約？'),
  'faq.a5': L('상단의 ‘내 예약’에서 예약한 공간, 시간, 요금을 다시 확인할 수 있어요.', 'Open My bookings at the top to see the spot, time, and price again.', '在顶部的“我的预约”里可以再次查看地点、时间和费用。', '在頂部的「我的預約」裡可以再次查看地點、時間和費用。'),
  'faq.q6': L('예약 변경이나 취소는 어떻게 하나요?', 'How do I change or cancel?', '如何更改或取消预约？', '如何更改或取消預約？'),
  'faq.a6': L('‘내 예약’에서 예약을 관리할 수 있어요. 이용 직전에 변경이 필요하면 예약 상세의 안내에 따라 진행해 주세요.', 'Manage the booking in My bookings. If you need a change just before use, follow the note in the booking detail.', '可在“我的预约”里管理。临近使用前要更改，请按预约详情中的说明进行。', '可在「我的預約」裡管理。臨近使用前要更改，請按預約詳情中的說明進行。'),
  'faq.q7': L('우리 매장도 파트너로 참여할 수 있나요?', 'Can our shop join as a partner?', '我们的店可以加入合作吗？', '我們的店可以加入合作嗎？'),
  'faq.a7': L('네. 아래 ‘파트너로 함께하기’에서 매장 정보를 남겨 주시면, 확인 후 안내드릴게요.', 'Yes. Leave your shop details under Join as a partner, and we will reply after checking them.', '可以。请在下方“成为合作伙伴”留下店铺信息，确认后会与您联系。', '可以。請在下方「成為合作夥伴」留下店家資訊，確認後會與您聯絡。'),
  'closing.head': L('짐은 툭', 'Drop your bags', '行李轻放', '行李輕放'),
  'footer.dev': L('개발자', 'Developer', '开发者', '開發者'),
  'dev.kicker': L('DEVELOPER', 'DEVELOPER', 'DEVELOPER', 'DEVELOPER'),
  'dev.title': L('개발자 모드', 'Developer mode', '开发者模式', '開發者模式'),
  'dev.close': L('개발자 모드 닫기', 'Close developer mode', '关闭开发者模式', '關閉開發者模式'),
  'dev.subtitle': L('화면 확인용이에요. 방문자용 메뉴는 아니에요.', 'This is for checking the screen. It is not a visitor menu.', '这是用来检查画面的，不是访客菜单。', '這是用來檢查畫面的，不是訪客選單。'),
  'dev.hide': L('실명 숨기기', 'Hide real names', '隐藏真实店名', '隱藏真實店名'),
  'dev.hideHelp': L('켜 두면 지역과 업종에 알파벳이 붙고, 주소는 구와 동네만 보여요. 끄면 매장 이름과 전체 주소, 지도 버튼이 나와요.', 'On: the label becomes area, category, and a letter, and the address shows only the district and neighborhood. Off: the shop name, full address, and map buttons appear.', '打开后，名称会变成地区、类型和字母，地址只显示区和街区。关闭后会显示店名、完整地址和地图按钮。', '打開後，名稱會變成地區、類型和字母，地址只顯示區和街區。關閉後會顯示店名、完整地址和地圖按鈕。'),
  'dev.copyLegend': L('문구 모드', 'Wording mode', '文案模式', '文案模式'),
  'dev.tourism': L('관광용', 'Tourism', '旅游', '旅遊'),
  'dev.daily': L('일상용', 'Everyday', '日常', '日常'),
  'dev.copyHelp': L('기본은 관광용이에요. 언어가 아니라 문구만 바뀝니다. 이 브라우저에 저장되고, 주소의 copy 값이 있으면 그 값이 우선해요.', 'Tourism is the default. This changes the wording, not the language. It stays in this browser, and a copy value in the address takes priority.', '默认是旅游文案。这里只改文案，不改语言。会保存在这个浏览器里；如果网址带有 copy，以网址为准。', '預設是旅遊文案。這裡只改文案，不改語言。會保存在這個瀏覽器裡；如果網址帶有 copy，以網址為準。'),
  'bookings.kicker': L('YOUR LIGHT TICKETS', 'YOUR LIGHT TICKETS', 'YOUR LIGHT TICKETS', 'YOUR LIGHT TICKETS'),
  'bookings.title': L('내 예약', 'My bookings', '我的预约', '我的預約'),
  'bookings.close': L('내 예약 닫기', 'Close my bookings', '关闭我的预约', '關閉我的預約'),
  'bookings.subtitle': L('예약한 공간과 일정을 여기에서 확인할 수 있어요.', 'You can check the spot and schedule here.', '可以在这里查看地点和时间。', '可以在這裡查看地點和時間。'),
  'bookings.emptyTitle': L('아직 맡겨둔 여행이 없어요.', 'You have no stored trips yet.', '还没有寄存中的行程。', '還沒有寄存中的行程。'),
  'bookings.emptyBody': L('마음에 드는 공간을 골라<br>결제를 진행해 보세요.', 'Choose a spot you like<br>and continue to payment.', '选一个喜欢的地点，<br>然后继续付款。', '選一個喜歡的地點，<br>然後繼續付款。'),
  'bookings.find': L('공간 둘러보기', 'Browse spots', '浏览地点', '瀏覽地點'),
  'bookings.cancel': L('예약 취소', 'Cancel booking', '取消预约', '取消預約'),
  'bookings.confirmDelete': L('삭제 확인', 'Confirm delete', '确认删除', '確認刪除'),
  'bookings.saved': L('SAVED', 'SAVED', 'SAVED', 'SAVED'),
  'partnerDialog.kicker': L('BECOME A LOCAL PARTNER', 'BECOME A LOCAL PARTNER', 'BECOME A LOCAL PARTNER', 'BECOME A LOCAL PARTNER'),
  'partnerDialog.title': L('공간에 새로운 가능성을.', 'A new use for your space.', '给空间一个新可能。', '給空間一個新可能。'),
  'partnerDialog.close': L('파트너 신청 닫기', 'Close partner form', '关闭合作申请', '關閉合作申請'),
  'partnerDialog.subtitle': L('남는 공간으로 여행객을 맞이하고 싶다면, 매장 정보를 남겨 주세요.', 'If spare space could welcome travelers, leave your shop details.', '如果空余空间可以接待旅客，请留下店铺信息。', '如果空餘空間可以接待旅客，請留下店家資訊。'),
  'partner.store': L('매장 이름', 'Shop name', '店铺名称', '店家名稱'),
  'partner.storePh': L('예: 연남 스테이 커피', 'Example: Yeonnam Stay Coffee', '例如：延南 Stay Coffee', '例如：延南 Stay Coffee'),
  'partner.area': L('매장 지역', 'Shop area', '店铺地区', '店家地區'),
  'partner.areaPh': L('예: 서울 마포구 연남동', 'Example: Yeonnam-dong, Mapo-gu, Seoul', '例如：首尔麻浦区延南洞', '例如：首爾麻浦區延南洞'),
  'partner.email': L('이메일', 'Email', '电子邮件', '電子郵件'),
  'partner.consent': L('파트너 안내를 위한 연락 수신에 동의합니다.', 'I agree to be contacted about the partner guide.', '我同意接收合作说明的联系。', '我同意接收合作說明的聯絡。'),
  'partner.submit': L('파트너 신청하기', 'Submit partner request', '提交合作申请', '提交合作申請'),
  'partner.successTitle': L('신청을 남겨 주셨어요.', 'Your request is noted.', '已留下申请。', '已留下申請。'),
  'partner.successBody': L('남겨 주신 내용을 확인한 뒤<br>빠른 안내를 드릴게요.', 'We will check what you sent<br>and reply soon.', '确认您留下的内容后，<br>会尽快说明。', '確認您留下的內容後，<br>會盡快說明。'),
  'partner.ok': L('확인', 'OK', '确认', '確認'),
  'toast.noGeo': L('이 브라우저에서는 현재 위치를 사용할 수 없어요. 지역 이름으로 검색해 주세요.', 'This browser cannot use your location. Search by area name.', '这个浏览器无法使用当前位置。请用地区名称搜索。', '這個瀏覽器無法使用目前位置。請用地區名稱搜尋。'),
  'toast.geoFail': L('현재 위치를 가져오지 못했어요. 지역 이름으로 검색해 주세요.', 'We could not read your location. Search by area name.', '未能取得当前位置。请用地区名称搜索。', '未能取得目前位置。請用地區名稱搜尋。'),
  'toast.saved': L('마음에 드는 공간으로 저장했어요.', 'Saved to your spots.', '已保存到心仪地点。', '已儲存到心儀地點。'),
  'toast.unsaved': L('저장한 공간에서 해제했어요.', 'Removed from saved spots.', '已从保存地点移除。', '已從儲存地點移除。'),
  'toast.saveFail': L('저장하지 못했어요. 잠시 후 다시 시도해 주세요.', 'Could not save. Please try again in a moment.', '未能保存。请稍后再试。', '未能儲存。請稍後再試。'),
  'toast.surveyFail': L('의견을 이 브라우저에 남기지 못했어요.', 'Could not keep the note in this browser.', '未能把意见留在这个浏览器里。', '未能把意見留在這個瀏覽器裡。'),
  'toast.cancelled': L('예약을 취소했어요.', 'Booking cancelled.', '预约已取消。', '預約已取消。'),
  'toast.cancelFail': L('예약을 취소하지 못했어요. 잠시 후 다시 시도해 주세요.', 'Could not cancel the booking. Please try again in a moment.', '未能取消预约。请稍后再试。', '未能取消預約。請稍後再試。'),
  'location.finding': L('위치 확인 중', 'Finding location', '正在确认位置', '正在確認位置'),
  'location.near': L('현재 위치에서 {km}km 안을 보여 주고 있어요.', 'Showing spots within {km} km of you.', '正在显示您 {km} 公里以内的地点。', '正在顯示您 {km} 公里以內的地點。'),
  'location.all': L('현재 위치에서 가까운 순으로 전체 목록을 보여 주고 있어요.', 'Showing the full list, nearest to you first.', '正在按离您的距离显示全部地点。', '正在按離您的距離顯示全部地點。'),
  'location.onlyNear': L('주변만 보기', 'Nearby only', '只看附近', '只看附近'),
  'location.showAll': L('전체 목록 보기', 'Show full list', '查看全部', '查看全部'),
  'location.clear': L('위치 해제', 'Clear location', '清除位置', '清除位置'),
  'card.distance': L('약 {km}km', 'about {km} km', '约 {km} 公里', '約 {km} 公里'),
  'card.photoAlt': L('{type} 분위기 예시 사진', 'Sample photo of a {type}', '{type}氛围示例照片', '{type}氛圍示例照片'),
  'card.open': L('{name} 상세 보기', 'View {name}', '查看{name}', '查看{name}'),
  'card.save': L('{name} 저장', 'Save {name}', '保存{name}', '儲存{name}'),
  'card.unsave': L('{name} 저장 해제', 'Unsave {name}', '取消保存{name}', '取消儲存{name}'),
  'card.reserve': L('예약하기', 'Book', '预约', '預約'),
  'card.detail': L('상세', 'Details', '详情', '詳情'),
  'mark.hours24': L('24시간', '24 hours', '24小时', '24小時'),
  'mark.cold': L('냉장/냉동', 'Cold storage', '冷藏冷冻', '冷藏冷凍'),
  'map.kakao': L('카카오맵', 'Kakao Map', 'Kakao地图', 'Kakao地圖'),
  'map.google': L('구글맵', 'Google Maps', 'Google地图', 'Google地圖'),
  'access.walk': L('{place}에서 도보 {min}분', '{min} min walk from {place}', '从{place}步行{min}分钟', '從{place}步行{min}分鐘'),
  'date.invalid': L('날짜 확인 필요', 'Check the date', '请确认日期', '請確認日期'),
  'detail.close': L('매장 상세 닫기', 'Close place details', '关闭地点详情', '關閉地點詳情'),
  'detail.photoNote': L('사진은 비슷한 분위기를 보여주는 예시예요.', 'The photo is a sample of a similar atmosphere.', '照片只是相近氛围的示例。', '照片只是相近氛圍的示例。'),
  'detail.mapTitle': L('{name} 위치', 'Location of {name}', '{name}的位置', '{name}的位置'),
  'detail.cold': L('냉장/냉동 식품 보관', 'Fridge or freezer for food', '食品冷藏或冷冻', '食品冷藏或冷凍'),
  'detail.sameRate': L('종류와 상관없이 같은 요금', 'Same rate for every type', '不论种类，价格相同', '不論種類，價格相同'),
  'detail.mapNote': L('고른 장소만 지도에 표시해요', 'Only the chosen spot is shown on the map', '地图只显示选中的地点', '地圖只顯示選中的地點'),
  'booking.title': L('잠시 맡길 준비를 해볼까요?', 'Ready to plan the drop-off?', '要准备寄存了吗？', '要準備寄存了嗎？'),
  'booking.subtitle': L('날짜와 시작 시간, 짐 종류를 정한 뒤 결제해 주세요.', 'Choose the date, start time, and bag type, then pay.', '选定日期、开始时间和行李种类后付款。', '選定日期、開始時間和行李種類後付款。'),
  'booking.date': L('보관 날짜', 'Storage date', '寄存日期', '寄存日期'),
  'booking.start': L('시작 시간', 'Start time', '开始时间', '開始時間'),
  'booking.adjusted': L('이 공간 운영시간에 맞춰 시작 시간을 바꿔 두었어요.', 'The start time was adjusted to this spot’s hours.', '已按这个地点的营业时间调整开始时间。', '已按這個地點的營業時間調整開始時間。'),
  'booking.plan': L('요금제', 'Rate', '计费方式', '計費方式'),
  'booking.day': L('하루권', 'Day pass', '一日券', '一日券'),
  'booking.dayPrice': L('개당 {money}', '{money} per bag', '每件 {money}', '每件 {money}'),
  'booking.hour': L('시간권', 'Hourly', '小时券', '小時券'),
  'booking.hourPrice': L('시간당 {money} ({min}시간부터, 하루 최대 {cap})', '{money} per hour (from {min} hours, daily cap {cap})', '每小时 {money}（{min}小时起，每天最多 {cap}）', '每小時 {money}（{min}小時起，每天最多 {cap}）'),
  'booking.end': L('찾는 시간', 'Pickup time', '取回时间', '取回時間'),
  'booking.count': L('짐 개수', 'Bag count', '行李数量', '行李數量'),
  'booking.same': L('종류와 같은 요금', 'Same rate for every type', '种类不影响价格', '種類不影響價格'),
  'booking.bagHint': L('종류와 상관없이 같은 요금, 쇼핑백은 {count}개까지 1개', 'Same rate for every type. Up to {count} shopping bags count as one.', '不论种类价格相同，购物袋每 {count} 件按 1 件计', '不論種類價格相同，購物袋每 {count} 件按 1 件計'),
  'booking.minus': L('짐 수량 줄이기', 'Decrease bag count', '减少行李数量', '減少行李數量'),
  'booking.plus': L('짐 수량 늘리기', 'Increase bag count', '增加行李数量', '增加行李數量'),
  'booking.shopping': L('이 중 쇼핑백', 'Shopping bags included', '其中购物袋', '其中購物袋'),
  'booking.shoppingHint': L('{count}개까지 1개 요금', 'Up to {count} count as one', '每 {count} 件按 1 件计', '每 {count} 件按 1 件計'),
  'booking.shoppingMinus': L('쇼핑백 수량 줄이기', 'Decrease shopping bags', '减少购物袋', '減少購物袋'),
  'booking.shoppingPlus': L('쇼핑백 수량 늘리기', 'Increase shopping bags', '增加购物袋', '增加購物袋'),
  'booking.note': L('짐 종류', 'Bag type', '行李种类', '行李種類'),
  'booking.notePh': L('예: 기내용 캐리어 하나와 종이 쇼핑백', 'Example: one cabin suitcase and a paper shopping bag', '例如：一个登机箱和一个纸袋', '例如：一個登機箱和一個紙袋'),
  'booking.plusLabel': L('안심 플러스 (개당 +{money}). 보상 한도를 30만 원에서 100만 원으로 올리고, 다른 짐과 분리된 선반에 보관해요.', 'Peace Plus (+{money} per bag). Cover rises from ₩300,000 to ₩1,000,000, and the bag stays on a separate shelf.', '安心加值（每件 +{money}）。保障从 30万韩元提高到 100万韩元，并放在单独架子上。', '安心加值（每件 +{money}）。保障從 30萬韓元提高到 100萬韓元，並放在單獨架子上。'),
  'booking.storage': L('보관료', 'Storage', '寄存费', '寄存費'),
  'booking.plusFee': L('안심 플러스', 'Peace Plus', '安心加值', '安心加值'),
  'booking.total': L('총 결제 금액', 'Total', '应付总额', '應付總額'),
  'booking.consent': L('선택한 일정과 요금으로 결제를 진행합니다.', 'I will continue to payment with this schedule and price.', '我将按所选时间和费用继续付款。', '我將按所選時間和費用繼續付款。'),
  'booking.submit': L('결제하기', 'Pay', '付款', '付款'),
  'formula.day': L('{money} × {units}', '{money} × {units}', '{money} × {units}', '{money} × {units}'),
  'formula.cap': L('하루 최대 {money} × {units}', 'Daily cap {money} × {units}', '每天最多 {money} × {units}', '每天最多 {money} × {units}'),
  'formula.mix': L('{dayMoney} × {days} + {hourMoney} × {hours} × {units}', '{dayMoney} × {days} + {hourMoney} × {hours} × {units}', '{dayMoney} × {days} + {hourMoney} × {hours} × {units}', '{dayMoney} × {days} + {hourMoney} × {hours} × {units}'),
  'formula.mixNoRest': L('{dayMoney} × {days} × {units}', '{dayMoney} × {days} × {units}', '{dayMoney} × {days} × {units}', '{dayMoney} × {days} × {units}'),
  'formula.hour': L('{money} × {hours} × {units}', '{money} × {hours} × {units}', '{money} × {hours} × {units}', '{money} × {hours} × {units}'),
  'formula.check': L('시간을 다시 확인해 주세요.', 'Please check the times again.', '请再确认时间。', '請再確認時間。'),
  'note.bags': L('쇼핑백 {bags}개는 {units}개 요금으로 계산했어요', '{bags} shopping bags are billed as {units}', '购物袋 {bags} 件按 {units} 件计费', '購物袋 {bags} 件按 {units} 件計費'),
  'note.minimum': L('시간권은 {hours}시간부터예요', 'Hourly storage starts at {hours} hours', '小时券从 {hours} 小时起', '小時券從 {hours} 小時起'),
  'note.cap': L('하루 최대 요금이 적용됐어요', 'The daily cap is applied', '已套用每天上限', '已套用每天上限'),
  'summary.date': L('날짜', 'Date', '日期', '日期'),
  'summary.time': L('시간', 'Time', '时间', '時間'),
  'summary.plan': L('요금제', 'Rate', '计费方式', '計費方式'),
  'summary.luggage': L('짐', 'Bags', '行李', '行李'),
  'summary.bags': L('쇼핑백', 'Shopping bags', '购物袋', '購物袋'),
  'summary.bagValue': L('{count}개, {units}개 요금', '{count}, billed as {units}', '{count}件，按{units}件计', '{count}件，按{units}件計'),
  'summary.luggageValue': L('{count}개, {note}', '{count}, {note}', '{count}件，{note}', '{count}件，{note}'),
  'summary.start': L('{time} 시작', 'Starts {time}', '{time} 开始', '{time} 開始'),
  'summary.plusOn': L('포함', 'Included', '已含', '已含'),
  'summary.plusOff': L('없음', 'Not included', '未选', '未選'),
  'summary.guide': L('안내 금액', 'Quoted price', '提示金额', '提示金額'),
  'mvp.tabs': L('설문과 예약', 'Survey and booking', '问卷和预约', '問卷和預約'),
  'mvp.survey': L('경험 설문', 'Experience survey', '体验问卷', '體驗問卷'),
  'mvp.reservation': L('내가 고른 예약', 'The booking I chose', '我选的预约', '我選的預約'),
  'mvp.title': L('사실, TooK은 아직<br>정식 출시 전이에요.', 'TooK is not<br>fully launched yet.', '其实 TooK<br>还没有正式上线。', '其實 TooK<br>還沒有正式上線。'),
  'mvp.lead': L('방금 고르신 예약은 이런 서비스가 정말 필요한지 확인하기 위한 테스트였어요.<br>실제 결제와 예약은 이루어지지 않았고, 어떤 비용도 청구되지 않아요.', 'The booking you just made was a test to see if this service is needed.<br>No real payment or reservation was made, and nothing will be charged.', '刚才的预约只是为了确认这项服务是否真的需要。<br>没有实际付款或预约，也不会收取任何费用。', '剛才的預約只是為了確認這項服務是否真的需要。<br>沒有實際付款或預約，也不會收取任何費用。'),
  'mvp.note': L('끝까지 골라 주신 경험이 저희에게 가장 정확한 답이에요. 1분만 더 들려주세요.', 'Finishing the choices gives us the clearest answer. One more minute, please.', '您走完这些选择，就是最准确的回答。请再给我们一分钟。', '您走完這些選擇，就是最準確的回答。請再給我們一分鐘。'),
  'mvp.q1': L('1. 정식으로 출시되면 실제로 이용할 것 같나요?', '1. If this launches, would you actually use it?', '1. 正式上线后，您觉得自己会使用吗？', '1. 正式上線後，您覺得自己會使用嗎？'),
  'mvp.low': L('전혀 아니에요', 'Not at all', '完全不会', '完全不會'),
  'mvp.high': L('꼭 쓸 거예요', 'I definitely would', '一定会用', '一定會用'),
  'mvp.q2': L('2. 방금 본 가격은 어땠나요?', '2. How did the price feel?', '2. 刚才的价格感觉如何？', '2. 剛才的價格感覺如何？'),
  'mvp.cheap': L('싸다', 'Low', '便宜', '便宜'),
  'mvp.fair': L('적당하다', 'Fair', '合适', '合適'),
  'mvp.bitHigh': L('조금 비싸다', 'A bit high', '稍贵', '稍貴'),
  'mvp.tooHigh': L('너무 비싸다', 'Too high', '太贵', '太貴'),
  'mvp.q3': L('3. 쇼핑백 1개를 2시간 맡긴다면 최대 얼마까지 낼 수 있나요?', '3. What is the most you would pay to store one shopping bag for 2 hours?', '3. 一个购物袋寄存 2 小时，您最多愿意付多少？', '3. 一個購物袋寄存 2 小時，您最多願意付多少？'),
  'mvp.pricePh': L('예: 4000', 'Example: 4000', '例如：4000', '例如：4000'),
  'mvp.won': L('원', 'KRW', '韩元', '韓元'),
  'mvp.q4': L('4. 안심 플러스(개당 {money}, 보상 100만 원)는 어땠나요?', '4. How did Peace Plus ({money} per bag, cover up to ₩1,000,000) feel?', '4. 安心加值（每件 {money}，保障 100万韩元）感觉如何？', '4. 安心加值（每件 {money}，保障 100萬韓元）感覺如何？'),
  'mvp.no': L('필요 없어요', 'I do not need it', '不需要', '不需要'),
  'mvp.maybe': L('비싸지 않으면 쓸 것 같아요', 'I would use it if it is not expensive', '不贵的话可能会用', '不貴的話可能會用'),
  'mvp.yes': L('꼭 필요해요', 'I need it', '一定需要', '一定需要'),
  'mvp.q5': L('5. 예약 과정은 얼마나 쉬웠나요?', '5. How easy was booking?', '5. 预约过程有多容易？', '5. 預約過程有多容易？'),
  'mvp.hard': L('어려웠어요', 'Difficult', '很难', '很難'),
  'mvp.easy': L('아주 쉬웠어요', 'Very easy', '非常容易', '非常容易'),
  'mvp.q6': L('6. 결제 직전에 망설여진 점이 있었나요?', '6. Did anything make you hesitate just before paying?', '6. 付款前有让您犹豫的地方吗？', '6. 付款前有讓您猶豫的地方嗎？'),
  'mvp.multi': L('(여러 개 선택)', '(choose any)', '（可多选）', '（可多選）'),
  'mvp.q7': L('7. 이런 점이 있으면 좋겠어요', '7. It would help if…', '7. 如果有这些会更好', '7. 如果有這些會更好'),
  'mvp.optional': L('(선택)', '(optional)', '（选填）', '（選填）'),
  'mvp.wishPh': L('자유롭게 적어 주세요', 'Write anything you like', '请随意填写', '請隨意填寫'),
  'mvp.sms': L('정식 출시 소식을 문자로 받을게요. 선택하지 않으면 입력하신 연락처는 7일 안에 삭제해요.', 'Text me when it launches. If you skip this, any contact you entered is deleted within 7 days.', '上线时请短信通知我。若不勾选，填写的联系方式会在 7 天内删除。', '上線時請簡訊通知我。若不勾選，填寫的聯絡方式會在 7 天內刪除。'),
  'mvp.send': L('의견 보내기', 'Send feedback', '发送意见', '傳送意見'),
  'mvp.later': L('다음에 할게요', 'Maybe later', '下次再说', '下次再說'),
  'mvp.thanksTitle': L('의견을 이 브라우저에만 남겼어요.', 'Your note stays only in this browser.', '意见只留在这个浏览器里。', '意見只留在這個瀏覽器裡。'),
  'mvp.thanksBody': L('적은 내용은 서버로 보내지 않아요.', 'What you wrote is not sent to a server.', '填写的内容不会送到服务器。', '填寫的內容不會送到伺服器。'),
  'mvp.priceNote': L('이 금액은 체험 중 안내한 요금이에요. 결제는 청구되지 않았어요.', 'This amount is the price shown during the tryout. Nothing was charged.', '这个金额只是体验时显示的价格。没有实际扣款。', '這個金額只是體驗時顯示的價格。沒有實際扣款。'),
  'hesitation.price': L('가격', 'Price', '价格', '價格'),
  'hesitation.unfamiliar': L('처음 보는 매장이라 불안', 'Unfamiliar shop', '不认识的店铺，不放心', '不認識的店家，不放心'),
  'hesitation.distance': L('위치·거리', 'Location and distance', '位置和距离', '位置和距離'),
  'hesitation.hours': L('운영시간', 'Opening hours', '营业时间', '營業時間'),
  'hesitation.loss': L('분실·파손 걱정', 'Loss or damage', '担心遗失或损坏', '擔心遺失或損壞'),
  'hesitation.payment': L('결제 방식', 'Payment method', '付款方式', '付款方式'),
  'hesitation.none': L('없었어요', 'Nothing', '没有', '沒有'),
  'survey.needHesitation': L('결제 직전에 망설여진 점을 하나 이상 골라 주세요.', 'Choose at least one reason you hesitated before paying.', '请至少选一项付款前让您犹豫的原因。', '請至少選一項付款前讓您猶豫的原因。'),
  'error.date': L('오늘 이후의 보관 날짜를 선택해 주세요.', 'Choose a storage date after today.', '请选择今天之后的寄存日期。', '請選擇今天之後的寄存日期。'),
  'error.start': L('운영시간 안에서 시작 시간을 선택해 주세요.', 'Choose a start time within opening hours.', '请选择营业时间内的开始时间。', '請選擇營業時間內的開始時間。'),
  'error.plan': L('요금제를 선택해 주세요.', 'Choose a rate.', '请选择计费方式。', '請選擇計費方式。'),
  'error.end': L('운영시간 안에서 찾는 시간을 선택해 주세요.', 'Choose a pickup time within opening hours.', '请选择营业时间内的取回时间。', '請選擇營業時間內的取回時間。'),
  'error.count': L('짐은 1개부터 10개까지 선택할 수 있어요.', 'You can store from 1 to 10 bags.', '行李可以选择 1 到 10 件。', '行李可以選擇 1 到 10 件。'),
  'error.note': L('짐 종류를 1자에서 120자 사이로 적어 주세요.', 'Describe the bags in 1 to 120 characters.', '请用 1 到 120 个字描述行李种类。', '請用 1 到 120 個字描述行李種類。'),
  'error.time': L('시간을 확인해 주세요.', 'Please check the time.', '请确认时间。', '請確認時間。'),
  'error.order': L('찾는 시간을 시작 시간보다 늦게 선택해 주세요.', 'Choose a pickup time later than the start time.', '取回时间要晚于开始时间。', '取回時間要晚於開始時間。'),
  'error.generic': L('내용을 다시 확인해 주세요.', 'Please check this again.', '请再确认这项内容。', '請再確認這項內容。'),
  'copy.title': C(
    L('TooK — 짐은 툭, 여행은 쭉', 'TooK — Drop your bags, keep the trip', 'TooK — 行李轻放，旅程继续', 'TooK — 行李輕放，旅程繼續'),
    L('TooK — 짐은 툭, 오늘은 가볍게', 'TooK — Drop your bags, lighten today', 'TooK — 行李轻放，今天轻松', 'TooK — 行李輕放，今天輕鬆')
  ),
  'copy.meta': C(
    L('숙소에 짐을 두기 어려운 시간, 가까운 공간에 맡기고 남은 여행을 가볍게 이어가세요. TooK.', 'When the hotel cannot hold your bags, leave them nearby and keep the rest of the trip light. TooK.', '酒店不便放行李的时候，寄存在附近，让剩下的旅程轻一点。TooK.', '飯店不便放行李的時候，寄存在附近，讓剩下的旅程輕一點。TooK.'),
    L('쇼핑하다 늘어난 쇼핑백도, 다음 약속까지 들고 다니기 부담스러운 가방도. 가까운 공간에 잠시 맡기고 오늘을 가볍게 즐기세요. TooK.', 'Shopping bags pile up, and some bags are too much to carry to the next plan. Leave them nearby and enjoy a lighter day. TooK.', '购物袋越来越多，下一场约定前也不想一直提着。先寄存在附近，轻松过今天。TooK.', '購物袋越來越多，下一場約定前也不想一直提著。先寄存在附近，輕鬆過今天。TooK.')
  ),
  'copy.hero-title': C(
    L('짐은 툭,<br>여행은 <span class="underlined">쭉</span>', 'Drop your bags,<br>keep the <span class="underlined">trip</span>', '行李轻放，<br>旅程<span class="underlined">继续</span>', '行李輕放，<br>旅程<span class="underlined">繼續</span>'),
    L('짐은 툭,<br>오늘은 <span class="underlined">가볍게</span>', 'Drop your bags,<br>lighten <span class="underlined">today</span>', '行李轻放，<br>今天<span class="underlined">轻松</span>', '行李輕放，<br>今天<span class="underlined">輕鬆</span>')
  ),
  'copy.hero-description': C(
    L('숙소에 짐을 두기 어려운 시간,<br>가까운 공간에 맡기고 남은 여행을 가볍게 이어가세요.', 'When the hotel cannot hold your bags,<br>leave them nearby and keep the rest of the trip light.', '酒店不便放行李的时候，<br>寄存在附近，让剩下的旅程轻一点。', '飯店不便放行李的時候，<br>寄存在附近，讓剩下的旅程輕一點。'),
    L('쇼핑하다 늘어난 쇼핑백도, 다음 약속까지 들고 다니기 부담스러운 가방도.<br>가까운 공간에 잠시 맡기고 오늘을 가볍게 즐기세요.', 'Shopping bags pile up, and some bags are too much to carry to the next plan.<br>Leave them nearby and enjoy a lighter day.', '购物袋越来越多，下一场约定前也不想一直提着。<br>先寄存在附近，轻松过今天。', '購物袋越來越多，下一場約定前也不想一直提著。<br>先寄存在附近，輕鬆過今天。')
  ),
  'copy.hero-cta': C(
    L('여행지 근처 보관 장소 찾기', 'Find storage near your trip', '查找旅途附近的寄存点', '尋找旅途附近的寄存點'),
    L('가까운 보관 장소 찾기', 'Find storage nearby', '查找附近的寄存点', '尋找附近的寄存點')
  ),
  'copy.story-heading': C(
    L('숙소에 짐을 두기 어려울 때', 'When the hotel is not an option', '酒店不方便放行李时', '飯店不方便放行李時'),
    L('짐이 오늘을 무겁게 만들 때', 'When bags make the day heavy', '行李让今天变重时', '行李讓今天變重時')
  ),
  'copy.story-lead': C(
    L('도보나 대중교통으로 움직이는 여행에서, 숙소 보관이 어렵거나 되돌아가는 길이 부담일 때 써요.', 'Use it on a walking or transit trip when the hotel cannot store bags, or going back would take too long.', '步行或搭乘大众运输旅行时，如果酒店不能寄存，或折返太费时间，就可以用。', '步行或搭乘大眾運輸旅行時，如果飯店不能寄存，或折返太費時間，就可以用。'),
    L('쇼핑 가방도, 약속 전까지 두기 힘든 짐도 가까운 공간에 맡겨요.', 'Leave shopping bags, and anything you cannot hold until the next plan, at a nearby spot.', '购物袋和下一场约定前不便携带的行李，都可以寄存在附近。', '購物袋和下一場約定前不便攜帶的行李，都可以寄存在附近。')
  ),
  'copy.bubble-1-title': C(
    L('체크인 전, 캐리어 없이 첫 일정을 시작하고 싶을 때', 'Before check-in, when you want the first plan without a suitcase', '入住前，想先不拖行李箱开始行程', '入住前，想先不拖行李箱開始行程'),
    L('쇼핑백이 늘어난 날', 'When the shopping bags multiply', '购物袋越来越多的一天', '購物袋越來越多的一天')
  ),
  'copy.bubble-1-body': C(
    L('숙소 문을 열기 전에 근처를 먼저 둘러봐요.', 'Look around the neighborhood before the room is ready.', '房间还没开之前，先在附近走走。', '房間還沒開之前，先在附近走走。'),
    L('손에 쌓인 가방을 가까운 곳에 잠시 맡겨요.', 'Leave the bags in your hands at a nearby spot for a while.', '把手上的袋子先寄存在附近。', '把手上的袋子先寄存在附近。')
  ),
  'copy.bubble-2-title': C(
    L('체크아웃 후, 기차나 비행기 시간까지 일정이 남았을 때', 'After checkout, when you still have time before the train or flight', '退房后，火车或飞机之前还有安排', '退房後，火車或飛機之前還有安排'),
    L('퇴근 후 약속 전', 'After work, before the next plan', '下班后、下一场约定前', '下班後、下一場約定前')
  ),
  'copy.bubble-2-body': C(
    L('이동 전까지 남은 일정은 빈손으로 이어가요.', 'Keep the time before departure hands-free.', '出发前剩下的行程，空着手继续。', '出發前剩下的行程，空著手繼續。'),
    L('약속 장소까지 가방을 들고 가지 않아도 돼요.', 'You do not have to carry the bag all the way there.', '不必一路提着袋子去约定的地方。', '不必一路提著袋子去約定的地方。')
  ),
  'copy.bubble-3-title': C(
    L('당일 여행이거나 숙소가 멀어 짐을 두기 어려울 때', 'On a day trip, or when the hotel is too far for a drop-off', '当日往返，或酒店太远不方便放行李', '當日往返，或飯店太遠不方便放行李'),
    L('짐 때문에 다음 활동이 불편한 날', 'When the next activity is awkward with bags', '行李让下一件事变得不方便', '行李讓下一件事變得不方便')
  ),
  'copy.bubble-3-body': C(
    L('숙소가 멀면 가까운 공간에 잠시 맡겨요.', 'If the hotel is far, leave the bags at a closer spot.', '酒店太远时，先寄存在更近的地方。', '飯店太遠時，先寄存在更近的地方。'),
    L('잠깐 맡기고 다음 일정을 빈손으로 이어가요.', 'Leave them briefly and continue the next plan hands-free.', '短暂寄存后，空着手进行下一项安排。', '短暫寄存後，空著手進行下一項安排。')
  ),
  'copy.persona-1-role': C(L('동선', 'Route', '路线', '路線'), L('쇼핑', 'Shopping', '购物', '購物')),
  'copy.persona-1-title': C(
    L('숙소까지 다시 가기엔 시간이 아까워요', 'Going back to the hotel costs too much time', '再回酒店太花时间', '再回飯店太花時間'),
    L('쇼핑백이 손에 쌓인 날', 'A day when shopping bags fill your hands', '购物袋堆在手上的一天', '購物袋堆在手上的一天')
  ),
  'copy.persona-1-li-1': C(
    L('도보나 대중교통으로 움직이다 숙소까지 돌아가기 어려워요', 'Walking or taking transit makes a return to the hotel hard', '步行或搭乘大众运输时，很难再折返酒店', '步行或搭乘大眾運輸時，很難再折返飯店'),
    L('가게를 옮겨 다닐 때 가방이 자꾸 늘어요', 'The bags keep growing as you move from shop to shop', '一家家逛过去，袋子不断变多', '一家家逛過去，袋子不斷變多')
  ),
  'copy.persona-1-li-2': C(
    L('몇 시간만 맡기고 같은 동네에서 찾고 싶어요', 'You want to leave them for a few hours and pick them up in the same neighborhood', '只想寄存几小时，并在同一带取回', '只想寄存幾小時，並在同一帶取回'),
    L('몇 시간만 맡기고 같은 동네에서 찾고 싶어요', 'You want to leave them for a few hours and pick them up in the same neighborhood', '只想寄存几小时，并在同一带取回', '只想寄存幾小時，並在同一帶取回')
  ),
  'copy.persona-1-li-3': C(
    L('짐 개수대로 요금이 보이면 좋겠어요', 'You want the price to follow the number of bags', '希望价格按行李件数显示', '希望價格按行李件數顯示'),
    L('짐 개수대로 요금이 보이면 좋겠어요', 'You want the price to follow the number of bags', '希望价格按行李件数显示', '希望價格按行李件數顯示')
  ),
  'copy.persona-2-role': C(L('빈손', 'Hands free', '空手', '空手'), L('약속 전', 'Before plans', '约定前', '約定前')),
  'copy.persona-2-title': C(
    L('캐리어와 쇼핑백을 같이 들고 다닐 때', 'When a suitcase and shopping bags travel together', '行李箱和购物袋一起拿的时候', '行李箱和購物袋一起拿的時候'),
    L('퇴근 후, 다음 약속까지 가방이 부담일 때', 'After work, when the bag is too much before the next plan', '下班后，下一场约定前袋子成为负担', '下班後，下一場約定前袋子成為負擔')
  ),
  'copy.persona-2-li-1': C(
    L('종류가 달라도 같은 요금, 쇼핑백은 묶어서 맡기고 싶어요', 'You want one rate for every type, with shopping bags grouped together', '种类不同也想同价，购物袋希望合并计费', '種類不同也想同價，購物袋希望合併計費'),
    L('약속 장소까지는 빈손으로 가고 싶어요', 'You want to arrive at the next place hands-free', '希望空着手去下一场约定', '希望空著手去下一場約定')
  ),
  'copy.persona-2-li-3': C(
    L('다시 찾을 시간과 장소를 미리 정하고 싶어요', 'You want the pickup time and place decided in advance', '希望事先定好取回时间和地点', '希望事先定好取回時間和地點'),
    L('다시 찾을 시간과 장소를 미리 정하고 싶어요', 'You want the pickup time and place decided in advance', '希望事先定好取回时间和地点', '希望事先定好取回時間和地點')
  ),
  'copy.needs-how': C(
    L('여행지 근처 공간을 고르고 지도에서 위치를 확인해요', 'Choose a spot near the trip and check it on the map', '选择旅途附近的地点，并在地图上确认', '選擇旅途附近的地點，並在地圖上確認'),
    L('가까운 공간을 고르고 지도에서 위치를 확인해요', 'Choose a nearby spot and check it on the map', '选择附近地点，并在地图上确认', '選擇附近地點，並在地圖上確認')
  ),
  'copy.how-side': C(
    L('짐을 맡기는 순간부터 다시 찾을 때까지.<br>여행을 방해하지 않는 간단한 과정.', 'From the moment you drop the bags until you pick them up.<br>A simple path that does not interrupt the trip.', '从寄存到取回。<br>不打断旅行的简单步骤。', '從寄存到取回。<br>不打斷旅行的簡單步驟。'),
    L('짐을 맡기는 순간부터 다시 찾을 때까지.<br>오늘 일정을 방해하지 않는 간단한 과정.', 'From the moment you drop the bags until you pick them up.<br>A simple path that does not interrupt today’s plans.', '从寄存到取回。<br>不打断今天安排的简单步骤。', '從寄存到取回。<br>不打斷今天安排的簡單步驟。')
  ),
  'copy.how-near': C(
    L('여행 동선 가까이에', 'Close to the trip', '靠近旅行路线', '靠近旅行路線'),
    L('지금 있는 곳 가까이에', 'Close to where you are', '靠近你现在的位置', '靠近你現在的位置')
  ),
  'copy.care-caption': C(
    L('걱정은 줄이고,<br>여행의 순간은 더하고.', 'Less worry,<br>more of the trip.', '少一点担心，<br>多一点旅程。', '少一點擔心，<br>多一點旅程。'),
    L('걱정은 줄이고,<br>오늘의 일정은 가볍게.', 'Less worry,<br>a lighter plan today.', '少一点担心，<br>今天的安排更轻。', '少一點擔心，<br>今天的安排更輕。')
  ),
  'copy.partner-line': C(
    L('남는 공간으로 여행객을 맞이하는 새로운 방법.', 'A new way for spare space to welcome travelers.', '用空余空间迎接旅客的新方式。', '用空餘空間迎接旅客的新方式。'),
    L('남는 공간으로 오늘을 가볍게 보내는 사람을 맞이해요.', 'Spare space can welcome someone who wants a lighter day.', '用空余空间，迎接想轻松过今天的人。', '用空餘空間，迎接想輕鬆過今天的人。')
  ),
  'copy.closing-tail': C(L('여행은 쭉', 'Keep the trip', '旅程继续', '旅程繼續'), L('오늘은 가볍게', 'Lighten today', '今天轻松', '今天輕鬆')),
  'copy.footer-slogan': C(L('짐은 툭, 여행은 쭉.', 'Drop your bags, keep the trip.', '行李轻放，旅程继续。', '行李輕放，旅程繼續。'), L('짐은 툭, 오늘은 가볍게.', 'Drop your bags, lighten today.', '行李轻放，今天轻松。', '行李輕放，今天輕鬆。')),
  'copy.footer-line': C(
    L('가까운 공간에 맡기고 남은 여행을 가볍게 이어가세요.', 'Leave bags nearby and keep the rest of the trip light.', '寄存在附近，让剩下的旅程轻一点。', '寄存在附近，讓剩下的旅程輕一點。'),
    L('가까운 공간에 잠시 맡기고 오늘을 가볍게 즐기세요.', 'Leave them nearby for a while and enjoy a lighter day.', '先寄存在附近，轻松过今天。', '先寄存在附近，輕鬆過今天。')
  )
};

const PLACES = {
  '서울': P('Seoul', '首尔', '首爾', ['seoul']),
  '부산': P('Busan', '釜山', '釜山', ['busan', 'pusan']),
  '인천': P('Incheon', '仁川', '仁川', ['incheon']),
  '대구': P('Daegu', '大邱', '大邱', ['daegu']),
  '대전': P('Daejeon', '大田', '大田', ['daejeon']),
  '광주': P('Gwangju', '光州', '光州', ['gwangju']),
  '울산': P('Ulsan', '蔚山', '蔚山', ['ulsan']),
  '세종': P('Sejong', '世宗', '世宗', ['sejong']),
  '제주': P('Jeju', '济州', '濟州', ['jeju']),
  '수원': P('Suwon', '水原', '水原', ['suwon']),
  '성남': P('Seongnam', '城南', '城南', ['seongnam']),
  '고양': P('Goyang', '高阳', '高陽', ['goyang']),
  '용인': P('Yongin', '龙仁', '龍仁', ['yongin']),
  '창원': P('Changwon', '昌原', '昌原', ['changwon']),
  '청주': P('Cheongju', '清州', '清州', ['cheongju']),
  '천안': P('Cheonan', '天安', '天安', ['cheonan']),
  '전주': P('Jeonju', '全州', '全州', ['jeonju']),
  '안양': P('Anyang', '安养', '安養', ['anyang']),
  '안산': P('Ansan', '安山', '安山', ['ansan']),
  '김해': P('Gimhae', '金海', '金海', ['gimhae']),
  '포항': P('Pohang', '浦项', '浦項', ['pohang']),
  '평택': P('Pyeongtaek', '平泽', '平澤', ['pyeongtaek']),
  '파주': P('Paju', '坡州', '坡州', ['paju']),
  '의정부': P('Uijeongbu', '议政府', '議政府', ['uijeongbu']),
  '부천': P('Bucheon', '富川', '富川', ['bucheon']),
  '구리': P('Guri', '九里', '九里', ['guri']),
  '오산': P('Osan', '乌山', '烏山', ['osan']),
  '강릉': P('Gangneung', '江陵', '江陵', ['gangneung']),
  '경주': P('Gyeongju', '庆州', '慶州', ['gyeongju', 'kyongju']),
  '춘천': P('Chuncheon', '春川', '春川', ['chuncheon']),
  '밀양': P('Miryang', '密阳', '密陽', ['miryang']),
  '기타': P('Other', '其他', '其他', ['other']),
  '강남': P('Gangnam', '江南', '江南', ['gangnam']),
  '홍대·연남': P('Hongdae–Yeonnam', '弘大·延南', '弘大·延南', ['hongdae', 'yeonnam', 'hongik', 'hongdae yeonnam']),
  '성수': P('Seongsu', '圣水', '聖水', ['seongsu', 'seongsu-dong']),
  '건대': P('Konkuk Univ. area', '建大', '建大', ['konkuk', 'konkuk university', '건대입구']),
  '송리단길·잠실': P('Songnidan-gil–Jamsil', '松里丹路·蚕室', '松里丹路·蠶室', ['jamsil', 'songnidan', 'songpa']),
  '대학로': P('Daehak-ro', '大学路', '大學路', ['daehakro', 'daehak-ro', 'hyehwa']),
  '종로·익선': P('Jongno–Ikseon', '钟路·益善', '鍾路·益善', ['jongno', 'ikseon', 'insadong']),
  '명동': P('Myeongdong', '明洞', '明洞', ['myeongdong', 'myungdong']),
  '신촌·이대': P('Sinchon–Ewha', '新村·梨大', '新村·梨大', ['sinchon', 'ewha', 'eidae']),
  '광안리': P('Gwangalli', '广安里', '廣安里', ['gwangalli', 'kwangan']),
  '해운대': P('Haeundae', '海云台', '海雲台', ['haeundae', 'haeundae beach']),
  '서면': P('Seomyeon', '西面', '西面', ['seomyeon']),
  '남포·광복': P('Nampo–Gwangbok', '南浦·光复', '南浦·光復', ['nampo', 'gwangbok', 'nampodong']),
  '공항': P('Airport', '机场', '機場', ['airport', 'incheon airport']),
  '개항장': P('Open Port', '开港场', '開港場', ['open port', 'chinatown incheon']),
  '부평': P('Bupyeong', '富平', '富平', ['bupyeong']),
  '동대구': P('Dongdaegu', '东大邱', '東大邱', ['dongdaegu', 'east daegu']),
  '스카이로드': P('Sky Road', '天空路', '天空路', ['sky road', 'skyroad']),
  '공방': P('Workshop', '工坊', '工坊', ['workshop', 'craft']),
  '공방·원데이클래스': P('Workshop', '工坊', '工坊', ['workshop', 'one day class']),
  '보드게임카페': P('Board game cafe', '桌游咖啡馆', '桌遊咖啡館', ['board game', 'boardgame cafe']),
  '만화카페': P('Comic cafe', '漫画咖啡馆', '漫畫咖啡館', ['comic cafe', 'manga cafe']),
  '방탈출': P('Escape room', '密室逃脱', '密室脫逃', ['escape room', 'escape']),
  '기념품점': P('Souvenir shop', '纪念品店', '紀念品店', ['souvenir']),
  '담배 가게': P('Tobacco shop', '烟草店', '菸草店', ['tobacco']),
  '델리': P('Deli', '熟食店', '熟食店', ['deli']),
  '디저트 가게': P('Dessert shop', '甜品店', '甜品店', ['dessert']),
  '렌터카': P('Car rental', '租车', '租車', ['car rental', 'rent a car']),
  '문화 공간': P('Cultural space', '文化空间', '文化空間', ['cultural space']),
  '미용실': P('Hair salon', '美发店', '美髮店', ['hair salon']),
  '사무실': P('Office', '办公室', '辦公室', ['office']),
  '소매점': P('Retail shop', '零售店', '零售店', ['retail']),
  '수리점': P('Repair shop', '修理店', '修理店', ['repair']),
  '약국': P('Pharmacy', '药店', '藥局', ['pharmacy']),
  '여행사': P('Travel agency', '旅行社', '旅行社', ['travel agency']),
  '웰니스 센터': P('Wellness center', '养生中心', '養生中心', ['wellness']),
  '음식점': P('Restaurant', '餐厅', '餐廳', ['restaurant']),
  '인쇄소': P('Print shop', '印刷店', '印刷店', ['print shop']),
  '자전거 대여': P('Bike rental', '自行车租赁', '自行車租賃', ['bike rental']),
  '전자제품점': P('Electronics shop', '电子产品店', '電子產品店', ['electronics']),
  '짐 보관소': P('Luggage storage', '行李寄存点', '行李寄存點', ['luggage storage', 'locker']),
  '카페': P('Cafe', '咖啡馆', '咖啡館', ['cafe', 'coffee']),
  '타투숍': P('Tattoo studio', '纹身店', '紋身店', ['tattoo']),
  '투어·체험': P('Tour and experience', '观光体验', '觀光體驗', ['tour', 'experience']),
  '편의점': P('Convenience store', '便利店', '便利店', ['convenience store']),
  '피트니스 센터': P('Fitness center', '健身中心', '健身中心', ['fitness', 'gym']),
  '헤어살롱': P('Hair studio', '美发沙龙', '美髮沙龍', ['hair studio']),
  '호텔': P('Hotel', '酒店', '酒店', ['hotel']),
  '환전소': P('Currency exchange', '兑换处', '兌換處', ['currency exchange', 'exchange'])
};

const HOUR_TOKENS = [
  ['월요일', L('월요일', 'Mon', '周一', '週一')],
  ['화요일', L('화요일', 'Tue', '周二', '週二')],
  ['수요일', L('수요일', 'Wed', '周三', '週三')],
  ['목요일', L('목요일', 'Thu', '周四', '週四')],
  ['금요일', L('금요일', 'Fri', '周五', '週五')],
  ['토요일', L('토요일', 'Sat', '周六', '週六')],
  ['일요일', L('일요일', 'Sun', '周日', '週日')],
  ['연중무휴', L('연중무휴', 'Open all year', '全年无休', '全年無休')],
  ['24시간', L('24시간', '24 hours', '24小时', '24小時')],
  ['공휴일', L('공휴일', 'Holiday', '公休日', '公休日')],
  ['평일', L('평일', 'Weekdays', '平日', '平日')],
  ['주말', L('주말', 'Weekends', '周末', '週末')],
  ['매일', L('매일', 'Daily', '每天', '每天')],
  ['휴무', L('휴무', 'Closed', '休息', '休息')],
  ['종일', L('종일', 'all day', '全天', '全天')],
  ['및', L('및', 'and', '和', '和')],
  ['Last order', L('Last order', 'Last order', '最后点单', '最後點餐')],
  ['Break time', L('Break time', 'Break', '休息时间', '休息時間')]
].sort((a, b) => b[0].length - a[0].length);

const ERROR_KEYS = {
  '오늘 이후의 보관 날짜를 선택해 주세요.': 'error.date',
  '운영시간 안에서 시작 시간을 선택해 주세요.': 'error.start',
  '요금제를 선택해 주세요.': 'error.plan',
  '운영시간 안에서 찾는 시간을 선택해 주세요.': 'error.end',
  '짐은 1개부터 10개까지 선택할 수 있어요.': 'error.count',
  '짐 종류를 1자에서 120자 사이로 적어 주세요.': 'error.note',
  '시간을 확인해 주세요.': 'error.time',
  '찾는 시간을 시작 시간보다 늦게 선택해 주세요.': 'error.order',
  '짐 수량을 확인해 주세요.': 'error.count'
};

const COPY_HTML = ['hero-title', 'hero-description', 'how-side', 'care-caption'];
const COPY_TEXT = ['hero-cta', 'story-heading', 'story-lead', 'bubble-1-title', 'bubble-1-body', 'bubble-2-title', 'bubble-2-body', 'bubble-3-title', 'bubble-3-body', 'persona-1-role', 'persona-1-title', 'persona-1-li-1', 'persona-1-li-2', 'persona-1-li-3', 'persona-2-role', 'persona-2-title', 'persona-2-li-1', 'persona-2-li-3', 'needs-how', 'how-near', 'partner-line', 'closing-tail', 'footer-slogan', 'footer-line'];

let current = 'ko';

export function getLocale() {
  return current;
}

export function normalizeLocale(value) {
  return LOCALES.some(item => item.id === value) ? value : 'ko';
}

export function setLocale(value) {
  current = normalizeLocale(value);
  return current;
}

export function localeLang(value = current) {
  return LOCALES.find(item => item.id === normalizeLocale(value)).lang;
}

export function loadLocale(storage) {
  const saved = storage && typeof storage.get === 'function' ? storage.get(LOCALE_STORAGE_KEY, 'ko') : 'ko';
  return setLocale(saved);
}

export function saveLocale(storage, value) {
  const next = setLocale(value);
  if (storage && typeof storage.set === 'function') storage.set(LOCALE_STORAGE_KEY, next);
  return next;
}

function pick(entry) {
  if (!entry) return '';
  const value = entry[current];
  if (typeof value === 'string' && value.trim()) return value;
  return typeof entry.ko === 'string' ? entry.ko : '';
}

function fill(text, vars) {
  if (!vars) return text;
  return String(text).replace(/\{(\w+)\}/g, (all, name) => (vars[name] == null ? '' : String(vars[name])));
}

export function t(key, vars) {
  const entry = MESSAGES[key];
  if (!entry) return '';
  if (entry.modes) return fill(pick(entry.modes.tourism), vars);
  return fill(pick(entry), vars);
}

function tMode(mode, key, vars) {
  const entry = MESSAGES[key];
  if (!entry) return '';
  if (!entry.modes) return t(key, vars);
  const pack = entry.modes[mode === 'daily' ? 'daily' : 'tourism'] || entry.modes.tourism;
  return fill(pick(pack), vars);
}

export function copyPack(mode) {
  const key = mode === 'daily' ? 'daily' : 'tourism';
  const html = {};
  const text = {};
  COPY_HTML.forEach(name => { html[name] = tMode(key, 'copy.' + name); });
  COPY_TEXT.forEach(name => { text[name] = tMode(key, 'copy.' + name); });
  return { title: tMode(key, 'copy.title'), meta: tMode(key, 'copy.meta'), html, text };
}

export function hasMessage(key) {
  return Object.prototype.hasOwnProperty.call(MESSAGES, key);
}

export function labelPlace(name) {
  if (!name) return '';
  if (name === '전체') return t('filter.all');
  const place = PLACES[name];
  if (!place || current === 'ko') return name;
  return place[current] || name;
}

export function placeSearchText(store) {
  const names = [store && store.city, store && store.district, store && store.area, store && store.type, store && store.category, store && store.nearby];
  const bits = [];
  names.forEach(name => {
    const place = PLACES[name];
    if (!place) return;
    bits.push(place.en, place['zh-Hans'], place['zh-Hant'], ...(place.aliases || []));
  });
  return bits.filter(Boolean).join(' ');
}

export function formatHiddenName(store) {
  if (!store) return '';
  if (current === 'ko') return store.alias || '';
  const letter = String(store.alias || '').match(/ ([A-Z]+)$/);
  return labelPlace(store.area) + ' ' + labelPlace(store.type) + (letter ? ' ' + letter[1] : '');
}

export function displayName(store) {
  if (!store) return '';
  if (store.showMaps) return store.realName || store.name || '';
  return formatHiddenName(store);
}

const NUMBER_TAG = { ko: 'ko-KR', en: 'en-US', 'zh-Hans': 'zh-Hans-CN', 'zh-Hant': 'zh-Hant-TW' };

export function formatNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '';
  return new Intl.NumberFormat(NUMBER_TAG[current] || 'ko-KR').format(number);
}

export function formatMoney(amount) {
  const number = formatNumber(amount);
  if (!number) return '';
  if (current === 'en') return '₩' + number;
  if (current === 'zh-Hans') return number + '韩元';
  if (current === 'zh-Hant') return number + '韓元';
  return number + '원';
}

export function formatDate(iso) {
  const parsed = new Date(String(iso || '') + 'T00:00:00');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || '') || Number.isNaN(parsed.getTime())) return t('date.invalid');
  return new Intl.DateTimeFormat(NUMBER_TAG[current] || 'ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }).format(parsed);
}

export function formatHours(text) {
  let value = String(text || '');
  if (current === 'ko') return value;
  HOUR_TOKENS.forEach(([token, entry]) => {
    value = value.split(token).join(entry[current] || token);
  });
  return value;
}

export function formatAccess(label) {
  const text = String(label || '');
  const match = text.match(/^(.+?)에서 도보 (\d+)분$/);
  if (!match) return labelPlace(text);
  return t('access.walk', { place: match[1], min: formatNumber(match[2]) });
}

export function unitPhrase(count, kind) {
  const number = Number(count);
  const text = formatNumber(number);
  if (kind === 'hour') {
    if (current === 'en') return number === 1 ? '1 hour' : text + ' hours';
    if (current === 'zh-Hans') return text + '小时';
    if (current === 'zh-Hant') return text + '小時';
    return text + '시간';
  }
  if (kind === 'day') {
    if (current === 'en') return number === 1 ? '1 day' : text + ' days';
    if (current === 'zh-Hans' || current === 'zh-Hant') return text + '天';
    return text + '일';
  }
  if (current === 'en') return number === 1 ? '1 item' : text + ' items';
  if (current === 'zh-Hans' || current === 'zh-Hant') return text + '件';
  return text + '개';
}

export function bagCountLabel(count) {
  const number = Number(count);
  const text = formatNumber(number);
  if (current === 'en') return number === 1 ? '1 bag' : text + ' bags';
  if (current === 'zh-Hans' || current === 'zh-Hant') return text + '件行李';
  return '짐 ' + text + '개';
}

export function translateError(message) {
  const key = ERROR_KEYS[message];
  if (key) return t(key);
  if (current === 'ko' && typeof message === 'string') return message;
  return t('error.generic');
}

export function auditLocaleCoverage() {
  const gaps = [];
  LOCALES.forEach(locale => {
    Object.entries(MESSAGES).forEach(([key, entry]) => {
      const packs = entry.modes ? Object.values(entry.modes) : [entry];
      packs.forEach(pack => {
        if (typeof pack[locale.id] !== 'string' || !pack[locale.id].trim()) gaps.push(key + ':' + locale.id);
      });
    });
    if (locale.id === 'ko') return;
    Object.entries(PLACES).forEach(([name, place]) => {
      if (typeof place[locale.id] !== 'string' || !place[locale.id].trim()) gaps.push('place:' + name + ':' + locale.id);
    });
  });
  return gaps;
}

export function hangulLeaks() {
  const leaks = [];
  const hangul = /[가-힣]/;
  const saved = current;
  ['en', 'zh-Hans', 'zh-Hant'].forEach(id => {
    current = id;
    Object.entries(MESSAGES).forEach(([key, entry]) => {
      const packs = entry.modes ? Object.entries(entry.modes) : [['plain', entry]];
      packs.forEach(([mode, pack]) => {
        if (hangul.test(pack[id] || '')) leaks.push(id + ' ' + key + ' ' + mode);
      });
    });
    Object.entries(PLACES).forEach(([name, place]) => {
      if (hangul.test(place[id] || '')) leaks.push(id + ' place ' + name);
    });
  });
  current = saved;
  return leaks;
}
