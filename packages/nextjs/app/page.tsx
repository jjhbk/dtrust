"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { dtrustabi, dtrusttokenabi } from "./abi";
import BountyCard from "./bountycard";
import { publicClient, walletClient } from "./client";
import NFTUploader from "./nftuploader";
import { verify } from "./verify";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { type IVerifyResponse, verifyCloudProof } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import type { NextPage } from "next";
import { PinataSDK } from "pinata-web3";
import { json } from "stream/consumers";
import { getContract } from "viem";
import { rootstockTestnet } from "viem/chains";
import { useAccount } from "wagmi";
import { useReadContract } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const PINATA_JWT_KEY = process.env.NEXT_PUBLIC_PINATA_JWT_KEY;
const PINATA_GATEWAY_URL = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL;
const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [isLoggedin, setIsLoggedIn] = useState(false);
  const [bounties, setBounties] = useState<any>([
    // Add more bounty objects as needed
  ]);
  useEffect(() => {
    fetchBounties();
  }, [bounties.length]);
  // 2. Call contract methods, fetch events, listen to events, etc.
  const fetchBounties = async () => {
    // 1. Create contract instance
    console.log("fetching bounties");
    const contract = await getContract({
      address: "0xFe9c4fA65f3A0Da7Ac2D399F52E77a67ac5a244E",
      abi: dtrustabi,
      // 1a. Insert a single client
      // 1b. Or public and/or wallet clients
      client: publicClient,
    });
    const bountycount = await contract.read.bountyCounter();
    let _bounties = [];

    for (let i = 0; i < bountycount; i++) {
      const result = await contract.read.bounties([BigInt(1)]);
      console.log("result is:", result);
      // const file = await fetchFiles(result[2]);
      // console.log(file);
      _bounties.push(result);
    }
    setBounties([..._bounties]);

    /* const { request } = await publicClient.simulateContract({
      address: "0x870d1d8665588513afFe26B446385ffa4ec8eeC2",
      abi: dtrusttokenabi,
      functionName: "approve",
      args: ["0xFe9c4fA65f3A0Da7Ac2D399F52E77a67ac5a244E", BigInt(1000000000000000000)],
      account: connectedAddress,
    });
    const hash = await walletClient.writeContract(request);
    console.log(hash);

     const { request } = await publicClient.simulateContract({
      address: "0xFe9c4fA65f3A0Da7Ac2D399F52E77a67ac5a244E",
      abi: dtrustabi,
      functionName: "createBounty",
      args: [
        "0xb40045ef09c8a0cb04c26e7e5b31338f1ab2a4a9",
        BigInt(1000000000),
        BigInt(1),
        BigInt(2100),
        "https://cyan-elaborate-puffin-862.mypinata.cloud/ipfs/bafkreifaoqggdi45zi4j2uljxeijkl2sxiln5mvxgkacbu2gzj5jeqrkxq",
      ],
      account: connectedAddress,
    });
    const newHash = await walletClient.writeContract(request);
    console.log(newHash);
    const { request } = await publicClient.simulateContract({
      address: "0xFe9c4fA65f3A0Da7Ac2D399F52E77a67ac5a244E",
      abi: dtrustabi,
      functionName: "vote",
      args: [
        BigInt(1),
        true,
        "https://cyan-elaborate-puffin-862.mypinata.cloud/ipfs/bafkreifaoqggdi45zi4j2uljxeijkl2sxiln5mvxgkacbu2gzj5jeqrkxq",
      ],
      account: connectedAddress,
    });
    const newHash1 = await walletClient.writeContract(request);
    console.log(newHash);

    const { request } = await publicClient.simulateContract({
      address: "0xFe9c4fA65f3A0Da7Ac2D399F52E77a67ac5a244E",
      abi: dtrustabi,
      functionName: "refundBounty",
      args: [BigInt(1)],
      account: connectedAddress,
    });
    const newHash = await walletClient.writeContract(request);
    console.log(newHash);*/
  };

  const fetchFiles = async (cid: string) => {
    cid = cid.replace("https://cyan-elaborate-puffin-862.mypinata.cloud/ipfs/", "");
    console.log(cid);
    const pinata = new PinataSDK({
      pinataJwt: PINATA_JWT_KEY!,
      pinataGateway: PINATA_GATEWAY_URL!,
    });

    const file = await pinata.gateways.get("bafkreib4pqtikzdjlj4zigobmd63lig7u6oxlug24snlr6atjlmlza45dq");
    console.log(file);
    return file;
  };

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
          {bounties.map((bounty: any, index: any) => (
            <BountyCard key={index} bounty={bounty} index={index + 1} isLoggedin={isLoggedin} />
          ))}
        </div>
        <button onClick={fetchBounties}>test</button>
      </div>
    </>
  );
};

export default Home;
