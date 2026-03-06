// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, useToast } from '@/components/ui';
// @ts-ignore;
import { Package, Clock, CheckCircle, XCircle, DollarSign, Calendar, FileText, User, Phone, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

import { TabBar } from '@/components/TabBar';
export default function OrderManagement({
  $w
}) {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // 从数据源加载订单和资金明细
  useEffect(() => {
    const loadData = async () => {
      try {
        // 加载订单列表
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
            orderBy: [{
              createdAt: 'desc'
            }],
            pageSize: 50,
            pageNumber: 1
          }
        });
        if (ordersResult?.records) {
          // 将数据转换为前端格式
          const formattedOrders = ordersResult.records.map(record => ({
            id: record.orderId || record._id,
            title: record.title,
            company: record.company || '未知企业',
            type: record.type || '采购',
            status: record.status || 'pending',
            amount: record.amount || 0,
            createTime: record.createdAt ? new Date(record.createdAt).toLocaleString('zh-CN') : '未知',
            updateTime: record.updatedAt ? new Date(record.updatedAt).toLocaleString('zh-CN') : '未知',
            paymentStatus: record.paymentStatus || 'unpaid',
            creditScore: record.creditScore || 0,
            contactName: record.contactName || '-',
            contactPhone: record.contactPhone || '-',
            category: record.category || '-',
            description: record.description || '-',
            paymentMethod: record.paymentMethod || '资金托管',
            completionTime: record.completionTime ? new Date(record.completionTime).toLocaleString('zh-CN') : ''
          }));
          setOrders(formattedOrders);

          // 生成资金明细（实际项目中应该从单独的资金明细表查询）
          const formattedTransactions = ordersResult.records.filter(record => record.paymentStatus === 'paid' || record.paymentStatus === 'refunded').map(record => ({
            id: `TXN${record._id}`,
            orderId: record.orderId || record._id,
            type: record.paymentStatus === 'refunded' ? 'refund' : record.type === '销售' ? 'income' : 'expense',
            amount: record.amount || 0,
            description: `${record.paymentStatus === 'refunded' ? '订单退款' : record.type === '销售' ? '订单完成收入' : '订单付款'} - ${record.title}`,
            time: record.updatedAt ? new Date(record.updatedAt).toLocaleString('zh-CN') : '未知',
            status: 'success'
          }));
          setTransactions(formattedTransactions);
        }
      } catch (error) {
        console.error('加载订单数据失败:', error);
        toast({
          title: '加载失败',
          description: error.message || '无法加载订单数据',
          status: 'error'
        });
      }
    };
    loadData();
  }, []);

  // 根据状态筛选订单
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  // 获取状态配置
  const getStatusConfig = status => {
    const configs = {
      pending: {
        label: '待付款',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-700',
        icon: Clock
      },
      escrow: {
        label: '托管中',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        icon: Package
      },
      pending_acceptance: {
        label: '待验收',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-700',
        icon: FileText
      },
      completed: {
        label: '已完成',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        icon: CheckCircle
      },
      cancelled: {
        label: '已取消',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        icon: XCircle
      }
    };
    return configs[status] || {
      label: status,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      icon: FileText
    };
  };

  // 获取支付状态配置
  const getPaymentStatusConfig = status => {
    const configs = {
      unpaid: {
        label: '未付款',
        color: 'bg-orange-500'
      },
      paid: {
        label: '已付款',
        color: 'bg-blue-500'
      },
      escrow: {
        label: '托管中',
        color: 'bg-purple-500'
      },
      refunded: {
        label: '已退款',
        color: 'bg-gray-500'
      }
    };
    return configs[status] || {
      label: status,
      color: 'bg-gray-500'
    };
  };

  // 查看订单详情
  const handleViewOrderDetail = order => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  // 资金统计
  const financialStats = {
    totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    totalExpense: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    totalRefund: transactions.filter(t => t.type === 'refund').reduce((sum, t) => sum + t.amount, 0)
  };
  const netIncome = financialStats.totalIncome - financialStats.totalExpense - financialStats.totalRefund;
  return <div className="min-h-screen bg-[#F5F5F5] font-sans pb-24">
      {/* 顶部导航 */}
      <div className="bg-[#0D47A1] text-white py-6 px-4 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold" style={{
          fontFamily: 'Space Mono, monospace'
        }}>订单管理</h1>
          <p className="text-blue-100 text-sm mt-1">管理您的交易订单和资金明细</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 资金概览卡片 */}
        <Card className="mb-6 shadow-lg bg-gradient-to-r from-[#0D47A1] to-[#1565C0] text-white">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <DollarSign className="mr-2" />
              资金概览
            </CardTitle>
            <CardDescription className="text-blue-100">平台资金托管，保障交易安全</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-100">总收入</span>
                  <TrendingUp size={20} className="text-green-300" />
                </div>
                <div className="text-2xl font-bold mt-2">¥{financialStats.totalIncome.toLocaleString()}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-100">总支出</span>
                  <TrendingDown size={20} className="text-red-300" />
                </div>
                <div className="text-2xl font-bold mt-2">¥{financialStats.totalExpense.toLocaleString()}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-100">退款</span>
                  <FileText size={20} className="text-yellow-300" />
                </div>
                <div className="text-2xl font-bold mt-2">¥{financialStats.totalRefund.toLocaleString()}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-100">净收入</span>
                  <DollarSign size={20} className={netIncome >= 0 ? 'text-green-300' : 'text-red-300'} />
                </div>
                <div className={`text-2xl font-bold mt-2 ${netIncome >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  ¥{netIncome.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 标签页切换 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-white border border-gray-200 w-full justify-start overflow-x-auto">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#0D47A1] data-[state=active]:text-white">
              全部
              <Badge className="ml-2 bg-gray-200 text-gray-700">{orders.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-[#0D47A1] data-[state=active]:text-white">
              待付款
              <Badge className="ml-2 bg-orange-100 text-orange-700">
                {orders.filter(o => o.status === 'pending').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="escrow" className="data-[state=active]:bg-[#0D47A1] data-[state=active]:text-white">
              托管中
              <Badge className="ml-2 bg-blue-100 text-blue-700">
                {orders.filter(o => o.status === 'escrow').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending_acceptance" className="data-[state=active]:bg-[#0D47A1] data-[state=active]:text-white">
              待验收
              <Badge className="ml-2 bg-purple-100 text-purple-700">
                {orders.filter(o => o.status === 'pending_acceptance').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-[#0D47A1] data-[state=active]:text-white">
              已完成
              <Badge className="ml-2 bg-green-100 text-green-700">
                {orders.filter(o => o.status === 'completed').length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 订单列表 */}
        <div className="space-y-4">
          {filteredOrders.map(order => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;
          const paymentConfig = getPaymentStatusConfig(order.paymentStatus);
          return <Card key={order.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => handleViewOrderDetail(order)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor} text-xs`}>
                          <StatusIcon size={12} className="mr-1" />
                          {statusConfig.label}
                        </Badge>
                        <Badge variant={order.type === '采购' ? 'default' : 'secondary'} className={order.type === '采购' ? 'bg-[#00BCD4] text-white' : 'bg-[#FF6F00] text-white'}>
                          {order.type}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900">{order.title}</CardTitle>
                      <CardDescription className="mt-1">{order.company}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#0D47A1]">¥{order.amount.toLocaleString()}</div>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <div className={`w-2 h-2 rounded-full ${paymentConfig.color}`}></div>
                        <span className="text-sm text-gray-600">{paymentConfig.label}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar size={16} className="mr-2 text-[#FF6F00]" />
                      <div>
                        <div className="text-xs text-gray-500">下单时间</div>
                        <div className="font-medium">{order.createTime.split(' ')[0]}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User size={16} className="mr-2 text-[#00BCD4]" />
                      <div>
                        <div className="text-xs text-gray-500">联系人</div>
                        <div className="font-medium">{order.contactName}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">信用分：</span>
                        <span className="text-sm font-semibold text-[#0D47A1]">{order.creditScore}</span>
                        <span className="text-sm text-gray-500">类别：</span>
                        <span className="text-sm font-medium text-gray-700">{order.category}</span>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>;
        })}

          {/* 空状态 */}
          {filteredOrders.length === 0 && <Card className="text-center py-16">
              <CardContent>
                <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无订单</h3>
                <p className="text-gray-500 mb-6">该状态下暂时没有订单记录</p>
                <Button onClick={() => setActiveTab('all')} className="bg-[#0D47A1] hover:bg-[#0a3a8e] text-white">
                  查看全部订单
                </Button>
              </CardContent>
            </Card>}
        </div>

        {/* 资金明细列表 */}
        <Card className="mt-8 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2" />
              资金明细
            </CardTitle>
            <CardDescription>查看所有交易记录</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map(transaction => {
              const isIncome = transaction.type === 'income';
              const isRefund = transaction.type === 'refund';
              return <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-green-100 text-green-600' : isRefund ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-600'}`}>
                        {isIncome ? <TrendingUp size={20} /> : isRefund ? <FileText size={20} /> : <TrendingDown size={20} />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{transaction.description}</div>
                        <div className="text-sm text-gray-500">{transaction.time}</div>
                      </div>
                      <div className={`text-xl font-bold ${isIncome ? 'text-green-600' : isRefund ? 'text-gray-600' : 'text-red-600'}`}>
                        {isIncome ? '+' : isRefund ? '' : '-'}¥{transaction.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>;
            })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 订单详情弹窗 */}
      <Dialog open={showOrderDetail} onOpenChange={setShowOrderDetail}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>订单详情</DialogTitle>
            <DialogDescription>查看订单的详细信息</DialogDescription>
          </DialogHeader>
          
          {selectedOrder && <div className="space-y-6">
              {/* 基本信息 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">基本信息</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">订单号</label>
                    <div className="font-medium">{selectedOrder.id}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">订单类型</label>
                    <div className="font-medium">{selectedOrder.type}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">订单金额</label>
                    <div className="font-medium text-[#0D47A1]">¥{selectedOrder.amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">支付方式</label>
                    <div className="font-medium">{selectedOrder.paymentMethod}</div>
                  </div>
                </div>
              </div>

              {/* 服务/产品信息 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">服务/产品信息</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">服务名称</label>
                    <div className="font-medium">{selectedOrder.title}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">服务类别</label>
                    <div className="font-medium">{selectedOrder.category}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">详细描述</label>
                    <div className="font-medium text-gray-700">{selectedOrder.description}</div>
                  </div>
                </div>
              </div>

              {/* 供应商/客户信息 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  {selectedOrder.type === '采购' ? '供应商信息' : '客户信息'}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">公司名称</label>
                    <div className="font-medium">{selectedOrder.company}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">联系人</label>
                      <div className="font-medium">{selectedOrder.contactName}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">联系电话</label>
                      <div className="font-medium">{selectedOrder.contactPhone}</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">企业信用分</label>
                    <div className="font-medium text-[#0D47A1]">{selectedOrder.creditScore}</div>
                  </div>
                </div>
              </div>

              {/* 时间信息 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">时间信息</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">下单时间</label>
                    <div className="font-medium">{selectedOrder.createTime}</div>
                  </div>
                  {selectedOrder.updateTime && <div>
                      <label className="text-sm text-gray-500">最后更新</label>
                      <div className="font-medium">{selectedOrder.updateTime}</div>
                    </div>}
                  {selectedOrder.completionTime && <div>
                      <label className="text-sm text-gray-500">完成时间</label>
                      <div className="font-medium">{selectedOrder.completionTime}</div>
                    </div>}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1 border-[#0D47A1] text-[#0D47A1] hover:bg-[#0D47A1] hover:text-white">
                  <Phone className="mr-2" size={16} />
                  联系对方
                </Button>
                <Button className="flex-1 bg-[#0D47A1] hover:bg-[#0a3a8e] text-white">
                  查看更多
                </Button>
              </div>
            </div>}
        </DialogContent>
      </Dialog>

      {/* 底部导航 */}
      <TabBar activePage="orders" onPageChange={pageId => $w.utils.navigateTo({
      pageId
    })} />
    </div>;
}