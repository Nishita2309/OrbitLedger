import { useEffect, useState } from "react";

import {
    getHealth,
    getTelemetry,
    recordTelemetry,
    verifyTelemetry,
    getBlockchainRecord
} from "./api";

function App() {
    const [health, setHealth] = useState(null);
    const [telemetry, setTelemetry] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedDataId, setSelectedDataId] =
        useState("TEL-001");

    const [actionLoading, setActionLoading] =
        useState(false);

    const [actionMessage, setActionMessage] =
        useState("");

    const [actionError, setActionError] =
        useState("");

    const [verificationResult, setVerificationResult] =
        useState(null);

    const [blockchainRecord, setBlockchainRecord] =
        useState(null);

    useEffect(() => {
        async function loadDashboard() {
            try {
                setLoading(true);
                setError("");

                const [
                    healthResponse,
                    telemetryResponse
                ] = await Promise.all([
                    getHealth(),
                    getTelemetry()
                ]);

                setHealth(healthResponse);
                setTelemetry(
                    telemetryResponse.data
                );

                if (
                    telemetryResponse.data.length > 0
                ) {
                    setSelectedDataId("TEL-001");
                }
            } catch (err) {
                console.error(err);

                setError(
                    err.message ||
                    "Failed to load dashboard."
                );
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    const latestTelemetry =
        telemetry.length > 0
            ? telemetry[telemetry.length - 1]
            : null;

    async function handleRecord() {
        try {
            setActionLoading(true);
            setActionMessage("");
            setActionError("");
            setVerificationResult(null);
            setBlockchainRecord(null);

            const result =
                await recordTelemetry(
                    selectedDataId
                );

            setActionMessage(
                "Telemetry hash recorded successfully."
            );

            setBlockchainRecord({
                dataId: result.data.dataId,
                satelliteId:
                    result.data.satelliteId,
                telemetryHash:
                    result.data.telemetryHash,
                transactionHash:
                    result.data.transactionHash,
                blockNumber:
                    result.data.blockNumber,
                contractAddress:
                    result.data.contractAddress
            });
        } catch (err) {
            console.error(err);

            setActionError(
                err.message ||
                "Failed to record telemetry."
            );
        } finally {
            setActionLoading(false);
        }
    }

    async function handleVerify() {
        try {
            setActionLoading(true);
            setActionMessage("");
            setActionError("");
            setVerificationResult(null);

            const result =
                await verifyTelemetry(
                    selectedDataId
                );

            setVerificationResult(
                result.data
            );

            if (
                result.data.integrityStatus ===
                "VERIFIED"
            ) {
                setActionMessage(
                    "TELEMETRY VERIFIED"
                );
            } else {
                setActionError(
                    "INTEGRITY VIOLATION"
                );
            }
        } catch (err) {
            console.error(err);

            setActionError(
                err.message ||
                "Failed to verify telemetry."
            );
        } finally {
            setActionLoading(false);
        }
    }

    async function handleBlockchainRecord() {
        try {
            setActionLoading(true);
            setActionMessage("");
            setActionError("");
            setBlockchainRecord(null);

            const result =
                await getBlockchainRecord(
                    selectedDataId
                );

            setBlockchainRecord(
                result.data
            );

            setActionMessage(
                "Blockchain record retrieved."
            );
        } catch (err) {
            console.error(err);

            setActionError(
                err.message ||
                "Failed to retrieve blockchain record."
            );
        } finally {
            setActionLoading(false);
        }
    }

    function selectTelemetry(index) {
        const dataId =
            `TEL-${String(index + 1).padStart(3, "0")}`;

        setSelectedDataId(dataId);

        setActionMessage("");
        setActionError("");
        setVerificationResult(null);
        setBlockchainRecord(null);
    }

    return (
        <div className="app">
            <header className="header">
                <div>
                    <p className="eyebrow">
                        BLOCKCHAIN TELEMETRY INTEGRITY
                    </p>

                    <h1>OrbitLedger</h1>

                    <p className="subtitle">
                        Satellite Telemetry Integrity
                        & Verification System
                    </p>
                </div>

                <div className="system-status">
                    <span
                        className={
                            health?.success
                                ? "status-dot online"
                                : "status-dot"
                        }
                    />

                    <span>
                        {health?.success
                            ? "SYSTEM ONLINE"
                            : "SYSTEM OFFLINE"}
                    </span>
                </div>
            </header>

            <main className="dashboard">
                {loading && (
                    <div className="message-card">
                        Loading telemetry...
                    </div>
                )}

                {error && (
                    <div className="message-card error">
                        <strong>
                            Connection Error
                        </strong>

                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <section className="hero-card">
                            <div>
                                <p className="card-label">
                                    SIMULATED SATELLITE
                                    TELEMETRY
                                </p>

                                <h2>
                                    {latestTelemetry
                                        ?.satelliteId ||
                                        "SAT-001"}
                                </h2>

                                <p>
                                    Telemetry records stored
                                    off-chain with blockchain
                                    integrity verification.
                                </p>
                            </div>

                            <div className="hero-status">
                                <span className="status-dot online" />
                                ACTIVE
                            </div>
                        </section>

                        <section className="stats-grid">
                            <div className="stat-card">
                                <span>
                                    TELEMETRY RECORDS
                                </span>

                                <strong>
                                    {telemetry.length}
                                </strong>
                            </div>

                            <div className="stat-card">
                                <span>
                                    SATELLITE
                                </span>

                                <strong>
                                    {latestTelemetry
                                        ?.satelliteId ||
                                        "N/A"}
                                </strong>
                            </div>

                            <div className="stat-card">
                                <span>
                                    COMMUNICATION
                                </span>

                                <strong>
                                    {latestTelemetry
                                        ?.communicationStatus ||
                                        "N/A"}
                                </strong>
                            </div>

                            <div className="stat-card">
                                <span>
                                    ORIENTATION
                                </span>

                                <strong>
                                    {latestTelemetry
                                        ?.orientation ||
                                        "N/A"}
                                </strong>
                            </div>
                        </section>

                        <section className="verification-panel">
                            <div className="section-heading">
                                <div>
                                    <p className="card-label">
                                        BLOCKCHAIN INTEGRITY
                                    </p>

                                    <h2>
                                        Verify Telemetry
                                    </h2>
                                </div>

                                <div className="selected-id">
                                    {selectedDataId}
                                </div>
                            </div>

                            <p className="verification-description">
                                Select a telemetry record and
                                record its SHA-256 hash on the
                                blockchain or verify its
                                integrity against the registered
                                blockchain hash.
                            </p>

                            <div className="verification-controls">
                                <select
                                    value={selectedDataId}
                                    onChange={(event) =>
                                        selectTelemetry(
                                            Number(
                                                event.target.value
                                                    .replace(
                                                        "TEL-",
                                                        ""
                                                    )
                                            ) - 1
                                        )
                                    }
                                >
                                    {telemetry.map(
                                        (_, index) => {
                                            const dataId =
                                                `TEL-${String(
                                                    index + 1
                                                ).padStart(
                                                    3,
                                                    "0"
                                                )}`;

                                            return (
                                                <option
                                                    key={dataId}
                                                    value={dataId}
                                                >
                                                    {dataId}
                                                </option>
                                            );
                                        }
                                    )}
                                </select>

                                <button
                                    onClick={
                                        handleRecord
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                >
                                    {actionLoading
                                        ? "PROCESSING..."
                                        : "RECORD HASH"}
                                </button>

                                <button
                                    className="secondary-button"
                                    onClick={
                                        handleVerify
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                >
                                    {actionLoading
                                        ? "PROCESSING..."
                                        : "VERIFY INTEGRITY"}
                                </button>

                                <button
                                    className="secondary-button"
                                    onClick={
                                        handleBlockchainRecord
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                >
                                    VIEW BLOCKCHAIN RECORD
                                </button>
                            </div>

                            {actionMessage && (
                                <div className="action-message success-message">
                                    {actionMessage}
                                </div>
                            )}

                            {actionError && (
                                <div className="action-message error-message">
                                    {actionError}
                                </div>
                            )}

                            {verificationResult && (
                                <div
                                    className={
                                        verificationResult
                                            .integrityStatus ===
                                        "VERIFIED"
                                            ? "verification-result verified"
                                            : "verification-result violation"
                                    }
                                >
                                    <div>
                                        <span className="result-label">
                                            INTEGRITY STATUS
                                        </span>

                                        <strong>
                                            {
                                                verificationResult
                                                    .integrityStatus
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span className="result-label">
                                            HASH MATCH
                                        </span>

                                        <strong>
                                            {
                                                verificationResult
                                                    .hashesMatch
                                                    ? "YES"
                                                    : "NO"
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span className="result-label">
                                            BLOCKCHAIN CHECK
                                        </span>

                                        <strong>
                                            {
                                                verificationResult
                                                    .blockchainVerification
                                                    ? "PASSED"
                                                    : "FAILED"
                                            }
                                        </strong>
                                    </div>
                                </div>
                            )}

                            {blockchainRecord && (
                                <div className="blockchain-card">
                                    <div className="blockchain-header">
                                        <div>
                                            <span className="result-label">
                                                BLOCKCHAIN RECORD
                                            </span>

                                            <h3>
                                                {
                                                    blockchainRecord.dataId
                                                }
                                            </h3>
                                        </div>

                                        <span className="chain-badge">
                                            ON-CHAIN
                                        </span>
                                    </div>

                                    <div className="blockchain-grid">
                                        <div>
                                            <span>
                                                SATELLITE
                                            </span>

                                            <strong>
                                                {
                                                    blockchainRecord
                                                        .satelliteId
                                                }
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                BLOCK NUMBER
                                            </span>

                                            <strong>
                                                {
                                                    blockchainRecord
                                                        .blockNumber ||
                                                        "—"
                                                }
                                            </strong>
                                        </div>

                                        <div className="hash-field">
                                            <span>
                                                TELEMETRY HASH
                                            </span>

                                            <code>
                                                {
                                                    blockchainRecord
                                                        .telemetryHash
                                            }
                                            </code>
                                        </div>

                                        {blockchainRecord.transactionHash && (
                                            <div className="hash-field">
                                                <span>
                                                    TRANSACTION HASH
                                                </span>

                                                <code>
                                                    {
                                                        blockchainRecord
                                                            .transactionHash
                                                    }
                                                </code>
                                            </div>
                                        )}

                                        {blockchainRecord.contractAddress && (
                                            <div className="hash-field">
                                                <span>
                                                    CONTRACT ADDRESS
                                                </span>

                                                <code>
                                                    {
                                                        blockchainRecord
                                                            .contractAddress
                                                    }
                                                </code>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </section>

                        <section className="telemetry-section">
                            <div className="section-heading">
                                <div>
                                    <p className="card-label">
                                        LIVE DATA FEED
                                    </p>

                                    <h2>
                                        Telemetry Records
                                    </h2>
                                </div>

                                <span className="record-count">
                                    {telemetry.length} records
                                </span>
                            </div>

                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>DATA</th>
                                            <th>TIME</th>
                                            <th>TEMP</th>
                                            <th>BATTERY</th>
                                            <th>SOLAR</th>
                                            <th>ALTITUDE</th>
                                            <th>VELOCITY</th>
                                            <th>STATUS</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {telemetry.map(
                                            (record, index) => {
                                                const dataId =
                                                    `TEL-${String(
                                                        index + 1
                                                    ).padStart(
                                                        3,
                                                        "0"
                                                    )}`;

                                                return (
                                                    <tr
                                                        key={`${record.timestamp}-${index}`}
                                                        className={
                                                            selectedDataId ===
                                                            dataId
                                                                ? "selected-row"
                                                                : ""
                                                        }
                                                        onClick={() =>
                                                            selectTelemetry(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <td>
                                                            {dataId}
                                                        </td>

                                                        <td>
                                                            {new Date(
                                                                record.timestamp
                                                            ).toLocaleString()}
                                                        </td>

                                                        <td>
                                                            {
                                                                record.temperature
                                                            }°C
                                                        </td>

                                                        <td>
                                                            {
                                                                record.batteryPercentage
                                                            }%
                                                        </td>

                                                        <td>
                                                            {
                                                                record.solarPower
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                record.altitude
                                                            } km
                                                        </td>

                                                        <td>
                                                            {
                                                                record.velocity
                                                            } km/s
                                                        </td>

                                                        <td>
                                                            <span className="badge">
                                                                {
                                                                    record.communicationStatus
                                                                }
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}
            </main>

            <footer>
                <span>ORBITLEDGER</span>

                <span>
                    SIMULATED DATA • LOCAL DEVELOPMENT
                </span>
            </footer>
        </div>
    );
}

export default App;