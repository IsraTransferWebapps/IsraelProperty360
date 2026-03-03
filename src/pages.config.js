import About from './pages/About';
import AdminReviewEvents from './pages/AdminReviewEvents';
import AdminReviewExperts from './pages/AdminReviewExperts';
import AdminReviewProperties from './pages/AdminReviewProperties';
import AdminSetupBlog from './pages/AdminSetupBlog';
import AdminUsers from './pages/AdminUsers';
import AdvertiseServices from './pages/AdvertiseServices';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BrokerDashboard from './pages/BrokerDashboard';
import Cities from './pages/Cities';
import City from './pages/City';
import Contact from './pages/Contact';
import CreateEvent from './pages/CreateEvent';
import Disclaimer from './pages/Disclaimer';
import Events from './pages/Events';
import Expert from './pages/Expert';
import Experts from './pages/Experts';
import Favorites from './pages/Favorites';
import GetStarted from './pages/GetStarted';
import Home from './pages/Home';
import ListProperty from './pages/ListProperty';
import Magazine from './pages/Magazine';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Properties from './pages/Properties';
import Property from './pages/Property';
import PropertyAlerts from './pages/PropertyAlerts';
import Register from './pages/Register';
import RegisterExpert from './pages/RegisterExpert';
import TermsAndConditions from './pages/TermsAndConditions';
import VisitorDashboard from './pages/VisitorDashboard';
import Wiki from './pages/Wiki';
import WikiTopic from './pages/WikiTopic';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "AdminReviewEvents": AdminReviewEvents,
    "AdminReviewExperts": AdminReviewExperts,
    "AdminReviewProperties": AdminReviewProperties,
    "AdminSetupBlog": AdminSetupBlog,
    "AdminUsers": AdminUsers,
    "AdvertiseServices": AdvertiseServices,
    "Blog": Blog,
    "BlogPost": BlogPost,
    "BrokerDashboard": BrokerDashboard,
    "Cities": Cities,
    "City": City,
    "Contact": Contact,
    "CreateEvent": CreateEvent,
    "Disclaimer": Disclaimer,
    "Events": Events,
    "Expert": Expert,
    "Experts": Experts,
    "Favorites": Favorites,
    "GetStarted": GetStarted,
    "Home": Home,
    "ListProperty": ListProperty,
    "Magazine": Magazine,
    "PrivacyPolicy": PrivacyPolicy,
    "Properties": Properties,
    "Property": Property,
    "PropertyAlerts": PropertyAlerts,
    "Register": Register,
    "RegisterExpert": RegisterExpert,
    "TermsAndConditions": TermsAndConditions,
    "VisitorDashboard": VisitorDashboard,
    "Wiki": Wiki,
    "WikiTopic": WikiTopic,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};