// components/VoteModal.js
import React, { useState } from "react";
import { dtrustabi } from "./abi";
import { publicClient, walletClient } from "./client";
import {
  EvmChains,
  SignProtocolClient,
  SpMode,
  delegateSignAttestation,
  delegateSignRevokeAttestation,
  delegateSignSchema,
} from "@ethsign/sp-sdk";
import { PinataSDK } from "pinata-web3";
import { getAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { useAccount } from "wagmi";

const PINATA_JWT_KEY = process.env.NEXT_PUBLIC_PINATA_JWT_KEY;
const PINATA_GATEWAY_URL = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL;
const DTRUST_ADDRESS = process.env.NEXT_PUBLIC_DTRUST_CONTRACT_ADDRESS;
const DTRUST_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_DTRUST_TOKEN_CONTRACT_ADDRESS;
const DTRUST_PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;
const VoteModal = ({ closeModal, index }: any) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(false);
  const [ipfsUrl, setIpfsUrl] = useState("");
  const { address: connectedAddress } = useAccount();

  const handleFileChange = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadToipfs = async () => {
    if (!selectedFile) {
      alert("Please upload an image.");
      return;
    }

    try {
      // Upload the image to Pinata
      const pinata = new PinataSDK({
        pinataJwt: PINATA_JWT_KEY!,
        pinataGateway: PINATA_GATEWAY_URL!,
      });

      const imageResponse = await pinata.upload.file(selectedFile);
      setIpfsUrl(`https://gateway.pinata.cloud/ipfs/${imageResponse.IpfsHash}`);

      alert("Image and metadata uploaded to IPFS via Pinata successfully!");
      return `https://gateway.pinata.cloud/ipfs/${imageResponse.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      alert("Failed to upload image or metadata.");
    }
  };

  const handleproofSubmit = async (e: any) => {
    e.preventDefault();
    const url = await uploadToipfs();
    if (url) {
      const { request } = await publicClient.simulateContract({
        address: DTRUST_ADDRESS as string,
        abi: dtrustabi,
        functionName: "vote",
        args: [BigInt(index), result, url],
        account: connectedAddress,
      });
      const newHash = await walletClient.writeContract(request);
      console.log(newHash);
      // Handle file submission logic
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: newHash,
      });
      console.log(`vote submitted ${transaction}`);
      alert(`vote  submitted ${transaction}`);
    }
    closeModal();
  };

  const handleattestationSubmit = async (e: any) => {
    e.preventDefault();
    const url = await uploadToipfs();
    const client = new SignProtocolClient(SpMode.OnChain, {
      chain: EvmChains.arbitrumSepolia,
      account: privateKeyToAccount(DTRUST_PRIVATE_KEY as `0x${string}`), // optional
    });
    if (url) {
      const createAttestationRes = await client.createAttestation({
        schemaId: "0xfe",
        data: { bountyID: BigInt(index), result: result, proof: url, voter: getAddress(connectedAddress as string) },
        indexingValue: "JJ",
      });
      console.log(createAttestationRes);
      alert(`attestation successful ${JSON.stringify(createAttestationRes)}`);
    }
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
        <h2 className="mb-4 text-lg font-bold">Upload Image for Vote</h2>
        <form onSubmit={handleattestationSubmit}>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 mb-4 border rounded" />
          <div className="flex flex-col">
            {<label className="mb-2 text-sm font-medium text-gray-700">Vote Result</label>}
            <select
              value={String(result)}
              onChange={e => {
                setResult(e.target.value === "true");
              }}
              className="p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={String(true)}>True</option>
              <option value={String(false)}>False</option>
            </select>
            <p className="mt-2 text-sm text-gray-600">
              Selected Value: <strong>{String(result) ? "True" : "False"}</strong>
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoteModal;
