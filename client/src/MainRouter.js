import React, { useContext, Suspense, lazy } from 'react';
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router
} from 'react-router-dom';
import { AuthContext } from './context/auth/AuthContext.js';
import Loader from './components/UniversalLoader/Loader.js';
import LandingPage from './pages/LandingPage/LandingPage.js';
import Auth from './pages/Auth/Auth.js';
import Post from './pages/Post/Post.js';
import ChangePassword from './pages/ChangePassword/ChangePassword.jsx';
// Lazy-loaded components
const NewPost = lazy(() => import('./pages/NewPost/NewPost.js'));
const EditPost = lazy(() => import('./pages/EditPost/EditPost.js'));
const Home = lazy(() => import('./pages/Home/Home.js'));
const UserProfile = lazy(() => import('./pages/UserProfile/UserProfile.js'));
const EditUserProfile = lazy(() => import('./pages/EditUserProfile/EditUserProfile.js'));
const Notifications = lazy(() => import('./pages/Notifications/Notifications.js'));
const Tag = lazy(() => import('./pages/Tag/Tag.js'));
const SearchResults = lazy(() => import('./pages/SearchResults/SearchResults.js'));
const ReadingList = lazy(() => import('./pages/ReadingList/ReadingList.js'));
const QuizHome = lazy(() => import('./pages/QuizPage/QuizHome.jsx'));
const QuestionPage = lazy(() => import('./pages/QuizPage/QuestionPage.jsx'));
const QuizResults = lazy(() => import('./pages/QuizPage/QuizResults.jsx'));

const Footer = lazy(() => import('./components/Footer/Footer.js'));
const MainNavigation = lazy(() => import('./components/MainNavigation/MainNavigation.js'));
const Tags = lazy(() => import('./components/Tags/Tags.js'));

// Protected route for logged-in users
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? <Component {...props} /> : <Redirect to="/auth" />
      }
    />
  );
};

// Guest-only route (redirects logged-in users to /home)
const GuestOnlyRoute = ({ render, ...rest }) => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(props) =>
        !isLoggedIn ? render(props) : <Redirect to="/home" />
      }
    />
  );
};

const MainRouter = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <MainNavigation />
        <Switch>
          {/* Common routes */}
          <Route path="/" exact component={LandingPage} />
          <Route path="/tags" exact component={Tags} />
          <Route path="/tags/:tagName" exact component={Tag} />
          <Route path="/search" exact component={SearchResults} />
          <Route path="/users/:userId" exact component={UserProfile} />
          <Route path="/posts/:postId" exact component={Post} />

          {/* Protected routes */}
          <ProtectedRoute path="/home" exact component={Home} />
          <ProtectedRoute path="/:userId/change-password" exact component={ChangePassword} />
          <ProtectedRoute path="/users/:userId/edit" exact component={EditUserProfile} />
          <ProtectedRoute path="/users/:userId/readinglist" exact component={ReadingList} />
          <ProtectedRoute path="/users/:userId/notifications" exact component={Notifications} />
          <ProtectedRoute path="/posts/new" exact component={NewPost} />
          <ProtectedRoute path="/posts/:titleURL/:postId/edit" exact component={EditPost} />
          <ProtectedRoute path="/quiz" exact component={QuizHome} />
          <ProtectedRoute path="/quiz/:category" exact component={QuestionPage} />
          <ProtectedRoute path="/results" exact component={QuizResults} />

          {/* Guest-only routes */}
          <GuestOnlyRoute
            path="/auth"
            exact
            render={() => <Auth newUser={false} />}
          />
          <GuestOnlyRoute
            path="/auth/new-user"
            exact
            render={() => <Auth newUser={true} />}
          />

          {/* Catch-all fallback route */}
          <Route path="*">
            <Redirect to={isLoggedIn ? "/home" : "/auth"} />
          </Route>
        </Switch>
        <Footer />
      </Suspense>
    </Router>
  );
};

export default MainRouter;
