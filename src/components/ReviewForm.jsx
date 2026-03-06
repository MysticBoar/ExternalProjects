// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, useToast } from '@/components/ui';
// @ts-ignore;
import { Star, MessageSquare, Send, Shield } from 'lucide-react';

/**
 * 评价表单组件 - 支持分维度评价和匿名评分
 * @param {Object} props
 * @param {string} props.targetType - 评价对象类型（物业/company/user）
 * @param {string} props.targetId - 评价对象ID
 * @param {string} props.targetName - 评价对象名称
 * @param {Array} props.dimensions - 评价维度配置
 * @param {Function} props.onSubmit - 提交回调
 */
export function ReviewForm({
  targetType,
  targetId,
  targetName,
  dimensions,
  onSubmit
}) {
  const {
    toast
  } = useToast();
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 处理评分变化
  const handleRatingChange = (dimension, value) => {
    setRatings(prev => ({
      ...prev,
      [dimension]: value
    }));
  };

  // 计算平均分
  const calculateAverageRating = () => {
    if (!dimensions || dimensions.length === 0) return 0;
    const sum = dimensions.reduce((total, dim) => {
      return total + (ratings[dim.key] || 0);
    }, 0);
    return (sum / dimensions.length).toFixed(1);
  };

  // 提交评价
  const handleSubmit = async e => {
    e.preventDefault();

    // 验证是否所有维度都已评分
    const unratedDimensions = dimensions.filter(dim => !ratings[dim.key]);
    if (unratedDimensions.length > 0) {
      toast({
        title: '请完成所有评分',
        description: `请为${unratedDimensions.map(d => d.label).join('、')}进行评分`,
        status: 'warning'
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const reviewData = {
        targetType,
        targetId,
        targetName,
        ratings: {
          ...ratings
        },
        averageRating: calculateAverageRating(),
        comment,
        createdAt: new Date().toISOString(),
        isAnonymous: true
      };
      await onSubmit(reviewData);
      toast({
        title: '评价提交成功',
        description: '感谢您的评价，您的反馈将帮助我们改进服务',
        status: 'success'
      });

      // 重置表单
      setRatings({});
      setComment('');
    } catch (error) {
      console.error('提交评价失败:', error);
      toast({
        title: '提交失败',
        description: error.message || '网络错误，请稍后重试',
        status: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <Card className="w-full border-t-4 border-t-amber-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5 text-amber-600" />
          评价 {targetName}
        </CardTitle>
        <CardDescription>
          您的评价将帮助我们提升服务质量，评价将匿名显示
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 评价维度 */}
          <div className="space-y-4">
            {dimensions.map(dimension => <div key={dimension.key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-medium text-sm text-gray-700">
                    {dimension.label}
                  </label>
                  {ratings[dimension.key] > 0 && <span className="text-sm font-semibold text-amber-600">
                      {ratings[dimension.key]}.0 分
                    </span>}
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => <button key={star} type="button" onClick={() => handleRatingChange(dimension.key, star)} className={`p-1 transition-all hover:scale-110 ${star <= (ratings[dimension.key] || 0) ? 'text-amber-500' : 'text-gray-300'}`}>
                      <Star className={`h-6 w-6 ${star <= (ratings[dimension.key] || 0) ? 'fill-current' : ''}`} />
                    </button>)}
                </div>
              </div>)}
          </div>

          {/* 平均分显示 */}
          {Object.keys(ratings).length > 0 && <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-amber-800">综合评分</span>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`h-4 w-4 ${star <= Math.round(calculateAverageRating()) ? 'text-amber-500 fill-current' : 'text-gray-300'}`} />)}
                  </div>
                  <span className="text-lg font-bold text-amber-700">
                    {calculateAverageRating()}
                  </span>
                </div>
              </div>
            </div>}

          {/* 评价内容 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              评价内容（选填）
            </label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="请详细描述您的体验，您的评价将帮助我们改进服务..." rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none" maxLength={500} />
            <div className="text-right text-xs text-gray-500">
              {comment.length}/500
            </div>
          </div>

          {/* 匿名提示 */}
          <div className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
            <Shield className="h-4 w-4 text-green-600 mt-0.5" />
            <p>
              您的评价将以匿名形式展示，不会显示您的个人信息。平台将审核所有评价内容。
            </p>
          </div>

          {/* 提交按钮 */}
          <Button type="submit" disabled={isSubmitting} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
            {isSubmitting ? <span>提交中...</span> : <span className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                提交评价
              </span>}
          </Button>
        </form>
      </CardContent>
    </Card>;
}

/**
 * 评价展示组件
 * @param {Object} props
 * @param {Array} props.reviews - 评价列表
 */
export function ReviewList({
  reviews = []
}) {
  if (reviews.length === 0) {
    return <Card className="bg-gray-50 border-dashed">
        <CardContent className="py-8 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">暂无评价</p>
        </CardContent>
      </Card>;
  }
  return <div className="space-y-4">
      {reviews.map((review, index) => <Card key={index} className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-sm font-bold">
                  {review.targetType?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-gray-600">
                  匿名用户
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`h-4 w-4 ${star <= review.averageRating ? 'text-amber-500 fill-current' : 'text-gray-300'}`} />)}
              </div>
            </div>
            
            {/* 分维度评分 */}
            {review.ratings && Object.keys(review.ratings).length > 0 && <div className="flex flex-wrap gap-3 mb-2">
                {Object.entries(review.ratings).map(([key, value]) => <span key={key} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {key}: {value}分
                  </span>)}
              </div>}

            {/* 评价内容 */}
            {review.comment && <p className="text-sm text-gray-700 mt-2">
                {review.comment}
              </p>}

            <div className="text-xs text-gray-400 mt-2">
              {review.createdAt ? new Date(review.createdAt).toLocaleString('zh-CN') : ''}
            </div>
          </CardContent>
        </Card>)}
    </div>;
}
export default ReviewForm;