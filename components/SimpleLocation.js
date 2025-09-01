import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SimpleLocation({ autoLocate = false }) {
    const [location, setLocation] = useState(null);
    const [addressInfo, setAddressInfo] = useState({
        province: '',
        city: '',
        district: '',
        county: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // 获取当前位置
    const getCurrentLocation = async () => {
        if (!navigator.geolocation) {
            setAddressInfo({
                province: '不支持定位',
                city: '',
                district: '',
                county: ''
            });
            return;
        }

        setIsLoading(true);

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                });
            });

            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude });

            // 使用高德地图API进行逆地理编码
            try {
                const response = await fetch(
                    `https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=3ca5d757902c200f3f566c42ca6ea657`
                );

                const data = await response.json();

                if (data.status === '1' && data.regeocode) {
                    const address = data.regeocode.addressComponent;
                    setAddressInfo({
                        province: address.province || '',
                        city: address.city || '',
                        district: address.district || '',
                        county: address.county || ''
                    });

                    // 保存到本地存储
                    localStorage.setItem('currentLocation', JSON.stringify({
                        province: address.province || '',
                        city: address.city || '',
                        district: address.district || '',
                        county: address.county || ''
                    }));
                    localStorage.setItem('currentCoords', JSON.stringify({ lat: latitude, lng: longitude }));
                } else {
                    setAddressInfo({
                        province: '定位成功',
                        city: '',
                        district: '',
                        county: ''
                    });
                }
            } catch (error) {
                console.error('逆地理编码失败:', error);
                setAddressInfo({
                    province: '定位成功',
                    city: '',
                    district: '',
                    county: ''
                });
            }
        } catch (error) {
            console.error('定位失败:', error);
            setAddressInfo({
                province: '定位失败',
                city: '',
                district: '',
                county: ''
            });
        } finally {
            setIsLoading(false);
        }
    };

    // 自动定位 - 只在首次进入时执行
    useEffect(() => {
        if (autoLocate) {
            // 检查是否已经执行过定位
            const hasLocated = localStorage.getItem('hasLocated');
            const savedLocation = localStorage.getItem('currentLocation');
            
            if (!hasLocated && !savedLocation) {
                // 只有在没有定位标记且没有保存位置时才执行定位
                getCurrentLocation();
                localStorage.setItem('hasLocated', 'true');
            } else if (savedLocation && !hasLocated) {
                // 如果有保存的位置但没有标记，设置标记
                localStorage.setItem('hasLocated', 'true');
            }
        }
    }, [autoLocate]);

    // 从本地存储读取已保存的位置
    useEffect(() => {
        const savedLocation = localStorage.getItem('currentLocation');
        if (savedLocation) {
            try {
                const parsed = JSON.parse(savedLocation);
                setAddressInfo(parsed);
            } catch (error) {
                console.error('解析保存的位置信息失败:', error);
            }
        } else {
            // 如果没有保存的位置，设置默认状态
            setAddressInfo({
                province: '正在定位...',
                city: '',
                district: '',
                county: ''
            });
        }
    }, []);

    return (
        <div style={{
            padding: '16px 20px',
            background: 'white',
            margin: '0',
            borderBottom: '1px solid #f1f5f9'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                {/* 左侧：省市区县信息 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <div style={{
                        width: '24px',
                        height: '24px',
                        background: '#3b82f6',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px'
                    }}>
                        <svg
                            width="16"
                            height="16"
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
                    <div style={{
                        fontSize: '14px',
                        color: '#374151'
                    }}>
                        {addressInfo.province} {addressInfo.city} {addressInfo.district} {addressInfo.county}
                    </div>
                </div>

                {/* 右侧：两个按钮 */}
                <div style={{
                    display: 'flex',
                    gap: '8px'
                }}>
                                        {/* 重新定位按钮 - 跳转到新页面 */}
                    <Link href="/relocation" style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        color: '#64748b',
                        cursor: 'pointer',
                        fontWeight: '500',
                        textDecoration: 'none',
                        display: 'inline-block',
                        transition: 'all 0.2s ease'
                    }}>
                        重新定位
                    </Link>
                    
                    {/* 定位按钮 - 执行定位 */}
                    <button
                        onClick={getCurrentLocation}
                        disabled={isLoading}
                        style={{
                            background: isLoading ? '#9ca3af' : '#3b82f6',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontSize: '14px',
                            color: 'white',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {isLoading ? '定位中...' : '定位'}
                    </button>
                </div>
            </div>
        </div>
    );
} 