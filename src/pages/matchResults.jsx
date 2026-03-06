// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useToast } from '@/components/ui';
// @ts-ignore;
import { Search, MapPin, Building2, Star, TrendingUp, Phone, Mail, ArrowRight } from 'lucide-react';

import { TabBar } from '@/components/TabBar';
import { CompanyCreditCard } from '@/components/CompanyCreditCard';
export default function MatchResults({
  $w
}) {
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [creditDataMap, setCreditDataMap] = useState({}); // 企业信用数据映射
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDistance, setFilterDistance] = useState('3km');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('match');

  // 从数据源加载企业信用数据
  useEffect(() => {
    const fetchCreditData = async () => {
      try {
        const result = await $w.cloud.callDataSource({
          dataSourceName: 'credit_company',
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
          // 创建企业名称到信用数据的映射
          const creditMap = {};
          result.records.forEach(record => {
            if (record.companyName) {
              creditMap[record.companyName] = record;
            }
          });
          setCreditDataMap(creditMap);
        }
      } catch (error) {
        console.error('加载企业信用数据失败:', error);
      }
    };
    fetchCreditData();
  }, []);

  // 从数据源加载匹配结果
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const result = await $w.cloud.callDataSource({
          dataSourceName: 'biz_supply_demand',
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
            pageSize: 50,
            pageNumber: 1
          }
        });
        if (result && result.records) {
          // 为每条记录添加匹配度和信用数据（实际项目中应该根据业务逻辑计算）
          const matchesWithScore = result.records.map(record => ({
            ...record,
            matchScore: Math.floor(Math.random() * (95 - 70) + 70),
            // 模拟匹配度 70-95
            companyName: record.company || '未知企业',
            creditData: creditDataMap[record.company] || null // 匹配企业信用数据
          }));
          setMatches(matchesWithScore);
        }
      } catch (error) {
        console.error('加载匹配结果失败:', error);
        toast({
          title: '加载失败',
          description: error.message || '无法加载匹配结果',
          status: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [creditDataMap]);

  // 筛选和排序
  const filteredAndSortedMatches = React.useMemo(() => {
    let filtered = matches.filter(item => {
      // 搜索筛选
      const matchSearch = item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase());

      // 距离筛选
      let matchDistance = true;
      if (filterDistance === '3km') {
        matchDistance = item.distance === '同楼宇' || item.distance && parseFloat(item.distance) <= 3;
      } else if (filterDistance === '1km') {
        matchDistance = item.distance === '同楼宇' || item.distance && parseFloat(item.distance) <= 1;
      }

      // 类型筛选
      let matchType = true;
      if (filterType === 'supply') {
        matchType = item.type === '供应';
      } else if (filterType === 'demand') {
        matchType = item.type === '需求';
      }
      return matchSearch && matchDistance && matchType;
    });

    // 排序
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'match') {
        return (b.matchScore || 0) - (a.matchScore || 0);
      } else if (sortBy === 'distance') {
        const distanceA = a.distance === '同楼宇' ? 0 : a.distance ? parseFloat(a.distance) : 999;
        const distanceB = b.distance === '同楼宇' ? 0 : b.distance ? parseFloat(b.distance) : 999;
        return distanceA - distanceB;
      } else if (sortBy === 'credit') {
        return (b.creditScore || 0) - (a.creditScore || 0);
      }
      return 0;
    });
    return sorted;
  }, [matches, searchQuery, filterDistance, filterType, sortBy]);

  // 获取匹配度颜色
  const getMatchColor = score => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    return 'bg-orange-500';
  };

  // 获取类型颜色
  const getTypeColor = type => {
    return type === '供应' ? 'bg-[#00BCD4]' : 'bg-[#FF6F00]';
  };
  const handleContact = company => {
    toast({
      title: '联系信息',
      description: `联系人：${company.contactName}\n电话：${company.contactPhone}`,
      status: 'info'
    });
  };
  const handleViewDetail = id => {
    toast({
      title: '查看详情',
      description: '正在跳转到详情页面...',
      status: 'info'
    });
  };
  return <div className="min-h-screen bg-[#F5F5F5] font-sans pb-24">
      {/* 顶部导航 */}
      <div className="bg-[#0D47A1] text-white py-6 px-4 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold" style={{
          fontFamily: 'Space Mono, monospace'
        }}>匹配结果</h1>
          <p className="text-blue-100 text-sm mt-1">基于您的需求智能推荐</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 搜索和筛选栏 */}
        <Card className="mb-6 shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* 搜索框 */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input placeholder="搜索公司名称、服务类型..." className="pl-10 h-12 border-gray-300 focus:border-[#0D47A1]" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>

              {/* 筛选条件 */}
              <div className="flex flex-wrap gap-3">
                <Select value={filterDistance} onValueChange={setFilterDistance}>
                  <SelectTrigger className="w-[120px] h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部距离</SelectItem>
                    <SelectItem value="3km">3公里内</SelectItem>
                    <SelectItem value="1km">1公里内</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[120px] h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="supply">供应</SelectItem>
                    <SelectItem value="demand">需求</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[120px] h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">按匹配度</SelectItem>
                    <SelectItem value="distance">按距离</SelectItem>
                    <SelectItem value="credit">按信用分</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 加载状态 */}
        {loading ? <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">⟳</div>
              <p className="text-gray-500">正在智能匹配...</p>
            </div>
          </div> : <>
            {/* 统计信息 */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 font-medium">
                找到 <span className="text-[#0D47A1] font-bold text-xl">{filteredAndSortedMatches.length}</span> 个匹配结果
              </p>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-white border-[#0D47A1] text-[#0D47A1]">
                  <MapPin size={14} className="mr-1" /> LBS智能匹配
                </Badge>
              </div>
            </div>

            {/* 匹配结果列表 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredAndSortedMatches.map(item => <Card key={item.id} className="shadow-md hover:shadow-xl transition-shadow duration-300 border-2 hover:border-[#0D47A1] cursor-pointer group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getTypeColor(item.type)} text-white text-xs`}>
                            {item.type}
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            {item.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-[#0D47A1] transition-colors">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="mt-2 flex items-center text-gray-600">
                          <Building2 size={16} className="mr-1" />
                          {item.companyName}
                        </CardDescription>
                      </div>
                      {/* 匹配度 */}
                      <div className="flex flex-col items-center ml-4">
                        <div className={`w-16 h-16 rounded-full ${getMatchColor(item.matchScore)} flex items-center justify-center text-white font-bold text-xl`}>
                          {item.matchScore}%
                        </div>
                        <span className="text-xs text-gray-500 mt-1">匹配度</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* 企业信用档案卡片 */}
                    <CompanyCreditCard creditData={item.creditData} />

                    {/* 关键信息 */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-2 text-[#FF6F00]" />
                        <div>
                          <div className="font-medium text-gray-900">{item.distance}</div>
                          <div className="text-xs text-gray-500">{item.building}</div>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Star size={16} className="mr-2 text-yellow-500 fill-yellow-500" />
                        <div>
                          <div className="font-medium text-gray-900">匹配度 {item.matchScore}%</div>
                          <div className="text-xs text-gray-500">智能推荐</div>
                        </div>
                      </div>
                    </div>

                    {/* 描述 */}
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>

                    {/* 价格 */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="text-sm">
                        <span className="text-gray-500">预算/报价：</span>
                        <span className="font-semibold text-[#0D47A1]">{item.priceRange}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-[#0D47A1] text-[#0D47A1] hover:bg-[#0D47A1] hover:text-white" onClick={e => {
                    e.stopPropagation();
                    handleContact(item);
                  }}>
                          <Phone size={16} className="mr-1" />
                          联系
                        </Button>
                        <Button size="sm" className="bg-[#0D47A1] hover:bg-[#0a3a8e] text-white" onClick={e => {
                    e.stopPropagation();
                    handleViewDetail(item.id);
                  }}>
                          查看详情
                          <ArrowRight size={16} className="ml-1" />
                        </Button>
                      </div>
                    </div>

                    {/* 标签 */}
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, idx) => <Badge key={idx} variant="secondary" className="text-xs bg-gray-100">
                          {tag}
                        </Badge>)}
                    </div>
                  </CardContent>
                </Card>)}
            </div>

            {/* 空状态 */}
            {filteredAndSortedMatches.length === 0 && <Card className="text-center py-16">
                <CardContent>
                  <Search size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无匹配结果</h3>
                  <p className="text-gray-500 mb-6">请尝试调整筛选条件或搜索关键词</p>
                  <Button onClick={() => {
              setSearchQuery('');
              setFilterDistance('3km');
              setFilterType('all');
            }}>
                    重置筛选条件
                  </Button>
                </CardContent>
              </Card>}
          </>}
      </div>

      {/* 底部导航 */}
      <TabBar activePage="match" onPageChange={pageId => $w.utils.navigateTo({
      pageId
    })} />
    </div>;
}