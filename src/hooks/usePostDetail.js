// src/hooks/usePostDetail.js
import { useState, useEffect, useCallback } from 'react';
import { useDataFetching } from './useDataFetching';
import { postService } from '../services/postService';

/**
 * Hook สำหรับดึงข้อมูลโพสต์รายละเอียดและจัดการการโต้ตอบกับโพสต์
 * 
 * @param {string} postId - ID ของโพสต์
 * @param {Object} initialPost - ข้อมูลโพสต์เริ่มต้น (ถ้ามี)
 * @returns {Object} ฟังก์ชันและข้อมูลสำหรับจัดการโพสต์
 */
export const usePostDetail = (postId, initialPost = null) => {
  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // ดึงข้อมูลโพสต์
  const {
    data: fetchedPost,
    loading: loadingPost,
    error: postError,
    refetch: refetchPost
  } = useDataFetching(
    async () => {
      if (!postId) return initialPost;
      try {
        try {
          return await postService.getPostById(postId);
        } catch (apiError) {
          console.log('การดึงข้อมูลโพสต์ผ่าน API ล้มเหลว, ใช้ข้อมูลเริ่มต้นแทน:', apiError);
          return initialPost;
        }
      } catch (error) {
        throw error;
      }
    },
    [postId],
    { initialData: initialPost, autoLoad: !!postId }
  );

  // อัปเดตสถานะโพสต์เมื่อได้รับข้อมูลใหม่
  useEffect(() => {
    if (fetchedPost) {
      setPost(fetchedPost);
    }
  }, [fetchedPost]);

  // ดึงความคิดเห็น
  const fetchComments = useCallback(async () => {
    if (!postId) return;
    
    setLoadingComments(true);
    try {
      try {
        const commentData = await postService.getPostComments(postId);
        setComments(commentData.comments || []);
      } catch (apiError) {
        console.log('การดึงความคิดเห็นผ่าน API ล้มเหลว', apiError);
        // ใช้ข้อมูลความคิดเห็นเริ่มต้นที่มีอยู่แล้ว (ถ้ามี)
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงความคิดเห็น:', error);
    } finally {
      setLoadingComments(false);
    }
  }, [postId]);

  // ดึงความคิดเห็นเมื่อเริ่มต้น
  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, fetchComments]);

  // เพิ่มความคิดเห็นใหม่
  const addComment = useCallback(async (commentText, commentImage = null) => {
    if (!postId || (!commentText.trim() && !commentImage)) return null;

    try {
      const commentData = {
        postId,
        text: commentText,
        image: commentImage,
      };
      
      try {
        // ส่งความคิดเห็นไปยัง API
        const newComment = await postService.addComment(postId, commentData);
        setComments(prevComments => [newComment, ...prevComments]);
        return newComment;
      } catch (apiError) {
        console.log('การเพิ่มความคิดเห็นผ่าน API ล้มเหลว, ใช้ข้อมูลจำลองแทน:', apiError);
        
        // สร้างความคิดเห็นจำลองสำหรับการแสดงผลชั่วคราว
        const now = new Date();
        const mockComment = {
          id: Date.now().toString(),
          author: localStorage.getItem("username") || "You",
          avatar: "https://ui-avatars.com/api/?name=You&background=0D8ABC&color=fff",
          text: commentText,
          date: now.toLocaleDateString('en-US'),
          time: now.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}),
          replies: [],
          liked: false,
          likeCount: 0,
          image: commentImage ? URL.createObjectURL(commentImage) : null
        };
        
        setComments(prevComments => [mockComment, ...prevComments]);
        return mockComment;
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มความคิดเห็น:', error);
      return null;
    }
  }, [postId]);

  // เพิ่มการตอบกลับความคิดเห็น
  const addReply = useCallback(async (commentId, replyText) => {
    if (!postId || !commentId || !replyText.trim()) return null;

    try {
      const replyData = {
        commentId,
        text: replyText
      };
      
      try {
        // ส่งการตอบกลับไปยัง API
        const newReply = await postService.addReply(postId, commentId, replyData);
        
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.id === commentId 
              ? { ...comment, replies: [...(comment.replies || []), newReply] }
              : comment
          )
        );
        
        return newReply;
      } catch (apiError) {
        console.log('การเพิ่มการตอบกลับผ่าน API ล้มเหลว, ใช้ข้อมูลจำลองแทน:', apiError);
        
        // สร้างการตอบกลับจำลองสำหรับการแสดงผลชั่วคราว
        const now = new Date();
        const mockReply = {
          id: Date.now().toString(),
          author: localStorage.getItem("username") || "You",
          avatar: "https://ui-avatars.com/api/?name=You&background=0D8ABC&color=fff",
          text: replyText,
          date: now.toLocaleDateString('en-US'),
          time: now.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})
        };
        
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.id === commentId 
              ? { ...comment, replies: [...(comment.replies || []), mockReply] }
              : comment
          )
        );
        
        return mockReply;
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มการตอบกลับ:', error);
      return null;
    }
  }, [postId]);

  // อัปเดตโพสต์
  const updatePost = useCallback(async (updatedPostData) => {
    if (!postId) return null;
    
    try {
      try {
        // อัปเดตโพสต์ผ่าน API
        const updatedPost = await postService.updatePost(postId, updatedPostData);
        setPost(updatedPost);
        return updatedPost;
      } catch (apiError) {
        console.log('การอัปเดตโพสต์ผ่าน API ล้มเหลว, ใช้ข้อมูลจำลองแทน:', apiError);
        
        // อัปเดตข้อมูลโพสต์ในสถานะชั่วคราว
        const mockUpdatedPost = {
          ...post,
          ...updatedPostData,
          updatedAt: new Date().toISOString()
        };
        
        setPost(mockUpdatedPost);
        return mockUpdatedPost;
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตโพสต์:', error);
      return null;
    }
  }, [postId, post]);

  // กดไลค์/ยกเลิกไลค์โพสต์
  const togglePostLike = useCallback(async () => {
    if (!postId) return;

    try {
      // ดึงข้อมูลไลค์จาก localStorage
      const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
      const isLiked = likedPosts[postId]?.liked || false;

      try {
        // ส่งคำขอไลค์/ยกเลิกไลค์ไปยัง API
        if (isLiked) {
          await postService.unlikePost(postId);
        } else {
          await postService.likePost(postId);
        }
        
        // อัปเดตสถานะไลค์ในสถานะและ localStorage
        const updatedLikeCount = isLiked
          ? (likedPosts[postId]?.likeCount || 1) - 1
          : (likedPosts[postId]?.likeCount || 0) + 1;
          
        likedPosts[postId] = { liked: !isLiked, likeCount: updatedLikeCount };
        localStorage.setItem("likedPosts", JSON.stringify(likedPosts));

        // อัปเดตสถานะโพสต์
        setPost(prev => ({
          ...prev,
          likeCount: updatedLikeCount,
          liked: !isLiked
        }));

        return { liked: !isLiked, likeCount: updatedLikeCount };
      } catch (apiError) {
        console.log('การกดไลค์ผ่าน API ล้มเหลว, ใช้ข้อมูลจำลองแทน:', apiError);
        
        // อัปเดตสถานะไลค์ใน localStorage เท่านั้น
        const updatedLikeCount = isLiked
          ? (likedPosts[postId]?.likeCount || 1) - 1
          : (likedPosts[postId]?.likeCount || 0) + 1;
          
        likedPosts[postId] = { liked: !isLiked, likeCount: updatedLikeCount };
        localStorage.setItem("likedPosts", JSON.stringify(likedPosts));

        // อัปเดตสถานะโพสต์
        setPost(prev => ({
          ...prev,
          likeCount: updatedLikeCount,
          liked: !isLiked
        }));

        return { liked: !isLiked, likeCount: updatedLikeCount };
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการกดไลค์/ยกเลิกไลค์โพสต์:', error);
      return null;
    }
  }, [postId]);

  // กดไลค์/ยกเลิกไลค์ความคิดเห็น
  const toggleCommentLike = useCallback(async (commentId) => {
    if (!postId || !commentId) return null;

    try {
      // หาความคิดเห็นที่ต้องการจากรายการความคิดเห็น
      const comment = comments.find(c => c.id === commentId);
      if (!comment) return null;

      const isLiked = comment.liked || false;

      try {
        // ส่งคำขอไลค์/ยกเลิกไลค์ความคิดเห็นไปยัง API
        if (isLiked) {
          await postService.unlikeComment(postId, commentId);
        } else {
          await postService.likeComment(postId, commentId);
        }
        
        // อัปเดตสถานะไลค์ในรายการความคิดเห็น
        setComments(prevComments => 
          prevComments.map(c => 
            c.id === commentId
              ? { 
                  ...c, 
                  liked: !isLiked, 
                  likeCount: isLiked ? Math.max(0, c.likeCount - 1) : (c.likeCount || 0) + 1,
                  animateLike: !isLiked // เพิ่มแอนิเมชันเมื่อกดไลค์
                }
              : c
          )
        );

        // ลบแอนิเมชันหลังจากเวลาผ่านไประยะหนึ่ง
        if (!isLiked) {
          setTimeout(() => {
            setComments(prevComments => 
              prevComments.map(c => 
                c.id === commentId
                  ? { ...c, animateLike: false }
                  : c
              )
            );
          }, 1000);
        }

        return { 
          liked: !isLiked, 
          likeCount: isLiked ? Math.max(0, comment.likeCount - 1) : (comment.likeCount || 0) + 1 
        };
      } catch (apiError) {
        console.log('การกดไลค์ความคิดเห็นผ่าน API ล้มเหลว, ใช้ข้อมูลจำลองแทน:', apiError);
        
        // อัปเดตสถานะไลค์ในรายการความคิดเห็นเท่านั้น
        setComments(prevComments => 
          prevComments.map(c => 
            c.id === commentId
              ? { 
                  ...c, 
                  liked: !isLiked, 
                  likeCount: isLiked ? Math.max(0, c.likeCount - 1) : (c.likeCount || 0) + 1,
                  animateLike: !isLiked // เพิ่มแอนิเมชันเมื่อกดไลค์
                }
              : c
          )
        );

        // ลบแอนิเมชันหลังจากเวลาผ่านไประยะหนึ่ง
        if (!isLiked) {
          setTimeout(() => {
            setComments(prevComments => 
              prevComments.map(c => 
                c.id === commentId
                  ? { ...c, animateLike: false }
                  : c
              )
            );
          }, 1000);
        }

        return { 
          liked: !isLiked, 
          likeCount: isLiked ? Math.max(0, comment.likeCount - 1) : (comment.likeCount || 0) + 1 
        };
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการกดไลค์/ยกเลิกไลค์ความคิดเห็น:', error);
      return null;
    }
  }, [postId, comments]);

  // รายงานโพสต์
  const reportPost = useCallback(async (reportData) => {
    if (!postId) return null;

    try {
      try {
        // ส่งรายงานไปยัง API
        const result = await postService.reportPost(postId, reportData);
        return result;
      } catch (apiError) {
        console.log('การรายงานโพสต์ผ่าน API ล้มเหลว, เก็บข้อมูลใน localStorage แทน:', apiError);
        
        // เก็บข้อมูลรายงานใน localStorage
        const report = {
          postId,
          postTitle: post?.title,
          ...reportData,
          reportedBy: localStorage.getItem("username") || "anonymous",
          reportedAt: new Date().toISOString(),
          status: "pending"
        };
        
        const reports = JSON.parse(localStorage.getItem("reportedPosts") || "[]");
        reports.push(report);
        localStorage.setItem("reportedPosts", JSON.stringify(reports));
        
        return { success: true, report };
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการรายงานโพสต์:', error);
      return null;
    }
  }, [postId, post]);

  return {
    post,
    comments,
    loadingPost,
    loadingComments,
    postError,
    addComment,
    addReply,
    updatePost,
    refetchPost,
    togglePostLike,
    toggleCommentLike,
    reportPost
  };
};

export default usePostDetail;