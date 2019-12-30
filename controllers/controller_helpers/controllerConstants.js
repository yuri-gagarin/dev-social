export const POST_CON_UPPER = 1.25;
export const POST_CON_LOWER = 0.75;

export const TREND_POST_COMMENT_MIN = 5;
export const TREND_POST_LIKE_MIN = 5;
export const TREND_POST_LIKE_RATIO = 1.5
export const POST_QUERY_OPTIONS = {
  filter: {
    new: "new",
    trending: "trending",
    controversial: "controversial",
    discussed: "discussed",
  },
  time: {
    day: "day",
    week: "week",
    month: "month",
    year: "year",
    allTime: "all",
    none: "",
  },
};
 
// Comment(s) 'controller' and 'model constants //
export const commentConstants = {

  constraints: {
    COMMENT_CON_UPPER: 1.25,
    COMMENT_CON_LOWER: 0.75,
    COMMENT_MIN_LIKES: 5,
    COMMENT_LIM_DEFAULT: 10,
    POP_COMMENT_LIKE_RATIO: 0.75,
    CONT_COMMENT_LIKE_MIN: 5,
    CONT_COMMENT_DISLKIKE_MIN: 5
  },

  queryOptions: {
    filter: {
      new: "new",
      trending: "trending",
      controversial: "controversial",
      discussed: "discussed",
      liked: "liked"
    },
    time: {
      day: "day",
      week: "week",
      month: "month",
      year: "year",
      allTime: "all",
      none: "",
    }
  }

};