import { userAgent } from "next/server";
import One_Post from "../../components/scroll/Post";
import type { Post as PostType } from "../../types/post";

export default function OnePostApprove({
  post,
  approvePost,
}: {
  post: PostType;
  approvePost: (id: string, approve: boolean) => Promise<void>;
}) {
  return (
    <>
      <One_Post post={post} />
      <button onClick={() => approvePost(String(post.id), true)}>
        Approve
      </button>
    </>
  );
}
