import { readFile } from "fs/promises";
import { z } from "zod";
const zodType = z.array(
  z.object({
    articleId: z.number().int().min(0),
    title: z.string(),
    timestampMs: z.number().int().min(0),
    maxPageNumber: z.number().int().min(1),
    tags: z.array(z.string()),
    breadLinks: z.array(z.string()).min(1),
  })
);
const MAX_ITEM_LIMIT = process.env["AKIBA_SOUKEN_MAX_ITEM_LIMIT"];
export class ArticleLoader {
  static instance = new ArticleLoader();
  private constructor() { }
  private dataCache: Awaited<ReturnType<ArticleLoader["_loadData"]>> | null = null;
  async loadData() {
    if (this.dataCache != null) {
      return this.dataCache;
    }
    const loadedData = await this._loadData();
    this.dataCache = loadedData;
    return loadedData;
  }
  private async _loadData() {
    const articleJsonPath = process.env["AKIBA_SOUKEN_ARTICLE_JSON"]!;
    const jsonStr = await readFile(articleJsonPath, { encoding: "utf-8" }).then(text => {
      const jsonObj = JSON.parse(text);
      return jsonObj;
    });
    const parsedObj = zodType.parse(jsonStr);
    parsedObj.sort((a, b) => {
      return b.timestampMs - a.timestampMs;
    });
    if (MAX_ITEM_LIMIT != null) {
      parsedObj.length = Math.min(Number(MAX_ITEM_LIMIT), parsedObj.length);
    }
    return parsedObj;
  }
  async getCategoryList() {
    const loadedData = await this.loadData();
    // key:カテゴリ名 , val:回数
    const categoryCount = new Map<string, number>();
    for (const a of loadedData) {
      if (a.breadLinks.length == 0) {
        continue;
      }
      const category = a.breadLinks[0];
      if (categoryCount.has(category)) {
        categoryCount.set(category, categoryCount.get(category)! + 1);
      } else {
        categoryCount.set(category, 1);
      }
    }
    const categoryList: { name: string, count: number }[] = [];
    for (const [name, count] of categoryCount) {
      categoryList.push({ name: name, count });
    }
    categoryList.sort((a, b) => {
      return b.count - a.count;
    });
    return categoryList;
  }
  /**
   * 
   * @returns [{tag:"タグ名",category:string,count:100}] の値。カテゴリに属していないタグはカテゴリが空文字。  
   * カテゴリ自体を指す場合は {tag:"ホビー",category:"ホビー",count:100} の様に同じ値が入る事がある。  
   * ソート順は未定義
   */
  async getTagList() {
    const loadedData = await this.loadData();
    // 先にパンくずリストを全部見る
    const breadcrumb = new Breadcrumb();
    for (const a of loadedData) {
      breadcrumb.push(a.breadLinks);
    }
    // key:タグ名 , val:回数
    const tagCount = new Map<string, number>();
    // パンくずリストに含まれないタグを調査
    for (const a of loadedData) {
      for (const tag of a.tags) {
        if (breadcrumb.strExists(tag)) {
          continue;
        }
        const tagData = tagCount.get(tag);
        if (tagData != null) {
          tagCount.set(tag, tagData + 1);
        } else {
          tagCount.set(tag, 1);
        }
      }
    }
    const result: { tag: string, category: string, count: number }[] = [];
    for (const [name, count] of tagCount) {
      result.push({ tag: name, count: count, category: "" });
    }
    for (const b of breadcrumb.getFlatArray()) {
      const breadcrumbName = b.breadcrumb[b.breadcrumb.length - 1];//パンくずリストの最後の項目
      const category = b.breadcrumb[0];//カテゴリ名
      result.push({ tag: breadcrumbName, count: b.count, category: category });
    }
    return result;
  }
}


type BreadcrumbInternal = { name: string, count: number, child: BreadcrumbInternal[] };
/**
 * パンくずリストを管理
 * ・各記事には最低2個以上のパンくずリストがある
 * ・ホビー＞バンダイ＞S.H.Figuarts の様に親子関係がある
 * ・文字は一箇所でしか使われない。例えば、バンダイという文字はホビーの下にしか存在しない。
 */
class Breadcrumb {
  private set = new Set<string>();
  private data: BreadcrumbInternal[] = [];
  strExists(str: string) {
    return this.set.has(str);
  }
  push(breadLinks: string[]) {
    if (breadLinks.length == 0) {
      throw new Error(`配列が0個です`);
    }
    breadLinks.forEach(b => {
      this.set.add(b);
    })
    this.setChild(
      this.data,
      breadLinks,
    );
  }
  getFlatArray() {
    function hoge(dataList: BreadcrumbInternal[], parentBreadcrumbList: string[]) {
      const sortedDataList = [...dataList].toSorted((a, b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
      const result: { breadcrumb: string[], count: number }[] = [];
      for (const v of sortedDataList) {
        if (v.child.length == 0) {
          if (v.count == 0) {
            throw new Error(`子が0個で、個数も0はありえない`);
          } else {
            result.push({ breadcrumb: [...parentBreadcrumbList, v.name], count: v.count });
          }
        } else {
          if (v.count != 0) {
            result.push({ breadcrumb: [...parentBreadcrumbList, v.name], count: v.count });
          }
          const childResult = hoge(v.child, [...parentBreadcrumbList, v.name]);
          childResult.forEach(c => {
            result.push(c);
          })
        }
      }
      return result;
    }
    const result = hoge(this.data, []);
    return result;
  }

  private setChild(pushTarget: BreadcrumbInternal[], breadLinks: string[]) {
    const [top, ...nextBreadLinks] = breadLinks;
    const isLast = breadLinks.length == 1;
    const data = pushTarget.find(d => d.name == top);
    if (data) {
      if (isLast) {
        data.count += 1;
      } else {
        data.count += 1;
        this.setChild(data.child, nextBreadLinks)
      }
    } else {
      if (isLast) {
        pushTarget.push({ name: top, child: [], count: 1 });
      } else {
        const newItem: BreadcrumbInternal = this.createChild(nextBreadLinks)
        pushTarget.push({ name: top, child: [newItem], count: 0 });
      }
    }
  }
  private createChild(nextBreadLinks: string[]): BreadcrumbInternal {
    if (nextBreadLinks.length == 0) {
      throw new Error();
    } else if (nextBreadLinks.length == 1) {
      return { child: [], count: 1, name: nextBreadLinks[0] } satisfies BreadcrumbInternal;
    } else {
      const [nowBreadLink, ...nextNextBreadLinks] = nextBreadLinks;
      const child = this.createChild(nextNextBreadLinks);
      return { child: [child], count: 0, name: nowBreadLink } satisfies BreadcrumbInternal;
    }
  }
}