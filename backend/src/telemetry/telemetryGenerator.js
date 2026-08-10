const SATELLITE_ID = "SAT-001";

function randomBetween(min, max, decimals = 2) {
    const value = Math.random() * (max - min) + min;
    return Number(value.toFixed(decimals));
}

function randomChoice(values) {
    return values[Math.floor(Math.random() * values.length)];
}

function generateTelemetry(satelliteId = SATELLITE_ID) {
    return {
        satelliteId,
        timestamp: new Date().toISOString(),

        temperature: randomBetween(20, 40, 1),

        batteryVoltage: randomBetween(26, 30, 2),

        batteryPercentage: randomBetween(70, 95, 1),

        solarPower: randomBetween(1.2, 2.5, 2),

        altitude: randomBetween(540, 550, 2),

        velocity: randomBetween(7.50, 7.70, 2),

        orientation: randomChoice([
            "NOMINAL",
            "NOMINAL",
            "NOMINAL",
            "ADJUSTING"
        ]),

        communicationStatus: randomChoice([
            "ACTIVE",
            "ACTIVE",
            "ACTIVE",
            "STANDBY"
        ])
    };
}

function generateTelemetryBatch(count = 5, satelliteId = SATELLITE_ID) {
    if (!Number.isInteger(count) || count <= 0) {
        throw new Error("Telemetry batch count must be a positive integer.");
    }

    const telemetryBatch = [];

    for (let i = 0; i < count; i++) {
        telemetryBatch.push(generateTelemetry(satelliteId));
    }

    return telemetryBatch;
}

module.exports = {
    generateTelemetry,
    generateTelemetryBatch
};