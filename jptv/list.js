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
			{ name: "古见同学有交流障碍症", firstEp: 251 },
			{ name: "我的姐姐", firstEp: 677 },
			{ name: "狮子之家的点心日", firstEp: 683 },
			{ name: "桃与梅", firstEp: 684 },
		],
		"日剧/已完结": {
			"-2015": [
				{ name: "龙樱", year: "2005 夏", firstEp: 167 },
				{ name: "深夜食堂", year: "2009 秋", firstEp: 611 },
				{ name: "深夜食堂2", year: "2011 秋", firstEp: 624 },
				{ name: "Legal High 胜者即是正义 +SP", year: "2012 春", firstEp: 121 },
				{ name: "Rich Man, Poor Woman 富贵男与贫穷女", year: "2012 夏", firstEp: 420 },
				{ name: "半泽直树", year: "2013 夏", firstEp: 215 },
				{ name: "Legal High 胜者即是正义2 +SP", year: "2013 秋", firstEp: 169 },
				{ name: "深夜食堂3", year: "2014 秋", firstEp: 645 },
				{ name: "失恋巧克力职人", year: "2014 冬", firstEp: 398 },
				{ name: "Dr.伦太郎", year: "2015 春", firstEp: 429 },
				{ name: "民王", year: "2015 夏", firstEp: 273 },
				{ name: "朝5晚9～帅气和尚爱上我", year: "2015秋", firstEp: 313 },
				{ name: "掟上今日子的备忘录", year: "2015秋", firstEp: 410 },
			],
			"2016-2017": [
				{ name: "请与废柴的我谈恋爱", year: "2016 冬", firstEp: 228 },
				{ name: "东京女子图鉴", year: "2016 冬", firstEp: 249 },
				{ name: "重版出来！", year: "2016 春", firstEp: 123 },
				{ name: "宽松世代又如何", year: "2016 春", firstEp: 318 },
				{ name: "99.9～刑事专门律师", year: "2016 春", firstEp: 397 },
				{ name: "卖房子的女人+SP", year: "2016 夏", firstEp: 364 },
				{ name: "火花", year: "2016 夏", firstEp: 599 },
				{ name: "校对女孩河野悦子", year: "2016 秋", firstEp: 166 },
				{ name: "逃避虽可耻但有用+SP", year: "2016 秋", firstEp: 85 },
				{ name: "Chef～三星校餐", year: "2016 秋", firstEp: 314 },
				{ name: "深夜食堂：东京故事", year: "2016 秋", firstEp: 660 },
				{ name: "Byplayers：如果这6名配角共同生活的话", year: "2017 冬", firstEp: 524 },
				{ name: "四重奏", year: "2017 冬", firstEp: 134 },
			],
			"2018-2019": [
				{ name: "非自然死亡 Unnatural", year: "2018 冬", firstEp: 99 },
				{ name: "99.9～刑事专门律师2", year: "2018 冬", firstEp: 455 },
				{
					name: "Byplayers2：如果名配角在TV东晨间剧里挑战无人岛生活的话",
					year: "2018 冬",
					firstEp: 555
				},
				{ name: "行骗天下JP", year: "2018 春", firstEp: 272 },
				{ name: "大叔的爱", year: "2018 春", firstEp: 362 },
				{ name: "继母与女儿的蓝调", year: "2018 夏", firstEp: 271 },
				{ name: "人生删除事务所", year: "2018 夏", firstEp: 531 },
				{ name: "无法成为野兽的我们", year: "2018 秋", firstEp: 270 },
				{ name: "我们由奇迹构成", year: "2018 秋", firstEp: 369 },
				{ name: "我是大哥大", year: "2018 秋", firstEp: 319 },
				{ name: "卖房子的女人2/卖房子的女人的逆袭", year: "2019 冬", firstEp: 468 },
				{ name: "我，到点下班", year: "2019 春", firstEp: 295 },
				{ name: "昨日的美食", year: "2019 春", firstEp: 490 },
				{ name: "东京独身男子", year: "2019 春", firstEp: 361 },
				{ name: "坂道上的家", year: "2019 春", firstEp: 629 },
				{ name: "凪的新生活", year: "2019 夏", firstEp: 493 },
				{ name: "我的事说来话长", year: "2019 秋", firstEp: 38 },
				{ name: "东京大饭店", year: "2019 秋", firstEp: 124 },
				{ name: "深夜食堂：东京故事2", year: "2019 秋", firstEp: 670 },
			],
			"2020-2021": [
				{ name: "将恋爱进行到底", year: "2020 冬", firstEp: 17 },
				{ name: "下辈子我再好好过", year: "2020 冬", firstEp: 530 },
				{ name: "半泽直树2", year: "2020 夏", firstEp: 225 },
				{ name: "灰姑娘药剂师/默默奉献的灰姑娘", year: "2020 夏", firstEp: 344 },
				{ name: "17.3 关于性", year: "2020 秋", firstEp: 491 },
				{ name: "到了30岁还是处男，似乎会变成魔法师 + 番外", year: "2020 秋", firstEp: 545 },
				{
					name: "Oh！My Boss！恋爱随书附赠（衍生：Oh！My 傲娇！恋爱随书附赠）",
					year: "2021 冬",
					firstEp: 053
				},
				{ name: "天国与地狱", year: "2021 冬", firstEp: 76 },
				{ name: "我家的故事", year: "2021 冬", firstEp: 630 },
				{ name: "Byplayers3：名配角的森林100日", year: "2021 冬", firstEp: 576 },
				{ name: "人生最棒的礼物 SP", year: "2021 冬", firstEp: 71 },
				{ name: "杏的歌词 SP", year: "2021 冬", firstEp: 77 },
				{ name: "影响", year: "2021 春", firstEp: 27 },
				{ name: "大豆田永久子与三个前夫", year: "2021 春", firstEp: 29 },
				{ name: "短剧开始啦", year: "2021 春", firstEp: 42 },
				{ name: "龙樱2", year: "2021 春", firstEp: 201 },
				{ name: "女子警察的逆袭", year: "2021 夏", firstEp: 4 },
				{ name: "Dry Flower 七月的房间", year: "2021 夏", firstEp: 86 },
				{ name: "家人募集中", year: "2021 夏", firstEp: 448 },
				{ name: "下辈子我再好好过2", year: "2021 夏", firstEp: 582 },
				{ name: "奥利佛是狗 (天哪!!)这家伙", year: "2021 夏", firstEp: 687 }
			],
		},
		电影: {
			"-2015": [
				{ name: "盗钥匙的方法", year: "2012", firstEp: 623 },
				{ name: "摇摆少女", year: "2014", firstEp: 465 },
				{ name: "小森林 夏秋篇", year: "2014", firstEp: 615 },
				{ name: "垫底辣妹", year: "2015", firstEp: 181 },
				{ name: "小森林 冬春篇", year: "2015", firstEp: 617 },
			],
			"2016-2020": [
				{ name: "溺水小刀", year: "2016", firstEp: 127 },
				{ name: "假如猫从世界上消失了", year: "2016", firstEp: 610 },
				{ name: "火花", year: "2017", firstEp: 609 },
				{ name: "夜以继日", year: "2018", firstEp: 212 },
				{ name: "小偷家族", year: "2019", firstEp: 672 },
				{ name: "假面饭店", year: "2019", firstEp: 453 },
				{ name: "剧场", year: "2020", firstEp: 79 },
				{ name: "线", year: "2020", firstEp: 119 },
				{ name: "双重预约 + 花絮", year: "2020", firstEp: 170 },
				{ name: "你的眼睛在追问", year: "2020", firstEp: 451 },
				{ name: "我是大哥大 剧场版", year: "2020", firstEp: 449 },
				{ name: "樱", year: "2020", firstEp: 460 },
			],
			"2021-": [
				{ name: "偶然与想象", year: "2021", firstEp: 117 },
				{ name: "花束般的恋爱", year: "2021", firstEp: 120 },
				{ name: "穷途鼠的奶酪梦", year: "2021", firstEp: 211 },
				{ name: "Byplayers：如果100名配角一起拍电影", year: "2021", firstEp: 532 },
			],
		},
	},
};
