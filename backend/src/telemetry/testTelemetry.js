const {
    generateTelemetry,
    generateTelemetryBatch
} = require("./telemetryGenerator");

const {
    readTelemetry,
    saveTelemetry,
    saveTelemetryBatch
} = require("./telemetryStorage");

console.log("========================================");
console.log("   ORBITLEDGER TELEMETRY TEST");
console.log("========================================");

console.log("\n[1] Generating single telemetry record...\n");

const telemetry = generateTelemetry();

console.log(telemetry);

console.log("\n[2] Saving telemetry record off-chain...\n");

saveTelemetry(telemetry);

console.log("Telemetry saved successfully.");

console.log("\n[3] Generating telemetry batch...\n");

const batch = generateTelemetryBatch(5);

console.log(`Generated ${batch.length} telemetry records.`);

console.log("\n[4] Saving telemetry batch off-chain...\n");

saveTelemetryBatch(batch);

console.log("Telemetry batch saved successfully.");

console.log("\n[5] Reading stored telemetry...\n");

const storedTelemetry = readTelemetry();

console.log(`Total stored records: ${storedTelemetry.length}`);

console.log("\n========================================");
console.log("   TELEMETRY TEST COMPLETED");
console.log("========================================");