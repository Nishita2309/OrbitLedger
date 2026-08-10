const fs = require("fs");
const path = require("path");

const DATA_DIRECTORY = path.join(__dirname, "../../data");
const TELEMETRY_FILE = path.join(DATA_DIRECTORY, "telemetry.json");

function ensureStorageExists() {
    if (!fs.existsSync(DATA_DIRECTORY)) {
        fs.mkdirSync(DATA_DIRECTORY, { recursive: true });
    }

    if (!fs.existsSync(TELEMETRY_FILE)) {
        fs.writeFileSync(TELEMETRY_FILE, "[]", "utf8");
    }
}

function readTelemetry() {
    ensureStorageExists();

    const fileContent = fs.readFileSync(TELEMETRY_FILE, "utf8");

    if (!fileContent.trim()) {
        return [];
    }

    return JSON.parse(fileContent);
}

function saveTelemetry(telemetry) {
    if (!telemetry || typeof telemetry !== "object") {
        throw new Error("Telemetry must be a valid object.");
    }

    const existingTelemetry = readTelemetry();

    existingTelemetry.push(telemetry);

    fs.writeFileSync(
        TELEMETRY_FILE,
        JSON.stringify(existingTelemetry, null, 2),
        "utf8"
    );

    return telemetry;
}

function saveTelemetryBatch(telemetryBatch) {
    if (!Array.isArray(telemetryBatch)) {
        throw new Error("Telemetry batch must be an array.");
    }

    const existingTelemetry = readTelemetry();

    existingTelemetry.push(...telemetryBatch);

    fs.writeFileSync(
        TELEMETRY_FILE,
        JSON.stringify(existingTelemetry, null, 2),
        "utf8"
    );

    return telemetryBatch;
}

module.exports = {
    readTelemetry,
    saveTelemetry,
    saveTelemetryBatch
};
