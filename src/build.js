import { readdir, readFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import { writeFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const categories = ["filled", "outlined", "round", "sharp", "two-tone"];
const defaultCategory = "filled";

const iconBaseDir = path.join(__dirname, "..", "node_modules", "@material-design-icons", "svg");

let result = {};

for (const category of categories) {
    const currDir = path.join(iconBaseDir, category);
    const files = await readdir(currDir);
    await Promise.all(files.map(async (fileName) => {
        const filePath = path.join(currDir, fileName);
        const content = await readFile(filePath, "utf8");

        const categorySuffix = category === defaultCategory ? "" : `-${category}`;
        const resFileName = fileName.replace(/_/g, "-").replace(".svg", "") + categorySuffix;
        const resContent = content.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "");

        result[resFileName] = resContent;
    }));
}

writeFileSync(path.join(__dirname, "..", "dist", "icons.json"), JSON.stringify(result));