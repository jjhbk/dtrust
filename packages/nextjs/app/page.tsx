"use client";

import { useState } from "react";
import Link from "next/link";
import BountyCard from "./bountycard";
import NFTUploader from "./nftuploader";
import { verify } from "./verify";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { type IVerifyResponse, verifyCloudProof } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [isLoggedin, setIsLoggedIn] = useState(false);
  const [bounties, setBounties] = useState([
    {
      creator: "0x1234567890abcdef1234567890abcdef12345678",
      token: "0xTokenAddressHere1",
      amount: 1000,
      trueVotes: 10,
      falseVotes: 5,
      voteThreshold: 20,
      deadline: Math.floor(Date.now() / 1000) + 86400, // 24 hours from now
      isCompleted: false,
      finalOutcome: false,
      proof:
        "https://cyan-elaborate-puffin-862.mypinata.cloud/ipfs/bafkreifaoqggdi45zi4j2uljxeijkl2sxiln5mvxgkacbu2gzj5jeqrkxq?pinataGatewayToken=TgDG2SRhpyABS-qJQZgojr-Kf4Zg8pmCzZ8UBgZN22HfSHwMoa3HvJyp0XTwnlrK", // Placeholder image URL
    },
    {
      creator: "0xabcdef1234567890abcdef1234567890abcdef12",
      token: "0xTokenAddressHere2",
      amount: 2000,
      trueVotes: 15,
      falseVotes: 3,
      voteThreshold: 25,
      deadline: Math.floor(Date.now() / 1000) + 172800, // 48 hours from now
      isCompleted: true,
      finalOutcome: true,
      proof: "https://via.placeholder.com/400x200", // Placeholder image URL
    },
    // Add more bounty objects as needed
  ]);
  const verifyProof = async (result: ISuccessResult) => {
    console.log("Proof received from IDKit, sending to backend:\n", JSON.stringify(result)); // Log the proof from IDKit to the console for visibility
    const data = await verify(result);
    if (data.success) {
      console.log("Successful response from backend:\n", JSON.stringify(data)); // Log the response from our backend for visibility
    } else {
      throw new Error(`Verification failed: ${data.detail}`);
    }
  };
  const onSuccess = (result: ISuccessResult) => {
    // This is where you should perform frontend actions once a user has been verified, such as redirecting to a new page
    window.alert("Successfully verified with World ID! Your nullifier hash is: " + result.nullifier_hash);
    setIsLoggedIn(true);
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        {!isLoggedin && (
          <IDKitWidget
            app_id="app_b32e11cae186caacc520668c24363699"
            action="login"
            // On-chain only accepts Orb verifications
            verification_level={VerificationLevel.Orb}
            handleVerify={verifyProof}
            onSuccess={onSuccess}
          >
            {({ open }) => (
              <button className="btn btn-wide btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-accent " onClick={open}>
                Signin with World ID
              </button>
            )}
          </IDKitWidget>
        )}

        <div className="grid gap-4 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bounties.map((bounty, index) => (
            <BountyCard key={index} bounty={bounty} isLoggedin={isLoggedin} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
