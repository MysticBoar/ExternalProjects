// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, useToast } from '@/components/ui';
// @ts-ignore;
import { Star, ThumbsUp, ThumbsDown, AlertTriangle, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';

// @ts-ignore
export function ReviewAuditList({
  activeType,
  $w
}) {
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // 加载待审核评价
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        let allReviews = [];

        // 根据类型加载数据
        if (activeType === 'all' || activeType === 'property') {
          const propertyResult = await $w.cloud.callDataSource({
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
              pageSize: 50,
              pageNumber: 1
            }
          });
          if (propertyResult && propertyResult.records) {
            propertyResult.records.forEach(record => {
              if (record.reviews && record.reviews.length > 0) {
                record.reviews.forEach((review, index) => {
                  allReviews.push({
                    ...review,
                    _id: `${record._id}_review_${index}`,
                    parentType: 'property',
                    parentId: record._id,
                    parentName: record.buildingName,
                    reviewIndex: index,
                    auditStatus: review.auditStatus || 'pending' // 默认待审核
                  });
                });
              }
            });
          }
        }
        if (activeType === 'all' || activeType === 'company') {
          const companyResult = await $w.cloud.callDataSource({
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
              pageSize: 50,
              pageNumber: 1
            }
          });
          if (companyResult && companyResult.records) {
            companyResult.records.forEach(record => {
              if (record.reviews && record.reviews.length > 0) {
                record.reviews.forEach((review, index) => {
                  allReviews.push({
                    ...review,
                    _id: `${record._id}_review_${index}`,
                    parentType: 'company',
                    parentId: record._id,
                    parentName: record.companyName,
                    reviewIndex: index,
                    auditStatus: review.auditStatus || 'pending'
                  });
                });
              }
            });
          }
        }
        if (activeType === 'all' || activeType === 'user') {
          const userResult = await $w.cloud.callDataSource({
            dataSourceName: 'credit_user',
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
          if (userResult && userResult.records) {
            userResult.records.forEach(record => {
              if (record.reviews && record.reviews.length > 0) {
                record.reviews.forEach((review, index) => {
                  allReviews.push({
                    ...review,
                    _id: `${record._id}_review_${index}`,
                    parentType: 'user',
                    parentId: record._id,
                    parentName: record.name,
                    reviewIndex: index,
                    auditStatus: review.auditStatus || 'pending'
                  });
                });
              }
            });
          }
        }

        // 按创建时间排序
        allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(allReviews);
      } catch (error) {
        console.error('加载评价失败:', error);
        toast({
          title: '加载失败',
          description: error.message || '无法加载评价数据',
          status: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, [activeType]);

  // 通过评价
  const handleApprove = async review => {
    try {
      // 更新评价审核状态
      const result = await $w.cloud.callDataSource({
        dataSourceName: review.parentType === 'property' ? 'credit_property' : review.parentType === 'company' ? 'credit_company' : 'credit_user',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              _id: review.parentId
            }
          },
          select: {
            $master: true
          },
          pageSize: 1,
          pageNumber: 1
        }
      });
      if (result && result.records && result.records.length > 0) {
        const record = result.records[0];
        const updatedReviews = [...record.reviews];
        updatedReviews[review.reviewIndex] = {
          ...updatedReviews[review.reviewIndex],
          auditStatus: 'approved',
          auditReason: ''
        };
        await $w.cloud.callDataSource({
          dataSourceName: review.parentType === 'property' ? 'credit_property' : review.parentType === 'company' ? 'credit_company' : 'credit_user',
          methodName: 'wedaUpdateV2',
          params: {
            filter: {
              where: {
                _id: record._id
              }
            },
            data: {
              reviews: updatedReviews
            }
          }
        });
        toast({
          title: '审核通过',
          description: '该评价已通过审核',
          status: 'success'
        });

        // 刷新列表
        loadReviews();
      }
    } catch (error) {
      console.error('审核失败:', error);
      toast({
        title: '审核失败',
        description: error.message || '请稍后重试',
        status: 'error'
      });
    }
  };

  // 拒绝评价
  const handleReject = review => {
    setSelectedReview(review);
    setShowRejectDialog(true);
  };

  // 确认拒绝
  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      toast({
        title: '请输入拒绝原因',
        description: '请填写拒绝该评价的原因',
        status: 'warning'
      });
      return;
    }
    try {
      const review = selectedReview;
      const result = await $w.cloud.callDataSource({
        dataSourceName: review.parentType === 'property' ? 'credit_property' : review.parentType === 'company' ? 'credit_company' : 'credit_user',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              _id: review.parentId
            }
          },
          select: {
            $master: true
          },
          pageSize: 1,
          pageNumber: 1
        }
      });
      if (result && result.records && result.records.length > 0) {
        const record = result.records[0];
        const updatedReviews = [...record.reviews];
        updatedReviews[review.reviewIndex] = {
          ...updatedReviews[review.reviewIndex],
          auditStatus: 'rejected',
          auditReason: rejectReason
        };
        await $w.cloud.callDataSource({
          dataSourceName: review.parentType === 'property' ? 'credit_property' : review.parentType === 'company' ? 'credit_company' : 'credit_user',
          methodName: 'wedaUpdateV2',
          params: {
            filter: {
              where: {
                _id: record._id
              }
            },
            data: {
              reviews: updatedReviews
            }
          }
        });
        toast({
          title: '审核拒绝',
          description: '该评价已被拒绝',
          status: 'info'
        });
        setShowRejectDialog(false);
        setRejectReason('');
        setSelectedReview(null);

        // 刷新列表
        loadReviews();
      }
    } catch (error) {
      console.error('拒绝失败:', error);
      toast({
        title: '拒绝失败',
        description: error.message || '请稍后重试',
        status: 'error'
      });
    }
  };

  // 刷新列表（重新执行加载）
  const loadReviews = async () => {
    setLoading(true);
    try {
      let allReviews = [];
      if (activeType === 'all' || activeType === 'property') {
        const propertyResult = await $w.cloud.callDataSource({
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
            pageSize: 50,
            pageNumber: 1
          }
        });
        if (propertyResult && propertyResult.records) {
          propertyResult.records.forEach(record => {
            if (record.reviews && record.reviews.length > 0) {
              record.reviews.forEach((review, index) => {
                allReviews.push({
                  ...review,
                  _id: `${record._id}_review_${index}`,
                  parentType: 'property',
                  parentId: record._id,
                  parentName: record.buildingName,
                  reviewIndex: index,
                  auditStatus: review.auditStatus || 'pending'
                });
              });
            }
          });
        }
      }
      if (activeType === 'all' || activeType === 'company') {
        const companyResult = await $w.cloud.callDataSource({
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
            pageSize: 50,
            pageNumber: 1
          }
        });
        if (companyResult && companyResult.records) {
          companyResult.records.forEach(record => {
            if (record.reviews && record.reviews.length > 0) {
              record.reviews.forEach((review, index) => {
                allReviews.push({
                  ...review,
                  _id: `${record._id}_review_${index}`,
                  parentType: 'company',
                  parentId: record._id,
                  parentName: record.companyName,
                  reviewIndex: index,
                  auditStatus: review.auditStatus || 'pending'
                });
              });
            }
          });
        }
      }
      if (activeType === 'all' || activeType === 'user') {
        const userResult = await $w.cloud.callDataSource({
          dataSourceName: 'credit_user',
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
        if (userResult && userResult.records) {
          userResult.records.forEach(record => {
            if (record.reviews && record.reviews.length > 0) {
              record.reviews.forEach((review, index) => {
                allReviews.push({
                  ...review,
                  _id: `${record._id}_review_${index}`,
                  parentType: 'user',
                  parentId: record._id,
                  parentName: record.name,
                  reviewIndex: index,
                  auditStatus: review.auditStatus || 'pending'
                });
              });
            }
          });
        }
      }
      allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviews(allReviews);
    } catch (error) {
      console.error('刷新失败:', error);
      toast({
        title: '刷新失败',
        description: error.message || '无法刷新数据',
        status: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // 格式化时间
  const formatTime = timestamp => {
    if (!timestamp) return '';
    const now = Date.now();
    const diff = now - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return new Date(timestamp).toLocaleDateString('zh-CN');
  };

  // 获取类型颜色
  const getTypeColor = type => {
    switch (type) {
      case 'property':
        return 'bg-blue-100 text-blue-800';
      case 'company':
        return 'bg-green-100 text-green-800';
      case 'user':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取类型名称
  const getTypeName = type => {
    switch (type) {
      case 'property':
        return '物业';
      case 'company':
        return '企业';
      case 'user':
        return '职场人';
      default:
        return '未知';
    }
  };
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>;
  }
  return <div className="space-y-4">
      {/* 拒绝对话框 */}
      {showRejectDialog && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">拒绝评价</h3>
            <p className="text-gray-600 mb-4">请填写拒绝该评价的原因：</p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" rows={4} placeholder="请输入拒绝原因..." />
            <div className="flex justify-end space-x-3 mt-4">
              <Button variant="outline" onClick={() => {
            setShowRejectDialog(false);
            setRejectReason('');
            setSelectedReview(null);
          }}>
                取消
              </Button>
              <Button variant="destructive" onClick={confirmReject}>
                确认拒绝
              </Button>
            </div>
          </div>
        </div>}

      {reviews.length === 0 ? <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无评价</h3>
          <p className="text-gray-500">当前没有待审核的评价</p>
        </div> : <div className="space-y-4">
          {reviews.map(review => <Card key={review._id} className={`hover:shadow-md transition-shadow ${review.auditStatus === 'rejected' ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getTypeColor(review.parentType)}>
                        {getTypeName(review.parentType)}
                      </Badge>
                      {review.auditStatus === 'pending' && <Badge className="bg-orange-100 text-orange-800">
                          <Clock className="w-3 h-3 mr-1" />
                          待审核
                        </Badge>}
                      {review.auditStatus === 'approved' && <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          已通过
                        </Badge>}
                      {review.auditStatus === 'rejected' && <Badge className="bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3 mr-1" />
                          已拒绝
                        </Badge>}
                    </div>
                    <CardTitle className="text-lg">评价对象：{review.parentName}</CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      {formatTime(review.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold text-gray-900">{review.averageRating.toFixed(1)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* 分维度评分 */}
                {review.ratings && <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">分维度评分：</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(review.ratings).map(([dimension, score]) => <div key={dimension} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{dimension}</span>
                          <div className="flex items-center space-x-1">
                            <Star className={`w-4 h-4 ${score >= 4 ? 'fill-yellow-400 text-yellow-400' : score >= 3 ? 'fill-orange-400 text-orange-400' : 'fill-red-400 text-red-400'}`} />
                            <span className={`font-semibold ${score >= 4 ? 'text-green-600' : score >= 3 ? 'text-orange-600' : 'text-red-600'}`}>{score}.0</span>
                          </div>
                        </div>)}
                    </div>
                  </div>}

                {/* 评价内容 */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">评价内容：</h4>
                  <p className="text-gray-800">{review.comment || '无评价内容'}</p>
                </div>

                {/* 拒绝原因 */}
                {review.auditStatus === 'rejected' && review.auditReason && <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <h4 className="text-sm font-medium text-red-700">拒绝原因：</h4>
                    </div>
                    <p className="text-gray-700 text-sm">{review.auditReason}</p>
                  </div>}

                {/* 操作按钮 */}
                {review.auditStatus === 'pending' && <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleReject(review)}>
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      拒绝
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(review)}>
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      通过
                    </Button>
                  </div>}
              </CardContent>
            </Card>)}
        </div>}
    </div>;
}