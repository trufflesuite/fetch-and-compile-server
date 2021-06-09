import * as Codec from "@truffle/codec";

export type SerializedCalldataDecoding = unknown;

export function serializeCalldataDecoding(
  decoding: Codec.CalldataDecoding
): SerializedCalldataDecoding {
  switch (decoding.kind) {
    case "function": {
      return {
        ...decoding,
        class: Codec.Format.Utils.Serial.serializeType(decoding.class),
        arguments: decoding.arguments.map(({ name, value }) => ({
          name,
          value: Codec.Format.Utils.Serial.serializeResult(value)
        }))
      };
    }
    case "constructor": {
      return {
        ...decoding,
        class: Codec.Format.Utils.Serial.serializeType(decoding.class),
        arguments: decoding.arguments.map(({ name, value }) => ({
          name,
          value: Codec.Format.Utils.Serial.serializeResult(value)
        }))
      };
    }
    case "message": {
      return {
        ...decoding,
        class: Codec.Format.Utils.Serial.serializeType(decoding.class)
      };
    }
    case "unknown": {
      return decoding;
    }
    case "create": {
      return decoding;
    }
  }
}
