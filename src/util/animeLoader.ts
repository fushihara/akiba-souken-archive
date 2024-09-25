import { readFile } from "fs/promises";
import { z } from "zod";
const zodType = z.array(
  z.strictObject({
    animeId: z.number().int().min(0),
    title: z.string(),
    primaryCategory: z.string(),
    startSeason: z.string(),
    titleReviewScore: z.object({
      story: z.number().min(0).nullable(),
      sakuga: z.number().min(0).nullable(),
      character: z.number().min(0).nullable(),
      music: z.number().min(0).nullable(),
      originality: z.number().min(0).nullable(),
      storyboard: z.number().min(0).nullable(),
      voice: z.number().min(0).nullable(),
      song: z.number().min(0).nullable(),
      manzokudo: z.number().min(0).nullable(),
    }),
    titleReviewList: z.array(
      z.object({
        reviewId: z.number().int(),
        userIconUrl: z.string().url(),
        userName: z.string(),
        score: z.number(),
        isSpoiler: z.boolean(),
        timestampSec: z.number().int().min(0),
        commentCount: z.number().int().min(0),
        iineCount: z.number().int().min(0)
      }),
    ),
    titleHitokotoList: z.array(
      z.object({
        hitokotoId: z.number().int(),
        userIcon: z.string().url(),
        userName: z.string(),
        reviewHtml: z.string(),
        timestampSec: z.number().int(),
      })
    ),
    episodeList: z.array(z.object({
      episodeId: z.number().int().min(0),
      subTitle: z.string(),
      reviewCount: z.number().int().min(0),
      score: z.number().nullable(),
    })),
    episodeHitokotoList: z.array(z.object({
      episodeId: z.number().int().min(0),
      hitokotoList: z.array(z.object({
        hitokotoId: z.number().int().min(0),
        userIcon: z.string(),
        userName: z.string().min(1),
        reviewHtml: z.string().min(1),
        timestampSec: z.number().int().min(0),
      }))
    })),
  })
);
const MAX_ITEM_LIMIT = process.env["AKIBA_SOUKEN_MAX_ITEM_LIMIT"];
export type AnimeLoaderData = z.infer<typeof zodType>[number]
export class AnimeLoader {
  static instance = new AnimeLoader();
  constructor() { }
  private dataCache: Awaited<ReturnType<AnimeLoader["_loadData"]>> | null = null;
  async loadData() {
    if (this.dataCache != null) {
      return this.dataCache;
    }
    const loadedData = await this._loadData();
    this.dataCache = loadedData;
    return loadedData;
  }
  private async _loadData() {
    const articleJsonPath = process.env["AKIBA_SOUKEN_ANIME_JSON"]!;
    //console.log(`[${articleJsonPath}]`);
    const jsonStr = await readFile(articleJsonPath, { encoding: "utf-8" }).then(text => {
      const jsonObj = JSON.parse(text);
      return jsonObj;
    });
    const parsedObj = zodType.parse(jsonStr).filter(a => {
      if (a.titleHitokotoList.length != 0) { return true; }
      if (a.titleReviewList.length != 0) { return true; }
      if (a.titleReviewScore.manzokudo != null) { return true; }
      if (a.episodeList.find(e => e.score != null || e.reviewCount != 0)) { return true; }
      if (a.episodeHitokotoList.length != 0) { return true; }
      return false;
    });
    if (MAX_ITEM_LIMIT != null) {
      parsedObj.length = Math.min(Number(MAX_ITEM_LIMIT), parsedObj.length);
    }
    return parsedObj;
  }
}
