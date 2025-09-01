// 基于拼音首字母的城市分组系统
export class PinyinGrouping {
    
    // 完整的拼音首字母映射表（扩展版）
    static pinyinMap = {
        // A组
        '阿': 'A', '安': 'A', '鞍': 'A', '艾': 'A', '爱': 'A', '奥': 'A',
        
        // B组
        '白': 'B', '包': 'B', '宝': 'B', '保': 'B', '北': 'B', '蚌': 'B', '百': 'B', '本': 'B', '毕': 'B', '滨': 'B', '亳': 'B', '巴': 'B', '博': 'B', '布': 'B', '边': 'B',
        
        // C组
        '长': 'C', '成': 'C', '重': 'C', '昌': 'C', '常': 'C', '沧': 'C', '承': 'C', '赤': 'C', '朝': 'C', '潮': 'C', '郴': 'C', '池': 'C', '崇': 'C', '滁': 'C', '春': 'C', '城': 'C', '楚': 'C', '川': 'C',
        
        // D组
        '大': 'D', '东': 'D', '德': 'D', '达': 'D', '定': 'D', '丹': 'D', '都': 'D', '多': 'D', '当': 'D', '道': 'D', '敦': 'D',
        
        // E组
        '鄂': 'E', '恩': 'E', '二': 'E',
        
        // F组
        '佛': 'F', '抚': 'F', '阜': 'F', '防': 'F', '福': 'F', '方': 'F', '分': 'F',
        
        // G组
        '广': 'G', '贵': 'G', '固': 'G', '甘': 'G', '赣': 'G', '桂': 'G', '果': 'G', '高': 'G', '国': 'G', '工': 'G',
        
        // H组
        '海': 'H', '哈': 'H', '杭': 'H', '汉': 'H', '河': 'H', '湖': 'H', '黑': 'H', '衡': 'H', '黄': 'H', '惠': 'H', '淮': 'H', '华': 'H', '红': 'H', '会': 'H', '合': 'H', '怀': 'H', '胡': 'H', '哈': 'H',
        
        // J组
        '济': 'J', '金': 'J', '江': 'J', '嘉': 'J', '酒': 'J', '九': 'J', '晋': 'J', '吉': 'J', '焦': 'J', '揭': 'J', '建': 'J', '集': 'J', '锦': 'J', '佳': 'J', '荆': 'J',
        
        // K组
        '可': 'K', '克': 'K', '开': 'K', '昆': 'K', '喀': 'K', '康': 'K', '口': 'K', '昆': 'K',
        
        // L组
        '兰': 'L', '林': 'L', '泸': 'L', '洛': 'L', '六': 'L', '廊': 'L', '临': 'L', '聊': 'L', '辽': 'L', '龙': 'L', '来': 'L', '乐': 'L', '丽': 'L', '连': 'L', '凉': 'L', '吕': 'L', '拉': 'L',
        
        // M组
        '眉': 'M', '绵': 'M', '茂': 'M', '梅': 'M', '马': 'M', '满': 'M', '明': 'M', '美': 'M',
        
        // N组
        '内': 'N', '南': 'N', '宁': 'N', '年': 'N', '怒': 'N', '农': 'N', '女': 'N', '那': 'N',
        
        // P组
        '平': 'P', '莆': 'P', '盘': 'P', '攀': 'P', '萍': 'P', '普': 'P', '彭': 'P',
        
        // Q组
        '青': 'Q', '庆': 'Q', '泉': 'Q', '清': 'Q', '黔': 'Q', '钦': 'Q', '七': 'Q', '齐': 'Q', '曲': 'Q', '衢': 'Q', '九': 'J',
        
        // R组
        '日': 'R', '如': 'R', '瑞': 'R', '人': 'R', '任': 'R', '热': 'R',
        
        // S组
        '深': 'S', '上': 'S', '山': 'S', '双': 'S', '石': 'S', '商': 'S', '宿': 'S', '随': 'S', '韶': 'S', '汕': 'S', '三': 'S', '松': 'S', '四': 'S', '朔': 'S', '苏': 'S',
        
        // T组
        '天': 'T', '太': 'T', '台': 'T', '泰': 'T', '通': 'T', '铁': 'T', '铜': 'T', '吐': 'T', '图': 'T', '同': 'T', '唐': 'T',
        
        // U组
        '乌': 'U', '武': 'U', '温': 'U', '吴': 'U', '五': 'U',
        
        // V组
        // 注意：中文拼音中没有以V开头的汉字，V组通常为空
        
        // W组
        '万': 'W', '文': 'W', '武': 'W', '温': 'W', '梧': 'W', '渭': 'W', '乌': 'W', '五': 'W', '吴': 'W', '无': 'W',
        
        // X组
        '西': 'X', '信': 'X', '新': 'X', '厦': 'X', '徐': 'X', '许': 'X', '咸': 'X', '忻': 'X', '邢': 'X', '襄': 'X', '孝': 'X', '小': 'X', '兴': 'X', '香': 'X', '仙': 'X',
        
        // Y组
        '银': 'Y', '烟': 'Y', '延': 'Y', '盐': 'Y', '扬': 'Y', '阳': 'Y', '伊': 'Y', '宜': 'Y', '益': 'Y', '鹰': 'Y', '营': 'Y', '永': 'Y', '榆': 'Y', '玉': 'Y', '岳': 'Y', '云': 'Y', '运': 'Y', '一': 'Y', '有': 'Y', '友': 'Y',
        
        // Z组
        '郑': 'Z', '中': 'Z', '舟': 'Z', '周': 'Z', '株': 'Z', '漳': 'Z', '肇': 'Z', '镇': 'Z', '枣': 'Z', '湛': 'Z', '张': 'Z', '昭': 'Z', '景': 'Z', '汉': 'Z', '州': 'Z', '正': 'Z', '主': 'Z'
    };
    
    // 获取汉字的拼音首字母
    static getPinyinInitial(chineseChar) {
        // 首先尝试从映射表获取
        if (this.pinyinMap[chineseChar]) {
            return this.pinyinMap[chineseChar];
        }
        
        // 如果映射表中没有，使用更严格的拼音检测
        return this.getStrictPinyinInitial(chineseChar);
    }
    
    // 严格的拼音首字母检测
    static getStrictPinyinInitial(chineseChar) {
        // 使用更精确的拼音首字母检测
        // 基于汉字的实际拼音，而不是简单的排序比较
        
        // 常见的A开头汉字
        const aChars = ['阿', '安', '鞍', '艾', '爱', '奥'];
        if (aChars.includes(chineseChar)) return 'A';
        
        // 常见的B开头汉字
        const bChars = ['白', '包', '宝', '保', '北', '蚌', '百', '本', '毕', '滨', '亳', '巴', '博', '布'];
        if (bChars.includes(chineseChar)) return 'B';
        
        // 常见的C开头汉字
        const cChars = ['长', '成', '重', '昌', '常', '沧', '承', '赤', '朝', '潮', '郴', '池', '崇', '滁', '春', '城'];
        if (cChars.includes(chineseChar)) return 'C';
        
        // 常见的D开头汉字
        const dChars = ['大', '东', '德', '达', '定', '丹', '都', '多', '当', '道'];
        if (dChars.includes(chineseChar)) return 'D';
        
        // 常见的E开头汉字
        const eChars = ['鄂', '恩', '二'];
        if (eChars.includes(chineseChar)) return 'E';
        
        // 常见的F开头汉字
        const fChars = ['佛', '抚', '阜', '防', '福', '方', '分'];
        if (fChars.includes(chineseChar)) return 'F';
        
        // 常见的G开头汉字
        const gChars = ['广', '贵', '固', '甘', '赣', '桂', '果', '高', '国', '工'];
        if (gChars.includes(chineseChar)) return 'G';
        
        // 常见的H开头汉字
        const hChars = ['海', '哈', '杭', '汉', '河', '湖', '黑', '衡', '黄', '惠', '淮', '华', '红', '会'];
        if (hChars.includes(chineseChar)) return 'H';
        
        // 常见的J开头汉字
        const jChars = ['济', '金', '江', '嘉', '酒', '九', '晋', '吉', '焦', '揭', '建', '江', '集', '锦'];
        if (jChars.includes(chineseChar)) return 'J';
        
        // 常见的K开头汉字
        const kChars = ['可', '克', '开', '昆', '喀', '康', '口'];
        if (kChars.includes(chineseChar)) return 'K';
        
        // 常见的L开头汉字
        const lChars = ['兰', '林', '泸', '洛', '六', '廊', '临', '聊', '辽', '龙', '来', '乐', '丽', '连'];
        if (lChars.includes(chineseChar)) return 'L';
        
        // 常见的M开头汉字
        const mChars = ['眉', '绵', '茂', '梅', '马', '满', '明', '茂', '美'];
        if (mChars.includes(chineseChar)) return 'M';
        
        // 常见的N开头汉字
        const nChars = ['内', '南', '宁', '年', '怒', '南', '农', '女'];
        if (nChars.includes(chineseChar)) return 'N';
        
        // 常见的P开头汉字
        const pChars = ['平', '莆', '盘', '攀', '萍', '普', '平', '彭'];
        if (pChars.includes(chineseChar)) return 'P';
        
        // 常见的Q开头汉字
        const qChars = ['青', '庆', '泉', '清', '黔', '钦', '七', '齐', '曲'];
        if (qChars.includes(chineseChar)) return 'Q';
        
        // 常见的R开头汉字
        const rChars = ['日', '如', '瑞', '人', '任'];
        if (rChars.includes(chineseChar)) return 'R';
        
        // 常见的S开头汉字
        const sChars = ['深', '上', '山', '双', '石', '商', '宿', '随', '韶', '汕', '三', '四', '松', '苏'];
        if (sChars.includes(chineseChar)) return 'S';
        
        // 常见的T开头汉字
        const tChars = ['天', '天', '铜', '图', '太', '泰', '通', '铁', '同', '台', '唐'];
        if (tChars.includes(chineseChar)) return 'T';
        
        // 常见的U开头汉字
        const uChars = ['乌', '武', '温', '吴', '五', '万', '文'];
        if (uChars.includes(chineseChar)) return 'U';
        
        // 常见的X开头汉字
        const xChars = ['西', '信', '新', '厦', '徐', '许', '咸', '忻', '邢', '襄', '孝', '小', '兴', '香'];
        if (xChars.includes(chineseChar)) return 'X';
        
        // 常见的Y开头汉字
        const yChars = ['银', '烟', '延', '盐', '扬', '阳', '伊', '宜', '益', '鹰', '营', '永', '榆', '玉', '岳', '云', '运', '一', '有', '友'];
        if (yChars.includes(chineseChar)) return 'Y';
        
        // 常见的Z开头汉字
        const zChars = ['郑', '中', '舟', '周', '株', '漳', '肇', '镇', '枣', '湛', '张', '昭', '中', '正', '主'];
        if (zChars.includes(chineseChar)) return 'Z';
        
        // 如果都不匹配，返回默认值
        return 'Z';
    }
    
    // 按拼音首字母分组城市（自然分组，不强制创建所有字母组）
    static groupCitiesByPinyin(cities) {
        const cityGroups = {};
        
        // 按城市名称的拼音排序
        const sortedCities = cities.sort((a, b) => {
            const nameA = a.name || a;
            const nameB = b.name || b;
            return nameA.localeCompare(nameB, 'zh-CN');
        });
        
        // 按拼音首字母分组
        sortedCities.forEach(city => {
            const cityName = city.name || city;
            // 移除"市"字，获取城市名
            const cleanName = cityName.replace('市', '');
            
            // 获取第一个汉字的拼音首字母
            const firstChar = cleanName.charAt(0);
            const pinyinInitial = this.getPinyinInitial(firstChar);
            
            // 动态创建分组，不预先初始化所有字母
            if (!cityGroups[pinyinInitial]) {
                cityGroups[pinyinInitial] = [];
            }
            cityGroups[pinyinInitial].push(city);
        });
        
        // 对每个分组内的城市排序
        Object.keys(cityGroups).forEach(group => {
            cityGroups[group].sort((a, b) => {
                const nameA = a.name || a;
                const nameB = b.name || b;
                return nameA.localeCompare(nameB, 'zh-CN');
            });
        });
        

        
        return cityGroups;
    }
    
    // 获取分组统计信息
    static getGroupStatistics(cityGroups) {
        const stats = {};
        Object.keys(cityGroups).forEach(group => {
            stats[group] = cityGroups[group].length;
        });
        return stats;
    }
    
    // 获取指定字母组的所有城市
    static getCitiesByGroup(cityGroups, letter) {
        return cityGroups[letter] || [];
    }
    
    // 搜索城市（支持模糊搜索）
    static searchCities(cityGroups, keyword) {
        const results = {};
        const searchLower = keyword.toLowerCase();
        
        Object.keys(cityGroups).forEach(group => {
            const filtered = cityGroups[group].filter(city => {
                const cityName = city.name || city;
                return cityName.toLowerCase().includes(searchLower);
            });
            
            if (filtered.length > 0) {
                results[group] = filtered;
            }
        });
        
        return results;
    }
    
    // 获取热门城市（按分组）
    static getHotCitiesByGroup(cityGroups, hotCities) {
        const hotCitiesByGroup = {};
        
        hotCities.forEach(cityName => {
            Object.keys(cityGroups).forEach(group => {
                const found = cityGroups[group].find(city => 
                    (city.name || city) === cityName
                );
                
                if (found) {
                    if (!hotCitiesByGroup[group]) {
                        hotCitiesByGroup[group] = [];
                    }
                    hotCitiesByGroup[group].push(found);
                }
            });
        });
        
        return hotCitiesByGroup;
    }
    
    // 验证分组结果
    static validateGrouping(cityGroups) {
        const issues = [];
        
        // 检查是否有空分组
        Object.keys(cityGroups).forEach(group => {
            if (cityGroups[group].length === 0) {
                issues.push(`分组 ${group} 没有城市`);
            }
        });
        
        // 检查城市是否被正确分组
        const allCities = [];
        Object.values(cityGroups).forEach(cities => {
            allCities.push(...cities);
        });
        
        if (allCities.length === 0) {
            issues.push('没有找到任何城市');
        }
        
        return {
            isValid: issues.length === 0,
            issues,
            totalCities: allCities.length,
            totalGroups: Object.keys(cityGroups).length
        };
    }
}

// 拼音分组缓存（避免重复计算）
const pinyinGroupingCache = new Map();

// 带缓存的拼音分组
export const groupCitiesByPinyinWithCache = (cities) => {
    const cacheKey = JSON.stringify(cities.map(city => city.name || city).sort());
    
    if (pinyinGroupingCache.has(cacheKey)) {
        return pinyinGroupingCache.get(cacheKey);
    }
    
    const groupedCities = PinyinGrouping.groupCitiesByPinyin(cities);
    pinyinGroupingCache.set(cacheKey, groupedCities);
    
    return groupedCities;
}; 