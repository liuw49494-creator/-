const embeddedCraftAssets = window.EmbeddedCraftAssets || {};
const embeddedCourtyardAssets = window.EmbeddedCourtyardAssets || {};
const embeddedBookAssets = window.EmbeddedBookAssets || {};
const embeddedTreeAssets = window.EmbeddedTreeAssets || {};

window.FigmaMuseumData = {
  initialRoute: "/",
  appPoints: 240,
  signedToday: false,
  signStreak: 3,
  profilePoints: 840,
  passportProgress: 3,
  userName: "沙漠旅行者",
  userId: "LBR-20260327-001",
  treeCode: "LUOBU-86429",
  treeGrowth: 340,
  exploreHeaderIcon: "assets/explore/explore-header-icon.svg",
  explorePointsIcon: "assets/explore/explore-points-icon.svg",
  tabBarIcons: {
    home: "assets/explore/tab-home.svg",
    map: "assets/explore/tab-map.svg",
    explore: "assets/explore/tab-explore.svg",
    me: "assets/explore/tab-me.svg"
  },
  staticPages: {
    home: {
      title: "首页",
      image: "assets/static-pages/home.png",
      activeTab: "home"
    },
    map: {
      title: "地图",
      image: "assets/static-pages/map.png",
      activeTab: "map"
    },
    profile: {
      title: "我的",
      image: "assets/static-pages/profile.png",
      activeTab: "me"
    }
  },
  exploreCards: [
    {
      id: "museum",
      hall: "罗布人村寨",
      title: "沉浸式文化博物馆",
      tag: "7个小院",
      points: "+20 积分",
      progressLabel: "已完成 2/7 院落",
      progress: 28,
      progressColor: "#81ff86",
      image: "assets/explore/museum-card.jpg"
    },
    {
      id: "craft",
      hall: "技艺传承",
      title: "技艺体验 · 修炼之路",
      tag: "手工",
      points: "+150 积分",
      progressLabel: "卡盆捕鱼 进行中 2/5 步",
      progress: 40,
      progressColor: "#81ff86",
      image: "assets/explore/craft-card.jpg"
    }
  ],
  miniCards: [
    {
      id: "book",
      title: "答案之书",
      desc: "今日已问 · +10 积分",
      image: "assets/explore/book-card.jpg"
    },
    {
      id: "tree",
      title: "认领胡杨树",
      desc: "幼苗 · 成长值 340",
      image: "assets/explore/tree-card.jpg"
    },
    {
      id: "coming-ar",
      title: "AR时空导航",
      desc: "敬请期待",
      image: "assets/explore/coming-ar-card.jpg",
      dimmed: true
    },
    {
      id: "coming-story",
      title: "非遗传承叙事",
      desc: "敬请期待",
      image: "assets/explore/coming-story-card.jpg",
      dimmed: true
    }
  ],
  museum: {
    hero: "assets/museum/hero.jpg",
    heroOverlay: "assets/museum/hero-overlay.jpg",
    courtyardImage: "assets/museum/courtyard-card.png",
    exhibitionImage: "assets/museum/exhibition-card.png",
    elderImage: "assets/museum/elder-avatar.jpg",
    icons: {
      courtyard: "assets/museum/icon-courtyard.svg",
      exhibition: "assets/museum/icon-exhibition.svg",
      ai: "assets/museum/icon-ai.svg",
      passport: "assets/museum/icon-passport.svg",
      badgeDone: "assets/museum/icon-badge-done.svg",
      badgeTodo: "assets/museum/icon-badge-todo.svg"
    },
    badges: [
      { label: "渔猎院", done: true },
      { label: "百岁泉", done: true },
      { label: "织锦院", done: true },
      { label: "胡杨院", done: false },
      { label: "沙舟院", done: false },
      { label: "烽火台", done: false },
      { label: "星空院", done: false }
    ]
  },
  courtyardUi: {
    progressIcon: embeddedCourtyardAssets.progressIcon || "https://www.figma.com/api/mcp/asset/434e2646-c8b4-4792-9a8c-b63671cb86af",
    doneIcon: embeddedCourtyardAssets.doneIcon || "https://www.figma.com/api/mcp/asset/9a55e949-85d5-4a76-847f-9c23f50e56a0",
    arrowIcon: embeddedCourtyardAssets.arrowIcon || "https://www.figma.com/api/mcp/asset/4d6ad1d0-c4aa-4d2a-8b4b-1da68d62e1b6",
    passportIcon: embeddedCourtyardAssets.passportIcon || "https://www.figma.com/api/mcp/asset/3d30cb5e-da70-43eb-8784-aea66cd57244"
  },
  courtyards: [
    {
      id: 1,
      name: "哈迪尔院",
      theme: "渔猎记忆",
      desc: "展示罗布人传统卡盆捕鱼、红柳弓箭等渔猎技艺",
      color: "#0F6E56",
      checked: true,
      image: embeddedCourtyardAssets.hadiir || "https://www.figma.com/api/mcp/asset/b398cef3-a2e4-4a20-a116-dfb225931b41"
    },
    {
      id: 2,
      name: "玉米提院",
      theme: "胡杨木雕非遗",
      desc: "千年胡杨木化为精美木雕，国家级非遗传承技艺",
      color: "#854F0B",
      checked: true,
      image: embeddedCourtyardAssets.yumiti || "https://www.figma.com/api/mcp/asset/5b382895-14c8-43a8-b001-53491519b4ba"
    },
    {
      id: 3,
      name: "阿依慕院",
      theme: "歌舞与民歌",
      desc: "聆听罗布人千年传唱的民歌，感受沙漠中的诗意",
      color: "#534AB7",
      checked: true,
      image: embeddedCourtyardAssets.ayimu || "https://www.figma.com/api/mcp/asset/3c38041c-dcab-48ca-991d-43f5064e5baa"
    },
    {
      id: 4,
      name: "帕拉孜小屋",
      theme: "帕拉孜织造",
      desc: "3800年传承的帕拉孜织造技艺，国家级非遗瑰宝",
      color: "#993C1D",
      checked: false,
      image: embeddedCourtyardAssets.pala || "https://www.figma.com/api/mcp/asset/9b5d994d-ace1-498c-a95b-e8bb5f8a7d1c",
      route: "/courtyard-pala"
    },
    {
      id: 5,
      name: "阿曼尼院",
      theme: "特色膳食",
      desc: "烤鱼、烤馕、罗布麻茶，品味沙漠深处的味觉记忆",
      color: "#3B6D11",
      checked: false,
      image: embeddedCourtyardAssets.amanni || "https://www.figma.com/api/mcp/asset/4473101a-bd8a-458f-9e5e-b84667d3a162"
    },
    {
      id: 6,
      name: "罗布人婚房",
      theme: "婚俗文化",
      desc: "探秘罗布人独特的婚礼仪式与婚房陈设文化",
      color: "#7C3B8F",
      checked: false,
      image: embeddedCourtyardAssets.wedding || "https://www.figma.com/api/mcp/asset/e3ee67c5-f404-4c99-aac7-b6b9b63cfe8c"
    },
    {
      id: 7,
      name: "阿娜尔院",
      theme: "胡杨智慧",
      desc: "千年胡杨林的生存智慧，与罗布人生命哲学的交融",
      color: "#B85C2B",
      checked: false,
      image: embeddedCourtyardAssets.anar || "https://www.figma.com/api/mcp/asset/2b564df7-c8c5-42cc-8ff9-47dab1f95a38"
    }
  ],
  palaHouse: {
    heroImage: "assets/pala-house/hero.png",
    eyebrow: "七小院导览 · 第四院",
    title: "帕拉孜小屋",
    subtitle: "沿着经纬与纹样，走进罗布人延续 3800 年的织造记忆。",
    stats: [
      { label: "历史口径", value: "3800年" },
      { label: "非遗身份", value: "古楼兰织造" },
      { label: "建议停留", value: "5 分钟" }
    ],
    homeMoments: [
      { title: "看房屋", desc: "胡杨木、土墙与织机搭起一间有温度的工坊。" },
      { title: "认纹样", desc: "菱形、折线与边饰把守护与丰收织进日常。" },
      { title: "听故事", desc: "从丝路往来，到今天仍在延续的家庭手艺。" }
    ],
    guideTitle: "帕拉孜与丝绸之路",
    guideText: [
      "这里珍藏着一项珍贵的非物质文化遗产帕拉孜织造技艺。这种用彩色羊毛线编织的手工织物，图案精美绝伦。考古发现三千多年前这种织物已经出现，如今帕拉孜制作方式仍保持着最原始的手工技艺。",
      "帕拉孜的起源与古丝绸之路密不可分。罗布泊地区出土的楼兰文明墓葬中，已存在类似帕拉孜的平纹毛织物，其工艺特征与中亚西亚古代毛纺织技术有明显关联。",
      "作为丝绸之路上东西方物质文化交流的见证，帕拉孜既保留了中国西北地区粗犷质朴的审美特质，又吸收了几何纹与植物纹的装饰语言。",
      "对罗布人而言，帕拉孜不是一块静止的织物，而是一种把海子、芦苇、胡杨与村寨生活都织进经纬里的日常语言。"
    ],
    detailDescription: "帕拉孜是一种用彩色羊毛线编织的手工织物，图案多为几何纹样组合体，源自古楼兰技艺，是新疆传统工艺的代表，被誉为纺织技术的“活化石”。",
    detailSlides: [
      {
        name: "守护菱纹",
        short: "菱纹",
        caption: "菱形与折线交替出现，寓意守护、丰收与家园安稳。",
        image: "assets/pala-house/detail-1.png"
      },
      {
        name: "大地色阶",
        short: "色彩",
        caption: "沙黄、赭红、湖蓝与草木灰，构成罗布生活最熟悉的色谱。",
        image: "assets/pala-house/detail-2.png"
      },
      {
        name: "经纬成面",
        short: "经纬",
        caption: "腰机上的经线与纬线反复交织，让纹样一层层生长出来。",
        image: "assets/pala-house/detail-3.png"
      },
      {
        name: "生活陈设",
        short: "陈设",
        caption: "从帐幔、坐席到婚嫁礼物，帕拉孜始终在陪伴日常生活。",
        image: "assets/pala-house/detail-4.png"
      }
    ],
    voiceDuration: 112
  },
  exhibits: [
    {
      id: 1,
      name: "卡盆",
      level: "巴州级非遗",
      desc: "不钉不铆，千年独木舟",
      color: "#0F6E56",
      image: "https://images.unsplash.com/photo-1595599016996-4b9d1f412f87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjYW5vZSUyMGJvYXQlMjBoYW5kbWFkZXxlbnwxfHx8fDE3NzQ5NjM1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 2,
      name: "红柳渔叉",
      level: "传统器具",
      desc: "凭气味撒网，凭经验刺鱼",
      color: "#854F0B",
      image: "https://images.unsplash.com/photo-1647601317118-c29dc70032e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwc3BlYXIlMjB0cmFkaXRpb25hbCUyMHRvb2x8ZW58MXx8fHwxNzc0OTYzNTY0fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 3,
      name: "罗布麻渔网",
      level: "传统技艺",
      desc: "比钢丝耐腐，沙漠中的尼龙",
      color: "#3B6D11",
      image: "https://images.unsplash.com/photo-1767686938964-291bad4118a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGZpc2hpbmclMjBuZXQlMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NzQ5NjM1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 4,
      name: "鱼篓",
      level: "传统器具",
      desc: "口小肚大，入鱼难出",
      color: "#993C1D",
      image: "https://images.unsplash.com/photo-1757584736924-91a384d86fb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3ZlbiUyMGZpc2glMjB0cmFwJTIwYmFza2V0fGVufDF8fHx8MTc3NDk2MzU2NXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 5,
      name: "帕拉孜",
      level: "国家级非遗",
      desc: "3800年纹样传承",
      color: "#534AB7",
      image: "https://images.unsplash.com/photo-1634757440938-a671a5924363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwY2FycGV0JTIwcnVnJTIwdGV4dGlsZSUyMHBhdHRlcm58ZW58MXx8fHwxNzc0OTYzNTY2fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 6,
      name: "罗布麻织物",
      level: "巴州级非遗",
      desc: "沙漠透气面料，天然空调",
      color: "#0F6E56",
      image: "https://images.unsplash.com/photo-1601241773118-9e67091e199e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZW1wJTIwZmliZXIlMjBjbG90aCUyMGZhYnJpY3xlbnwxfHx8fDE3NzQ5NjM1NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 7,
      name: "服饰",
      level: "传统文化",
      desc: "鱼皮做防水靴，芦苇编草帽",
      color: "#854F0B",
      image: "https://images.unsplash.com/photo-1767328706064-370df7da5f28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhldGhuaWMlMjB0cmFkaXRpb25hbCUyMGNvc3R1bWUlMjBjbG90aGluZ3xlbnwxfHx8fDE3NzQ5NjM1NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 8,
      name: "胡杨木器",
      level: "巴州级非遗",
      desc: "一棵树，一辈子的器物",
      color: "#3B6D11",
      image: "https://images.unsplash.com/photo-1703738352792-951af9706296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3BsYXIlMjB0cmVlJTIwd29vZCUyMHNjdWxwdHVyZXxlbnwxfHx8fDE3NzQ5NjM1NzB8MA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ],
  craftTracks: [
    {
      id: "kapen",
      name: "卡盆捕鱼",
      cert: "卡盆渔手",
      hook: "凭气味判断撒网时机",
      progress: 2,
      total: 5,
      status: "active",
      accent: "#D4A96A",
      points: 100,
      icon: "🛶",
      image: embeddedCraftAssets.kapen || "https://www.figma.com/api/mcp/asset/9fc9eb00-7d7d-4702-b768-bc1d77342fb4"
    },
    {
      id: "bow",
      name: "红柳弓箭制作",
      cert: "红柳猎手",
      hook: "选弓材要听树的声音",
      progress: 0,
      total: 5,
      status: "locked",
      accent: "#C75B39",
      points: 0,
      icon: "🏹",
      image: embeddedCraftAssets.bow || "https://www.figma.com/api/mcp/asset/afc992d2-be04-41b7-aa41-7ec1bba48f4d"
    },
    {
      id: "fish",
      name: "烤鱼技法",
      cert: "烤鱼传人",
      hook: "罗布烤鱼不用任何调料",
      progress: 0,
      total: 5,
      status: "locked",
      accent: "#8B6914",
      points: 0,
      icon: "🐟",
      image: embeddedCraftAssets.fish || "https://www.figma.com/api/mcp/asset/55597c5c-ed7f-440e-83e0-6cb6823b2e19"
    }
  ],
  craftHome: {
    heroImage: embeddedCraftAssets.hero || "https://www.figma.com/api/mcp/asset/b13590f5-827c-46e2-95e5-2542934ce686",
    kicker: "罗布秘境",
    title: "技艺修炼之路",
    subtitle: "成为罗布匠人 · 解锁非遗认证",
    certificateLabel: "我的技艺证书"
  },
  craftJourney: {
    title: "卡盆捕鱼",
    subtitle: "成为「卡盆渔手」· 修炼之路",
    emoji: "🛶",
    heroImage: "https://www.figma.com/api/mcp/asset/510b3ead-960e-4421-9662-b16db52cf9a2",
    progress: {
      current: 2,
      total: 5
    },
    steps: [
      {
        id: "stage-1",
        title: "阶段1：了解背景",
        sub: "缘起 · 反常识钩子",
        desc: "了解卡盆捕鱼的千年渊源，观看非遗视频",
        reward: "+20 积分",
        status: "done",
        statusLabel: "已完成",
        nodeType: "done",
        ctaLabel: "回顾",
        ctaRoute: "/craft-story"
      },
      {
        id: "stage-2",
        title: "阶段2：分步学习",
        sub: "拆解 · 四步修炼",
        desc: "逐步学习卡盆制作与捕鱼技艺的核心知识",
        reward: "+80 积分",
        status: "done",
        statusLabel: "已完成",
        nodeType: "done",
        ctaLabel: "回顾",
        ctaAction: "craft-stage2-soon"
      },
      {
        id: "stage-3",
        title: "阶段3：实践挑战",
        sub: "试炼 · 终极考核",
        desc: "综合答题挑战，≥60% 正确率通关",
        reward: "+50 积分",
        status: "active",
        statusLabel: "可挑战",
        nodeType: "challenge",
        ctaLabel: "进入",
        ctaAction: "craft-challenge-soon",
        highlight: true
      },
      {
        id: "stage-4",
        title: "阶段4：获得认证",
        sub: "双档 · 数字+实体",
        desc: "通关挑战后解锁数字认证与线下传承人认证",
        reward: "卡盆渔手",
        status: "locked",
        statusLabel: "未解锁",
        nodeType: "locked-medal"
      },
      {
        id: "stage-5",
        title: "阶段5：传承人考核",
        sub: "终极 · 线下评审",
        desc: "预约线下传承人评审，获取专属实体认证",
        reward: "实体认证卡",
        status: "locked",
        statusLabel: "未解锁",
        nodeType: "locked-crown"
      }
    ]
  },
  craftStory: {
    title: "卡盆捕鱼 · 缘起",
    stageLabel: "阶段 1 / 5",
    hookLabel: "反常识钩子",
    hookTitle: "凭气味判断撒网时机！",
    hookDesc:
      "罗布人不用鱼竿、不用鱼饵，靠一叶独木舟在塔里木河中穿行。他们能从水的气味中判断鱼群位置——这种技艺已传承千年。",
    videoImage: "https://www.figma.com/api/mcp/asset/1e8f662e-d84a-4fe5-af40-8aa04c996193",
    videoDuration: "观看非遗短片 · 约45秒",
    unlockRule: "观看 ≥80% 解锁下一阶段",
    reward: "+20 积分",
    progress: 82,
    stories: [
      {
        title: "千年独木舟",
        desc: "卡盆是罗布人用整棵胡杨树干掏凿而成的独木舟，不用一颗钉子，不上一滴胶水，却能在水中使用数十年。"
      },
      {
        title: "水上的罗布人",
        desc: "罗布人是中国最后的渔猎民族之一。他们世代生活在塔里木河畔，以捕鱼为生，被称为「水上的游牧民」。"
      },
      {
        title: "消失的技艺",
        desc: "随着塔里木河断流，这种千年渔猎技艺面临失传。目前掌握完整卡盆制作技艺的传承人不足10人。"
      }
    ]
  },
  bookExperience: {
    home: {
      title: "每日一问 · 答案之书",
      subtitle: "聆听罗布长寿老人的智慧耳语",
      kicker: "罗布秘境",
      coverImage: embeddedBookAssets.cover || "https://www.figma.com/api/mcp/asset/f63f8bfe-e7d7-48a5-9ea3-e2bdfa67b713",
      hint: "长按书本，唤醒老人的智慧",
      collectionCount: 4,
      collectionTotal: 12,
      collectionTitle: "答案之书收集",
      collectionCta: "查看我的藏书阁"
    },
    ask: {
      title: "每日一问",
      elderName: "罗布长寿老人",
      prompt: "孩子，你今日有何困惑？",
      subtitle: "将你的困惑写下，老人会从千年智慧中为你指引",
      placeholder: "你今天想问什么？（20字以内）",
      footerHint: "长寿老人说：不忧不愁，便是答案"
    },
    collection: {
      title: "答案之书 · 碎片收集",
      unlockedLabel: "已解锁",
      achievementTitle: "智慧传承者",
      achievementDesc: "集齐12页解锁成就 + 500文化积分",
      storeLabel: "前往积分商城",
      ctaLabel: "继续提问 · 解锁更多碎片",
      icons: {
        lock: "https://www.figma.com/api/mcp/asset/5def0403-e28c-4e1e-bb51-59f63e46ff49",
        achievement: "https://www.figma.com/api/mcp/asset/87b9819a-8d94-454b-b3b2-eaa943c41e83",
        store: "https://www.figma.com/api/mcp/asset/1052a39d-d9d1-45ff-b8bd-2ce8269012ee",
        chevron: "https://www.figma.com/api/mcp/asset/92fe865e-d73d-480c-8f50-d2ad21d1c139"
      },
      fragments: [
        { title: "胡杨之根", hint: "胡杨三千年不倒的秘密", emoji: "🌳" },
        { title: "塔里木河", hint: "罗布人的生命之河", emoji: "🏞️" },
        { title: "卡盆渔歌", hint: "水上渔猎的古老回响", emoji: "🛶" },
        { title: "红柳之弓", hint: "红柳弓箭里的生存智慧", emoji: "🏹" },
        { title: "楼兰古道", hint: "古道上的迁徙与守望", emoji: "🏜️" },
        { title: "罗布歌谣", hint: "风与民歌传唱的记忆", emoji: "🎶" },
        { title: "沙海星图", hint: "夜空指引归途的方式", emoji: "✨" },
        { title: "婚房之礼", hint: "婚俗陈设里的祝福寓意", emoji: "💍" },
        { title: "帕拉孜纹", hint: "经纬间织出的古老语言", emoji: "🧵" },
        { title: "百岁泉语", hint: "长寿老人的生活智慧", emoji: "💧" },
        { title: "芦苇归舟", hint: "塔河边的日常与回望", emoji: "🪶" },
        { title: "绿洲回响", hint: "人与自然共生的回声", emoji: "🌿" }
      ]
    },
    answer: {
      scene: "昼·胡杨林",
      detailTitle: "了解这条谚语的故事",
      detailDesc: "答对解锁1页，集齐12页领500积分"
    }
  },
  bookAnswers: [
    {
      theme: "自然哲学",
      quote: "胡杨三千年不倒，因它的根比树深。",
      decode: "根基决定高度，沉淀自有力量。",
      story: "当你不知道该往哪里走时，先照顾根，再讨论枝叶的方向。"
    },
    {
      theme: "罗布谚语",
      quote: "水浑时不撒网，心乱时不做决定。",
      decode: "等心静下来，再做重要的事。",
      story: "罗布人的渔猎经验，也是生活判断法。先安静，再行动。"
    },
    {
      theme: "技艺精神",
      quote: "卡盆不钉不铆，浑然天成。",
      decode: "最好的状态是自然，不必勉强。",
      story: "很多答案不是再用力，而是先回到自己最顺的节奏。"
    },
    {
      theme: "内心秩序",
      quote: "风大时先扎营，心乱时先坐下。",
      decode: "稳住自己，比仓促赶路更重要。",
      story: "罗布老人的智慧不急于给答案，而是先教你在变化里安稳下来。"
    }
  ],
  treeStages: [
    {
      title: "种子萌发",
      range: "0-200",
      desc: "一粒微光落进沙海，等待第一次引水。",
      reward: "解锁守护者徽章",
      color: "#C68A3D",
      emoji: "🌱",
      progress: 25
    },
    {
      title: "三年幼苗",
      range: "200-600",
      desc: "细小却倔强的幼苗，开始把根扎进更深的土地。",
      reward: "生成成长日历",
      color: "#4CAF50",
      emoji: "🌿",
      progress: 56
    },
    {
      title: "成林守护",
      range: "600-1200",
      desc: "秋天会把它染成金色，也把守护变成可见的力量。",
      reward: "兑换明信片与罗布麻茶",
      color: "#E5A64B",
      emoji: "🌳",
      progress: 75
    },
    {
      title: "英雄树",
      range: "1200+",
      desc: "风沙之后仍挺立，成为真正的长期连接点。",
      reward: "纪念卡盆与门票权益",
      color: "#8B5A2B",
      emoji: "🏜️",
      progress: 100
    }
  ],
  treeTasks: [
    {
      title: "生态补水",
      desc: "每日签到一次，为你的胡杨引入一股新的水脉。",
      color: "#42A5F5",
      emoji: "💧"
    },
    {
      title: "巡林护树",
      desc: "驱赶盗采者、给树根包裹保护皮，随机守护事件每 2-3 天触发。",
      color: "#AB47BC",
      emoji: "🛡️"
    },
    {
      title: "文化施肥",
      desc: "完成文化问答，获得真正能推动成长的文化养料。",
      color: "#FFB74D",
      emoji: "📚"
    }
  ],
  treeDashboard: {
    treeId: "罗布·胡杨 #86429",
    level: "LV.2",
    stage: "三年幼苗",
    baseEnergy: 340,
    maxEnergy: 600,
    dailyTotal: 5,
    friends: [
      { name: "小", color: "#F97316", bg: "rgba(249,115,22,0.09)" },
      { name: "阿", color: "#EC4899", bg: "rgba(236,72,153,0.09)" },
      { name: "大", color: "#3B82F6", bg: "rgba(59,130,246,0.09)" }
    ],
    bubbles: [
      { label: "+15g", left: "10%", top: "51%" },
      { label: "+10g", left: "48%", top: "44%" },
      { label: "+25g", left: "78%", top: "49%" },
      { label: "+20g", left: "92%", top: "58%" },
      { label: "+15g", left: "18%", top: "61%" }
    ]
  },
  treeDailyTasks: [
    {
      key: "water",
      title: "生态补水",
      desc: "为胡杨浇灌一池泉水",
      color: "#3B82F6",
      tint: "rgba(59,130,246,0.08)",
      shadow: "rgba(59,130,246,0.22)",
      emoji: "💧",
      points: 15,
      action: "tree-do-water",
      actionLabel: "去补水"
    },
    {
      key: "patrol",
      title: "巡林护树",
      desc: "守护沙漠绿洲防线",
      color: "#F59E0B",
      tint: "rgba(245,158,11,0.08)",
      shadow: "rgba(245,158,11,0.22)",
      emoji: "⭐",
      points: 30,
      action: "tree-do-patrol",
      actionLabel: "去巡林"
    },
    {
      key: "quiz",
      title: "文化施肥",
      desc: "罗布文化知识问答 · 1/3",
      color: "#8B5CF6",
      tint: "rgba(139,92,246,0.08)",
      shadow: "rgba(139,92,246,0.22)",
      emoji: "📘",
      points: 25,
      action: "tree-do-quiz",
      actionLabel: "去答题"
    }
  ],
  treeQuickLinks: [
    { key: "benefits", icon: "🎁", label: "权益兑换", action: "tree-soon" },
    { key: "invite", icon: "⤴", label: "邀好友", action: "tree-soon" },
    { key: "trace", icon: "◎", label: "数字溯源", action: "tree-trace" }
  ],
  treeTrace: {
    heroImage: embeddedTreeAssets.traceHero || "https://www.figma.com/api/mcp/asset/453431b4-2258-4e0e-b2d3-4e343e482618",
    location: "罗布人村寨胡杨林",
    gps: "GPS: 40.4°N, 88.1°E",
    weatherTitle: "巴州尉犁 · 晴",
    weatherSub: "实时气象数据",
    temperature: "18",
    timeline: [
      { date: "03.31", icon: "💧", text: "完成生态补水，成长值+15", accent: "#81C784" },
      { date: "03.30", icon: "📖", text: "完成文化施肥，成长值+25", accent: "#D4A96A" },
      { date: "03.29", icon: "🌪️", text: "巡林护树成功，成长值+30", accent: "#D4A96A" },
      { date: "03.28", icon: "💧", text: "完成生态补水，成长值+15", accent: "#D4A96A" },
      { date: "03.27", icon: "🌱", text: "认领胡杨，编号 LUOBU-86429", accent: "#D4A96A" },
      { date: "周报", icon: "📊", text: "本周水量充足，枝芽蓄势待发，成长值增长 85", accent: "#81C784" }
    ]
  },
  profilePanels: [
    {
      title: "积分总览",
      accent: "#FFB74D",
      icon: "✦",
      main: "文化积分",
      sub: "可兑换商城好礼",
      value: "840"
    },
    {
      title: "文化护照",
      accent: "#CE93D8",
      icon: "◉",
      main: "七院打卡",
      sub: "进度 2/7 · 勋章 3 枚",
      value: "2/7"
    },
    {
      title: "技艺证书",
      accent: "#64B5F6",
      icon: "⌘",
      main: "技艺修炼",
      sub: "已认证：卡盆渔手",
      value: "继续"
    },
    {
      title: "智慧藏书阁",
      accent: "#D4A96A",
      icon: "☼",
      main: "答案之书收藏",
      sub: "已收藏 5 张答案卡片",
      value: "查看"
    }
  ],
  profileStats: [
    { value: "12", label: "探索天数", color: "#FFB74D" },
    { value: "4/12", label: "藏书碎片", color: "#D4A96A" },
    { value: "3", label: "好友认养", color: "#81C784" }
  ]
};
