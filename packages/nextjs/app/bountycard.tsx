"use client";

// components/BountyCard.js
import React, { useState } from "react";
import VoteModal from "./ votemodal";
import { dtrustabi } from "./abi";
import { publicClient, walletClient } from "./client";
import { useAccount } from "wagmi";

const DTRUST_ADDRESS = process.env.NEXT_PUBLIC_DTRUST_CONTRACT_ADDRESS;
const DTRUST_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_DTRUST_TOKEN_CONTRACT_ADDRESS;
const BountyCard = ({ bounty, index, isLoggedin }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { address: connectedAddress } = useAccount();

  const handleVoteClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleRefund = async (e: any) => {
    e.preventDefault();
    const { request } = await publicClient.simulateContract({
      address: DTRUST_ADDRESS as string,
      abi: dtrustabi,
      functionName: "refundBounty",
      args: [BigInt(index)],
      account: connectedAddress,
    });
    const newHash = await walletClient.writeContract(request);
    console.log(newHash);
    alert(newHash ? "refund initiated" : "error");
    // Handle file submission logic
  };
  return (
    <div className="max-w-md p-4 bg-white border rounded shadow-md">
      <h2 className="mb-2 text-xl font-bold">{bounty[11]} </h2>
      <p>
        <strong>Creator:</strong> {bounty[0]}
      </p>
      <div className="flex items-center justify-center mb-4 overflow-hidden bg-gray-200 rounded">
        <a href={bounty[2]} target="_blank">
          <img
            src={String(
              bounty[2] + "?pinataGatewayToken=TgDG2SRhpyABS-qJQZgojr-Kf4Zg8pmCzZ8UBgZN22HfSHwMoa3HvJyp0XTwnlrK",
            )}
            alt="Bounty"
            className="object-cover w-full h-40"
          />
        </a>
      </div>
      <p>
        <strong>Token:</strong> {bounty[1]}
      </p>
      <p>
        <strong>Amount:</strong> {String(bounty[3])}
      </p>
      <p>
        <strong>True Votes:</strong> {String(bounty[4])}
      </p>
      <p>
        <strong>False Votes:</strong> {String(bounty[5])}
      </p>
      <p>
        <strong>Vote Threshold:</strong> {String(bounty[6])}
      </p>
      <p>
        <strong>Deadline:</strong> {String(bounty[7])}
      </p>
      <p>
        <strong>Is Completed:</strong> {bounty[8] ? "Yes" : "No"}
      </p>
      <p>
        <strong>Final Outcome:</strong> {bounty[9] ? "True" : "False"}
      </p>
      <div className="flex justify-between items-center p-4 border rounded bg-gray-100">
        {/* Left Button */}
        <button
          onClick={isLoggedin ? handleVoteClick : () => alert("Please signin to vote")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Vote
        </button>

        {/* Right Button */}
        <button
          onClick={isLoggedin ? handleRefund : () => alert("Please signin to request refund")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Refund
        </button>
      </div>

      {isModalOpen && <VoteModal closeModal={closeModal} index={index} />}
    </div>
  );
};

export default BountyCard;
