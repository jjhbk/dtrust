"use client";

// components/BountyCard.js
import React, { useState } from "react";
import VoteModal from "./ votemodal";

const BountyCard = ({ bounty, isLoggedin }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVoteClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-md p-4 bg-white border rounded shadow-md">
      <h2 className="mb-2 text-xl font-bold">Bounty </h2>
      <p>
        <strong>Creator:</strong> {bounty[0]}
      </p>
      <div className="flex items-center justify-center mb-4 overflow-hidden bg-gray-200 rounded">
        <img
          src={String(
            bounty[2] + "?pinataGatewayToken=TgDG2SRhpyABS-qJQZgojr-Kf4Zg8pmCzZ8UBgZN22HfSHwMoa3HvJyp0XTwnlrK",
          )}
          alt="Bounty"
          className="object-cover w-full h-40"
        />
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
      <button
        onClick={isLoggedin ? handleVoteClick : () => alert("Please signin to vote")}
        className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Vote
      </button>

      {isModalOpen && <VoteModal closeModal={closeModal} />}
    </div>
  );
};

export default BountyCard;
