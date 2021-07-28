import { AnchorProgram } from "./anchor";

/**
 * Serializes an AnchorProgram into Rust code
 */
export const rustify = (anchorPrograms: Array<AnchorProgram>): string =>
  anchorPrograms
    .reduce(
      (acc, anchorProgram) =>
        acc.concat([
          `mod ${anchorProgram.name} {`,
          "use super::*;",
          ...Object.entries(anchorProgram.instructions).flatMap(([k, v]) => {
            const params = Object.entries(v?.params ?? {})
              .reduce((acc, [k, v]) => {
                acc.push(`${k}: ${v}`);
                return acc;
              }, [] as Array<string>)
              .join(", ");

            return [
              "",
              `pub fn ${k}(${params}) -> ProgramResult {`,
              ...(v.block ?? []),
              "Ok(())",
              `}`,
            ];
          }),
          "}",
          "",
          ...Object.entries(anchorProgram.derived).flatMap(([k, v]) => {
            return ["#[derive(Accounts)]", `pub struct ${k} {`, ...v, `}`, ""];
          }),
          ...Object.entries(anchorProgram.accounts)
            .filter(([, v]) => Object.keys(v).length > 0)
            .flatMap(([k, v]) => {
              const fields = Object.entries(v).reduce((acc, [k, v]) => {
                acc.push(`pub ${k}: ${v},`);
                return acc;
              }, [] as string[]);

              return [`#[account]`, `pub struct ${k} {`, ...fields, `}`, ""];
            }),
        ]),
      ["use anchor_lang::prelude::*;", "", "#[program]"]
    )
    .join("\n");
