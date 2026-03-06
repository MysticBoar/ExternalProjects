// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, useToast } from '@/components/ui';
// @ts-ignore;
import { AlertTriangle, ShieldCheck, User, Building2, Building, CheckCircle, XCircle, Clock } from 'lucide-react';

export function ViolationManagement({
  $w
}) {
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showPunishDialog, setShowPunishDialog] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [punishReason, setPunishReason] = useState('');
  const [punishScore, setPunishScore] = useState(10);

  // Mock 违规记录数据
  const [violations, setViolations] = useState([{
    id: 1,
    type: 'user',
    targetId: 'user_001',
    targetName: '张三',
    violationType: '虚假信息',
    severity: 'high',
    description: '用户在简历中填写虚假工作经历',
    reportTime: '2026-03-04T10:30:00Z',
    status: 'pending',
    reporter: '系统自动检测',
    creditScoreBefore: 75,
    creditScoreAfter: null
  }, {
    id: 2,
    type: 'company',
    targetId: 'company_001',
    targetName: '智联科技有限公司',
    violationType: '恶意拖欠',
    severity: 'medium',
    description: '企业拖欠供应商货款超过30天',
    reportTime: '2026-03-03T15:20:00Z',
    status: 'pending',
    reporter: '供应商投诉',
    creditScoreBefore: 85,
    creditScoreAfter: null
  }, {
    id: 3,
    type: 'property',
    targetId: 'property_001',
    targetName: '科技园A座',
    violationType: '服务质量差',
    severity: 'low',
    description: '物业多次未及时处理租户报修',
    reportTime: '2026-03-02T09:15:00Z',
    status: 'processed',
    reporter: '租户投诉',
    creditScoreBefore: 80,
    creditScoreAfter: 75
  }, {
    id: 4,
    type: 'user',
    targetId: 'user_002',
    targetName: '李四',
    violationType: '恶意评价',
    severity: 'medium',
    description: '用户恶意差评企业服务',
    reportTime: '2026-03-01T14:00:00Z',
    status: 'processed',
    reporter: '企业申诉',
    creditScoreBefore: 72,
    creditScoreAfter: 67
  }, {
    id: 5,
    type: 'company',
    targetId: 'company_002',
    targetName: '创新网络科技有限公司',
    violationType: '发布虚假招聘',
    severity: 'high',
    description: '企业发布不存在的职位信息',
    reportTime: '2026-02-28T11:45:00Z',
    status: 'pending',
    reporter: '求职者投诉',
    creditScoreBefore: 82,
    creditScoreAfter: null
  }]);

  // 获取颜色配置
  const getSeverityColor = severity => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  const getSeverityText = severity => {
    switch (severity) {
      case 'high':
        return '严重';
      case 'medium':
        return '中等';
      case 'low':
        return '轻微';
      default:
        return '未知';
    }
  };
  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'processed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  const getStatusText = status => {
    switch (status) {
      case 'pending':
        return '待处理';
      case 'processed':
        return '已处理';
      case 'rejected':
        return '已驳回';
      default:
        return '未知';
    }
  };
  const getTypeIcon = type => {
    switch (type) {
      case 'user':
        return <User className="w-5 h-5 text-purple-600" />;
      case 'company':
        return <Building2 className="w-5 h-5 text-green-600" />;
      case 'property':
        return <Building className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };
  const getTypeText = type => {
    switch (type) {
      case 'user':
        return '职场人';
      case 'company':
        return '企业';
      case 'property':
        return '物业';
      default:
        return '未知';
    }
  };
  const getTypeColor = type => {
    switch (type) {
      case 'user':
        return 'border-l-purple-600';
      case 'company':
        return 'border-l-green-600';
      case 'property':
        return 'border-l-blue-600';
      default:
        return 'border-l-gray-600';
    }
  };

  // 格式化时间
  const formatTime = timeString => {
    const date = new Date(timeString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) {
      return `${diffMins}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  // 处理处罚
  const handlePunish = async () => {
    if (!punishReason.trim()) {
      toast({
        title: '提示',
        description: '请输入处罚原因',
        status: 'warning'
      });
      return;
    }
    try {
      // 模拟处罚操作
      const newViolations = violations.map(v => {
        if (v.id === selectedViolation.id) {
          return {
            ...v,
            status: 'processed',
            creditScoreAfter: v.creditScoreBefore - punishScore,
            punishReason,
            punishScore,
            processedTime: new Date().toISOString()
          };
        }
        return v;
      });
      setViolations(newViolations);
      setShowPunishDialog(false);
      setSelectedViolation(null);
      setPunishReason('');
      setPunishScore(10);
      toast({
        title: '处罚成功',
        description: `已对${selectedViolation.targetName}扣除${punishScore}分`,
        status: 'success'
      });
    } catch (error) {
      console.error('处罚失败:', error);
      toast({
        title: '处罚失败',
        description: error.message || '处罚操作失败，请稍后重试',
        status: 'error'
      });
    }
  };

  // 驳回违规
  const handleReject = violation => {
    try {
      const newViolations = violations.map(v => {
        if (v.id === violation.id) {
          return {
            ...v,
            status: 'rejected'
          };
        }
        return v;
      });
      setViolations(newViolations);
      toast({
        title: '已驳回',
        description: `已驳回对${violation.targetName}的违规记录`,
        status: 'success'
      });
    } catch (error) {
      console.error('驳回失败:', error);
      toast({
        title: '驳回失败',
        description: error.message || '驳回操作失败，请稍后重试',
        status: 'error'
      });
    }
  };

  // 筛选违规记录
  const filteredViolations = activeTab === 'all' ? violations : violations.filter(v => v.type === activeTab);
  const pendingCount = violations.filter(v => v.status === 'pending').length;
  const userViolations = violations.filter(v => v.type === 'user');
  const companyViolations = violations.filter(v => v.type === 'company');
  const propertyViolations = violations.filter(v => v.type === 'property');
  return <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-amber-900">待处理</CardTitle>
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">{pendingCount}</div>
            <p className="text-xs text-amber-600 mt-1">违规记录</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-purple-900">职场人</CardTitle>
              <User className="w-8 h-8 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{userViolations.length}</div>
            <p className="text-xs text-purple-600 mt-1">违规记录</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-900">企业</CardTitle>
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{companyViolations.length}</div>
            <p className="text-xs text-green-600 mt-1">违规记录</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-900">物业</CardTitle>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{propertyViolations.length}</div>
            <p className="text-xs text-blue-600 mt-1">违规记录</p>
          </CardContent>
        </Card>
      </div>

      {/* 违规记录列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900" style={{
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
            违规记录
          </CardTitle>
          <CardDescription>
            查看和管理平台违规记录，实施相应处罚
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
            </div> : filteredViolations.length === 0 ? <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <ShieldCheck className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">暂无违规记录</p>
            </div> : <div className="space-y-4">
              {filteredViolations.map(violation => <div key={violation.id} className={`border rounded-lg p-4 hover:shadow-md transition-all duration-200 border-l-4 ${getTypeColor(violation.type)} ${violation.status === 'processed' ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(violation.type)}
                        <div>
                          <h3 className="font-semibold text-slate-900">{violation.targetName}</h3>
                          <p className="text-sm text-slate-600">{getTypeText(violation.type)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getSeverityColor(violation.severity)} border`}>
                          {getSeverityText(violation.severity)}
                        </Badge>
                        <Badge className={`${getStatusColor(violation.status)} border`}>
                          {getStatusText(violation.status)}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-700">违规类型：</span>
                        <span className="text-sm text-slate-900">{violation.violationType}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-700">违规描述：</span>
                        <span className="text-sm text-slate-900">{violation.description}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-700">举报来源：</span>
                        <span className="text-sm text-slate-900">{violation.reporter}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-700">举报时间：</span>
                        <span className="text-sm text-slate-900">{formatTime(violation.reportTime)}</span>
                      </div>
                    </div>

                    {violation.status === 'processed' && violation.punishReason && <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                        <div className="flex items-start space-x-2">
                          <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-red-900 mb-1">处罚记录</p>
                            <p className="text-sm text-red-800">{violation.punishReason}</p>
                            <div className="mt-2 flex items-center space-x-4 text-xs text-red-700">
                              <span>处罚前：{violation.creditScoreBefore}分</span>
                              <span>处罚后：{violation.creditScoreAfter}分</span>
                              <span>扣除：{violation.punishScore}分</span>
                            </div>
                          </div>
                        </div>
                      </div>}

                    {violation.status === 'pending' && <div className="flex items-center space-x-3">
                        <Button onClick={() => {
                setSelectedViolation(violation);
                setShowPunishDialog(true);
              }} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          实施处罚
                        </Button>
                        <Button onClick={() => handleReject(violation)} variant="outline" className="flex-1">
                          <XCircle className="w-4 h-4 mr-2" />
                          驳回
                        </Button>
                      </div>}
                  </div>)}
            </div>}
        </CardContent>
      </Card>

      {/* 处罚对话框 */}
      <Dialog open={showPunishDialog} onOpenChange={setShowPunishDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-slate-900" style={{
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
              实施处罚
            </DialogTitle>
            <DialogDescription>
              对 {selectedViolation?.targetName} 实施信用分处罚
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
              <div className="flex items-start space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{selectedViolation?.violationType}</p>
                  <p className="text-xs text-slate-600 mt-1">{selectedViolation?.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-slate-700">当前信用分：</span>
                <span className="text-sm font-semibold text-slate-900">{selectedViolation?.creditScoreBefore}分</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">扣分数值</label>
              <select value={punishScore} onChange={e => setPunishScore(parseInt(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option value={5}>5分（轻微处罚）</option>
                <option value={10}>10分（中等处罚）</option>
                <option value={20}>20分（严重处罚）</option>
                <option value={30}>30分（极重处罚）</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">处罚原因</label>
              <textarea value={punishReason} onChange={e => setPunishReason(e.target.value)} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" placeholder="请输入处罚原因..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
            setShowPunishDialog(false);
            setSelectedViolation(null);
            setPunishReason('');
            setPunishScore(10);
          }}>
              取消
            </Button>
            <Button onClick={handlePunish} className="bg-red-600 hover:bg-red-700">
              <AlertTriangle className="w-4 h-4 mr-2" />
              确认处罚
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}
ViolationManagement.displayName = 'ViolationManagement';