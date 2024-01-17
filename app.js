const express = require("express");
const cors = require("cors");
const { NativeAuthServer } = require("@multiversx/sdk-native-auth-server");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
const router = express.Router();

router.get("/health-check", (req, res) => {
  res.set("Cache-control", `no-store`); // never cache this route

  res.status(200).json({
    version: "0.0.1",
    health: "ok",
  });
});

router.get("/datastream", async function (req, res) {
  console.log("req.headers", req.headers);

  res.set("Cache-control", `no-store`); // never cache this route

  let accessToken = req.headers.authorization;

  if (!accessToken) {
    return res.status(403).json({
      error: true,
      errorMessage:
        "Access Forbidden as this is a protected Data Stream. No credentials sent!",
    });
  }

  try {
    // let's remove the Bearer from the string or server.decode gets confused
    accessToken = accessToken.replace(/Bearer/gi, "").trim();

    const server = new NativeAuthServer({
      // configure as needed - see https://github.com/multiversx/mx-sdk-js-native-auth-server for more info
      apiUrl: "https://devnet-api.multiversx.com",
      maxExpirySeconds: 7200,
      acceptedOrigins: [
        "http://localhost:3000",
        "http://localhost",
        "https://utils.multiversx.com",
      ],
    });

    // decodes the accessToken in its components: ttl, origin, address, signature, blockHash & body
    const decoded = await server.decode(accessToken);

    // performs validation of the block hash, verifies its validity, as well as origin verification
    const validateResult = await server.validate(accessToken);

    // start to generate the personalized response (error by default)
    let personalizedDataStream = {
      error: true,
      errorMessage:
        "Personalized stream has not been constructed due to some runtime error.",
    };

    // if the validation results returns an address, then we know it's a valid session
    // ... or else, .validate will throw an error that can be caught in catch
    if (validateResult?.address) {
      // a dummy personalized data stream, update with your own business logic here
      personalizedDataStream = {
        data_stream: {
          name: `private stream for ${validateResult?.address}`,
          creator: "you",
          created_on: 1692571700,
          last_modified_on: 1692571710,
          generated_on: validateResult?.issued,
        },
        data: [
          {
            txId: 1001,
            category: "purchase",
            date: 1692571701,
            item: "Gold Watch",
            store: "Nice jewellers",
            meta: `https://some_session_to_full_meta_data_of_transaction?txId=1001&user=${validateResult?.address}&session=${accessToken}`,
          },
          {
            txId: 1000,
            category: "purchase",
            date: 1692571702,
            item: "Small Cafe Latte",
            store: "Corner Coffee Shop",
            meta: `https://some_session_link_to_full_meta_data_of_transaction?txId=1000&user=${validateResult?.address}&session=${accessToken}`,
          },
        ],
        metaData: {
          data_marshal_injected: {
            "itm-marshal-fwd-chainid":
              req.headers?.["itm-marshal-fwd-chainid"] ||
              "error, this value should be forwarded",
            "itm-marshal-fwd-tokenid":
              req.headers?.["itm-marshal-fwd-tokenid"] ||
              "error, this value should be forwarded",
          },
          mvx_native_auth: {
            decodedSession: decoded,
            validateSession: validateResult,
          },
        },
      };
    }

    res.status(200).json(personalizedDataStream);
  } catch (e) {
    // all errors fall here into a 500 error code
    console.error(e);
    res.status(500).json({
      error: true,
      errorMessage: e.toString(),
    });
  }
});

app.use("/", router);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

app.listen(port, () => {
  console.log(`You API is running on ${port}`);
});
