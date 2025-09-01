import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { fetchAllCities, sortCitiesByCoordinates, sortCitiesByAlphabet } from '../utils/cityData';

export default function Relocation() {
    const router = useRouter();

    // 当前选择状态 - 从本地存储获取或使用默认值
    const [currentCity, setCurrentCity] = useState('');
    const [locatedCity, setLocatedCity] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');

    // 热门城市列表
    const hotCities = [
        '北京', '上海', '广州', '天津', '重庆', '成都', '长沙', '哈尔滨', '杭州'
    ];

    // 城市数据状态
    const [citiesByPinyin, setCitiesByPinyin] = useState({});
    const [isLoadingCities, setIsLoadingCities] = useState(true);
    const [cityLoadError, setCityLoadError] = useState('');
    const [groupingMethod, setGroupingMethod] = useState('smart');

    // 位置相关状态
    const [currentLocation, setCurrentLocation] = useState(null);



    // 获取所有城市数据
    const fetchCitiesData = async (method = null) => {
        try {
            setIsLoadingCities(true);
            setCityLoadError('');

            // 清除旧的缓存数据，确保获取最新数据
            localStorage.removeItem('citiesData');
            localStorage.removeItem('citiesDataTimestamp');

            // 使用传入的方法参数，如果没有传入则使用当前状态
            const currentMethod = method || groupingMethod;

            // 尝试从高德地图API获取真实城市数据
            let citiesData;
            try {
                citiesData = await fetchAllCities();
                // 成功从 API 获取城市数据：省略日志输出
            } catch (apiError) {
                console.error('API获取失败:', apiError);
                throw new Error('无法获取城市数据，请检查网络连接或API配置');
            }

            // 根据分组方式选择分组函数
            let sortedCities;
            try {
                if (currentMethod === 'alphabet') {
                    // 使用首字母分组
                    sortedCities = sortCitiesByAlphabet(citiesData);
                } else {
                    // 使用经纬度分组
                    sortedCities = await sortCitiesByCoordinates(citiesData, currentMethod);
                }
            } catch (error) {
                // 如果经纬度分组失败，显示错误信息
                console.error('分组失败:', error);
                setCityLoadError('经纬度分组失败，请切换到首字母分组');
                // 自动切换到首字母分组
                setGroupingMethod('alphabet');
                sortedCities = sortCitiesByAlphabet(citiesData);
            }

            // 更新状态
            setCitiesByPinyin(sortedCities);

            // 保存到本地存储（保存排序后的数据，不是原始数据）
            localStorage.setItem('citiesData', JSON.stringify(sortedCities));
            localStorage.setItem('citiesDataTimestamp', Date.now().toString());

        } catch (error) {
            console.error('获取城市数据失败:', error);
            setCityLoadError('获取城市数据失败');
        } finally {
            setIsLoadingCities(false);
        }
    };



    // 选择城市
    const handleCitySelect = (city) => {
        setCurrentCity(city);

        // 保存选择的城市到本地存储
        localStorage.setItem('selectedCity', city);

        // 延迟1秒后返回首页（给用户视觉反馈）
        setTimeout(() => {
            router.push('/');
        }, 1000);


    };

    // 获取当前定位城市和已选择的城市
    useEffect(() => {
        // 不自动设置已选择的城市，让用户重新选择
        // const savedCity = localStorage.getItem('selectedCity');
        // if (savedCity) {
        //     setCurrentCity(savedCity);
        // }

        // 从本地存储获取定位城市
        const savedLocation = localStorage.getItem('selectedLocation');
        if (savedLocation) {
            setLocatedCity(savedLocation);
        }
        
        // 无论是否有保存的位置，都尝试获取当前位置（更新位置信息）
        getCurrentLocation();

        // 检查是否需要获取城市数据
        const checkAndFetchCities = async () => {
            // 强制清除本地存储，确保获取最新的过滤后数据
            localStorage.removeItem('citiesData');
            localStorage.removeItem('citiesDataTimestamp');

            const savedCities = localStorage.getItem('citiesData');
            const savedTimestamp = localStorage.getItem('citiesDataTimestamp');
            const currentTime = Date.now();

            // 如果本地没有城市数据，或者数据超过24小时，则重新获取
            if (!savedCities || !savedTimestamp || (currentTime - parseInt(savedTimestamp)) > 24 * 60 * 60 * 1000) {
                await fetchCitiesData(groupingMethod);
            } else {
                try {
                    const parsedCities = JSON.parse(savedCities);

                    // 验证数据格式是否正确
                    if (Array.isArray(parsedCities)) {
                        await fetchCitiesData(groupingMethod);
                        return;
                    }

                    // 检查是否是按拼音分组的对象格式
                    const keys = Object.keys(parsedCities);
                    if (keys.length === 0 || !Array.isArray(parsedCities[keys[0]])) {
                        await fetchCitiesData(groupingMethod);
                        return;
                    }

                    setCitiesByPinyin(parsedCities);
                    setIsLoadingCities(false);
                } catch (parseError) {
                    console.error('解析本地城市数据失败:', parseError);
                    await fetchCitiesData(groupingMethod);
                }
            }
        };

        checkAndFetchCities();
    }, []);

    // 监听分组方法变化，重新获取数据
    useEffect(() => {
        if (Object.keys(citiesByPinyin).length > 0) {
            // 只有当已经有城市数据时才重新获取，避免初始加载时重复调用
            fetchCitiesData(groupingMethod);
        }
    }, [groupingMethod]);



    // 首字母分组函数（传统方式）
    const getFallbackSorting = (cities) => {
        const fallbackMap = {};

        cities.forEach(city => {
            const cityName = city.name || city;
            const firstChar = cityName.charAt(0).toUpperCase();

            if (!fallbackMap[firstChar]) {
                fallbackMap[firstChar] = [];
            }
            fallbackMap[firstChar].push(city);
        });

        const sorted = {};
        Object.keys(fallbackMap)
            .sort()
            .forEach(key => {
                sorted[key] = fallbackMap[key].sort((a, b) => {
                    const nameA = a.name || a;
                    const nameB = b.name || b;
                    return nameA.localeCompare(nameB, 'zh-CN');
                });
            });

        return sorted;
    };

    // 获取分组描述
    const getGroupDescription = (letter, method) => {
        const descriptions = {
            smart: {
                'A': '西北高原',
                'B': '西南山区',
                'C': '中部平原',
                'D': '东南沿海',
                'E': '东北平原',
                'F': '青藏高原',
                'G': '其他地区'
            },
            longitude: {
                'A': '新疆、西藏西部',
                'B': '西藏、青海',
                'C': '四川、云南',
                'D': '重庆、贵州、广西',
                'E': '广东、福建、浙江',
                'F': '江苏、上海、山东',
                'G': '辽宁、吉林、黑龙江',
                'H': '内蒙古东部'
            },
            latitude: {
                'A': '黑龙江北部',
                'B': '内蒙古、黑龙江',
                'C': '北京、天津、河北',
                'D': '山东、河南、陕西',
                'E': '江苏、安徽、湖北',
                'F': '浙江、江西、湖南',
                'G': '广东、广西、海南',
                'H': '云南南部'
            },
            grid: {
                'A': '西北区域',
                'B': '西南区域',
                'C': '中部区域',
                'D': '东南区域',
                'E': '东北区域',
                'F': '青藏区域',
                'G': '其他区域'
            }
        };

        return descriptions[method]?.[letter] || '';
    };

    // 获取当前位置
    const getCurrentLocation = () => {
        // 先设置加载状态
        setLocatedCity('正在定位...');
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        console.log('获取到位置坐标:', { latitude, longitude });

                        // 保存坐标信息
                        const coords = { lat: latitude, lng: longitude };
                        setCurrentLocation(coords);

                        // 设置默认城市名称
                        setLocatedCity('已获取位置');
                        localStorage.setItem('selectedLocation', '已获取位置');
                        localStorage.setItem('currentLocationCoords', JSON.stringify(coords));

                        console.log('位置信息已保存');
                    } catch (error) {
                        console.error('获取位置信息失败:', error);
                        setLocatedCity('定位失败');
                    }
                },
                (error) => {
                    console.error('定位失败:', error);
                    let errorMessage = '定位失败';
                    
                    // 根据错误类型提供更具体的提示
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = '位置权限被拒绝，请允许位置访问';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = '位置信息不可用';
                            break;
                        case error.TIMEOUT:
                            errorMessage = '定位超时，请重试';
                            break;
                        default:
                            errorMessage = '定位失败，请重试';
                    }
                    
                    setLocatedCity(errorMessage);
                },
                {
                    enableHighAccuracy: true, // 高精度定位
                    timeout: 15000, // 15秒超时
                    maximumAge: 60000 // 1分钟内缓存
                }
            );
        } else {
            setLocatedCity('浏览器不支持定位');
        }
    };

    // 过滤城市（搜索功能）
    const filteredCities = searchKeyword ?
        Object.entries(citiesByPinyin).reduce((acc, [letter, cityList]) => {
            // 确保 cityList 是数组
            if (!Array.isArray(cityList)) {
                // 城市列表不是数组：忽略该分组
                return acc;
            }

            const filtered = cityList.filter(city =>
                city && city.name && city.name.toLowerCase().includes(searchKeyword.toLowerCase())
            );
            if (filtered.length > 0) {
                acc[letter] = filtered;
            }
            return acc;
        }, {}) : citiesByPinyin;





    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc'
        }}>
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
            {/* 页面头部 */}
            <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                padding: '20px',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* 城市剪影背景 */}
                <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    height: '40px',
                    background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1000 100\'%3E%3Cpath d=\'M0,100 L0,80 Q50,60 100,80 L200,70 Q250,50 300,70 L400,60 Q450,40 500,60 L600,50 Q650,30 700,50 L800,40 Q850,20 900,40 L1000,30 L1000,100 Z\' fill=\'rgba(255,255,255,0.1)\'/%3E%3C/svg%3E")',
                    backgroundSize: 'cover'
                }}></div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    {/* 返回首页按钮 */}
                    <Link href="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        color: 'white'
                    }}>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </Link>

                    <h1 style={{
                        margin: 0,
                        fontSize: '20px',
                        fontWeight: '600'
                    }}>
                        选择城市
                    </h1>

                    {/* 右侧占位，保持标题居中 */}
                    <div style={{ width: '32px' }}></div>
                </div>

                {/* 搜索栏 */}
                <div style={{
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'white',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}>
                        <span style={{
                            fontSize: '18px',
                            color: '#9ca3af',
                            marginRight: '12px'
                        }}>
                            🔍
                        </span>
                        <input
                            type="text"
                            placeholder="请输入城市名称"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    // 搜索功能已移除
                                }
                            }}
                            style={{
                                border: 'none',
                                outline: 'none',
                                fontSize: '16px',
                                color: '#374151',
                                flex: 1,
                                background: 'transparent'
                            }}
                        />

                    </div>
                </div>
            </div>

            {/* 内容区域 */}
            <div style={{
                padding: '20px',
                marginTop: '-20px'
            }}>
                {/* 统一的滚动容器 */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    height: 'calc(100vh - 100px)',
                    overflow: 'auto',
                    position: 'relative'
                }}>
                    {/* 我的位置 */}
                    <div style={{
                        padding: '24px 24px 20px 24px',
                        borderBottom: '1px solid #f1f5f9'
                    }}>
                        <div style={{
                            marginBottom: '20px'
                        }}>
                            <div style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '12px'
                            }}>
                                我的位置
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '16px',
                                    color: '#64748b'
                                }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        background: '#3b82f6',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '12px'
                                    }}>
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                            <circle cx="12" cy="9" r="2.5" />
                                        </svg>
                                    </div>
                                    {locatedCity || '正在定位...'}
                                </div>
                                <button
                                    onClick={() => getCurrentLocation()}
                                    style={{
                                        background: '#3b82f6',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '8px 16px',
                                        fontSize: '14px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    重新定位
                                </button>
                            </div>
                        </div>



                        {/* 热门城市 */}
                        <div>
                            <div style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '16px'
                            }}>
                                热门城市
                            </div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '12px'
                            }}>
                                {hotCities.map((city) => (
                                    <button
                                        key={city}
                                        onClick={() => handleCitySelect(city)}
                                        style={{
                                            padding: '16px 12px',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '12px',
                                            background: currentCity === city ? '#3b82f6' : '#f8fafc',
                                            color: currentCity === city ? 'white' : '#374151',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            fontWeight: '500'
                                        }}
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 按字母排序的城市列表 */}
                    <div style={{
                        padding: '24px'
                    }}>
                        {/* 城市数据加载状态 */}
                        {isLoadingCities && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '40px 20px',
                                color: '#64748b',
                                fontSize: '16px'
                            }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid #e2e8f0',
                                    borderTop: '2px solid #3b82f6',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    marginRight: '12px'
                                }}></div>
                                正在加载城市数据...
                            </div>
                        )}

                        {/* 城市数据加载错误 */}
                        {cityLoadError && !isLoadingCities && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '20px',
                                color: '#ef4444',
                                fontSize: '14px',
                                background: '#fef2f2',
                                borderRadius: '8px',
                                marginBottom: '20px'
                            }}>
                                ⚠️ {cityLoadError}
                                <button
                                    onClick={fetchAllCities}
                                    style={{
                                        marginLeft: '12px',
                                        background: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '6px 12px',
                                        fontSize: '12px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    重试
                                </button>
                            </div>
                        )}

                        {/* 城市列表标题和分组方式切换按钮 */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '24px'
                        }}>
                            <div style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                color: '#1e293b'
                            }}>
                                {groupingMethod === 'smart' ? '按经纬度分组' : '按首字母分组'}
                            </div>

                            {/* 分组方式切换按钮 */}
                            <button
                                onClick={() => {
                                    const newMethod = groupingMethod === 'smart' ? 'alphabet' : 'smart';
                                    setGroupingMethod(newMethod);
                                    // 直接传递新的分组方法，避免状态更新延迟问题
                                    fetchCitiesData(newMethod);
                                }}
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    background: '#3b82f6',
                                    color: 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {groupingMethod === 'smart' ? (
                                    <>
                                        切换到首字母分组
                                    </>
                                ) : (
                                    <>
                                        切换到经纬度分组
                                    </>
                                )}
                            </button>
                        </div>

                        {!isLoadingCities && Object.entries(filteredCities).map(([letter, cities]) => {
                            // 确保 cities 是数组
                            if (!Array.isArray(cities)) {
                                // 城市列表不是数组：忽略该分组
                                return null;
                            }

                            return (
                                <div key={letter} style={{
                                    marginBottom: '20px'
                                }}>
                                    {/* 字母标题 */}
                                    <div
                                        data-letter={letter}
                                        style={{
                                            fontSize: '18px',
                                            fontWeight: '700',
                                            color: '#3b82f6',
                                            marginBottom: '16px',
                                            padding: '8px 0',
                                            borderBottom: '2px solid #e2e8f0'
                                        }}
                                    >
                                        {letter}
                                        {groupingMethod !== 'alphabet' && (
                                            <span style={{
                                                fontSize: '12px',
                                                fontWeight: '400',
                                                color: '#6b7280',
                                                marginLeft: '8px'
                                            }}>
                                                {getGroupDescription(letter, groupingMethod)}
                                            </span>
                                        )}
                                    </div>

                                    {/* 城市列表 - 垂直排列 */}
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        {cities.map((city, index) => (
                                            <div
                                                key={city.name || city}
                                                onClick={() => handleCitySelect(city.name || city)}
                                                style={{
                                                    padding: '16px 12px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    borderBottom: index < cities.length - 1 ? '1px solid #f1f5f9' : 'none',
                                                    background: currentCity === city ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                                    color: currentCity === city ? '#3b82f6' : '#374151',
                                                    fontSize: '15px',
                                                    fontWeight: '500',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (currentCity !== city) {
                                                        e.target.style.background = '#f8fafc';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (currentCity !== city) {
                                                        e.target.style.background = 'transparent';
                                                    }
                                                }}
                                            >
                                                <span>{city.name || city}</span>
                                                {currentCity === (city.name || city) && (
                                                    <span style={{
                                                        color: '#3b82f6',
                                                        fontSize: '14px'
                                                    }}>
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}



                        {/* 底部填充区域，确保内容铺满 */}
                        <div style={{
                            height: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#9ca3af',
                            fontSize: '14px',
                            background: 'linear-gradient(180deg, transparent 0%, rgba(59, 130, 246, 0.05) 100%)'
                        }}>
                            已显示所有城市
                        </div>
                    </div>

                    {/* 右侧字母快速导航 */}
                    <div style={{
                        position: 'fixed',
                        right: '0',
                        top: '60%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '20px 0 0 20px',
                        padding: '8px 3px 8px 8px',
                        zIndex: 100,
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.1)'
                    }}>
                        {/* 字母导航 - 只显示有城市的分组，按字母顺序排列 */}
                        {Object.keys(filteredCities).sort().map((letter) => (
                            <div
                                key={letter}
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#3b82f6',
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    borderRadius: '50%',
                                    margin: '0.5px 0',
                                    transition: 'all 0.2s ease',
                                    userSelect: 'none',
                                    background: 'transparent'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = '#3b82f6';
                                    e.target.style.color = 'white';
                                    e.target.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = '#3b82f6';
                                    e.target.style.transform = 'scale(1)';
                                }}
                                onClick={() => {
                                    // 点击字母跳转到对应位置
                                    const element = document.querySelector(`[data-letter="${letter}"]`);
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                }}
                            >
                                {letter}
                            </div>
                        ))}
                    </div>
                </div>
            </div>


        </div>
    );
} 