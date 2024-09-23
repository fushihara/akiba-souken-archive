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
  constructor() { }
  async loadData() {
    const articleJsonPath = process.env["AKIBA_SOUKEN_ARTICLE_JSON"]!;
    //console.log(`[${articleJsonPath}]`);
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
  async getTagList() {
    const loadedData = await this.loadData();
    // key:タグ名 , val:回数
    const tagCount = new Map<string, number>();
    for (const a of loadedData) {
      const tags = new Set<string>();
      a.tags.forEach(t => {
        tags.add(t);
      });
      // パンくずリストの2件目以降はタグ扱いになっている
      a.breadLinks.forEach((b, index) => {
        if (index != 0) {
          tags.add(b);
        }
      })
      for (const tag of tags) {
        if (tagCount.has(tag)) {
          tagCount.set(tag, tagCount.get(tag)! + 1);
        } else {
          tagCount.set(tag, 1);
        }
      }
    }
    const tagList: { name: string, count: number }[] = [];
    for (const [name, count] of tagCount) {
      tagList.push({ name: name, count });
    }
    tagList.sort((a, b) => {
      return b.count - a.count;
    });
    return tagList;
  }
}
