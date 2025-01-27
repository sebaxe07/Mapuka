import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Photo } from "../contexts/slices/userDataSlice";

// Function to save ArrayBuffer to the local file system as Base64
export const saveArrayBufferToFileSystem = async (
  buffer: ArrayBuffer,
  fileName: string
): Promise<string> => {
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;
  const base64String = arrayBufferToBase64(buffer);
  await FileSystem.writeAsStringAsync(fileUri, base64String, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return fileUri;
};

// Function to load ArrayBuffer from the local file system
export const loadArrayBufferFromFileSystem = async (
  fileUri: string
): Promise<ArrayBuffer> => {
  const base64String = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return base64ToArrayBuffer(base64String);
};

// Convert ArrayBuffer to Base64 string
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 string to ArrayBuffer
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Convert string to ArrayBuffer
export async function stringToArrayBuffer(str: string) {
  const buffer = await loadArrayBufferFromFileSystem(str);
  return buffer;
}
