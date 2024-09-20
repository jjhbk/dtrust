import { Web3Provider } from "@ethersproject/providers";
import { BigNumber, Contract, ethers } from "ethers";

function createNotaryAttestation(contractDetails: string, signer: string) {
  let address = "0x..."; // Alice's address. Will need Alice's account to send the tx.
  let schemaData = ethers.utils.defaultAbiCoder.encode(
    ["string", "address"],
    [contractDetails, signer]
  );
  
  // Standard setup for the contract
  const provider = new ethers.providers.JsonRpcProvider(
    // Get an RPC URL (such as an infura link) to connect to the network
    getProviderUrl(84532)
  );
  // Get the contract address from the Address Book in docs.sign.global
  const contract = new Contract(CONTRACT_ADDRESS(84532), ISPABI.abi, provider);
  // Get the provider from the currently connected wallet
  const library = new Web3Provider(await connector.getProvider());
  // Create writable contract instance
  const instance = contract.connect(library.getSigner() as any) as Contract;
  
  // Send the attestation transaction
  try {
    await instance[
      "attest((uint64,uint64,uint64,uint64,address,uint64,uint8,bool,bytes[],bytes),string,bytes,bytes)"
    ](
      {
        schemaId: BigNumber.from("0x34"), // The final number from our schema's ID.
        linkedAttestationId: 0, // We are not linking an attestation.
        attestTimestamp: 0, // Will be generated for us.
        revokeTimestamp: 0, // Attestation is not revoked.
        attester: address, // Alice's address.
        validUntil: 0, // We are not setting an expiry date.
        dataLocation: 0, // We are placing data on-chain.
        revoked: false, // The attestation is not revoked.
        recipients: [signer], // Bob is our recipient.
        data: schemaData // The encoded schema data.
      },
      signer.toLowerCase(), // Bob's lowercase address will be our indexing key.
      "0x", // No delegate signature.
      "0x00" // No extra data.
    )
      .then(
        async (tx: any) =>
          await tx.wait(1).then((res) => {
            console.log("success", res);
            // You can find the attestation's ID using the following path:
            // res.events[0].args.attestationId
          })
      )
      .catch((err: any) => {
        console.log(err?.message ? err.message : err);
      });
  } catch (err: any) {
    console.log(err?.message ? err.message : err);
  }
}