// NFTUploader.tsx
"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { PinataSDK } from "pinata-web3";

// NFTUploader.tsx

// NFTUploader.tsx

interface Metadata {
  image: string;
  description: string;
  bounty: string;
  uniqueProofs: string;
}
const PINATA_JWT_KEY = process.env.NEXT_PUBLIC_PINATA_JWT_KEY;
const PINATA_GATEWAY_URL = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL;
console.log(
  PINATA_JWT_KEY,

  PINATA_GATEWAY_URL,
);
const NFTUploader: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [bounty, setBounty] = useState<string>("");
  const [uniqueProofs, setUniqueProofs] = useState<string>("");
  const [ipfsUrl, setIpfsUrl] = useState<string>("");

  // Handle image upload
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setImage(file);
  };

  const handleSubmit1 = async (event: FormEvent<HTMLFormElement>) => {
    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT!,
      pinataGateway: "example-gateway.mypinata.cloud",
    });
    const file = new File(["hello"], "Testing.txt", { type: "text/plain" });

    const upload = await pinata.upload.file(file);
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      };

      // Upload metadata to Pinata
      const metadataResponse = await pinata.upload.json(nftMetadata);

      console.log(metadataResponse);

      setIpfsUrl(`https://gateway.pinata.cloud/ipfs/${metadataResponse.IpfsHash}`);
      alert("Image and metadata uploaded to IPFS via Pinata successfully!");
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      alert("Failed to upload image or metadata.");
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white shadow rounded-lg w-full ">
      <h2 className="text-xl font-bold mb-4">Upload NFT Metadata</h2>
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
        <button type="submit" className="btn btn-primary w-full">
          Upload to Pinata
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
    </div>
  );
};

export default NFTUploader;
