export const PPV = Number(process.env["AKIBA_SOUKEN_AR_ITEM_PPV"] ?? "100");
if (!Number.isInteger(PPV)) {
  throw new Error(`AKIBA_SOUKEN_AR_ITEM_PPVに整数をセットして下さい`);
}
