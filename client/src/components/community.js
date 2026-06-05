import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { useAuth } from "../context/AuthContext";
import {
  buildWebSocketUrl,
  createCommunityComment,
  createCommunityPost,
  getCommunityPosts,
  isRealtimeEnabled,
  toggleCommunityLike
} from "../lib/api";

const CommunityWrap = styled.section`
  min-height: 100vh;
  padding: 130px 24px 72px;
  background:
    linear-gradient(180deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.86)),
    #111;
  color: white;
`;

const Inner = styled.div`
  width: min(1040px, 100%);
  margin: 0 auto;
  display: grid;
  gap: 18px;
`;

const Panel = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.055);
  backdrop-filter: blur(16px);
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.4);
`;

const Title = styled.h1`
  margin: 0;
  font-family: "Bangers", "Passero One", Impact, sans-serif;
  font-size: 2rem;
  letter-spacing: 0;
`;

const Text = styled.p`
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.6;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 110px;
  resize: vertical;
  margin-top: 16px;
  padding: 14px;
  color: white;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 10px;
  font: inherit;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  color: white;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 10px;
  font: inherit;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
`;

const Button = styled.button`
  border: 0;
  border-radius: 10px;
  padding: 11px 14px;
  color: white;
  font-weight: 700;
  cursor: pointer;
  background: linear-gradient(270deg, #ff003c, #8a2be2);

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

const LoginLink = styled(Link)`
  display: inline-flex;
  margin-top: 14px;
  color: white;
  font-weight: 700;
  text-decoration: none;
`;

const Feed = styled.div`
  display: grid;
  gap: 14px;
`;

const PostCard = styled.article`
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.28);
  border-radius: 10px;
  padding: 18px;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.92rem;
`;

const CommentList = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 12px;
`;

function sortPosts(posts) {
  return [...posts].sort((left, right) => new Date(right.timestamp) - new Date(left.timestamp));
}

const Community = () => {
  const { currentUser, isAuthenticated, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [draft, setDraft] = useState("");
  const [commentDrafts, setCommentDrafts] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    getCommunityPosts()
      .then((response) => {
        if (isMounted) {
          setPosts(sortPosts(response));
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

  useEffect(() => {
    if (!isRealtimeEnabled()) {
      return undefined;
    }

    const socketUrl = new URL(buildWebSocketUrl("/ws/community"));

    if (token) {
      socketUrl.searchParams.set("token", token);
    }

    const socket = new WebSocket(socketUrl.toString());
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        if (payload.type === "posts" && Array.isArray(payload.posts)) {
          setPosts(sortPosts(payload.posts));
        }

        if (payload.type === "post" && payload.post) {
          setPosts((currentPosts) => sortPosts([payload.post, ...currentPosts]));
        }
      } catch (_error) {
        // Community still works through HTTP if realtime payloads are unavailable.
      }
    };

    socket.onerror = () => {
      socket.close();
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [token]);

  const handleCreatePost = async () => {
    const content = draft.trim();

    if (!content || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const post = await createCommunityPost(content);
      setPosts((currentPosts) => sortPosts([post, ...currentPosts]));
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
    <CommunityWrap>
      <Inner>
        <Panel>
          <Title>Community</Title>
          <Text>Share training updates, keep receipts, and stay accountable.</Text>

          {isAuthenticated ? (
            <>
              <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Pull day complete. Calories on target. Sleep next."
              />
              <ButtonRow>
                <Button type="button" onClick={handleCreatePost} disabled={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post update"}
                </Button>
              </ButtonRow>
            </>
          ) : (
            <LoginLink to="/login">Login to post, like, and comment</LoginLink>
          )}

          {error ? <Text>{error}</Text> : null}
        </Panel>

        <Feed>
          {posts.length === 0 ? (
            <Panel>
              <Text>No posts yet. First update sets the tone.</Text>
            </Panel>
          ) : (
            posts.map((post) => (
              <PostCard key={post.postId}>
                <Meta>
                  <span>{post.username}</span>
                  <span>{new Date(post.timestamp).toLocaleString()}</span>
                </Meta>
                <Text>{post.content}</Text>

                <ButtonRow>
                  <Button type="button" onClick={() => handleLike(post.postId)} disabled={!isAuthenticated}>
                    {post.likedBy?.includes(currentUser?.userId) ? "Unlike" : "Like"} ({post.likes || 0})
                  </Button>
                </ButtonRow>

                {isAuthenticated ? (
                  <>
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
                    <ButtonRow>
                      <Button type="button" onClick={() => handleComment(post.postId)}>
                        Comment
                      </Button>
                    </ButtonRow>
                  </>
                ) : null}

                {(post.comments || []).length > 0 ? (
                  <CommentList>
                    {post.comments.map((comment) => (
                      <PostCard key={comment.commentId}>
                        <Meta>
                          <span>{comment.username}</span>
                          <span>{new Date(comment.timestamp).toLocaleString()}</span>
                        </Meta>
                        <Text>{comment.content}</Text>
                      </PostCard>
                    ))}
                  </CommentList>
                ) : null}
              </PostCard>
            ))
          )}
        </Feed>
      </Inner>
    </CommunityWrap>
  );
};

export default Community;
