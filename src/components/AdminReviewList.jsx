// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, useToast } from '@/components/ui';
// @ts-ignore;
import { Building, Building2, User, CheckCircle, XCircle, FileText, Award, Clock, Eye } from 'lucide-react';

export function AdminReviewList({
  reviews,
  reviewType,
  onRefresh,
  $w
}) {
  const {
    toast
  } = useToast();
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // 获取审核类型对应的配置
  const getReviewConfig = reviewItem => {
    const type = reviewItem.buildingName ? 'property' : reviewItem.companyName ? 'company' : 'user';
    switch (type) {
      case 'property':
        return {
          icon: Building,
          color: 'blue',
          title: reviewItem.buildingName || '未命名楼宇',
          subtitle: reviewItem.address || '地址未填写',
          details: [{
            label: '楼宇面积',
            value: reviewItem.area || '-'
          }, {
            label: '产权证明',
            value: reviewItem.propertyRightFile ? reviewItem.propertyRightFile.substring(0, 50) : '-'
          }, {
            label: '运营资质',
            value: reviewItem.operatingLicenseFile ? reviewItem.operatingLicenseFile.substring(0, 50) : '-'
          }]
        };
      case 'company':
        return {
          icon: Building2,
          color: 'green',
          title: reviewItem.companyName || '未命名企业',
          subtitle: reviewItem.creditCode || '信用代码未填写',
          details: [{
            label: '营业执照号',
            value: reviewItem.licenseNumber || '-'
          }, {
            label: '法定代表人',
            value: reviewItem.legalPerson || '-'
          }, {
            label: '注册资本',
            value: reviewItem.registeredCapital || '-'
          }, {
            label: '联系电话',
            value: reviewItem.contactPhone || '-'
          }, {
            label: '经营范围',
            value: reviewItem.businessScope || '-'
          }]
        };
      case 'user':
        return {
          icon: User,
          color: 'purple',
          title: reviewItem.name || '未命名用户',
          subtitle: reviewItem.phone || '电话未填写',
          details: [{
            label: '邮箱',
            value: reviewItem.email || '-'
          }, {
            label: '职位',
            value: reviewItem.jobTitle || '-'
          }, {
            label: '工作年限',
            value: reviewItem.workYears || '-'
          }, {
            label: '证书数量',
            value: reviewItem.certificates ? reviewItem.certificates.length : 0
          }]
        };
      default:
        return {
          icon: User,
          color: 'gray',
          title: '未知',
          subtitle: '-',
          details: []
        };
    }
  };

  // 查看详情
  const handleViewDetail = reviewItem => {
    setSelectedReview(reviewItem);
    setShowDetailDialog(true);
  };

  // 通过审核
  const handleApprove = async reviewItem => {
    setIsProcessing(true);
    try {
      const type = reviewItem.buildingName ? 'property' : reviewItem.companyName ? 'company' : 'user';
      const dataSourceName = type === 'property' ? 'credit_property' : type === 'company' ? 'credit_company' : 'credit_user';
      await $w.cloud.callDataSource({
        dataSourceName: dataSourceName,
        methodName: 'wedaUpdateV2',
        params: {
          filter: {
            where: {
              _id: reviewItem._id
            }
          },
          data: {
            certificationStatus: 'approved'
          }
        }
      });
      toast({
        title: '审核通过',
        description: `已通过${type === 'property' ? '物业' : type === 'company' ? '企业' : '职场人'}认证申请`,
        status: 'success'
      });
      onRefresh();
      setShowDetailDialog(false);
    } catch (error) {
      console.error('审核失败:', error);
      toast({
        title: '审核失败',
        description: error.message || '无法处理审核请求，请稍后重试',
        status: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // 拒绝审核
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast({
        title: '拒绝原因不能为空',
        description: '请输入拒绝原因',
        status: 'warning'
      });
      return;
    }
    setIsProcessing(true);
    try {
      const type = selectedReview.buildingName ? 'property' : selectedReview.companyName ? 'company' : 'user';
      const dataSourceName = type === 'property' ? 'credit_property' : type === 'company' ? 'credit_company' : 'credit_user';
      await $w.cloud.callDataSource({
        dataSourceName: dataSourceName,
        methodName: 'wedaUpdateV2',
        params: {
          filter: {
            where: {
              _id: selectedReview._id
            }
          },
          data: {
            certificationStatus: 'rejected',
            rejectReason: rejectReason
          }
        }
      });
      toast({
        title: '审核拒绝',
        description: `已拒绝${type === 'property' ? '物业' : type === 'company' ? '企业' : '职场人'}认证申请`,
        status: 'info'
      });
      onRefresh();
      setShowDetailDialog(false);
      setShowRejectDialog(false);
      setRejectReason('');
    } catch (error) {
      console.error('拒绝失败:', error);
      toast({
        title: '拒绝失败',
        description: error.message || '无法处理拒绝请求，请稍后重试',
        status: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // 格式化时间
  const formatTime = dateString => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };
  return <>
      <div className="space-y-4">
        {reviews.map((reviewItem, index) => {
        const config = getReviewConfig(reviewItem);
        const Icon = config.icon;
        const colorClass = config.color === 'blue' ? 'bg-blue-100 text-blue-600' : config.color === 'green' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600';
        const borderClass = config.color === 'blue' ? 'border-blue-200 hover:border-blue-400' : config.color === 'green' ? 'border-green-200 hover:border-green-400' : 'border-purple-200 hover:border-purple-400';
        return <div key={reviewItem._id || index} className={`bg-white rounded-lg border ${borderClass} p-4 transition-all hover:shadow-lg`}>
            <div className="flex items-start gap-4">
              {/* 图标 */}
              <div className={`p-3 rounded-lg ${colorClass}`}>
                <Icon className="w-8 h-8" />
              </div>

              {/* 主要信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-slate-900 truncate">
                    {config.title}
                  </h3>
                  <span className="text-sm text-slate-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTime(reviewItem.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-3 truncate">{config.subtitle}</p>

                {/* 详情摘要 */}
                <div className="flex flex-wrap gap-2">
                  {config.details.slice(0, 3).map((detail, idx) => <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md bg-slate-50 text-xs text-slate-600">
                    <span className="font-medium mr-1">{detail.label}:</span>
                    {detail.value}
                  </span>)}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-col gap-2">
                <Button size="sm" variant="outline" onClick={() => handleViewDetail(reviewItem)} className="bg-white hover:bg-slate-50">
                  <Eye className="w-4 h-4 mr-1" />
                  详情
                </Button>
                <Button size="sm" onClick={() => handleApprove(reviewItem)} disabled={isProcessing} className="bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  通过
                </Button>
              </div>
            </div>
          </div>;
      })}
      </div>

      {/* 详情对话框 */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedReview && (() => {
          const config = getReviewConfig(selectedReview);
          const Icon = config.icon;
          const colorClass = config.color === 'blue' ? 'text-blue-600' : config.color === 'green' ? 'text-green-600' : 'text-purple-600';
          const type = selectedReview.buildingName ? 'property' : selectedReview.companyName ? 'company' : 'user';
          return <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${colorClass.replace('text-', 'bg-').replace('600', '100')} ${colorClass}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl" style={{
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                        {config.title}
                      </DialogTitle>
                      <DialogDescription className="text-sm">
                        提交时间: {selectedReview.createdAt ? new Date(selectedReview.createdAt).toLocaleString('zh-CN') : '-'}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="mt-6 space-y-4">
                  {/* 基本信息 */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      基本信息
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {config.details.map((detail, idx) => <div key={idx} className="flex items-start gap-2">
                          <span className="text-sm font-medium text-slate-700 whitespace-nowrap">{detail.label}:</span>
                          <span className="text-sm text-slate-900 break-all">{detail.value}</span>
                        </div>)}
                    </div>
                  </div>

                  {/* 证书/资质文件 */}
                  {type === 'property' && (selectedReview.propertyRightFile || selectedReview.operatingLicenseFile) || type === 'user' && selectedReview.certificates && selectedReview.certificates.length > 0 ? <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        资质证书
                      </h4>
                      {type === 'property' ? <div className="space-y-2">
                          {selectedReview.propertyRightFile && <div className="text-sm text-slate-700">
                              <span className="font-medium">产权证明:</span> {selectedReview.propertyRightFile}
                            </div>}
                          {selectedReview.operatingLicenseFile && <div className="text-sm text-slate-700">
                              <span className="font-medium">运营资质:</span> {selectedReview.operatingLicenseFile}
                            </div>}
                        </div> : <div className="space-y-2">
                          {selectedReview.certificates.map((cert, idx) => <div key={idx} className="text-sm text-slate-700">
                              <span className="font-medium">证书 {idx + 1}:</span> {cert.name || cert}
                            </div>)}
                        </div>}
                    </div> : null}

                  {/* 初始信用分 */}
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
                    <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      初始信用分
                    </h4>
                    <div className="text-2xl font-bold text-amber-900">
                      {selectedReview.initialScore || 0} 分
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowRejectDialog(true)} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                    <XCircle className="w-4 h-4 mr-2" />
                    拒绝
                  </Button>
                  <Button onClick={() => handleApprove(selectedReview)} disabled={isProcessing} className="bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    通过
                  </Button>
                </div>
              </>;
        })()}
        </DialogContent>
      </Dialog>

      {/* 拒绝理由对话框 */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>输入拒绝原因</DialogTitle>
            <DialogDescription>请输入拒绝此认证申请的原因，将反馈给申请人。</DialogDescription>
          </DialogHeader>
          <textarea className="w-full min-h-[120px] p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="请输入拒绝原因..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => {
            setShowRejectDialog(false);
            setRejectReason('');
          }}>
              取消
            </Button>
            <Button onClick={handleReject} disabled={isProcessing || !rejectReason.trim()} className="bg-red-600 hover:bg-red-700 text-white">
              <XCircle className="w-4 h-4 mr-2" />
              确认拒绝
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>;
}