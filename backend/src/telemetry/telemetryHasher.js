const crypto = require("crypto");

function createCanonicalTelemetry(telemetry) {
    if (!telemetry || typeof telemetry !== "object") {
        throw new Error("Telemetry must be a valid object.");
    }

    const requiredFields = [
        "satelliteId",
        "timestamp",
        "temperature",
        "batteryVoltage",
        "batteryPercentage",
        "solarPower",
        "altitude",
        "velocity",
        "orientation",
        "communicationStatus"
    ];

    for (const field of requiredFields) {
        if (!(field in telemetry)) {
            throw new Error(`Missing telemetry field: ${field}`);
        }
    }

    return {
        satelliteId: telemetry.satelliteId,
        timestamp: telemetry.timestamp,
        temperature: telemetry.temperature,
        batteryVoltage: telemetry.batteryVoltage,
        batteryPercentage: telemetry.batteryPercentage,
        solarPower: telemetry.solarPower,
        altitude: telemetry.altitude,
        velocity: telemetry.velocity,
        orientation: telemetry.orientation,
        communicationStatus: telemetry.communicationStatus
    };
}

function hashTelemetry(telemetry) {
    const canonicalTelemetry = createCanonicalTelemetry(telemetry);

    const telemetryJson = JSON.stringify(canonicalTelemetry);

    return crypto
        .createHash("sha256")
        .update(telemetryJson, "utf8")
        .digest("hex");
}

function verifyTelemetryHash(telemetry, expectedHash) {
    if (!expectedHash || typeof expectedHash !== "string") {
        throw new Error("Expected hash must be a valid string.");
    }

    const calculatedHash = hashTelemetry(telemetry);

    return calculatedHash === expectedHash;
}

module.exports = {
    createCanonicalTelemetry,
    hashTelemetry,
    verifyTelemetryHash
};