// 基于经纬度的城市分组系统
export class CoordinateGrouping {
    
    // 按经度分组（东西方向）
    static getLongitudeGroup(longitude) {
        if (longitude < 80) return 'A';      // 新疆、西藏西部
        if (longitude < 90) return 'B';      // 西藏、青海
        if (longitude < 100) return 'C';     // 四川、云南
        if (longitude < 110) return 'D';     // 重庆、贵州、广西
        if (longitude < 120) return 'E';     // 广东、福建、浙江
        if (longitude < 130) return 'F';     // 江苏、上海、山东
        if (longitude < 140) return 'G';     // 辽宁、吉林、黑龙江
        return 'H';                          // 内蒙古东部
    }
    
    // 按纬度分组（南北方向）
    static getLatitudeGroup(latitude) {
        if (latitude > 50) return 'A';       // 黑龙江北部
        if (latitude > 45) return 'B';       // 内蒙古、黑龙江
        if (latitude > 40) return 'C';       // 北京、天津、河北
        if (latitude > 35) return 'D';       // 山东、河南、陕西
        if (latitude > 30) return 'E';       // 江苏、安徽、湖北
        if (latitude > 25) return 'F';       // 浙江、江西、湖南
        if (latitude > 20) return 'G';       // 广东、广西、海南
        return 'H';                          // 云南南部
    }
    
    // 经纬度组合分组（网格化）
    static getGridGroup(latitude, longitude) {
        const latGroup = Math.floor((latitude - 15) / 5);  // 5度一个纬度带
        const lngGroup = Math.floor((longitude - 70) / 5); // 5度一个经度带
        
        const groups = [
            ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
            ['Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'],
            ['Y', 'Z']
        ];
        
        return groups[latGroup]?.[lngGroup] || 'Z';
    }
    
    // 智能分组（推荐使用）
    static getSmartGroup(latitude, longitude) {
        // 结合经纬度和城市特征
        if (longitude < 100 && latitude > 30) return 'A';  // 西北高原
        if (longitude < 110 && latitude > 25) return 'B';  // 西南山区
        if (longitude < 120 && latitude > 30) return 'C';  // 中部平原
        if (longitude < 130 && latitude > 25) return 'D';  // 东南沿海
        if (longitude < 140 && latitude > 40) return 'E';  // 东北平原
        if (longitude < 90 && latitude < 30) return 'F';   // 青藏高原
        return 'G';  // 其他
    }
    
    // 获取城市坐标（从高德地图API）
    static async getCityCoordinates(cityName, apiKey) {
        try {
            const response = await fetch(
                `https://restapi.amap.com/v3/geocode/geo?` +
                `key=${apiKey}&` +
                `address=${encodeURIComponent(cityName)}&` +
                `output=json`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status === '1' && data.geocodes && data.geocodes.length > 0) {
                const location = data.geocodes[0].location.split(',');
                return {
                    longitude: parseFloat(location[0]),
                    latitude: parseFloat(location[1])
                };
            }
            
            return null;
        } catch (error) {
            console.error(`获取城市 ${cityName} 坐标失败:`, error);
            return null;
        }
    }
    
    // 按坐标分组城市（优化版，确保A-Z完整分组）
    static async groupCitiesByCoordinates(cities, apiKey, method = 'smart') {
        const cityGroups = {};
        
        // 初始化所有分组
        const allGroups = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        allGroups.forEach(group => {
            cityGroups[group] = [];
        });
        
        // 为每个城市获取坐标并分组
        for (const city of cities) {
            const cityName = city.name || city;
            const coords = await this.getCityCoordinates(cityName, apiKey);
            
            if (coords) {
                let group;
                switch (method) {
                    case 'longitude':
                        group = this.getLongitudeGroup(coords.longitude);
                        break;
                    case 'latitude':
                        group = this.getLatitudeGroup(coords.latitude);
                        break;
                    case 'grid':
                        group = this.getGridGroup(coords.latitude, coords.longitude);
                        break;
                    case 'smart':
                    default:
                        group = this.getSmartGroup(coords.latitude, coords.longitude);
                        break;
                }
                
                if (cityGroups[group]) {
                    cityGroups[group].push({
                        ...city,
                        coordinates: coords
                    });
                }
            } else {
                // 如果无法获取坐标，使用默认分组
                cityGroups['Z'].push(city);
            }
        }
        
        // 优化：重新分配城市到A-Z分组，确保每个分组都有城市
        const optimizedGroups = this.optimizeGroupDistribution(cityGroups);
        
        // 对每个分组内的城市排序
        Object.keys(optimizedGroups).forEach(group => {
            optimizedGroups[group].sort((a, b) => {
                const nameA = a.name || a;
                const nameB = b.name || b;
                return nameA.localeCompare(nameB, 'zh-CN');
            });
        });
        
        return optimizedGroups;
    }
    
    // 优化分组分布，确保A-Z都有城市
    static optimizeGroupDistribution(cityGroups) {
        const optimizedGroups = {};
        const allGroups = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        
        // 初始化所有分组
        allGroups.forEach(group => {
            optimizedGroups[group] = [];
        });
        
        // 收集所有城市
        const allCities = [];
        Object.values(cityGroups).forEach(cities => {
            allCities.push(...cities);
        });
        
        // 按城市数量平均分配到A-Z分组
        const citiesPerGroup = Math.ceil(allCities.length / 26);
        let currentGroupIndex = 0;
        
        allCities.forEach((city, index) => {
            const groupIndex = Math.floor(index / citiesPerGroup);
            const group = allGroups[groupIndex] || 'Z';
            optimizedGroups[group].push(city);
        });
        
        return optimizedGroups;
    }
}

// 城市坐标缓存（避免重复API调用）
const cityCoordinatesCache = new Map();

// 带缓存的坐标获取
export const getCityCoordinatesWithCache = async (cityName, apiKey) => {
    if (cityCoordinatesCache.has(cityName)) {
        return cityCoordinatesCache.get(cityName);
    }
    
    const coords = await CoordinateGrouping.getCityCoordinates(cityName, apiKey);
    if (coords) {
        cityCoordinatesCache.set(cityName, coords);
    }
    
    return coords;
}; 