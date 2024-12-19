import { NextResponse } from "next/server";
import sha256 from "crypto-js/sha256";
import axios from "axios";

export async function POST(req: { formData: () => any; }) {
  // Declare variables before try block
  let merchantId: string | null = null;
  let transactionId: string | null = null;
  let amount: string | null = null;
  let providerReferenceId: string | null = null;

  try {
    // Get form data from the request
    const data = await req.formData();

    // Assign values from formData to the variables
    merchantId = data.get("merchantId");
    transactionId = data.get("transactionId");
    amount = data.get("amount");
    providerReferenceId = data.get("providerReferenceId");

    // Ensure all required parameters are present
    if (!merchantId || !transactionId || !amount || !providerReferenceId) {
      throw new Error("Missing required parameters");
    }

    // Prepare the string for generating the checksum
    const checksumString = `/pg/v1/status/${merchantId}/${transactionId}${process.env.NEXT_API_MERCHANT_KEY}`;
    const dataSha256 = sha256(checksumString).toString();
    const checksum = `${dataSha256}###${process.env.NEXT_API_MERCHANT_VERSION}`;

    // Setup the GET request to PhonePe's status API
    const options = {
      method: "GET",
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${transactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": merchantId,
      },
    };

    // Make the request to the PhonePe API
    const response = await axios.request(options);

    // Redirect based on the payment status
    if (response.data.code === "PAYMENT_SUCCESS") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?transactionId=${transactionId}&amount=${amount}&providerReferenceId=${providerReferenceId}`,
        {
          status: 301,
        }
      );
    } else {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failure?transactionId=${transactionId}&amount=${amount}&providerReferenceId=${providerReferenceId}`,
        {
          status: 301,
        }
      );
    }
  } catch (error: unknown) {
    // Handle the error safely
    if (error instanceof Error) {
      console.error("Error occurred during payment status check:", error.message);
    } else {
      console.error("Unknown error:", error);
    }

    // Ensure we redirect even in case of an error
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failure?transactionId=${transactionId}&amount=${amount}&providerReferenceId=${providerReferenceId}`,
      {
        status: 301,
      }
    );
  }
}
