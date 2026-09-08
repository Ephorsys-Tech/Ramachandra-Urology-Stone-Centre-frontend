/**
 * Utility helper to resolve the blog image dynamically.
 */
export const getBlogImage = (post) => {
  if (!post) return "";
  return post.image || "";
};

export default getBlogImage;
