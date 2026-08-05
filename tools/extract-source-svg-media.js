const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const args = { slides: [] };
  for (let index = 2; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--source-dir") args.sourceDir = argv[++index];
    else if (value === "--output-dir") args.outputDir = argv[++index];
    else if (value === "--slides") {
      args.slides = argv[++index]
        .split(",")
        .flatMap((entry) => {
          const [start, end] = entry.split("-").map(Number);
          if (!end) return [start];
          return Array.from({ length: end - start + 1 }, (_, offset) => start + offset);
        });
    }
  }
  if (!args.sourceDir || !args.outputDir || args.slides.length === 0) {
    throw new Error("Usage: node tools/extract-source-svg-media.js --source-dir <dir> --output-dir <dir> --slides 1-15");
  }
  return args;
}

function extensionForMime(mime) {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "bin";
}

function readImages(svg) {
  const images = [];
  const imagePattern = /<image\b([^>]*)\/?>(?:<\/image>)?/gi;
  let match;
  while ((match = imagePattern.exec(svg)) !== null) {
    const attributes = match[1];
    const readAttribute = (name) => {
      const attributeMatch = attributes.match(new RegExp(`(?:^|\\s)(?:xlink:)?${name}=["']([^"']*)["']`, "i"));
      return attributeMatch ? attributeMatch[1] : "";
    };
    const href = readAttribute("href");
    const dataMatch = href.match(/^data:([^;,]+);base64,(.+)$/i);
    if (!dataMatch) continue;
    images.push({
      id: readAttribute("id") || `image_${images.length + 1}`,
      width: Number(readAttribute("width")) || 0,
      height: Number(readAttribute("height")) || 0,
      mime: dataMatch[1].toLowerCase(),
      bytes: Buffer.from(dataMatch[2], "base64"),
    });
  }
  return images;
}

function main() {
  const args = parseArgs(process.argv);
  fs.mkdirSync(args.outputDir, { recursive: true });
  const manifest = [];

  for (const slide of args.slides) {
    const source = path.join(args.sourceDir, `Folie${slide}.SVG`);
    const svg = fs.readFileSync(source, "utf8");
    const slideDir = path.join(args.outputDir, `source_${String(slide).padStart(3, "0")}`);
    fs.mkdirSync(slideDir, { recursive: true });
    for (const image of readImages(svg)) {
      const role = image.width === 64 && image.height === 64 ? "powerpoint_speaker" : "content_media";
      if (role === "powerpoint_speaker") {
        manifest.push({
          source_slide: slide,
          source_svg: source.replaceAll("\\", "/"),
          role,
          excluded: true,
          width: image.width,
          height: image.height,
          mime: image.mime,
          byte_length: image.bytes.length,
        });
        continue;
      }
      const filename = `${image.id}.${extensionForMime(image.mime)}`;
      fs.writeFileSync(path.join(slideDir, filename), image.bytes);
      manifest.push({
        source_slide: slide,
        source_svg: source.replaceAll("\\", "/"),
        filename: path.join(slideDir, filename).replaceAll("\\", "/"),
        role,
        width: image.width,
        height: image.height,
        mime: image.mime,
        byte_length: image.bytes.length,
      });
    }
  }

  fs.writeFileSync(
    path.join(args.outputDir, "source-media-manifest.json"),
    `${JSON.stringify({ schema_version: "sourceSvgMedia/v1", assets: manifest }, null, 2)}\n`,
  );
  const contentCount = manifest.filter((asset) => asset.role === "content_media").length;
  const speakerCount = manifest.filter((asset) => asset.role === "powerpoint_speaker").length;
  process.stdout.write(`Extracted ${contentCount} content assets; excluded ${speakerCount} speaker assets.\n`);
}

main();
