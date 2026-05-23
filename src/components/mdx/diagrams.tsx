/**
 * Flex 主轴 / 交叉轴示意图。
 *
 * 抽成组件而非在 mdx 里嵌内联 SVG 的两个理由：
 * 1) mdx 里只写 <FlexAxisDiagram /> 一行，作者心智负担最低
 * 2) 渲染细节（颜色、坐标、a11y）集中维护——主题色 / 边距未来如需调整，
 *    只动一处
 */
export function FlexAxisDiagram() {
  return (
    <figure className="not-prose my-6">
      <svg
        viewBox="0 0 480 200"
        role="img"
        aria-label="Flex 主轴与交叉轴示意图：flex-direction: row 时主轴水平、交叉轴垂直"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "100%",
          maxWidth: "480px",
          height: "auto",
          display: "block",
          margin: "0 auto",
        }}
      >
        {/* 容器 */}
        <rect
          x="20"
          y="40"
          width="440"
          height="120"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          rx="6"
        />
        {/* 三个 item */}
        {[
          { x: 60, label: "A" },
          { x: 140, label: "B" },
          { x: 220, label: "C" },
        ].map(({ x, label }) => (
          <g key={label}>
            <rect
              x={x}
              y="80"
              width="60"
              height="40"
              fill="currentColor"
              opacity="0.08"
              stroke="currentColor"
              strokeWidth="1"
              rx="3"
            />
            <text
              x={x + 30}
              y="105"
              textAnchor="middle"
              fontSize="14"
              fill="currentColor"
              fontFamily="monospace"
            >
              {label}
            </text>
          </g>
        ))}
        {/* 主轴 */}
        <line
          x1="60"
          y1="100"
          x2="430"
          y2="100"
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <polygon points="430,95 442,100 430,105" fill="currentColor" opacity="0.7" />
        <text x="350" y="92" fontSize="12" fill="currentColor" opacity="0.8">
          主轴 main axis →
        </text>
        {/* 交叉轴 */}
        <line
          x1="40"
          y1="60"
          x2="40"
          y2="178"
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <polygon points="35,178 40,190 45,178" fill="currentColor" opacity="0.7" />
        <text x="48" y="180" fontSize="12" fill="currentColor" opacity="0.8">
          交叉轴 cross axis ↓
        </text>
        {/* 头注 */}
        <text
          x="240"
          y="30"
          textAnchor="middle"
          fontSize="12"
          fill="currentColor"
          opacity="0.7"
          fontFamily="monospace"
        >
          flex-direction: row（默认）
        </text>
      </svg>
      <figcaption className="not-prose text-center text-xs text-fg-muted mt-2">
        Flex 容器里主轴是水平方向、交叉轴是垂直方向；改成 <code>column</code> 时两者交换
      </figcaption>
    </figure>
  );
}

/**
 * 嵌套 Grid 卡片对齐断层示意。
 *
 * 直接用浏览器渲染的 HTML 卡片来"演示"断层本身——比 ASCII 图自洽，
 * 也避免了字宽对齐风险。
 *
 * 关键：右卡的标题必须**自然换行到 2 行**，左右两卡的 body 起始线
 * 才会真正错开（这是 subgrid 要解决的问题）。卡片宽度固定较窄、
 * 标题文本足够长，是让差异可见的前提。
 */
export function CardAlignmentMisalignedDemo() {
  const cardStyle: React.CSSProperties = {
    border: "1px solid currentColor",
    borderRadius: "6px",
    padding: "0.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    fontSize: "0.85rem",
    lineHeight: 1.5,
  };
  const titleStyle: React.CSSProperties = { fontWeight: 600 };
  const dividerStyle: React.CSSProperties = {
    borderTop: "1px dashed currentColor",
    opacity: 0.5,
  };
  return (
    <figure className="not-prose my-6">
      <div className="mb-2 text-center text-xs text-fg-muted">
        ❌ 没用 subgrid：每卡独立 Grid，body / footer 起始线不齐
      </div>
      <div
        style={{
          display: "grid",
          /* 列宽用 minmax(0, 1fr) 而不是固定 220px：
             固定列宽在 < 456px 视口（典型手机）会撑大父容器触发整页横滑，
             用 1fr + 外层 maxWidth 兼顾"大屏限宽 / 小屏自适应"。
             窄屏下卡片更窄、右卡标题更容易自然换 2-3 行，subgrid 的
             断层 vs 对齐对比反而比固定 220px 更明显。 */
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "1rem",
          width: "100%",
          maxWidth: "480px",
          margin: "0 auto",
          alignItems: "start",
        }}
      >
        <div style={cardStyle}>
          <div style={titleStyle}>短标题</div>
          <div style={dividerStyle} />
          <div>body…</div>
          <div style={dividerStyle} />
          <div style={{ opacity: 0.7 }}>footer</div>
        </div>
        <div style={cardStyle}>
          <div style={titleStyle}>一个相当长以至于会自然换到第二行的卡片标题</div>
          <div style={dividerStyle} />
          <div>body…</div>
          <div style={dividerStyle} />
          <div style={{ opacity: 0.7 }}>footer</div>
        </div>
      </div>
      <figcaption className="not-prose text-center text-xs text-fg-muted mt-2">
        右卡标题占 2 行 → body 起始线被推下去；左卡 body 仍在第 2 行起。
      </figcaption>
    </figure>
  );
}

/**
 * subgrid 修复后效果。两卡共享外层 Grid 的行轨道，title / body /
 * footer 各占同一根轨道线，因此即便标题字数不同也跨卡对齐。
 *
 * 实现用 CSS Grid `grid-template-rows: subgrid` + 每张卡 `grid-row:
 * span 3` 占据外层 3 行；左卡的"短标题"会被外层第一行轨道撑高到
 * 与右卡两行标题等高（这正是断层被消除的机制）。
 */
export function CardAlignmentFixedDemo() {
  const titleStyle: React.CSSProperties = { fontWeight: 600 };
  const dividerStyle: React.CSSProperties = {
    borderTop: "1px dashed currentColor",
    opacity: 0.5,
  };
  // 内层卡片用 subgrid 接管外层行轨道；标题 / body / footer 各占 1 行
  const cardStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateRows: "subgrid",
    gridRow: "span 3",
    border: "1px solid currentColor",
    borderRadius: "6px",
    padding: "0.75rem",
    rowGap: "0.5rem",
    fontSize: "0.85rem",
    lineHeight: 1.5,
  };
  return (
    <figure className="not-prose my-6">
      <div className="mb-2 text-center text-xs text-fg-muted">
        ✅ 用 subgrid：两卡共享外层行轨道，body / footer 跨卡对齐
      </div>
      <div
        style={{
          display: "grid",
          /* 同上 demo：列宽用 1fr 而非固定 220px，避免窄屏整页横滑。 */
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          // 外层声明 3 行轨道：title / body / footer
          gridTemplateRows: "auto 1fr auto",
          gap: "1rem",
          width: "100%",
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
        <div style={cardStyle}>
          <div style={titleStyle}>短标题</div>
          <div>
            <div style={dividerStyle} />
            <div style={{ marginTop: "0.5rem" }}>body…</div>
          </div>
          <div>
            <div style={dividerStyle} />
            <div style={{ marginTop: "0.5rem", opacity: 0.7 }}>footer</div>
          </div>
        </div>
        <div style={cardStyle}>
          <div style={titleStyle}>一个相当长以至于会自然换到第二行的卡片标题</div>
          <div>
            <div style={dividerStyle} />
            <div style={{ marginTop: "0.5rem" }}>body…</div>
          </div>
          <div>
            <div style={dividerStyle} />
            <div style={{ marginTop: "0.5rem", opacity: 0.7 }}>footer</div>
          </div>
        </div>
      </div>
      <figcaption className="not-prose text-center text-xs text-fg-muted mt-2">
        左卡的 body / footer 被外层轨道下推到与右卡同一水平线上——这就 是 subgrid
        让嵌套对齐"贯通"的效果。
      </figcaption>
    </figure>
  );
}
