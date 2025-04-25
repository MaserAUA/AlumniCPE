// utils/queryKeys.ts
export const queryKeys = {
  posts: {
    all: ["posts"] as const,
    detail: (id: string) => ["posts", id] as const,
    comments: (postId: string) => ["posts", postId, "comments"] as const,
  },
};
