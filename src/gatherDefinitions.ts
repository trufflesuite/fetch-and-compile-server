import type * as Codec from "@truffle/codec";
import { getCharacterOffsetToLineAndColumnMapping } from "@truffle/source-map-utils";

export interface GatherDefinitionsOptions {
  compilations: Codec.Compilations.Compilation[];
  referenceDeclarations: {
    [compilationId: string]: Codec.Ast.AstNodes;
  };
}

export interface SourceRange {
  source: {
    id: string;
  };
  from: {
    line: number;
    column: number;
  };
  to: {
    line: number;
    column: number;
  };
}

export interface Source {
  language: string | undefined;
  lines: string[];
}

export interface Definitions {
  compilationsById: {
    [compilationId: string]: {
      sourcesById: {
        [sourceId: string]: Source;
      };
      sourceRangesById: {
        [astId: string]: SourceRange;
      };
    };
  };
}

export async function gatherDefinitions({
  compilations,
  referenceDeclarations
}: GatherDefinitionsOptions): Promise<Definitions> {
  const definitions: Definitions = {
    compilationsById: compilations
      .filter(
        (
          compilation
        ): compilation is Codec.Compilations.Compilation & { id: string } =>
          typeof compilation.id !== "undefined"
      )
      .map(compilation => {
        const astNodes = referenceDeclarations[compilation.id];

        return {
          [compilation.id]: processCompilation({ compilation, astNodes })
        };
      })
      .reduce((a, b) => ({ ...a, ...b }), {})
  };

  return definitions;
}

interface ProcessCompilationOptions {
  compilation: Codec.Compilations.Compilation;
  astNodes: Codec.Ast.AstNodes;
}

function processCompilation({
  compilation,
  astNodes
}: ProcessCompilationOptions) {
  const { sources } = compilation;

  const sourcesById = processSources(sources);

  const offsetsBySourceId = Object.entries(sources)
    .map(([sourceId, { source: contents }]) => ({
      [sourceId]: getCharacterOffsetToLineAndColumnMapping(contents)
    }))
    .reduce((a, b) => ({ ...a, ...b }), {});

  return {
    sourcesById,
    sourceRangesById: Object.entries(astNodes)
      .map(([id, node]: [string, Codec.Ast.AstNode]) => ({
        [id]: readSourceRange(node, offsetsBySourceId)
      }))
      .reduce((a, b) => ({ ...a, ...b }), {})
  };
}

function processSources(sources: Codec.Compilations.Source[]): {
  [id: string]: Source;
} {
  return sources
    .filter(
      <S extends Codec.Compilations.Source>(
        source: S
      ): source is S & { id: string } => typeof source.id !== "undefined"
    )
    .filter(
      <S extends Codec.Compilations.Source>(
        source: S
      ): source is S & { source: string } =>
        typeof source.source !== "undefined"
    )
    .map(({ id, language, source: contents }) => ({
      [id]: {
        language,
        lines: contents.split("\n")
      }
    }))
    .reduce((a, b) => ({ ...a, ...b }), {});
}

function readSourceRange(
  { src }: Codec.Ast.AstNode,
  offsetsBySourceId: {
    [sourceId: string]: {
      line: number;
      column: number;
    }[];
  }
): SourceRange {
  const parts = src.split(":");
  const start = parseInt(parts[0]);
  const length = parseInt(parts[1]);
  const id = parts[2];

  const from = offsetsBySourceId[id][start];
  const to = offsetsBySourceId[id][start + length - 1];

  return {
    source: { id },
    from,
    to
  };
}
