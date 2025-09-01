// 城市数据获取工具
// 使用高德地图API获取真实的中国城市数据

import { CoordinateGrouping } from './coordinateGrouping';
import { PinyinGrouping } from './pinyinGrouping.js';

// 高德地图API配置
const AMAP_CONFIG = {
    // 注意：实际使用时需要申请高德地图API Key
    // 申请地址：https://lbs.amap.com/
    API_KEY: process.env.NEXT_PUBLIC_AMAP_KEY || '3ca5d757902c200f3f566c42ca6ea657',
    BASE_URL: 'https://restapi.amap.com/v3'
};


// 获取所有省份和城市
export const fetchAllProvincesAndCities = async () => {
    try {
        const response = await fetch(
            `${AMAP_CONFIG.BASE_URL}/config/district?` +
            `key=${AMAP_CONFIG.API_KEY}&` +
            `keywords=中国&` +
            `subdistrict=2&` + // 返回2级行政区划（省份和城市）
            `extensions=base`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.status === '1' && data.districts && data.districts.length > 0) {
            return data.districts[0].districts; // 返回所有省份
        } else {
            throw new Error(`获取城市数据失败: API返回状态 ${data.status}, 信息: ${data.info || '未知错误'}`);
        }
    } catch (error) {
        console.error('获取省份城市数据失败:', error);
        throw error;
    }
};

// 获取指定省份的所有城市
export const fetchCitiesByProvince = async (provinceName) => {
    try {
        const response = await fetch(
            `${AMAP_CONFIG.BASE_URL}/config/district?` +
            `key=${AMAP_CONFIG.API_KEY}&` +
            `keywords=${encodeURIComponent(provinceName)}&` +
            `subdistrict=1&` + // 返回1级行政区划（城市）
            `extensions=base`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === '1' && data.districts && data.districts.length > 0) {
            return data.districts[0].districts; // 返回该省份的所有城市
        } else {
            throw new Error(`获取${provinceName}城市数据失败`);
        }
    } catch (error) {
        console.error(`获取${provinceName}城市数据失败:`, error);
        throw error;
    }
};

// 获取所有城市（扁平化列表）
export const fetchAllCities = async () => {
    try {
        const provinces = await fetchAllProvincesAndCities();
        const allCities = [];

        for (const province of provinces) {
            if (province.districts) {
                for (const city of province.districts) {
                    // 严格过滤：只获取真正的城市，排除自治州、自治县、盟、地区等
                    if (city.name.includes('市') && 
                        !city.name.includes('自治州') && 
                        !city.name.includes('自治县') && 
                        !city.name.includes('盟') && 
                        !city.name.includes('地区')) {
                        allCities.push({
                            name: city.name,
                            code: city.adcode,
                            level: city.level,
                            province: province.name
                        });
                    } else {
                        // 过滤掉非城市：省略日志输出
                    }
                }
            }
        }

        return allCities;
    } catch (error) {
        console.error('获取所有城市失败:', error);
        // 返回空数组，让用户知道没有获取到数据
        return [];
    }
};

// 按经纬度分组城市（专业用户使用）
export const sortCitiesByCoordinates = async (cities, method = 'smart') => {
    try {
        // 使用指定的分组方式
        const cityGroups = await CoordinateGrouping.groupCitiesByCoordinates(
            cities, 
            AMAP_CONFIG.API_KEY, 
            method
        );
        
        return cityGroups;

    } catch (error) {
        console.error('经纬度分组过程中发生错误:', error);
        // 不再自动降级，让调用方决定如何处理
        throw error;
    }
};

// 按首字母分组城市（传统方式）
export const sortCitiesByAlphabet = (cities) => {
    return getFallbackSorting(cities);
};

// 保留原函数名以兼容现有代码
export const sortCitiesByPinyin = sortCitiesByCoordinates;

// 按拼音首字母分组城市（使用新的拼音分组框架）
const getFallbackSorting = (cities) => {
    // 使用新的 PinyinGrouping 框架
    const groupedCities = PinyinGrouping.groupCitiesByPinyin(cities);
    
    return groupedCities;
};



 