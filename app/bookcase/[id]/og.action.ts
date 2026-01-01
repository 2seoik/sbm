"use server";

import ogs from "open-graph-scraper";

export const scrapOg = async (url: string) => {
  const { result } = await ogs({ url });
  return result;
};
