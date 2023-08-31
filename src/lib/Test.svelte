<script>
  let litNodeClient;

  litNodeClient.connect();

  var authSig = JSON.parse(
    '{"sig":"0x18a173d68d2f78cc5c13da0dfe36eec2a293285bee6d42547b9577bf26cdc985660ed3dddc4e75d422366cac07e8a9fc77669b10373bef9c7b8e4280252dfddf1b","derivedVia":"web3.eth.personal.sign","signedMessage":"I am creating an account to use LITs at 2021-08-04T20:14:04.918Z","address":"0xdbd360f30097fb6d938dcc8b7b62854b36160b45"}'
  );

  var randomPath = () =>
    "/" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  var testProvisoningAndSigning = async ({
    unifiedAccessControlConditions,
    testName,
  }) => {
    document.getElementById("status").innerText = `Testing ${testName}...`;
    document.getElementById(
      "humanized"
    ).innerText = `Humanized: ${await litNodeClient.humanizeAccessControlConditions(
      {
        unifiedAccessControlConditions,
      }
    )}`;

    var solAuthSig = await litNodeClient.checkAndSignAuthMessage({
      chain: "solana",
    });
    var ethAuthSig = await litNodeClient.checkAndSignAuthMessage({
      chain: "ethereum",
    });

    let resourceId = {
      baseUrl: "my-dynamic-content-server.com",
      path: randomPath(),
      orgId: "",
      role: "",
      extraData: "",
    };

    await litNodeClient.saveSigningCondition({
      unifiedAccessControlConditions,
      authSig: {
        solana: solAuthSig,
        ethereum: ethAuthSig,
      },
      resourceId,
    });

    let jwt = await litNodeClient.getSignedToken({
      unifiedAccessControlConditions,
      authSig: {
        solana: solAuthSig,
        ethereum: ethAuthSig,
      },
      resourceId,
    });
    console.log("jwt", jwt);

    // uncomment this to break the jwt, to test an invalid jwt
    // jwt = jwt.replace(/.$/, "3");

    const { verified, header, payload } = litNodeClient.verifyJwt({ jwt });
    console.log("verified", verified);
    console.log("header", header);
    console.log("payload", payload);

    if (jwt && verified) {
      document.getElementById("status").innerText = `${testName}: Success`;
    } else {
      document.getElementById("status").innerText = `${testName}: Failure`;
    }
  };

  var IsPermittedAction = async () => {
    /*
        { contract_address: "0x9e1DDB2499C6834204347F047Ace1ae18E830449", chain: "mumbai", standard_contract_type: "PubkeyRouterAndPermissions", method: "isPermittedAction", parameters: ["0xab9704fbd33d96c0475f6d2f1e6e7ff3497d4eceb10df78d0fcf012ab3b09300", "0x12203577a857f9d58507be2f4a87d969cc582dd00a1d0486281113e68208163cb5e8"], return_value_test: JsonReturnValueTest { comparator: "=", value: "true" } }
        */
    var unifiedAccessControlConditions = [
      {
        conditionType: "evmBasic",
        contractAddress: "0x9e1DDB2499C6834204347F047Ace1ae18E830449",
        chain: "mumbai",
        standardContractType: "PubkeyRouterAndPermissions",
        method: "isPermittedAction",
        parameters: [
          "0xab9704fbd33d96c0475f6d2f1e6e7ff3497d4eceb10df78d0fcf012ab3b09300",
          "0x12203577a857f9d58507be2f4a87d969cc582dd00a1d0486281113e68208163cb5e8",
        ],
        returnValueTest: { comparator: "=", value: "true" },
      },
    ];
    await testProvisoningEncryptingAndDecrypting({
      unifiedAccessControlConditions,
      testName: "IsPermittedAction",
    });
  };
</script>

<br />
<button on:click={IsPermittedAction}>IsPermittedAction</button>
<br />
