import React, { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import {
  createCommunityComment,
  createCommunityPost,
  getCommunityPosts,
  toggleCommunityLike
} from "../lib/api";
import {
  ActionButton,
  ActionRow,
  EmptyState,
  Field,
  FeedList,
  Input,
  MetaRow,
  Panel,
  PanelHeader,
  PostCard,
  PrimaryButton,
  SectionText,
  SectionTitle,
  Textarea
} from "../styles/ui";

function CommunityPage() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [draft, setDraft] = useState("");
  const [commentDrafts, setCommentDrafts] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getCommunityPosts()
      .then((response) => {
        if (isMounted) {
          setPosts(response);
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreatePost = async () => {
    const content = draft.trim();
    if (!content || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const createdPost = await createCommunityPost(content);
      setPosts((currentPosts) => [createdPost, ...currentPosts]);
      setDraft("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const updatedPost = await toggleCommunityLike(postId);
      setPosts((currentPosts) =>
        currentPosts.map((post) => (post.postId === postId ? updatedPost : post))
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleComment = async (postId) => {
    const content = (commentDrafts[postId] || "").trim();
    if (!content) {
      return;
    }

    try {
      const updatedPost = await createCommunityComment(postId, content);
      setPosts((currentPosts) =>
        currentPosts.map((post) => (post.postId === postId ? updatedPost : post))
      );
      setCommentDrafts((currentDrafts) => ({ ...currentDrafts, [postId]: "" }));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <>
      <Panel>
        <PanelHeader>
          <div>
            <SectionTitle>Post an update</SectionTitle>
            <SectionText>Share a short proof-of-work update. Keep it useful.</SectionText>
          </div>
        </PanelHeader>

        <Field>
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Example: Pull day complete. 5 sets. Calories on target."
          />
        </Field>

        <ActionRow>
          <PrimaryButton type="button" onClick={handleCreatePost} disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Create post"}
          </PrimaryButton>
        </ActionRow>

        {error ? <SectionText>{error}</SectionText> : null}
      </Panel>

      <Panel>
        <PanelHeader>
          <div>
            <SectionTitle>Community feed</SectionTitle>
            <SectionText>Likes and comments are stored locally in the shared backend.</SectionText>
          </div>
        </PanelHeader>

        {posts.length === 0 ? (
          <EmptyState>No posts yet. Start the feed with your session recap.</EmptyState>
        ) : (
          <FeedList>
            {posts.map((post) => (
              <PostCard key={post.postId}>
                <MetaRow>
                  <span>{post.username}</span>
                  <span>{new Date(post.timestamp).toLocaleString()}</span>
                </MetaRow>

                <SectionText>{post.content}</SectionText>

                <ActionRow>
                  <ActionButton type="button" onClick={() => handleLike(post.postId)}>
                    {post.likedBy?.includes(currentUser.userId) ? "Unlike" : "Like"} ({post.likes || 0})
                  </ActionButton>
                </ActionRow>

                <Field style={{ marginTop: 16 }}>
                  <Input
                    value={commentDrafts[post.postId] || ""}
                    onChange={(event) =>
                      setCommentDrafts((currentDrafts) => ({
                        ...currentDrafts,
                        [post.postId]: event.target.value
                      }))
                    }
                    placeholder="Add a comment"
                  />
                </Field>

                <ActionRow>
                  <ActionButton type="button" onClick={() => handleComment(post.postId)}>
                    Comment
                  </ActionButton>
                </ActionRow>

                {(post.comments || []).length > 0 ? (
                  <FeedList style={{ marginTop: 16 }}>
                    {post.comments.map((comment) => (
                      <PostCard key={comment.commentId}>
                        <MetaRow>
                          <span>{comment.username}</span>
                          <span>{new Date(comment.timestamp).toLocaleString()}</span>
                        </MetaRow>
                        <SectionText>{comment.content}</SectionText>
                      </PostCard>
                    ))}
                  </FeedList>
                ) : null}
              </PostCard>
            ))}
          </FeedList>
        )}
      </Panel>
    </>
  );
}

export default CommunityPage;
