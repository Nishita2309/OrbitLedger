const API_BASE_URL = "http://localhost:5000/api";

async function request(endpoint, options = {}) {
    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "API request failed."
        );
    }

    return data;
}

export async function getHealth() {
    return request("/health");
}

export async function getTelemetry() {
    return request("/telemetry");
}

export async function recordTelemetry(dataId) {
    return request(
        `/telemetry/${dataId}/record`,
        {
            method: "POST"
        }
    );
}

export async function verifyTelemetry(dataId) {
    return request(
        `/telemetry/${dataId}/verify`,
        {
            method: "POST"
        }
    );
}

export async function getBlockchainRecord(dataId) {
    return request(
        `/telemetry/${dataId}/blockchain`
    );
}