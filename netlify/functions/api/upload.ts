import { Handler } from '@netlify/functions';
import { Buffer } from 'buffer';

export const handler: Handler = async (event) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  try {
    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers,
        body: '',
      };
    }

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    // Log request details for debugging
    console.log('Request headers:', event.headers);
    console.log('Content type:', event.headers['content-type']);

    // Check if we have a body
    if (!event.body) {
      throw new Error('No file data received');
    }

    // Handle base64 encoded body
    let base64Data;
    let mimeType;

    if (event.isBase64Encoded) {
      base64Data = event.body;
      mimeType = event.headers['content-type'] || 'image/jpeg';
    } else {
      // If not base64 encoded, encode it
      base64Data = Buffer.from(event.body).toString('base64');
      mimeType = event.headers['content-type'] || 'image/jpeg';
    }

    const fileUrl = `data:${mimeType};base64,${base64Data}`;

    // Log success
    console.log('File processed successfully');

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: fileUrl }),
    };
  } catch (error) {
    // Detailed error logging
    console.error('Upload error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      headers: event.headers,
      method: event.httpMethod,
      path: event.path,
    });

    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to process upload',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};