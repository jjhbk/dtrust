// components/BountyCard.js
import React, { useState } from "react";
import VoteModal from "./ votemodal";

const BountyCard = ({ key, bounty, isLoggedin }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVoteClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-md p-4 bg-white border rounded shadow-md">
      <h2 className="mb-2 text-xl font-bold">Bounty {key}</h2>
      <p>
        <strong>Creator:</strong> {bounty.creator}
      </p>
      <div className="flex items-center justify-center mb-4 overflow-hidden bg-gray-200 rounded">
        <img src={bounty.proof} alt="Bounty" className="object-cover w-full h-40" />
      </div>
      <p>
        <strong>Token:</strong> {bounty.token}
      </p>
      <p>
        <strong>Amount:</strong> {bounty.amount}
      </p>
      <p>
        <strong>True Votes:</strong> {bounty.trueVotes}
      </p>
      <p>
        <strong>False Votes:</strong> {bounty.falseVotes}
      </p>
      <p>
        <strong>Vote Threshold:</strong> {bounty.voteThreshold}
      </p>
      <p>
        <strong>Deadline:</strong> {new Date(bounty.deadline * 1000).toLocaleString()}
      </p>
      <p>
        <strong>Is Completed:</strong> {bounty.isCompleted ? "Yes" : "No"}
      </p>
      <p>
        <strong>Final Outcome:</strong> {bounty.finalOutcome ? "True" : "False"}
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
