import * as FileSystem from "expo-file-system";
import {
  // FILE: src/utils/photoManager.test.ts

  saveArrayBufferToFileSystem,
  loadArrayBufferFromFileSystem,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  stringToArrayBuffer,
} from "../photoManager";

// Mock the FileSystem module
jest.mock("expo-file-system", () => ({
  documentDirectory: "file://mockDir/",
  writeAsStringAsync: jest.fn(),
  readAsStringAsync: jest.fn(),
  EncodingType: {
    Base64: "base64",
  },
}));

describe("photoManager", () => {
  const mockArrayBuffer = new Uint8Array([1, 2, 3]).buffer;
  const mockBase64String = "AQID";
  const mockFileName = "testFile.txt";
  const mockFileUri = `file://mockDir/${mockFileName}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("saves ArrayBuffer to file system as Base64", async () => {
    await saveArrayBufferToFileSystem(mockArrayBuffer, mockFileName);

    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      mockFileUri,
      mockBase64String,
      { encoding: FileSystem.EncodingType.Base64 }
    );
    // Check if the function returns the correct file URI
    expect(
      await saveArrayBufferToFileSystem(mockArrayBuffer, mockFileName)
    ).toBe(mockFileUri);
  });

  it("loads ArrayBuffer from file system", async () => {
    (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(
      mockBase64String
    );

    const result = await loadArrayBufferFromFileSystem(mockFileUri);

    expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(mockFileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    expect(result).toEqual(mockArrayBuffer);
  });

  it("converts ArrayBuffer to Base64 string", () => {
    const result = arrayBufferToBase64(mockArrayBuffer);

    expect(result).toBe(mockBase64String);
  });

  it("converts Base64 string to ArrayBuffer", () => {
    const result = base64ToArrayBuffer(mockBase64String);

    expect(result).toEqual(mockArrayBuffer);
  });

  it("converts string to ArrayBuffer", async () => {
    (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(
      mockBase64String
    );

    const result = await stringToArrayBuffer(mockFileUri);

    expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(mockFileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    expect(result).toEqual(mockArrayBuffer);
  });
});
