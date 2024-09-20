"use client";

import { useState } from "react";
import Link from "next/link";
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
        <NFTUploader />
        {!isLoggedin && (
          <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
            <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                <BugAntIcon className="h-8 w-8 fill-secondary" />
                <p>
                  Tinker with your smart contract using the{" "}
                  <Link href="/debug" passHref className="link">
                    Debug Contracts
                  </Link>{" "}
                  tab.
                </p>
              </div>
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
                <p>
                  Explore your local transactions with the{" "}
                  <Link href="/blockexplorer" passHref className="link">
                    Block Explorer
                  </Link>{" "}
                  tab.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
