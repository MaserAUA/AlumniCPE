// src/hooks/useAdminData.js
import { useCallback } from 'react';
import { useDataFetching } from './useDataFetching';
import { adminService } from '../components/admin/api/adminService';

/**
 * Hook สำหรับดึงข้อมูลแดชบอร์ดผู้ดูแลระบบ
 */
export const useAdminDashboard = () => {
  const fetchDashboard = useCallback(async () => {
    try {
      // ลองใช้ API จริงก่อน, ถ้าไม่สำเร็จให้ใช้ mock
      try {
        return await adminService.getDashboardData();
      } catch (apiError) {
        console.log('การดึงข้อมูลแดชบอร์ดผ่าน API ล้มเหลว, ใช้ข้อมูลจำลองแทน:', apiError);
        return await adminService.mock.getDashboardData();
      }
    } catch (error) {
      throw error;
    }
  }, []);

  return useDataFetching(fetchDashboard, []);
};

/**
 * Hook สำหรับดึงรายการผู้ใช้พร้อม pagination และ filters
 */
export const useUserList = (page = 1, limit = 10, filters = {}) => {
  const fetchUsers = useCallback(async () => {
    try {
      // ลองใช้ API จริงก่อน, ถ้าไม่สำเร็จให้ใช้ mock
      try {
        return await adminService.getUserList(page, limit, filters);
      } catch (apiError) {
        console.log('การดึงรายการผู้ใช้ผ่าน API ล้มเหลว, ใช้ข้อมูลจำลองแทน:', apiError);
        return await adminService.mock.getUserList(page, limit, filters);
      }
    } catch (error) {
      throw error;
    }
  }, [page, limit, JSON.stringify(filters)]);

  return useDataFetching(fetchUsers, [page, limit, JSON.stringify(filters)]);
};

/**
 * Hook สำหรับดึงข้อมูลผู้ใช้โดยละเอียด
 */
export const useUserDetail = (userId) => {
  const fetchUserDetail = useCallback(async () => {
    if (!userId) {
      throw new Error('ไม่ได้ระบุ ID ของผู้ใช้');
    }

    try {
      // ลองใช้ API จริงก่อน, ถ้าไม่สำเร็จให้ใช้ mock
      try {
        return await adminService.getUserDetail(userId);
      } catch (apiError) {
        console.log('การดึงข้อมูลผู้ใช้ผ่าน API ล้มเหลว, ใช้ข้อมูลจำลองแทน:', apiError);
        return await adminService.mock.getUserDetail(userId);
      }
    } catch (error) {
      throw error;
    }
  }, [userId]);

  return useDataFetching(fetchUserDetail, [userId]);
};

/**
 * Hook สำหรับดึงข้อมูลรายงาน
 */
export const useReportsData = (reportType, startDate, endDate) => {
  const fetchReports = useCallback(async () => {
    try {
      // ลองใช้ API จริงก่อน, ถ้าไม่สำเร็จให้ใช้ mock
      try {
        return await adminService.getReports(reportType, startDate, endDate);
      } catch (apiError) {
        console.log('การดึงข้อมูลรายงานผ่าน API ล้มเหลว, ใช้ข้อมูลจำลองแทน:', apiError);
        return await adminService.mock.getReports(reportType, startDate, endDate);
      }
    } catch (error) {
      throw error;
    }
  }, [reportType, startDate, endDate]);

  return useDataFetching(fetchReports, [reportType, startDate, endDate]);
};

/**
 * Hook สำหรับดึงสถิติระบบ
 */
export const useSystemStats = () => {
  const fetchStats = useCallback(async () => {
    try {
      // ลองใช้ API จริงก่อน, ถ้าไม่สำเร็จให้ใช้ mock
      try {
        return await adminService.getSystemStats();
      } catch (apiError) {
        console.log('การดึงสถิติระบบผ่าน API ล้มเหลว, ใช้ข้อมูลจำลองแทน:', apiError);
        return await adminService.mock.getSystemStats();
      }
    } catch (error) {
      throw error;
    }
  }, []);

  return useDataFetching(fetchStats, []);
};

/**
 * Hook สำหรับการทำงานกับโพสต์ที่รอการอนุมัติ
 */
export const usePostModeration = () => {
  const { data, loading, error, refetch } = useDataFetching(
    async () => {
      // ในตัวอย่างนี้ไม่มีการดึงข้อมูล, แต่เราสร้าง hook เพื่อให้มีฟังก์ชันทำงานกับโพสต์
      return null;
    },
    [],
    { autoLoad: false } // ไม่ต้องโหลดข้อมูลอัตโนมัติเพราะเราจะใช้เฉพาะฟังก์ชัน
  );

  // ฟังก์ชันอนุมัติโพสต์
  const approvePost = useCallback(async (postId) => {
    try {
      // ลองใช้ API จริงก่อน, ถ้าไม่สำเร็จให้ใช้ mock
      try {
        return await adminService.approvePost(postId);
      } catch (apiError) {
        console.log('การอนุมัติโพสต์ผ่าน API ล้มเหลว, ใช้ข้อมูลจำลองแทน:', apiError);
        return await adminService.mock.approvePost(postId);
      }
    } catch (error) {
      throw error;
    }
  }, []);

  // ฟังก์ชันปฏิเสธโพสต์
  const rejectPost = useCallback(async (postId, reason) => {
    try {
      // ลองใช้ API จริงก่อน, ถ้าไม่สำเร็จให้ใช้ mock
      try {
        return await adminService.rejectPost(postId, reason);
      } catch (apiError) {
        console.log('การปฏิเสธโพสต์ผ่าน API ล้มเหลว, ใช้ข้อมูลจำลองแทน:', apiError);
        return await adminService.mock.rejectPost(postId, reason);
      }
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    loading,
    error,
    approvePost,
    rejectPost,
    refetch
  };
};

export default {
  useAdminDashboard,
  useUserList,
  useUserDetail,
  useReportsData,
  useSystemStats,
  usePostModeration
};