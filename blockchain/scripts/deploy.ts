import { network } from "hardhat";

const { ethers } = await network.connect();

const telemetryRegistry = await ethers.deployContract("TelemetryRegistry");

await telemetryRegistry.waitForDeployment();

console.log("TelemetryRegistry deployed successfully.");
console.log("Contract address:", await telemetryRegistry.getAddress());