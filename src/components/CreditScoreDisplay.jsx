// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Badge } from '@/components/ui';
// @ts-ignore;
import { Shield, TrendingUp, TrendingDown, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

/**
 * 信用分显示组件
 * @param {Object} props
 * @param {number} props.score - 信用分
 * @param {string} props.type - 类型（物业/company/user）
 * @param {number} props.initialScore - 初始分数
 */
export function CreditScoreDisplay({
  score = 0,
  type = 'user',
  initialScore = 0
}) {
  // 根据分数确定等级和颜色
  const getLevelInfo = score => {
    if (score >= 90) {
      return {
        level: 'AAA',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        description: '信用极好'
      };
    } else if (score >= 80) {
      return {
        level: 'AA',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        description: '信用优秀'
      };
    } else if (score >= 70) {
      return {
        level: 'A',
        color: 'text-amber-600',
        bgColor: 'bg-amber-100',
        description: '信用良好'
      };
    } else if (score >= 60) {
      return {
        level: 'B',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        description: '信用一般'
      };
    } else {
      return {
        level: 'C',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        description: '信用较差'
      };
    }
  };

  // 计算分数变化
  const scoreChange = score - initialScore;
  const isPositive = scoreChange > 0;
  const isNegative = scoreChange < 0;
  const levelInfo = getLevelInfo(score);
  const progressPercentage = Math.min(100, score / 100 * 100);
  return <div className={`bg-white border-2 ${score >= 80 ? 'border-blue-200' : score >= 60 ? 'border-amber-200' : 'border-red-200'} rounded-xl p-6 shadow-sm`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${levelInfo.bgColor}`}>
            <Shield className={`h-6 w-6 ${levelInfo.color}`} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">信用分</h3>
            <p className="text-xs text-gray-500">{type === 'property' ? '物业信用' : type === 'company' ? '企业信用' : '个人信用'}</p>
          </div>
        </div>
        <Badge className={`${levelInfo.bgColor} ${levelInfo.color} border-0`}>
          {levelInfo.level}级
        </Badge>
      </div>

      {/* 分数显示 */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className={`text-4xl font-bold ${levelInfo.color}`}>
          {score}
        </span>
        <span className="text-sm text-gray-500">/ 100</span>
      </div>

      {/* 进度条 */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div className={`h-full transition-all duration-500 ${score >= 80 ? 'bg-blue-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{
        width: `${progressPercentage}%`
      }} />
      </div>

      {/* 分数变化 */}
      {initialScore > 0 && scoreChange !== 0 && <div className={`flex items-center gap-1 text-sm mb-3 ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'}`}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : isNegative ? <TrendingDown className="h-4 w-4" /> : null}
          <span>
            {isPositive ? '+' : ''}{scoreChange} 分
          </span>
          <span className="text-gray-400 ml-2">从初始分 {initialScore}</span>
        </div>}

      {/* 信用描述 */}
      <p className={`text-sm font-medium ${levelInfo.color} mb-4`}>
        {levelInfo.description}
      </p>

      {/* 信用提示 */}
      <div className={`flex items-start gap-2 text-xs p-3 rounded-lg ${score >= 80 ? 'bg-blue-50 text-blue-700' : score >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
        {score >= 80 ? <CheckCircle2 className="h-4 w-4 mt-0.5" /> : score >= 60 ? <AlertTriangle className="h-4 w-4 mt-0.5" /> : <Clock className="h-4 w-4 mt-0.5" />}
        <p>
          {score >= 80 ? '您的信用状况良好，享受平台优先推荐和更多权益' : score >= 60 ? '信用尚可，建议积极参与平台活动提升信用' : '信用较低，建议完善认证信息和获得好评以提升信用'}
        </p>
      </div>
    </div>;
}
export default CreditScoreDisplay;