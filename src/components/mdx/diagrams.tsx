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
  };
  const dividerStyle: React.CSSProperties = {
    borderTop: "1px dashed currentColor",
    opacity: 0.5,
  };
  return (
    <figure className="not-prose my-6">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
        <div style={cardStyle}>
          <div style={{ fontWeight: 600 }}>短标题</div>
          <div style={dividerStyle} />
          <div>body…</div>
          <div style={dividerStyle} />
          <div style={{ opacity: 0.7 }}>footer</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontWeight: 600 }}>一个比较长的标题</div>
          <div style={dividerStyle} />
          <div>body…</div>
          <div style={dividerStyle} />
          <div style={{ opacity: 0.7 }}>footer</div>
        </div>
      </div>
      <figcaption className="not-prose text-center text-xs text-fg-muted mt-2">
        两张卡片各自的 body / footer 起始线没对齐——这就是 subgrid 要解决的问题
      </figcaption>
    </figure>
  );
}
