function updateJptvMediaList() {
	// set media list for internal useage
	setJptvMediaList()
	// update telegraph for public serving
	updateJptvTelegraph()
}

function getJptvMediaList() {
	var scriptProperties = PropertiesService.getScriptProperties();
	var data = scriptProperties.getProperty('JPTV_MEDIA_LIST');
	return JSON.parse(data);
}

const JPTV_MESSAGE =
	"欢迎来到乙醚的日剧收藏机器人～ \n" +
	"许愿/安利/交流/资源反馈请通过以下任意渠道：@locoda/@ethersdaily/@yimi_bot \n\n" +
	"完整片单：/jpls@all ⚠️长度警告\n\n" +
	"=========片单=========\n";

const JPTV_MEDIA_LIST = {
	"片单": {
		"日剧/更新中": ["#古见同学有交流障碍症"],
		"日剧/已完结": {
			"-2015": [
				"#龙樱 （2005 夏）",
				"Legal High #胜者即是正义 +SP （2012 春）",
				"Rich Man, Poor Woman #富贵男与贫穷女（2012 夏）",
				"#半泽直树 （2013 夏）",
				"Legal High #胜者即是正义2 +SP （2013 秋）",
				"#失恋巧克力职人 （2014 冬）",
				"Dr.#伦太郎 （2015 春）",
				"#民王 （2015 夏）",
				"#朝5晚9～#帅气和尚爱上我 （2015秋）",
				"#掟上今日子的备忘录 （2015秋）",
			],
			"2016-2017": ["#请与废柴的我谈恋爱 （2016 冬）",
				"#东京女子图鉴 （2016 冬）",
				"#重版出来！ （2016 春）",
				"#宽松世代又如何 （2016 春）",
				"99.9～#刑事专门律师 （2016 春）",
				"#卖房子的女人+SP （2016 夏）",
        "#火花 （2016 夏）",
				"#逃避虽可耻但有用+SP（2016 秋）",
				"Chef～#三星校餐 （2016 秋）",
				"#Byplayers：#如果这6名配角共同生活的话 （2017 冬）",
				"#四重奏 （2017 冬）",],
			"2018-2019": ["#非自然死亡 #Unnatural （2018 冬）",
				"99.9～#刑事专门律师2 （2018 冬）",
				"#Byplayers2：#如果名配角在TV东晨间剧里挑战无人岛生活的话 （2018 冬）",
				"#行骗天下JP （2018 春）",
				"#大叔的爱 （2018 春）",
				"#继母与女儿的蓝调 （2018 夏）",
				"#人生删除事务所 （2018 夏）",
				"#无法成为野兽的我们 （2018 秋）",
				"#我们由奇迹构成 （2018 秋）",
				"#我是大哥大 （2018 秋）",
				"#卖房子的女人2 #卖房子的女人的逆袭 （2019 冬）",
				"我，#到点下班 （2019 春）",
				"#昨日的美食 （2019 春）",
				"#东京独身男子 （2019 春）",
				"#凪的新生活 （2019 夏）",
				"#我的事说来话长 （2019 秋）",
				"#东京大饭店 （2019 秋）",
			],
			"2020-2021": [
				"#将恋爱进行到底 （2020 冬）",
				"#下辈子我再好好过 （2020 冬）",
				"#半泽直树2 （2020 夏）",
				"#灰姑娘药剂师 #默默奉献的灰姑娘 （2020 夏）",
				"17.3 #关于性 （2020 秋）",
				"#到了30岁还是处男，似乎会变成魔法师 + 番外 （2020 秋）",
				"Oh！My Boss！#恋爱随书附赠（衍生：Oh！My #傲娇！#恋爱随书附赠） （2021 冬）",
				"#天国与地狱 （2021 冬）",
				"#Byplayers3：#名配角的森林100日 （2021 冬）",
				"#人生最棒的礼物 SP （2021 冬）",
				"#杏的歌词 SP （2021 冬）",
				"#影响 （2021 春）",
				"#大豆田永久子与三个前夫 （2021 春）",
				"#短剧开始啦 （2021 春）",
				"#龙樱2 （2021 春）",
				"#女子警察的逆袭 （2021 夏）",
				"Dry Flower #七月的房间 （2021 夏）",
				"#家人募集中 （2021 夏）",
				"#下辈子我再好好过2 （2021 夏）",]
		},
		"电影": {
			"-2015": ["#摇摆少女 （2014）",
				"#垫底辣妹 （2015）",],
			"2016-2020": [
				"#溺水小刀 （2016）",
				"#夜以继日 （2018）",
				"#假面饭店 （2019）",
				"#剧场 （2020）",
				"#线 （2020）",
				"#双重预约 + #花絮 （2020）",
				"#你的眼睛在追问 （2020）",
				"#我是大哥大 剧场版 （2020）",
				"#樱 （2020）",
			],
			"2021-": [
				"#偶然与想象 （2021）",
				"#花束般的恋爱 （2021）",
				"#穷途鼠的奶酪梦 （2021）",
				"#Byplayers：#如果100名配角一起拍电影 （2021）"],
		},
	},
};
