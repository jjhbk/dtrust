"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import { dtrustabi, dtrusttokenabi } from "../abi";
import { publicClient, walletClient } from "../client";
import axios from "axios";
import { time } from "console";
import { PinataSDK } from "pinata-web3";
import { useAccount } from "wagmi";

interface Metadata {
  image: string;
  description: string;
  bounty: string;
  uniqueProofs: string;
  timeLimit: string;
}
const PINATA_JWT_KEY = process.env.NEXT_PUBLIC_PINATA_JWT_KEY;
const PINATA_GATEWAY_URL = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL;
const DTRUST_ADDRESS = process.env.NEXT_PUBLIC_DTRUST_CONTRACT_ADDRESS;
const DTRUST_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_DTRUST_TOKEN_CONTRACT_ADDRESS;
console.log(
  PINATA_JWT_KEY,

  PINATA_GATEWAY_URL,
);
const NFTUploader: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [bounty, setBounty] = useState<string>("");
  const [uniqueProofs, setUniqueProofs] = useState<string>("");
  const [timeLimit, setTimeLimit] = useState<string>("");

  const [ipfsUrl, setIpfsUrl] = useState<string>("");
  const { address: connectedAddress } = useAccount();

  // Handle image upload
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setImage(file);
  };

  const approveLimit = async () => {
    const { request } = await publicClient.simulateContract({
      address: DTRUST_TOKEN_ADDRESS as string,
      abi: dtrusttokenabi,
      functionName: "approve",
      args: [DTRUST_ADDRESS as string, BigInt(bounty)],
      account: connectedAddress,
    });
    const hash = await walletClient.writeContract(request);
    const transaction = await publicClient.waitForTransactionReceipt({
      hash: hash,
    });
    console.log(`limit approved ${transaction}`);
    alert(`limit approved ${transaction}`);
  };

  const createBounty = async (url: string) => {
    const { request } = await publicClient.simulateContract({
      address: DTRUST_ADDRESS as string,
      abi: dtrustabi,
      functionName: "createBounty",
      args: [DTRUST_TOKEN_ADDRESS as string, BigInt(bounty), BigInt(uniqueProofs), BigInt(timeLimit), url],
      account: connectedAddress,
    });
    const newHash = await walletClient.writeContract(request);
    const transaction = await publicClient.waitForTransactionReceipt({
      hash: newHash,
    });
    alert(`bounty created ${transaction}`);
    console.log(`bounty created ${transaction}`);
  };

  const uploadToipfs = async () => {
    if (!image) {
      alert("Please upload an image.");
      return;
    }

    try {
      // Upload the image to Pinata
      const pinata = new PinataSDK({
        pinataJwt: PINATA_JWT_KEY!,
        pinataGateway: PINATA_GATEWAY_URL!,
      });

      const imageResponse = await pinata.upload.file(image);
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageResponse.IpfsHash}`;

      // Create metadata for the NFT
      const nftMetadata: Metadata = {
        image: imageUrl,
        description,
        bounty,
        uniqueProofs,
        timeLimit,
      };

      // Upload metadata to Pinata
      const metadataResponse = await pinata.upload.json(nftMetadata);

      console.log(metadataResponse);

      setIpfsUrl(`https://gateway.pinata.cloud/ipfs/${metadataResponse.IpfsHash}`);
      alert("Image and metadata uploaded to IPFS via Pinata successfully!");
      return `https://gateway.pinata.cloud/ipfs/${metadataResponse.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      alert("Failed to upload image or metadata.");
    }
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const _ipfsurl = await uploadToipfs();

    await approveLimit();

    if (_ipfsurl) {
      console.log(bounty, uniqueProofs, timeLimit, _ipfsurl);
      await createBounty(_ipfsurl);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white shadow rounded-lg ">
      <h2 className="text-xl font-bold mb-4">Upload Metadata</h2>
      <form onSubmit={handleSubmit} className="w-full">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input file-input-bordered w-full mb-4"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="input input-bordered w-full mb-4"
          required
        />
        <input
          type="number"
          placeholder="Bounty"
          value={bounty}
          onChange={e => setBounty(e.target.value)}
          className="input input-bordered w-full mb-4"
          required
        />
        <input
          type="number"
          placeholder="Number of Unique Proofs Required"
          value={uniqueProofs}
          onChange={e => setUniqueProofs(e.target.value)}
          className="input input-bordered w-full mb-4"
          required
        />
        <input
          type="number"
          placeholder="time limit for the contest"
          value={timeLimit}
          onChange={e => setTimeLimit(e.target.value)}
          className="input input-bordered w-full mb-4"
          required
        />
        <button type="submit" className="btn btn-primary w-full">
          Create Bounty
        </button>
      </form>
      {ipfsUrl && (
        <div className="mt-4">
          <p>Metadata URL:</p>
          <a href={ipfsUrl} target="_blank" rel="noopener noreferrer" className="link link-primary">
            {ipfsUrl}
          </a>
        </div>
      )}
      <div>
        <img src="https://gateway.pinata.cloud/ipfs/bafybeighevqiihc7wnzwc6fohs7htp353a7v33mjke2fl2crtgll5abrvi" />
        <div />
      </div>
    </div>
  );
};

export default NFTUploader;
