const express = require("express");
const cors = require("cors");

const {
    readTelemetry
} = require("./telemetry/telemetryStorage");

const {
    hashTelemetry
} = require("./telemetry/telemetryHasher");

const {
    recordTelemetryHash,
    getTelemetryRecord,
    verifyTelemetryHash
} = require("./blockchain/blockchainService");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "OrbitLedger backend is running",
        timestamp: new Date().toISOString()
    });
});

app.get("/api/telemetry", (req, res) => {
    try {
        const telemetry = readTelemetry();

        res.status(200).json({
            success: true,
            count: telemetry.length,
            data: telemetry
        });
    } catch (error) {
        console.error("Failed to read telemetry:", error);

        res.status(500).json({
            success: false,
            message: "Failed to read telemetry"
        });
    }
});

app.post("/api/telemetry/:dataId/record", async (req, res) => {
    try {
        const { dataId } = req.params;

        if (!/^TEL-\d+$/.test(dataId)) {
            return res.status(400).json({
                success: false,
                message: "Data ID must use the format TEL-001."
            });
        }

        const telemetryIndex =
            Number.parseInt(dataId.replace("TEL-", ""), 10) - 1;

        const telemetry = readTelemetry();

        if (
            telemetryIndex < 0 ||
            telemetryIndex >= telemetry.length
        ) {
            return res.status(404).json({
                success: false,
                message: `Telemetry record ${dataId} was not found.`
            });
        }

        const selectedTelemetry = telemetry[telemetryIndex];

        const telemetryHash =
            hashTelemetry(selectedTelemetry);

        const blockchainResult =
            await recordTelemetryHash(
                selectedTelemetry.satelliteId,
                dataId,
                telemetryHash
            );

        res.status(201).json({
            success: true,
            message: "Telemetry hash recorded on blockchain.",
            data: {
                dataId,
                satelliteId: selectedTelemetry.satelliteId,
                telemetryHash: `0x${telemetryHash}`,
                transactionHash:
                    blockchainResult.transactionHash,
                blockNumber:
                    blockchainResult.blockNumber,
                contractAddress:
                    blockchainResult.contractAddress
            }
        });
    } catch (error) {
        console.error(
            "Failed to record telemetry:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to record telemetry hash.",
            error: error.message
        });
    }
});

app.post("/api/telemetry/:dataId/verify", async (req, res) => {
    try {
        const { dataId } = req.params;

        if (!/^TEL-\d+$/.test(dataId)) {
            return res.status(400).json({
                success: false,
                message: "Data ID must use the format TEL-001."
            });
        }

        const telemetryIndex =
            Number.parseInt(dataId.replace("TEL-", ""), 10) - 1;

        const telemetry = readTelemetry();

        if (
            telemetryIndex < 0 ||
            telemetryIndex >= telemetry.length
        ) {
            return res.status(404).json({
                success: false,
                message: `Telemetry record ${dataId} was not found.`
            });
        }

        const selectedTelemetry =
            telemetry[telemetryIndex];

        const calculatedHash =
            hashTelemetry(selectedTelemetry);

        const blockchainRecord =
            await getTelemetryRecord(dataId);

        const blockchainVerification =
            await verifyTelemetryHash(
                dataId,
                calculatedHash
            );

        const normalizedCalculatedHash =
            `0x${calculatedHash}`.toLowerCase();

        const normalizedBlockchainHash =
            blockchainRecord.telemetryHash.toLowerCase();

        const hashesMatch =
            normalizedCalculatedHash ===
            normalizedBlockchainHash;

        const verified =
            blockchainVerification && hashesMatch;

        res.status(200).json({
            success: true,
            data: {
                dataId,
                satelliteId:
                    selectedTelemetry.satelliteId,

                calculatedHash:
                    normalizedCalculatedHash,

                blockchainHash:
                    normalizedBlockchainHash,

                hashesMatch,

                blockchainVerification,

                integrityStatus: verified
                    ? "VERIFIED"
                    : "INTEGRITY_VIOLATION",

                message: verified
                    ? "TELEMETRY VERIFIED"
                    : "INTEGRITY VIOLATION"
            }
        });
    } catch (error) {
        console.error(
            "Failed to verify telemetry:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to verify telemetry.",
            error: error.message
        });
    }
});

app.get("/api/telemetry/:dataId/blockchain", async (req, res) => {
    try {
        const { dataId } = req.params;

        if (!/^TEL-\d+$/.test(dataId)) {
            return res.status(400).json({
                success: false,
                message: "Data ID must use the format TEL-001."
            });
        }

        const blockchainRecord =
            await getTelemetryRecord(dataId);

        res.status(200).json({
            success: true,
            data: blockchainRecord
        });
    } catch (error) {
        console.error(
            "Failed to retrieve blockchain record:",
            error
        );

        if (
            error.message.includes(
                "Telemetry record not found"
            )
        ) {
            return res.status(404).json({
                success: false,
                message: `Blockchain record ${req.params.dataId} was not found.`
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to retrieve blockchain record.",
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log("========================================");
    console.log("      ORBITLEDGER BACKEND SERVER");
    console.log("========================================");
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("");
    console.log("Available endpoints:");
    console.log(`GET http://localhost:${PORT}/api/health`);
    console.log(`GET http://localhost:${PORT}/api/telemetry`);
    console.log(
        `POST http://localhost:${PORT}/api/telemetry/:dataId/record`
    );
    console.log(
        `POST http://localhost:${PORT}/api/telemetry/:dataId/verify`
    );
    console.log(
        `GET http://localhost:${PORT}/api/telemetry/:dataId/blockchain`
    );
    console.log("========================================");
});