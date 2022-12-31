import LitJsSdk from "@lit-protocol/sdk-nodejs";

const client = new LitJsSdk.LitNodeClient();
const chain = "ethereum";

const accessControlConditions = [
  {
    contractAddress: "0x3110c39b428221012934A7F617913b095BC1078C",
    standardContractType: "ERC1155",
    chain,
    method: "balanceOf",
    parameters: [":userAddress", "9541"],
    returnValueTest: {
      comparator: ">",
      value: "0",
    },
  },
];

const resourceId = {
  baseUrl: "my-dynamic-content-server.com",
  path: "/a_path.html",
  orgId: "",
  role: "",
  extraData: "",
};

class Lit {
  litNodeClient;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async provisionAccess() {
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: "polygon",
    });
 
    await litNodeClient.saveSigningCondition({
      accessControlConditions,
      chain,
      authSig,
      resourceId,
    });
  }

  async accessResource() {
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: "polygon",
    });

    const jwt = await litNodeClient.getSignedToken({
      accessControlConditions,
      chain,
      authSig,
      resourceId,
    });

    Cookies.set("lit-auth", jwt, { expires: 1 });
  }

  async verifyJWT() {
    const { id } = query
    const cookies = new Cookies(req, res);
    const jwt = cookies.get("lit-auth");

    const { verified, payload } = LitJsSdk.verifyJwt({ jwt });
  
  if (!jwt) {
    return {
      props: {
        authorized: false
      },
    }
  }


  if (
    payload.baseUrl !== "http://localhost:3000"
    || payload.path !== '/protected'
    || payload.extraData !== id
  ) {
    return {
      props: {
        authorized: false
      },
    }
  }
}

export default new Lit();
