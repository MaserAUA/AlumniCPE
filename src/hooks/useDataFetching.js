// src/hooks/useDataFetching.js
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook สำหรับการดึงข้อมูลพร้อมจัดการสถานะการโหลด, ข้อผิดพลาด, และฟังก์ชันโหลดข้อมูลใหม่
 * 
 * @param {Function} fetchFunction - ฟังก์ชันที่ใช้ในการดึงข้อมูล
 * @param {Array} deps - dependencies array ที่จะทริกเกอร์การโหลดข้อมูลใหม่เมื่อมีการเปลี่ยนแปลง
 * @param {Object} options - ตัวเลือกเพิ่มเติม
 * @returns {Object} - สถานะการโหลด, ข้อผิดพลาด, ข้อมูล, และฟังก์ชันโหลดข้อมูลใหม่
 */
export const useDataFetching = (fetchFunction, deps = [], options = {}) => {
  const { 
    initialData = null,       // ข้อมูลเริ่มต้น
    onSuccess = null,         // callback เมื่อดึงข้อมูลสำเร็จ
    onError = null,           // callback เมื่อเกิดข้อผิดพลาด
    autoLoad = true,          // โหลดข้อมูลอัตโนมัติหรือไม่
    loadingDelay = 0,         // ดีเลย์ก่อนแสดงสถานะกำลังโหลด (ms)
    errorFormat = error => error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล' // ฟังก์ชันจัดรูปแบบข้อผิดพลาด
  } = options;
  
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(null);

  // ฟังก์ชันดึงข้อมูล
  const fetchData = useCallback(async () => {
    // ยกเลิก timeout แสดงสถานะโหลดเก่าถ้ามี
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }
    
    // ตั้งค่า timeout สำหรับแสดงสถานะกำลังโหลด
    // ใช้สำหรับกรณีดึงข้อมูลเร็วมาก เพื่อป้องกันการกระพริบของ UI
    if (loadingDelay > 0) {
      const timeout = setTimeout(() => setLoading(true), loadingDelay);
      setLoadingTimeout(timeout);
    } else {
      setLoading(true);
    }
    
    setError(null);

    try {
      const result = await fetchFunction();
      
      // ยกเลิก timeout ถ้ามี
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        setLoadingTimeout(null);
      }
      
      setData(result);
      setHasLoaded(true);
      if (onSuccess) onSuccess(result);
    } catch (err) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err);
      
      // ยกเลิก timeout ถ้ามี
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        setLoadingTimeout(null);
      }
      
      setError(errorFormat(err));
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, onSuccess, onError, loadingDelay, errorFormat, loadingTimeout]);

  // Effect เพื่อดึงข้อมูลเมื่อ dependencies เปลี่ยนแปลง
  useEffect(() => {
    if (autoLoad) {
      fetchData();
    }
    
    // Cleanup function
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [...deps, fetchData]);

  // ฟังก์ชันสำหรับโหลดข้อมูลใหม่ (refetch)
  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return { 
    data,                 // ข้อมูลที่ดึงมา
    loading,              // สถานะกำลังโหลด
    error,                // ข้อผิดพลาด (ถ้ามี)
    refetch,              // ฟังก์ชันสำหรับโหลดข้อมูลใหม่
    hasLoaded,            // บ่งชี้ว่าเคยโหลดข้อมูลสำเร็จแล้วหรือยัง
    setData               // ฟังก์ชันสำหรับเปลี่ยนแปลงข้อมูลโดยตรง (สำหรับกรณีที่ต้องการอัปเดตข้อมูลโดยไม่ต้องดึงใหม่)
  };
};

export default useDataFetching;