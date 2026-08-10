const fs = require("fs");
const path = require("path");
const {
    ethers
} = require("ethers");

require("dotenv").config();

const RPC_URL = process.env.BLOCKCHAIN_RPC_URL;

const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY;

const CONTRACT_ADDRESS =
    process.env.TELEMETRY_CONTRACT_ADDRESS;

if (!RPC_URL) {
    throw new Error(
        "BLOCKCHAIN_RPC_URL is not configured in .env"
    );
}

if (!PRIVATE_KEY) {
    throw new Error(
        "BLOCKCHAIN_PRIVATE_KEY is not configured in .env"
    );
}

if (!CONTRACT_ADDRESS) {
    throw new Error(
        "TELEMETRY_CONTRACT_ADDRESS is not configured in .env"
    );
}

const artifactPath = path.join(
    __dirname,
    "../../../blockchain/artifacts/contracts/TelemetryRegistry.sol/TelemetryRegistry.json"
);

if (!fs.existsSync(artifactPath)) {
    throw new Error(
        `TelemetryRegistry artifact not found at: ${artifactPath}`
    );
}

const artifact = JSON.parse(
    fs.readFileSync(artifactPath, "utf8")
);

const provider = new ethers.JsonRpcProvider(RPC_URL);

const wallet = new ethers.Wallet(
    PRIVATE_KEY,
    provider
);

const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    artifact.abi,
    wallet
);

async function getBlockchainStatus() {
    const network = await provider.getNetwork();

    const blockNumber = await provider.getBlockNumber();

    const balance = await provider.getBalance(
        wallet.address
    );

    return {
        networkChainId: network.chainId.toString(),
        walletAddress: wallet.address,
        balance: ethers.formatEther(balance),
        latestBlock: blockNumber,
        contractAddress: CONTRACT_ADDRESS
    };
}

async function recordTelemetryHash(
    satelliteId,
    dataId,
    telemetryHash
) {
    if (!satelliteId) {
        throw new Error("Satellite ID is required.");
    }

    if (!dataId) {
        throw new Error("Data ID is required.");
    }

    if (!telemetryHash) {
        throw new Error("Telemetry hash is required.");
    }

    const normalizedHash = telemetryHash.startsWith("0x")
        ? telemetryHash
        : `0x${telemetryHash}`;

    if (!ethers.isHexString(normalizedHash, 32)) {
        throw new Error(
            "Telemetry hash must be a valid 32-byte hexadecimal value."
        );
    }

    const transaction = await contract.recordTelemetry(
        satelliteId,
        dataId,
        normalizedHash
    );

    const receipt = await transaction.wait();

    return {
        transactionHash: transaction.hash,
        blockNumber: receipt.blockNumber,
        contractAddress: CONTRACT_ADDRESS
    };
}

async function getTelemetryRecord(dataId) {
    if (!dataId) {
        throw new Error("Data ID is required.");
    }

    const record = await contract.getTelemetryRecord(
        dataId
    );

    return {
        satelliteId: record[0],
        dataId: record[1],
        telemetryHash: record[2],
        timestamp: record[3].toString()
    };
}

async function verifyTelemetryHash(
    dataId,
    calculatedHash
) {
    if (!dataId) {
        throw new Error("Data ID is required.");
    }

    if (!calculatedHash) {
        throw new Error("Calculated hash is required.");
    }

    const normalizedHash = calculatedHash.startsWith("0x")
        ? calculatedHash
        : `0x${calculatedHash}`;

    if (!ethers.isHexString(normalizedHash, 32)) {
        throw new Error(
            "Calculated hash must be a valid 32-byte hexadecimal value."
        );
    }

    return await contract.verifyTelemetry(
        dataId,
        normalizedHash
    );
}

module.exports = {
    getBlockchainStatus,
    recordTelemetryHash,
    getTelemetryRecord,
    verifyTelemetryHash
};