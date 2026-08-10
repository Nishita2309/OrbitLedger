import { network } from "hardhat";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const DATA_ID = "TEL-001";

type Telemetry = {
  satelliteId: string;
  timestamp: string;
  temperature: number;
  batteryVoltage: number;
  batteryPercentage: number;
  solarPower: number;
  altitude: number;
  velocity: number;
  orientation: string;
  communicationStatus: string;
};

function createCanonicalTelemetry(telemetry: Telemetry) {
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
    communicationStatus: telemetry.communicationStatus,
  };
}

function hashTelemetry(telemetry: Telemetry): string {
  const canonicalTelemetry = createCanonicalTelemetry(telemetry);

  const telemetryJson = JSON.stringify(canonicalTelemetry);

  return createHash("sha256")
    .update(telemetryJson, "utf8")
    .digest("hex");
}

console.log("========================================");
console.log("   ORBITLEDGER BLOCKCHAIN TEST");
console.log("========================================");

const telemetryFile =
  new URL("../../backend/data/telemetry.json", import.meta.url);

const telemetryData = JSON.parse(
  readFileSync(telemetryFile, "utf8")
) as Telemetry[];

if (telemetryData.length === 0) {
  throw new Error(
    "No telemetry records found in backend/data/telemetry.json"
  );
}

const telemetry = telemetryData[0];

console.log("\n[1] Telemetry selected:");
console.log(telemetry);

const telemetryHash = hashTelemetry(telemetry);

console.log("\n[2] SHA-256 hash:");
console.log(telemetryHash);

const bytes32Hash = `0x${telemetryHash}`;

console.log("\n[3] Connecting to local blockchain...");

const { ethers } = await network.connect();

const contract = await ethers.getContractAt(
  "TelemetryRegistry",
  CONTRACT_ADDRESS
);

console.log("Connected to TelemetryRegistry.");
console.log("Contract:", CONTRACT_ADDRESS);

console.log("\n[4] Recording telemetry hash on blockchain...");

const transaction = await contract.recordTelemetry(
  telemetry.satelliteId,
  DATA_ID,
  bytes32Hash
);

console.log("Transaction submitted:");
console.log(transaction.hash);

const receipt = await transaction.wait();

console.log("Transaction confirmed.");
console.log("Block number:", receipt?.blockNumber);

console.log("\n[5] Reading telemetry record from blockchain...");

const record = await contract.getTelemetryRecord(DATA_ID);

const satelliteId = record[0];
const dataId = record[1];
const blockchainHash = record[2];
const blockchainTimestamp = record[3];

console.log("\nBlockchain Record:");
console.log({
  satelliteId,
  dataId,
  telemetryHash: blockchainHash,
  timestamp: blockchainTimestamp.toString(),
});

console.log("\n[6] Verifying retrieved blockchain hash...");

const normalizedBlockchainHash = blockchainHash.toLowerCase();
const normalizedCalculatedHash = bytes32Hash.toLowerCase();

const hashesMatch =
  normalizedBlockchainHash === normalizedCalculatedHash;

console.log("Calculated hash:");
console.log(bytes32Hash);

console.log("Blockchain hash:");
console.log(blockchainHash);

console.log("\nHash match:");
console.log(hashesMatch);

if (!hashesMatch) {
  throw new Error(
    "Blockchain hash does not match calculated telemetry hash."
  );
}

console.log("\n========================================");
console.log("   BLOCKCHAIN TEST PASSED");
console.log("========================================");