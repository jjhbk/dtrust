// NFTUploader.tsx
import React, { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { PinataSDK } from "pinata-web3";

interface Metadata {
  image: string;
  description: string;
  bounty: string;
  uniqueProofs: string;
}

const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
});

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

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!image) {
      alert("Please upload an image.");
      return;
    }

    try {
      // Upload the image to Pinata

      const formData = new FormData();
      formData.append("file", image);

      // Set metadata for the file
      const metadata = JSON.stringify({
        name: "NFT Image",
        keyvalues: {
          description,
          bounty,
          uniqueProofs,
        },
      });

      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 1,
      });

      formData.append("pinataOptions", options);

      const request = await fetch("https://uploads.pinata.cloud/v3/files", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.JWT_KEY}`,
        },
        body: formData,
      });
      const response = await request.json();
      console.log(response);
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageResponse.data.IpfsHash}`;

      // Create metadata for the NFT
      const nftMetadata: Metadata = {
        image: imageUrl,
        description,
        bounty,
        uniqueProofs,
      };

      const formData2 = new FormData();
      formData2.append();
      // Upload metadata to Pinata
      const metadataResponse: any = await fetch("https://uploads.pinata.cloud/v3/files", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.JWT_KEY}`,
        },
        body: formData,
      });

      setIpfsUrl(`https://gateway.pinata.cloud/ipfs/${metadataResponse.data.IpfsHash}`);
      alert("Image and metadata uploaded to IPFS via Pinata successfully!");
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      alert("Failed to upload image or metadata.");
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white shadow rounded-lg w-full max-w-md">
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
