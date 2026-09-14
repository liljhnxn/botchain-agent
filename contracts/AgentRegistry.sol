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

    struct PayoutSettings {
        address wallet;
        uint256 interval;
        bool automatic;
        uint256 lastPayoutAt;
    }

    Agent[] private agents;
    mapping(uint256 => PayoutSettings) private payoutSettings;

    /// @notice Emitted whenever a new agent is listed.
    event AgentListed(
        uint256 indexed id,
        address indexed creator,
        string name,
        string price
    );

    event AgentUpdated(uint256 indexed id, string name, string price);
    event PayoutSettingsUpdated(uint256 indexed id, address indexed wallet, uint256 interval, bool automatic);
    event PayoutWithdrawn(uint256 indexed id, address indexed wallet, uint256 amount);

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

    /// @notice Update public metadata for a listing. Only its creator may update it.
    function updateAgent(
        uint256 id,
        string calldata name,
        string calldata category,
        string calldata price,
        string calldata description,
        string calldata usageTier
    ) external {
        require(id < agents.length, "invalid id");
        require(agents[id].creator == msg.sender, "creator only");
        require(bytes(name).length > 0, "name required");
        require(bytes(price).length > 0, "price required");

        Agent storage agent = agents[id];
        agent.name = name;
        agent.category = category;
        agent.price = price;
        agent.description = description;
        agent.usageTier = usageTier;

        emit AgentUpdated(id, name, price);
    }

    /// @notice Set the wallet and schedule used for creator payouts.
    function setPayoutSettings(uint256 id, address wallet, uint256 interval, bool automatic) external {
        require(id < agents.length, "invalid id");
        require(agents[id].creator == msg.sender, "creator only");
        require(wallet != address(0), "wallet required");

        payoutSettings[id] = PayoutSettings({
            wallet: wallet,
            interval: interval,
            automatic: automatic,
            lastPayoutAt: payoutSettings[id].lastPayoutAt
        });

        emit PayoutSettingsUpdated(id, wallet, interval, automatic);
    }

    /// @notice Read payout configuration for a listing.
    function getPayoutSettings(uint256 id) external view returns (PayoutSettings memory) {
        require(id < agents.length, "invalid id");
        return payoutSettings[id];
    }

    /// @notice Withdraw native BOT held by the registry to the configured payout wallet.
    function withdrawPayout(uint256 id, uint256 amount) external {
        require(id < agents.length, "invalid id");
        require(agents[id].creator == msg.sender, "creator only");

        PayoutSettings storage settings = payoutSettings[id];
        require(settings.wallet != address(0), "payout wallet not set");
        require(amount > 0 && amount <= address(this).balance, "invalid amount");
        if (settings.automatic && settings.interval > 0) {
            require(block.timestamp >= settings.lastPayoutAt + settings.interval, "payout interval active");
        }

        settings.lastPayoutAt = block.timestamp;
        (bool sent, ) = payable(settings.wallet).call{value: amount}("");
        require(sent, "payout failed");
        emit PayoutWithdrawn(id, settings.wallet, amount);
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

    /// @notice Accept native BOT payments that can later be withdrawn as creator payouts.
    receive() external payable {}

    /// @notice Read every listed agent (convenience for small catalogs / demos).
    function getAllAgents() external view returns (Agent[] memory) {
        return agents;
    }
}
