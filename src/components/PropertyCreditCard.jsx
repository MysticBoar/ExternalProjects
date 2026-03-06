// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Card, CardContent, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui';
// @ts-ignore;
import { Shield, Building2, MapPin, Star, AlertCircle, FileText, Award, CheckCircle, Clock, Phone } from 'lucide-react';

// 物业信用档案卡片组件
export function PropertyCreditCard({
  creditData
}) {
  const [showDetail, setShowDetail] = useState(false);
  if (!creditData) {
    return <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Shield className="w-10 h-10 text-gray-400" />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-600">信用档案</div>
            <div className="text-xs text-gray-400">暂无信用档案信息</div>
          </div>
        </div>
      </CardContent>
    </Card>;
  }
  const creditScore = creditData.creditScore || creditData.initialScore || 80;
  const initialScore = creditData.initialScore || 80;
  const certificationStatus = creditData.certificationStatus || 'pending';
  const reviews = creditData.reviews || [];
  const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.averageRating || 0), 0) / reviews.length : 0;

  // 计算信用等级
  let creditLevel = {
    level: 'A',
    description: '信用良好',
    color: 'text-green-600',
    bg: 'bg-green-100',
    border: 'border-green-500'
  };
  if (creditScore >= 90) {
    creditLevel = {
      level: 'AAA',
      description: '信用极好',
      color: 'text-green-600',
      bg: 'bg-green-100',
      border: 'border-green-500'
    };
  } else if (creditScore >= 80) {
    creditLevel = {
      level: 'AA',
      description: '信用优秀',
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      border: 'border-blue-500'
    };
  } else if (creditScore >= 70) {
    creditLevel = {
      level: 'A',
      description: '信用良好',
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
      border: 'border-yellow-500'
    };
  } else if (creditScore >= 60) {
    creditLevel = {
      level: 'B',
      description: '信用一般',
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      border: 'border-orange-500'
    };
  } else {
    creditLevel = {
      level: 'C',
      description: '信用较差',
      color: 'text-red-600',
      bg: 'bg-red-100',
      border: 'border-red-500'
    };
  }

  // 认证状态
  let certificationBadge = null;
  if (certificationStatus === 'approved') {
    certificationBadge = <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
        <CheckCircle className="w-3 h-3" />
        已认证
      </span>;
  } else if (certificationStatus === 'submitted') {
    certificationBadge = <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
        <Clock className="w-3 h-3" />
        审核中
      </span>;
  } else {
    certificationBadge = <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
        <AlertCircle className="w-3 h-3" />
        未认证
      </span>;
  }
  return <>
      <Card className={`bg-gradient-to-br from-slate-50 to-slate-100 border-l-4 ${creditLevel.border}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${creditLevel.bg} flex items-center justify-center`}>
                <Shield className={`w-6 h-6 ${creditLevel.color}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className={`text-2xl font-bold ${creditLevel.color}`}>
                    {creditScore}
                  </div>
                  <div className={`text-xs px-2 py-0.5 rounded ${creditLevel.bg} ${creditLevel.color} font-bold`}>
                    {creditLevel.level}级
                  </div>
                </div>
                <div className={`text-xs ${creditLevel.color} font-medium`}>
                  {creditLevel.description}
                </div>
              </div>
            </div>
            {certificationBadge}
          </div>

          {/* 评价统计 */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span>{averageRating.toFixed(1)}分</span>
              </div>
              <span>{reviews.length}条评价</span>
            </div>
          </div>

          {/* 查看详情按钮 */}
          <button onClick={() => setShowDetail(true)} className="mt-3 w-full text-xs text-[#1B365D] hover:text-[#2D4A6D] font-medium py-2 hover:bg-white/50 rounded-lg transition-colors">
            查看信用档案详情 →
          </button>
        </CardContent>
      </Card>

      {/* 信用档案详情弹窗 */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{
            fontFamily: 'Playfair Display, serif'
          }}>
              <Shield className="w-6 h-6 text-[#1B365D]" />
              物业信用档案
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* 基本信息 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                基本信息
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-500">楼宇名称</div>
                  <div className="font-medium text-gray-900">{creditData.buildingName || '-'}</div>
                </div>
                <div>
                  <div className="text-gray-500">楼宇地址</div>
                  <div className="font-medium text-gray-900">{creditData.address || '-'}</div>
                </div>
                <div>
                  <div className="text-gray-500">楼宇面积</div>
                  <div className="font-medium text-gray-900">{creditData.area || '-'}</div>
                </div>
                <div>
                  <div className="text-gray-500">认证状态</div>
                  <div>{certificationBadge}</div>
                </div>
              </div>
            </div>

            {/* 信用详情 */}
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" />
                信用详情
              </h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${creditLevel.color}`}>
                    {creditScore}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">当前信用分</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${creditLevel.color}`}>
                    {creditLevel.level}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">信用等级</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${creditLevel.color}`}>
                    {creditLevel.description}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">信用评级</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600">
                    {initialScore}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">初始信用分</div>
                </div>
              </div>
            </div>

            {/* 最新评价 */}
            {reviews.length > 0 && <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  最新评价
                </h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {reviews.slice(0, 3).map((review, idx) => <div key={idx} className="bg-white p-3 rounded border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.round(review.averageRating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />)}
                          <span className="text-sm font-medium text-gray-900 ml-2">
                            {review.averageRating ? review.averageRating.toFixed(1) : '0'}分
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && <p className="text-sm text-gray-600 line-clamp-2">
                          {review.comment}
                        </p>}
                    </div>)}
                </div>
              </div>}

            {/* 认证提示 */}
            {certificationStatus !== 'approved' && <div className={`p-3 rounded-lg ${certificationStatus === 'submitted' ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="flex items-start gap-2">
                  <AlertCircle className={`w-4 h-4 mt-0.5 ${certificationStatus === 'submitted' ? 'text-yellow-600' : 'text-gray-600'}`} />
                  <div>
                    <div className={`text-sm font-medium ${certificationStatus === 'submitted' ? 'text-yellow-900' : 'text-gray-900'}`}>
                      {certificationStatus === 'submitted' ? '认证审核中' : '未完成认证'}
                    </div>
                    <div className={`text-xs ${certificationStatus === 'submitted' ? 'text-yellow-700' : 'text-gray-600'}`}>
                      {certificationStatus === 'submitted' ? '物业正在提交资质材料，平台审核中' : '该物业尚未完成平台资质认证，请谨慎选择'}
                    </div>
                  </div>
                </div>
              </div>}
          </div>
        </DialogContent>
      </Dialog>
    </>;
}