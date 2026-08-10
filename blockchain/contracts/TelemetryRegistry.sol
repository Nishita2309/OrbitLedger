// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TelemetryRegistry {
    struct TelemetryRecord {
        string satelliteId;
        string dataId;
        bytes32 telemetryHash;
        uint256 timestamp;
    }

    mapping(string => TelemetryRecord) private records;

    event TelemetryRecorded(
        string indexed satelliteId,
        string indexed dataId,
        bytes32 telemetryHash,
        uint256 timestamp
    );

    function recordTelemetry(
        string calldata satelliteId,
        string calldata dataId,
        bytes32 telemetryHash
    ) external {
        require(bytes(satelliteId).length > 0, "Satellite ID required");
        require(bytes(dataId).length > 0, "Data ID required");
        require(telemetryHash != bytes32(0), "Telemetry hash required");

        records[dataId] = TelemetryRecord({
            satelliteId: satelliteId,
            dataId: dataId,
            telemetryHash: telemetryHash,
            timestamp: block.timestamp
        });

        emit TelemetryRecorded(
            satelliteId,
            dataId,
            telemetryHash,
            block.timestamp
        );
    }

    function getTelemetryRecord(
        string calldata dataId
    )
        external
        view
        returns (
            string memory satelliteId,
            string memory returnedDataId,
            bytes32 telemetryHash,
            uint256 timestamp
        )
    {
        TelemetryRecord memory record = records[dataId];

        require(
            bytes(record.dataId).length > 0,
            "Telemetry record not found"
        );

        return (
            record.satelliteId,
            record.dataId,
            record.telemetryHash,
            record.timestamp
        );
    }

    function verifyTelemetry(
        string calldata dataId,
        bytes32 calculatedHash
    ) external view returns (bool) {
        TelemetryRecord memory record = records[dataId];

        require(
            bytes(record.dataId).length > 0,
            "Telemetry record not found"
        );

        return record.telemetryHash == calculatedHash;
    }
}