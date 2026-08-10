const {
    getBlockchainStatus,
    getTelemetryRecord
} = require("./blockchainService");

async function main() {
    console.log("========================================");
    console.log("   ORBITLEDGER BACKEND BLOCKCHAIN TEST");
    console.log("========================================");

    console.log("\n[1] Checking blockchain connection...\n");

    const status = await getBlockchainStatus();

    console.log(status);

    console.log("\n[2] Reading TEL-001 from blockchain...\n");

    const record = await getTelemetryRecord(
        "TEL-001"
    );

    console.log(record);

    console.log("\n========================================");
    console.log("   BLOCKCHAIN SERVICE TEST PASSED");
    console.log("========================================");
}

main().catch((error) => {
    console.error("\nBLOCKCHAIN SERVICE TEST FAILED");
    console.error(error);
    process.exit(1);
});