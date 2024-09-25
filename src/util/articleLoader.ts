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
  private dataCache: {
    articles: Article[],
    categoryTag: CategoryTag,
  } | null = null;
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
    const parsedObj = zodType.parse(jsonStr).map(v => new Article(v));
    parsedObj.sort((a, b) => {
      return b.timestampMs - a.timestampMs;
    });
    if (MAX_ITEM_LIMIT != null) {
      parsedObj.length = Math.min(Number(MAX_ITEM_LIMIT), parsedObj.length);
    }
    const categoryTagData = new CategoryTag();
    parsedObj.forEach(v => {
      for (const tag of v.tags2) {
        categoryTagData.put(tag.category, tag.name);
      }
    });
    return {
      articles: parsedObj,
      categoryTag: categoryTagData,
    };
  }
  /**
   * 
   * @returns [{tag:"タグ名",category:string,count:100}] の値。カテゴリに属していないタグはカテゴリが空文字。  
   * カテゴリ自体を指す場合は {tag:"ホビー",category:"ホビー",count:100} の様に同じ値が入る事がある。  
   * ソート順は未定義
   * @deprecated
   */
  // async getTagList() {
  //   const loadedData = await this.loadData();
  //   // 先にパンくずリストを全部見る
  //   const breadcrumb = new Breadcrumb();
  //   for (const a of loadedData.articles) {
  //     breadcrumb.push(a.breadLinks);
  //   }
  //   // key:タグ名 , val:回数
  //   const tagCount = new Map<string, number>();
  //   // パンくずリストに含まれないタグを調査
  //   for (const a of loadedData.articles) {
  //     for (const tag of a.tags) {
  //       if (breadcrumb.strExists(tag)) {
  //         continue;
  //       }
  //       const tagData = tagCount.get(tag);
  //       if (tagData != null) {
  //         tagCount.set(tag, tagData + 1);
  //       } else {
  //         tagCount.set(tag, 1);
  //       }
  //     }
  //   }
  //   const result: { tag: string, category: string, count: number }[] = [];
  //   for (const [name, count] of tagCount) {
  //     result.push({ tag: name, count: count, category: "" });
  //   }
  //   for (const b of breadcrumb.getFlatArray()) {
  //     const breadcrumbName = b.breadcrumb[b.breadcrumb.length - 1];//パンくずリストの最後の項目
  //     const category = b.breadcrumb[0];//カテゴリ名
  //     result.push({ tag: breadcrumbName, count: b.count, category: category });
  //   }
  //   return result;
  // }
}
type TagName = string;
class CategoryTag {
  /**
   * key:タグ名
   * val:カテゴリ名
   */
  readonly data = new Map<TagName, { category: string | null, count: number }>();
  put(category: string, tag: string) {
    if (tag == "") {
      throw new Error(`タグが空文字です`)
    }
    const storeCategory = this.data.get(tag);
    if (storeCategory == null) {
      this.data.set(tag, { category: category, count: 1 });
    } else if (storeCategory.category != category) {
      if (category == "" || storeCategory.category == "") {
        storeCategory.count += 1;
      } else if (category != "" || storeCategory.category == "") {
        storeCategory.count += 1;
        storeCategory.category = category;
      } else if (category == "" || storeCategory.category != "") {
        storeCategory.count += 1;
        //} else if(category != "" || storeCategory.category != ""){
      } else {
        throw new Error(`カテゴリが不一致. tag:${tag} , storeCategory:${storeCategory.category} , newCategory:${category}`);
      }
    } else {
      storeCategory.count += 1;
    }
  }
  getTagCount(tagName: string) {
    const data = this.data.get(tagName);
    if (data == null) {
      throw new Error(`タグ名:[${tagName}]`);
    }
    const count = data.count;
    return count;
  }
}
class Article {
  constructor(
    private readonly data: z.infer<typeof zodType>[number]
  ) {
    this.validate();
  }
  get timestampMs() {
    return this.data.timestampMs;
  }
  get breadLinks() {
    return this.data.breadLinks;
  }
  get tags() {
    return this.data.tags;
  }
  get maxPageNumber() {
    return this.data.maxPageNumber;
  }
  get articleId() {
    return this.data.articleId;
  }
  get title() {
    return this.data.title;
  }
  get tags2() {
    const result = this.getTags();
    return result;
  }
  private tagsCache: { name: string, category: string | "" }[] | null = null;
  private getTags() {
    if (this.tagsCache != null) {
      return this.tagsCache;
    }
    const tags: { name: string, category: string | "" }[] = [];
    for (const v of this.data.tags) {
      tags.push({ name: v, category: "" })
    };
    const category = this.data.breadLinks[0];
    for (const v of this.data.breadLinks) {
      tags.push({ name: v, category: category });
    };
    this.tagsCache = tags;
    return tags;
  }
  private validate() {
    // パンくずリストは必ず1件以上あること
    if (1 <= this.breadLinks.length) {
    } else {
      throw new Error(`パンくずリストの個数が不足しています`)
    }
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