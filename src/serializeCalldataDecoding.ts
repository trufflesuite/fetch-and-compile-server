import * as Codec from "@truffle/codec";

export function serializeCalldataDecoding(
  decoding: Codec.CalldataDecoding<Codec.Format.DefaultConfig>
): Codec.CalldataDecoding<Codec.Format.SerialConfig> {
  switch (decoding.kind) {
    case "function": {
      return {
        ...decoding,
        // @ts-ignore cause hackathon
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
        // @ts-ignore cause hackathon
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
        // @ts-ignore cause hackathon
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
