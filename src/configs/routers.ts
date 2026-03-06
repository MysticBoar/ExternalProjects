import PROPERTYHOME from '../pages/propertyHome.jsx';
import REQUIREMENTPUBLISH from '../pages/requirementPublish.jsx';
import PROPERTYDETAIL from '../pages/propertyDetail.jsx';
import SUPPLYPUBLISH from '../pages/supplyPublish.jsx';
import MATCHRESULTS from '../pages/matchResults.jsx';
import ORDERMANAGEMENT from '../pages/orderManagement.jsx';
import HOME from '../pages/home.jsx';
import PROPERTYCERTIFICATION from '../pages/propertyCertification.jsx';
import COMPANYCERTIFICATION from '../pages/companyCertification.jsx';
import USERCERTIFICATION from '../pages/userCertification.jsx';
import CREDITPROFILE from '../pages/creditProfile.jsx';
import CERTIFICATIONCENTER from '../pages/certificationCenter.jsx';
import ADMINDASHBOARD from '../pages/adminDashboard.jsx';
export const routers = [{
  id: "propertyHome",
  component: PROPERTYHOME
}, {
  id: "requirementPublish",
  component: REQUIREMENTPUBLISH
}, {
  id: "propertyDetail",
  component: PROPERTYDETAIL
}, {
  id: "supplyPublish",
  component: SUPPLYPUBLISH
}, {
  id: "matchResults",
  component: MATCHRESULTS
}, {
  id: "orderManagement",
  component: ORDERMANAGEMENT
}, {
  id: "home",
  component: HOME
}, {
  id: "propertyCertification",
  component: PROPERTYCERTIFICATION
}, {
  id: "companyCertification",
  component: COMPANYCERTIFICATION
}, {
  id: "userCertification",
  component: USERCERTIFICATION
}, {
  id: "creditProfile",
  component: CREDITPROFILE
}, {
  id: "certificationCenter",
  component: CERTIFICATIONCENTER
}, {
  id: "adminDashboard",
  component: ADMINDASHBOARD
}]