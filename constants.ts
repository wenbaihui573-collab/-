
export const APP_NAME = "共绘家园";

// 2.1 AI 角色指令 (System Prompt)
export const LANDSCAPE_ARCHITECT_SYSTEM_PROMPT = `
You are an expert Participatory Landscape Architect and Urban Planner working for the "Co-Designing the Homeland" project.
Your goal is to help residents redesign their local public spaces (pocket parks, squares, street corners).

**Your Persona:**
- Professional yet accessible language (explain jargon like "permeable pavement" simply).
- Empathetic: You care deeply about how different groups (elderly, children, disabled) use the space.
- Safety & Ecology conscious: Prioritize sightlines, lighting, drainage, and native vegetation.

**Your Task:**
1. Analyze the user's uploaded photo and their markers (e.g., "Old tree to keep", "Dark corner").
2. Engage in a dialogue to uncover needs (Activity analysis, Microclimate preferences, Materiality).
3. Suggest design interventions based on "Environmental Psychology".
4. If asked, generate a detailed image generation prompt following the specific template structure.

**Key Questions to Ask (Use sparingly, do not overwhelm):**
- Functionality: "Who uses this space most? Seniors sunbathing or kids running?"
- Ecology: "Do we want more shade trees here or an open lawn for gathering?"
- Facilities: "Is the lighting sufficient at night? Do we need barrier-free ramps?"

**Tone:** Encouraging, collaborative, visionary.
`;

// 2.2 户外绘图提示词生成模板
export const MJ_PROMPT_TEMPLATE = `
Structure: [Environment/Weather/Time] + [Landscape Function] + [Hardscape Details] + [Softscape Details] + [Activity/Crowd] + [Render Style]

Example Output:
"Sunny late afternoon, soft golden light, community pocket park in urban setting, permeable colorful concrete pavement with organic curves, rain garden with native ornamental grasses and wildflowers, elderly people sitting on wooden benches chatting, children playing near a low water feature, realistic Lumion 12 render, high detail, architectural photography style --ar 16:9"
`;

export const MOCK_HEATMAP_DATA = [
  { name: '中心广场', value: 85, fill: '#ef4444' },
  { name: '林荫步道', value: 65, fill: '#f97316' },
  { name: '健身角', value: 45, fill: '#eab308' },
  { name: '入口区', value: 30, fill: '#22c55e' },
];

export const MOCK_NEEDS_DATA = [
  { name: '增加座椅', count: 120 },
  { name: '夜间照明', count: 98 },
  { name: '儿童设施', count: 85 },
  { name: '无障碍坡道', count: 60 },
  { name: '遮阴树木', count: 55 },
];

export const TRANSLATIONS = {
  zh: {
    app: {
      name: "共绘家园",
      subtitle: "社区空间参与式设计平台",
      roleResident: "我是居民 (开始设计)",
      roleAdmin: "我是管理者 (查看数据)",
      navHome: "首页",
      navCapture: "拍摄",
      navDesign: "设计",
      navData: "数据",
    },
    capture: {
      step1Title: "1. 场地现状捕捉",
      step1Desc: "上传照片并标记关键特征",
      uploadBtn: "拍摄或上传照片",
      overlayInstruction: "点击图片添加标记",
      addMarkerTitle: "添加标记",
      labelDesc: "描述",
      labelPlaceholder: "例如：老树、积水、需要座椅",
      labelType: "类型",
      cancel: "取消",
      confirm: "确定",
      markedFeatures: "已标记特征",
      nextBtn: "下一步：AI 辅助设计",
      tutorial: {
        view: "查看教程",
        step1Title: "第一步：拍摄现场",
        step1Desc: "上传或拍摄一张清晰的现场照片。尽量包含整个需要改造的区域（例如广场、街角绿地）。",
        step1Btn: "知道了，去拍摄",
        step2Title: "第二步：添加标记",
        step2DescPart1: "直接点击照片",
        step2DescPart2: "来标记关键点。",
        step2Examples: "例如：\n🌳 需保留的大树\n🌧️ 容易积水的地方\n🪑 希望增加座椅的位置",
        step2Btn: "开始标记",
      }
    },
    chat: {
      title: "AI 景观设计师",
      back: "返回",
      contextBubble: "正在基于您拍摄的现场照片进行设计",
      inputPlaceholder: "描述你的想法... (例如: 我想要更多树荫)",
      loading: "AI 正在思考...",
      promptLabel: "绘图提示词生成",
      promptDisclaimer: "*已适配 Midjourney/Stable Diffusion 格式",
      renderPlaceholder: "AI 渲染生成示意图",
      initMessagePrefix: "你好！我是“共绘家园”的景观设计师助手。我已经看到了你上传的场地。\n\n我注意到你标记了",
      initMessageSuffix: "个关键点。\n我们可以一起讨论这块区域的改造。首先，请问这个区域平时主要是谁在使用？（老人、儿童、或者主要是过路人？）",
      error: "抱歉，连接有点问题，请重试。"
    },
    admin: {
      title: "街道办/设计师后台",
      subtitle: "社区改造意愿数据看板",
      heatmapTitle: "公众意愿热力图",
      heatmapTag: "高频关注: 中心广场",
      needsTitle: "功能需求排行",
      keywordsTitle: "风格倾向关键词",
      legendStrong: "改造意愿极强",
      legendWeak: "改造意愿较强",
    },
    featureTypes: {
      retain: "保留 (Retain)",
      remove: "拆除 (Remove)",
      modify: "改造 (Modify)",
      issue: "问题 (Issue)"
    }
  },
  en: {
    app: {
      name: "Co-Designing Homeland",
      subtitle: "Participatory Design Platform",
      roleResident: "I'm a Resident (Start)",
      roleAdmin: "I'm an Admin (Data)",
      navHome: "Home",
      navCapture: "Capture",
      navDesign: "Design",
      navData: "Data",
    },
    capture: {
      step1Title: "1. Site Capture",
      step1Desc: "Upload photo and mark features",
      uploadBtn: "Take or Upload Photo",
      overlayInstruction: "Click photo to mark",
      addMarkerTitle: "Add Marker",
      labelDesc: "Description",
      labelPlaceholder: "E.g., Old tree, Puddle",
      labelType: "Type",
      cancel: "Cancel",
      confirm: "Confirm",
      markedFeatures: "Marked Features",
      nextBtn: "Next: AI Co-Design",
      tutorial: {
        view: "View Tutorial",
        step1Title: "Step 1: Capture Site",
        step1Desc: "Upload or take a clear photo. Include the entire area (e.g., square, street corner).",
        step1Btn: "Got it, go capture",
        step2Title: "Step 2: Add Markers",
        step2DescPart1: "Click directly on the photo",
        step2DescPart2: "to mark points.",
        step2Examples: "E.g.:\n🌳 Tree to keep\n🌧️ Puddle area\n🪑 Need bench here",
        step2Btn: "Start Marking",
      }
    },
    chat: {
      title: "AI Landscape Architect",
      back: "Back",
      contextBubble: "Designing based on your photo",
      inputPlaceholder: "Your ideas... (e.g. more shade)",
      loading: "AI is thinking...",
      promptLabel: "Visual Prompt Gen",
      promptDisclaimer: "*Optimized for Midjourney",
      renderPlaceholder: "AI Render Visualization",
      initMessagePrefix: "Hello! I am your AI Landscape Architect. I've received your site photo.\n\nI noticed you marked",
      initMessageSuffix: "points.\nLet's discuss. Who mainly uses this space? (Elderly, children, or passersby?)",
      error: "Sorry, connection issue. Please try again."
    },
    admin: {
      title: "Admin Dashboard",
      subtitle: "Renovation Data Board",
      heatmapTitle: "Public Interest Heatmap",
      heatmapTag: "High Interest: Central Square",
      needsTitle: "Needs Ranking",
      keywordsTitle: "Style Keywords",
      legendStrong: "High Interest",
      legendWeak: "Medium Interest",
    },
    featureTypes: {
      retain: "Retain",
      remove: "Remove",
      modify: "Modify",
      issue: "Issue"
    }
  }
};
