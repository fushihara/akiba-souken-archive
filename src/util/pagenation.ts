export type PagenationProp = {
  now: number,
  max: number,
  between: number,
}
export function createPagenation(prop: PagenationProp) {
  if (prop.between < 0) {
    throw new Error(`betweenは0以上にして下さい`);
  }
  if (prop.max < 0) {
    throw new Error(`maxは0以上にして下さい`);
  }
  if (prop.now < 0) {
    throw new Error(`nowは0以上にして下さい`);
  }
  if (prop.max < prop.now) {
    throw new Error(`nowの値はmaxと同じか、より小さな値にして下さい. now:${prop.now} , max:${prop.max}`);
  }
  if (prop.max == 0) {
    return [];
  }
  const MIN = 1;
  // 左・中・右の3ブロックの変数を作成
  const blockLeft = MIN;
  let blockMiddle = [
    ...Array.from({ length: prop.between }).map((_, index) => {
      const i = prop.now - prop.between + index;
      return i;
    }),
    prop.now,
    ...Array.from({ length: prop.between }).map((_, index) => {
      const i = prop.now + index + 1;
      return i;
    }),
  ];
  blockMiddle = blockMiddle.filter(i => {
    if (i <= blockLeft) {
      return false;
    }
    if (prop.max <= i) {
      return false;
    }
    return true;
  });
  const blockRight = prop.max;
  type A = { type: "back", key: string, link: number | null };
  type B = { type: "next", key: string, link: number | null };
  type C = { type: "sp", key: string, };
  type D = { type: "num", key: string, link: number | null, num: number }
  // 結合を作成
  const pageIdList: (A | B | C | D)[] = [];
  {
    // 左戻る矢印
    if (prop.now == MIN) {
      pageIdList.push({ type: "back", key: "back", link: null });
    } else {
      pageIdList.push({ type: "back", key: "back", link: prop.now - 1 });
    }
    // 最初のページ
    pageIdList.push({ type: "num", key: `p-${blockLeft}`, link: blockLeft, num: blockLeft });
    let lastPageId = blockLeft;
    // 左と中の間の…を入れるかどうか
    if (0 < blockMiddle.length && lastPageId + 1 != blockMiddle[0]) {
      pageIdList.push({ type: "sp", key: "sp-left" });
    }
    blockMiddle.forEach(m => {
      pageIdList.push({ type: "num", key: `p-${m}`, link: m, num: m });
      lastPageId = m;
    });
    if (0 < blockMiddle.length && lastPageId + 1 != blockRight) {
      // 最後のページ
      pageIdList.push({ type: "sp", key: "sp-right" });
    }
    if (lastPageId != blockRight) {
      pageIdList.push({ type: "num", key: `p-${blockRight}`, link: blockRight, num: blockRight });
      lastPageId = blockRight;
    }
    // 右矢印
    if (prop.now == prop.max) {
      pageIdList.push({ type: "next", key: "next", link: null });
    } else {
      pageIdList.push({ type: "next", key: "next", link: prop.now + 1 });
    }
    pageIdList.forEach(p => {
      if ("link" in p && p.link == prop.now) {
        p.link = null;
      }
    })
  }
  return pageIdList
}