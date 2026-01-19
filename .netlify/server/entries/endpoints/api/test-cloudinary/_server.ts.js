import { j as json } from "../../../../chunks/index2.js";
import { p as public_env, d as private_env } from "../../../../chunks/shared-server.js";
const GET = async () => {
  try {
    const cloudName = public_env.PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = private_env.PRIVATE_CLOUDINARY_API_KEY;
    const apiSecret = private_env.PRIVATE_CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      return json(
        {
          success: false,
          error: "Cloudinary credentials not configured",
          configured: {
            cloudName: !!cloudName,
            apiKey: !!apiKey,
            apiSecret: !!apiSecret
          }
        },
        { status: 500 }
      );
    }
    if (cloudName.includes("your_") || apiKey.includes("your_") || apiSecret.includes("your_")) {
      return json(
        {
          success: false,
          error: "Cloudinary credentials appear to be placeholder values",
          cloudName
        },
        { status: 500 }
      );
    }
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`
      }
    });
    if (!response.ok) {
      const errorText = await response.text();
      return json(
        {
          success: false,
          error: "Cloudinary API request failed",
          status: response.status,
          statusText: response.statusText,
          details: errorText,
          cloudName
        },
        { status: 500 }
      );
    }
    const data = await response.json();
    return json({
      success: true,
      message: "Cloudinary connection successful!",
      cloudName,
      resourceCount: data.resources?.length || 0,
      rateLimitRemaining: response.headers.get("x-featureratelimit-remaining"),
      connectionTest: "passed"
    });
  } catch (error) {
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: String(error)
      },
      { status: 500 }
    );
  }
};
const POST = async ({ request }) => {
  try {
    const { action } = await request.json();
    if (action === "test-upload") {
      const cloudName = public_env.PUBLIC_CLOUDINARY_CLOUD_NAME;
      const apiKey = private_env.PRIVATE_CLOUDINARY_API_KEY;
      const apiSecret = private_env.PRIVATE_CLOUDINARY_API_SECRET;
      if (!cloudName || !apiKey || !apiSecret) {
        return json(
          {
            success: false,
            error: "Cloudinary credentials not configured"
          },
          { status: 500 }
        );
      }
      const testImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";
      const timestamp = Math.floor(Date.now() / 1e3);
      const crypto = await import("crypto");
      const stringToSign = `timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");
      const formData = new FormData();
      formData.append("file", `data:image/png;base64,${testImageBase64}`);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        const errorData = await response.json();
        return json(
          {
            success: false,
            error: "Upload failed",
            status: response.status,
            details: errorData
          },
          { status: 500 }
        );
      }
      const uploadResult = await response.json();
      try {
        const deleteTimestamp = Math.floor(Date.now() / 1e3);
        const deleteStringToSign = `public_id=${uploadResult.public_id}&timestamp=${deleteTimestamp}${apiSecret}`;
        const deleteSignature = crypto.createHash("sha1").update(deleteStringToSign).digest("hex");
        await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              public_id: uploadResult.public_id,
              timestamp: deleteTimestamp,
              api_key: apiKey,
              signature: deleteSignature
            })
          }
        );
      } catch (deleteError) {
      }
      return json({
        success: true,
        message: "Upload test successful!",
        uploadedUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        format: uploadResult.format,
        resourceType: uploadResult.resource_type
      });
    }
    return json(
      {
        success: false,
        error: "Invalid action"
      },
      { status: 400 }
    );
  } catch (error) {
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: String(error)
      },
      { status: 500 }
    );
  }
};
export {
  GET,
  POST
};
