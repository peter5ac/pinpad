const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const DOORS_FILE = path.join(__dirname, "..", "public", "doors.yaml");
const PORT = Number(process.env.PORT || 8000);
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

function slugifyDoorName(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function main() {
  let data;
  try {
    data = fs.readFileSync(DOORS_FILE, "utf8");
  } catch (err) {
    console.error(`Could not read ${DOORS_FILE}: ${err.message}`);
    process.exit(1);
  }

  let parsed;
  try {
    parsed = yaml.load(data);
  } catch (err) {
    console.error(`Invalid YAML in ${DOORS_FILE}: ${err.message}`);
    process.exit(1);
  }

  const doors = Array.isArray(parsed && parsed.doors) ? parsed.doors : [];
  if (!doors.length) {
    console.error("No doors found in public/doors.yaml");
    process.exit(1);
  }

  const cleanBase = BASE_URL.replace(/\/$/, "");

  console.log("Door links:\n");
  doors.forEach((door, index) => {
    const name = typeof door.name === "string" && door.name.trim() ? door.name.trim() : `Door ${index + 1}`;
    const slug = slugifyDoorName(name) || String(index);
    console.log(`${name}`);
    console.log(`  ${cleanBase}/door/${slug}`);
    console.log(`  ${cleanBase}/?door=${encodeURIComponent(slug)}\n`);
  });
}

main();
