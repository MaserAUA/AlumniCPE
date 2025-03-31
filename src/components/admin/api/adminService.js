// src/components/admin/api/adminService.js
import api from '../../auth/api/authApi';
import { delay, handleApiError } from '../../auth/api/apiUtils';

// Admin-related API endpoints
const ADMIN_ENDPOINTS = {
  DASHBOARD: '/admin/dashboard',
  USER_LIST: '/admin/users',
  USER_DETAIL: '/admin/users/detail',
  UPDATE_USER: '/admin/users/update',
  DELETE_USER: '/admin/users/delete',
  REPORTS: '/admin/reports',
  APPROVE_POST: '/admin/posts/approve',
  REJECT_POST: '/admin/posts/reject',
  SYSTEM_STATS: '/admin/stats',
};

// Admin service methods
export const adminService = {
  // ดึงข้อมูลแดชบอร์ด
  getDashboardData: async () => {
    try {
      const response = await api.get(ADMIN_ENDPOINTS.DASHBOARD);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // ดึงรายการผู้ใช้พร้อม pagination และ filters
  getUserList: async (page = 1, limit = 10, filters = {}) => {
    try {
      const response = await api.get(ADMIN_ENDPOINTS.USER_LIST, {
        params: { page, limit, ...filters }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // ดึงข้อมูลผู้ใช้โดยละเอียด
  getUserDetail: async (userId) => {
    try {
      const response = await api.get(`${ADMIN_ENDPOINTS.USER_DETAIL}/${userId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // อัปเดตข้อมูลผู้ใช้
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`${ADMIN_ENDPOINTS.UPDATE_USER}/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // ลบผู้ใช้
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`${ADMIN_ENDPOINTS.DELETE_USER}/${userId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // ดึงรายงานระบบ
  getReports: async (reportType, startDate, endDate) => {
    try {
      const response = await api.get(ADMIN_ENDPOINTS.REPORTS, {
        params: { type: reportType, startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // อนุมัติโพสต์
  approvePost: async (postId) => {
    try {
      const response = await api.put(`${ADMIN_ENDPOINTS.APPROVE_POST}/${postId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // ปฏิเสธโพสต์
  rejectPost: async (postId, reason) => {
    try {
      const response = await api.put(`${ADMIN_ENDPOINTS.REJECT_POST}/${postId}`, { reason });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // ดึงสถิติระบบ
  getSystemStats: async () => {
    try {
      const response = await api.get(ADMIN_ENDPOINTS.SYSTEM_STATS);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // Mock implementations สำหรับการพัฒนา
  mock: {
    getDashboardData: async () => {
      await delay(800);
      return {
        userCount: 1250,
        newUsersToday: 25,
        totalPosts: 578,
        pendingPosts: 12,
        recentUsers: [
          { id: '1', name: 'จอห์น โด', email: 'john@example.com', registeredDate: '2023-03-15' },
          { id: '2', name: 'เจน สมิธ', email: 'jane@example.com', registeredDate: '2023-03-14' },
          { id: '3', name: 'ไมค์ จอห์นสัน', email: 'mike@example.com', registeredDate: '2023-03-13' }
        ],
        systemHealth: {
          cpuUsage: '25%',
          memoryUsage: '40%',
          diskUsage: '30%',
          serverStatus: 'ปกติ'
        }
      };
    },
    
    getUserList: async (page = 1, limit = 10, filters = {}) => {
      await delay(1000);
      
      // สร้างข้อมูลผู้ใช้จำลอง
      const mockUsers = Array.from({ length: 50 }, (_, i) => ({
        id: (i + 1).toString(),
        firstName: `ชื่อที่${i + 1}`,
        lastName: `นามสกุลที่${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: i < 3 ? 'admin' : 'user',
        status: ['active', 'inactive', 'pending'][i % 3],
        registeredDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().slice(0, 10)
      }));
      
      // กรองผู้ใช้
      let filteredUsers = [...mockUsers];
      if (filters.role) {
        filteredUsers = filteredUsers.filter(u => u.role === filters.role);
      }
      if (filters.status) {
        filteredUsers = filteredUsers.filter(u => u.status === filters.status);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(u => 
          u.firstName.toLowerCase().includes(searchLower) ||
          u.lastName.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower)
        );
      }
      
      // แบ่งหน้า
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      return {
        users: paginatedUsers,
        total: filteredUsers.length,
        page,
        limit,
        totalPages: Math.ceil(filteredUsers.length / limit)
      };
    },
    
    getUserDetail: async (userId) => {
      await delay(800);
      return {
        id: userId,
        firstName: 'จอห์น',
        lastName: 'โด',
        email: 'john.doe@example.com',
        role: 'user',
        status: 'active',
        phoneNumber: '0891234567',
        studentID: '64070501000',
        cpeModel: 'CPE35',
        favoriteSubject: 'โครงสร้างข้อมูล',
        workingCompany: 'บริษัทเทค',
        jobPosition: 'วิศวกรซอฟต์แวร์',
        lineOfWork: 'พัฒนาเว็บ',
        salary: '50000',
        nation: 'ไทย',
        sex: 'ชาย',
        president: 'ไม่',
        registeredDate: '2022-01-15',
        lastLoginDate: '2023-03-10',
        postCount: 15,
        accountActivity: [
          { action: 'เข้าสู่ระบบ', date: '2023-03-10T10:30:00' },
          { action: 'อัปเดตโปรไฟล์', date: '2023-03-05T14:20:00' },
          { action: 'สร้างโพสต์', date: '2023-03-01T09:15:00' }
        ]
      };
    },
    
    updateUser: async (userId, userData) => {
      await delay(800);
      return {
        success: true,
        message: 'อัปเดตข้อมูลผู้ใช้สำเร็จ',
        user: {
          id: userId,
          ...userData,
          updatedAt: new Date().toISOString()
        }
      };
    },
    
    deleteUser: async (userId) => {
      await delay(800);
      return {
        success: true,
        message: 'ลบผู้ใช้สำเร็จ'
      };
    },
    
    getReports: async (reportType, startDate, endDate) => {
      await delay(1000);
      
      // ข้อมูลรายงานแตกต่างกันตามประเภทรายงาน
      let reportData;
      
      if (reportType === 'user_growth') {
        reportData = {
          title: 'รายงานการเติบโตของผู้ใช้',
          timeRange: `${startDate} ถึง ${endDate}`,
          datasets: [
            { label: 'ผู้ใช้ใหม่', data: [25, 30, 45, 60, 75, 80, 70] },
            { label: 'ผู้ใช้ที่ยังใช้งานอยู่', data: [120, 150, 170, 190, 220, 240, 280] }
          ],
          labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.'],
          summary: {
            totalUsers: 350,
            growthRate: '15%',
            activeRate: '80%'
          }
        };
      } else if (reportType === 'content_engagement') {
        reportData = {
          title: 'รายงานการมีส่วนร่วมของเนื้อหา',
          timeRange: `${startDate} ถึง ${endDate}`,
          datasets: [
            { label: 'โพสต์ที่สร้าง', data: [45, 52, 60, 70, 65, 85, 90] },
            { label: 'ความคิดเห็น', data: [120, 140, 135, 155, 170, 190, 210] },
            { label: 'ถูกใจ', data: [250, 280, 300, 340, 360, 400, 420] }
          ],
          labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.'],
          summary: {
            totalPosts: 467,
            totalInteractions: 1975,
            averageInteractionsPerPost: 4.2
          }
        };
      } else {
        reportData = {
          title: 'รายงานระบบทั่วไป',
          timeRange: `${startDate} ถึง ${endDate}`,
          datasets: [
            { label: 'การใช้งานระบบ', data: [65, 70, 75, 80, 85, 90, 88] }
          ],
          labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.'],
          summary: {
            averageUsage: '79%',
            peakDay: '15 พ.ค. 2566',
            peakHour: '14:00 - 15:00'
          }
        };
      }
      
      return reportData;
    },
    
    approvePost: async (postId) => {
      await delay(600);
      return {
        success: true,
        message: 'อนุมัติโพสต์สำเร็จ',
        post: {
          id: postId,
          status: 'approved',
          approvedAt: new Date().toISOString(),
          approvedBy: 'ผู้ดูแลระบบ'
        }
      };
    },
    
    rejectPost: async (postId, reason) => {
      await delay(600);
      return {
        success: true,
        message: 'ปฏิเสธโพสต์สำเร็จ',
        post: {
          id: postId,
          status: 'rejected',
          rejectedAt: new Date().toISOString(),
          rejectedBy: 'ผู้ดูแลระบบ',
          rejectionReason: reason
        }
      };
    },
    
    getSystemStats: async () => {
      await delay(800);
      return {
        currentTime: new Date().toISOString(),
        uptime: '15 วัน, 7 ชั่วโมง',
        serverLoad: {
          cpuUsage: '25%',
          memoryUsage: '40%',
          diskUsage: '30%'
        },
        userStats: {
          totalUsers: 1250,
          activeUsers: 980,
          activeToday: 150
        },
        contentStats: {
          totalPosts: 578,
          postsToday: 15,
          pendingModeration: 12
        },
        systemEvents: [
          { type: 'error', message: 'การเชื่อมต่อฐานข้อมูลหมดเวลา', timestamp: '2023-03-15T10:30:00' },
          { type: 'info', message: 'สำรองข้อมูลตามกำหนดเวลาเสร็จสิ้น', timestamp: '2023-03-15T02:00:00' },
          { type: 'warning', message: 'ตรวจพบการใช้ CPU สูง', timestamp: '2023-03-14T18:45:00' }
        ]
      };
    }
  }
};

export default adminService;