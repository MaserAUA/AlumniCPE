// src/components/private/api/userService.js
import api from '../../auth/api/authApi';
import { delay, handleApiError } from '../../auth/api/apiUtils';

// User-related API endpoints
const USER_ENDPOINTS = {
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile/update',
  POSTS: '/user/posts',
  CREATE_POST: '/user/posts/create',
  UPDATE_POST: '/user/posts/update',
  DELETE_POST: '/user/posts/delete',
  ALUMNI: '/user/alumni',
  SEARCH_ALUMNI: '/user/alumni/search',
  FIND_CPE: '/user/find-cpe',
};

// User service methods
export const userService = {
  // ดึงข้อมูลโปรไฟล์ผู้ใช้
  getProfile: async () => {
    try {
      const response = await api.get(USER_ENDPOINTS.PROFILE);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // อัปเดตข้อมูลโปรไฟล์ผู้ใช้
  updateProfile: async (profileData) => {
    try {
      const response = await api.put(USER_ENDPOINTS.UPDATE_PROFILE, profileData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // ดึงข้อมูลโพสต์ของผู้ใช้
  getPosts: async () => {
    try {
      const response = await api.get(USER_ENDPOINTS.POSTS);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // สร้างโพสต์ใหม่
  createPost: async (postData) => {
    try {
      const response = await api.post(USER_ENDPOINTS.CREATE_POST, postData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // อัปเดตโพสต์
  updatePost: async (postId, postData) => {
    try {
      const response = await api.put(`${USER_ENDPOINTS.UPDATE_POST}/${postId}`, postData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // ลบโพสต์
  deletePost: async (postId) => {
    try {
      const response = await api.delete(`${USER_ENDPOINTS.DELETE_POST}/${postId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // ดึงข้อมูลศิษย์เก่า
  getAlumni: async (filters = {}) => {
    try {
      const response = await api.get(USER_ENDPOINTS.ALUMNI, { params: filters });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // ค้นหาศิษย์เก่า
  searchAlumni: async (searchTerm, filters = {}) => {
    try {
      const response = await api.get(USER_ENDPOINTS.SEARCH_ALUMNI, { 
        params: { search: searchTerm, ...filters } 
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // ค้นหา CPE
  findCPE: async (searchParams) => {
    try {
      const response = await api.get(USER_ENDPOINTS.FIND_CPE, {
        params: searchParams
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // Mock implementations สำหรับการพัฒนา (เมื่อ API ยังไม่พร้อมใช้งาน)
  mock: {
    getProfile: async () => {
      await delay(800); // จำลอง network latency
      return {
        id: '123',
        firstName: 'จอห์น',
        lastName: 'โด',
        email: 'john.doe@example.com',
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
        createdAt: '2022-01-01',
        updatedAt: '2022-01-15',
      };
    },
    
    updateProfile: async (profileData) => {
      await delay(1000);
      return {
        success: true,
        message: 'อัปเดตข้อมูลโปรไฟล์สำเร็จ',
        profile: {
          ...profileData,
          updatedAt: new Date().toISOString(),
        }
      };
    },
    
    getPosts: async () => {
      await delay(800);
      return {
        posts: [
          {
            id: '1',
            title: 'โพสต์แรก',
            content: 'นี่คือเนื้อหาของโพสต์แรก',
            author: 'จอห์น โด',
            createdAt: '2022-02-15T10:30:00',
            updatedAt: '2022-02-15T10:30:00',
            likes: 5,
            comments: 2
          },
          {
            id: '2',
            title: 'โพสต์ที่สอง',
            content: 'นี่คือเนื้อหาของโพสต์ที่สอง',
            author: 'จอห์น โด',
            createdAt: '2022-02-16T14:20:00',
            updatedAt: '2022-02-16T14:20:00',
            likes: 8,
            comments: 3
          }
        ],
        total: 2
      };
    },
    
    createPost: async (postData) => {
      await delay(1000);
      return {
        success: true,
        message: 'สร้างโพสต์สำเร็จ',
        post: {
          id: Date.now().toString(),
          ...postData,
          author: 'จอห์น โด',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          likes: 0,
          comments: 0
        }
      };
    },
    
    updatePost: async (postId, postData) => {
      await delay(800);
      return {
        success: true,
        message: 'อัปเดตโพสต์สำเร็จ',
        post: {
          id: postId,
          ...postData,
          updatedAt: new Date().toISOString()
        }
      };
    },
    
    deletePost: async (postId) => {
      await delay(800);
      return {
        success: true,
        message: 'ลบโพสต์สำเร็จ'
      };
    },
    
    getAlumni: async (filters = {}) => {
      await delay(1000);
      const mockAlumni = [
        {
          id: '1',
          firstName: 'เจน',
          lastName: 'สมิธ',
          studentID: '64070501111',
          cpeModel: 'CPE35',
          workingCompany: 'Google',
          jobPosition: 'Senior Developer',
          graduationYear: '2020'
        },
        {
          id: '2',
          firstName: 'ไมเคิล',
          lastName: 'จอห์นสัน',
          studentID: '64070501222',
          cpeModel: 'CPE36',
          workingCompany: 'Facebook',
          jobPosition: 'Product Manager',
          graduationYear: '2019'
        },
        {
          id: '3',
          firstName: 'ซาร่า',
          lastName: 'วิลเลียมส์',
          studentID: '64070501333',
          cpeModel: 'CPE34',
          workingCompany: 'Amazon',
          jobPosition: 'DevOps Engineer',
          graduationYear: '2021'
        }
      ];
      
      // ใช้ filters หากมีการระบุ
      let filteredAlumni = [...mockAlumni];
      if (filters.cpeModel) {
        filteredAlumni = filteredAlumni.filter(a => a.cpeModel === filters.cpeModel);
      }
      if (filters.graduationYear) {
        filteredAlumni = filteredAlumni.filter(a => a.graduationYear === filters.graduationYear);
      }
      
      return {
        alumni: filteredAlumni,
        total: filteredAlumni.length
      };
    },
    
    searchAlumni: async (searchTerm, filters = {}) => {
      await delay(800);
      const mockAlumni = [
        {
          id: '1',
          firstName: 'เจน',
          lastName: 'สมิธ',
          studentID: '64070501111',
          cpeModel: 'CPE35',
          workingCompany: 'Google',
          jobPosition: 'Senior Developer',
          graduationYear: '2020'
        },
        {
          id: '2',
          firstName: 'ไมเคิล',
          lastName: 'จอห์นสัน',
          studentID: '64070501222',
          cpeModel: 'CPE36',
          workingCompany: 'Facebook',
          jobPosition: 'Product Manager',
          graduationYear: '2019'
        },
        {
          id: '3',
          firstName: 'ซาร่า',
          lastName: 'วิลเลียมส์',
          studentID: '64070501333',
          cpeModel: 'CPE34',
          workingCompany: 'Amazon',
          jobPosition: 'DevOps Engineer',
          graduationYear: '2021'
        }
      ];
      
      // ค้นหา
      let searchResults = mockAlumni.filter(a => 
        a.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.studentID.includes(searchTerm) ||
        a.workingCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.jobPosition.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // ใช้ filters หากมีการระบุ
      if (filters.cpeModel) {
        searchResults = searchResults.filter(a => a.cpeModel === filters.cpeModel);
      }
      if (filters.graduationYear) {
        searchResults = searchResults.filter(a => a.graduationYear === filters.graduationYear);
      }
      
      return {
        alumni: searchResults,
        total: searchResults.length
      };
    },

    findCPE: async (searchParams) => {
      await delay(800);
      
      // ข้อมูลจำลองสำหรับการค้นหา CPE
      const mockCPEResults = [
        {
          id: '1',
          fullName: 'สมชาย ใจดี',
          nickname: 'ชาย',
          studentID: '64070501001',
          cpeModel: 'CPE35',
          graduationYear: '2020',
          currentJob: 'Software Engineer',
          company: 'บริษัท ก ไทยแลนด์ จำกัด',
          contact: 'somchai@email.com'
        },
        {
          id: '2',
          fullName: 'สมหญิง รักเรียน',
          nickname: 'หญิง',
          studentID: '64070501002',
          cpeModel: 'CPE35',
          graduationYear: '2020',
          currentJob: 'Web Developer',
          company: 'บริษัท ข อินเตอร์เนชั่นแนล จำกัด',
          contact: 'somying@email.com'
        },
        {
          id: '3',
          fullName: 'มานะ ตั้งใจ',
          nickname: 'นะ',
          studentID: '64070501003',
          cpeModel: 'CPE36',
          graduationYear: '2021',
          currentJob: 'Data Engineer',
          company: 'บริษัท ค เทคโนโลยี จำกัด',
          contact: 'mana@email.com'
        },
        {
          id: '4',
          fullName: 'มานี มีสุข',
          nickname: 'นี',
          studentID: '64070501004',
          cpeModel: 'CPE36',
          graduationYear: '2021',
          currentJob: 'UX Designer',
          company: 'บริษัท ง ดิจิตอล จำกัด',
          contact: 'manee@email.com'
        },
        {
          id: '5',
          fullName: 'ปิติ ยิ้มแย้ม',
          nickname: 'ติ',
          studentID: '64070501005',
          cpeModel: 'CPE37',
          graduationYear: '2022',
          currentJob: 'DevOps Engineer',
          company: 'บริษัท จ คลาวด์ จำกัด',
          contact: 'piti@email.com'
        }
      ];
      
      // กรองผลลัพธ์ตามพารามิเตอร์การค้นหา
      let filteredResults = [...mockCPEResults];
      
      if (searchParams.name) {
        const searchName = searchParams.name.toLowerCase();
        filteredResults = filteredResults.filter(cpe => 
          cpe.fullName.toLowerCase().includes(searchName) || 
          cpe.nickname.toLowerCase().includes(searchName)
        );
      }
      
      if (searchParams.studentID) {
        filteredResults = filteredResults.filter(cpe => 
          cpe.studentID.includes(searchParams.studentID)
        );
      }
      
      if (searchParams.cpeModel) {
        filteredResults = filteredResults.filter(cpe => 
          cpe.cpeModel === searchParams.cpeModel
        );
      }
      
      if (searchParams.graduationYear) {
        filteredResults = filteredResults.filter(cpe => 
          cpe.graduationYear === searchParams.graduationYear
        );
      }
      
      if (searchParams.company) {
        const searchCompany = searchParams.company.toLowerCase();
        filteredResults = filteredResults.filter(cpe => 
          cpe.company.toLowerCase().includes(searchCompany)
        );
      }
      
      return {
        results: filteredResults,
        total: filteredResults.length
      };
    }
  }
};

export default userService;