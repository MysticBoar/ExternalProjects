// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Input, useToast } from '@/components/ui';
// @ts-ignore;
import { Search, MapPin, Building2, TrendingUp, ArrowRight, Briefcase, Users, Target, BriefcaseIcon, DollarSign, Calendar, Clock } from 'lucide-react';

import { TabBar } from '@/components/TabBar';
import { CompanyCreditCard } from '@/components/CompanyCreditCard';
export default function Home({
  $w
}) {
  const {
    toast
  } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalSupplies: 0,
    totalOrders: 0,
    totalUsers: 0
  });
  const [requirements, setRequirements] = useState([]);
  const [jobRecommendations, setJobRecommendations] = useState([]); // 岗位推荐
  const [creditDataMap, setCreditDataMap] = useState({}); // 企业信用数据映射

  // 从数据源加载企业信用数据
  useEffect(() => {
    const loadCreditData = async () => {
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
    loadCreditData();
  }, []);

  // 从数据源加载统计数据和最新需求
  useEffect(() => {
    const loadData = async () => {
      try {
        // 加载供求信息统计数据
        const suppliesResult = await $w.cloud.callDataSource({
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
            getCount: true,
            pageSize: 200,
            pageNumber: 1
          }
        });

        // 加载订单统计数据
        const ordersResult = await $w.cloud.callDataSource({
          dataSourceName: 'biz_order',
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
            getCount: true,
            pageSize: 200,
            pageNumber: 1
          }
        });

        // 更新统计数据
        setStats({
          totalProperties: 128,
          // 物业数据暂时固定
          totalSupplies: suppliesResult?.total || 0,
          totalOrders: ordersResult?.total || 0,
          totalUsers: 2340 // 用户数据暂时固定
        });

        // 获取最新的3条供求信息
        if (suppliesResult?.records && suppliesResult.records.length > 0) {
          const latestRequirements = suppliesResult.records.slice(0, 3).map(record => ({
            id: record._id,
            title: record.title,
            company: record.company || '未知企业',
            type: record.type,
            area: record.priceRange || '-',
            budget: record.priceRange || '-',
            region: record.region || '-',
            createTime: record.createdAt ? formatTime(record.createdAt) : '未知',
            matchCount: Math.floor(Math.random() * 20) + 1 // 模拟匹配数
          }));
          setRequirements(latestRequirements);
        }

        // 获取最新的3条岗位推荐（从供求信息中筛选岗位类型）
        if (suppliesResult?.records && suppliesResult.records.length > 0) {
          const jobRecommendations = suppliesResult.records.filter(record => record.type === '岗位' || record.category === '岗位').slice(0, 3).map(record => ({
            id: record._id,
            title: record.title || '高级软件工程师',
            company: record.company || '未知企业',
            salary: record.salary || '15K-25K',
            location: record.region || '深圳南山区',
            experience: record.experience || '3-5年',
            education: record.education || '本科',
            createTime: record.createdAt ? formatTime(record.createdAt) : '未知',
            applicants: Math.floor(Math.random() * 50) + 10 // 模拟申请人数
          }));
          setJobRecommendations(jobRecommendations);
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      }
    };
    loadData();
  }, []);

  // 格式化时间
  const formatTime = timestamp => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return `${days}天前`;
  };
  const handleSearch = () => {
    toast({
      title: '搜索',
      description: `正在搜索：${searchQuery}`,
      status: 'info'
    });
  };
  return <div className="min-h-screen bg-[#F5F5F5] font-sans pb-24">
      {/* 顶部导航 */}
      <div className="bg-[#0D47A1] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2" style={{
          fontFamily: 'Space Mono, monospace'
        }}>企业供需平台</h1>
          <p className="text-blue-100">信息对称 · 信用透明 · 安全交易</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        {/* 搜索框 */}
        <Card className="shadow-xl">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input placeholder="搜索物业、供求信息、企业..." className="pl-10 h-12 border-gray-300 focus:border-[#0D47A1]" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
              </div>
              <Button onClick={handleSearch} className="h-12 px-8 bg-[#FF6F00] hover:bg-[#e65100] text-white font-semibold">
                搜索
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 快捷入口 */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600 text-white" onClick={() => $w.utils.navigateTo({
          pageId: 'propertyHome'
        })}>
            <CardContent className="pt-6 text-center">
              <Building2 size={32} className="mx-auto mb-2" />
              <div className="font-semibold">物业招商</div>
              <div className="text-xs text-blue-100 mt-1">128个房源</div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-gradient-to-br from-orange-500 to-orange-600 text-white" onClick={() => $w.utils.navigateTo({
          pageId: 'supplyPublish'
        })}>
            <CardContent className="pt-6 text-center">
              <Target size={32} className="mx-auto mb-2" />
              <div className="font-semibold">发布需求</div>
              <div className="text-xs text-orange-100 mt-1">快速匹配</div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-gradient-to-br from-teal-500 to-teal-600 text-white" onClick={() => $w.utils.navigateTo({
          pageId: 'orderManagement'
        })}>
            <CardContent className="pt-6 text-center">
              <TrendingUp size={32} className="mx-auto mb-2" />
              <div className="font-semibold">订单管理</div>
              <div className="text-xs text-teal-100 mt-1">892笔订单</div>
            </CardContent>
          </Card>
        </div>

        {/* 平台统计 */}
        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 text-[#0D47A1]" />
              平台数据
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-[#0D47A1]">{stats.totalProperties}</div>
                <div className="text-sm text-gray-600 mt-1">物业房源</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-[#FF6F00]">{stats.totalSupplies}</div>
                <div className="text-sm text-gray-600 mt-1">供求信息</div>
              </div>
              <div className="text-center p-4 bg-teal-50 rounded-lg">
                <div className="text-3xl font-bold text-teal-600">{stats.totalOrders}</div>
                <div className="text-sm text-gray-600 mt-1">完成订单</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{stats.totalUsers}</div>
                <div className="text-sm text-gray-600 mt-1">注册用户</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 最新需求 */}
        <Card className="mt-6 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Target className="mr-2 text-[#FF6F00]" />
                最新需求
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-[#0D47A1]" onClick={() => $w.utils.navigateTo({
              pageId: 'matchResults'
            })}>
                查看全部
                <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requirements.map(req => <Card key={req.id} className="shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer border-l-4 border-l-[#FF6F00]" onClick={() => $w.utils.navigateTo({
              pageId: 'matchResults'
            })}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={req.type === '需求' ? 'bg-[#FF6F00] text-white' : 'bg-[#00BCD4] text-white'}>
                            {req.type}
                          </Badge>
                          <span className="text-sm text-gray-500">{req.createTime}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{req.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{req.company}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-1" />
                            {req.region}
                          </div>
                          <div className="flex items-center">
                            <Briefcase size={14} className="mr-1" />
                            {req.area}
                          </div>
                          <div className="flex items-center">
                            <Users size={14} className="mr-1" />
                            {req.matchCount}个匹配
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#0D47A1]">{req.budget}</div>
                        <Button variant="outline" size="sm" className="mt-2 border-[#0D47A1] text-[#0D47A1] hover:bg-[#0D47A1] hover:text-white">
                          查看详情
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </CardContent>
        </Card>

        {/* 岗位推荐 */}
        <Card className="mt-6 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <BriefcaseIcon className="mr-2 text-[#0D47A1]" />
                岗位推荐
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-[#0D47A1]" onClick={() => $w.utils.navigateTo({
              pageId: 'matchResults'
            })}>
                查看全部
                <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobRecommendations.map(job => <Card key={job.id} className="shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
                  <CardContent className="pt-4">
                    {/* 企业信用档案卡片 */}
                    <CompanyCreditCard creditData={creditDataMap[job.company] || null} />
                    
                    <div className="flex items-start justify-between mt-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-[#0D47A1] text-white">
                            招聘中
                          </Badge>
                          <span className="text-sm text-gray-500">{job.createTime}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{job.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{job.company}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <DollarSign size={14} className="mr-1" />
                            {job.salary}
                          </div>
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {job.experience}
                          </div>
                          <div className="flex items-center">
                            <Users size={14} className="mr-1" />
                            {job.applicants}人申请
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Button variant="outline" size="sm" className="mt-2 border-[#0D47A1] text-[#0D47A1] hover:bg-[#0D47A1] hover:text-white">
                          立即投递
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </CardContent>
        </Card>

        {/* 平台优势 */}
        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 text-[#0D47A1]" />
              平台优势
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg">
                <div className="w-12 h-12 bg-[#0D47A1] rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">LBS智能匹配</h3>
                <p className="text-sm text-gray-600">基于地理位置，3公里范围内精准匹配</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-white rounded-lg">
                <div className="w-12 h-12 bg-[#FF6F00] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">企业信用体系</h3>
                <p className="text-sm text-gray-600">信用透明，减少交易风险</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-white rounded-lg">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">资金托管交易</h3>
                <p className="text-sm text-gray-600">平台担保，保障资金安全</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 底部导航 */}
      <TabBar activePage="home" onPageChange={pageId => $w.utils.navigateTo({
      pageId
    })} />
    </div>;
}