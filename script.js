document.getElementById("create").addEventListener("click", () => {

    const xlen = Number(document.getElementById("xlen").value);
    const ylen = Number(document.getElementById("ylen").value);

    const small = Number(document.getElementById("small").value);
    const mid = Number(document.getElementById("mid").value);
    const big = Number(document.getElementById("big").value);

    const smallWidth = Number(document.getElementById("smallWidth").value);
    const midWidth = Number(document.getElementById("midWidth").value);
    const bigWidth = Number(document.getElementById("bigWidth").value);

    const smallColor = document.getElementById("smallColor").value;
    const midColor = document.getElementById("midColor").value;
    const bigColor = document.getElementById("bigColor").value;

    const smallStyle = document.getElementById("smallStyle").value;
    const midStyle = document.getElementById("midStyle").value;
    const bigStyle = document.getElementById("bigStyle").value;

    const preview = document.getElementById("preview");

    const scale = 5;

    const widthMm = xlen;
    const heightMm = ylen;

    const widthPx = widthMm * scale;
    const heightPx = heightMm * scale;

    let svg = `
<svg id="graphSVG"
    width="${widthPx}" height="${heightPx}"
    viewBox="0 0 ${widthPx} ${heightPx}"
    xmlns="http://www.w3.org/2000/svg">

<defs>
    <marker id="arrow"
        markerWidth="10"
        markerHeight="10"
        refX="8"
        refY="3"
        orient="auto"
        markerUnits="strokeWidth">
        <path d="M0,0 L8,3 L0,6" fill="black"/>
    </marker>
</defs>

<rect x="0" y="0" width="${widthPx}" height="${heightPx}"
      fill="white" stroke="black"/>
`;

    function dash(style) {
        if (style === "dashed") return "6,4";
        if (style === "dotted") return "2,3";
        return "";
    }

    function drawGrid(step, color, style, strokeWidth) {

        const d = dash(style);

        for (let x = 0; x <= xlen; x += step) {
            svg += `<line
                x1="${x * scale}" y1="0"
                x2="${x * scale}" y2="${heightPx}"
                stroke="${color}"
                stroke-width="${strokeWidth}"
                stroke-dasharray="${d}"
                shape-rendering="crispEdges"
            />`;
        }

        for (let y = 0; y <= ylen; y += step) {
            svg += `<line
                x1="0" y1="${y * scale}"
                x2="${widthPx}" y2="${y * scale}"
                stroke="${color}"
                stroke-width="${strokeWidth}"
                stroke-dasharray="${d}"
                shape-rendering="crispEdges"
            />`;
        }
    }

    drawGrid(small, smallColor, smallStyle, smallWidth);
    drawGrid(mid, midColor, midStyle, midWidth);
    drawGrid(big, bigColor, bigStyle, bigWidth);

    // 軸（矢印付き）
    svg += `
        <line x1="0" y1="${heightPx}"
              x2="${widthPx}" y2="${heightPx}"
              stroke="black"
              stroke-width="2"
              shape-rendering="crispEdges"
        />

        <line x1="0" y1="${heightPx}"
              x2="0" y2="0"
              stroke="black"
              stroke-width="2"
              shape-rendering="crispEdges"
        />
    `;

    svg += `</svg>`;

    preview.innerHTML = "";
    preview.insertAdjacentHTML("beforeend", svg);
});


// ===============================
// PNG出力（通常：renderScale=10）
// ===============================
document.getElementById("exportPng").addEventListener("click", () => {

    exportPNG(10, "graph.png");
});


// ===============================
// PNG出力（高画質：renderScale=25）
// ===============================
document.getElementById("exportPngHigh").addEventListener("click", () => {

    exportPNG(25, "graph_high_quality.png");
});


// ===============================
// 共通PNG生成関数
// ===============================
function exportPNG(renderScale, filename) {

    const svgElement = document.getElementById("graphSVG");

    if (!svgElement) {
        alert("先に作成ボタンを押してね");
        return;
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();

    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = function () {

        const dpr = window.devicePixelRatio || 1;

        canvas.width = img.width * renderScale * dpr;
        canvas.height = img.height * renderScale * dpr;

        ctx.setTransform(renderScale * dpr, 0, 0, renderScale * dpr, 0, 0);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(img, 0, 0);

        const pngUrl = canvas.toDataURL("image/png");

        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    };

    img.src = url;
}