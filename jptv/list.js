function updateJptvMediaList() {
	// set media list for internal useage
	setJptvMediaList();
	// update telegraph for public serving
	updateJptvTelegraph();
}

const JPTV_MESSAGE =
	"欢迎来到乙醚的日剧收藏机器人～ \n" +
	"许愿/安利/交流/资源反馈请通过以下任意渠道：@locoda/@ethersdaily/@yimi_bot \n\n" +
	"完整片单：/jpls@all ⚠️长度警告\n\n" +
	"=========片单=========\n";

const JPTV_MEDIA_LIST = {
	片单: {
		"日剧/更新中": [
			{
				name: "我的姐姐",
				firstEp: 677,
				douban: 35561830
			},
			{
				name: "这是恋爱！～不良少年与白手杖女孩～",
				firstEp: 691,
				douban: 35525539,
			},
			{
				name: "消失的初恋",
				firstEp: 695,
				douban: 35563503,
			},
			{
				name: "日本沉没：希望之人",
				firstEp: 697,
				douban: 35230996,
			},
			{
				name: "超富 Super Rich",
				firstEp: 701,
				douban: 35572690,
			},
			{
				name: "最爱",
				firstEp: 702,
				douban: 35528931,
			}
		],
		"日剧/已完结": {
			"-2015": [
				{
					name: "龙樱",
					year: "2005 夏",
					firstEp: 167,
					douban: 1915312
				},
				{
					name: "深夜食堂",
					year: "2009 秋",
					firstEp: 611,
					douban: 3991933
				},
				{
					name: "深夜食堂2",
					year: "2011 秋",
					firstEp: 624,
					douban: 26798437
				},
				{
					name: "Legal High/胜者即是正义 +SP",
					year: "2012 春",
					firstEp: 121,
					douban: 10491666,
				},
				{
					name: "Rich Man, Poor Woman 富贵男与贫穷女/有钱男与贫穷女",
					year: "2012 夏",
					firstEp: 420,
					douban: 10756863,
				},
				{
					name: "半泽直树",
					year: "2013 夏",
					firstEp: 215,
					douban: 24697949
				},
				{
					name: "Legal High/胜者即是正义2 +SP",
					year: "2013 秋",
					firstEp: 169,
					douban: 23997724,
				},
				{
					name: "深夜食堂3",
					year: "2014 秋",
					firstEp: 645,
					douban: 25958786
				},
				{
					name: "失恋巧克力职人",
					year: "2014 冬",
					firstEp: 398,
					douban: 25760591,
				},
				{
					name: "Dr.伦太郎",
					year: "2015 春",
					firstEp: 429,
					douban: 26314383
				},
				{
					name: "民王",
					year: "2015 夏",
					firstEp: 273,
					douban: 26387719
				},
				{
					name: "朝5晚9～帅气和尚爱上我",
					year: "2015秋",
					firstEp: 313,
					douban: 26588970,
				},
				{
					name: "掟上今日子的备忘录",
					year: "2015秋",
					firstEp: 410,
					douban: 26546794,
				},
			],
			"2016-2017": [
				{
					name: "请与废柴的我谈恋爱/请和这个没用的我谈恋爱",
					year: "2016 冬",
					firstEp: 228,
					douban: 26665269,
				},
				{
					name: "东京女子图鉴",
					year: "2016 冬",
					firstEp: 249,
					douban: 26921674,
				},
				{
					name: "重版出来！",
					year: "2016 春",
					firstEp: 123,
					douban: 26602304
				},
				{
					name: "宽松世代又如何",
					year: "2016 春",
					firstEp: 318,
					douban: 26724684,
				},
				{
					name: "99.9～刑事专门律师",
					year: "2016 春",
					firstEp: 397,
					douban: 26725184,
				},
				{
					name: "卖房子的女人+SP",
					year: "2016 夏",
					firstEp: 364,
					douban: 26720117,
				},
				{
					name: "火花",
					year: "2016 夏",
					firstEp: 599,
					douban: 26635329
				},
				{
					name: "校对女孩河野悦子",
					year: "2016 秋",
					firstEp: 166,
					douban: 26853460,
				},
				{
					name: "逃避虽可耻但有用+SP",
					year: "2016 秋",
					firstEp: 85,
					douban: 26816519,
				},
				{
					name: "Chef～三星校餐/三星营养午餐",
					year: "2016 秋",
					firstEp: 314,
					douban: 26860079,
				},
				{
					name: "深夜食堂：东京故事",
					year: "2016 秋",
					firstEp: 660,
					douban: 26798436,
				},
				{
					name: "Byplayers：如果这6名配角共同生活的话",
					year: "2017 冬",
					firstEp: 524,
					douban: 26924729,
				},
				{
					name: "四重奏",
					year: "2017 冬",
					firstEp: 134,
					douban: 26895171
				},
			],
			"2018-2019": [
				{
					name: "非自然死亡/Unnatural",
					year: "2018 冬",
					firstEp: 99,
					douban: 27140017,
				},
				{
					name: "99.9～刑事专门律师2",
					year: "2018 冬",
					firstEp: 455,
					douban: 27065652,
				},
				{
					name: "Byplayers2：如果名配角在TV东晨间剧里挑战无人岛生活的话",
					year: "2018 冬",
					firstEp: 555,
					douban: 27621185,
				},
				{
					name: "行骗天下JP",
					year: "2018 春",
					firstEp: 272,
					douban: 27605548
				},
				{
					name: "大叔的爱",
					year: "2018 春",
					firstEp: 362,
					douban: 30156023
				},
				{
					name: "继母与女儿的蓝调",
					year: "2018 夏",
					firstEp: 271,
					douban: 30210204,
				},
				{
					name: "人生删除事务所",
					year: "2018 夏",
					firstEp: 531,
					douban: 30232260,
				},
				{
					name: "无法成为野兽的我们",
					year: "2018 秋",
					firstEp: 270,
					douban: 30290917,
				},
				{
					name: "我们由奇迹构成",
					year: "2018 秋",
					firstEp: 369,
					douban: 30291583,
				},
				{
					name: "我是大哥大",
					year: "2018 秋",
					firstEp: 319,
					douban: 30183785
				},
				{
					name: "卖房子的女人2/卖房子的女人的逆袭",
					year: "2019 冬",
					firstEp: 468,
					douban: 30335636,
				},
				{
					name: "我，到点下班",
					year: "2019 春",
					firstEp: 295,
					douban: 30442376,
				},
				{
					name: "昨日的美食",
					year: "2019 春",
					firstEp: 490,
					douban: 30442369
				},
				{
					name: "东京独身男子",
					year: "2019 春",
					firstEp: 361,
					douban: 30463672,
				},
				{
					name: "坂道上的家",
					year: "2019 春",
					firstEp: 629,
					douban: 30390532
				},
				{
					name: "凪的新生活/风平浪静的闲暇",
					year: "2019 夏",
					firstEp: 493,
					douban: 33418567,
				},
				{
					name: "我的事说来话长",
					year: "2019 秋",
					firstEp: 38,
					douban: 34670642,
				},
				{
					name: "东京大饭店",
					year: "2019 秋",
					firstEp: 124,
					douban: 33464695
				},
				{
					name: "深夜食堂：东京故事2",
					year: "2019 秋",
					firstEp: 670,
					douban: 33418410,
				},
			],
			"2020-2021": [
				{
					name: "将恋爱进行到底/恋无止境 ",
					year: "2020 冬",
					firstEp: 17,
					douban: 34805659,
				},
				{
					name: "下辈子我再好好过",
					year: "2020 冬",
					firstEp: 530,
					douban: 34906701,
				},
				{
					name: "半泽直树2",
					year: "2020 夏",
					firstEp: 225,
					douban: 25806638
				},
				{
					name: "灰姑娘药剂师/默默奉献的灰姑娘",
					year: "2020 夏",
					firstEp: 344,
					douban: 34948447,
				},
				{
					name: "17.3 关于性",
					year: "2020 秋",
					firstEp: 491,
					douban: 35202302,
				},
				{
					name: "到了30岁还是处男，似乎会变成魔法师 + 番外",
					year: "2020 秋",
					firstEp: 545,
					douban: 35201416,
				},
				{
					name: "Oh！My Boss！恋爱随书附赠（衍生：Oh！My 傲娇！恋爱随书附赠）",
					year: "2021 冬",
					firstEp: 053,
					douban: 35265280,
				},
				{
					name: "天国与地狱",
					year: "2021 冬",
					firstEp: 76,
					douban: 35243063
				},
				{
					name: "我家的故事",
					year: "2021 冬",
					firstEp: 630,
					douban: 35202738
				},
				{
					name: "Byplayers3：名配角的森林100日",
					year: "2021 冬",
					firstEp: 576,
					douban: 35267748,
				},
				{
					name: "人生最棒的礼物 SP",
					year: "2021 冬",
					firstEp: 71,
					douban: 35259429,
				},
				{
					name: "杏的歌词/杏的Lyric SP",
					year: "2021 冬",
					firstEp: 77,
					douban: 35248729,
				},
				{
					name: "影响",
					year: "2021 春",
					firstEp: 27,
					douban: 35280738
				},
				{
					name: "大豆田永久子与三个前夫",
					year: "2021 春",
					firstEp: 29,
					douban: 35365608,
				},
				{
					name: "短剧开始啦",
					year: "2021 春",
					firstEp: 42,
					douban: 35358556
				},
				{
					name: "龙樱2",
					year: "2021 春",
					firstEp: 201,
					douban: 34906700
				},
				{
					name: "女子警察的逆袭",
					year: "2021 夏",
					firstEp: 4,
					douban: 35447242,
				},
				{
					name: "Dry Flower 七月的房间",
					year: "2021 夏",
					firstEp: 86,
					douban: 35566871,
				},
				{
					name: "家人募集中/#家族募集",
					year: "2021 夏",
					firstEp: 448,
					douban: 35467570,
				},
				{
					name: "下辈子我再好好过2",
					year: "2021 夏",
					firstEp: 582,
					douban: 35417716,
				},
				{
					name: "奥利佛是狗 (天哪!!)这家伙/奥莉佛是狗，（天哪！！）这家伙",
					year: "2021 夏",
					firstEp: 687,
					douban: 35497515,
				},
        {
				name: "古见同学有交流障碍症",
        year: "2021 秋",
				firstEp: 251,
				douban: 35558762
			},
			],
		},
		电影: {
			"-2015": [
				{
					name: "摇摆少女",
					year: "2004",
					firstEp: 465,
					douban: 1361254
				},
				{
					name: "盗钥匙的方法",
					year: "2012",
					firstEp: 623,
					douban: 6880497
				},
				{
					name: "小森林 夏秋篇",
					year: "2014",
					firstEp: 615,
					douban: 25814705
				},
				{
					name: "垫底辣妹",
					year: "2015",
					firstEp: 181,
					douban: 26259677
				},
				{
					name: "小森林 冬春篇",
					year: "2015",
					firstEp: 617,
					douban: 25814707
				},
			],
			"2016-2020": [
				{
					name: "溺水小刀",
					year: "2016",
					firstEp: 127,
					douban: 26611076
				},
				{
					name: "假如猫从世界上消失了",
					year: "2016",
					firstEp: 610,
					douban: 25984803,
				},
				{
					name: "火花",
					year: "2017",
					firstEp: 609,
					douban: 26974725
				},
				{
					name: "夜以继日",
					year: "2018",
					firstEp: 212,
					douban: 27037053
				},
				{
					name: "小偷家族",
					year: "2019",
					firstEp: 672,
					douban: 27622447
				},
				{
					name: "假面饭店",
					year: "2019",
					firstEp: 453,
					douban: 27126336
				},
				{
					name: "剧场",
					year: "2020",
					firstEp: 79,
					douban: 33446524
				},
				{
					name: "线",
					year: "2020",
					firstEp: 119,
					douban: 34281687
				},
				{
					name: "双重预约 + 花絮",
					year: "2020",
					firstEp: 170,
					douban: 35131310,
				},
				{
					name: "你的眼睛在追问",
					year: "2020",
					firstEp: 451,
					douban: 34848458,
				},
				{
					name: "我是大哥大 剧场版",
					year: "2020",
					firstEp: 449,
					douban: 30183785,
				},
				{
					name: "樱",
					year: "2020",
					firstEp: 460,
					douban: 33392891,
				},
				{
					name: "阿尔卑斯看台的外缘",
					year: "2020",
					firstEp: 690,
					douban: 34460999,
				},
				{
					name: "美好的世界",
					year: "2020",
					firstEp: 699,
					douban: 34863472,
				},
        {
					name: "把我关起来",
					year: "2020",
					firstEp: 711,
					douban: 34967154,
				},
			],
			"2021-": [
				{
					name: "偶然与想象",
					year: "2021",
					firstEp: 117,
					douban: 35360296,
				},
				{
					name: "花束般的恋爱",
					year: "2021",
					firstEp: 120,
					douban: 34874432,
				},
				{
					name: "穷途鼠的奶酪梦",
					year: "2021",
					firstEp: 211,
					douban: 30443686,
				},
				{
					name: "Byplayers：如果100名配角一起拍电影",
					year: "2021",
					firstEp: 532,
					douban: 35267737,
				},
        {
					name: "驾驶我的车",
					year: "2021",
					firstEp: 710,
					douban: 35235502,
				},
			],
		},
	},
};
