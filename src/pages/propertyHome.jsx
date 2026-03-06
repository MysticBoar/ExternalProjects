// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast } from '@/components/ui';
// @ts-ignore;
import { Building2, MapPin, TrendingUp, DollarSign, Search, Filter, Heart } from 'lucide-react';

import { PropertyCreditCard } from '@/components/PropertyCreditCard';

// 物业卡片组件
function PropertyCard({
  property,
  isFavorite,
  onToggleFavorite,
  onViewDetail,
  creditData
}) {
  return <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
      <div className="relative h-48 overflow-hidden">
        <img src={property.image} alt={property.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        {property.recommended && <div className="absolute top-3 left-3 bg-[#C9A961] text-white px-3 py-1 rounded-full text-sm font-semibold">
            推荐
          </div>}
        <button onClick={e => {
        e.stopPropagation();
        onToggleFavorite(property.id);
      }} className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'}`}>
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute bottom-3 right-3 bg-[#1B365D] text-white px-3 py-1 rounded-lg text-sm font-semibold">
          匹配度 {property.match}%
        </div>
      </div>
      
      <div className="p-5">
        {/* 物业信用档案卡片 */}
        <PropertyCreditCard creditData={creditData} />

        <h3 className="font-bold text-lg text-[#1B365D] mb-2 line-clamp-2" style={{
        fontFamily: 'Playfair Display, serif'
      }}>
          {property.name}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{property.location}</span>
        </div>
        
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1 text-[#D47A5C]">
            <DollarSign className="w-4 h-4" />
            <span className="font-semibold">{property.price}</span>
          </div>
          <div className="text-gray-500 text-sm">
            {property.area}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {property.tags.map((tag, idx) => <span key={idx} className="px-2 py-1 bg-[#FAF8F5] text-[#2D3748] text-xs rounded">
              {tag}
            </span>)}
        </div>
        
        <button onClick={() => onViewDetail(property)} className="w-full mt-4 bg-[#1B365D] hover:bg-[#2D4A6D] text-white py-2 rounded-lg font-semibold transition-colors">
          查看详情
        </button>
      </div>
    </div>;
}

// 需求卡片组件
function RequirementCard({
  requirement
}) {
  return <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-lg text-[#1B365D]">{requirement.companyName}</h3>
        {requirement.urgent && <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">急</span>}
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">类型：</span>
          <span className="text-[#2D3748] font-medium">{requirement.type}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">面积：</span>
          <span className="text-[#2D3748] font-medium">{requirement.area}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">预算：</span>
          <span className="text-[#D47A5C] font-semibold">{requirement.budget}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">区域：</span>
          <span className="text-[#2D3748] font-medium">{requirement.region}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="text-gray-400 text-sm">{requirement.published}</span>
      </div>
    </div>;
}
export default function PropertyHome(props) {
  const {
    toast
  } = useToast();
  const {
    navigateTo
  } = props.$w.utils;
  const [filterOpen, setFilterOpen] = useState(false);
  const [favorites, setFavorites] = useState([1, 3]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [creditDataMap, setCreditDataMap] = useState({}); // 物业信用数据映射
  const [loading, setLoading] = useState(false);
  const filterOptions = [{
    id: 'all',
    label: '全部'
  }, {
    id: 'office',
    label: '办公楼'
  }, {
    id: 'commercial',
    label: '商业'
  }, {
    id: 'warehouse',
    label: '仓库'
  }];
  const mockProperties = [{
    id: 1,
    name: '科技园创新中心A座',
    type: 'office',
    area: '2000㎡',
    price: '4.5元/㎡/天',
    location: '深圳市南山区科技园',
    tags: ['地铁上盖', '精装修', '带家具'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    recommended: true,
    match: 95
  }, {
    id: 2,
    name: '中央商务区双子塔',
    type: 'commercial',
    area: '1500㎡',
    price: '6.8元/㎡/天',
    location: '深圳市福田区CBD',
    tags: ['地标建筑', '顶级配置'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    recommended: true,
    match: 92
  }, {
    id: 3,
    name: '前海自贸区现代产业园',
    type: 'warehouse',
    area: '5000㎡',
    price: '1.8元/㎡/天',
    location: '深圳市前海自贸区',
    tags: ['政策扶持', '物流便利'],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    recommended: false,
    match: 88
  }, {
    id: 4,
    name: '光明科学城企业总部',
    type: 'office',
    area: '3000㎡',
    price: '3.2元/㎡/天',
    location: '深圳市光明区科学城',
    tags: ['科技创新', '政策优惠'],
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
    recommended: true,
    match: 90
  }];
  const mockRequirements = [{
    id: 1,
    companyName: '创新科技有限公司',
    type: '办公楼',
    area: '500-800㎡',
    budget: '3-5元/㎡/天',
    region: '南山区',
    urgent: true,
    published: '2小时前'
  }, {
    id: 2,
    companyName: '智创供应链管理',
    type: '仓库',
    area: '3000-5000㎡',
    budget: '1.5-2.5元/㎡/天',
    region: '宝安区',
    urgent: false,
    published: '5小时前'
  }, {
    id: 3,
    companyName: '未来文化传媒',
    type: '商业',
    area: '200-300㎡',
    budget: '8-12元/㎡/天',
    region: '福田区',
    urgent: true,
    published: '1天前'
  }];

  // 从数据源加载物业信用数据
  useEffect(() => {
    const fetchCreditData = async () => {
      try {
        setLoading(true);
        const result = await props.$w.cloud.callDataSource({
          dataSourceName: 'credit_property',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                $and: []
              }
            },
            select: {
              $master: true
            },
            orderBy: [{
              createdAt: 'desc'
            }],
            pageSize: 100,
            pageNumber: 1
          }
        });
        if (result && result.records) {
          // 创建楼宇名称到信用数据的映射
          const creditMap = {};
          result.records.forEach(record => {
            if (record.buildingName) {
              creditMap[record.buildingName] = record;
            }
          });
          setCreditDataMap(creditMap);
        }
      } catch (error) {
        console.error('加载物业信用数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCreditData();
  }, []);
  const toggleFavorite = id => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    toast({
      title: favorites.includes(id) ? '已取消收藏' : '已添加到收藏'
    });
  };
  const handlePublishRequirement = () => {
    navigateTo({
      pageId: 'requirementPublish',
      params: {}
    });
  };
  const handleViewDetail = property => {
    navigateTo({
      pageId: 'propertyDetail',
      params: {
        id: property.id
      }
    });
  };
  const filteredProperties = selectedFilter === 'all' ? mockProperties : mockProperties.filter(p => p.type === selectedFilter);
  return <div className="min-h-screen bg-[#FAF8F5]">
      {/* 顶部品牌区域 */}
      <div className="bg-[#1B365D] text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold" style={{
              fontFamily: 'Playfair Display, serif'
            }}>
                物业招商
              </h1>
              <p className="text-[#C9A961] mt-2 text-lg">智能匹配 · 高效对接</p>
            </div>
            <button onClick={handlePublishRequirement} className="bg-[#D47A5C] hover:bg-[#C96B4D] px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              发布需求
            </button>
          </div>

          {/* 搜索栏 */}
          <div className="mt-8 relative">
            <input type="text" placeholder="搜索物业名称、地址、类型..." className="w-full px-6 py-4 rounded-lg text-gray-800 pl-14 focus:outline-none focus:ring-2 focus:ring-[#C9A961]" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 筛选标签 */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[#2D3748] font-semibold">类型筛选：</span>
          {filterOptions.map(option => <button key={option.id} onClick={() => setSelectedFilter(option.id)} className={`px-4 py-2 rounded-full transition-colors ${selectedFilter === option.id ? 'bg-[#1B365D] text-white' : 'bg-white text-[#2D3748] hover:bg-gray-50'}`}>
              {option.label}
            </button>)}
        </div>

        {/* 热门推荐物业 */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-[#D47A5C]" />
            <h2 className="text-2xl font-bold text-[#1B365D]" style={{
            fontFamily: 'Playfair Display, serif'
          }}>
              热门推荐
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProperties.filter(p => p.recommended).map(property => <PropertyCard key={property.id} property={property} isFavorite={favorites.includes(property.id)} onToggleFavorite={toggleFavorite} onViewDetail={handleViewDetail} creditData={creditDataMap[property.name] || null} />)}
          </div>
        </div>

        {/* 所有物业 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-[#D47A5C]" />
              <h2 className="text-2xl font-bold text-[#1B365D]" style={{
              fontFamily: 'Playfair Display, serif'
            }}>
                精选物业
              </h2>
            </div>
            <span className="text-gray-500">共 {filteredProperties.length} 个</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProperties.map(property => <PropertyCard key={property.id} property={property} isFavorite={favorites.includes(property.id)} onToggleFavorite={toggleFavorite} onViewDetail={handleViewDetail} creditData={creditDataMap[property.name] || null} />)}
          </div>
        </div>

        {/* 最新需求 */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-[#D47A5C]" />
            <h2 className="text-2xl font-bold text-[#1B365D]" style={{
            fontFamily: 'Playfair Display, serif'
          }}>
              最新需求
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockRequirements.map(req => <RequirementCard key={req.id} requirement={req} />)}
          </div>
        </div>
      </div>
    </div>;
}