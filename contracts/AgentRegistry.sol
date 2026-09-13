// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title AgentRegistry
/// @notice On-chain registry of AI agents listed on the Botchain marketplace.
///         Each listing records the creator and the agent's public metadata so
///         the marketplace can be verified on-chain instead of trusting a
///         centralized database.
contract AgentRegistry {
    struct Agent {
        uint256 id;
        address creator;
        string name;
        string category;
        string price;
        string description;
        string usageTier;
        uint256 createdAt;
    }

    Agent[] private agents;

    /// @notice Emitted whenever a new agent is listed.
    event AgentListed(
        uint256 indexed id,
        address indexed creator,
        string name,
        string price
    );

    /// @notice List a new agent. The caller (msg.sender) is recorded as the creator.
    /// @return id The index of the newly created listing.
    function listAgent(
        string calldata name,
        string calldata category,
        string calldata price,
        string calldata description,
        string calldata usageTier
    ) external returns (uint256 id) {
        require(bytes(name).length > 0, "name required");
        require(bytes(price).length > 0, "price required");

        id = agents.length;
        agents.push(
            Agent({
                id: id,
                creator: msg.sender,
                name: name,
                category: category,
                price: price,
                description: description,
                usageTier: usageTier,
                createdAt: block.timestamp
            })
        );

        emit AgentListed(id, msg.sender, name, price);
    }

    /// @notice Total number of listed agents.
    function getAgentCount() external view returns (uint256) {
        return agents.length;
    }

    /// @notice Read a single agent by id.
    function getAgent(uint256 id) external view returns (Agent memory) {
        require(id < agents.length, "invalid id");
        return agents[id];
    }

    /// @notice Read every listed agent (convenience for small catalogs / demos).
    function getAllAgents() external view returns (Agent[] memory) {
        return agents;
    }
}
