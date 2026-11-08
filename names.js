// 매장 이름과 주소의 화면 표기.
// 저장된 원문은 한국어로 두고, 고른 언어로 읽을 수 있게 바꾼다.
// 공식 외국어 상호를 새로 정하지 않고, 지명 표기와 국어의 로마자, 한자 읽기를 쓴다.

const CHO = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const JUNG = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
const JONG = ['', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm', 'l', 'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't'];
const IEUNG = 11;
const RIEUL = 5;
const NIEUN = 2;

const HANJA_ROWS = `
가 加 加
각 閣 阁
갈 葛 葛
감 甘 甘
강 江 江
개 開 开
객 客 客
갬 鑑 鉴
거 巨 巨
건 建 建
게 揭 揭
격 格 格
경 京 京
계 界 界
고 高 高
곡 谷 谷
곤 坤 坤
골 谷 谷
공 公 公
과 科 科
관 官 官
광 廣 广
교 橋 桥
구 九 九
국 國 国
궁 宮 宫
귀 貴 贵
균 均 均
그 克 克
극 極 极
근 近 近
글 克 克
금 金 金
기 基 基
길 吉 吉
김 金 金
까 卡 卡
꽃 花 花
끼 奇 奇
나 那 那
남 南 南
내 內 内
너 訥 讷
널 訥 讷
념 念 念
노 老 老
녹 綠 绿
논 論 论
놀 諾 诺
농 農 农
다 多 多
단 團 团
달 達 达
담 談 谈
닷 達 达
당 堂 堂
대 大 大
더 德 德
덕 德 德
데 得 得
도 道 道
독 獨 独
돈 敦 敦
동 東 东
두 頭 头
드 得 得
들 等 等
등 等 等
디 迪 迪
딩 丁 丁
뚝 篤 笃
뜰 庭 庭
띵 丁 丁
라 羅 罗
락 樂 乐
란 蘭 兰
랑 郎 郎
래 來 来
랜 蘭 兰
량 良 良
럴 勒 勒
럼 廉 廉
레 雷 雷
렛 烈 烈
련 連 连
로 路 路
롯 樂 乐
루 樓 楼
룸 隆 隆
뤼 呂 吕
류 流 流
륙 陸 陆
르 勒 勒
릉 陵 陵
리 里 里
린 麟 麟
림 林 林
립 立 立
마 馬 马
막 幕 幕
만 萬 万
망 望 望
매 梅 梅
메 梅 梅
면 面 面
명 明 明
모 毛 毛
목 木 木
몽 夢 梦
묘 廟 庙
무 武 武
문 門 门
물 物 物
미 美 美
믹 密 密
민 民 民
밀 密 密
박 朴 朴
반 半 半
발 發 发
방 房 房
배 培 培
백 白 白
버 伯 伯
번 番 番
벌 伐 伐
범 範 范
베 倍 倍
벤 奔 奔
변 邊 边
별 別 别
병 丙 丙
보 寶 宝
복 福 福
본 本 本
봉 峰 峰
부 富 富
북 北 北
분 分 分
불 佛 佛
브 布 布
블 勃 勃
비 比 比
빌 畢 毕
빙 冰 冰
빛 光 光
사 沙 沙
산 山 山
삼 三 三
상 上 上
새 新 新
생 生 生
샤 沙 沙
샵 舖 铺
서 西 西
석 石 石
선 線 线
섬 島 岛
성 城 城
세 世 世
센 森 森
션 遜 逊
소 素 素
속 束 束
송 松 松
쇼 秀 秀
숍 店 店
수 水 水
숙 淑 淑
순 順 顺
술 術 术
숨 深 深
숭 崇 崇
숲 林 林
쉬 秀 秀
슈 秀 秀
스 斯 斯
슬 瑟 瑟
시 市 市
식 食 食
신 新 新
실 實 实
심 心 心
십 十 十
아 阿 阿
악 岳 岳
안 安 安
암 岩 岩
압 押 押
앙 昂 昂
앞 前 前
야 野 野
약 藥 药
얏 亞 亚
양 陽 阳
어 御 御
언 彦 彦
업 業 业
에 埃 埃
엘 爾 尔
엠 姆 姆
엣 艾 艾
여 汝 汝
역 驛 驿
연 延 延
염 鹽 盐
영 永 永
옆 旁 旁
예 藝 艺
오 吳 吴
옥 玉 玉
온 溫 温
올 斡 斡
와 臥 卧
왁 渥 渥
왕 王 王
외 外 外
욕 浴 浴
용 龍 龙
우 宇 宇
운 雲 云
울 蔚 蔚
움 音 音
워 沃 沃
원 元 元
월 月 月
유 裕 裕
은 銀 银
을 乙 乙
음 音 音
의 義 义
이 梨 梨
익 益 益
인 仁 仁
일 一 一
임 任 任
입 入 入
잉 英 英
자 子 子
작 作 作
잠 蠶 蚕
장 場 场
재 在 在
쟁 爭 争
저 著 著
전 全 全
점 店 店
정 亭 亭
제 第 第
조 朝 朝
존 尊 尊
종 鍾 钟
좌 左 左
주 州 州
죽 竹 竹
중 中 中
지 地 地
직 直 直
진 真 真
짐 斟 斟
쪽 側 侧
찌 之 之
차 車 车
찰 察 察
참 參 参
창 昌 昌
처 處 处
천 川 川
첨 瞻 瞻
청 青 青
초 草 草
촌 村 村
춘 春 春
출 出 出
충 忠 忠
층 層 层
치 峙 峙
친 親 亲
카 卡 卡
칼 割 割
캐 凱 凯
캠 坎 坎
커 克 克
컨 肯 肯
컵 杯 杯
케 凱 凯
코 科 科
쿵 空 空
크 克 克
키 基 基
킨 欽 钦
킬 吉 吉
타 他 他
탄 炭 炭
태 泰 泰
택 宅 宅
터 垈 垈
털 脫 脱
텀 騰 腾
테 泰 泰
텍 特 特
텔 台 台
토 土 土
통 通 通
퇴 退 退
투 投 投
툰 屯 屯
튜 丘 丘
트 特 特
특 特 特
튼 頓 顿
틀 脫 脱
티 蒂 蒂
파 波 波
팔 八 八
팝 泡 泡
퍼 波 波
페 佩 佩
편 便 便
평 平 平
포 浦 浦
표 表 表
푸 夫 夫
품 品 品
풍 風 风
퓸 芬 芬
프 夫 夫
플 弗 弗
피 皮 皮
픽 匹 匹
핑 平 平
하 河 河
학 學 学
한 漢 汉
함 咸 咸
합 合 合
항 港 港
해 海 海
향 香 香
헐 許 许
헤 奚 奚
헬 赫 赫
현 賢 贤
협 協 协
형 亨 亨
혜 惠 惠
호 浩 浩
홍 弘 弘
화 化 化
환 歡 欢
황 黃 黄
회 會 会
후 後 后
흑 黑 黑
흠 欽 钦
흥 興 兴
희 喜 喜
히 希 希
간 間 间
돌 石 石
쌈 衫 衫
체 體 体
훈 訓 训
휴 休 休
힙 嬉 嬉
`.trim().split('\n').map(line => line.trim().split(/\s+/));

const HANJA = new Map(HANJA_ROWS.map(([syl, hant, hans]) => [syl, { hant, hans }]));

const DICT_LINES = `
서울|word|Seoul|首爾|首尔
부산|word|Busan|釜山|釜山
인천|word|Incheon|仁川|仁川
대구|word|Daegu|大邱|大邱
대전|word|Daejeon|大田|大田
광주|word|Gwangju|光州|光州
울산|word|Ulsan|蔚山|蔚山
세종|word|Sejong|世宗|世宗
제주|word|Jeju|濟州|济州
수원|word|Suwon|水原|水原
성남|word|Seongnam|城南|城南
고양|word|Goyang|高陽|高阳
용인|word|Yongin|龍仁|龙仁
창원|word|Changwon|昌原|昌原
청주|word|Cheongju|清州|清州
천안|word|Cheonan|天安|天安
전주|word|Jeonju|全州|全州
안양|word|Anyang|安養|安养
안산|word|Ansan|安山|安山
김해|word|Gimhae|金海|金海
포항|word|Pohang|浦項|浦项
평택|word|Pyeongtaek|平澤|平泽
파주|word|Paju|坡州|坡州
의정부|word|Uijeongbu|議政府|议政府
부천|word|Bucheon|富川|富川
구리|word|Guri|九里|九里
오산|word|Osan|烏山|乌山
강릉|word|Gangneung|江陵|江陵
경주|word|Gyeongju|慶州|庆州
춘천|word|Chuncheon|春川|春川
밀양|word|Miryang|密陽|密阳
경기도|word|Gyeonggi-do|京畿道|京畿道
강원|word|Gangwon|江原|江原
경상남도|word|South Gyeongsang|慶尚南道|庆尚南道
경상북도|word|North Gyeongsang|慶尚北道|庆尚北道
충청남도|word|South Chungcheong|忠清南道|忠清南道
충청북도|word|North Chungcheong|忠清北道|忠清北道
서울특별시|word|Seoul|首爾特別市|首尔特别市
부산광역시|word|Busan|釜山廣域市|釜山广域市
대구광역시|word|Daegu|大邱廣域市|大邱广域市
인천광역시|word|Incheon|仁川廣域市|仁川广域市
대전광역시|word|Daejeon|大田廣域市|大田广域市
광주광역시|word|Gwangju|光州廣域市|光州广域市
울산광역시|word|Ulsan|蔚山廣域市|蔚山广域市
제주특별자치도|word|Jeju|濟州特別自治道|济州特别自治道
강원특별자치도|word|Gangwon|江原特別自治道|江原特别自治道
전북특별자치도|word|Jeonbuk|全北特別自治道|全北特别自治道
강남|stem|Gangnam|江南|江南
홍대|stem|Hongdae|弘大|弘大
연남|stem|Yeonnam|延南|延南
성수|stem|Seongsu|聖水|圣水
건대|word|Konkuk Univ.|建大|建大
잠실|stem|Jamsil|蠶室|蚕室
대학로|word|Daehak-ro|大學路|大学路
종로|stem|Jongno|鍾路|钟路
익선|stem|Ikseon|益善|益善
명동|stem|Myeongdong|明洞|明洞
신촌|stem|Sinchon|新村|新村
이대|word|Ewha|梨大|梨大
광안리|stem|Gwangalli|廣安里|广安里
광안|stem|Gwangan|廣安|广安
해운대|stem|Haeundae|海雲台|海云台
서면|stem|Seomyeon|西面|西面
남포|stem|Nampo|南浦|南浦
광복|stem|Gwangbok|光復|光复
부평|stem|Bupyeong|富平|富平
동대구|stem|Dongdaegu|東大邱|东大邱
스카이로드|word|Sky Road|天空路|天空路
스카이|word|Sky|天空|天空
개항장|word|Open Port|開港場|开港场
공항|word|Airport|機場|机场
강북|stem|Gangbuk|江北|江北
강동|stem|Gangdong|江東|江东
강서|stem|Gangseo|江西|江西
마포|stem|Mapo|麻浦|麻浦
용산|stem|Yongsan|龍山|龙山
송파|stem|Songpa|松坡|松坡
성동|stem|Seongdong|城東|城东
성북|stem|Seongbuk|城北|城北
광진|stem|Gwangjin|廣津|广津
관악|stem|Gwanak|冠岳|冠岳
동작|stem|Dongjak|銅雀|铜雀
영등포|stem|Yeongdeungpo|永登浦|永登浦
구로|stem|Guro|九老|九老
노원|stem|Nowon|蘆原|芦原
은평|stem|Eunpyeong|恩平|恩平
서초|stem|Seocho|瑞草|瑞草
중랑|stem|Jungnang|中浪|中浪
금천|stem|Geumcheon|衿川|衿川
양천|stem|Yangcheon|陽川|阳川
가산|stem|Gasan|加山|加山
사당|stem|Sadang|舍堂|舍堂
신림|stem|Sillim|新林|新林
신도림|stem|Sindorim|新道林|新道林
합정|stem|Hapjeong|合井|合井
망원|stem|Mangwon|望遠|望远
상수|stem|Sangsu|上水|上水
회현|stem|Hoehyeon|會賢|会贤
한남|stem|Hannam|漢南|汉南
공덕|stem|Gongdeok|孔德|孔德
홍익|stem|Hongik|弘益|弘益
서교|stem|Seogyo|西橋|西桥
연희|stem|Yeonhui|延禧|延禧
잠원|stem|Jamwon|蠶院|蚕院
삼성|stem|Samseong|三成|三成
선릉|stem|Seolleung|宣陵|宣陵
청담|stem|Cheongdam|清潭|清潭
신사|stem|Sinsa|新沙|新沙
논현|stem|Nonhyeon|論峴|论岘
역삼|stem|Yeoksam|驛三|驿三
압구정|stem|Apgujeong|狎鷗亭|狎鸥亭
테헤란|stem|Teheran|德黑蘭|德黑兰
을지로|word|Euljiro|乙支路|乙支路
충무로|word|Chungmuro|忠武路|忠武路
청계천|word|Cheonggyecheon|清溪川|清溪川
한강|word|Hangang|漢江|汉江
남산|word|Namsan|南山|南山
북촌|word|Bukchon|北村|北村
인사동|word|Insadong|仁寺洞|仁寺洞
여의도|word|Yeouido|汝矣島|汝矣岛
이태원|word|Itaewon|梨泰院|梨泰院
경복궁|word|Gyeongbokgung|景福宮|景福宫
광화문|word|Gwanghwamun|光化門|光化门
동대문|word|Dongdaemun|東大門|东大门
서대문|word|Seodaemun|西大門|西大门
남대문|word|Namdaemun|南大門|南大门
혜화|word|Hyehwa|惠化|惠化
안국|word|Anguk|安國|安国
종각|word|Jonggak|鐘閣|钟阁
잠실새내|word|Jamsilsaenae|蠶室新川|蚕室新川
신논현|word|Sinnonhyeon|新論峴|新论岘
청량리|word|Cheongnyangni|清凉里|清凉里
왕십리|word|Wangsimni|往十里|往十里
상왕십리|word|Sangwangsimni|上往十里|上往十里
뚝섬|word|Ttukseom|纛島|纛岛
서울숲|word|Seoul Forest|首爾林|首尔林
석촌|stem|Seokchon|石村|石村
가락|stem|Garak|可樂|可乐
자갈치|word|Jagalchi|札嘎其|札嘎其
광장시장|word|Gwangjang Market|廣藏市場|广藏市场
통인시장|word|Tongin Market|通仁市場|通仁市场
감천|word|Gamcheon|甘川|甘川
경희대|word|Kyung Hee Univ.|慶熙大|庆熙大
천호|stem|Cheonho|千戶|千户
서소문성지역사박물관|word|Seosomun Shrine History Museum|西小門聖地歷史博物館|西小门圣地历史博物馆
서소문성지역|word|Seosomun Shrine|西小門聖地|西小门圣地
서소문성지|word|Seosomun Shrine|西小門聖地|西小门圣地
히어로|word|Hero|Hero|Hero
만들기|word|making|製作|制作
야놀자|word|Yanolja|Yanolja|Yanolja
벌툰|word|Beoltoon|Beoltoon|Beoltoon
베이글|word|Bagel|貝果|贝果
소마|word|Soma|Soma|Soma
레더|word|Leather|皮革|皮革
동백꽃|word|Camellia|冬柏|冬柏
숨은|word|Hidden|隱藏|隐藏
사랑|word|Love|愛|爱
경리단길|word|Gyeongnidan-gil|京里團路|京里团路
송리단길|word|Songnidan-gil|松里團路|松里团路
황리단길|word|Hwangnidan-gil|皇里團路|皇里团路
샤로수길|word|Sharosu-gil|沙羅樹街|沙罗树街
인사동길|word|Insadong-gil|仁寺洞街|仁寺洞街
김포공항|word|Gimpo Airport|金浦機場|金浦机场
인천공항|word|Incheon Airport|仁川機場|仁川机场
제주국제공항|word|Jeju International Airport|濟州國際機場|济州国际机场
김해공항|word|Gimhae Airport|金海機場|金海机场
고속터미널|word|Express Bus Terminal|高速客運站|高速客运站
서울역|word|Seoul Station|首爾站|首尔站
부산역|word|Busan Station|釜山站|釜山站
강남역|word|Gangnam Station|江南站|江南站
홍대입구역|word|Hongik Univ. Station|弘大入口站|弘大入口站
건대입구역|word|Konkuk Univ. Station|建大入口站|建大入口站
서울대입구역|word|Seoul Nat'l Univ. Station|首爾大入口站|首尔大入口站
이대역|word|Ewha Womans Univ. Station|梨大站|梨大站
성신여대입구역|word|Sungshin Women's Univ. Station|誠信女大入口站|诚信女大入口站
한성대입구역|word|Hansung Univ. Station|漢城大入口站|汉城大入口站
한양대입구역|word|Hanyang Univ. Station|漢陽大入口站|汉阳大入口站
동대입구역|word|Dongguk Univ. Station|東大入口站|东大入口站
종로3가|word|Jongno 3-ga|鍾路3街|钟路3街
서울대|word|Seoul Nat'l Univ.|首爾大|首尔大
한성대|word|Hansung Univ.|漢城大|汉城大
한양대|word|Hanyang Univ.|漢陽大|汉阳大
성신여대|word|Sungshin Women's Univ.|誠信女大|诚信女大
경북대학교|word|Kyungpook National University|慶北大學|庆北大学
건국대학교|word|Konkuk University|建國大學|建国大学
홍익대학교|word|Hongik University|弘益大學|弘益大学
성균관대학교|word|Sungkyunkwan University|成均館大學|成均馆大学
숙명여자대학교|word|Sookmyung Women's University|淑明女子大學|淑明女子大学
중앙대학교|word|Chung-Ang University|中央大學|中央大学
동국대학교|word|Dongguk University|東國大學|东国大学
경희대학교|word|Kyung Hee University|慶熙大學|庆熙大学
연세대학교|word|Yonsei University|延世大學|延世大学
숭실대학교|word|Soongsil University|崇實大學|崇实大学
아주대학교|word|Ajou University|亞洲大學|亚洲大学
김해출입국외국인청|word|Gimhae Immigration Office|金海出入境管理所|金海出入境管理所
첨성대|word|Cheomseongdae|瞻星臺|瞻星台
성산일출봉|word|Seongsan Ilchulbong|城山日出峰|城山日出峰
헬로에이피엠|word|Hello APM|Hello APM|Hello APM
와이엠시에이|word|YMCA|YMCA|YMCA
오크우드|word|Oakwood|Oakwood|Oakwood
프리미어|word|Premier|Premier|Premier
아이파크|word|I-Park|I-Park|I-Park
푸르지오|word|Prugio|Prugio|Prugio
킨텍스|word|KINTEX|KINTEX|KINTEX
닷노트|word|.note|.note|.note
제페토|word|Zepeto|Zepeto|Zepeto
아뜰리에|word|Atelier|Atelier|Atelier
뤼미에르|word|Lumiere|呂米埃爾|吕米埃尔
파라다이스|word|Paradise|天堂|天堂
하얏트|word|Hyatt|凱悅|凯悦
그랜드|word|Grand|格蘭|格兰
드래곤|word|Dragon|龍|龙
롯데|word|Lotte|樂天|乐天
캐슬|word|Castle|城堡|城堡
트럼프|word|Trump|特朗普|特朗普
센텀|word|Centum|Centum|Centum
오시리아|word|Osiria|Osiria|Osiria
로데오|word|Rodeo|羅德奧|罗德奥
센트럴|word|Central|中央|中央
디지털|word|Digital|數碼|数码
미디어|word|Media|媒體|媒体
시티|word|City|城|城
파크|word|Park|公園|公园
월드|word|World|世界|世界
플라자|word|Plaza|廣場|广场
아울렛|word|Outlet|奧特萊斯|奥特莱斯
컨벤션|word|Convention|會展|会展
센터|word|Center|中心|中心
디자인|word|Design|設計|设计
스튜디오|word|Studio|工作室|工作室
세라믹|word|Ceramic|陶瓷|陶瓷
포터리|word|Pottery|陶藝|陶艺
보드게임|word|Board game|桌遊|桌游
쇼핑|word|Shopping|購物|购物
터널|word|Tunnel|隧道|隧道
단지|word|Complex|園區|园区
아파트|word|Apartments|公寓|公寓
호텔|word|Hotel|酒店|酒店
카페|word|Cafe|咖啡館|咖啡馆
빌딩|word|Building|大樓|大楼
상가|word|Arcade|商場|商场
백화점|word|Department store|百貨店|百货店
병원|word|Hospital|醫院|医院
공방|word|Workshop|工坊|工坊
캠퍼스|word|Campus|校區|校区
대학교|word|University|大學|大学
대학|word|University|大學|大学
초등학교|word|Elementary school|小學|小学
학교|word|School|學校|学校
박물관|word|Museum|博物館|博物馆
기념관|word|Memorial|紀念館|纪念馆
공원|word|Park|公園|公园
광장|word|Plaza|廣場|广场
시장|word|Market|市場|市场
거리|word|Street|街|街
마을|word|Village|村|村
한옥|word|Hanok|韓屋|韩屋
해수욕장|word|Beach|海水浴場|海水浴场
해변|word|Beach|海邊|海边
터미널|word|Terminal|客運站|客运站
버스터미널|word|Bus terminal|巴士客運站|巴士客运站
시외|word|Intercity|市外|市外
고속|word|Express|高速|高速
종합운동장|word|Sports complex|綜合運動場|综合运动场
운동장|word|Stadium|運動場|运动场
경기장|word|Stadium|體育場|体育场
전통|word|Traditional|傳統|传统
관광|word|Tourist|觀光|观光
안내소|word|Information|問訊處|问讯处
문화|word|Culture|文化|文化
역사|word|History|歷史|历史
공예|word|Craft|工藝|工艺
전쟁|word|War|戰爭|战争
출입국|word|Immigration|出入境|出入境
외국인|word|Foreign residents|外國人|外国人
상륙|word|Landing|登陸|登陆
작전|word|Operation|作戰|作战
국립|word|National|國立|国立
국제|word|International|國際|国际
고궁|word|Palace|古宮|古宫
궁전|word|Palace|宮殿|宫殿
궁|word|Palace|宮|宫
성당|word|Cathedral|聖堂|圣堂
온천|word|Hot spring|溫泉|温泉
시청|word|City Hall|市廳|市厅
구청|word|District office|區廳|区厅
경찰서|word|Police station|警察署|警察署
도서관|word|Library|圖書館|图书馆
정류장|word|Stop|車站|车站
버스|word|Bus|巴士|巴士
사무실|word|Office|辦公室|办公室
음식점|word|Restaurant|餐廳|餐厅
소매점|word|Shop|零售店|零售店
전자제품|word|Electronics|電子產品|电子产品
기념품|word|Souvenir|紀念品|纪念品
환전소|word|Currency exchange|兌換處|兑换处
약국|word|Pharmacy|藥局|药局
편의점|word|Convenience store|便利店|便利店
보관소|word|Storage|寄存處|寄存处
향수|word|Perfume|香水|香水
퍼퓸|word|Perfume|香水|香水
가죽|word|Leather|皮革|皮革
도예|word|Ceramics|陶藝|陶艺
팔찌|word|Bracelet|手鍊|手链
반지|word|Ring|戒指|戒指
나무|word|Wood|木|木
만화|word|Comics|漫畫|漫画
디저트|word|Dessert|甜品|甜品
베이커리|word|Bakery|麵包店|面包店
키친|word|Kitchen|廚房|厨房
타투|word|Tattoo|紋身|纹身
드로잉|word|Drawing|繪畫|绘画
아트|word|Art|藝術|艺术
아이스|word|Ice|冰|冰
왁스|word|Wax|蠟|蜡
카빙|word|Carving|雕刻|雕刻
포레스트|word|Forest|森林|森林
레드|word|Red|紅|红
버튼|word|Button|按鈕|按钮
워크|word|Work|工作|工作
룸|word|Room|室|室
샵|word|Shop|店|店
숍|word|Shop|店|店
코끼리|word|Elephant|大象|大象
데이트팝|word|Datepop|Datepop|Datepop
상품|word|items|商品|商品
비밀|word|Secret|秘密|秘密
화원|word|Garden|花園|花园
아지트|word|Hideout|據點|据点
우리들의|word|Our|我們的|我们的
사거리|stem|sageori|路口|路口
고가|word|Overpass|高架|高架
수변|word|Waterfront|水邊|水边
분수대|word|Fountain|噴泉|喷泉
케이블카|word|Cable car|纜車|缆车
어린이|word|Children's|兒童|儿童
여자|word|Women's|女子|女子
여객|word|Passenger|旅客|旅客
연안|word|Coastal|沿岸|沿岸
주택가|word|Residential area|住宅區|住宅区
중심가|word|City center|市中心|市中心
시내|word|Downtown|市區|市区
골목|word|Alley|巷|巷
제휴|word|Partner|合作|合作
공간|word|Space|空間|空间
인근|word|Nearby|附近|附近
힙지로|word|Hipjiro|Hipjiro|Hipjiro
돌담|word|Stone wall|石牆|石墙
자하문|word|Jahamun|紫霞門|紫霞门
덕수궁|word|Deoksugung|德壽宮|德寿宫
쌈지길|word|Ssamzie-gil|Ssamzie街|Ssamzie街
망리단길|word|Mangnidan-gil|望遠里團路|望远里团路
연세로|word|Yonsei-ro|延世路|延世路
서촌|word|Seochon|西村|西村
정문|word|Main gate|正門|正门
서부|word|West side|西側|西侧
화양|stem|Hwayang|華陽|华阳
남창|stem|Namchang|南倉|南仓
동자|stem|Dongja|東子|东子
체부|stem|Chebu|體府|体府
계동|stem|Gyedong|桂洞|桂洞
삼청|stem|Samcheong|三清|三清
관훈|stem|Gwanhun|寬勳|宽勋
통인|stem|Tongin|通仁|通仁
나루|word|Ferry|渡口|渡口
월미|word|Wolmi|月尾|月尾
근처|near|Near|附近|附近
일대|word|Area|一帶|一带
건너편|word|Opposite side|對面|对面
동쪽|word|East|東側|东侧
서쪽|word|West|西側|西侧
남쪽|word|South|南側|南侧
북쪽|word|North|北側|北侧
출구|word|Exit|出口|出口
입구|word|Entrance|入口|入口
문|word|Gate|門|门|end
앞|word|Front|前|前
옆|word|Beside|旁|旁
과|word|and|和|和|end
에서|drop|||end
의|drop||
구|suffix|gu|區|区|end
동|suffix|dong|洞|洞|end
로|suffix|ro|路|路|end
길|suffix|gil|街|街|end
대로|suffix|daero|大路|大路|end
군|suffix|gun|郡|郡|end
리|suffix|ri|里|里|end
가|suffix|ga|街|街|end
역|word|Station|站|站|end
입구역|word|Station|入口站|入口站|end
점|word|Branch|店|店|end
본점|word|Main branch|總店|总店|end
청|word|Office|廳|厅|end
항|word|Port|港|港|end
`.trim().split('\n');

const DICT = new Map();
for (const line of DICT_LINES) {
  const [key, kind, en = '', hant = '', hans = '', flag = ''] = line.split('|');
  DICT.set(key, { kind, en, hant, hans, end: flag === 'end' });
}

const END_KEYS = [...DICT.entries()].filter(([, entry]) => entry.end).map(([key]) => key).sort((a, b) => b.length - a.length);

function parseSyllable(ch) {
  const code = ch.codePointAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return null;
  return { cho: Math.floor(code / 588), jung: Math.floor(code / 28) % 21, jong: code % 28 };
}

function isNieun(jong) {
  return jong === 4 || jong === 5 || jong === 6;
}

function isRieul(jong) {
  return jong === 8 || jong === 11 || jong === 12 || jong === 13 || jong === 15;
}

export function romanize(text) {
  const chars = [...String(text || '')];
  const parsed = chars.map(parseSyllable);
  let out = '';
  for (let i = 0; i < chars.length; i += 1) {
    const cur = parsed[i];
    if (!cur) {
      out += chars[i];
      continue;
    }
    const next = parsed[i + 1];
    const prev = parsed[i - 1];
    let lead = CHO[cur.cho];
    let tail = JONG[cur.jong];
    const nextIsVowel = Boolean(next && next.cho === IEUNG);
    const nextIsRieul = Boolean(next && next.cho === RIEUL);
    const nextIsNieun = Boolean(next && next.cho === NIEUN);
    if (cur.cho === RIEUL) {
      if (prev && prev.jong === 21) lead = 'n';
      else if (prev && (isNieun(prev.jong) || isRieul(prev.jong))) lead = 'l';
      else lead = 'r';
    }
    if (cur.cho === NIEUN && prev && isRieul(prev.jong)) lead = 'l';
    if (nextIsVowel) {
      if (cur.jong === 1) tail = 'g';
      else if (cur.jong === 7) tail = 'd';
      else if (cur.jong === 17) tail = 'b';
      else if (cur.jong === 19) tail = 's';
      else if (cur.jong === 22) tail = 'j';
      else if (cur.jong === 23) tail = 'ch';
      else if (cur.jong === 8) tail = 'r';
    }
    if (isNieun(cur.jong) && nextIsRieul) tail = 'l';
    if (isRieul(cur.jong) && nextIsNieun) tail = 'l';
    out += lead + JUNG[cur.jung] + tail;
  }
  return out;
}

export function syllableReading(ch, locale) {
  const row = HANJA.get(ch);
  if (!row) return '';
  return locale === 'zh-Hant' ? row.hant : row.hans;
}

function allowsEnd(rest) {
  if (!rest) return true;
  for (const key of END_KEYS) {
    if (rest.startsWith(key) && allowsEnd(rest.slice(key.length))) return true;
  }
  return false;
}

function canTake(token, index, key, entry) {
  if (!entry.end) return true;
  const rest = token.slice(index + key.length);
  if (!allowsEnd(rest)) return false;
  if (index > 0 || rest === '') return true;
  return key === '가' && rest.startsWith('역');
}

function matchAt(token, index) {
  for (let len = token.length - index; len >= 1; len -= 1) {
    const key = token.slice(index, index + len);
    const found = DICT.get(key);
    if (found && canTake(token, index, key, found)) return { found, len };
  }
  return null;
}

function chunkFrom(entry, locale) {
  if (entry.kind === 'drop') return { kind: 'drop', text: '' };
  if (entry.kind === 'near') return { kind: 'near', text: '' };
  const text = locale === 'en' ? entry.en : locale === 'zh-Hant' ? entry.hant : entry.hans;
  return { kind: entry.kind, text };
}

function fallbackChunk(ch, locale) {
  if (locale === 'en' || !HANJA.has(ch)) return { kind: 'stem', text: romanize(ch) };
  return { kind: 'stem', text: syllableReading(ch, locale) };
}

function joinChunks(chunks, locale) {
  if (locale !== 'en') return chunks.filter(chunk => chunk.kind !== 'drop' && chunk.kind !== 'near').map(chunk => chunk.text).join('');
  let out = '';
  let last = '';
  for (const chunk of chunks) {
    if (chunk.kind === 'drop' || chunk.kind === 'near' || !chunk.text) continue;
    if (chunk.kind === 'suffix') {
      out += '-' + chunk.text;
      last = 'suffix';
      continue;
    }
    if (chunk.kind === 'stem') {
      const glue = last === 'stem' && /[A-Za-z]$/.test(out);
      if (!glue && out && !/[\s(-]$/.test(out)) out += ' ';
      const body = chunk.text.charAt(0)[glue ? 'toLowerCase' : 'toUpperCase']() + chunk.text.slice(1);
      out += body;
      last = 'stem';
      continue;
    }
    if (out && !/[\s(-]$/.test(out)) out += ' ';
    out += chunk.text;
    last = 'word';
  }
  return out;
}

function segmentToken(token, locale) {
  const chunks = [];
  let index = 0;
  while (index < token.length) {
    const matched = matchAt(token, index);
    if (!matched) {
      let end = index + 1;
      while (end < token.length && !matchAt(token, end)) end += 1;
      const run = token.slice(index, end);
      if (locale === 'en') chunks.push({ kind: 'stem', text: romanize(run) });
      else for (const ch of run) chunks.push(fallbackChunk(ch, locale));
      index = end;
    } else {
      chunks.push(chunkFrom(matched.found, locale));
      index += matched.len;
    }
  }
  if (chunks.length === 1 && chunks[0].kind === 'near') return { role: 'near', text: '' };
  return { role: 'phrase', text: joinChunks(chunks, locale) };
}

function isHangul(ch) {
  return ch >= '가' && ch <= '힣';
}

function scan(text, locale) {
  const tokens = [];
  let index = 0;
  while (index < text.length) {
    const ch = text[index];
    if (ch === ' ' || ch === '\u00a0') {
      tokens.push({ role: 'space', text: ' ' });
      index += 1;
      continue;
    }
    if (isHangul(ch)) {
      let end = index + 1;
      while (end < text.length && isHangul(text[end])) end += 1;
      tokens.push(segmentToken(text.slice(index, end), locale));
      index = end;
      continue;
    }
    let end = index + 1;
    while (end < text.length && !isHangul(text[end]) && text[end] !== ' ') end += 1;
    tokens.push({ role: 'raw', text: text.slice(index, end) });
    index = end;
  }
  return tokens;
}

function isCjk(ch) {
  return /[\u3400-\u9fff]/.test(ch || '');
}

function render(tokens, locale) {
  const near = tokens.some(token => token.role === 'near');
  let out = '';
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.role === 'near') continue;
    const text = token.text;
    if (locale !== 'en' && token.role === 'space') {
      const left = out.slice(-1);
      const right = (tokens[index + 1] && tokens[index + 1].text || '').charAt(0);
      if (isCjk(left) && isCjk(right)) continue;
    }
    if (locale === 'en' && text && out && !text.startsWith('-') && !/^[,)]/.test(text)) {
      if (/[A-Za-z]$/.test(out) && /^[0-9(.]/.test(text)) out += ' ';
      else if (/[0-9]$/.test(out) && /^[A-Za-z]/.test(text)) out += ' ';
    }
    out += text;
  }
  out = out.replace(/[ ]{2,}/g, ' ').replace(/\s+([,)])/g, '$1').replace(/\(\s+/g, '(').trim();
  if (!near) return out;
  if (!out) return locale === 'en' ? 'Nearby' : '附近';
  if (locale === 'en') return 'Near ' + out;
  return out + '附近';
}

function preprocess(text, locale) {
  const hant = locale === 'zh-Hant';
  const floor = number => (locale === 'en' ? number + 'F' : hant ? number + '樓' : number + '层');
  const basement = number => (locale === 'en' ? 'B' + number : hant ? '地下' + number + '樓' : '地下' + number + '层');
  const unit = number => (locale === 'en' ? 'Unit ' + number : hant ? number + '號' : number + '号');
  const exit = number => (locale === 'en' ? 'Exit ' + number : hant ? number + '號出口' : number + '号出口');
  return text
    .replace(/([가-힣][가-힣\s]*?)에서\s*약\s*(\d+)\s*킬로미터/g, (_, place, number) => {
      const name = render(scan(place.trim(), locale), locale);
      if (locale === 'en') return 'about ' + number + ' km from ' + name;
      return (hant ? '距' : '距') + name + (hant ? '約' : '约') + number + '公里';
    })
    .replace(/B\s*(\d+)\s*층/gi, (_, number) => basement(number))
    .replace(/지하\s*(\d+)\s*층/g, (_, number) => basement(number))
    .replace(/지하\s*(\d+)/g, (_, number) => basement(number))
    .replace(/(\d+)\s*번\s*출구/g, (_, number) => exit(number))
    .replace(/(\d+)\s*층/g, (_, number) => floor(number))
    .replace(/(\d+)\s*호/g, (_, number) => unit(number))
    .replace(/(\d+)\s*개(?![가-힣])/g, (_, number) => (locale === 'en' ? number : hant ? number + '個' : number + '个'))
    .replace(/데이트팝\s*상품/g, 'Datepop items')
    .replace(/지하/g, locale === 'en' ? 'B1' : '地下');
}

export function localizeProper(text, locale = 'ko') {
  const value = String(text || '');
  if (!value || locale === 'ko') return value;
  return render(scan(preprocess(value, locale), locale), locale);
}
