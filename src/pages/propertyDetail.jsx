// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { useToast, Button } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft, Heart, MapPin, Phone, Mail, Calendar, Ruler, DollarSign, Building2, Share2, ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function PropertyDetail(props) {
  const {
    toast
  } = useToast();
  const {
    navigateBack
  } = props.$w.utils;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const propertyId = props.$w.page.dataset.params?.id || '1';
  const property = {
    id: 1,
    name: '科技园创新中心A座',
    type: '办公楼',
    address: '深圳市南山区科技园南区深南大道9999号',
    area: '2000㎡',
    price: '4.5',
    unit: '元/㎡/天',
    floor: '15-18层',
    orientation: '南北通透',
    completion: '2020年',
    decoration: '精装修',
    description: '位于深圳科技园核心地段，毗邻地铁1号线、9号线，交通便利。物业配备中央空调、高速电梯、智能安防系统等现代化设施，适合科技公司、研发企业等办公使用。周边配套完善，餐饮、银行、咖啡厅等一应俱全。',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800'],
    features: ['地铁上盖，零距离交通', '24小时智能安保系统', '高速电梯（8部）', '中央空调独立控制', '专业物业管理', '充足的停车位'],
    tags: ['地铁上盖', '精装修', '带家具', '南北通透'],
    match: 95,
    contact: {
      name: '张经理',
      phone: '13800138000',
      email: 'zhang@techpark.com'
    },
    nearby: {
      subway: ['1号线（科技园站）', '9号线（深大南站）'],
      bus: ['科技园总站', '深大北门'],
      shopping: ['海岸城购物中心', '万象天地'],
      bank: ['中国银行', '工商银行', '建设银行']
    }
  };
  const handleBack = () => {
    navigateBack();
  };
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? '已取消收藏' : '已添加到收藏'
    });
  };
  const handleShare = () => {
    toast({
      title: '分享链接已复制'
    });
  };
  const handleContact = () => {
    toast({
      title: '正在拨打...',
      description: property.contact.phone
    });
  };
  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % property.images.length);
  };
  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + property.images.length) % property.images.length);
  };
  return <div className="min-h-screen bg-[#FAF8F5]">
      {/* 顶部导航栏 */}
      <div className="bg-[#1B365D] text-white py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold" style={{
            fontFamily: 'Playfair Display, serif'
          }}>
              物业详情
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleShare} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button onClick={toggleFavorite} className={`p-2 rounded-lg transition-colors ${isFavorite ? 'bg-red-500' : 'hover:bg-white/10'}`}>
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主内容区 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 图片轮播 */}
            <div className="relative bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-96">
                <img src={property.images[currentImageIndex]} alt={property.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-[#C9A961] text-white px-4 py-2 rounded-lg font-semibold">
                  匹配度 {property.match}%
                </div>
                
                {/* 导航按钮 */}
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors">
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors">
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>

                {/* 图片指示器 */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {property.images.map((_, idx) => <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-3 h-3 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`} />)}
                </div>
              </div>
            </div>

            {/* 物业信息卡片 */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-[#1B365D] mb-4" style={{
              fontFamily: 'Playfair Display, serif'
            }}>
                {property.name}
              </h2>
              
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin className="w-5 h-5 text-[#D47A5C]" />
                <span>{property.address}</span>
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-3 mb-6">
                {property.tags.map((tag, idx) => <span key={idx} className="px-4 py-2 bg-[#FAF8F5] text-[#2D3748] rounded-full text-sm font-medium">
                    {tag}
                  </span>)}
              </div>

              {/* 价格和面积 */}
              <div className="flex items-center gap-8 mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#D47A5C]">{property.price}</span>
                  <span className="text-lg text-gray-600">{property.unit}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Ruler className="w-5 h-5" />
                  <span className="text-lg font-medium">{property.area}</span>
                </div>
              </div>

              {/* 标签页导航 */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-8">
                  {[{
                  id: 'overview',
                  label: '概览'
                }, {
                  id: 'features',
                  label: '设施'
                }, {
                  id: 'location',
                  label: '位置'
                }, {
                  id: 'nearby',
                  label: '周边'
                }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`pb-4 font-medium transition-colors ${activeTab === tab.id ? 'text-[#1B365D] border-b-2 border-[#C9A961]' : 'text-gray-500 hover:text-gray-700'}`}>
                      {tab.label}
                    </button>)}
                </div>
              </div>

              {/* 标签页内容 */}
              <div className="space-y-6">
                {activeTab === 'overview' && <div>
                    <h3 className="font-semibold text-[#1B365D] mb-4">物业描述</h3>
                    <p className="text-[#2D3748] leading-relaxed">{property.description}</p>
                    
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[{
                    label: '楼层',
                    value: property.floor
                  }, {
                    label: '朝向',
                    value: property.orientation
                  }, {
                    label: '建成年份',
                    value: property.completion
                  }, {
                    label: '装修情况',
                    value: property.decoration
                  }].map((item, idx) => <div key={idx} className="bg-[#FAF8F5] rounded-lg p-4">
                          <div className="text-gray-500 text-sm mb-1">{item.label}</div>
                          <div className="text-[#1B365D] font-semibold">{item.value}</div>
                        </div>)}
                    </div>
                  </div>}

                {activeTab === 'features' && <div>
                    <h3 className="font-semibold text-[#1B365D] mb-4">物业设施</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.features.map((feature, idx) => <div key={idx} className="flex items-center gap-3 bg-[#FAF8F5] rounded-lg p-4">
                          <div className="w-2 h-2 bg-[#C9A961] rounded-full" />
                          <span className="text-[#2D3748]">{feature}</span>
                        </div>)}
                    </div>
                  </div>}

                {activeTab === 'location' && <div>
                    <h3 className="font-semibold text-[#1B365D] mb-4">位置信息</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-[#FAF8F5] rounded-lg p-4">
                        <MapPin className="w-5 h-5 text-[#D47A5C]" />
                        <span className="text-[#2D3748]">{property.address}</span>
                      </div>
                      <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">地图位置（调用LBS服务）</span>
                      </div>
                    </div>
                  </div>}

                {activeTab === 'nearby' && <div>
                    <h3 className="font-semibold text-[#1B365D] mb-4">周边配套</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-[#2D3748] mb-3 flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          地铁站点
                        </h4>
                        <div className="space-y-2">
                          {property.nearby.subway.map((line, idx) => <div key={idx} className="text-[#2D3748]">• {line}</div>)}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-[#2D3748] mb-3 flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          公交站点
                        </h4>
                        <div className="space-y-2">
                          {property.nearby.bus.map((station, idx) => <div key={idx} className="text-[#2D3748]">• {station}</div>)}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-[#2D3748] mb-3 flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          购物中心
                        </h4>
                        <div className="space-y-2">
                          {property.nearby.shopping.map((shop, idx) => <div key={idx} className="text-[#2D3748]">• {shop}</div>)}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-[#2D3748] mb-3 flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          银行网点
                        </h4>
                        <div className="space-y-2">
                          {property.nearby.bank.map((bank, idx) => <div key={idx} className="text-[#2D3748]">• {bank}</div>)}
                        </div>
                      </div>
                    </div>
                  </div>}
              </div>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 联系信息卡片 */}
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
              <h3 className="font-bold text-lg text-[#1B365D] mb-4">联系物业方</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#FAF8F5] rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-[#D47A5C]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">联系电话</div>
                    <div className="font-semibold text-[#1B365D]">{property.contact.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#FAF8F5] rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#D47A5C]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">电子邮箱</div>
                    <div className="font-semibold text-[#1B365D]">{property.contact.email}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button onClick={handleContact} className="w-full bg-[#D47A5C] hover:bg-[#C96B4D] text-white py-3">
                  <Phone className="w-4 h-4 mr-2" />
                  立即联系
                </Button>
                <Button className="w-full bg-[#1B365D] hover:bg-[#2D4A6D] text-white py-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  预约看房
                </Button>
              </div>
            </div>

            {/* 快速信息卡片 */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-bold text-lg text-[#1B365D] mb-4">快速信息</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-[#D47A5C]" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">月租预算</div>
                    <div className="font-semibold text-[#1B365D]">
                      约 {(parseFloat(property.price) * 30 * 2000).toLocaleString()} 元/月
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#D47A5C]" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">可签约时间</div>
                    <div className="font-semibold text-[#1B365D]">随时可签约</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-[#D47A5C]" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">物业类型</div>
                    <div className="font-semibold text-[#1B365D]">{property.type}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}