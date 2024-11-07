
# About Our Project

Indonesia, with a population exceeding 270 million, presents a complex electoral landscape, featuring over 800,000 polling stations (Tempat Pemungutan Suara, or TPS) across its vast archipelago. This extensive network poses unique challenges in conducting free, fair, and timely election results. The necessity for a transparent and accountable electoral process is paramount, especially considering issues such as corruption, misinformation, and accessibility that can erode public trust in democracy.

To address these challenges, we propose **Jurdil - Community-Based Election Recap Utilizing Blockchain Technology with Captures**:

1. **Data Capture**: Communities can participate by photographing publicly available recap forms (Formulir C1) at each polling station using the Capture Camera in their respective locations. The use of the Capture Camera is essential for ensuring the authenticity and integrity of election data. Each captured image is registered on the blockchain with immutable metadata, including timestamps, device information, and location data, preventing data tampering and providing a transparent record of the election process.

2. **Data Submission**: The data from the CID (Capture ID) and the votes for each candidate are sent to the smart contract at address **0x94650136923AC64DC428a090c253cFE26Ac18C04** on the Numbers Testnet (snow), facilitating secure, transparent, and decentralized data storage for election recap.

---

## Jurdil Voting Smart Contract

This document provides an overview of the **Jurdil** smart contract, a simple voting system designed to record votes for three candidates in a decentralized manner. This contract serves as a **prototype** and uses basic storage and event logging to meet initial testing and demonstration requirements. Future versions aim to improve decentralization and add error-handling mechanisms.

## Contract Structure

The **Jurdil** contract uses a **Poll** struct to represent voting data for each poll ID, recording the following information:

- **candidate1Votes, candidate2Votes, candidate3Votes**: Vote counts for each candidate.
- **nid**: The National ID (NID) of the voter, stored as a `uint256`. This identifier is intended to represent a unique, hashed voter ID for privacy.

A mapping called `polls` is used to store each `Poll` struct by `pollId`, allowing for quick access to each poll's voting data.

---

## Solidity Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Jurdil {
    struct Poll {
        uint256 candidate1Votes;
        uint256 candidate2Votes;
        uint256 candidate3Votes;
        uint256 nid; // Store NID as uint256 (hashed)
    }

    mapping(uint256 => Poll) public polls;

    // Event for logging poll creation
    event PollCreated(
        uint256 indexed pollId,
        uint256 nid,
        uint256 candidate1Votes,
        uint256 candidate2Votes,
        uint256 candidate3Votes
    );

    // Function to store a new poll with nid as uint256
    function storePoll(
        uint256 pollId,
        uint256 nid,
        uint256 candidate1Votes,
        uint256 candidate2Votes,
        uint256 candidate3Votes
    ) public {
        polls[pollId] = Poll(candidate1Votes, candidate2Votes, candidate3Votes, nid);
        emit PollCreated(pollId, nid, candidate1Votes, candidate2Votes, candidate3Votes);
    }

    // Function to retrieve poll results by poll ID
    function getPollResults(uint256 pollId) public view returns (uint256, uint256, uint256, uint256) {
        Poll memory poll = polls[pollId];
        return (poll.candidate1Votes, poll.candidate2Votes, poll.candidate3Votes, poll.nid);
    }
}
```

---

## React Setup

In the project directory, run the following commands to set up and test the React frontend:

```npm start
Starts the app in development mode.
Open http://localhost:3000 to view it in your browser. The page will reload when changes are made, and lint errors will be displayed in the console.

npm test
Launches the test runner in interactive watch mode.
Refer to the React testing documentation for more information.


npm run build
Builds the app for production in the build folder, optimizing the build for best performance. The build is minified, and filenames include hashes.


npm run eject
Removes the single build dependency for greater customization.


```

---

## Express and Database Configuration
This server setup facilitates storing and retrieving voting event data derived from a Solidity contract into a PostgreSQL database. It uses Express.js as the backend framework, with configuration to support reading and writing Solidity event data.

### Note:
We will adopt a more decentralized system in the future; the use of PostgreSQL and basic event reading here serves only as a prototype.

---

### Key Components

Express Framework: Manages HTTP requests.

PostgreSQL Database: Stores event data such as poll IDs, vote counts for candidates, and transaction hashes.

CORS: Configured to allow requests from a specific frontend origin.

Environment Setup and Middleware Configuration
Environment Variables: Sensitive information, like the database URL, is managed using a .env file.

CORS: Cross-origin resource sharing is set up to accept requests from http://localhost:3000.

Body Parser: Parses incoming JSON request bodies.

---

## Configure .env (voting-app-server)

DATABASE_URL= your postgreconfiguration


