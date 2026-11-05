import { localizeProper } from './names.js?v=0bc48b5de0ea';

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
  'a11y.home': L('tooK 홈', 'tooK home', 'tooK 首页', 'tooK 首頁'),
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
  'hero.alt': L('노을과 63빌딩, 한강 다리, 잔디에 앉은 사람들', 'Sunset, 63 Building, a Han River bridge, and people sitting on the grass', '晚霞、63大厦、汉江大桥，草地上坐着的人们', '晚霞、63大廈、漢江大橋，草地上坐著的人們'),
  'hero.note': L('앱 설치 없이 조건을 확인해요.', 'Check the conditions without an app.', '不用安装应用，先确认条件。', '不用安裝應用程式，先確認條件。'),
  'hero.ticketSoft': C(
    L('손은 가볍게, 여행은 자유롭게', 'Hands free. More to explore.', '双手轻松，旅程自在', '雙手輕鬆，旅程自在'),
    L('짐은 툭, 발걸음은 가볍게', 'Drop your bags. Step lighter.', '行李轻放，脚步更轻', '行李輕放，腳步更輕')
  ),
  'hero.ticketStrong': C(
    L('맡기고. 여행하고. 다시 찾고.', 'Drop it. Explore. Pick it up.', '寄存。旅行。再取回。', '寄存。旅行。再取回。'),
    L('맡기고. 움직이고. 다시 찾고.', 'Drop it. Move on. Pick it up.', '寄存。出发。再取回。', '寄存。出發。再取回。')
  ),
  'search.where': L('어디에 짐을 맡기시나요?', 'Where are you leaving your bags?', '行李寄存在哪里？', '行李寄存在哪裡？'),
  'search.placeholder': L('지역, 동네 이름', 'City or neighborhood', '城市或商圈', '城市或商圈'),
  'search.here': L('현재 위치', 'Current location', '当前位置', '目前位置'),
  'search.date': L('보관 시작', 'Storage start', '寄存开始', '寄存開始'),
  'search.time': L('시작 시간', 'Start time', '开始时间', '開始時間'),
  'search.end': L('보관 종료', 'Storage end', '寄存结束', '寄存結束'),
  'search.pick': L('날짜 선택', 'Choose a date', '选择日期', '選擇日期'),
  'search.pickTime': L('시간', 'Time', '时间', '時間'),
  'search.prevMonth': L('이전 달', 'Previous month', '上个月', '上個月'),
  'search.nextMonth': L('다음 달', 'Next month', '下个月', '下個月'),
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
  'story.kicker': C(
    L('tooK과 이어가는 여행', 'Keep the trip going with tooK', '和 tooK 一起继续旅行', '和 tooK 一起繼續旅行'),
    L('tooK과 이어가는 가벼운 발걸음', 'A lighter step with tooK', '和 tooK 一起把脚步变轻', '和 tooK 一起把腳步變輕')
  ),
  'journey.kicker': L('맡기기 전후', 'Before and after', '寄存前后', '寄存前後'),
  'journey.title': L('같은 일정, 달라지는 짐 보관 동선', 'The same plan, a different way to store the bags', '同样的行程，不同的行李寄存路线', '同樣的行程，不同的行李寄存路線'),
  'journey.before': L('tooK 이 없을 때', 'Without tooK', '没有 tooK 时', '沒有 tooK 時'),
  'journey.after': L('tooK과 함께하면', 'Together with tooK', '和 tooK 一起', '和 tooK 一起'),
  'journey.example': L('하나의 예시예요', 'One example', '这是一个例子', '這是一個例子'),
  'journey.storeNote': L('보관 가능한 짐과 맡기고 찾는 시간은 매장별로 확인해 주세요.', 'Check with each shop which bags they take, and when you can drop them off and pick them up.', '可寄存的行李，以及寄存和取回时间，请按店铺确认。', '可寄存的行李，以及寄存和取回時間，請按店舖確認。'),
  'journey.tab.checkout': L('체크아웃 후', 'After checkout', '退房之后', '退房之後'),
  'journey.tab.checkin': L('체크인 전', 'Before check-in', '入住之前', '入住之前'),
  'journey.tab.move': L('숙소를 바꾸는 날', 'Changing stays', '换住宿的一天', '換住宿的一天'),
  'journey.tab.show': L('타지에서 공연 보는 날', 'A show in another city', '去外地看演出', '去外地看演出'),
  'journey.tab.meeting': L('출장 후 약속이 남은 날', 'Dinner after a work trip', '出差后的晚餐', '出差後的晚餐'),
  'journey.checkout.title': L('여행은 남았는데, 짐 찾으러 숙소까지 다시 가야 하나요?', 'The trip is not over. Do you still go back to the stay just to pick up the bags?', '行程还没结束，还要回住宿取行李吗？', '行程還沒結束，還要回住宿取行李嗎？'),
  'journey.checkout.condition': L('체크아웃 후 마지막 일정을 즐기고 공항으로 가는 날. 숙소에 짐을 맡길 수 있어도, 마지막 일정이 숙소에서 멀다면.', 'A day for the last plan after checkout, then the airport. The stay can hold the bags, but the last stop is far from it.', '退房后还想玩完最后的安排再去机场。住宿可以放行李，但最后的行程离住宿很远。', '退房後還想玩完最後的安排再去機場。住宿可以放行李，但最後的行程離住宿很遠。'),
  'journey.checkout.before.1': L('체크아웃하고 숙소에 짐 맡기기', 'Check out and leave the bags at the stay', '退房并把行李留在住宿', '退房並把行李留在住宿'),
  'journey.checkout.before.2': L('마지막 쇼핑과 체험 즐기기', 'Enjoy the last shopping and activities', '享受最后的购物和体验', '享受最後的購物和體驗'),
  'journey.checkout.before.3': L('숙소로 되돌아가 짐 찾기', 'Go back to the stay for the bags', '返回住宿取行李', '返回住宿取行李'),
  'journey.checkout.before.4': L('짐을 가지고 공항으로 이동', 'Head to the airport with the bags', '带着行李去机场', '帶著行李去機場'),
  'journey.checkout.after.1': L('체크아웃 후 짐을 가지고 이동', 'Leave with the bags after checkout', '退房后带着行李出发', '退房後帶著行李出發'),
  'journey.checkout.after.2': L('마지막 일정 근처 매장에 맡기기', 'Store them at a shop near the last plan', '寄存在最后行程附近的店铺', '寄存在最後行程附近的店舖'),
  'journey.checkout.after.3': L('빈손으로 쇼핑과 체험 즐기기', 'Shop and explore empty-handed', '空手享受购物和体验', '空手享受購物和體驗'),
  'journey.checkout.after.4': L('맡긴 매장에서 짐 찾고 공항으로', 'Pick up at that shop and go to the airport', '在寄存的店铺取行李，再去机场', '在寄存的店舖取行李，再去機場'),
  'journey.checkout.point': L('마지막 일정이 끝난 곳 근처에서 짐을 찾아, 숙소로 되돌아가는 이동을 줄여요.', 'Pick the bags up near where the last plan ends, and skip the trip back to the stay.', '在最后行程结束的附近取行李，少跑一趟住宿。', '在最後行程結束的附近取行李，少跑一趟住宿。'),
  'journey.checkin.title': L('도착은 오전인데, 체크인은 오후라면?', 'You arrive in the morning, but check-in is in the afternoon?', '上午就到了，入住却要等到下午？', '上午就到了，入住卻要等到下午？'),
  'journey.checkin.condition': L('숙소에 짐을 미리 맡기기 어렵고, 체크인 전에 먼저 가고 싶은 곳이 있는 날.', 'A day when the stay cannot take the bags early, and there is somewhere you want to go before check-in.', '住宿不方便提前放行李，入住前又有想先去的地方。', '住宿不方便提前放行李，入住前又有想先去的地方。'),
  'journey.checkin.before.1': L('오전에 도착하기', 'Arrive in the morning', '上午到达', '上午到達'),
  'journey.checkin.before.2': L('숙소 사전 보관은 어려움', 'Early storage at the stay is difficult', '住宿难以提前寄存', '住宿難以提前寄存'),
  'journey.checkin.before.3': L('캐리어를 끌고 첫 일정으로', 'Pull the suitcase to the first stop', '拖着行李箱去第一站', '拖著行李箱去第一站'),
  'journey.checkin.before.4': L('짐을 챙기며 관광하기', 'Sightsee while watching the bags', '看着行李观光', '看著行李觀光'),
  'journey.checkin.after.1': L('오전에 도착하기', 'Arrive in the morning', '上午到达', '上午到達'),
  'journey.checkin.after.2': L('첫 일정 근처 매장으로 짐 가져가기', 'Take the bags to a shop near the first stop', '把行李带到第一站附近的店铺', '把行李帶到第一站附近的店舖'),
  'journey.checkin.after.3': L('체크인 전까지 짐 맡기기', 'Leave them until check-in', '寄存到入住之前', '寄存到入住之前'),
  'journey.checkin.after.4': L('빈손으로 첫 일정 즐기기', 'Enjoy the first stop empty-handed', '空手享受第一站', '空手享受第一站'),
  'journey.checkin.point': L('관광을 마치면 맡긴 매장에서 짐을 찾고 숙소로 가요. 체크인 전의 시간도 가볍게 써요.', 'When the sightseeing is done, pick the bags up at the shop and go to the stay. The hours before check-in stay light.', '观光结束后，在寄存的店铺取行李再去住宿。入住前的时间也可以轻装度过。', '觀光結束後，在寄存的店舖取行李再去住宿。入住前的時間也可以輕裝度過。'),
  'journey.move.title': L('숙소를 옮기는 날, 중간 일정은 캐리어와 함께인가요?', 'Changing stays. Is the time in between still with your suitcase?', '换住宿的这天，中间的行程还要带着行李箱吗？', '換住宿的這天，中間的行程還要帶著行李箱嗎？'),
  'journey.move.condition': L('이전 숙소로 돌아가기는 어렵고, 새 숙소에 들르기 전에 관광 일정이 있는 날.', 'Going back to the previous stay is hard, and there is sightseeing before the new one.', '不方便再回上一处住宿，去新住处之前还有观光安排。', '不方便再回上一處住宿，去新住處之前還有觀光安排。'),
  'journey.move.before.1': L('이전 숙소에서 체크아웃', 'Check out of the first stay', '在上一处住宿退房', '在上一處住宿退房'),
  'journey.move.before.2': L('큰 짐을 들고 관광지로 이동', 'Carry the large bags to the sights', '带着大件行李去景点', '帶著大件行李去景點'),
  'journey.move.before.3': L('일정 내내 캐리어 챙기기', 'Keep the suitcase with you the whole time', '全程看着行李箱', '全程看著行李箱'),
  'journey.move.before.4': L('짐과 함께 새 숙소로 이동', 'Go to the new stay with the bags', '带着行李去新住宿', '帶著行李去新住宿'),
  'journey.move.after.1': L('이전 숙소에서 체크아웃', 'Check out of the first stay', '在上一处住宿退房', '在上一處住宿退房'),
  'journey.move.after.2': L('관광과 새 숙소 사이 동선에 맡기기', 'Store them on the way between the sights and the new stay', '寄存在景点和新住宿之间的路线上', '寄存在景點和新住宿之間的路線上'),
  'journey.move.after.3': L('빈손으로 중간 일정 즐기기', 'Enjoy the time in between empty-handed', '空手享受中间的安排', '空手享受中間的安排'),
  'journey.move.after.4': L('짐을 찾아 새 숙소로 이동', 'Pick them up and go to the new stay', '取回行李再去新住宿', '取回行李再去新住宿'),
  'journey.move.point': L('숙소 사이에 남은 일정, 큰 짐을 계속 끌고 다니지 않아도 돼요.', 'For the plans between two stays, the large bags do not have to come along the whole way.', '两处住宿之间剩下的行程，不必一直拖着大件行李。', '兩處住宿之間剩下的行程，不必一直拖著大件行李。'),
  'journey.show.title': L('공연 보러 다른 도시까지 왔는데, 캐리어는 어디에 두죠?', 'You came to another city for a show. Where does the suitcase go?', '为了看演出到了另一座城市，行李箱放哪里？', '為了看演出到了另一座城市，行李箱放哪裡？'),
  'journey.show.condition': L('숙박 짐을 들고 도착했는데 숙소에 먼저 들르기 어렵고, 역이나 공연장 보관도 이용하기 어려운 날.', 'You arrive with overnight bags, the stay is hard to visit first, and station or venue storage is hard to use.', '带着住宿行李到达，不方便先去住宿，车站或场馆寄存也不好用。', '帶著住宿行李到達，不方便先去住宿，車站或場館寄存也不好用。'),
  'journey.show.before.1': L('숙박 짐을 들고 타지에 도착', 'Arrive in another city with overnight bags', '带着住宿行李到达外地', '帶著住宿行李到達外地'),
  'journey.show.before.2': L('역 보관함을 찾지만 만석', 'The station lockers you find are full', '找到的车站寄存柜已经满了', '找到的車站寄存櫃已經滿了'),
  'journey.show.before.3': L('공연장 보관소도 다시 알아보기', 'Check the venue storage as well', '再打听场馆寄存处', '再打聽場館寄存處'),
  'journey.show.before.4': L('짐 맡길 곳 찾느라 공연 전 시간 사용', 'Spend the time before the show looking for a place', '演出前的时间花在找寄存处', '演出前的時間花在找寄存處'),
  'journey.show.after.1': L('숙박 짐을 들고 타지에 도착', 'Arrive in another city with overnight bags', '带着住宿行李到达外地', '帶著住宿行李到達外地'),
  'journey.show.after.2': L('공연장과 이후 동선에 맞는 매장 선택', 'Choose a shop that fits the venue and what comes after', '选择符合场馆和之后路线的店铺', '選擇符合場館和之後路線的店舖'),
  'journey.show.after.3': L('공연 후 수령 시간을 확인하고 맡기기', 'Check that you can pick up after the show, then leave the bags', '确认演出后可以取回，再寄存', '確認演出後可以取回，再寄存'),
  'journey.show.after.4': L('짐 없이 공연장으로 이동', 'Head to the venue without the bags', '不带行李去场馆', '不帶行李去場館'),
  'journey.show.point': L('공연이 끝나면 맡긴 매장에서 짐을 찾아 숙소로 가요. 공연 후에도 찾을 수 있는 매장을 골라요.', 'After the show, pick the bags up at the shop and go to the stay. Choose a shop you can still reach once the show ends.', '演出结束后，在寄存的店铺取行李再去住宿。选择演出后也能取回的店铺。', '演出結束後，在寄存的店舖取行李再去住宿。選擇演出後也能取回的店舖。'),
  'journey.meeting.title': L('출장은 끝났는데, 저녁 약속까지 캐리어와 함께라면?', 'The meeting is over. Dinner plans next. Still dragging your suitcase?', '会议结束了，接下来是晚餐。还要拖着行李箱吗？', '會議結束了，接下來是晚餐。還要拖著行李箱嗎？'),
  'journey.meeting.condition': L('타지에서 회의를 마친 뒤 저녁 약속이 있고, 그 후 기차로 돌아가는 날.', 'You have dinner plans after a meeting in another city, then a train to catch home.', '在外地开完会后有晚餐，之后要赶火车回去。', '在外地開完會後有晚餐，之後要趕火車回去。'),
  'journey.meeting.before.1': L('출장 회의 마치기', 'Finish the meeting', '结束出差会议', '結束出差會議'),
  'journey.meeting.before.2': L('캐리어를 끌고 약속 장소로', 'Drag your suitcase to dinner', '拖着行李箱去吃晚餐', '拖著行李箱去吃晚餐'),
  'journey.meeting.before.3': L('식사 중에도 큰 짐 챙기기', 'Keep your bags beside you through the meal', '吃饭时也看着大件行李', '吃飯時也看著大件行李'),
  'journey.meeting.before.4': L('약속 후 짐을 들고 역으로', 'Take your bags to the station', '晚餐后再带着行李去车站', '晚餐後再帶著行李去車站'),
  'journey.meeting.after.1': L('출장 회의 마치기', 'Finish the meeting', '结束出差会议', '結束出差會議'),
  'journey.meeting.after.2': L('약속 장소와 역 사이 동선에 맡기기', 'Store your bags along the route to dinner and the station', '把行李寄存在去晚餐和车站的路线上', '把行李寄存在去晚餐和車站的路線上'),
  'journey.meeting.after.3': L('빈손으로 저녁 약속 즐기기', 'Enjoy dinner without your bags', '不带行李享受晚餐', '不帶行李享受晚餐'),
  'journey.meeting.after.4': L('출발 전 짐을 찾아 역으로', 'Pick up your bags before heading to the station', '去车站前取回行李', '去車站前取回行李'),
  'journey.meeting.point': L('출장 뒤에 남은 약속도 가볍게. 기차 타기 전 찾을 수 있는 매장을 골라요.', 'Enjoy your plans after work. Choose a store that lets you pick up before your train.', '出差后的晚餐也轻装前往。选择坐火车前可以取回的店铺。', '出差後的晚餐也輕裝前往。選擇坐火車前可以取回的店舖。'),
  'journey.phase1': L('일정 시작', 'Start of the plan', '行程开始', '行程開始'),
  'journey.phase2': L('보관 방법 확인', 'Where to store', '确认寄存方式', '確認寄存方式'),
  'journey.phase3': L('조건 확인 및 선택', 'Check and choose', '确认条件并选择', '確認條件並選擇'),
  'journey.phase4': L('일정 진행', 'Continue the plan', '继续行程', '繼續行程'),
  'journey.phase5': L('수령 및 다음 이동', 'Pick up and move on', '取回并继续移动', '取回並繼續移動'),
  'story.question': L('이런 적 있으시죠?', 'Sound familiar?', '有过这种时候吗？', '有過這種時候嗎？'),
  'persona.cold': L('식품은 시원하게, 늦은 시간은 24시간 곳에서', 'Keep food cool, and use a 24-hour spot late at night', '食品放凉处，深夜选 24 小时地点', '食品放涼處，深夜選 24 小時地點'),
  'needs.title': L('무엇을 맡길 수 있나요', 'What can you store?', '可以寄存什么？', '可以寄存什麼？'),
  'needs.carryon': L('기내용 캐리어와 백팩', 'Cabin suitcases and backpacks', '登机箱和背包', '登機箱和背包'),
  'needs.small': L('쇼핑백, 손에 든 작은 짐', 'Shopping bags and small items in hand', '购物袋和手上的小件', '購物袋和手上的小件'),
  'needs.food': L('시원하게 두고 싶은 식품', 'Food you want kept cool', '想冷藏的食品', '想冷藏的食品'),
  'needs.howTitle': L('어떻게 쓰나요', 'How do you use it?', '怎么使用？', '怎麼使用？'),
  'needs.price': L('시간당 1,000원, 오래 맡겨도 하루 5,000원을 넘지 않아요', '₩1,000 per hour, and never more than ₩5,000 per bag each day', '每小时 1,000韩元，每件每天不超过 5,000韩元', '每小時 1,000韓元，每件每天不超過 5,000韓元'),
  'needs.when': L('날짜와 시작 시간, 짐 종류를 적어요', 'Add the date, start time, and bag type.', '填写日期、开始时间和行李种类。', '填寫日期、開始時間和行李種類。'),
  'needs.pay': L('예약 후 편하게 여행해요.', 'After you reserve, travel with ease.', '预约后轻松旅行。', '預約後輕鬆旅行。'),
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
  'results.more': L('더보기', 'Show more', '查看更多', '查看更多'),
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
  'how.dropBody': L('맡기기 전에 그 매장의 조건을 확인하고,<br>짐을 맡겨요.', 'Check that shop’s conditions first,<br>then leave the bags.', '寄存前先确认那家店的条件，<br>再放下行李。', '寄存前先確認那家店的條件，<br>再放下行李。'),
  'how.ready': L('맡길 준비가 되었어요', 'Ready to drop off', '可以寄存了', '可以寄存了'),
  'how.keepCaption': L('KEEP YOUR DAY', 'KEEP YOUR DAY', 'KEEP YOUR DAY', 'KEEP YOUR DAY'),
  'how.keepTitle': C(
    L('이제, 여행을 이어가요', 'Now keep exploring', '然后继续旅行', '然後繼續旅行'),
    L('이제, 일정을 이어가요', 'Now continue your plans', '然后继续你的安排', '然後繼續你的安排')
  ),
  'how.keepBody': C(
    L('가벼운 손으로 여행 동선을 이어가고,<br>약속한 시간에 짐을 찾아요.', 'Continue the route with free hands,<br>then pick the bags up at the agreed time.', '空着手继续旅行路线，<br>再在约定时间取回行李。', '空著手繼續旅行路線，<br>再在約定時間取回行李。'),
    L('가벼운 손으로 쇼핑, 약속, 일정으로 가고,<br>끝난 뒤 짐을 찾아요.', 'Go on to shopping, a plan, or the next stop with free hands,<br>then pick the bags up when you are done.', '空着手去购物、赴约或下一站，<br>结束后取回行李。', '空著手去購物、赴約或下一站，<br>結束後取回行李。')
  ),
  'how.free': C(
    L('여행은 쭉', 'Keep exploring', '旅程继续', '旅程繼續'),
    L('발걸음은 가볍게', 'Step lighter', '脚步更轻', '腳步更輕')
  ),
  'how.nearSmall': L('내 주변 보관 공간', 'Storage near me', '我附近的寄存点', '我附近的寄存點'),
  'price.perHour': L('시간당', 'Per hour', '每小时', '每小時'),
  'price.min': L('최소 보관', 'Minimum', '最短寄存', '最短寄存'),
  'price.perDay': L('개당 하루 최대', 'Daily cap per bag', '每件每天上限', '每件每天上限'),
  'price.bags': L('쇼핑백은 1개 요금', 'Shopping bags share one fee', '购物袋按一件计', '購物袋按一件計'),
  'price.hourValue': L('1,000원', '₩1,000', '1,000韩元', '1,000韓元'),
  'price.dayValue': L('5,000원', '₩5,000', '5,000韩元', '5,000韓元'),
  'price.minValue': L('2시간', '2 hours', '2小时', '2小時'),
  'price.bagValue': L('3개까지', 'Up to 3', '最多3件', '最多3件'),
  'guide.kicker': L('여행을 가볍게', 'Travel lighter', '让旅行更轻', '讓旅行更輕'),
  'guide.title': L('tooK 이용 안내', 'Using tooK', 'tooK 使用说明', 'tooK 使用說明'),
  'guide.dayName': L('하루권', 'Day pass', '一日券', '一日券'),
  'guide.dayValue': L('개당 하루 5,000원', '₩5,000 per item per day', '每件每天 5,000韩元', '每件每天 5,000韓元'),
  'guide.hourName': L('시간권', 'Hourly', '小时券', '小時券'),
  'guide.hourValue': L('시간당 1,000원. 2시간부터. 하루 최대 5,000원', '₩1,000 per hour. From 2 hours. Up to ₩5,000 a day.', '每小时 1,000韩元。从 2 小时起。每天最多 5,000韩元。', '每小時 1,000韓元。從 2 小時起。每天最多 5,000韓元。'),
  'guide.sameValue': L('짐 종류와 상관없이 같은 요금', 'The same rate for every bag type', '不论种类，费用相同', '不論種類，費用相同'),
  'guide.bagLine': L('쇼핑백 3개까지 1개로 계산', 'Up to 3 shopping bags count as 1', '购物袋最多 3 件按 1 件计算', '購物袋最多 3 件按 1 件計算'),
  'guide.plusLine': L('안심 플러스: 개당 +1,000원', 'Peace Plus: +₩1,000 per item', '安心加值: 每件 +1,000韩元', '安心加值: 每件 +1,000韓元'),
  'care.alt': C(
    L('여행 동선에서 볼 수 있는 서울 도심 풍경', 'A Seoul city view along a travel route', '旅行路线上能看到的首尔市景', '旅行路線上能看到的首爾市景'),
    L('일정 근처에서 볼 수 있는 서울 도심 풍경', 'A Seoul city view near everyday plans', '日常安排附近能看到的首尔市景', '日常安排附近能看到的首爾市景')
  ),
  'care.kicker': L('A LITTLE MORE PEACE OF MIND', 'A LITTLE MORE PEACE OF MIND', 'A LITTLE MORE PEACE OF MIND', 'A LITTLE MORE PEACE OF MIND'),
  'care.title': L('잠시 맡기는 짐에도,<br>꼼꼼한 안심을.', 'Even a short drop-off<br>gets careful care.', '短暂寄存，<br>也仔细放心。', '短暫寄存，<br>也仔細放心。'),
  'care.intro': L('소중한 짐을 맡길 때 필요한 것들.<br>보관 과정을 더 분명하게 확인해요.', 'What you need when leaving something important.<br>The storage steps stay easy to check.', '寄存重要物品时需要的安排。<br>保管过程可以清楚确认。', '寄存重要物品時需要的安排。<br>保管過程可以清楚確認。'),
  'care.compTitle': L('모든 짐, 기본 30만 원까지 보상', 'Every bag includes cover up to ₩300,000', '每件行李基本保障到 30万韩元', '每件行李基本保障到 30萬韓元'),
  'care.compBody': L('맡긴 짐에 문제가 생기면 tooK이 직접 확인하고 보상해요.', 'If something happens to a stored bag, tooK checks it and covers it.', '寄存行李出问题，由 tooK 直接确认并补偿。', '寄存行李出問題，由 tooK 直接確認並補償。'),
  'care.photoTitle': L('맡기고 찾을 때, 사진으로 확인', 'Photos when you drop off and pick up', '寄存和取回时拍照确认', '寄存和取回時拍照確認'),
  'care.photoBody': L('보관 전후의 짐 상태를 사진으로 남겨요.', 'The bag’s condition is photographed before and after storage.', '寄存前后都会留下行李状态照片。', '寄存前後都會留下行李狀態照片。'),
  'care.qrTitle': L('예약마다 다른 나만의 QR', 'A different QR code for every booking', '每次预约都有专属二维码', '每次預約都有專屬 QR code'),
  'care.qrBody': L('예약을 확인하고 간편하게 맡기고 찾아요.', 'Confirm the booking, then drop off and pick up with ease.', '确认预约后，轻松寄存和取回。', '確認預約後，輕鬆寄存和取回。'),
  'care.sealTitle': L('보관 중에는 보안씰과 함께', 'A security seal while it is stored', '寄存期间贴上安全封条', '寄存期間貼上安全封條'),
  'care.sealBody': L('보안씰을 통해 짐을 구분하고 보관해요.', 'The seal keeps each bag identified while it is stored.', '用安全封条区分并保管行李。', '用安全封條區分並保管行李。'),
  'care.cctvTitle': L('보관 공간의 CCTV 여부를 확인해요', 'Check whether the storage area has CCTV', '确认寄存空间是否有监控', '確認寄存空間是否有監控'),
  'care.cctvBody': L('매장마다 달라요. 보관 공간에 CCTV가 있는지는 그 매장에서 확인해요.', 'It depends on the shop. Ask that shop whether the storage area has CCTV.', '每家店不同。寄存空间有没有监控，请向那家店确认。', '每家店不同。寄存空間有沒有監控，請向那家店確認。'),
  'partner.kicker': C(
    L('BETTER SPACE, BETTER TRAVEL', 'BETTER SPACE, BETTER TRAVEL', 'BETTER SPACE, BETTER TRAVEL', 'BETTER SPACE, BETTER TRAVEL'),
    L('BETTER SPACE, LIGHTER STEPS', 'BETTER SPACE, LIGHTER STEPS', 'BETTER SPACE, LIGHTER STEPS', 'BETTER SPACE, LIGHTER STEPS')
  ),
  'partner.title': C(
    L('우리 매장의 작은 여유가,<br>누군가의 가벼운 여행이 되도록.', 'A little spare room in your shop<br>can lighten someone’s trip.', '店里多出的一点空间，<br>可以换成别人的轻旅行。', '店裡多出的一點空間，<br>可以換成別人的輕旅行。'),
    L('우리 매장의 작은 여유가,<br>누군가의 가벼운 발걸음이 되도록.', 'A little spare room in your shop<br>can lighten someone’s step.', '店里多出的一点空间，<br>可以换成别人更轻的脚步。', '店裡多出的一點空間，<br>可以換成別人更輕的腳步。')
  ),
  'partner.button': L('파트너로 함께하기', 'Join as a partner', '成为合作伙伴', '成為合作夥伴'),
  'faq.kicker': L('GOOD TO KNOW', 'GOOD TO KNOW', 'GOOD TO KNOW', 'GOOD TO KNOW'),
  'faq.title': L('궁금한 점이<br>남았나요?', 'Still have<br>a question?', '还有<br>想问的吗？', '還有<br>想問的嗎？'),
  'faq.lead': L('처음 맡기는 날에도<br>걱정 없이 시작할 수 있도록.', 'So the first drop-off<br>can start without worry.', '让第一次寄存<br>也能安心开始。', '讓第一次寄存<br>也能安心開始。'),
  'faq.q1': L('예약은 어떻게 하나요?', 'How do I book?', '如何预约？', '如何預約？'),
  'faq.a1': L('원하는 공간을 고른 뒤 날짜, 시작 시간, 짐 개수와 종류를 확인하고 예약하세요. 가벼운 여행이 시작점이 될 거에요.', 'Choose a spot, check the date, start time, bag count, and bag type, then reserve. A lighter trip starts there.', '选好地点后，确认日期、开始时间、行李数量和种类，然后预约。轻松的旅行从这里开始。', '選好地點後，確認日期、開始時間、行李數量和種類，然後預約。輕鬆的旅行從這裡開始。'),
  'faq.q2': L('요금은 어떻게 되나요?', 'How much does it cost?', '费用怎么算？', '費用怎麼算？'),
  'faq.a2': L('짐 종류와 상관없이 시간당 1,000원이에요. 2시간부터 맡길 수 있고, 오래 맡겨도 개당 하루 5,000원을 넘지 않아요. 쇼핑백은 3개까지 1개 요금으로 계산해요.', 'Every bag type is ₩1,000 per hour. Storage starts at 2 hours, and a bag never exceeds ₩5,000 per day. Shopping bags are billed as one item for every three.', '不论种类，每小时 1,000韩元。最短 2 小时，每件每天不超过 5,000韩元。购物袋每 3 件按 1 件计费。', '不論種類，每小時 1,000韓元。最短 2 小時，每件每天不超過 5,000韓元。購物袋每 3 件按 1 件計費。'),
  'faq.q3': L('짐이 분실되거나 망가지면요?', 'What if a bag is lost or damaged?', '行李丢失或损坏怎么办？', '行李遺失或損壞怎麼辦？'),
  'faq.a3': L('모든 짐은 기본 30만 원까지, 안심 플러스를 고르면 100만 원까지 보상해요. 현금, 귀중품, 여권, 노트북, 휴대폰은 보상 대상이 아니에요.', 'Every bag includes cover up to ₩300,000, or ₩1,000,000 with Peace Plus. Cash, valuables, passports, laptops, and phones are not covered.', '每件基本保障 30万韩元，选择安心加值可达 100万韩元。现金、贵重品、护照、笔记本和手机不在保障范围。', '每件基本保障 30萬韓元，選擇安心加值可達 100萬韓元。現金、貴重品、護照、筆電和手機不在保障範圍。'),
  'faq.q4': L('24시간이나 냉장 보관도 되나요?', 'Can I store overnight or keep food cold?', '可以 24 小时或冷藏吗？', '可以 24 小時或冷藏嗎？'),
  'faq.a4': L('목록 위의 24시간 운영, 냉장/냉동 보관으로 그런 공간을 골라 볼 수 있어요. 요금은 다른 공간과 같아요.', 'Use the 24-hour and fridge or freezer filters above the list. The rate is the same as other spots.', '可用列表上方的 24 小时营业、冷藏或冷冻来筛选。价格与其他地点相同。', '可用列表上方的 24 小時營業、冷藏或冷凍來篩選。價格與其他地點相同。'),
  'faq.q5': L('예약은 어디서 보나요?', 'Where do I see my booking?', '在哪里查看预约？', '在哪裡查看預約？'),
  'faq.a5': L('상단의 내 예약에서 이 브라우저에 남긴 장소, 시간, 금액을 볼 수 있어요.', 'Open My bookings at the top to see the place, time, and amount kept in this browser.', '在顶部的我的预约里，可以查看留在这个浏览器中的地点、时间和金额。', '在頂部的我的預約裡，可以查看留在這個瀏覽器中的地點、時間和金額。'),
  'faq.q6': L('예약은 어떻게 지우나요?', 'How do I remove a booking?', '如何删除预约？', '如何刪除預約？'),
  'faq.a6': L('내 예약에서 그 기록을 지울 수 있어요.', 'You can remove the record from My bookings.', '可以在我的预约里删除该记录。', '可以在我的預約裡刪除該記錄。'),
  'faq.q7': L('우리 매장도 파트너로 참여할 수 있나요?', 'Can our shop join as a partner?', '我们的店可以加入合作吗？', '我們的店可以加入合作嗎？'),
  'faq.a7': L('네. 아래 ‘파트너로 함께하기’에서 매장 정보를 남겨 주시면, 확인 후 안내드릴게요.', 'Yes. Leave your shop details under Join as a partner, and we will reply after checking them.', '可以。请在下方“成为合作伙伴”留下店铺信息，确认后会与您联系。', '可以。請在下方「成為合作夥伴」留下店家資訊，確認後會與您聯絡。'),
  'closing.head': L('짐은 툭', 'Drop your bags.', '行李轻放', '行李輕放'),
  'footer.dev': L('개발자', 'Developer', '开发者', '開發者'),
  'footer.biz': L('사업자 정보', 'Business details', '商家信息', '商家資訊'),
  'footer.tradeName': L('상호', 'Trade name', '商号', '商號'),
  'footer.representative': L('대표', 'Representative', '代表人', '代表人'),
  'footer.bizNo': L('사업자등록번호', 'Business registration number', '营业者登记号', '營業人登記號'),
  'footer.partnerInquiry': L('입점 및 제휴 문의', 'Store and partnership inquiries', '入驻及合作咨询', '入駐及合作諮詢'),
  'footer.contact': L('담당자', 'Contact', '负责人', '負責人'),
  'footer.phone': L('전화', 'Phone', '电话', '電話'),
  'footer.email': L('이메일', 'Email', '邮箱', '郵箱'),
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
  'dev.passwordLabel': L('비밀번호', 'Password', '密码', '密碼'),
  'dev.passwordPlaceholder': L('비밀번호', 'Password', '密码', '密碼'),
  'dev.passwordSubmit': L('확인', 'Continue', '确认', '確認'),
  'dev.passwordError': L('비밀번호가 맞지 않아요.', 'That password does not match.', '密码不正确。', '密碼不正確。'),
  'bookings.kicker': L('YOUR LIGHT TICKETS', 'YOUR LIGHT TICKETS', 'YOUR LIGHT TICKETS', 'YOUR LIGHT TICKETS'),
  'bookings.title': L('내 예약', 'My bookings', '我的预约', '我的預約'),
  'bookings.close': L('내 예약 닫기', 'Close my bookings', '关闭我的预约', '關閉我的預約'),
  'bookings.subtitle': L('이 브라우저에 남긴 예약이에요.', 'Bookings kept in this browser.', '留在这个浏览器里的预约。', '留在這個瀏覽器裡的預約。'),
  'bookings.emptyTitle': L('아직 예약이 없어요.', 'No bookings yet.', '还没有预约。', '還沒有預約。'),
  'bookings.emptyBody': L('공간을 고른 뒤 결제를 진행할 수 있어요.', 'Choose a spot, then continue to payment.', '选好地点后可以继续付款。', '選好地點後可以繼續付款。'),
  'bookings.find': L('공간 둘러보기', 'Browse spots', '浏览地点', '瀏覽地點'),
  'bookings.cancel': L('기록 지우기', 'Remove record', '删除记录', '刪除記錄'),
  'bookings.confirmDelete': L('지우기 확인', 'Confirm remove', '确认删除', '確認刪除'),
  'bookings.saved': L('기록', 'Record', '记录', '記錄'),
  'bookings.trial': L('예약', 'Booking', '预约', '預約'),
  'partnerDialog.kicker': L('BECOME A LOCAL PARTNER', 'BECOME A LOCAL PARTNER', 'BECOME A LOCAL PARTNER', 'BECOME A LOCAL PARTNER'),
  'partnerDialog.title': L('공간에 새로운 가능성을.', 'A new use for your space.', '给空间一个新可能。', '給空間一個新可能。'),
  'partnerDialog.close': L('파트너 신청 닫기', 'Close partner form', '关闭合作申请', '關閉合作申請'),
  'partnerDialog.subtitle': C(
    L('남는 공간으로 여행하는 사람을 맞이하고 싶다면, 매장 정보를 남겨 주세요.', 'If spare space could welcome someone on a trip, leave your shop details.', '如果空余空间可以接待旅行中的人，请留下店铺信息。', '如果空餘空間可以接待旅行中的人，請留下店家資訊。'),
    L('남는 공간으로 쇼핑, 약속, 출장 중인 사람을 맞이하고 싶다면, 매장 정보를 남겨 주세요.', 'If spare space could welcome someone shopping, heading to a plan, or on a work trip, leave your shop details.', '如果空余空间可以接待购物、赴约或出差的人，请留下店铺信息。', '如果空餘空間可以接待購物、赴約或出差的人，請留下店家資訊。')
  ),
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
  'toast.cancelled': L('기록을 지웠어요.', 'Record removed.', '记录已删除。', '記錄已刪除。'),
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
  'booking.subtitle': L('날짜와 시작 시간, 짐 종류를 정하면 결제로 이어져요.', 'Choose the date, start time, and bag type, then continue to payment.', '选定日期、开始时间和行李种类后进入付款。', '選定日期、開始時間和行李種類後進入付款。'),
  'booking.date': L('보관 시작', 'Storage start', '寄存开始', '寄存開始'),
  'booking.start': L('시작 시간', 'Start time', '开始时间', '開始時間'),
  'booking.endDate': L('보관 종료', 'Storage end', '寄存结束', '寄存結束'),
  'booking.adjusted': L('이 공간 운영시간에 맞춰 시작 시간을 바꿔 두었어요.', 'The start time was adjusted to this spot’s hours.', '已按这个地点的营业时间调整开始时间。', '已按這個地點的營業時間調整開始時間。'),
  'booking.plan': L('요금제', 'Rate', '计费方式', '計費方式'),
  'booking.day': L('하루권', 'Day pass', '一日券', '一日券'),
  'booking.dayPrice': L('개당 하루 {money}', '{money} per bag a day', '每件每天 {money}', '每件每天 {money}'),
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
  'booking.total': L('결제 금액', 'Amount due', '付款金额', '付款金額'),
  'booking.submit': L('지금 결제하기', 'Pay now', '立即付款', '立即付款'),
  'pay.title': L('결제', 'Payment', '付款', '付款'),
  'pay.notice': L('결제 금액을 확인해 주세요.', 'Please check the amount.', '请确认付款金额。', '請確認付款金額。'),
  'pay.button': L('결제하기', 'Pay', '付款', '付款'),
  'pay.back': L('일정으로 돌아가기', 'Back to the schedule', '返回时间安排', '返回時間安排'),
  'pay.error': L('오류가 발생했습니다', 'Something went wrong.', '发生了错误。', '發生了錯誤。'),
  'pay.ended': L('결제를 마치지 못했어요.', 'The payment did not go through.', '付款没有完成。', '付款沒有完成。'),
  'pay.saved': L('이 내용은 이 브라우저의 예약으로만 남아요. 서버로 보내지 않아요.', 'This stays in this browser as a booking only. It is not sent to a server.', '这些内容只作为预约留在这个浏览器里，不会送到服务器。', '這些內容只作為預約留在這個瀏覽器裡，不會送到伺服器。'),
  'pay.failSave': L('이 브라우저에 예약을 남기지 못했어요.', 'Could not keep the booking in this browser.', '未能把预约留在这个浏览器里。', '未能把預約留在這個瀏覽器裡。'),
  'pay.history': L('내 예약 보기', 'View my bookings', '查看我的预约', '查看我的預約'),
  'pay.close': L('닫기', 'Close', '关闭', '關閉'),
  'pay.feedback': L('의견 남기기', 'Leave a note', '留下意见', '留下意見'),
  'formula.day': L('{money} × {days} × {units}', '{money} × {days} × {units}', '{money} × {days} × {units}', '{money} × {days} × {units}'),
  'formula.cap': L('하루 최대 {money} × {units}', 'Daily cap {money} × {units}', '每天最多 {money} × {units}', '每天最多 {money} × {units}'),
  'formula.mix': L('{dayMoney} × {days} + {hourMoney} × {hours} × {units}', '{dayMoney} × {days} + {hourMoney} × {hours} × {units}', '{dayMoney} × {days} + {hourMoney} × {hours} × {units}', '{dayMoney} × {days} + {hourMoney} × {hours} × {units}'),
  'formula.mixNoRest': L('{dayMoney} × {days} × {units}', '{dayMoney} × {days} × {units}', '{dayMoney} × {days} × {units}', '{dayMoney} × {days} × {units}'),
  'formula.hour': L('{money} × {hours} × {units}', '{money} × {hours} × {units}', '{money} × {hours} × {units}', '{money} × {hours} × {units}'),
  'formula.check': L('시간을 다시 확인해 주세요.', 'Please check the times again.', '请再确认时间。', '請再確認時間。'),
  'note.bags': L('쇼핑백 {bags}개는 {units}개 요금으로 계산했어요', '{bags} shopping bags are billed as {units}', '购物袋 {bags} 件按 {units} 件计费', '購物袋 {bags} 件按 {units} 件計費'),
  'note.minimum': L('시간권은 {hours}시간부터예요', 'Hourly storage starts at {hours} hours', '小时券从 {hours} 小时起', '小時券從 {hours} 小時起'),
  'note.cap': L('하루 최대 요금이 적용됐어요', 'The daily cap is applied', '已套用每天上限', '已套用每天上限'),
  'note.dayBasis': L('시작 시각부터 24시간마다 1일로 올림해요.', 'A day is 24 hours from the start time, rounded up.', '从开始时间起，每 24 小时算 1 天，不足的时间进位。', '從開始時間起，每 24 小時算 1 天，不足的時間進位。'),
  'summary.days': L('보관 일수', 'Days', '天数', '天數'),
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
  'mvp.reservation': L('내가 고른 내용', 'What I chose', '我选的内容', '我選的內容'),
  'mvp.title': L('사실, tooK은 아직<br>정식 출시 전이에요.', 'tooK is not<br>fully launched yet.', '其实 tooK<br>还没有正式上线。', '其實 tooK<br>還沒有正式上線。'),
  'mvp.lead': L('의견은 이 브라우저에만 남길 수 있어요.<br>실제 결제와 예약은 진행되지 않았고, 어떤 비용도 청구되지 않아요.', 'A note can stay in this browser only.<br>No real payment or reservation was made, and nothing is charged.', '意见只能留在这个浏览器里。<br>没有实际付款或预约，也不会收取任何费用。', '意見只能留在這個瀏覽器裡。<br>沒有實際付款或預約，也不會收取任何費用。'),
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
    L('tooK — 짐은 툭, 여행은 쭉', 'tooK — Drop your bags. Keep exploring.', 'tooK — 行李轻放，旅程继续', 'tooK — 行李輕放，旅程繼續'),
    L('tooK — 짐은 툭, 발걸음은 가볍게', 'tooK — Drop your bags. Step lighter.', 'tooK — 行李轻放，脚步更轻', 'tooK — 行李輕放，腳步更輕')
  ),
  'copy.meta': C(
    L('숙소나 보관함의 위치, 시간, 기간, 짐 크기가 내 여행과 다를 때, 동선에서 맡길 곳을 확인하고 여행을 이어가요. tooK.', 'When the place, hours, length, or bag size of your stay or a locker does not fit the trip, check a spot on your route and keep going. tooK.', '住宿或寄存柜的位置、时间、天数或行李大小和这次旅行不合适时，在自己的路线上确认可寄存的地方，然后继续走。tooK.', '住宿或寄存櫃的位置、時間、天數或行李大小和這次旅行不合適時，在自己的路線上確認可寄存的地方，然後繼續走。tooK.'),
    L('쇼핑하다 늘어난 쇼핑백도, 약속 전에 들기 힘든 가방도, 다른 지역 콘서트나 출장 짐도. 일정 가까운 곳에 잠시 맡기고 발걸음을 가볍게 이어가세요. tooK.', 'Shopping bags pile up, some bags are awkward before the next plan, and a concert or work trip in another city can leave you carrying more. Leave them near the plan and keep your step light. tooK.', '购物袋变多、约定前不便携带，或其他城市的演唱会和出差行李，都可以先寄存在行程附近，让脚步更轻。tooK.', '購物袋變多、約定前不便攜帶，或其他城市的演唱會和出差行李，都可以先寄存在行程附近，讓腳步更輕。tooK.')
  ),
  'copy.hero-title': C(
    L('짐은 툭,<br>여행은 <span class="underlined">쭉</span>', 'Drop your bags.<br>Keep <span class="underlined">exploring</span>.', '行李轻放，<br>旅程<span class="underlined">继续</span>', '行李輕放，<br>旅程<span class="underlined">繼續</span>'),
    L('짐은 툭,<br>발걸음은 <span class="underlined">가볍게</span>', 'Drop your bags.<br>Step <span class="underlined">lighter</span>.', '行李轻放，<br>脚步<span class="underlined">更轻</span>', '行李輕放，<br>腳步<span class="underlined">更輕</span>')
  ),
  'copy.hero-description': C(
    L('여행 동선에 짐을 맡길 곳이 없다고 하더라도,<br>짐 때문에 여행이 번거로워지지 않도록', 'Even if there is nowhere on your route to leave your bags,<br>keep the trip from becoming a hassle because of them.', '就算旅行路线上没有可以寄存行李的地方，<br>也不让行李把旅行变得麻烦。', '就算旅行路線上沒有可以寄存行李的地方，<br>也不讓行李把旅行變得麻煩。'),
    L('쇼핑하다 늘어난 쇼핑백도, 약속 전에 들기 힘든 가방도, 다른 지역 콘서트나 출장 짐도. 일정 가까운 곳에 잠시 맡기고 발걸음을 가볍게 이어가세요.', 'Shopping bags, a bag that is awkward before the next plan, or luggage from a concert or work trip in another city. Leave it near the plan and keep your step light.', '购物袋、约定前不便拿的包，或其他城市演唱会和出差的行李。先寄存在行程附近，让脚步更轻。', '購物袋、約定前不便拿的包，或其他城市演唱會和出差的行李。先寄存在行程附近，讓腳步更輕。')
  ),
  'copy.hero-cta': C(
    L('여행지 근처 보관 장소 찾기', 'Find luggage storage nearby', '查找旅途附近的寄存点', '尋找旅途附近的寄存點'),
    L('가까운 보관 장소 찾기', 'Find storage nearby', '查找附近的寄存点', '尋找附近的寄存點')
  ),
  'copy.story-heading': C(
    L('숙소와 보관함이 내 여행에 맞지 않을 때', 'When your stay or a locker does not fit the trip', '住宿和寄存柜不适合这次旅行时', '住宿和寄存櫃不適合這次旅行時'),
    L('짐이 오늘을 무겁게 만들 때', 'When bags make the day heavy', '行李让今天变重时', '行李讓今天變重時')
  ),
  'copy.story-lead': C(
    L('도보와 대중교통으로 여행할 때, 숙소로 돌아가지 않고 내 동선에서 맡길 곳의 이용 조건을 확인해요.', 'When you travel on foot or by public transit, check the conditions at a spot on your route instead of going back to your stay.', '步行或搭乘公共交通旅行时，不必返回住宿，在自己的路线上确认寄存条件。', '步行或搭乘大眾運輸旅行時，不必返回住宿，在自己的路線上確認寄存條件。'),
    L('쇼핑과 약속, 다른 지역 콘서트나 출장처럼 짐을 들고 움직이기 어려울 때 일정 가까운 곳에 맡겨요.', 'For shopping, a plan, or a concert or work trip in another city, leave bags near that plan when carrying them gets in the way.', '购物、赴约，或其他城市的演唱会和出差，行李不方便带着走时，就寄存在行程附近。', '購物、赴約，或其他城市的演唱會和出差，行李不方便帶著走時，就寄存在行程附近。')
  ),
  'copy.bubble-1-title': C(
    L('숙소나 보관함이 동선에서 멀거나, 없거나 가득 찼을 때', 'When your stay or a locker is off your route, missing, or full', '住宿或寄存柜离路线远、没有柜子，或已经满了', '住宿或寄存櫃離路線遠、沒有櫃子，或已經滿了'),
    L('쇼핑백이 늘어난 날', 'When the shopping bags multiply', '购物袋越来越多的一天', '購物袋越來越多的一天')
  ),
  'copy.bubble-1-body': C(
    L('돌아가는 대신, 걷거나 타고 가는 길에서 맡길 곳을 살펴봐요.', 'Look along the way you are already walking or riding.', '沿着正在步行或乘车的路，先看看哪里可以寄存。', '沿著正在步行或乘車的路，先看看哪裡可以寄存。'),
    L('손에 쌓인 가방을 가까운 곳에 잠시 맡겨요.', 'Leave the bags in your hands at a nearby spot for a while.', '把手上的袋子先寄存在附近。', '把手上的袋子先寄存在附近。')
  ),
  'copy.bubble-2-title': C(
    L('맡기고 찾는 시간이 안 맞거나,<br>체크인 전과 체크아웃 후에 짐이 남을 때', 'When drop-off or pickup misses the hours,<br>or bags are left before check-in and after checkout', '寄存和取回的时间对不上，<br>或入住前、退房后行李没处放', '寄存和取回的時間對不上，<br>或入住前、退房後行李沒處放'),
    L('퇴근 후 약속 전', 'After work, before the next plan', '下班后、下一场约定前', '下班後、下一場約定前')
  ),
  'copy.bubble-2-body': C(
    L('숙소를 옮기거나 공항으로 가는 날도, 그 매장의 영업시간 안에서 확인해요.', 'Moving lodgings or an airport day can leave a gap. Check that shop\'s hours first.', '换住宿或去机场的那天也会空出来。先看那家店的营业时间。', '換住宿或去機場的那天也會空出來。先看那家店的營業時間。'),
    L('약속 장소까지 가방을 들고 가지 않아도 돼요.', 'You do not have to carry the bag all the way there.', '不必一路提着袋子去约定的地方。', '不必一路提著袋子去約定的地方。')
  ),
  'copy.bubble-3-title': C(
    L('맡길 기간이나 짐 크기가 보관함 조건과 맞지 않을 때', 'When the storage length or bag size does not match the locker', '寄存天数或行李大小和寄存柜条件不合适时', '寄存天數或行李大小和寄存櫃條件不合適時'),
    L('다른 지역 콘서트나 출장으로 짐이 남을 때', 'When a concert or work trip in another city leaves you with bags', '去其他城市看演唱会或出差，行李没处放时', '去其他城市看演唱會或出差，行李沒處放時')
  ),
  'copy.bubble-3-body': C(
    L('긴 기간 보관해야하는 경우, 유모차, 레저용 짐들 어디 맡길지 애매했다면, tooK을 활용해요.', 'If you were unsure where to leave bags for a long stay, a stroller, or leisure gear, use tooK.', '需要存放较长时间、婴儿车或休闲装备，不知道放哪里时，就用 tooK。', '需要存放較長時間、嬰兒車或休閒裝備，不知道放哪裡時，就用 tooK。'),
    L('공연장이나 일정 근처에 잠시 맡겨요. 여러 날이나 큰 짐은 매장마다 달라서, 맡길 수 있는지는 그 매장에서 확인해요.', 'Leave them for a while near the venue or the plan. Several days or a large bag depends on the shop, so ask that shop whether they can keep it.', '可暂时寄存在场馆或行程附近。放好几天或大件每家店不同，请向那家店确认能否寄存。', '可暫時寄存在場館或行程附近。放好幾天或大件每家店不同，請向那家店確認能否寄存。')
  ),
  'copy.persona-1-role': C(L('위치와 시간', 'Place and time', '位置和时间', '位置和時間'), L('쇼핑', 'Shopping', '购物', '購物')),
  'copy.persona-1-title': C(
    L('보관 장소의 위치와 시간이 일정과 안 맞아요', 'The location and hours of a spot do not match your plan', '寄存地点的位置和时间与行程不合适', '寄存地點的位置和時間與行程不合適'),
    L('쇼핑백이 손에 쌓인 날', 'A day when shopping bags fill your hands', '购物袋堆在手上的一天', '購物袋堆在手上的一天')
  ),
  'copy.persona-1-li-1': C(
    L('숙소나 보관함이 멀거나, 보관함이 없거나 가득 찰 수 있어요', 'Your stay or a locker may be far, missing, or full', '住宿或寄存柜可能太远、没有，或已经满了', '住宿或寄存櫃可能太遠、沒有，或已經滿了'),
    L('가게를 옮겨 다닐 때 가방이 자꾸 늘어요', 'The bags keep growing as you move from shop to shop', '一家家逛过去，袋子不断变多', '一家家逛過去，袋子不斷變多')
  ),
  'copy.persona-1-li-2': C(
    L('필요한 시간과 영업시간이 안 맞을 수 있어요', 'The time you need may fall outside opening hours', '你需要的时间可能不在营业时间内', '你需要的時間可能不在營業時間內'),
    L('몇 시간만 맡기고 같은 동네에서 찾고 싶어요', 'You want to leave them for a few hours and pick them up in the same neighborhood', '只想寄存几小时，并在同一带取回', '只想寄存幾小時，並在同一帶取回')
  ),
  'copy.persona-1-li-3': C(
    L('행사로 자리가 부족하면 같은 동선의 다른 곳을 살펴봐요', 'If an event leaves fewer spots, look at another stop on your route', '活动期间位置少的话，看看同一条路线上的其他地方', '活動期間位置少的話，看看同一條路線上的其他地方'),
    L('짐 개수대로 요금이 보이면 좋겠어요', 'You want the price to follow the number of bags', '希望价格按行李件数显示', '希望價格按行李件數顯示')
  ),
  'copy.persona-2-role': C(L('기간과 짐 크기', 'Length and bag size', '天数和大小', '天數和大小'), L('약속 전', 'Before plans', '约定前', '約定前')),
  'copy.persona-2-title': C(
    L('맡길 기간과 짐 크기를 따로 확인해야 해요', 'Check the storage length and the bag size separately', '寄存天数和行李大小需要另外确认', '寄存天數和行李大小需要另外確認'),
    L('퇴근 후, 다음 약속까지 가방이 부담일 때', 'After work, when the bag is too much before the next plan', '下班后，下一场约定前袋子成为负担', '下班後，下一場約定前袋子成為負擔')
  ),
  'copy.persona-2-li-1': C(
    L('체크인 전, 체크아웃 후, 숙소를 옮기거나 공항으로 가는 날에 짐이 남아요', 'Bags get in the way before check-in, after checkout, between stays, or on an airport day', '入住前、退房后、换住宿或去机场的那天，行李会空出来', '入住前、退房後、換住宿或去機場的那天，行李會空出來'),
    L('약속 장소까지는 빈손으로 가고 싶어요', 'You want to arrive at the next place hands-free', '希望空着手去下一场约定', '希望空著手去下一場約定')
  ),
  'copy.persona-2-li-3': C(
    L('여러 날, 큰 짐, 유모차는 매장마다 달라요. 기간과 크기, 맡기고 찾는 시간을 먼저 확인해요', 'Several days, a large bag, or a stroller depends on the shop. Check the length, size, and drop-off and pickup times first', '多日、大件和婴儿车每家店不同。先确认天数、尺寸，以及寄存和取回时间', '多日、大件和嬰兒車每家店不同。先確認天數、尺寸，以及寄存和取回時間'),
    L('다시 찾을 시간과 장소를 미리 정하고 싶어요', 'You want the pickup time and place decided in advance', '希望事先定好取回时间和地点', '希望事先定好取回時間和地點')
  ),
  'copy.needs-how': C(
    L('숙소로 돌아가지 않고, 내 동선에서 맡길 곳의 조건을 확인해요', 'Check a spot on your route instead of going back to your stay or out to a far locker', '不返回住宿，在自己的路线上确认寄存条件', '不返回住宿，在自己的路線上確認寄存條件'),
    L('가까운 공간을 고르고 지도에서 위치를 확인해요', 'Choose a nearby spot and check it on the map', '选择附近地点，并在地图上确认', '選擇附近地點，並在地圖上確認')
  ),
  'copy.how-side': C(
    L('맡기는 시간부터 찾는 시간까지.<br>매장마다 다른 조건은 먼저 확인하고 여행을 이어가요.', 'From drop-off until pickup.<br>Check what that shop can take, then keep the trip going.', '从寄存到取回。<br>每家店的条件先确认，再继续旅行。', '從寄存到取回。<br>每家店的條件先確認，再繼續旅行。'),
    L('짐을 맡기는 순간부터 다시 찾을 때까지.<br>쇼핑, 약속, 출장 일정을 방해하지 않는 과정.', 'From drop-off until pickup.<br>A path that stays out of the way of shopping, plans, and work trips.', '从寄存到取回。<br>不打扰购物、约定和出差的过程。', '從寄存到取回。<br>不打擾購物、約定和出差的過程。')
  ),
  'copy.how-near': C(
    L('내 동선 가까이에', 'On your route', '在路线附近', '在路線附近'),
    L('지금 있는 곳 가까이에', 'Close to where you are', '靠近你现在的位置', '靠近你現在的位置')
  ),
  'copy.care-caption': C(
    L('걱정은 줄이고,<br>여행의 순간은 더하고.', 'Less worry,<br>more of the trip.', '少一点担心，<br>多一点旅程。', '少一點擔心，<br>多一點旅程。'),
    L('걱정은 줄이고,<br>발걸음은 가볍게.', 'Less worry,<br>a lighter step.', '少一点担心，<br>脚步更轻。', '少一點擔心，<br>腳步更輕。')
  ),
  'copy.partner-line': C(
    L('남는 공간으로 여행객을 맞이하는 새로운 방법.', 'A new way for spare space to welcome travelers.', '用空余空间迎接旅客的新方式。', '用空餘空間迎接旅客的新方式。'),
    L('남는 공간으로 발걸음을 가볍게 하는 사람을 맞이해요.', 'Spare space can welcome someone who wants a lighter step.', '用空余空间，迎接想让脚步更轻的人。', '用空餘空間，迎接想讓腳步更輕的人。')
  ),
  'copy.closing-tail': C(L('여행은 쭉', 'Keep exploring.', '旅程继续', '旅程繼續'), L('발걸음은 가볍게', 'Step lighter.', '脚步更轻', '腳步更輕')),
  'copy.footer-slogan': C(L('짐은 툭, 여행은 쭉.', 'Drop your bags. Keep exploring.', '行李轻放，旅程继续。', '行李輕放，旅程繼續。'), L('짐은 툭, 발걸음은 가볍게.', 'Drop your bags. Step lighter.', '行李轻放，脚步更轻。', '行李輕放，腳步更輕。')),
  'copy.footer-line': C(
    L('짐 때문에 되돌아가지 않고, 여행을 이어가세요.', 'Keep the trip going without doubling back for your bags.', '不必为了行李折返，旅行可以继续。', '不必為了行李折返，旅行可以繼續。'),
    L('일정 가까운 곳에 잠시 맡기고 발걸음을 가볍게 이어가세요.', 'Leave bags near the plan for a while and keep your step light.', '先寄存在行程附近，让脚步更轻。', '先寄存在行程附近，讓腳步更輕。')
  ),
  'copy.journey-scene': C(
    L('체크아웃 후에도 관광 일정이 남은 날', 'A day with sightseeing left after checkout', '退房后仍有观光安排的一天', '退房後仍有觀光安排的一天'),
    L('다른 지역에서 콘서트를 보는 날', 'A day for a concert in another city', '去其他城市看演唱会的一天', '去其他城市看演唱會的一天')
  ),
  'copy.journey-b-title-1': C(
    L('체크아웃', 'Checkout', '退房', '退房'),
    L('다른 지역에 도착', 'Arrive in the other city', '到达其他城市', '到達其他城市')
  ),
  'copy.journey-b-detail-1': C(
    L('숙소를 나온 뒤에도 관광이 남아요. 체크인 전에도 짐이 남을 수 있어요.', 'Sightseeing can continue after you leave the stay. Bags can also be in the way before check-in.', '离开住宿后仍要观光。入住前行李也可能没处放。', '離開住宿後仍要觀光。入住前行李也可能沒處放。'),
    L('공연 전후 일정은 있는데 짐이 남아요.', 'The plan is around the show, and the bags are still with you.', '演出前后都有安排，行李还在身边。', '演出前後都有安排，行李還在身邊。')
  ),
  'copy.journey-b-title-2': C(
    L('숙소 보관이나 역 보관함', 'The stay or a station locker', '住宿寄存或车站寄存柜', '住宿寄存或車站寄存櫃'),
    L('역이나 공연장 보관', 'Station or venue storage', '车站或场馆寄存', '車站或場館寄存')
  ),
  'copy.journey-b-detail-2': C(
    L('숙소에 맡기거나 역 보관함을 먼저 확인해요. 이것도 가능한 방법이에요.', 'First check the stay or a station locker. Those are still real options.', '先看住宿处或车站寄存柜。这些仍然是可用的办法。', '先看住宿處或車站寄存櫃。這些仍然是可用的辦法。'),
    L('그곳 보관소나 보관함을 먼저 확인해요.', 'Check the cloakroom or lockers there first.', '先看那里的寄存处或寄存柜。', '先看那裡的寄存處或寄存櫃。')
  ),
  'copy.journey-b-title-3': C(
    L('내 일정과 안 맞을 때', 'When it misses your plan', '和这次行程不合适时', '和這次行程不合適時'),
    L('조건이 안 맞으면 다른 곳', 'Look elsewhere if it does not fit', '条件不合适就另找', '條件不合適就另找')
  ),
  'copy.journey-b-detail-3': C(
    L('동선과 멀거나 운영시간, 자리, 크기가 안 맞으면 다른 곳을 찾거나 돌아서 가요.', 'If it is far from the route, or the hours, space, or size do not fit, look elsewhere or take a detour.', '如果离路线远，或时间、空位、大小不合适，就另找或绕路。', '如果離路線遠，或時間、空位、大小不合適，就另找或繞路。'),
    L('자리가 없거나 크기, 공연 후 찾는 시간이 안 맞으면 다른 장소를 찾아요.', 'If it is full, the bag is too big, or pickup after the show does not fit, look for another place.', '如果没有空位、行李太大，或演出后取不了，就再找别的地方。', '如果沒有空位、行李太大，或演出後取不了，就再找別的地方。')
  ),
  'copy.journey-b-note': C(
    L('내 일정에 안 맞으면 우회', 'A detour when it misses this plan', '和这次行程不合就绕路', '和這次行程不合就繞路'),
    L('조건이 안 맞으면 우회', 'A detour when it does not fit', '条件不合就绕路', '條件不合就繞路')
  ),
  'copy.journey-b-title-4': C(
    L('짐을 들고 다녀요', 'Walk with the bags', '带着行李走', '帶著行李走'),
    L('짐을 들고 다녀요', 'Walk with the bags', '带着行李走', '帶著行李走')
  ),
  'copy.journey-b-detail-4': C(
    L('남은 관광도 짐을 들고 이동해요.', 'The rest of the sightseeing is done while carrying the bags.', '剩下的观光也要带着行李走。', '剩下的觀光也要帶著行李走。'),
    L('공연과 주변도 짐을 들고 다녀요.', 'The show and the area around it are done while carrying the bags.', '演出和周围也要带着行李走。', '演出和周圍也要帶著行李走。')
  ),
  'copy.journey-b-title-5': C(
    L('찾으러 돌아간 뒤 이동', 'Go back, then travel on', '回去取了再出发', '回去取了再出發'),
    L('보관 장소로 돌아가 귀가', 'Go back for the bags, then home', '回到寄存处再回家', '回到寄存處再回家')
  ),
  'copy.journey-b-detail-5': C(
    L('숙소나 보관소로 돌아가 짐을 찾고, 공항이나 다음 목적지로 가요.', 'Return to the stay or the storage spot, then go to the airport or the next stop.', '返回住宿或寄存处取行李，再去机场或下一个目的地。', '返回住宿或寄存處取行李，再去機場或下一個目的地。'),
    L('짐을 찾은 뒤 집으로 돌아가요.', 'Pick them up at that place and head home.', '取回行李后回家。', '取回行李後回家。')
  ),
  'copy.journey-a-title-1': C(
    L('남은 관광과 다음 이동', 'Sightseeing left, and the next move', '剩下的观光和下一段路', '剩下的觀光和下一段路'),
    L('공연과 귀가 길', 'The show and the way home', '演出和回家的路', '演出和回家的路')
  ),
  'copy.journey-a-detail-1': C(
    L('앞으로의 관광과 공항, 다음 목적지까지 가는 길을 봐요.', 'Look at the sightseeing still ahead and the way to the airport or the next stop.', '看接下来的观光，以及去机场或下一个目的地的路。', '看接下來的觀光，以及去機場或下一個目的地的路。'),
    L('공연장과 집으로 가는 길을 기준으로 일정을 봐요.', 'Look at the plan from the venue and the way home.', '以场馆和回家的路来看安排。', '以場館和回家的路來看安排。')
  ),
  'copy.journey-a-title-2': C(
    L('관광을 마치는 길 근처', 'Near the end of that route', '观光收尾的路线附近', '觀光收尾的路線附近'),
    L('동선 근처를 찾아요', 'Look near that route', '在路线附近找', '在路線附近找')
  ),
  'copy.journey-a-detail-2': C(
    L('그 길 근처에서 맡길 곳을 살펴봐요.', 'Look for a place along the way you finish the sightseeing.', '在结束观光的那条路附近找寄存点。', '在結束觀光的那條路附近找寄存點。'),
    L('그 길 근처에서 맡길 곳을 살펴봐요.', 'See places to leave the bags along that way.', '沿这条路看看可以寄存的地方。', '沿這條路看看可以寄存的地方。')
  ),
  'copy.journey-a-title-3': C(
    L('조건이 맞는지 확인', 'See if the conditions fit', '先确认条件是否合适', '先確認條件是否合適'),
    L('맞는 곳을 고르기 전에', 'Before you choose a place', '选定之前先确认', '選定之前先確認')
  ),
  'copy.journey-a-detail-3': C(
    L('맡기고 찾는 시간, 짐 조건, 화면에 나온 가격을 먼저 확인해요.', 'Check the drop-off and pickup times, the bag conditions, and the price shown.', '先看寄存和取回时间、行李条件，以及页面上的价格。', '先看寄存和取回時間、行李條件，以及頁面上的價格。'),
    L('가격, 짐이 들어가는지, 공연 후에 찾을 수 있는 시간을 먼저 확인해요.', 'Check the price, whether the bags fit, and whether you can pick them up after the show.', '先看价格、行李能否放下，以及演出后能否取回。', '先看價格、行李能否放下，以及演出後能否取回。')
  ),
  'copy.journey-a-note': C(
    L('시간, 짐 조건, 표시 가격', 'Times, bag conditions, shown price', '时间、行李条件、显示价格', '時間、行李條件、顯示價格'),
    L('가격, 짐 크기, 공연 후 시간', 'Price, bag size, time after the show', '价格、行李大小、演出后时间', '價格、行李大小、演出後時間')
  ),
  'copy.journey-a-title-4': C(
    L('빈손으로 다녀요', 'Walk without the bags', '空手走', '空手走'),
    L('빈손으로 다녀요', 'Walk without the bags', '空手走', '空手走')
  ),
  'copy.journey-a-detail-4': C(
    L('맡긴 뒤 빈손으로 관광을 이어가요.', 'After dropping the bags off, continue sightseeing empty-handed.', '寄存后空手继续观光。', '寄存後空手繼續觀光。'),
    L('맡긴 뒤 빈손으로 공연과 주변을 다녀요.', 'After dropping the bags off, do the show and the area around it empty-handed.', '寄存后空手去看演出、逛周围。', '寄存後空手去看演出、逛周圍。')
  ),
  'copy.journey-a-title-5': C(
    L('찾은 뒤 다음으로', 'Pick up, then go on', '取回后前往下一处', '取回後前往下一處'),
    L('약속한 시간에 찾아 귀가', 'Pick up at the agreed time, then home', '按约定时间取回再回家', '按約定時間取回再回家')
  ),
  'copy.journey-a-detail-5': C(
    L('짐을 찾고 공항이나 다음 목적지로 이동해요.', 'Collect the bags and continue to the airport or the next stop.', '取回行李，再去机场或下一个目的地。', '取回行李，再去機場或下一個目的地。'),
    L('정해 둔 시간에 짐을 찾고 집으로 돌아가요.', 'Collect the bags at the time you set and head home.', '在定好的时间取行李，然后回家。', '在定好的時間取行李，然後回家。')
  ),
  'copy.journey-cases-label': C(
    L('다른 날의 짐', 'Bags on other days', '其他日子的行李', '其他日子的行李'),
    L('출장에서의 짐', 'Bags on a work trip', '出差时的行李', '出差時的行李')
  ),
  'copy.case-1-title': C(
    L('다른 도시를 다녀오는 동안 일부 짐을 남기고 싶을 때', 'When you want to leave some bags while visiting another city', '去另一座城市时，想留下一部分行李', '去另一座城市時，想留下一部分行李'),
    L('다른 지역 출장에서 회의 전후에 짐이 남을 때', 'When a work trip leaves bags around the meeting', '去其他城市出差，会议前后行李没处放时', '去其他城市出差，會議前後行李沒處放時')
  ),
  'copy.case-1-situation': C(
    L('짧은 여행에 일부 짐만 며칠 두고 싶어요.', 'You want to leave part of the luggage for a few days during a short trip.', '短途出行时，想把一部分行李放几天。', '短途出行時，想把一部分行李放幾天。'),
    L('다른 지역에 도착해 회의 전에 짐이 남고, 회의가 끝난 뒤 기차로 돌아가요.', 'You arrive with bags before the meeting, then take the train back after it.', '到达其他城市后，会议前行李还在，会议结束再坐火车回去。', '到達其他城市後，會議前行李還在，會議結束再坐火車回去。')
  ),
  'copy.case-1-check': C(
    L('맡길 수 있는 기간, 맡기고 찾는 시간, 요금은 그 매장에서 확인해요. 매장마다 달라요.', 'Ask that shop about the number of days, the drop-off and pickup times, and the price. It differs by shop.', '能放几天、寄存和取回时间、费用，请向那家店确认。每家店不同。', '能放幾天、寄存和取回時間、費用，請向那家店確認。每家店不同。'),
    L('회의 장소와 역 근처인지, 맡기고 찾는 시간, 짐이 들어가는지, 화면에 나온 가격을 그 매장에서 확인해요.', 'Ask that shop if it is near the meeting and the station, the drop-off and pickup times, whether the bags fit, and the price shown.', '是否靠近会议地点和车站、寄存和取回时间、行李能否放下、页面上的价格，请向那家店确认。', '是否靠近會議地點和車站、寄存和取回時間、行李能否放下、頁面上的價格，請向那家店確認。')
  ),
  'copy.case-2-title': C(
    L('보관함 규격에 맞지 않는 짐을 맡기고 싶을 때', 'When a bag does not fit a locker', '行李放不进寄存柜时', '行李放不進寄存櫃時'),
    L('-', '-', '-', '-')
  ),
  'copy.case-2-situation': C(
    L('큰 짐이나 유모차가 보관함에 들어가지 않을 수 있어요.', 'A large bag or a stroller may not fit in a locker.', '大件行李或婴儿车可能放不进寄存柜。', '大件行李或嬰兒車可能放不進寄存櫃。'),
    L('-', '-', '-', '-')
  ),
  'copy.case-2-check': C(
    L('크기, 수량, 맡기고 찾는 시간, 요금을 그 매장에서 확인해요. 맡길 수 있는지는 매장마다 달라요.', 'Ask that shop about the size, the number of bags, the drop-off and pickup times, and the price. Whether they can keep it differs by shop.', '尺寸、件数、寄存和取回时间、费用，请向那家店确认。能不能寄存，每家店不同。', '尺寸、件數、寄存和取回時間、費用，請向那家店確認。能不能寄存，每家店不同。'),
    L('-', '-', '-', '-')
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
  '경기': P('Gyeonggi', '京畿', '京畿', ['gyeonggi', 'gyeonggi-do']),
  '강원': P('Gangwon', '江原', '江原', ['gangwon', 'gangwon-do']),
  '충북': P('Chungbuk', '忠北', '忠北', ['chungbuk', 'north chungcheong']),
  '충남': P('Chungnam', '忠南', '忠南', ['chungnam', 'south chungcheong']),
  '전북': P('Jeonbuk', '全北', '全北', ['jeonbuk', 'north jeolla']),
  '경북': P('Gyeongbuk', '庆北', '慶北', ['gyeongbuk', 'north gyeongsang']),
  '경남': P('Gyeongnam', '庆南', '慶南', ['gyeongnam', 'south gyeongsang']),
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

const COPY_HTML = ['hero-title', 'hero-description', 'how-side', 'care-caption', 'bubble-2-title'];
const COPY_TEXT = ['hero-cta', 'story-heading', 'story-lead', 'bubble-1-title', 'bubble-1-body', 'bubble-2-body', 'bubble-3-title', 'bubble-3-body', 'journey-scene', 'journey-b-title-1', 'journey-b-detail-1', 'journey-b-title-2', 'journey-b-detail-2', 'journey-b-title-3', 'journey-b-detail-3', 'journey-b-note', 'journey-b-title-4', 'journey-b-detail-4', 'journey-b-title-5', 'journey-b-detail-5', 'journey-a-title-1', 'journey-a-detail-1', 'journey-a-title-2', 'journey-a-detail-2', 'journey-a-title-3', 'journey-a-detail-3', 'journey-a-note', 'journey-a-title-4', 'journey-a-detail-4', 'journey-a-title-5', 'journey-a-detail-5', 'journey-cases-label', 'case-1-title', 'case-1-situation', 'case-1-check', 'case-2-title', 'case-2-situation', 'case-2-check', 'persona-1-role', 'persona-1-title', 'persona-1-li-1', 'persona-1-li-2', 'persona-1-li-3', 'persona-2-role', 'persona-2-title', 'persona-2-li-1', 'persona-2-li-3', 'needs-how', 'how-near', 'partner-line', 'closing-tail', 'footer-slogan', 'footer-line'];

let current = 'ko';
let copyMode = 'tourism';

export function getCopyMode() {
  return copyMode;
}

export function setCopyMode(mode) {
  copyMode = mode === 'daily' ? 'daily' : 'tourism';
  return copyMode;
}

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
  if (entry.modes) {
    const pack = entry.modes[copyMode] || entry.modes.tourism;
    return fill(pick(pack), vars);
  }
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
  if (current === 'ko') return name;
  const place = PLACES[name];
  if (place && place[current]) return place[current];
  return localizeProper(name, current);
}

export function placeSearchText(store) {
  const names = [store && store.province, store && store.city, store && store.district, store && store.area, store && store.type, store && store.category, store && store.nearby];
  const bits = [];
  names.forEach(name => {
    const place = PLACES[name];
    if (!place) return;
    bits.push(place.en, place['zh-Hans'], place['zh-Hant'], ...(place.aliases || []));
  });
  const fields = [store && store.nearby, store && store.placeLabel, store && store.addressShort, store && store.district, store && store.city, store && store.province, store && store.area];
  if (store && store.showMaps) fields.push(store.realName, store.address);
  ['en', 'zh-Hans', 'zh-Hant'].forEach(locale => {
    fields.forEach(field => {
      if (field) bits.push(localizeProper(field, locale));
    });
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
  if (store.showMaps) return localizeProper(store.realName || store.name || '', current);
  return formatHiddenName(store);
}

export function formatAddress(text) {
  return localizeProper(text, current);
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
  if (!match) return localizeProper(text, current);
  return t('access.walk', { place: localizeProper(match[1], current), min: formatNumber(match[2]) });
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
