// src/hooks/useUserData.js
import { useCallback } from 'react';
import { useDataFetching } from './useDataFetching';
import { userService } from '../components/private/api/userService';

/**
 * Hook สำหรับดึงข้อมูลโปรไฟล์ผู้ใช้
 */
export const useUserProfile = () => {
  const fetchProfile = useCallback(async () => {
    try {
      // ลองใช้ API จริงก่อน, ถ้าไม่สำเร็จให้ใช้ mock
      try {
        return await userService.getProfile();
      } catch (apiError) {
        console.log('การดึงข้อมูลโปรไฟล์ผ่าน API ล้มเหลว, ใช้ข้อมูลจำลองแทน:', apiError);
        return await userService.mock.getProfile();
      }
    } catch (error) {
      throw error;
    }
  }, []);

  return useDataFetching(fetchProfile, []);
};

/**
 * Hook สำหรับดึงข้อมูลโพสต์ของผู้ใช้
 */
export const useUserPosts = () => {
  const fetchPosts = useCallback(async () => {
    try {
      // ลองใช้ API จริงก่อน, ถ้าไม่สำเร็จให้ใช้ mock
      try {
        return await userService.getPosts();
      } catch (apiError) {
        console.log('การดึงข้อมูลโพสต์ผ่าน API ล้มเหลว, ใช้ข้อมูลจำลองแทน:', apiError);
        return await userService.mock.getPosts();
      }
    } catch (error) {
      throw error;
    }
  }, []);

  return useDataFetching(fetchPosts, []);
};

/**
 * Hook สำหรับดึงข้อมูลศิษย์เก่าพร้อมตัวกรองตามที่กำหนด
 */
export const useAlumniData = (filters = {}) => {
  const fetchAlumni = useCallback(async () => {
    try {
      // ลองใช้ API จริงก่อน, ถ้าไม่สำเร็จให้ใช้ mock
      try {
        return await userService.getAlumni(filters);
      } catch (apiError) {
        console.log('การดึงข้อมูลศิษย์เก่าผ่าน API ล้มเหลว, ใช้ข้อมูลจำลองแทน:', apiError);
        return await userService.mock.getAlumni(filters);
      }
    } catch (error) {
      throw error;
    }
  }, [filters]);

  return useDataFetching(fetchAlumni, [JSON.stringify(filters)]);
};

/**
 * Hook สำหรับค้นหาศิษย์เก่า
 */
export const useSearchAlumni = (searchTerm, filters = {}) => {
  const searchAlumni = useCallback(async () => {
    if (!searchTerm && Object.keys(filters).length === 0) {
      return { alumni: [], total: 0 };
    }

    try {
      // ลองใช้ API จริงก่อน, ถ้าไม่สำเร็จให้ใช้ mock
      try {
        return await userService.searchAlumni(searchTerm, filters);
      } catch (apiError) {
        console.log('การค้นหาศิษย์เก่าผ่าน API ล้มเหลว, ใช้ข้อมูลจำลองแทน:', apiError);
        return await userService.mock.searchAlumni(searchTerm, filters);
      }
    } catch (error) {
      throw error;
    }
  }, [searchTerm, filters]);

  return useDataFetching(searchAlumni, [searchTerm, JSON.stringify(filters)]);
};

/**
 * Hook สำหรับค้นหา CPE
 */
export const useFindCPE = (searchParams = {}) => {
  const findCPE = useCallback(async () => {
    if (Object.keys(searchParams).length === 0) {
      return { results: [], total: 0 };
    }

    try {
      // ลองใช้ API จริงก่อน, ถ้าไม่สำเร็จให้ใช้ mock
      try {
        return await userService.findCPE(searchParams);
      } catch (apiError) {
        console.log('การค้นหา CPE ผ่าน API ล้มเหลว, ใช้ข้อมูลจำลองแทน:', apiError);
        return await userService.mock.findCPE(searchParams);
      }
    } catch (error) {
      throw error;
    }
  }, [searchParams]);

  return useDataFetching(findCPE, [JSON.stringify(searchParams)]);
};

export default {
  useUserProfile,
  useUserPosts,
  useAlumniData,
  useSearchAlumni,
  useFindCPE
};