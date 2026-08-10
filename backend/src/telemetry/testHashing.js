const {
    generateTelemetry
} = require("./telemetryGenerator");

const {
    hashTelemetry,
    verifyTelemetryHash
} = require("./telemetryHasher");

console.log("========================================");
console.log("   ORBITLEDGER SHA-256 TEST");
console.log("========================================");

console.log("\n[1] Generating telemetry...\n");

const telemetry = generateTelemetry();

console.log(telemetry);

console.log("\n[2] Generating SHA-256 hash...\n");

const originalHash = hashTelemetry(telemetry);

console.log("Original Hash:");
console.log(originalHash);

console.log("\nHash length:");
console.log(originalHash.length);

console.log("\n[3] Recalculating hash from unchanged telemetry...\n");

const recalculatedHash = hashTelemetry(telemetry);

console.log("Recalculated Hash:");
console.log(recalculatedHash);

console.log("\nHashes match:");

const unchangedVerification = verifyTelemetryHash(
    telemetry,
    originalHash
);

console.log(unchangedVerification);

console.log("\n[4] Modifying telemetry...\n");

const tamperedTelemetry = {
    ...telemetry,
    temperature: telemetry.temperature + 5
};

console.log("Original temperature:");
console.log(telemetry.temperature);

console.log("Tampered temperature:");
console.log(tamperedTelemetry.temperature);

console.log("\n[5] Generating hash of modified telemetry...\n");

const tamperedHash = hashTelemetry(tamperedTelemetry);

console.log("Tampered Hash:");
console.log(tamperedHash);

console.log("\n[6] Verifying modified telemetry against original hash...\n");

const tamperedVerification = verifyTelemetryHash(
    tamperedTelemetry,
    originalHash
);

console.log("Integrity check:");
console.log(tamperedVerification);

console.log("\n========================================");
console.log("   SHA-256 TEST COMPLETED");
console.log("========================================");
