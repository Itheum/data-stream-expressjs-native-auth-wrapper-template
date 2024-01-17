# Data Stream Express.JS Native Auth Wrapper Template

This is a working API template to implement an "Origin Data Stream API Endpoint" that is protected with MultiversX Native Auth. This "Origin Data Stream API Endpoint" can host private, personalized data about the caller or Data NFT itself. e.g., NFT or caller address trade data or historical data. The "Origin Data Stream API Endpoint" can then be used as the "Data Stream URL" on a Data NFT during minting, and only the verified holder of the Data NFT can then access this data.

## Do I need Native Auth protection on my Data Stream?

The Data NFT is already protecting the origin of your Data Stream URL thanks to the abstraction encryption provided by the Data Marshal. What this means is that no one should be able to see the plaintext URL of your Data Stream origin. However, in some instances, you may still want an "extra layer" or protection for your Origin Data Stream URL in the event the URL is discovered or shared by someone with "internal" knowledge of it (e.g., dev team). This is where Native Auth protection helps, as it puts the origin Data Stream URL in "protected public mode."

## Quick start

1. Run `npm install` in the project directory
2. Look for the `NativeAuthServer({..})` and update as needed

### `Run API locally`

1. Run the API

```bash
npm start
```

2. You can access these endpoints

```bash
http://localhost:3000/health-check
http://localhost:3000/datastream
```

The `datastream` endpoint will need a Native Auth token sent in as a Bearer Authorization header like so:

```bash
curl --location 'http://localhost:3000/datastream' --header 'Authorization: Bearer ZXJk...d39676fc0f'
```

You should then see the swagger portal on http://localhost:3000/, where you can test your API.

## Disclaimer

This open-source SOFTWARE PRODUCT is provided by THE PROVIDER "as is" and "with all faults." THE PROVIDER makes no representations or warranties of any kind concerning the safety, suitability, lack of viruses, inaccuracies, typographical errors, or other harmful components of this SOFTWARE PRODUCT. There are inherent dangers in the use of any software, and you are solely responsible for determining whether this SOFTWARE PRODUCT is compatible for your needs. You are also solely responsible for the protection of your equipment, your private credentials (e.g AWS account Key and Secret, GitHub access credentials etc.) and backup of your data, and THE PROVIDER will not be liable for any damages you may suffer in connection with using, modifying, or distributing this SOFTWARE PRODUCT.
