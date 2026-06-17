const cases = [
  {
    id: "case-anticoagulation",
    department: "心内 / 急诊",
    risk: "抗凝管理",
    difficulty: "进阶",
    title: "房颤患者术前停抗凝：一次被低估的时间窗",
    summary: "患者因小手术暂停抗凝，团队低估栓塞风险，最终暴露出围术期评估路径的断点。",
    background: "72 岁房颤患者拟行低风险手术，既往有短暂性脑缺血发作史。入院后按常规暂停抗凝，但未重新评估血栓风险与桥接策略。",
    wrongPath: "团队把手术等级当作唯一风险锚点，忽略了患者个体化血栓风险，且未在停药后设置复核节点。",
    correction: "先区分手术出血风险与患者血栓风险，再决定停药时间、桥接策略和复药窗口。关键不是记住一个固定天数，而是建立复核节律。",
    expert: "这个病例的核心不是抗凝指南背诵，而是风险排序。年轻医生容易把低风险手术误读为低风险患者，这是完全不同的两个概念。",
    principle: "低风险操作不等于低风险患者。所有停药决策都必须有复核节点。",
    nodes: ["术前评估只看手术等级", "停抗凝后无复核提醒", "术后复药窗口被延迟"],
  },
  {
    id: "case-sepsis",
    department: "急诊 / ICU",
    risk: "感染识别",
    difficulty: "基础到进阶",
    title: "发热不高的脓毒症：被正常体温掩盖的休克前夜",
    summary: "老年患者体温不高但精神反应变差，初筛未触发感染路径，延误了液体复苏和乳酸复查。",
    background: "78 岁患者因乏力、纳差入院，体温 37.4 摄氏度，血压偏低但仍在可接受范围。初诊将其归为普通感染观察。",
    wrongPath: "医生把发热程度当作感染严重度指标，没有把年龄、意识变化、末梢循环和乳酸趋势放在同一张风险图里。",
    correction: "建立老年感染的替代触发条件：意识改变、收缩压下降、尿量减少、乳酸升高。体温不高不能排除脓毒症。",
    expert: "在老年患者身上，安静往往不是安全。真正需要捕捉的是趋势和代偿失败前的微弱信号。",
    principle: "不要等典型表现出现才启动高风险路径。",
    nodes: ["体温锚定", "趋势指标缺失", "复查节点过晚"],
  },
  {
    id: "case-stroke",
    department: "神经 / 急诊",
    risk: "卒中通道",
    difficulty: "高风险",
    title: "短暂好转后的卒中：一次被症状波动误导的通道决策",
    summary: "患者症状短暂缓解，团队误判为低危 TIA，未及时推进影像和再评估。",
    background: "患者突发言语不清与右侧肢体无力，抵院后症状部分缓解。团队认为病情趋稳，未按卒中绿色通道节奏推进。",
    wrongPath: "把症状缓解当作风险下降，而不是把波动视为血管事件的警讯。复评依赖主观观察，缺少标准评分节奏。",
    correction: "症状波动不能替代卒中通道判断。先完成影像与评分复核，再决定后续风险分层。",
    expert: "这个病例提醒我们：通道思维比单次体征更重要。高风险路径的价值就在于保护医生不被短暂变化带偏。",
    principle: "症状波动是复评信号，不是降级理由。",
    nodes: ["症状缓解造成误判", "影像推进延后", "评分复核缺位"],
  },
];

const challenges = [
  {
    id: "challenge-er",
    type: "推理挑战",
    title: "10 分钟内重写脓毒症初筛路径",
    summary: "给定一组不典型老年感染资料，提交你的风险排序和复查节点。",
    goal: "训练早期识别与趋势判断，而不是背诵单一指标。",
    requirement: "用 5 条以内的结构化要点说明：高危信号、下一步检查、复查节奏、降级条件。",
    sample: "优秀回答会先列出意识改变、血压趋势、尿量与乳酸，而不是从体温开始。",
    expert: "判断质量体现在你能否解释为什么此刻不能继续观察。",
  },
  {
    id: "challenge-literature",
    type: "文献解读",
    title: "把一篇指南段落拆成临床决策卡",
    summary: "从指南文本中提取适应证、禁忌证、灰区和复评节点。",
    goal: "训练将静态文献转化为可执行临床判断的能力。",
    requirement: "提交一张不超过 8 个节点的决策结构，不需要上传文件。",
    sample: "优秀回答会保留灰区，不把指南写成机械流程图。",
    expert: "真正的文献解读，是把条件、边界和例外都讲清楚。",
  },
  {
    id: "challenge-curation",
    type: "策展任务",
    title: "为一个失败病例写专家提问清单",
    summary: "你不需要给答案，只需要提出能逼近关键误判的 6 个问题。",
    goal: "训练策展能力：把混乱材料变成专家愿意回答的问题。",
    requirement: "问题必须覆盖病史锚点、检查缺口、决策分叉和复盘原则。",
    sample: "优秀问题会减少情绪描述，增加可判断信息。",
    expert: "好问题本身就是医学智力资产。",
  },
];

const experts = [
  {
    name: "周临川",
    role: "急诊医学策展人",
    direction: "老年急危重症、脓毒症早筛、急诊路径设计",
    cases: "12 个策展案例",
    comment: "把不典型表现纳入高风险路径，是急诊训练的基本功。",
  },
  {
    name: "林知微",
    role: "心血管风险策展人",
    direction: "围术期抗凝、房颤管理、风险分层",
    cases: "9 个策展案例",
    comment: "指南不是答案本身，指南是帮助你排序风险的工具。",
  },
  {
    name: "沈亦白",
    role: "神经急症策展人",
    direction: "卒中通道、短暂性神经症状、影像决策",
    cases: "7 个策展案例",
    comment: "症状变化越快，越需要稳定的通道约束。",
  },
];

const $ = (selector) => document.querySelector(selector);

function tag(text) {
  return `<span class="tag">${text}</span>`;
}

function caseCard(item, compact = false) {
  return `
    <article class="${compact ? "mini-card" : "case-card"}">
      <div class="card-topline">
        <div class="meta-row"><span>${item.department}</span><span>${item.difficulty}</span></div>
        <span class="risk-pill">${item.risk}</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <div class="tag-row">${tag("专家点评")}${tag("决策节点")}${tag("复盘原则")}</div>
      <a href="#case/${item.id}">查看案例</a>
    </article>
  `;
}

function challengeCard(item, compact = false) {
  return `
    <article class="${compact ? "mission-row" : "challenge-card"}">
      <div class="meta-row"><span>${item.type}</span><span>申请参与</span></div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <a href="#challenge/${item.id}">查看挑战</a>
    </article>
  `;
}

function expertCard(item, compact = false) {
  return `
    <article class="${compact ? "expert-mini" : "expert-card"}">
      <div class="meta-row"><span>${item.role}</span><span>${item.cases}</span></div>
      <h3>${item.name}</h3>
      <p>${item.direction}</p>
      <div class="expert-note">
        <strong>精选点评</strong>
        <p>${item.comment}</p>
      </div>
    </article>
  `;
}

function renderLists() {
  $("#featured-cases").innerHTML = cases.slice(0, 2).map((item) => caseCard(item, true)).join("");
  $("#case-list").innerHTML = cases.map((item) => caseCard(item)).join("");
  $("#featured-challenges").innerHTML = challenges.slice(0, 2).map((item) => challengeCard(item, true)).join("");
  $("#challenge-list").innerHTML = challenges.map((item) => challengeCard(item)).join("");
  $("#featured-experts").innerHTML = experts.slice(0, 2).map((item) => expertCard(item, true)).join("");
  $("#expert-list").innerHTML = experts.map((item) => expertCard(item)).join("");
}

function showView(id) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active-view", view.id === id);
  });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function renderCaseDetail(id) {
  const item = cases.find((caseItem) => caseItem.id === id) || cases[0];
  $("#case-detail").innerHTML = `
    <div class="detail-layout">
      <article class="detail-panel">
        <p class="eyebrow">避雷案例详情</p>
        <h1>${item.title}</h1>
        <p>${item.summary}</p>
        <div class="tag-row">${tag(item.department)}${tag(item.risk)}${tag(item.difficulty)}</div>

        <section class="detail-section">
          <h3>病例背景</h3>
          <p>${item.background}</p>
        </section>

        <section class="detail-section">
          <h3>关键决策节点</h3>
          <ul class="decision-list">
            ${item.nodes.map((node) => `<li>${node}</li>`).join("")}
          </ul>
        </section>

        <section class="detail-section">
          <h3>错误路径</h3>
          <p>${item.wrongPath}</p>
        </section>

        <section class="detail-section">
          <h3>正确复盘</h3>
          <p>${item.correction}</p>
        </section>
      </article>

      <aside class="detail-panel">
        <div class="expert-note">
          <strong>专家点评</strong>
          <p>${item.expert}</p>
        </div>
        <section class="detail-section">
          <h3>学到的原则</h3>
          <p>${item.principle}</p>
        </section>
        <section class="detail-section">
          <h3>相关行动</h3>
          <a class="button primary" href="#challenges">参加学术挑战</a>
          <a class="button secondary" href="#cases">返回案例列表</a>
        </section>
      </aside>
    </div>
  `;
  showView("case-detail");
}

function renderChallengeDetail(id) {
  const item = challenges.find((challenge) => challenge.id === id) || challenges[0];
  $("#challenge-detail").innerHTML = `
    <div class="detail-layout">
      <article class="detail-panel">
        <p class="eyebrow">学术挑战详情</p>
        <h1>${item.title}</h1>
        <p>${item.summary}</p>
        <div class="tag-row">${tag(item.type)}${tag("结构化提交")}${tag("专家点评")}</div>

        <section class="detail-section">
          <h3>任务目标</h3>
          <p>${item.goal}</p>
        </section>

        <section class="detail-section">
          <h3>提交要求</h3>
          <p>${item.requirement}</p>
        </section>

        <section class="detail-section">
          <h3>优秀回答展示</h3>
          <p>${item.sample}</p>
        </section>
      </article>

      <aside class="detail-panel">
        <div class="expert-note">
          <strong>专家点评</strong>
          <p>${item.expert}</p>
        </div>
        <section class="detail-section">
          <h3>参与方式</h3>
          <p>第一版不开放真实提交后台。请先提交内测意向，后续通过人工邀请参与。</p>
          <a class="button primary" href="#apply">申请参与</a>
          <a class="button secondary" href="#challenges">返回挑战列表</a>
        </section>
      </aside>
    </div>
  `;
  showView("challenge-detail");
}

function route() {
  const hash = window.location.hash.replace("#", "") || "home";
  const [type, id] = hash.split("/");
  if (type === "case") {
    renderCaseDetail(id);
    return;
  }
  if (type === "challenge") {
    renderChallengeDetail(id);
    return;
  }
  showView(type);
}

function setupForm() {
  $("#apply-form").addEventListener("submit", (event) => {
    event.preventDefault();
    $("#form-note").textContent = "已记录这次内测意向。当前为静态样板间，没有连接真实后台。";
    event.currentTarget.reset();
  });
}

renderLists();
setupForm();
window.addEventListener("hashchange", route);
route();
