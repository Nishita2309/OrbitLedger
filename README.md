# 🛰️ OrbitLedger

### Blockchain-Based Satellite Telemetry Integrity & Verification System

OrbitLedger is a blockchain-based satellite telemetry integrity system designed to detect unauthorized modification of satellite telemetry data.

The system stores simulated satellite telemetry data off-chain, generates a cryptographic SHA-256 hash for each telemetry record, and stores the hash on a blockchain using a Solidity smart contract.

When verification is requested, OrbitLedger recalculates the telemetry hash and compares it with the immutable hash stored on the blockchain.

If the hashes match, the telemetry is verified.

If the hashes differ, the system detects an integrity violation.

---

## 🚀 Project Overview

Satellite telemetry is critical for monitoring spacecraft health and operational conditions.

However, storing all telemetry data directly on a blockchain is inefficient because of blockchain storage limitations and transaction costs.

OrbitLedger uses a hybrid architecture:

```text
Satellite Telemetry
       │
       ▼
 Off-Chain Storage
       │
       ▼
    SHA-256
       │
       ▼
 Cryptographic Hash
       │
       ▼
   Blockchain
       │
       ▼
TelemetryRegistry

✨ Features
🛰️ Simulated satellite telemetry
📊 Telemetry dashboard
🔐 SHA-256 cryptographic hashing
⛓️ Blockchain-based hash registration
📝 Solidity smart contract
🔎 Telemetry integrity verification
🚨 Tampering detection
🌐 REST API
⚛️ React frontend
🔗 Ethers.js blockchain integration
🧪 Local Hardhat blockchain
💾 Off-chain JSON telemetry storage
📡 Blockchain record retrieval
🏗️ System Architecture
                    ORBITLEDGER
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
   React Frontend                Telemetry Data
   localhost:5173                telemetry.json
          │                             │
          │ HTTP                        │
          └──────────────┬──────────────┘
                         ▼
                 Express Backend
                 localhost:5000
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
          SHA-256               Ethers.js
              │                     │
              │                     ▼
              │              Hardhat Network
              │                localhost:8545
              │                     │
              │                     ▼
              │             TelemetryRegistry
              │                Smart Contract
              │
              └──────────────┐
                             ▼
                       Verification
                             │
                   ┌─────────┴─────────┐
                   │                   │
               Hash Match          Hash Mismatch
                   │                   │
                   ▼                   ▼
               VERIFIED        INTEGRITY VIOLATION
🛠️ Tech Stack
Frontend
React
Vite
JavaScript
CSS
Backend
Node.js
Express.js
Ethers.js
CORS
Blockchain
Solidity
Hardhat
Ethers.js
Hardhat Local Network
Security
SHA-256
Cryptographic hashing
Blockchain-based integrity verification
Data Storage
JSON-based off-chain telemetry storage
📂 Project Structure
OrbitLedger/
│
├── blockchain/
│   ├── contracts/
│   │   └── TelemetryRegistry.sol
│   │
│   ├── scripts/
│   │   └── deploy.ts
│   │
│   ├── hardhat.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── backend/
│   ├── data/
│   │   └── telemetry.json
│   │
│   ├── src/
│   │   ├── blockchain/
│   │   ├── telemetry/
│   │   └── server.js
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
⚙️ Prerequisites

Make sure the following are installed:

Node.js
npm
Git
JavaScript/TypeScript runtime
Hardhat

Check your installations:

node --version
npm --version
git --version
npx hardhat --version
🚀 Installation
1. Clone the Repository
git clone https://github.com/Nishita2309/OrbitLedger.git

Enter the project:

cd OrbitLedger
2. Install Blockchain Dependencies
cd blockchain
npm install
3. Install Backend Dependencies
cd ../backend
npm install
4. Install Frontend Dependencies
cd ../frontend
npm install
▶️ Running OrbitLedger

OrbitLedger requires three main services:

Hardhat Blockchain
       +
Express Backend
       +
React Frontend

Run each service in a separate terminal.

⛓️ 1. Start the Hardhat Blockchain

Open Terminal 1:

cd OrbitLedger/blockchain

Run:

npx hardhat node

The local blockchain will run at:

http://127.0.0.1:8545

Hardhat provides local test accounts with test ETH.

⚠️ The private keys displayed by Hardhat are publicly known test keys. Never use them on a real network.

📜 2. Compile the Smart Contract

Open Terminal 2:

cd OrbitLedger/blockchain

Run:

npx hardhat compile
🚀 3. Deploy the Smart Contract

Run:

npx hardhat run scripts/deploy.ts --network localhost

You should see:

TelemetryRegistry deployed successfully.
Contract address: 0x...

The deployed contract address is then used by the backend.

🖥️ 4. Start the Backend

Open Terminal 3:

cd OrbitLedger/backend

Run:

npm run dev

The backend runs at:

http://localhost:5000
⚛️ 5. Start the Frontend

Open Terminal 4:

cd OrbitLedger/frontend

Run:

npm run dev

Open the application in your browser:

http://localhost:5173
🌐 Backend API

OrbitLedger provides the following REST endpoints.

Health Check
GET /api/health

Example:

curl http://localhost:5000/api/health
Get Telemetry
GET /api/telemetry

Returns the available telemetry records.

Record Telemetry Hash
POST /api/telemetry/:dataId/record

Example:

POST /api/telemetry/TEL-001/record

This operation:

Finds the telemetry record.
Generates its SHA-256 hash.
Sends the hash to the smart contract.
Stores the hash on the blockchain.
Returns the blockchain transaction information.
Verify Telemetry
POST /api/telemetry/:dataId/verify

Example:

POST /api/telemetry/TEL-001/verify

The backend:

Reads the current telemetry.
Recalculates the SHA-256 hash.
Retrieves the blockchain hash.
Compares both hashes.
Returns the integrity status.

Possible result:

VERIFIED

or:

INTEGRITY_VIOLATION
Retrieve Blockchain Record
GET /api/telemetry/:dataId/blockchain

Example:

GET /api/telemetry/TEL-001/blockchain

Returns the telemetry information stored on-chain.

🔐 Integrity Verification Process

The integrity verification process works as follows:

                    Original Telemetry
                           │
                           ▼
                       SHA-256
                           │
                           ▼
                    Original Hash
                           │
                           ▼
                       Blockchain
                           │
                           │
                    Later Verification
                           │
                           ▼
                  Current Telemetry
                           │
                           ▼
                       SHA-256
                           │
                           ▼
                    Calculated Hash
                           │
                           ▼
                 Compare Both Hashes
                           │
                 ┌─────────┴─────────┐
                 │                   │
              MATCH              DIFFERENT
                 │                   │
                 ▼                   ▼
             VERIFIED          INTEGRITY
                               VIOLATION
🚨 Tampering Demonstration

OrbitLedger includes a demonstration showing how unauthorized modification can be detected.

Original Telemetry

For example:

{
  "satelliteId": "SAT-001",
  "temperature": 27.2
}

The system generates a SHA-256 hash and stores it on the blockchain.

Tampering

The telemetry can be modified:

temperature: 27.2

to:

temperature: 99.9

The modified telemetry produces a completely different SHA-256 hash.

Verification Result

The blockchain still contains the original hash.

Therefore:

Calculated Hash
      ≠
Blockchain Hash

The system reports:

INTEGRITY_VIOLATION
🔄 Data Restoration

After the tampering demonstration, the original telemetry should be restored.

The project uses the original telemetry dataset for normal operation.

🧪 Testing

The following components have been tested:

Blockchain connection
Smart contract deployment
Backend health endpoint
Telemetry API
Telemetry hash recording
Blockchain record retrieval
Telemetry verification
React dashboard
Frontend-to-backend communication
Blockchain verification UI
Tampering detection
Telemetry restoration
End-to-end workflow
✅ Verification Example

A successful verification returns:

dataId                 : TEL-001
satelliteId            : SAT-001
hashesMatch            : True
blockchainVerification : True
integrityStatus        : VERIFIED
message                : TELEMETRY VERIFIED

A tampered record produces:

hashesMatch            : False
blockchainVerification : False
integrityStatus        : INTEGRITY_VIOLATION
message                : INTEGRITY VIOLATION
🎯 Project Objectives

OrbitLedger demonstrates how blockchain can be used as a tamper-evident integrity layer for satellite telemetry.

The main objectives are:

Generate simulated satellite telemetry.
Store telemetry off-chain.
Generate cryptographic hashes.
Store telemetry hashes on-chain.
Verify telemetry integrity.
Detect unauthorized modifications.
Provide a user-friendly monitoring dashboard.
💡 Why Blockchain?

The project does not store the complete telemetry dataset on-chain.

Instead, it stores a cryptographic fingerprint of the telemetry.

This provides:

Tamper evidence
Immutable integrity records
Data provenance
Efficient off-chain storage
Blockchain-based verification

The actual telemetry remains outside the blockchain while the blockchain provides an immutable reference for verification.

⚠️ Important Note

OrbitLedger uses simulated satellite telemetry for demonstration purposes.

It does not connect to real satellites or real spacecraft telemetry systems.

The blockchain component is implemented using a local Hardhat development network.

The system demonstrates data integrity and tamper detection rather than guaranteeing the physical authenticity or correctness of the original sensor measurement.

🔒 Security Considerations

The following principles are demonstrated:

SHA-256 cryptographic hashing
Immutable blockchain records
Off-chain/on-chain hybrid architecture
Hash comparison for integrity verification
Detection of modified telemetry

The local Hardhat accounts and private keys are for development purposes only.

Never use Hardhat's publicly known development private keys on a real blockchain network.

📸 Application Workflow
1. Start Hardhat
       ↓
2. Deploy TelemetryRegistry
       ↓
3. Start Backend
       ↓
4. Start React Frontend
       ↓
5. View Satellite Telemetry
       ↓
6. Record Telemetry Hash
       ↓
7. Verify Integrity
       ↓
8. View Blockchain Record
       ↓
9. Demonstrate Tampering
       ↓
10. Detect Integrity Violation
📌 Example Telemetry

The system works with telemetry fields such as:

Satellite ID
Timestamp
Temperature
Battery Voltage
Battery Percentage
Solar Power
Altitude
Velocity
Orientation
Communication Status

Example:

{
  "satelliteId": "SAT-001",
  "timestamp": "2026-08-10T16:46:24.574Z",
  "temperature": 27.2,
  "batteryVoltage": 28.79,
  "batteryPercentage": 70.1,
  "solarPower": 2.09,
  "altitude": 543.63,
  "velocity": 7.64,
  "orientation": "ADJUSTING",
  "communicationStatus": "ACTIVE"
}
🏆 Project Status
Environment Setup          ✅
Project Foundation         ✅
Satellite Telemetry        ✅
SHA-256 Integrity          ✅
Smart Contract             ✅
Blockchain Integration     ✅
Backend API                ✅
React Dashboard             ✅
Verification System        ✅
Tampering Demonstration    ✅
End-to-End Testing         ✅
Status: COMPLETE ✅
👩‍💻 Author

Nishita Pothana

GitHub:

https://github.com/Nishita2309

Repository:

https://github.com/Nishita2309/OrbitLedger

📄 License

For academic, educational, and demonstration purposes.


### Then push it

After saving `README.md`:

```powershell
cd C:\Users\Home\OrbitLedger

git add README.md
git commit -m "Add comprehensive project README"
git push origin main